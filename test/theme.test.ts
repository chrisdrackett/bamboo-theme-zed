import assert from "node:assert/strict"
import { execFileSync, spawnSync } from "node:child_process"
import { cp, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"
import { type Color, interpolate } from "culori"

import { buildTheme } from "../scripts/utils/build-theme.ts"
import { alpha, color } from "../scripts/utils/colors.ts"
import definition from "../src/variations/bamboo-light.ts"

import type { ThemeDefinition } from "../scripts/utils/types.ts"

const theme = buildTheme(definition)

const root = fileURLToPath(new URL("../", import.meta.url))
const tsx = import.meta.resolve("tsx")

test("variation is plain data and each section controls generated output", () => {
	assert.deepEqual(Object.keys(definition).sort(), [
		"appearance",
		"name",
		"syntax",
		"terminal",
		"ui",
	])
	const custom = buildTheme({
		...definition,
		name: "Custom",
		appearance: "dark",
		ui: {
			...definition.ui,
			"editor.background": "#123456ff",
			players: [],
			accents: [{ color: "#abcdefff" }],
		},
		syntax: [{ keys: ["function"], color: "#654321ff" }],
		terminal: {
			...definition.terminal,
			background: "#112233ff",
			ansi: {
				...definition.terminal.ansi,
				red: ["#110000ff", "#220000ff", "#330000ff"],
			},
		},
	}).themes[0]
	assert.ok(custom)
	assert.equal(custom.name, "Custom")
	assert.equal(custom.appearance, "dark")
	assert.equal(custom.style["editor.background"], "#123456ff")
	assert.deepEqual(custom.style.players, [])
	assert.equal(custom.style.syntax.function?.color, "#654321ff")
	assert.equal(custom.style["terminal.background"], "#112233ff")
	assert.equal(custom.style["terminal.ansi.red"], "#220000ff")
	assert.equal(custom.style["terminal.ansi.bright_red"], "#110000ff")
	assert.equal(custom.style["terminal.ansi.dim_red"], "#330000ff")
})

test("builder normalizes hex palettes without mutating input or metadata", () => {
	const input = {
		...definition,
		ui: {
			...definition.ui,
			"background.appearance": "opaque" as const,
			"editor.background": "#FAFAFA",
			"border.transparent": "#ffffff00",
			accents: [{ color: "#ABC" }],
			players: [
				{ cursor: "#123456", background: "#abcdef", selection: "#1234" },
			],
		},
		syntax: [
			{
				keys: ["function"],
				color: "#1A6382",
				background_color: "#ABC",
			},
		],
		terminal: {
			...definition.terminal,
			background: "#112233",
			foreground: "#ddeeff",
			brightForeground: "#fff",
			dimForeground: "#888",
			ansi: {
				...definition.terminal.ansi,
				red: ["#110000", "#220000", "#330000"] as [string, string, string],
			},
		},
	} satisfies ThemeDefinition
	const original = structuredClone(input)
	const light = buildTheme(input).themes[0]
	assert.ok(light)
	assert.deepEqual(input, original)
	assert.equal(light.style["background.appearance"], "opaque")
	assert.equal(light.style["editor.background"], "#fafafaff")
	assert.equal(light.style["border.transparent"], "#ffffff00")
	assert.equal(light.style["editor.code_lens.foreground"], null)
	assert.deepEqual(light.style.accents, [{ color: "#aabbccff" }])
	assert.deepEqual(light.style.players, [
		{ cursor: "#123456ff", background: "#abcdefff", selection: "#11223344" },
	])
	assert.equal(light.style.syntax.function?.color, "#1a6382ff")
	assert.equal(light.style.syntax.function?.background_color, "#aabbccff")
	assert.equal(light.style["terminal.background"], "#112233ff")
	assert.equal(light.style["terminal.foreground"], "#ddeeffff")
	assert.equal(light.style["terminal.bright_foreground"], "#ffffffff")
	assert.equal(light.style["terminal.dim_foreground"], "#888888ff")
	assert.equal(light.style["terminal.ansi.red"], "#220000ff")
	assert.equal(light.style["terminal.ansi.bright_red"], "#110000ff")
	assert.equal(light.style["terminal.ansi.dim_red"], "#330000ff")
})

test("syntax groups emit only explicitly assigned keys", () => {
	const blue = "#1a6382"
	const input = {
		...definition,
		syntax: [
			{
				keys: ["punctuation.bracket", "punctuation.delimiter", "type.unit"],
				color: blue,
			},
			{ keys: ["function"], color: "#ABC" },
			{ keys: [], color: "#ffffff" },
		] as const,
	}
	const original = structuredClone(input)
	const syntax = buildTheme(input).themes[0]?.style.syntax
	assert.ok(syntax)
	assert.deepEqual(Object.keys(syntax).sort(), [
		"function",
		"punctuation.bracket",
		"punctuation.delimiter",
		"type.unit",
	])
	for (const key of input.syntax[0].keys) {
		assert.deepEqual(syntax[key], {
			color: "#1a6382ff",
			font_style: null,
			font_weight: null,
		})
	}
	assert.equal(syntax.function?.color, "#aabbccff")
	assert.deepEqual(input, original)
	assert.deepEqual(
		buildTheme({ ...definition, syntax: [] }).themes[0]?.style.syntax,
		{},
	)
})

test("syntax groups support optional foregrounds, backgrounds, and hex8 alpha", () => {
	const input = {
		...definition,
		syntax: [
			{ keys: ["function"], color: "#ABC" },
			{ keys: ["string"], background_color: "#DEF" },
			{ keys: ["number"], color: "#1A638280", background_color: "#AABBCC00" },
			{ keys: ["boolean"], color: "#1A638280", background_color: "#DEF" },
			{ keys: ["variable"] },
		] as const,
	}
	const original = structuredClone(input)
	const syntax = buildTheme(input).themes[0]?.style.syntax
	assert.ok(syntax)
	const expected = {
		function: { color: "#aabbccff" },
		string: { background_color: "#ddeeffff" },
		number: { color: "#1a638280", background_color: "#aabbcc00" },
		boolean: { color: "#1a638280", background_color: "#ddeeffff" },
		variable: {},
	}
	for (const [key, colors] of Object.entries(expected)) {
		assert.deepEqual(syntax[key], {
			...colors,
			font_style: null,
			font_weight: null,
		})
	}
	assert.deepEqual(input, original)
})

test("syntax styling is retained even when colors are omitted", () => {
	const syntax = buildTheme({
		...definition,
		syntax: [{ keys: ["title", "emphasis.strong", "link_text", "predictive"] }],
	}).themes[0]?.style.syntax
	assert.deepEqual(syntax, {
		title: { font_style: null, font_weight: 700 },
		"emphasis.strong": { font_style: null, font_weight: 700 },
		link_text: { font_style: "italic", font_weight: null },
		predictive: { font_style: "italic", font_weight: null },
	})
})

test("syntax groups reject invalid foreground and background colors", () => {
	for (const field of ["color", "background_color"] as const) {
		assert.throws(
			() =>
				buildTheme({
					...definition,
					syntax: [{ keys: ["function"], [field]: "not-a-color" }],
				}),
			{
				message: `Invalid theme color at Bamboo Paper Light.syntax.0.${field}`,
			},
		)
	}
})

test("syntax groups reject duplicate keys within and across groups", () => {
	for (const syntax of [
		[{ keys: ["function", "function"], color: "#123456" }],
		[
			{ keys: ["function"], color: "#123456" },
			{ keys: ["function"], background_color: "#abcdef" },
		],
	] as const) {
		assert.throws(
			() => buildTheme({ ...definition, syntax }),
			/Duplicate syntax key at Bamboo Paper Light\.syntax\.function/,
		)
	}
})

test("Culori strings, objects, and derived colors serialize as hex8", () => {
	assert.equal(color("#ABC"), "#aabbccff")
	assert.equal(color({ mode: "hsl", h: 120, s: 1, l: 0.5 }), "#00ff00ff")
	assert.equal(color(interpolate(["#000", "#fff"], "rgb")(0.5)), "#808080ff")
	assert.equal(color({ mode: "rgb", r: 2, g: 0, b: 0 }), "#ff0000ff")
})

test("OKLCH literals preserve source colors and support opacity", () => {
	assert.equal(color("oklch(1 0 0)"), "#ffffffff")
	assert.equal(color("oklch(0 0 0)"), "#000000ff")
	assert.equal(color("oklch(0.673962 0.138795 244.0000)"), "#3b9ee5ff")
	assert.equal(alpha("oklch(1 0 0)", 0), "#ffffff00")
})

test("opacity replaces alpha without mutation or losing transparent RGB", () => {
	const input = { mode: "rgb", r: 1, g: 1, b: 1, alpha: 0.5 } satisfies Color
	assert.equal(alpha(input, 0), "#ffffff00")
	assert.equal(input.alpha, 0.5)
	for (let byte = 0; byte <= 255; byte++) {
		assert.equal(
			alpha("#3b9ee580", byte / 255),
			`#3b9ee5${byte.toString(16).padStart(2, "0")}`,
		)
	}
})

test("all assigned theme colors are hex8", () => {
	const light = theme.themes[0]
	assert.ok(light)
	const {
		players,
		syntax,
		accents,
		"background.appearance": appearance,
		...ui
	} = light.style
	assert.equal(appearance, null)
	assert.deepEqual(accents, [])
	for (const value of Object.values(ui)) {
		if (value !== null) assert.match(value, /^#[0-9a-f]{8}$/)
	}
	for (const player of players) {
		for (const value of Object.values(player))
			assert.match(value, /^#[0-9a-f]{8}$/)
		assert.equal(player.selection, alpha(player.cursor, 61 / 255))
	}
	for (const value of Object.values(syntax)) {
		for (const field of ["color", "background_color"] as const) {
			if (value[field] !== undefined) {
				assert.match(value[field], /^#[0-9a-f]{8}$/)
			}
		}
		assert.ok([null, "normal", "italic", "oblique"].includes(value.font_style))
		assert.ok(
			[null, 100, 200, 300, 400, 500, 600, 700, 800, 900].includes(
				value.font_weight,
			),
		)
	}
})

test("committed JSON matches the source", async () => {
	const actual = await readFile(
		new URL("../themes/bamboo-light.json", import.meta.url),
		"utf8",
	)
	assert.deepEqual(JSON.parse(actual), theme)
	function assertSorted(value: unknown) {
		if (!value || typeof value !== "object") return
		if (!Array.isArray(value)) {
			assert.deepEqual(Object.keys(value), Object.keys(value).sort())
		}
		for (const child of Object.values(value)) assertSorted(child)
	}
	assertSorted(JSON.parse(actual))
})

test("CLI generates deterministically and check detects missing/stale output without writing", async () => {
	const directory = await mkdtemp(join(tmpdir(), "bamboo-theme-"))
	try {
		for (const path of ["src", "scripts", "themes", "package.json"]) {
			await cp(join(root, path), join(directory, path), { recursive: true })
		}
		await symlink(
			join(root, "node_modules"),
			join(directory, "node_modules"),
			"dir",
		)
		const script = join(directory, "scripts/generate.ts")
		const nodeArgs = ["--import", tsx, script]
		const output = join(directory, "themes/bamboo-light.json")
		const run = (...args: string[]) =>
			spawnSync(process.execPath, [...nodeArgs, ...args], {
				cwd: tmpdir(),
				encoding: "utf8",
			})
		assert.equal(run("--check").status, 0)
		assert.equal(run("--unknown").status, 1)
		await writeFile(output, "stale\n")
		assert.equal(run("--check").status, 1)
		assert.equal(await readFile(output, "utf8"), "stale\n")
		await rm(output)
		assert.equal(run("--check").status, 1)
		execFileSync(process.execPath, nodeArgs, { cwd: tmpdir() })
		const first = await readFile(output, "utf8")
		execFileSync(process.execPath, nodeArgs, { cwd: tmpdir() })
		assert.equal(await readFile(output, "utf8"), first)
		assert.equal(run("--check").status, 0)
		const source = join(directory, "src/variations/bamboo-light.ts")
		const originalSource = await readFile(source, "utf8")
		const secondSource = join(directory, "src/variations/second.ts")
		await cp(source, secondSource)
		assert.equal(run("--check").status, 1)
		assert.equal(run().status, 0)
		assert.equal(
			await readFile(join(directory, "themes/second.json"), "utf8"),
			first,
		)
		assert.equal(run("--check").status, 0)
		for (const value of ['"#NaN0000ff"', "undefined", '"not-a-color"']) {
			await writeFile(
				source,
				originalSource
					.replace('name: "Bamboo Paper Light"', 'name: "Invalid"')
					.replace(/\bui,/, `ui: { ...ui, background: ${value} },`),
			)
			for (const args of [[], ["--check"]]) {
				const result = run(...args)
				assert.equal(result.status, 1)
				assert.match(result.stderr, /Invalid theme color at Invalid.background/)
				assert.equal(await readFile(output, "utf8"), first)
			}
		}
	} finally {
		await rm(directory, { recursive: true, force: true })
	}
})
