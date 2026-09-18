import type { TerminalPalette } from "../../scripts/utils/types.ts"

const terminalForeground = "#e6e6e6"

export const terminal = {
	background: "#21252b",
	foreground: terminalForeground,
	brightForeground: "#ffffff",
	dimForeground: "#bfbfbf",
	// ANSI entries are [bright, normal, dim]; these are independent source shades.
	ansi: {
		black: ["#4a505a", "#1d1f23", "#131417"],
		red: ["#e68a92", "#e27981", "#a6555a"],
		green: ["#a8cc8e", "#98c379", "#688f4f"],
		yellow: ["#edcf97", "#e79c7e", "#ad8f58"],
		blue: ["#8ec8f6", "#72b9f4", "#4781b3"],
		magenta: ["#d4a2e2", "#c88bda", "#84568f"],
		cyan: ["#79c4ce", "#62bac6", "#469099"],
		white: [terminalForeground, "#caccd4", "#a1a2ab"],
	},
} satisfies TerminalPalette
