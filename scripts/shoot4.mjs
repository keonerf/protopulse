/** QA for the assembly + suite redesign, logo hover, eyebrows. */
import puppeteer from 'puppeteer-core'
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'

const OUT = resolve(tmpdir(), 'protopulse-shots4')
const PROFILE = resolve(OUT, `edge-profile-${Date.now()}`)
mkdirSync(PROFILE, { recursive: true })

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const proc = spawn(
  EDGE,
  ['--headless=new', '--remote-debugging-port=9227', `--user-data-dir=${PROFILE}`, '--no-first-run', '--disable-gpu', 'about:blank'],
  { stdio: 'ignore' },
)

let browser = null
for (let i = 0; i < 40 && !browser; i++) {
  try {
    const r = await fetch('http://127.0.0.1:9227/json/version')
    const v = await r.json()
    browser = await puppeteer.connect({ browserWSEndpoint: v.webSocketDebuggerUrl, defaultViewport: null })
  } catch {
    await new Promise((r) => setTimeout(r, 400))
  }
}
if (!browser) { proc.kill(); throw new Error('no devtools endpoint') }

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2200))

const glide = (y) =>
  page.evaluate(async (t) => {
    let c = window.scrollY
    const s = 300
    while (Math.abs(t - c) > s) {
      c += Math.sign(t - c) * s
      window.scrollTo(0, c)
      await new Promise((r) => setTimeout(r, 16))
    }
    window.scrollTo(0, t)
  }, y)
const topOf = (sel) => page.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().top + window.scrollY), sel)

await page.screenshot({ path: resolve(OUT, '01_hero.png') })

/* logo hover — hold over the wordmark to catch the current sweep */
const bb = await page.evaluate(() => {
  const el = document.querySelector('.logo-hover-hero')
  const r = el.getBoundingClientRect()
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
})
await page.mouse.move(bb.x, bb.y, { steps: 10 })
await new Promise((r) => setTimeout(r, 700))
await page.screenshot({ path: resolve(OUT, '02_logo_hover.png') })
await page.mouse.move(10, 10)

/* assembly — click each station to force each PCB stage */
await glide((await topOf('#process')) - 30)
await new Promise((r) => setTimeout(r, 900))
for (let i = 0; i < 4; i++) {
  await page.evaluate((idx) => {
    const btns = document.querySelectorAll('#process ol li button')
    btns[idx]?.click()
  }, i)
  await new Promise((r) => setTimeout(r, i === 3 ? 1500 : 950))
  await page.screenshot({ path: resolve(OUT, `10_pcb_stage${i}.png`) })
  console.log('pcb stage', i)
}

/* suite — default, then hover feature 03 */
await glide((await topOf('#software')) - 30)
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: resolve(OUT, '20_suite.png') })
await page.evaluate(() => {
  const btns = document.querySelectorAll('#software button')
  btns[2]?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
})
await new Promise((r) => setTimeout(r, 900))
await page.screenshot({ path: resolve(OUT, '21_suite_hover.png') })

/* full-page long shots of a couple sections for eyebrow check */
await glide((await topOf('#problem')) - 30)
await new Promise((r) => setTimeout(r, 900))
await page.screenshot({ path: resolve(OUT, '30_problem.png') })

/* mobile */
await page.setViewport({ width: 390, height: 844 })
await page.reload({ waitUntil: 'networkidle2' })
await new Promise((r) => setTimeout(r, 2000))
await page.screenshot({ path: resolve(OUT, '40_m_hero.png') })
await glide((await topOf('#process')) - 10)
await new Promise((r) => setTimeout(r, 1500))
await page.screenshot({ path: resolve(OUT, '41_m_process.png') })
await glide((await topOf('#software')) - 10)
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: resolve(OUT, '42_m_suite.png') })

await browser.close()
proc.kill()
console.log('done → ' + OUT)
