import { SkewedStarterScene } from "./SkewedStarterScene";

export function App() {
  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-white/10 bg-zinc-950/50 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">Skewed Starter</div>
            <div className="truncate text-xs text-zinc-400">
              One of each shape, default isometric camera
            </div>
          </div>
          <div className="text-xs text-zinc-400">
            Edit{" "}
            <code className="rounded bg-white/5 px-1 py-0.5">
              src/SkewedStarterScene.tsx
            </code>
          </div>
        </div>
      </header>

      <main className="relative flex-1">
        <SkewedStarterScene />
      </main>
    </div>
  );
}


