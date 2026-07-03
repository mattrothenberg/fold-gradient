// The "copy prompt" payload. Built from the real source files via Vite ?raw
// imports, so the prompt can never drift out of sync with the shader.
import foldGradientSource from './FoldGradient.tsx?raw'
import shaderSource from './foldGradientShader.ts?raw'

export const buildPrompt = () => `Add an animated shader background component to my React project.

It's a custom Paper Shader (built on @paper-design/shaders-react's ShaderMount): domain-warped sheets of light, in the style of the Raycast wallpapers.

1. Install the runtime:

npm install @paper-design/shaders-react

2. Create \`src/foldGradientShader.ts\` with exactly this content:

\`\`\`ts
${shaderSource.trim()}
\`\`\`

3. Create \`src/FoldGradient.tsx\` with exactly this content:

\`\`\`tsx
${foldGradientSource.trim()}
\`\`\`

4. Use it as a full-bleed background (or size it however you like — it fills its container):

\`\`\`tsx
<FoldGradient
  style={{ position: 'fixed', inset: 0 }}
  colors={['#700000', '#008cff', '#75daff', '#ff0026', '#ff3626']}
  bgColor="#121212"
  shadowColor="#0a1c2a"
  rotation={52}
  zoom={9}
/>
\`\`\`

Do not modify the shader source — paste it verbatim. TypeScript + React 18+.`
