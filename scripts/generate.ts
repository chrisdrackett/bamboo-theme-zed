import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"

import { buildTheme } from "./utils/build-theme.ts"

function object(value: unknown): Record<string, unknown> {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		throw new TypeError("Expected a theme object")
	}
	return value as Record<string, unknown>
}

function validateColor(value: unknown, path: string) {
	if (
		value !== null &&
		(typeof value !== "string" || !/^#[0-9a-f]{8}$/.test(value))
	) {
		throw new TypeError(`Invalid theme color at ${path}`)
	}
}

function validateTheme(input: unknown) {
	const family = object(input)
	if (
		typeof family.name !== "string" ||
		typeof family.author !== "string" ||
		!Array.isArray(family.themes) ||
		!family.themes.length
	) {
		throw new TypeError("Theme family requires name, author, and themes")
	}
	for (const entry of family.themes) {
		const variant = object(entry)
		if (
			typeof variant.name !== "string" ||
			!["light", "dark"].includes(String(variant.appearance))
		) {
			throw new TypeError("Theme requires name and light/dark appearance")
		}
		for (const [key, value] of Object.entries(object(variant.style))) {
			validateStyle(key, value, `${variant.name}.${key}`)
		}
	}
}

function validateStyle(key: string, value: unknown, path: string) {
	if (key === "background.appearance") {
		if (
			value !== null &&
			!["opaque", "transparent", "blurred"].includes(String(value))
		)
			throw new TypeError(`Invalid window appearance at ${path}`)
	} else if (key === "players" || key === "accents") {
		if (!Array.isArray(value)) throw new TypeError(`Expected array at ${path}`)
		value.forEach((item, index) => {
			if (key === "accents")
				validateColor(object(item).color, `${path}.${index}.color`)
			else
				for (const [field, color] of Object.entries(object(item)))
					validateColor(color, `${path}.${index}.${field}`)
		})
	} else if (key === "syntax") {
		for (const [token, style] of Object.entries(object(value)))
			validateSyntax(style, `${path}.${token}`)
	} else validateColor(value, path)
}

function validateSyntax(style: unknown, path: string) {
	for (const [field, setting] of Object.entries(object(style))) {
		if (field === "color" || field === "background_color")
			validateColor(setting, `${path}.${field}`)
		else if (
			field === "font_style" &&
			setting !== null &&
			!["normal", "italic", "oblique"].includes(String(setting))
		)
			throw new TypeError(`Invalid font style at ${path}`)
		else if (
			field === "font_weight" &&
			setting !== null &&
			![100, 200, 300, 400, 500, 600, 700, 800, 900].includes(setting as number)
		)
			throw new TypeError(`Invalid font weight at ${path}`)
	}
}

const args = process.argv.slice(2)
if (args.length > 1 || (args.length === 1 && args[0] !== "--check")) {
	console.error("Usage: node --import tsx scripts/generate.ts [--check]")
	process.exitCode = 1
} else {
	const directory = new URL("../src/variations/", import.meta.url)
	const files = (await readdir(directory))
		.filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts"))
		.sort()
	if (!files.length) throw new Error("No theme variations found")
	// Validate every variation before writing any output.
	const outputs = await Promise.all(
		files.map(async (file) => {
			const { default: definition } = await import(
				new URL(file, directory).href
			)
			const theme = buildTheme(definition)
			validateTheme(theme)
			const generated = `${JSON.stringify(
				theme,
				(key: string, value: unknown) => {
					if (
						value === undefined ||
						(typeof value === "number" && !Number.isFinite(value))
					)
						throw new TypeError(`Invalid theme value at ${key}`)
					if (value && typeof value === "object" && !Array.isArray(value)) {
						return Object.fromEntries(
							Object.entries(value).sort(([a], [b]) =>
								a < b ? -1 : a > b ? 1 : 0,
							),
						)
					}
					return value
				},
				"\t",
			)}\n`
			return { name: file.replace(/\.ts$/, ".json"), generated }
		}),
	)
	if (args[0] !== "--check")
		await mkdir(new URL("../themes/", import.meta.url), { recursive: true })
	for (const { name, generated } of outputs) {
		const output = new URL(`../themes/${name}`, import.meta.url)
		if (args[0] === "--check") {
			let current: string | undefined
			try {
				current = await readFile(output, "utf8")
			} catch (error) {
				if (
					!(error instanceof Error) ||
					!("code" in error) ||
					error.code !== "ENOENT"
				)
					throw error
			}
			if (current !== generated) {
				console.error(
					`themes/${name} is missing or out of date. Run npm run generate.`,
				)
				process.exitCode = 1
			} else console.log(`themes/${name} is up to date.`)
		} else {
			await writeFile(output, generated)
			console.log(`Generated themes/${name}`)
		}
	}
}
