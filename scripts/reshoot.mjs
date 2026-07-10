/** Focused reshoot: machine scrub states + mobile hero/machine. */
import puppeteer from 'puppeteer-core'
import { spawn } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'

const OUT = resolve(tmpdir(), 'protopulse-shots')
const PROFILE = resolve(OUT, `edge-profile-${Date.now()}`)
try {
  rmSync(resolve(OUT, 'edge-profile'), { recursive: true, force: true })
} catch {
  /* held by a zombie — unique dir below sidesteps it */
}
mkdirSync(PROFILE, { recursive: true })

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const proc = spawn(
  EDGE,
  [
    '--headless=new',
    '--remote-debugging-port=9223',
    `--user-data-dir=${PROFILE}`,
    '--no-first-run',
    '--disable-gpu',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

let browser = null
for (let i = 0; i < 40 && !browser; i++) {
  try {
    const r = await fetch('http://127.0.0.1:9223/json/version')
    const v = await r.json()
    browser = await puppeteer.connect({
      browserWSEndpoint: v.webSocketDebuggerUrl,
      defaultViewport: null,
    })
  } catch {
    await new Promise((r) => setTimeout(r, 400))
  }
}
if (!browser) {
  proc.kill()
  throw new Error('no devtools endpoint')
}

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1500))

const spots = await page.evaluate(() => {
  const a = (s) =>
    Math.round(document.querySelector(s).getBoundingClientRect().top + window.scrollY)
  return { machine: a('#machine'), process: a('#process') }
})

const glide = (y) =>
  page.evaluate(async (t) => {
    let c = window.scrollY
    const s = 320
    while (Math.abs(t - c) > s) {
      c += Math.sign(t - c) * s
      window.scrollTo(0, c)
      await new Promise((r) => setTimeout(r, 24))
    }
    window.scrollTo(0, t)
  }, y)

const span = spots.process - spots.machine
for (const [name, f] of [
  ['m_15', 0.15],
  ['m_40', 0.4],
  ['m_62', 0.62],
  ['m_70', 0.7],
]) {
  await glide(spots.machine + Math.round(span * f))
  await new Promise((r) => setTimeout(r, 1100))
  await page.screenshot({ path: resolve(OUT, `r_${name}.png`) })
  console.log('shot', name)
}

await page.setViewport({ width: 390, height: 844 })
await page.reload({ waitUntil: 'networkidle0' })
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 1800))
await page.screenshot({ path: resolve(OUT, 'r_mobile_hero.png') })

const mm = await page.evaluate(() =>
  Math.round(document.querySelector('#machine').getBoundingClientRect().top + window.scrollY),
)
await glide(mm + 900)
await new Promise((r) => setTimeout(r, 1100))
await page.screenshot({ path: resolve(OUT, 'r_mobile_machine.png') })
console.log('mobile done')

await browser.close()
proc.kill()
console.log('done → ' + OUT)
