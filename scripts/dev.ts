import { spawn } from "node:child_process"
import { readdir, stat } from "node:fs/promises"

const root = new URL("../", import.meta.url)
const source = new URL("../src/", import.meta.url)
const generator = new URL("./generate.ts", import.meta.url)
const utilities = new URL("./utils/", import.meta.url)

let running = false
let queued = false
let scanning = false
let snapshot = await sourceSnapshot()

function generate() {
	if (running) {
		queued = true
		return
	}

	running = true
	const child = spawn(
		process.execPath,
		["--import", "tsx", "scripts/generate.ts"],
		{
			cwd: root,
			stdio: "inherit",
		},
	)
	child.once("exit", () => {
		running = false
		if (queued) {
			queued = false
			generate()
		}
	})
}

async function detectChanges() {
	if (scanning) return
	scanning = true
	try {
		const next = await sourceSnapshot()
		if (next !== snapshot) {
			snapshot = next
			generate()
		}
	} catch (error) {
		console.error("Unable to scan theme sources:", error)
	} finally {
		scanning = false
	}
}

async function sourceSnapshot() {
	const files = [
		...(await collectTypeScriptFiles(source)),
		...(await collectTypeScriptFiles(utilities)),
		generator,
	]
	const entries = await Promise.all(
		files.map(async (file) => `${file.href}:${(await stat(file)).mtimeMs}`),
	)
	return entries.sort().join("\n")
}

async function collectTypeScriptFiles(directory: URL): Promise<URL[]> {
	const files: URL[] = []
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const url = new URL(entry.name, directory)
		if (entry.isDirectory()) {
			files.push(
				...(await collectTypeScriptFiles(new URL(`${entry.name}/`, directory))),
			)
		} else if (entry.isFile() && entry.name.endsWith(".ts")) files.push(url)
	}
	return files
}

console.log(
	"Watching src/, scripts/utils/, and scripts/generate.ts for theme changes. Press Ctrl-C to stop.",
)
generate()
setInterval(detectChanges, 250)
