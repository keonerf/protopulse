/**
 * Generates the ProtoBlock-1 assembly frame sequence via the Nano Banana
 * image model (gemini-2.5-flash-image), called directly against the REST API.
 *
 *   node scripts/genframes.mjs            # needs GEMINI_API_KEY in env
 *
 * Outputs public/assets/machine/frame_0.png … frame_5.png
 * (0 = fully exploded … 5 = fully assembled)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/assets/machine')
mkdirSync(OUT, { recursive: true })

const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error('GEMINI_API_KEY not set')
  process.exit(1)
}

const MODEL = 'gemini-2.5-flash-image'
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const STYLE = `Render style (apply exactly): professional industrial product render on a solid near-black background (hex #07090B, completely plain, no gradient banding), soft cool studio key light, a subtle cyan rim light from the upper left, very subtle dark floor reflection below the machine. The machine keeps its dark teal-green anodized frame color. Centered composition with generous margins, straight-on 3/4 view matching the source image camera angle. Photorealistic, clean, no text, no labels, no watermark, no people, square 1:1 aspect.`

function b64(path) {
  return readFileSync(path).toString('base64')
}

async function call(parts, attempt = 1) {
  const res = await fetch(`${URL}?key=${KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
  })

  if (res.status === 429 || res.status >= 500) {
    if (attempt > 4) throw new Error(`HTTP ${res.status} after ${attempt} attempts`)
    const body = await res.text()
    const m = body.match(/retry in ([\d.]+)s/i)
    const wait = m ? Math.ceil(parseFloat(m[1]) + 2) : 20 * attempt
    console.log(`  rate limited (HTTP ${res.status}) — waiting ${wait}s`)
    await new Promise((r) => setTimeout(r, wait * 1000))
    return call(parts, attempt + 1)
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 400)}`)
  }

  const data = await res.json()
  const imgPart = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
  if (!imgPart) {
    throw new Error(
      `no image in response: ${JSON.stringify(data).slice(0, 400)}`,
    )
  }
  return Buffer.from(imgPart.inlineData.data, 'base64')
}

function img(path) {
  return { inlineData: { mimeType: 'image/png', data: b64(path) } }
}

async function gen(name, parts) {
  process.stdout.write(`generating ${name} … `)
  const buf = await call(parts)
  const file = resolve(OUT, name)
  writeFileSync(file, buf)
  console.log(`ok (${Math.round(buf.length / 1024)} KB)`)
  await new Promise((r) => setTimeout(r, 9000)) // stay under free-tier RPM
  return file
}

const exploded = resolve(ROOT, 'public/assets/cad_exploded.png')
const assembled = resolve(ROOT, 'public/assets/cad_assembled.png')

// 1 — the two endpoints, restyled from the raw CAD screenshots
const f5 = await gen('frame_5.png', [
  {
    text: `This is a CAD screenshot of "ProtoBlock-1", a desktop PCB prototyping tower: a two-column frame with four stations — a CNC mill, a paste station, a placement deck with springs, and a small reflow chamber (white box). Recreate this EXACT machine, fully assembled exactly as shown, same geometry and proportions. ${STYLE}`,
  },
  img(assembled),
])

const f0 = await gen('frame_0.png', [
  {
    text: `This is a CAD screenshot of the same "ProtoBlock-1" desktop PCB prototyping tower, shown as a vertical EXPLODED view — its stations and plates hover separated with vertical gaps. Recreate this EXACT exploded arrangement, same geometry, same part positions and gaps. ${STYLE}`,
  },
  img(exploded),
])

// 2 — intermediates interpolated between the two generated endpoints
for (const [name, pct] of [
  ['frame_1.png', 80],
  ['frame_2.png', 60],
  ['frame_3.png', 40],
  ['frame_4.png', 20],
]) {
  await gen(name, [
    {
      text: `Image 1 is machine "ProtoBlock-1" fully EXPLODED (parts hovering apart vertically). Image 2 is the same machine fully ASSEMBLED. Generate the in-between frame of an assembly animation where the hovering parts have closed ${100 - pct}% of the distance toward their final assembled positions — the vertical gaps between parts are ${pct}% of the gaps in image 1. Identical machine, identical camera, identical lighting and background as both images. ${STYLE}`,
    },
    img(f0),
    img(f5),
  ])
}

console.log('\nall frames written to public/assets/machine/')
