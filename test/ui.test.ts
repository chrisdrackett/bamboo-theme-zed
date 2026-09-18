import assert from "node:assert/strict"
import test from "node:test"

import { buildTheme } from "../scripts/utils/build-theme.ts"
import definition from "../src/variations/bamboo-light.ts"

import type { UIPalette } from "../scripts/utils/types.ts"

// These checks run during typecheck and guard against an open-ended key type.
const sparse = {
	"editor.background": "#fff",
	"scrollbar.thumb.active_background": null,
} satisfies UIPalette

const invalidKey = {
	// @ts-expect-error Unknown UI keys must not be accepted.
	"editor.backgroun": "#fff",
} satisfies UIPalette

const invalidValue = {
	// @ts-expect-error Color values must be strings or null.
	"editor.background": 123,
} satisfies UIPalette

const invalidAppearance = {
	// @ts-expect-error Appearance is an enum, not an arbitrary string.
	"background.appearance": "glass",
} satisfies UIPalette

void invalidKey
void invalidValue
void invalidAppearance

test("sparse UI palettes omit unset colors and default collections safely", () => {
	const theme = buildTheme({ ...definition, ui: sparse }).themes[0]
	assert.ok(theme)
	assert.equal(theme.style["editor.background"], "#ffffffff")
	assert.equal(theme.style["scrollbar.thumb.active_background"], null)
	assert.equal(Object.hasOwn(theme.style, "text"), false)
	assert.equal(Object.hasOwn(theme.style, "editor.foreground"), false)
	assert.deepEqual(theme.style.players, [])
	assert.deepEqual(theme.style.accents, [])
	assert.equal(theme.style["background.appearance"], null)
	assert.doesNotThrow(() => buildTheme({ ...definition, ui: {} }))
})
