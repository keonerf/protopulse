/**
 * Screenshot rig: drives system Edge (new headless) against the dev server.
 * Profile + output live in the OS temp dir so Vite's watcher never sees them.
 *
 *   node scripts/shoot.mjs [url]
 *
 * Writes shots to %TEMP%/protopulse-shots and prints the folder path.
 */
import puppeteer from 'puppeteer-core'
import { spawn } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'

const URL = process.argv[2] ?? 'http://localhost:5173'
const OUT = resolve(tmpdir(), 'protopulse-shots')
const PROFILE = resolve(OUT, 'edge-profile')
rmSync(PROFILE, { recursive: true, force: true })
mkdirSync(PROFILE, { recursive: true })

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const PORT = 9223

const proc = spawn(
  EDGE,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--force-device-scale-factor=1',
    '--window-size=1440,1000',
    'about:blank',
  ],
  { stdio: 'ignore', detached: false },
)

// wait for the devtools endpoint
let browser = null
for (let i = 0; i < 40 && !browser; i++) {
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/json/version`)
    const info = await res.json()
    browser = await puppeteer.connect({
      browserWSEndpoint: info.webSocketDebuggerUrl,
      defaultViewport: null,
    })
  } catch {
    await new Promise((r) => setTimeout(r, 400))
  }
}
if (!browser) {
  proc.kill()
  console.error('could not reach Edge devtools endpoint')
  process.exit(1)
}

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise((r) => setTimeout(r, 2200)) // hero entrance

const spots = await page.evaluate(() => {
  const abs = (sel) => {
    const el = document.querySelector(sel)
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 0
  }
  return {
    doc: document.body.scrollHeight,
    machine: abs('#machine'),
    process: abs('#process'),
    software: abs('#software'),
    specs: abs('#specs'),
    contact: abs('#contact'),
  }
})
console.log('section map', JSON.stringify(spots))

// walk in steps so IntersectionObservers and scroll scrubs fire naturally
async function glideTo(y) {
  await page.evaluate(async (target) => {
    const step = 320
    let cur = window.scrollY
    while (Math.abs(target - cur) > step) {
      cur += Math.sign(target - cur) * step
      window.scrollTo(0, cur)
      await new Promise((r) => setTimeout(r, 24))
    }
    window.scrollTo(0, target)
  }, y)
}

const shots = [
  ['01_hero', 0, 1400],
  ['02_problem', spots.machine - 820, 900],
  ['03_machine_30', spots.machine + Math.round((spots.process - spots.machine) * 0.3), 1200],
  ['04_machine_82', spots.machine + Math.round((spots.process - spots.machine) * 0.82), 1200],
  ['05_process_mill', spots.process + 900, 1400],
  ['06_process_late', spots.software - 950, 1600],
  ['07_mould', spots.software - 350, 900],
  ['08_software', spots.software + 300, 3600],
  ['09_numbers', spots.specs - 700, 900],
  ['10_specs', spots.specs + 100, 900],
  ['11_contact', spots.contact + 60, 900],
]

for (const [name, y, settle] of shots) {
  await glideTo(Math.max(0, y))
  await new Promise((r) => setTimeout(r, settle))
  await page.screenshot({ path: resolve(OUT, `${name}.png`) })
  console.log('shot', name)
}

// mobile checks
await page.setViewport({ width: 390, height: 844 })
await page.reload({ waitUntil: 'networkidle0' })
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 1800))
await page.screenshot({ path: resolve(OUT, '12_mobile_hero.png') })
console.log('shot 12_mobile_hero')

const mProc = await page.evaluate(() => {
  const el = document.querySelector('#process')
  return Math.round(el.getBoundingClientRect().top + window.scrollY)
})
await glideTo(mProc + 700)
await new Promise((r) => setTimeout(r, 1400))
await page.screenshot({ path: resolve(OUT, '13_mobile_process.png') })
console.log('shot 13_mobile_process')

await browser.close()
proc.kill()
console.log('done → ' + OUT)
