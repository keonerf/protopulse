/**
 * Removes the light-grey studio background from the CAD renders by
 * flood-filling from the image borders, then trims and feathers.
 *
 *   node scripts/cutout.mjs
 *
 * Writes public/assets/machine/exploded.png and assembled.png (RGBA).
 */
import sharp from 'sharp'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync } from 'node:fs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/assets/machine')
mkdirSync(OUT, { recursive: true })

/** flood fill from borders across near-uniform light background */
function keyBackground(data, w, h, { seedTol = 26, growTol = 14 } = {}) {
  const idx = (x, y) => (y * w + x) * 4
  const mask = new Uint8Array(w * h) // 1 = background
  const queue = []

  // collect border seeds that look like the light bg
  const isLight = (i) => {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const lum = 0.299 * r + 0.587 * g + 0.114 * b
    const spread = Math.max(r, g, b) - Math.min(r, g, b)
    return lum > 140 && spread < 24
  }

  const push = (x, y) => {
    const p = y * w + x
    if (!mask[p]) {
      mask[p] = 1
      queue.push(p)
    }
  }

  for (let x = 0; x < w; x++) {
    if (isLight(idx(x, 0))) push(x, 0)
    if (isLight(idx(x, h - 1))) push(x, h - 1)
  }
  for (let y = 0; y < h; y++) {
    if (isLight(idx(0, y))) push(0, y)
    if (isLight(idx(w - 1, y))) push(w - 1, y)
  }

  while (queue.length) {
    const p = queue.pop()
    const px = p % w
    const py = (p - px) / w
    const i = p * 4
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const neighbors = [
      [px - 1, py],
      [px + 1, py],
      [px, py - 1],
      [px, py + 1],
    ]
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
      const np = ny * w + nx
      if (mask[np]) continue
      const ni = np * 4
      const dr = Math.abs(data[ni] - r)
      const dg = Math.abs(data[ni + 1] - g)
      const db = Math.abs(data[ni + 2] - b)
      // grow across smooth gradient, but never into dark or colorful pixels
      const lum = 0.299 * data[ni] + 0.587 * data[ni + 1] + 0.114 * data[ni + 2]
      const spread =
        Math.max(data[ni], data[ni + 1], data[ni + 2]) -
        Math.min(data[ni], data[ni + 1], data[ni + 2])
      if (dr + dg + db < growTol * 3 && lum > 118 && spread < seedTol) {
        mask[np] = 1
        queue.push(np)
      }
    }
  }
  return mask
}

async function cutout(input, output) {
  const img = sharp(resolve(ROOT, input)).ensureAlpha()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info

  const mask = keyBackground(data, w, h)

  // apply mask → alpha, with 1px soft edge (average of neighbor mask values)
  const out = Buffer.from(data)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x
      if (mask[p]) {
        out[p * 4 + 3] = 0
        continue
      }
      // feather: count bg neighbors
      let bg = 0
      let n = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
          n++
          if (mask[ny * w + nx]) bg++
        }
      }
      if (bg > 0) out[p * 4 + 3] = Math.round(255 * (1 - bg / n))
    }
  }

  const buf = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toBuffer()

  // trim transparent margins, keep a small pad
  await sharp(buf).trim({ threshold: 8 }).extend({
    top: 24,
    bottom: 24,
    left: 24,
    right: 24,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  }).png({ compressionLevel: 9 }).toFile(resolve(OUT, output))

  console.log(`${output} written`)
}

await cutout('public/assets/cad_exploded.png', 'exploded.png')
await cutout('public/assets/cad_assembled.png', 'assembled.png')
console.log('done')
