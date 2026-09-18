// Derived from https://zed.dev/schema/themes/v0.2.0.json and supplemented by
// https://github.com/zed-industries/zed/blob/main/crates/settings_content/src/theme.rs.
// Keep this independent of palettes so missing keys can be suggested by TypeScript.
// Terminal colors live in TerminalPalette; deprecated keys are intentionally omitted.
export interface UIColors {
	/** App background and blank panels or windows. */
	background?: string | null
	/** Elevated surfaces such as menus, popups, and dialogs. */
	"elevated_surface.background"?: string | null
	/** Grounded surfaces such as panels and tabs. */
	"surface.background"?: string | null
	border?: string | null
	"border.variant"?: string | null
	"border.focused"?: string | null
	"border.selected"?: string | null
	"border.transparent"?: string | null
	"border.disabled"?: string | null

	"element.background"?: string | null
	"element.hover"?: string | null
	"element.active"?: string | null
	"element.selected"?: string | null
	"element.disabled"?: string | null
	/** Background of selections within a UI element. */
	"element.selection_background"?: string | null
	"ghost_element.background"?: string | null
	"ghost_element.hover"?: string | null
	"ghost_element.active"?: string | null
	"ghost_element.selected"?: string | null
	"ghost_element.disabled"?: string | null
	"drop_target.background"?: string | null
	"drop_target.border"?: string | null

	/** Default color for most UI text. */
	text?: string | null
	"text.muted"?: string | null
	"text.placeholder"?: string | null
	"text.disabled"?: string | null
	"text.accent"?: string | null
	icon?: string | null
	"icon.muted"?: string | null
	"icon.disabled"?: string | null
	"icon.placeholder"?: string | null
	"icon.accent"?: string | null
	"link_text.hover"?: string | null
	/** Accent for breakpoints and related debugger symbols. */
	"debugger.accent"?: string | null

	"status_bar.background"?: string | null
	"title_bar.background"?: string | null
	"title_bar.inactive_background"?: string | null
	"toolbar.background"?: string | null
	"tab_bar.background"?: string | null
	"tab.inactive_background"?: string | null
	"tab.active_background"?: string | null
	"search.match_background"?: string | null
	"search.active_match_background"?: string | null

	"panel.background"?: string | null
	"panel.focused_border"?: string | null
	"panel.indent_guide"?: string | null
	"panel.indent_guide_hover"?: string | null
	"panel.indent_guide_active"?: string | null
	"panel.overlay_background"?: string | null
	"panel.overlay_hover"?: string | null
	"pane.focused_border"?: string | null
	"pane_group.border"?: string | null

	"scrollbar.thumb.background"?: string | null
	"scrollbar.thumb.hover_background"?: string | null
	/** Scrollbar thumb color while actively dragged. */
	"scrollbar.thumb.active_background"?: string | null
	"scrollbar.thumb.border"?: string | null
	"scrollbar.track.background"?: string | null
	"scrollbar.track.border"?: string | null
	"minimap.thumb.background"?: string | null
	"minimap.thumb.hover_background"?: string | null
	"minimap.thumb.active_background"?: string | null
	"minimap.thumb.border"?: string | null

	"editor.foreground"?: string | null
	/** Text color for code lens items in the editor. */
	"editor.code_lens.foreground"?: string | null
	"editor.background"?: string | null
	"editor.gutter.background"?: string | null
	"editor.subheader.background"?: string | null
	"editor.active_line.background"?: string | null
	"editor.highlighted_line.background"?: string | null
	"editor.debugger_active_line.background"?: string | null
	"editor.line_number"?: string | null
	"editor.active_line_number"?: string | null
	"editor.hover_line_number"?: string | null
	/** Marks invisible characters, such as spaces and tabs. */
	"editor.invisible"?: string | null
	"editor.wrap_guide"?: string | null
	"editor.active_wrap_guide"?: string | null
	"editor.indent_guide"?: string | null
	"editor.indent_guide_active"?: string | null
	"editor.document_highlight.read_background"?: string | null
	"editor.document_highlight.write_background"?: string | null
	/** Background for matching brackets in the cursor scope. */
	"editor.document_highlight.bracket_background"?: string | null
	"editor.diff_hunk.added.background"?: string | null
	"editor.diff_hunk.added.hollow_background"?: string | null
	"editor.diff_hunk.added.hollow_border"?: string | null
	"editor.diff_hunk.deleted.background"?: string | null
	"editor.diff_hunk.deleted.hollow_background"?: string | null
	"editor.diff_hunk.deleted.hollow_border"?: string | null

	"version_control.added"?: string | null
	"version_control.deleted"?: string | null
	"version_control.modified"?: string | null
	"version_control.renamed"?: string | null
	"version_control.conflict"?: string | null
	"version_control.ignored"?: string | null
	"version_control.word_added"?: string | null
	"version_control.word_deleted"?: string | null
	"version_control.conflict_marker.ours"?: string | null
	"version_control.conflict_marker.theirs"?: string | null

	"vim.normal.background"?: string | null
	"vim.normal.foreground"?: string | null
	"vim.insert.background"?: string | null
	"vim.insert.foreground"?: string | null
	"vim.replace.background"?: string | null
	"vim.replace.foreground"?: string | null
	"vim.visual.background"?: string | null
	"vim.visual.foreground"?: string | null
	"vim.visual_line.background"?: string | null
	"vim.visual_line.foreground"?: string | null
	"vim.visual_block.background"?: string | null
	"vim.visual_block.foreground"?: string | null
	"vim.yank.background"?: string | null
	"vim.helix_jump_label.foreground"?: string | null
	"vim.helix_normal.background"?: string | null
	"vim.helix_normal.foreground"?: string | null
	"vim.helix_select.background"?: string | null
	"vim.helix_select.foreground"?: string | null

	conflict?: string | null
	"conflict.background"?: string | null
	"conflict.border"?: string | null
	created?: string | null
	"created.background"?: string | null
	"created.border"?: string | null
	deleted?: string | null
	"deleted.background"?: string | null
	"deleted.border"?: string | null
	error?: string | null
	"error.background"?: string | null
	"error.border"?: string | null
	hidden?: string | null
	"hidden.background"?: string | null
	"hidden.border"?: string | null
	hint?: string | null
	"hint.background"?: string | null
	"hint.border"?: string | null
	ignored?: string | null
	"ignored.background"?: string | null
	"ignored.border"?: string | null
	info?: string | null
	"info.background"?: string | null
	"info.border"?: string | null
	modified?: string | null
	"modified.background"?: string | null
	"modified.border"?: string | null
	predictive?: string | null
	"predictive.background"?: string | null
	"predictive.border"?: string | null
	renamed?: string | null
	"renamed.background"?: string | null
	"renamed.border"?: string | null
	success?: string | null
	"success.background"?: string | null
	"success.border"?: string | null
	unreachable?: string | null
	"unreachable.background"?: string | null
	"unreachable.border"?: string | null
	warning?: string | null
	"warning.background"?: string | null
	"warning.border"?: string | null
}
