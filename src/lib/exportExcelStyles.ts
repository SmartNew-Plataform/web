export const formatTableTopStyle = `{
    "text_wrap": true,
       "bold": true,
       "text_wrap": true,
       "valign":"center",
       "align":"center",
       "bg_color": "#e2e8f0",
       "font_color": "#64748b"
}`

export const formatHeaderStyle = `
"bold":1,
"align":"center",
"font_size": 13
`

export function setAlternateRowColors(index: number): unknown {
  return index % 2 === 0
    ? { format: { bottom: 4, left: 4, right: 4 } }
    : { format: { bottom: 4, left: 4, right: 4, bg_color: '#F1F5F9' } }
}
