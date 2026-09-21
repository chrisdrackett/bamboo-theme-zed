import type { SyntaxPalette } from "../../scripts/utils/types.ts"

const black = "#4A4848"
const lightBlack = "#989898"
const deepBlack = "#000000"

const yellow = "#8a8300"
const yellowBackground = "#FFFED7"

const green = "#53770F"
const greenBackground = "#EBFDD7"

const blue2 = "#1ca1c7"
const blue = "#006891"
const blueBackground = "#D7F2FF"

const red = "#903f31"
const redBackground = "#FFE2DC"

const purple = "#68417f"
const purpleBackground = "#EFDFFA"

const grey = "#a0a0a0"
const greyBackground = "#00000008"

export const syntax = [
	{
		keys: ["comment", "string.doc"],
		color: yellow,
		background_color: yellowBackground,
	},
	{
		keys: ["string", "text.literal", "string.escape"],
		color: green,
		background_color: greenBackground,
	},
	{
		keys: [
			"function",
			"function.method",
			"type.class.definition",
			"function.definition",
			"function.special.definition",
		],
		color: blue,
		background_color: blueBackground,
	},
	{
		keys: ["variable", "property"],
		color: black,
	},
	{
		keys: [
			"keyword",
			"punctuation",
			"operator",
			"keyword.declaration",
			"keyword.import",
			"keyword.control",
		],
		color: lightBlack,
	},
	{
		keys: ["number", "boolean", "constant.builtin", "type.unit"],
		color: purple,
		background_color: purpleBackground,
	},
	{
		keys: ["type"],
		color: blue2,
	},
	{
		keys: ["hint"],
		color: grey,
		background_color: greyBackground,
	},
	{
		keys: ["predictive"],
		font_style: "italic",
	},
	// Markdown
	{
		keys: ["title"],
		color: deepBlack,
		font_weight: 700,
	},
	{
		keys: ["emphasis"],
		font_style: "italic",
	},
	{
		keys: ["emphasis.strong"],
		color: deepBlack,
		font_weight: 700,
	},

	// Diff
	{
		keys: ["diff.plus"],
		color: green,
		background_color: greenBackground,
	},
	{
		keys: ["diff.minus"],
		color: red,
		background_color: redBackground,
	},
] satisfies SyntaxPalette
