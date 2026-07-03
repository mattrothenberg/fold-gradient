import React, { useEffect, useRef } from 'react'
import { DialRoot, useDialKitController } from 'dialkit'
import FoldGradient from './FoldGradient'
import HeroCard from './HeroCard'

interface Preset {
  colors: string[]
  background: string
  shadow: string
  softness: number
  saturation: number
  rotation: number
  zoom: number
  ribbon: number
  ribbonWidth: number
}

// built-in colour schemes (restored from the original raycast-flow)
const PRESETS: Record<string, Preset> = {
  Grain: {
    colors: ['#700000', '#008cff', '#75daff', '#ff0026', '#ff3626'],
    background: '#121212', shadow: '#0a1c2a', softness: 1.0, saturation: 1.0, rotation: 52, zoom: 9, ribbon: 0, ribbonWidth: 1,
  },
  Aurora: {
    colors: ['#001914', '#00a37a', '#22e0b0', '#26c6ff', '#a8ff6a'],
    background: '#08100e', shadow: '#0a2a24', softness: 1.0, saturation: 1.08, rotation: 40, zoom: 9, ribbon: 0, ribbonWidth: 1,
  },
  Solar: {
    colors: ['#1c0a00', '#b03a00', '#ff7a12', '#ffb43a', '#fff2c0'],
    background: '#0d0906', shadow: '#2a1c0a', softness: 0.95, saturation: 1.05, rotation: -25, zoom: 10, ribbon: 0, ribbonWidth: 1,
  },
  // red-dominant, teal-in-shadow — the original Raycast wallpaper balance,
  // with discrete strip cuts over the flow
  Ribbon: {
    colors: ['#0e3038', '#c22323', '#ff4a44', '#ff9578', '#ffe8da'],
    background: '#0b0b0d', shadow: '#0a2028', softness: 0.95, saturation: 1.05, rotation: 52, zoom: 7, ribbon: 0.17, ribbonWidth: 1,
  },
  // deep ultraviolet → orchid → hot magenta highlights
  Violet: {
    colors: ['#12002e', '#5b2bd0', '#9d6bff', '#ff4fd8', '#ffd9f2'],
    background: '#0b0714', shadow: '#180e2e', softness: 1.0, saturation: 1.05, rotation: 34, zoom: 9, ribbon: 0, ribbonWidth: 1,
  },
  // midnight navy → arctic cyan → white ice
  Glacier: {
    colors: ['#001522', '#0a4d8c', '#2f9ee0', '#9fe6ff', '#eafcff'],
    background: '#050b10', shadow: '#0a2030', softness: 1.05, saturation: 0.95, rotation: -40, zoom: 10, ribbon: 0, ribbonWidth: 1,
  },
  // graphite and silver with a whisper of warm gold at the crests
  Noir: {
    colors: ['#101014', '#2e3038', '#8a8f9c', '#d8dce6', '#ffe9c2'],
    background: '#08080a', shadow: '#141418', softness: 0.9, saturation: 0.9, rotation: 60, zoom: 8, ribbon: 0, ribbonWidth: 1,
  },
}

export default function App() {
  const { values: p, setValues } = useDialKitController('FoldGradient', {
    preset: { type: 'select', options: Object.keys(PRESETS), default: 'Grain' },
    softness: [1, 0, 2],
    saturation: [1, 0, 2],
    rotation: [52, -90, 90],
    zoom: [9, 4, 18],
    ribbon: [0, 0, 1],
    ribbonWidth: [1, 0.4, 2.5],
  })

  // colours come from the selected preset (pickers hidden from the panel)
  const scheme = PRESETS[p.preset] || PRESETS.Grain

  // when the preset changes, cascade its numeric params into the dials
  const prevPreset = useRef(p.preset)
  useEffect(() => {
    if (p.preset !== prevPreset.current && PRESETS[p.preset]) {
      prevPreset.current = p.preset
      const s = PRESETS[p.preset]
      setValues({ softness: s.softness, saturation: s.saturation, rotation: s.rotation, zoom: s.zoom, ribbon: s.ribbon, ribbonWidth: s.ribbonWidth })
    }
  }, [p.preset, setValues])

  return (
    <>
      <FoldGradient
        style={{ position: 'fixed', inset: 0 }}
        colors={scheme.colors}
        bgColor={scheme.background}
        shadowColor={scheme.shadow}
        softness={p.softness}
        saturation={p.saturation}
        rotation={p.rotation}
        zoom={p.zoom}
        ribbon={p.ribbon}
        ribbonWidth={p.ribbonWidth}
      />
      <DialRoot productionEnabled defaultOpen={false} />
      <HeroCard />
    </>
  )
}
