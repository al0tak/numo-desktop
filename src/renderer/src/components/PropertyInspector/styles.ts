// One page of the pane — the same column of fields the rest of the sidebar
// uses, so moving between the document's pages and an element's never shifts
// anything. --pane-padding is what the navigation rows measure against.
export const PAGE = 'flex flex-col gap-3.5 p-(--pane-padding) [--pane-padding:16px]'

export const HEADING = 'text-sm font-semibold tracking-[0.02em]'

// A list of rows that each open a page. Pulled out to a gap short of the
// panel's edges — the same gap the tabs keep from the editor — so a row's hover
// reaches past the column of text while the text itself stays on the column's
// edge.
export const ROWS = 'mx-[calc(var(--gap)-var(--pane-padding))] flex flex-col'

export const ROW = 'h-(--control-height) flex-nowrap gap-2 px-[calc(var(--pane-padding)-var(--gap))] py-0'
