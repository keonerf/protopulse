/**
 * Standalone still renders of the Baker-01 machine from the isometric film.
 *
 *   node scripts/renderstills.mjs [--probe] [url]
 *
 * The film renders DOM inside an <svg><foreignObject>. The Stage exposes a
 * frame-seek protocol: dispatching a `data-om-seek-to-time-frame` CustomEvent
 * on the svg pauses playback and jumps to an exact timestamp. We use that to
 * freeze specific moments, screenshot the svg's bounding box, then key the dark
 * background to transparency with a border flood-fill and trim to the model.
 *
 * --probe : dump raw (un-keyed) frames at candidate times to %TEMP% for review.
 */
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/assets/renders')
mkdirSync(OUT, { recursive: true })

const PROBE = process.argv.includes('--probe')
const URL = process.argv.find((a) => a.startsWith('http')) ?? 'http://localhost:5173/film/index.html'
const TMP = resolve(tmpdir(), 'protopulse-stills')
mkdirSync(TMP, { recursive: true })
const PROFILE = resolve(TMP, 'edge-profile')
rmSync(PROFILE, { recursive: true, force: true })
mkdirSync(PROFILE, { recursive: true })

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const PORT = 9236

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
    '--window-size=1960,1300',
    'about:blank',
  ],
  { stdio: 'ignore', detached: false },
)

let browser = null
for (let i = 0; i < 50 && !browser; i++) {
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
await page.setViewport({ width: 1920, height: 1240, deviceScaleFactor: 2 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 45000 })
// let fonts + first paint settle
await new Promise((r) => setTimeout(r, 2500))

const svgSel = 'svg[data-om-exportable-video-with-duration-secs]'
await page.waitForSelector(svgSel, { timeout: 15000 })

async function seek(t) {
  await page.evaluate(
    (sel, time) => {
      const el = document.querySelector(sel)
      el.dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', { detail: { time } }))
    },
    svgSel,
    t,
  )
  // allow React to render the frame
  await new Promise((r) => setTimeout(r, 450))
}

/* Strip the film's chrome so the machine sits on true transparency:
   the Stage backdrop (#131210), the vignette gradient sprite, and the
   PP-01 clock HUD. Leaves the machine + its floor reflection. */
async function hideChrome() {
  await page.evaluate(() => {
    const film = document.querySelector('[data-pp-film]')
    if (film) film.style.background = 'transparent'
    for (const el of document.querySelectorAll('*')) {
      const s = el.style
      if (!s) continue
      const inline = (s.background || '') + ' ' + (s.backgroundColor || '')
      // vignette gradient sprite
      if (inline.includes('radial-gradient(ellipse at 50% 42%')) { el.style.display = 'none'; continue }
      // Stage solid backdrop (#131210 / rgb(19,18,16))
      const cs = getComputedStyle(el)
      if (cs.backgroundColor === 'rgb(19, 18, 16)' || cs.backgroundColor === 'rgb(0, 0, 0)') {
        el.style.background = 'transparent'
      }
      // hide ALL text leaves (clock, titles, dim labels, callout labels, chips)
      // — the machine geometry itself carries no text, so this cleans the frame.
      if (el.childElementCount === 0 && (el.textContent || '').trim() !== '') {
        el.style.visibility = 'hidden'
      }
    }
    // leader lines for the exploded callouts are thin 1px SVG/divs on the right;
    // hide any svg overlays (grids/leaders) too
    for (const svg of document.querySelectorAll('svg svg, [data-pp-film] svg')) {
      // keep the main export svg; hide small overlay svgs
      const r = svg.getBoundingClientRect()
      if (r.width < 900) svg.style.display = 'none'
    }
  })
}

async function shotSvg(file) {
  const box = await page.evaluate((sel) => {
    const el = document.querySelector(sel)
    const r = el.getBoundingClientRect()
    return { x: r.x, y: r.y, width: r.width, height: r.height }
  }, svgSel)
  await page.screenshot({
    path: file,
    clip: { x: box.x, y: box.y, width: box.width, height: box.height },
    omitBackground: true,
  })
  return box
}

if (PROBE) {
  const times = [3.0, 7.3, 7.6, 84.0, 84.6, 85.5, 76.0, 76.5, 77.0]
  for (const t of times) {
    await seek(t)
    const f = resolve(TMP, `probe_${String(t).replace('.', '_')}.png`)
    await shotSvg(f)
    console.log('probe', t, '→', f)
  }
  await browser.close()
  proc.kill()
  console.log('probe done →', TMP)
  process.exit(0)
}

/* ---------- background keying (dark flood-fill from borders) ---------- */
function keyDark(data, w, h, { lumaMax = 15, spreadMax = 14, growLuma = 15 } = {}) {
  const idx = (x, y) => (y * w + x) * 4
  const mask = new Uint8Array(w * h)
  const queue = []
  const lumaOf = (i) => 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
  const spreadOf = (i) =>
    Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2])
  const isBg = (i) => lumaOf(i) < lumaMax && spreadOf(i) < spreadMax
  const push = (x, y) => {
    const p = y * w + x
    if (!mask[p]) {
      mask[p] = 1
      queue.push(p)
    }
  }
  for (let x = 0; x < w; x++) {
    if (isBg(idx(x, 0))) push(x, 0)
    if (isBg(idx(x, h - 1))) push(x, h - 1)
  }
  for (let y = 0; y < h; y++) {
    if (isBg(idx(0, y))) push(0, y)
    if (isBg(idx(w - 1, y))) push(w - 1, y)
  }
  while (queue.length) {
    const p = queue.pop()
    const px = p % w
    const py = (p - px) / w
    const neigh = [
      [px - 1, py],
      [px + 1, py],
      [px, py - 1],
      [px, py + 1],
    ]
    for (const [nx, ny] of neigh) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
      const np = ny * w + nx
      if (mask[np]) continue
      const ni = np * 4
      if (lumaOf(ni) < growLuma && spreadOf(ni) < spreadMax) {
        mask[np] = 1
        queue.push(np)
      }
    }
  }
  return mask
}

// The chrome is hidden in the DOM, so the raw capture is already transparent.
// Just trim to the painted content (machine + reflection) and pad a little.
async function makeStill(rawFile, outFile) {
  await sharp(rawFile)
    .ensureAlpha()
    .trim({ threshold: 8 })
    .extend({ top: 30, bottom: 30, left: 30, right: 30, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(outFile)
  const meta = await sharp(outFile).metadata()
  console.log(`${outFile}  ${meta.width}x${meta.height}`)
}

const jobs = [
  // S8_Exploded (global 73.5–81.5): the film's signature exploded look, all
  // text/labels hidden. Moderate separation for the hero, full for capabilities.
  { name: 'baker-hero.png', t: 75.0 },      // g≈27 — modules lifting apart
  { name: 'baker-exploded.png', t: 76.6 },  // g≈100 — full separation
  // S1_Hero (global 0–8) at t=7.85: assembled closed machine, all text faded.
  { name: 'baker-assembled.png', t: 7.85 },
]

for (const j of jobs) {
  await seek(j.t)
  await hideChrome()
  await new Promise((r) => setTimeout(r, 120))
  const raw = resolve(TMP, `raw_${j.name}`)
  await shotSvg(raw)
  await makeStill(raw, resolve(OUT, j.name))
}

await browser.close()
proc.kill()
console.log('done →', OUT)
