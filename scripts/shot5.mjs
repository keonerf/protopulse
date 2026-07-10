import puppeteer from 'puppeteer-core'
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'

const OUT = resolve(tmpdir(), 'protopulse-shots4')
const PROFILE = resolve(OUT, `edge-p5-${Date.now()}`)
mkdirSync(PROFILE, { recursive: true })
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const proc = spawn(EDGE, ['--headless=new', '--remote-debugging-port=9228', `--user-data-dir=${PROFILE}`, '--no-first-run', '--disable-gpu', 'about:blank'], { stdio: 'ignore' })
let browser = null
for (let i = 0; i < 40 && !browser; i++) {
  try { const r = await fetch('http://127.0.0.1:9228/json/version'); const v = await r.json(); browser = await puppeteer.connect({ browserWSEndpoint: v.webSocketDebuggerUrl, defaultViewport: null }) }
  catch { await new Promise((r) => setTimeout(r, 400)) }
}
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2000))
const glide = (y) => page.evaluate(async (t) => { let c = window.scrollY; while (Math.abs(t - c) > 300) { c += Math.sign(t - c) * 300; window.scrollTo(0, c); await new Promise((r) => setTimeout(r, 16)) } window.scrollTo(0, t) }, y)
const topOf = (s) => page.evaluate((sel) => Math.round(document.querySelector(sel).getBoundingClientRect().top + window.scrollY), s)
await glide((await topOf('#software')) + 620)
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: resolve(OUT, '22_suite_outputs.png') })
await glide((await topOf('#mould')) - 30)
await new Promise((r) => setTimeout(r, 900))
await page.screenshot({ path: resolve(OUT, '23_mould.png') })
await browser.close(); proc.kill(); console.log('done')
