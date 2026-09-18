import type { SyntaxKey } from "./syntax-keys.ts"
import type { UIColors } from "./ui-colors.ts"

export interface PlayerStyle {
	cursor: string
	background: string
	selection: string
}

export interface UIPalette extends UIColors {
	accents?: { color: string }[]
	"background.appearance"?: "opaque" | "transparent" | "blurred" | null
	players?: PlayerStyle[]
}

export interface SyntaxGroup {
	keys: readonly SyntaxKey[]
	color?: string
	background_color?: string
	font_style?: "normal" | "italic" | "oblique" | null
	font_weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | null
}

export type SyntaxPalette = readonly SyntaxGroup[]

export type ANSIColor =
	| "black"
	| "red"
	| "green"
	| "yellow"
	| "blue"
	| "magenta"
	| "cyan"
	| "white"

export type ANSIShades = [bright: string, normal: string, dim: string]

export interface TerminalPalette {
	background: string
	foreground: string
	brightForeground: string
	dimForeground: string
	ansi: Record<ANSIColor, ANSIShades>
}

export interface ThemeDefinition {
	name: string
	appearance: "light" | "dark"
	ui: UIPalette
	syntax: SyntaxPalette
	terminal: TerminalPalette
}
