import assert from "node:assert/strict"
import test from "node:test"

import { buildTheme } from "../scripts/utils/build-theme.ts"
import definition from "../src/variations/bamboo-light.ts"

import type { SyntaxGroup, SyntaxPalette } from "../scripts/utils/types.ts"

const invalidGroups: SyntaxGroup[] = [
	{
		keys: ["comment"],
		// @ts-expect-error Font style must be a supported keyword.
		font_style: "slanted",
	},
	{
		keys: ["comment"],
		// @ts-expect-error Font weights are numeric, not named.
		font_weight: "bold",
	},
	{
		keys: ["comment"],
		// @ts-expect-error Font weights use increments of 100.
		font_weight: 450,
	},
]

test("syntax groups apply fonts and colors to every listed key without mutation", () => {
	const syntax = [
		{
			keys: ["comment", "string.doc"],
			color: "#ABC",
			background_color: "#1234",
			font_style: "oblique",
			font_weight: 500,
		},
	] satisfies SyntaxPalette
	const original = structuredClone(syntax)
	const output = buildTheme({ ...definition, syntax }).themes[0]?.style.syntax
	assert.ok(output)
	for (const key of ["comment", "string.doc"]) {
		assert.deepEqual(output[key], {
			color: "#aabbccff",
			background_color: "#11223344",
			font_style: "oblique",
			font_weight: 500,
		})
	}
	assert.deepEqual(syntax, original)
})

test("explicit font settings override defaults and null clears them", () => {
	const syntax = buildTheme({
		...definition,
		syntax: [
			{ keys: ["title", "link_text"], font_style: "normal", font_weight: 400 },
			{
				keys: ["emphasis.strong", "predictive"],
				font_style: null,
				font_weight: null,
			},
		],
	}).themes[0]?.style.syntax
	assert.deepEqual(syntax, {
		title: { font_style: "normal", font_weight: 400 },
		link_text: { font_style: "normal", font_weight: 400 },
		"emphasis.strong": { font_style: null, font_weight: null },
		predictive: { font_style: null, font_weight: null },
	})
})

test("all supported fonts work in colorless syntax groups", () => {
	for (const font_style of ["normal", "italic", "oblique", null] as const) {
		for (const font_weight of [
			100,
			200,
			300,
			400,
			500,
			600,
			700,
			800,
			900,
			null,
		] as const) {
			const syntax = buildTheme({
				...definition,
				syntax: [{ keys: ["function"], font_style, font_weight }],
			}).themes[0]?.style.syntax
			assert.deepEqual(syntax?.function, { font_style, font_weight })
		}
	}
})

test("setting one font field preserves the other field's default", () => {
	const syntax = buildTheme({
		...definition,
		syntax: [
			{ keys: ["title"], font_style: "italic" },
			{ keys: ["link_text"], font_weight: 600 },
		],
	}).themes[0]?.style.syntax
	assert.deepEqual(syntax, {
		title: { font_style: "italic", font_weight: 700 },
		link_text: { font_style: "italic", font_weight: 600 },
	})
})

test("builder rejects invalid fonts when type checking is bypassed", () => {
	for (const group of invalidGroups) {
		assert.throws(
			() => buildTheme({ ...definition, syntax: [group] }),
			/Invalid font (style|weight) at Bamboo Paper Light\.syntax\.0\.font_(style|weight)/,
		)
	}
})
