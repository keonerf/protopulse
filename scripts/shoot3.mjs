/** QA for scroll-step redesign: hardware bracket states, suite terminal states, logo hover, tagline. */
import puppeteer from 'puppeteer-core'
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'

const OUT = resolve(tmpdir(), 'protopulse-shots3')
const PROFILE = resolve(OUT, `edge-profile-${Date.now()}`)
mkdirSync(PROFILE, { recursive: true })

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const proc = spawn(
  EDGE,
  ['--headless=new', '--remote-debugging-port=9226', `--user-data-dir=${PROFILE}`, '--no-first-run', '--disable-gpu', 'about:blank'],
  { stdio: 'ignore' },
)

let browser = null
for (let i = 0; i < 40 && !browser; i++) {
  try {
    const r = await fetch('http://127.0.0.1:9226/json/version')
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
await new Promise((r) => setTimeout(r, 2500))

const glide = (y) =>
  page.evaluate(async (t) => {
    let c = window.scrollY
    const s = 300
    while (Math.abs(t - c) > s) {
      c += Math.sign(t - c) * s
      window.scrollTo(0, c)
      await new Promise((r) => setTimeout(r, 18))
    }
    window.scrollTo(0, t)
  }, y)

/* hero + tagline */
await page.screenshot({ path: resolve(OUT, '01_hero.png') })

/* logo hover — move mouse over the wordmark and hold */
const logo = await page.$('h1')
const bb = await logo.boundingBox()
await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 12 })
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: resolve(OUT, '02_logo_hover.png') })
console.log('hover shot')

/* hardware: land each of the 4 steps */
const prodY = await page.evaluate(() => {
  const el = document.querySelector('#product')
  return Math.round(el.getBoundingClientRect().top + window.scrollY)
})
const prodH = await page.evaluate(() => document.querySelector('#product').offsetHeight)
for (let i = 0; i < 4; i++) {
  await glide(prodY + 560 + i * (prodH - 900) / 3.6)
  await new Promise((r) => setTimeout(r, 1100))
  await page.screenshot({ path: resolve(OUT, `10_hw_step${i}.png`) })
  console.log('hw', i)
}

/* suite: land each of the 4 steps */
const swY = await page.evaluate(() => {
  const el = document.querySelector('#software')
  return Math.round(el.getBoundingClientRect().top + window.scrollY)
})
const swH = await page.evaluate(() => document.querySelector('#software').offsetHeight)
for (let i = 0; i < 4; i++) {
  await glide(swY + 560 + i * (swH - 900) / 3.6)
  await new Promise((r) => setTimeout(r, 1400))
  await page.screenshot({ path: resolve(OUT, `20_sw_step${i}.png`) })
  console.log('sw', i)
}

/* mobile sanity */
await page.setViewport({ width: 390, height: 844 })
await page.reload({ waitUntil: 'networkidle2' })
await new Promise((r) => setTimeout(r, 2000))
await page.screenshot({ path: resolve(OUT, '30_m_hero.png') })
const mProdY = await page.evaluate(() => Math.round(document.querySelector('#product').getBoundingClientRect().top + window.scrollY))
await glide(mProdY + 500)
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: resolve(OUT, '31_m_hw.png') })
const mSwY = await page.evaluate(() => Math.round(document.querySelector('#software').getBoundingClientRect().top + window.scrollY))
await glide(mSwY + 500)
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: resolve(OUT, '32_m_sw.png') })

await browser.close()
proc.kill()
console.log('done → ' + OUT)
