/** Editorial redesign QA: shoot every section, desktop + mobile. */
import puppeteer from 'puppeteer-core'
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'

const OUT = resolve(tmpdir(), 'protopulse-shots2')
const PROFILE = resolve(OUT, `edge-profile-${Date.now()}`)
mkdirSync(PROFILE, { recursive: true })

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const proc = spawn(
  EDGE,
  [
    '--headless=new',
    '--remote-debugging-port=9224',
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
    const r = await fetch('http://127.0.0.1:9224/json/version')
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
await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2200))

const sections = ['#problem', '#product', '#film', '#process', '#mould', '#software', '#comparison', '#founders', '#contact']

const glide = (y) =>
  page.evaluate(async (t) => {
    let c = window.scrollY
    const s = 340
    while (Math.abs(t - c) > s) {
      c += Math.sign(t - c) * s
      window.scrollTo(0, c)
      await new Promise((r) => setTimeout(r, 20))
    }
    window.scrollTo(0, t)
  }, y)

await page.screenshot({ path: resolve(OUT, 'd_00_hero.png') })
for (const sel of sections) {
  const y = await page.evaluate((s) => {
    const el = document.querySelector(s)
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) - 40 : null
  }, sel)
  if (y == null) {
    console.log('missing', sel)
    continue
  }
  await glide(y)
  await new Promise((r) => setTimeout(r, 1300))
  await page.screenshot({ path: resolve(OUT, `d_${sel.slice(1)}.png`) })
  console.log('shot', sel)
}

/* film needs longer to boot inside the iframe — reshoot after wait */
const fy = await page.evaluate(() => {
  const el = document.querySelector('#film')
  return Math.round(el.getBoundingClientRect().top + window.scrollY) - 40
})
await glide(fy)
await new Promise((r) => setTimeout(r, 6000))
await page.screenshot({ path: resolve(OUT, 'd_film_settled.png') })

/* mobile */
await page.setViewport({ width: 390, height: 844 })
await page.reload({ waitUntil: 'networkidle2' })
await new Promise((r) => setTimeout(r, 2000))
await page.screenshot({ path: resolve(OUT, 'm_hero.png') })
for (const sel of ['#problem', '#product', '#film', '#process', '#mould']) {
  const y = await page.evaluate((s) => {
    const el = document.querySelector(s)
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) - 20 : null
  }, sel)
  if (y == null) continue
  await glide(y)
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: resolve(OUT, `m_${sel.slice(1)}.png`) })
  console.log('mshot', sel)
}

await browser.close()
proc.kill()
console.log('done → ' + OUT)
