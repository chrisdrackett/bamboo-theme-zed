import { alpha } from "../../scripts/utils/colors.ts"

import type { UIPalette } from "../../scripts/utils/types.ts"

const surface = "#ececed"
const background = "#dcddde"
const border = "#cfd1d2"
const focusedBorder = "#c4daf6"
const disabledBorder = "#d5d6d8"
const elementHover = "#dfe0e1"
const elementActive = "#cfd0d2"
const text = "#4A4848"
const mutedText = "#5c6166"
const placeholderText = "#a9acae"
const accentText = "#3b9ee5"
const editorBackground = "#fcfcfc"
const editorLineNumber = "#b0b0b0"
const editorInvisible = "#acafb1"
const hint = "#8ca7c2"
const hintBackground = "#EEF2F6"
const hintBorder = "#8ca7c2"

// Byte fractions preserve the source alpha channels exactly, including transparent RGB.
const transparent = alpha("#000000", 0)
const transparentBorder = alpha("#ffffff", 0)
const thumbBackground = alpha(text, 8 / 255)
const thumbHover = alpha("#bfbfbf", 120 / 255)
const thumbActive = alpha("#bdbdbd", 156 / 255)

const warningBright = "#f1ad49"
const warningForeground = "#A46A1D"
const warningBackground = "#ffeeda"
const warningBorder = "#ffe1be"
const successBright = "#85b304"
const successForeground = "#53770F"
const successBackground = "#EBFDD7"
const successBorder = "#d7e3ae"
const errorBright = "#ef7271"
const errorForeground = "#903f31"
const errorBackground = "#FFE2DC"
const errorBorder = "#ffcdca"
const infoBackground = "#deebfa"

// Non-deprecated options verified against Zed's crates/settings_content/src/theme.rs.
// Null options retain Zed's defaults and fallbacks rather than introducing new colors.
export const ui = {
	// Window, surfaces, and borders
	"background.appearance": null,
	accents: [],
	background,
	"elevated_surface.background": surface,
	"surface.background": surface,
	border,
	"border.variant": "#ececec",
	"border.focused": focusedBorder,
	"border.selected": focusedBorder,
	"border.transparent": transparent,
	"border.disabled": disabledBorder,

	// Elements and drag targets
	"element.background": surface,
	"element.hover": elementHover,
	"element.active": elementActive,
	"element.selected": elementActive,
	"element.disabled": surface,
	"element.selection_background": null,
	"ghost_element.background": transparent,
	"ghost_element.hover": elementHover,
	"ghost_element.active": elementActive,
	"ghost_element.selected": elementActive,
	"ghost_element.disabled": surface,
	"drop_target.background": alpha(mutedText, 128 / 255),
	"drop_target.border": null,

	// Text and icons
	text,
	"text.muted": mutedText,
	"text.placeholder": placeholderText,
	"text.disabled": placeholderText,
	"text.accent": accentText,
	icon: text,
	"icon.muted": mutedText,
	"icon.disabled": placeholderText,
	"icon.placeholder": mutedText,
	"icon.accent": accentText,
	"link_text.hover": accentText,
	"debugger.accent": null,

	// Bars and tabs
	"status_bar.background": background,
	"title_bar.background": background,
	"title_bar.inactive_background": surface,
	"toolbar.background": editorBackground,
	"tab_bar.background": surface,
	"tab.inactive_background": surface,
	"tab.active_background": editorBackground,

	// Search
	"search.match_background": alpha(accentText, 102 / 255),
	"search.active_match_background": alpha("#f88b36", 102 / 255),

	// Panels and panes
	"panel.background": surface,
	"panel.focused_border": accentText,
	"panel.indent_guide": null,
	"panel.indent_guide_hover": null,
	"panel.indent_guide_active": null,
	"panel.overlay_background": surface,
	"panel.overlay_hover": background,
	"pane.focused_border": focusedBorder,
	"pane_group.border": null,

	// Scrollbars and minimap
	"scrollbar.thumb.background": thumbBackground,
	"scrollbar.thumb.hover_background": thumbHover,
	"scrollbar.thumb.active_background": thumbActive,
	"scrollbar.thumb.border": transparentBorder,
	"scrollbar.track.background": transparent,
	"scrollbar.track.border": transparentBorder,
	"minimap.thumb.background": thumbBackground,
	"minimap.thumb.hover_background": thumbHover,
	"minimap.thumb.active_background": thumbActive,
	"minimap.thumb.border": transparentBorder,

	// Terminal Scrollbars
	"terminal.scrollbar.thumb.background": "#bfbdb64c",
	"terminal.scrollbar.thumb.hover_background": "#2d2f34ff",
	"terminal.scrollbar.thumb.active_background": "#2d2f34ff",
	"terminal.scrollbar.thumb.border": "#2d2f34ff",
	"terminal.scrollbar.track.background": "#000000",
	"terminal.scrollbar.track.border": "#1b1e24ff",

	// Editor
	"editor.foreground": text,
	"editor.code_lens.foreground": null,
	"editor.background": editorBackground,
	"editor.gutter.background": editorBackground,
	"editor.subheader.background": surface,
	"editor.active_line.background": alpha(surface, 54 / 255),
	"editor.highlighted_line.background": surface,
	"editor.debugger_active_line.background": null,
	"editor.line_number": "#ececec",
	"editor.active_line_number": editorLineNumber,
	"editor.hover_line_number": editorLineNumber,
	"editor.invisible": editorInvisible,
	"editor.wrap_guide": alpha(text, 13 / 255),
	"editor.active_wrap_guide": alpha(text, 26 / 255),
	"editor.indent_guide": null,
	"editor.indent_guide_active": null,
	"editor.document_highlight.read_background": alpha(accentText, 26 / 255),
	"editor.document_highlight.write_background": alpha(
		editorInvisible,
		102 / 255,
	),
	"editor.document_highlight.bracket_background": null,
	"editor.diff_hunk.added.background": null,
	"editor.diff_hunk.added.hollow_background": null,
	"editor.diff_hunk.added.hollow_border": null,
	"editor.diff_hunk.deleted.background": null,
	"editor.diff_hunk.deleted.hollow_background": null,
	"editor.diff_hunk.deleted.hollow_border": null,

	// Version control
	"version_control.added": successBright,
	"version_control.deleted": errorBright,
	"version_control.modified": warningBright,
	"version_control.renamed": accentText,
	"version_control.conflict": warningBright,
	"version_control.ignored": placeholderText,
	"version_control.word_added": null,
	"version_control.word_deleted": null,
	"version_control.conflict_marker.ours": null,
	"version_control.conflict_marker.theirs": null,

	// Vim and Helix
	"vim.normal.background": null,
	"vim.normal.foreground": null,
	"vim.insert.background": null,
	"vim.insert.foreground": null,
	"vim.replace.background": null,
	"vim.replace.foreground": null,
	"vim.visual.background": null,
	"vim.visual.foreground": null,
	"vim.visual_line.background": null,
	"vim.visual_line.foreground": null,
	"vim.visual_block.background": null,
	"vim.visual_block.foreground": null,
	"vim.yank.background": null,
	"vim.helix_jump_label.foreground": null,
	"vim.helix_normal.background": null,
	"vim.helix_normal.foreground": null,
	"vim.helix_select.background": null,
	"vim.helix_select.foreground": null,

	// Status colors
	conflict: warningForeground,
	"conflict.background": warningBackground,
	"conflict.border": warningBorder,
	created: successForeground,
	"created.background": successBackground,
	"created.border": successBorder,
	deleted: errorForeground,
	"deleted.background": errorBackground,
	"deleted.border": errorBorder,
	error: errorBright,
	"error.background": errorBackground,
	"error.border": errorBorder,
	hidden: placeholderText,
	"hidden.background": background,
	"hidden.border": disabledBorder,
	hint,
	"hint.background": hintBackground,
	"hint.border": hintBorder,
	ignored: placeholderText,
	"ignored.background": background,
	"ignored.border": border,
	info: accentText,
	"info.background": infoBackground,
	"info.border": focusedBorder,
	modified: warningForeground,
	"modified.background": warningBackground,
	"modified.border": warningBorder,
	predictive: hint,
	"predictive.background": hintBackground,
	"predictive.border": hintBorder,
	renamed: accentText,
	"renamed.background": infoBackground,
	"renamed.border": focusedBorder,
	success: successForeground,
	"success.background": successBackground,
	"success.border": successBorder,
	unreachable: mutedText,
	"unreachable.background": background,
	"unreachable.border": border,
	warning: warningForeground,
	"warning.background": warningBackground,
	"warning.border": warningBorder,

	players: [
		"#3b9ee5",
		"#55b4d3",
		"#f98d3f",
		"#a37acc",
		"#4dbf99",
		"#ef7271",
		"#f1ad49",
		"#85b304",
	].map((cursor) => ({
		cursor,
		background: cursor,
		selection: alpha(cursor, 61 / 255),
	})),
} satisfies UIPalette
