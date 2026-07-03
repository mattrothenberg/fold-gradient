// The "copy prompt" payload. Built from the real source files via Vite ?raw
// imports, so the prompt can never drift out of sync with the shader.
import foldGradientSource from './FoldGradient.tsx?raw'
import shaderSource from './foldGradientShader.ts?raw'

export interface PromptConfig {
  colors: string[]
  bgColor: string
  shadowColor: string
  softness: number
  saturation: number
  rotation: number
  zoom: number
  ribbon: number
  ribbonWidth: number
}

const r2 = (n: number) => Math.round(n * 100) / 100

// Renders the current dial state as JSX props so the copied snippet
// reproduces exactly what's on screen.
const usageSnippet = (c: PromptConfig) => `<FoldGradient
  style={{ position: 'fixed', inset: 0 }}
  colors={[${c.colors.map((h) => `'${h}'`).join(', ')}]}
  bgColor="${c.bgColor}"
  shadowColor="${c.shadowColor}"
  softness={${r2(c.softness)}}
  saturation={${r2(c.saturation)}}
  rotation={${r2(c.rotation)}}
  zoom={${r2(c.zoom)}}
  ribbon={${r2(c.ribbon)}}
  ribbonWidth={${r2(c.ribbonWidth)}}
/>`

export const buildPrompt = (config: PromptConfig) => `Add an animated shader background component to my React project.

It's a custom Paper Shader (built on @paper-design/shaders-react's ShaderMount): domain-warped sheets of light, in the style of the Raycast wallpapers.

1. Install the runtime:

pnpm add @paper-design/shaders-react

2. Create \`src/foldGradientShader.ts\` with exactly this content:

\`\`\`ts
${shaderSource.trim()}
\`\`\`

3. Create \`src/FoldGradient.tsx\` with exactly this content:

\`\`\`tsx
${foldGradientSource.trim()}
\`\`\`

4. Use it as a full-bleed background (or size it however you like — it fills its container). These prop values are the exact look I configured on the demo site — use them as-is:

\`\`\`tsx
${usageSnippet(config)}
\`\`\`

Do not modify the shader source — paste it verbatim. TypeScript + React 18+.`
