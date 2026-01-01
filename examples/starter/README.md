# Skewed Starter (Vite + React + TS + Tailwind)

Renders one of each built-in shape (`Grid`, `Axii`, `Box`, `Sphere`, `Cylinder`, `Text`) with a default isometric camera.

## Dev

From this folder:

```bash
pnpm install
pnpm dev
```

## Notes

- By default this starter installs `skewed` from npm.

## Local development (optional)

If you’re iterating on `skewed` locally and want this starter to use your working copy:

- **Option A (recommended): `pnpm link`**

```bash
# In your local skewed repo root:
pnpm link --global

# In this starter folder:
pnpm link --global skewed
pnpm install
pnpm dev
```

- **Option B: local folder dependency**

```bash
# In this starter folder, pointing to a local clone:
pnpm add file:../path/to/local/skewed
pnpm dev
```
