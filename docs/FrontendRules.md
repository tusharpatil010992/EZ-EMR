========================
FRONTEND RULES (NEXT.JS)
========================

- Feature-first architecture:
  modules/
  auth/
  patient/
  appointment/
  subscription/

- shared/ contains ONLY:
  - UI primitives (Button, Input, Modal, Table)
  - layout components
  - utilities
  - API client

- Pages must NOT contain business logic
- Pages only compose components

- Avoid duplicate components across modules

# frontend-theme-rules.md — EMR MVP UI Consistency Rules

This document defines **strict UI theme + design consistency rules** for the EMR frontend (Next.js).

Goal:

- Maintain a single design language across the app
- Avoid UI fragmentation across modules
- Ensure fast development without design decisions per screen
- Keep system scalable for future microfrontend split

---

# 1. Core Principle

> One system. One design language. One UI behavior everywhere.

No module is allowed to define its own UI style system.

---

# 2. Design System Foundation

## 2.1 Styling Approach

- Use **TailwindCSS as the ONLY styling system**
- No CSS-in-JS (unless absolutely required)
- No module-specific CSS frameworks

---

## 2.2 Theme Philosophy

We follow a:

> Neutral + Clean + Clinical UI system

Meaning:

- No flashy colors
- No decorative UI
- Focus on readability and speed

---
