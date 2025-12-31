# Skewed (monorepo)

This repository contains the next-generation Skewed implementation: a React-first SVG 3D scene renderer with a custom React reconciler.

## Packages

- `packages/core` — core engine (math, camera, lighting, shapes, SVG renderer)
- `packages/react` — React renderer + React components (custom reconciler) + `<Html>` via SVG `<foreignObject>`

## Apps

- `apps/workbench` — demo app recreating the legacy workbench scenes using the new React API
- `apps/storybook` — Storybook stories for all components and representative scenes

## Legacy

The previous repo state is preserved under `old/`.


