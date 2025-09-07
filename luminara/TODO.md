# Luminara — TODO / Roadmap

## 0) Bootstrap (this step)

- [x] Create repo structure.
- [x] Initialize `apps/web/` with `npm init -y`.
- [x] Choose final app name (placeholder: Luminara).

## 1) Tooling setup ✅ COMPLETE

- [x] Add TypeScript, Vite (dev server), and types.
- [x] Basic project structure with placeholder files.
- [x] Working dev server and production build.
- [x] Working unit tests with Vitest (4 tests passing).
- [ ] Add ESLint + Prettier integration.
- [ ] Add Playwright (optional) for visual/snapshot tests.
- [ ] Configure GitHub Actions CI (lint + unit + tiny render snapshots).

## 1.5) IMMEDIATE NEXT STEPS

- [ ] Test current setup in browser (animated blue background)
- [ ] Add basic text input field to UI
- [ ] Connect text input to hash function
- [ ] Display hash result on screen
- [ ] Add basic parameter sliders (symmetry, scale, etc.)

## 2) Minimal renderer (milestone M1)

- [ ] Implement WebGL2 fallback first (easiest to ship everywhere).
- [ ] Add WebGPU-capable path behind feature detection.
- [ ] Build a simple full-screen fragment shader with a time uniform and a seeded param.
- [ ] Establish a `Renderer` interface: `init`, `resize`, `update(params, t)`, `render()`.
- [ ] Render loop using `requestAnimationFrame` (continuous until tab closes).

## 3) Text → Params (M2)

- [ ] Deterministic hash of input text → seed.
- [ ] Map seed to symmetry group, palette index, angles, scales, iteration counts.
- [ ] Define param schema and serialization (JSON + schema versioning).
- [ ] Implement morphing: `currentParams → targetParams` with easing and time-based drift.

## 4) Live input pipeline (M3)

- [ ] UI text field + queue of phrases.
- [ ] Scheduler to consume new phrases every N seconds.
- [ ] Similarity filter to avoid near-duplicates; add perturbation if too close.

## 5) Capture/Export (M4)

- [ ] Snapshot stills via `canvas.toBlob()`.
- [ ] Recording via `canvas.captureStream()` + `MediaRecorder` → WebM.
- [ ] (Later) Desktop packaging with Tauri for robust capture and MIDI/OSC I/O.

## 6) Testing & Quality

- [ ] Golden-frame tests: tiny 256×256 renders of known seeds; compare pixel hash.
- [ ] Unit tests for hash/param mapping and easing/morphing.
- [ ] Lint & format precommit hook.

## 7) Performance

- [ ] Uniform buffers (WebGPU) / few uniforms (WebGL2) for params.
- [ ] Avoid pipeline recompiles on phrase change.
- [ ] Fixed-step logic, frame-time smoothing.

## 8) Future

- [ ] Audio-reactive mode via WebAudio FFT.
- [ ] MIDI/OSC input.
- [ ] Serverless text→embedding→params service (FastAPI or Cloudflare Workers) if needed.
- [ ] Palette LUT textures; theme packs.
