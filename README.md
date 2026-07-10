# ProtoPulse — protopulse.com

**Gerber in. Board out. One hour.**

Product site for **ProtoBlock-1**, ProtoPulse's desktop PCB prototyping
station: CNC isolation milling, solder-paste stencilling, mould-based
component placement, and reflow — four stages in one tower, driven by
one piece of software.

🔗 **Live** — [proto-pulse.vercel.app](https://proto-pulse.vercel.app)

---

## Design direction

Dark precision-instrument aesthetic, minimal and product-first:

- **Palette** — enclosure black `#07090B`, signal cyan `#3ADCEC`
  (sampled from the ProtoPulse Suite UI), copper `#C98A4B` as the
  material counterpoint (raw board / reflow heat).
- **Type** — Space Grotesk (display + body) and JetBrains Mono
  (specs, labels, readouts), both self-hosted via Fontsource.
- **Motion** — premium personality: `cubic-bezier(0.16,1,0.3,1)`,
  no overshoot, transform/opacity only, `prefers-reduced-motion`
  respected everywhere.

### Signature moments

1. **Hero autorouter** (`HeroCanvas.tsx`) — a canvas ambient that routes
   PCB traces in 45°-constrained segments, ends them in pads, and runs
   occasional signal pulses down completed nets.
2. **Machine scan-build** (`Machine.tsx`) — a 340vh scroll scrub where
   ProtoBlock-1 assembles behind a traveling scan line: exploded CAD
   ghost above, solid tower below, a focus bracket gliding between the
   four station bays, and a live assembly-% readout.
3. **The board that builds itself** (`Process.tsx` + `PCBBoard.tsx`) —
   an SVG rendition of the real test circuit (555 blinker, 19 traces,
   15 pads) that is milled, pasted, populated, and reflowed as you
   scroll, ending with the LED actually blinking at ~3 Hz.

## Stack

| | |
|---|---|
| React 19 + TypeScript 5.9 | UI, strict mode |
| Vite 7 | build/dev |
| Framer Motion 12 | scroll scrubs, reveals, SVG choreography |
| Lenis 1.3 | inertia scrolling (skipped under reduced motion) |

## Structure

```
src/
├── App.tsx                  # section composition + Lenis
├── index.css                # design tokens, base, shared utilities
└── components/
    ├── Navbar.tsx            # fixed bar, blur-on-scroll
    ├── Hero.tsx / HeroCanvas.tsx
    ├── Problem.tsx           # three pains, type-only
    ├── Machine.tsx           # scan-line assembly scrub
    ├── Process.tsx / PCBBoard.tsx
    ├── Mould.tsx             # ₹8 vs ₹4,00,000 moment
    ├── Software.tsx          # suite screenshot + pipeline terminal
    ├── Numbers.tsx           # economics delta table
    ├── Specs.tsx             # datasheet grid
    ├── Contact.tsx / Footer.tsx
scripts/
├── cutout.mjs               # bg-removal for the CAD renders (sharp)
├── genframes.mjs            # Nano Banana frame-sequence generator*
└── shoot.mjs / reshoot.mjs  # headless-Edge screenshot QA rig
```

\* `genframes.mjs` regenerates a 6-frame studio assembly sequence via
`gemini-2.5-flash-image`. It needs `GEMINI_API_KEY` from a project with
image-generation quota (billed tier); the current site uses locally
processed CAD cutouts instead.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle → dist/
npm run lint
```

## Deploy

Vercel, auto-deploy from `main`. `api/chat.ts` (Gemini-backed assistant
endpoint) is retained but currently has no frontend surface.
