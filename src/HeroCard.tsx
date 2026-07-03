import React, { useEffect, useRef, useState } from 'react'
import { Toast } from '@base-ui/react/toast'
import { buildPrompt, type PromptConfig } from './prompt'

const copyToastManager = Toast.createToastManager()

const GITHUB_URL = 'https://github.com/mattrothenberg/fold-gradient' // update when the repo is pushed
const PAPER_URL = 'https://github.com/paper-design/shaders'

const css = `
  .rf-card {
    position: fixed; left: 28px; bottom: 28px; z-index: 10;
    width: min(480px, calc(100vw - 56px));
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
  .rf-primary:hover { background: #161a23; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.24), 0 14px 40px rgba(0,0,0,0.55); }
  .rf-agents { display: inline-flex; align-items: center; gap: 6px; margin-right: 2px; opacity: 0.92; }
  .rf-agents svg {
    display: block; transform-origin: center; will-change: transform;
    transition: transform 400ms cubic-bezier(0.32,0.72,0,1);
  }
  .rf-agents svg:nth-child(1) { transform: rotate(-6deg); }
  .rf-agents svg:nth-child(4) { transform: rotate(6deg); }
  .rf-primary:hover .rf-agents svg:nth-child(1) { transform: rotate(-12deg) translateX(-3px); }
  .rf-primary:hover .rf-agents svg:nth-child(2) { transform: rotate(6deg) translate(-1px,-1px) scale(1.1); }
  .rf-primary:hover .rf-agents svg:nth-child(3) { transform: rotate(-6deg) translate(1px,2px) scale(1.1); }
  .rf-primary:hover .rf-agents svg:nth-child(4) { transform: rotate(12deg) translateX(3px); }
  .rf-toast {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12.5px; font-weight: 550; letter-spacing: -0.004em;
    color: #eaf2ff; background: rgba(16,19,26,0.92);
    padding: 8px 14px; border-radius: 999px; white-space: nowrap;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16), 0 10px 32px rgba(0,0,0,0.5);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    transform-origin: bottom center;
    transition: opacity 350ms cubic-bezier(0.32,0.72,0,1),
                transform 350ms cubic-bezier(0.32,0.72,0,1);
  }
  .rf-toast[data-starting-style], .rf-toast[data-ending-style] {
    opacity: 0; transform: translateY(6px) scale(0.94);
  }
  .rf-toast-desc { margin: 0; }
  .rf-toast-desc::before { content: '✓  '; color: #8ec2ff; }
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

function CopyToasts() {
  const { toasts } = Toast.useToastManager()
  return (
    <Toast.Portal>
      <Toast.Viewport>
        {toasts.map((toast) => (
          <Toast.Positioner key={toast.id} toast={toast}>
            <Toast.Root toast={toast} className="rf-toast">
              <Toast.Content>
                <Toast.Description className="rf-toast-desc" />
              </Toast.Content>
            </Toast.Root>
          </Toast.Positioner>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  )
}

export default function HeroCard({ config }: { config: PromptConfig }) {
  const [mounted, setMounted] = useState(false)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const copy = async () => {
    await navigator.clipboard.writeText(buildPrompt(config))
    copyToastManager.add({
      description: 'Copied to clipboard',
      positionerProps: { anchor: btnRef.current, side: 'top', sideOffset: 10 },
      timeout: 1800,
    })
  }

  return (
    <Toast.Provider toastManager={copyToastManager}>
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
          <button ref={btnRef} className="rf-btn rf-primary" onClick={copy}>
            <span className="rf-agents" aria-hidden>
              {/* Claude Code */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M20.998 10.949H24v3.102h-3v3.028h-1.487V20H18v-2.921h-1.487V20H15v-2.921H9V20H7.488v-2.921H6V20H4.487v-2.921H3V14.05H0V10.95h3V5h17.998v5.949zM6 10.949h1.488V8.102H6v2.847zm10.51 0H18V8.102h-1.49v2.847z"/></svg>
              {/* OpenAI */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd"><path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"/></svg>
              <svg width="16" height="16" viewBox="82.65 82.65 634.71 634.71" fill="currentColor" fillRule="evenodd"><path d="M165.29 165.29H517.36V400H400V517.36H282.65V634.72H165.29ZM282.65 282.65V400H400V282.65Z"/><path d="M517.36 400H634.72V634.72H517.36Z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd"><path d="M16 6H8v12h8V6zm4 16H4V2h16v20z"/></svg>
            </span>
            Copy for your agent
          </button>
          <a className="rf-btn rf-ghost" href={GITHUB_URL} target="_blank" rel="noreferrer">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
            GitHub
          </a>
        </div>
      </div>
      <CopyToasts />
    </Toast.Provider>
  )
}
