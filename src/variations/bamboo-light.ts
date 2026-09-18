import { syntax } from "../syntax/light.ts"
import { terminal } from "../terminal/dark.ts"
import { ui } from "../ui/light.ts"

import type { ThemeDefinition } from "../../scripts/utils/types.ts"

export default {
	name: "Bamboo Paper Light",
	appearance: "light",
	ui,
	syntax,
	terminal,
} satisfies ThemeDefinition
