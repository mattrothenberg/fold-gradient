import React, { useEffect, useState } from 'react'
import { buildPrompt } from './prompt'

const GITHUB_URL = 'https://github.com/mattrothenberg/fold-gradient' // update when the repo is pushed
const PAPER_URL = 'https://github.com/paper-design/shaders'

const css = `
  .rf-card {
    position: fixed; left: 28px; bottom: 28px; z-index: 10;
    width: min(420px, calc(100vw - 56px));
    font-family: 'Inter', system-ui, sans-serif;
    padding: 28px 28px 24px; border-radius: 24px;
    background: rgba(14,14,17,0.42);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12), 0 24px 80px rgba(0,0,0,0.5);
    backdrop-filter: blur(22px) saturate(1.15); -webkit-backdrop-filter: blur(22px) saturate(1.15);
    opacity: 0; transform: translateY(24px); filter: blur(6px);
    transition: opacity 900ms cubic-bezier(0.32,0.72,0,1),
                transform 900ms cubic-bezier(0.32,0.72,0,1),
                filter 900ms cubic-bezier(0.32,0.72,0,1);
  }
  .rf-card.rf-in { opacity: 1; transform: translateY(0); filter: blur(0); }
  .rf-eyebrow {
    display: block; margin: 0 0 10px;
    font-size: 12px; font-weight: 500; letter-spacing: 0.02em;
    color: rgba(255,255,255,0.55);
  }
  .rf-eyebrow a { color: inherit; text-decoration: none; transition: color 400ms cubic-bezier(0.32,0.72,0,1); }
  .rf-eyebrow a:hover { color: rgba(255,255,255,0.85); }
  .rf-title {
    margin: 0 0 12px; font-size: 34px; font-weight: 700;
    letter-spacing: -0.035em; color: #ffffff; line-height: 1.02;
    text-shadow: 0 2px 24px rgba(0,0,0,0.45);
  }
  .rf-sub {
    margin: 0 0 24px; font-size: 15px; line-height: 1.55; font-weight: 450;
    color: rgba(255,255,255,0.66); letter-spacing: -0.006em;
    text-shadow: 0 1px 12px rgba(0,0,0,0.4);
  }
  .rf-sub a { color: rgba(255,255,255,0.92); text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.28); transition: border-color 400ms cubic-bezier(0.32,0.72,0,1); }
  .rf-sub a:hover { border-color: rgba(255,255,255,0.7); }
  .rf-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .rf-btn {
    appearance: none; border: 0; cursor: pointer;
    font-family: inherit; font-size: 14.5px; font-weight: 550; letter-spacing: -0.006em;
    display: inline-flex; align-items: center; gap: 9px;
    border-radius: 999px; padding: 12px 22px;
    text-decoration: none;
    transition: transform 450ms cubic-bezier(0.32,0.72,0,1),
                background 450ms cubic-bezier(0.32,0.72,0,1),
                box-shadow 450ms cubic-bezier(0.32,0.72,0,1);
  }
  .rf-btn:active { transform: scale(0.97); }
  .rf-primary {
    background: #10131a; color: #ffffff;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16), 0 10px 32px rgba(0,0,0,0.5);
  }
  .rf-primary:hover { transform: translateY(-1px); background: #161a23; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.24), 0 14px 40px rgba(0,0,0,0.55); }
  .rf-primary:hover:active { transform: scale(0.97); }
  .rf-agents { display: inline-flex; align-items: center; gap: 7px; margin-right: 2px; opacity: 0.92; }
  .rf-caption {
    margin: 14px 0 0; min-height: 18px;
    font-family: 'SF Mono', ui-monospace, Menlo, monospace;
    font-size: 12px; letter-spacing: 0; line-height: 1.5;
    color: rgba(255,255,255,0.45);
    transition: color 450ms cubic-bezier(0.32,0.72,0,1);
  }
  .rf-caption.rf-copied { color: #8ec2ff; }
  .rf-ghost {
    background: rgba(18,18,20,0.55); color: rgba(255,255,255,0.92);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.14);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  }
  .rf-ghost:hover { background: rgba(28,28,32,0.65); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22); }
  @media (max-width: 768px) {
    .rf-card { left: 16px; right: 16px; bottom: 16px; width: auto; }
    .rf-title { font-size: 28px; }
  }
`

export default function HeroCard() {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const copy = async () => {
    await navigator.clipboard.writeText(buildPrompt())
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <>
      <style>{css}</style>
      <div className={`rf-card${mounted ? ' rf-in' : ''}`}>
        <span className="rf-eyebrow">
          A custom shader for{' '}
          <a href={PAPER_URL} target="_blank" rel="noreferrer" aria-label="Paper" style={{ display: 'inline-flex', verticalAlign: '-6px' }}>
            <svg height="22" viewBox="0 0 110 40" aria-hidden>
              <path d="M34.9805 30.974V9.97559H42.3299C46.6196 9.97559 49.4394 12.5254 49.4394 16.3951C49.4394 20.2648 46.6196 22.8146 42.3299 22.8146H38.4002V30.974H34.9805ZM38.4002 19.6949H42.3299C44.6098 19.6949 45.9597 18.435 45.9597 16.3951C45.9597 14.3553 44.6098 13.1254 42.3299 13.1254H38.4002V19.6949ZM49.2871 23.6245C49.2871 28.1541 52.1369 31.3039 56.2166 31.3039C58.3464 31.3039 60.2063 30.314 61.1062 28.7541V30.9739H64.376V16.245H61.1062V18.3149C60.2963 16.905 58.3464 15.915 56.2166 15.915C52.1369 15.915 49.2871 19.0648 49.2871 23.6245ZM56.8765 28.3341C54.3567 28.3341 52.5569 26.3843 52.5569 23.6245C52.5569 20.8647 54.3567 18.8848 56.8765 18.8848C59.4264 18.8848 61.2262 20.8347 61.2262 23.6245C61.2262 26.3843 59.4264 28.3341 56.8765 28.3341ZM67.0505 36.9735V16.245H70.2903V18.4948C71.1602 16.935 73.0501 15.915 75.2099 15.915C79.2896 15.915 82.1394 19.0648 82.1394 23.5945C82.1394 28.1541 79.2896 31.3039 75.2099 31.3039C73.0801 31.3039 71.1302 30.314 70.2903 28.8741V36.9735H67.0505ZM70.2003 23.5945C70.2003 26.3843 71.9701 28.3341 74.5199 28.3341C77.0698 28.3341 78.8396 26.3543 78.8396 23.5945C78.8396 20.8347 77.0698 18.8848 74.5199 18.8848C72.0001 18.8848 70.2003 20.8347 70.2003 23.5945ZM83.4049 23.6245C83.4049 28.0641 86.5247 31.3039 90.9344 31.3039C94.1331 31.3039 96.9147 29.427 97.7651 26.6233H94.4187C93.6778 27.7657 92.3991 28.4541 90.9344 28.4541C88.6245 28.4541 86.9746 26.9242 86.6747 24.4944H97.7139C97.7739 24.2244 97.8038 23.8645 97.8038 23.3545C97.8038 18.7648 95.134 15.915 90.8744 15.915C86.5547 15.915 83.4049 19.1248 83.4049 23.6245ZM94.6241 22.0946H86.7947C87.3046 20.0547 88.8345 18.7348 90.8744 18.7348C93.0042 18.7348 94.3541 19.9947 94.6241 22.0946ZM100.068 16.245V30.9739H103.308V23.4445C103.308 20.6247 104.688 19.0948 107.327 19.0948C108.167 19.0948 108.947 19.2448 109.547 19.3948V16.245C109.007 16.035 108.287 15.915 107.537 15.915C105.618 15.915 104.118 16.905 103.308 18.7348V16.245H100.068Z" fill="rgba(255,255,255,0.85)"/>
              <path d="M15.9874 7H3.99685V10.9969H15.9874V22.9874H3.99685V10.9969L0 10.9969V22.9874V32.9795H3.99685H15.9874V22.9874H25.9795V10.9969V7H15.9874Z" fill="#3D6EFF"/>
            </svg>
          </a>
        </span>
        <h1 className="rf-title">FoldGradient</h1>
        <p className="rf-sub">
          Soft, flowing sheets of light for your next hero section, inspired by Raycast's wallpapers.
          Nothing to install. Copy the shader and drop it into your React app.
        </p>
        <div className="rf-row">
          <button className="rf-btn rf-primary" onClick={copy}>
            <span className="rf-agents" aria-hidden>
              {/* claude-ish starburst */}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor"><path d="M7 0l1.1 4.2L12 2.3 9.8 5.9 14 7l-4.2 1.1L11.7 12 8.1 9.8 7 14 5.9 9.8 2.3 11.7 4.2 8.1 0 7l4.2-1.1L2.3 2.3l3.6 1.9L7 0z"/></svg>
              {/* terminal block */}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.4"/><path d="M4 5l2.2 2L4 9M7.5 9.2H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {/* cursor */}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor"><path d="M2 1l10 5.4-4.4 1.2L6.4 12 2 1z"/></svg>
            </span>
            {copied ? 'Copied!' : 'Copy Shader'}
          </button>
          <a className="rf-btn rf-ghost" href={GITHUB_URL} target="_blank" rel="noreferrer">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
            GitHub
          </a>
        </div>
        <p className={`rf-caption${copied ? ' rf-copied' : ''}`}>
          {copied
            ? '✓ Copied. Paste it into your coding agent to install.'
            : 'Works with Claude Code, Cursor, and any coding agent.'}
        </p>
      </div>
    </>
  )
}
