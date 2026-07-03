import React, { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

interface CodePanelProps {
  colors: string[]
  colorBack: string
  shadowColor: string
  softness: number
  saturation: number
  rotation: number
  zoom: number
  ribbon: number
  ribbonWidth: number
}

// live-updating, syntax-highlighted snippet of the component API
export default function CodePanel({ colors, colorBack, shadowColor, softness, saturation, rotation, zoom, ribbon, ribbonWidth }: CodePanelProps) {
  const code = [
    `<RaycastFlow`,
    `  colors={[${colors.map((c) => `'${c}'`).join(', ')}]}`,
    `  bgColor="${colorBack}"`,
    `  shadowColor="${shadowColor}"`,
    `  softness={${(+softness).toFixed(2)}}`,
    `  saturation={${(+saturation).toFixed(2)}}`,
    `  rotation={${Math.round(rotation)}}`,
    `  zoom={${(+zoom).toFixed(1)}}`,
    ...(ribbon > 0 ? [`  ribbon={${(+ribbon).toFixed(2)}}`, `  ribbonWidth={${(+ribbonWidth).toFixed(2)}}`] : []),
    `/>`,
  ].join('\n')

  const [html, setHtml] = useState('')
  useEffect(() => {
    let alive = true
    codeToHtml(code, { lang: 'tsx', theme: 'vitesse-dark' }).then((h) => alive && setHtml(h))
    return () => { alive = false }
  }, [code])

  return (
    <div
      style={{
        position: 'fixed', left: 16, bottom: 16, zIndex: 10,
        fontSize: 11.5, lineHeight: 1.5, borderRadius: 10, overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
