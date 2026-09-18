import { type Color, converter, formatHex8, type Rgb } from "culori"

const rgb = converter("rgb")

// Zed consumes sRGB hex; Culori clamps out-of-gamut channels on serialization.
export function color(input: Color | string): string {
	return formatHex8(rgb(input) as Rgb)
}

// Replace opacity rather than multiply it; leave the input object untouched.
export function alpha(input: Color | string, opacity: number): string {
	return formatHex8({ ...(rgb(input) as Rgb), alpha: opacity })
}
