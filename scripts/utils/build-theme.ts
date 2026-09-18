import { color } from "./colors.ts"
import { isSyntaxKey } from "./syntax-keys.ts"
import { terminalStyles, token } from "./theme-helpers.ts"

import type { SyntaxGroup, SyntaxPalette, ThemeDefinition } from "./types.ts"

const defaultSyntaxFonts = new Map<
	string,
	Pick<SyntaxGroup, "font_style" | "font_weight">
>([
	["link_text", { font_style: "italic" }],
	["predictive", { font_style: "italic" }],
	["title", { font_weight: 700 }],
	["emphasis.strong", { font_weight: 700 }],
])

function normalizeColors<T extends object>(palette: T, path: string): T {
	return Object.fromEntries(
		Object.entries(palette).map(([key, value]) => {
			if (value === null) return [key, null]
			if (
				typeof value !== "string" ||
				!/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)
			) {
				throw new TypeError(`Invalid theme color at ${path}.${key}`)
			}
			return [key, color(value)]
		}),
	) as T
}

function buildSyntax(palette: SyntaxPalette, path: string) {
	const assigned = new Set<string>()
	return Object.fromEntries(
		palette.flatMap(({ keys, font_style, font_weight, ...colors }, index) => {
			const groupPath = `${path}.${index}`
			if (
				font_style !== undefined &&
				font_style !== null &&
				!["normal", "italic", "oblique"].includes(font_style)
			) {
				throw new TypeError(`Invalid font style at ${groupPath}.font_style`)
			}
			if (
				font_weight !== undefined &&
				font_weight !== null &&
				![100, 200, 300, 400, 500, 600, 700, 800, 900].includes(font_weight)
			) {
				throw new TypeError(`Invalid font weight at ${groupPath}.font_weight`)
			}
			const normalized = normalizeColors(colors, groupPath)
			return keys.map((key) => {
				if (!isSyntaxKey(key)) {
					throw new TypeError(
						`Unknown syntax key at ${path}.${index}.keys: ${key}. See scripts/utils/syntax-keys.ts for supported captures.`,
					)
				}
				if (assigned.has(key)) {
					throw new TypeError(`Duplicate syntax key at ${path}.${key}`)
				}
				assigned.add(key)
				const defaults = defaultSyntaxFonts.get(key)
				return [
					key,
					token(
						normalized,
						font_style !== undefined
							? font_style
							: (defaults?.font_style ?? null),
						font_weight !== undefined
							? font_weight
							: (defaults?.font_weight ?? null),
					),
				] as const
			})
		}),
	)
}
/**
 *
 * @param definition
 * @returns
 */
export function buildTheme(definition: ThemeDefinition) {
	const { terminal, name } = definition
	const syntax = buildSyntax(definition.syntax, `${name}.syntax`)
	const {
		players = [],
		accents = [],
		"background.appearance": appearance = null,
		...ui
	} = definition.ui

	return {
		$schema: "https://zed.dev/schema/themes/v0.2.0.json",
		name: "Bamboo Paper",
		author: "Chris Drackett",
		themes: [
			{
				name: definition.name,
				appearance: definition.appearance,
				style: {
					...normalizeColors(
						{
							...ui,
							"terminal.background": terminal.background,
							"terminal.foreground": terminal.foreground,
							"terminal.bright_foreground": terminal.brightForeground,
							"terminal.dim_foreground": terminal.dimForeground,
							"terminal.ansi.background": null,
							...terminalStyles(terminal),
						},
						name,
					),
					"background.appearance": appearance,
					accents: accents.map((accent, index) =>
						normalizeColors(accent, `${name}.accents.${index}`),
					),
					players: players.map((player, index) =>
						normalizeColors(player, `${name}.players.${index}`),
					),
					syntax,
				},
			},
		],
		isUserGenerated: true,
		description: "Bamboo Light",
	}
}
