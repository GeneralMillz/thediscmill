## 2026-05-14 - Added accessible labels and tooltips to Course Detail action buttons
**Learning:** Icon-only buttons (like Heart and Share) in the Course Detail page were lacking accessible names and hover tooltips, making their purpose ambiguous for screen readers and less intuitive for mouse users.
**Action:** Always include `aria-label` (for screen readers) and `title` (for visual hover tooltips) on icon-only action buttons.
