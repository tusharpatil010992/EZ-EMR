# theme-rules.md — Minimal EMR UI Theme Rules (AI + Design)

## 1. Core Rule

Use **one consistent design system** across entire app.
No module-specific styling or themes.

---

## 2. Colors

### Primary (Actions)

- blue-600 (default primary)
- blue-700 (hover)
  Used for: buttons, links, active states

---

### Secondary (Support)

- emerald-500
  Used for: success, tags, positive indicators

---

### Neutral (Base UI)

- gray-50 → background
- white → cards
- gray-200 → borders
- gray-900 → main text

---

### Status Colors

- green → success
- yellow → warning
- red → error
- blue → info

---

## 3. Layout Rules

- AppShell (Sidebar + Topbar + Content)
- All pages inside PageContainer
- No free-form layouts

---

## 4. Typography

- System font / Inter
- Single scale (no custom sizes)
- Hierarchy only via H1/H2/H3/body

---

## 5. Spacing

Use only Tailwind spacing:

- 4, 8, 12, 16, 24, 32px scale
  No custom spacing.

---

## 6. Components Rule

Use shared UI only:

- Button
- Input
- Table
- Card
- Modal
- Badge

No duplicate components per module.

---

## 7. Behavior Rules

- No heavy animations
- No custom UI frameworks
- Keep UI fast and minimal

---

## 8. Walk-in Rule

Walk-in is NOT separate system:

- is_walkin flag only
- same appointment flow

---

## 9. Strict Rules

DO NOT:

- introduce new color systems
- override theme per module
- create duplicate UI components
- use inline styles for design

---

## 10. Golden Rule

> Consistency > customization
> Simplicity > complexity
