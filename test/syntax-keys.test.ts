import assert from "node:assert/strict"
import test from "node:test"

import { buildTheme } from "../scripts/utils/build-theme.ts"
import { isSyntaxKey, syntaxKeys } from "../scripts/utils/syntax-keys.ts"
import definition from "../src/variations/bamboo-light.ts"

import type { SyntaxPalette } from "../scripts/utils/types.ts"

const invalid: SyntaxPalette = [
	{
		// @ts-expect-error Misspelled captures must be rejected by TypeScript too.
		keys: ["string-doc"],
		color: "#fff",
	},
]

test("known syntax keys include documented and language-specific captures", () => {
	assert.equal(new Set(syntaxKeys).size, syntaxKeys.length)
	for (const key of [
		"comment.doc",
		"string.doc",
		"type.unit",
		"function.method.call",
		"property.json_key",
		"diff.plus",
		"selector",
	]) {
		assert.equal(isSyntaxKey(key), true, key)
	}
	for (const key of ["string-doc", "unit", "functoin", "@comment", ""]) {
		assert.equal(isSyntaxKey(key), false, key)
	}
})

test("builder rejects unknown syntax keys even when type checking is bypassed", () => {
	assert.throws(
		() => buildTheme({ ...definition, syntax: invalid }),
		/Unknown syntax key at Bamboo Paper Light\.syntax\.0\.keys: string-doc/,
	)
})

test("every known syntax key can be emitted by the builder", () => {
	const syntax = buildTheme({
		...definition,
		syntax: [{ keys: syntaxKeys, color: "#123456" }],
	}).themes[0]?.style.syntax
	assert.ok(syntax)
	assert.deepEqual(Object.keys(syntax), [...syntaxKeys])
	for (const style of Object.values(syntax)) {
		assert.equal(style.color, "#123456ff")
	}
})
