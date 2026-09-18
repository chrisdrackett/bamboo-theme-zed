import type { ANSIColor, SyntaxGroup, TerminalPalette } from "./types.ts"

export const token = (
	colors: Pick<SyntaxGroup, "color" | "background_color">,
	font_style: SyntaxGroup["font_style"] = null,
	font_weight: SyntaxGroup["font_weight"] = null,
) => ({
	...colors,
	font_style,
	font_weight,
})

type TerminalStyles = Record<
	`terminal.ansi.${"" | "bright_" | "dim_"}${ANSIColor}`,
	string
>

export const terminalStyles = (terminal: TerminalPalette): TerminalStyles =>
	Object.fromEntries(
		Object.entries(terminal.ansi).flatMap(([name, [bright, normal, dim]]) => [
			[`terminal.ansi.${name}`, normal],
			[`terminal.ansi.bright_${name}`, bright],
			[`terminal.ansi.dim_${name}`, dim],
		]),
	) as TerminalStyles
