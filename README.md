# FoldGradient

Soft, flowing sheets of light for your next hero section. A custom [Paper Shader](https://github.com/paper-design/shaders), distributed the simplest way possible: **you copy the source.**

**[Live demo →](https://fold-gradient.pages.dev)**

## How to use it

No npm package. On the demo site, hit **Copy Shader** — your clipboard gets a self-contained prompt with the full component and shader source. Paste it into your coding agent (Claude Code, Cursor, etc.) and it installs itself into your project.

Prefer to do it by hand? Grab the two files and one dependency:

```bash
npm install @paper-design/shaders-react
```

- [`src/FoldGradient.tsx`](src/FoldGradient.tsx) — the React component
- [`src/foldGradientShader.ts`](src/foldGradientShader.ts) — the GLSL

```tsx
<FoldGradient
  style={{ position: 'fixed', inset: 0 }}
  colors={['#700000', '#008cff', '#75daff', '#ff0026', '#ff3626']}
  bgColor="#121212"
  shadowColor="#0a1c2a"
  rotation={52}
  zoom={9}
/>
```

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `colors` | Grain palette | Up to 5 stops, darkest → hottest. Bright sheet edges reach the last stop. |
| `bgColor` | `#121212` | Colour of the dark gaps between sheets |
| `shadowColor` | `#0a1c2a` | Tint that bleeds into shadowed edges |
| `softness` | `1` | 0–2, higher is softer |
| `saturation` | `1` | 0–2, 0 is mono |
| `rotation` | `52` | Drape angle in degrees |
| `zoom` | `9` | 4–18, higher means bigger sheets |
| `ribbon` | `0` | 0–1, blends in discrete strip cuts |
| `ribbonWidth` | `1` | Strip width multiplier for ribbon mode |
| `speed` | `1` | Animation speed, 0 freezes |

## How it works

A single-pass WebGL2 fragment shader mounted on Paper's open-source `<ShaderMount />`:

- Three levels of domain-warped fbm (`fbm(p + 1.76·fbm(p + 4·fbm(p)))`), the technique popularized by [Inigo Quilez](https://iquilezles.org/articles/warp/)
- Derivative-based lighting with a directional smear for the raked-light look
- ACES tonemapping, linear-light palette blending, ordered dithering

## Running the demo locally

```bash
npm install
npm run dev
```

## Credits

- Built on [Paper Shaders](https://github.com/paper-design/shaders) by [Paper](https://paper.design) — open source and free, as of their v1 release
- Aesthetic inspired by [Raycast](https://raycast.com)'s wallpapers (this project is not affiliated with Raycast)
- Domain warping after [Inigo Quilez](https://iquilezles.org/articles/warp/)
- Dev controls by [DialKit](https://github.com/joshpuckett/dialkit)

MIT — do whatever you like with it.
