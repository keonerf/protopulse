import React from 'react'
import { motion } from 'framer-motion'

/**
 * A 555 astable LED blinker building itself, stage by stage.
 *   stage 0 : MILL   — traces + pads are carved (draw in)
 *   stage 1 : PASTE  — solder paste deposits on every pad
 *   stage 2 : PLACE  — components drop in and settle
 *   stage 3 : REFLOW — heat sweep, joints wet out, LED blinks, signal runs
 *
 * Topology (textbook 555 astable):
 *   VCC → R1 → pin7(DISCH) → R2 → pin6(THRES)=pin2(TRIG) → C1 → GND
 *   pin8=VCC · pin4(RESET)=VCC · pin1=GND · pin3(OUT) → R3 → LED → GND
 * Crossovers between different nets are drawn as hop arcs (schematic convention);
 * real nodes carry a junction dot.
 *
 * viewBox 0 0 400 300. Copper/gold palette (#CF8F4E family).
 */

const EASE = [0.16, 1, 0.3, 1] as const
const COP = '#9a6b3a' // copper trace, pre-reflow
const COP_HOT = '#e0c9a6' // wetted / reflowed

type Pad = { x: number; y: number }
const PADS: Pad[] = [
  // 555 DIP-8 — bottom row pins 1-4, top row pins 8-5
  { x: 176, y: 184 }, { x: 192, y: 184 }, { x: 208, y: 184 }, { x: 224, y: 184 }, // 1,2,3,4
  { x: 176, y: 116 }, { x: 192, y: 116 }, { x: 208, y: 116 }, { x: 224, y: 116 }, // 8,7,6,5
  // R1 (VCC → node7), vertical left
  { x: 118, y: 64 }, { x: 118, y: 98 },
  // R2 (node7 → node6), vertical left
  { x: 118, y: 116 }, { x: 118, y: 150 },
  // C1 (node6 → GND), vertical left
  { x: 118, y: 176 }, { x: 118, y: 214 },
  // R3 (OUT → LED), horizontal bottom-right
  { x: 250, y: 236 }, { x: 300, y: 236 },
  // LED (anode top, cathode bottom), right
  { x: 330, y: 192 }, { x: 330, y: 238 },
]

/* Wires. Different-net crossings are covered by HOPS below. */
const TRACES: string[] = [
  // rails
  'M 60 44 H 340',                         // VCC rail
  'M 60 258 H 340',                        // GND rail
  // VCC feeds
  'M 118 44 V 64',                         // VCC → R1.top
  'M 176 44 V 112',                        // VCC → pin8
  'M 300 44 V 208 H 224 V 188',            // VCC → pin4 (RESET)
  // node7 (discharge junction)
  'M 118 98 V 116',                        // R1.bot ↔ R2.top
  'M 118 108 H 192 V 116',                 // node7 → pin7
  // node6 (threshold = trigger)
  'M 118 150 V 176',                       // R2.bot ↔ C1.top
  'M 118 160 H 150 V 100 H 208 V 116',     // node6 → pin6
  'M 118 168 H 160 V 196 H 192 V 188',     // node6 → pin2
  // GND feeds
  'M 176 188 V 258',                       // pin1 → GND
  'M 118 214 V 258',                       // C1.bot → GND
  // output → R3 → LED → GND
  'M 208 188 V 236 H 250',                 // pin3 (OUT) → R3.left
  'M 300 236 H 316 V 192 H 330',           // R3.right → LED anode
  'M 330 238 V 258',                       // LED cathode → GND
]

/* signal pulse route: IC output → R3 → LED → GND */
const SIGNAL =
  'M 208 184 L 208 236 L 250 236 L 300 236 L 316 236 L 316 192 L 330 192 L 330 238 L 330 258'

/* crossover hops — small arcs where two different nets cross */
const HOPS: [number, number][] = [
  [176, 100], // node6→pin6 hops VCC→pin8
  [176, 108], // node7→pin7 hops VCC→pin8
  [150, 108], // node6→pin6 hops node7→pin7
  [176, 196], // pin1→GND hops node6→pin2
]

/* real electrical junctions */
const DOTS: [number, number][] = [
  [118, 44], [176, 44], [300, 44],   // VCC rail taps
  [118, 108],                        // node7
  [118, 160], [118, 168],            // node6 taps
  [176, 258], [118, 258], [330, 258],// GND rail taps
]

type Comp = { id: string; drop: number; render: (lit: boolean) => React.ReactNode }
const COMPONENTS: Comp[] = [
  {
    id: 'ic', drop: 0,
    render: () => (
      <g>
        <rect x={168} y={122} width={64} height={56} rx={4} fill="#241b15" stroke="#4a3a2c" strokeWidth={1.2} />
        <circle cx={176} cy={170} r={2.2} fill="#3a2d22" />
        <path d="M 192 122 a 8 8 0 0 0 16 0" fill="none" stroke="#4a3a2c" strokeWidth={1.2} />
        <text x={200} y={154} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={9} fill="#9a8574" letterSpacing={0.5}>555</text>
      </g>
    ),
  },
  { id: 'r1', drop: -1, render: () => <ResistorV x={118} y={64} h={34} bands={['#CF8F4E', '#241b15', '#e0c9a6']} /> },
  { id: 'r2', drop: -1, render: () => <ResistorV x={118} y={116} h={34} bands={['#e0c9a6', '#241b15', '#CF8F4E']} /> },
  { id: 'r3', drop: 1, render: () => <ResistorH x={256} y={228} w={38} bands={['#CF8F4E', '#CF8F4E', '#241b15']} /> },
  {
    id: 'c1', drop: -1,
    render: () => (
      <g>
        <rect x={106} y={178} width={24} height={34} rx={6} fill="#2a2018" stroke="#4a3a2c" strokeWidth={1.2} />
        <text x={118} y={199} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={7} fill="#8a7563">C1</text>
        <rect x={106} y={178} width={5} height={34} rx={2} fill="#6b5847" opacity={0.6} />
      </g>
    ),
  },
  {
    id: 'led', drop: 1,
    render: (lit) => (
      <g>
        {lit && <circle cx={330} cy={215} r={24} fill="url(#ledGlow)" />}
        <circle cx={330} cy={215} r={12} fill={lit ? '#f6b26b' : '#3a2d22'} stroke={lit ? '#ffe6cc' : '#5a4636'} strokeWidth={1.4} />
        <path d="M 324 215 l 9 -5 v 10 z" fill={lit ? '#fff4e8' : '#6b5847'} />
      </g>
    ),
  },
]

function ResistorV({ x, y, h, bands }: { x: number; y: number; h: number; bands: string[] }) {
  return (
    <g>
      <line x1={x} y1={y - 6} x2={x} y2={y + h + 6} stroke="#6b5847" strokeWidth={2} />
      <rect x={x - 8} y={y} width={16} height={h} rx={5} fill="#c9b8a4" />
      {bands.map((b, i) => (
        <rect key={i} x={x - 8} y={y + 6 + i * 8} width={16} height={3.5} fill={b} />
      ))}
    </g>
  )
}

function ResistorH({ x, y, w, bands }: { x: number; y: number; w: number; bands: string[] }) {
  return (
    <g>
      <line x1={x - 6} y1={y + 8} x2={x + w + 6} y2={y + 8} stroke="#6b5847" strokeWidth={2} />
      <rect x={x} y={y} width={w} height={16} rx={5} fill="#c9b8a4" />
      {bands.map((b, i) => (
        <rect key={i} x={x + 7 + i * 9} y={y} width={3.5} height={16} fill={b} />
      ))}
    </g>
  )
}

const PadRects: React.FC<{ stage: number }> = ({ stage }) => (
  <>
    {PADS.map((p, i) => {
      const w = 9
      const h = 7
      const paste = stage >= 1
      const hot = stage >= 3
      return (
        <motion.rect
          key={i}
          x={p.x - w / 2}
          y={p.y - h / 2}
          width={w}
          height={h}
          rx={1.5}
          initial={false}
          animate={{
            opacity: stage >= 0 ? 1 : 0,
            fill: hot ? '#f6e6cf' : paste ? '#c9c0b2' : '#e8ddcb',
          }}
          transition={{ duration: 0.4, delay: stage === 0 ? 0.4 + i * 0.02 : 0, ease: EASE }}
        />
      )
    })}
  </>
)

export default function PCBBoard({ stage }: { stage: number }) {
  const showTraces = stage >= 0
  const placed = stage >= 2
  const reflow = stage >= 3

  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto" role="img" aria-label="555 astable blinker PCB assembling">
      <defs>
        <radialGradient id="ledGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f6b26b" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f6b26b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="heat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CF8F4E" stopOpacity="0" />
          <stop offset="45%" stopColor="#e0a86f" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#f2ddc2" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#CF8F4E" stopOpacity="0" />
        </linearGradient>
        <pattern id="clad" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="14" stroke="#CF8F4E" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>

      {/* substrate */}
      <rect x={6} y={6} width={388} height={288} rx={10} fill="#171310" stroke="#2a2018" strokeWidth={1.5} />
      <rect x={6} y={6} width={388} height={288} rx={10} fill="url(#clad)" />
      {/* mounting holes */}
      {[[22, 22], [378, 22], [22, 278], [378, 278]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={5} fill="#0e0b09" stroke="#3a2d22" strokeWidth={1} />
      ))}

      {/* traces */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {TRACES.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke={reflow ? COP_HOT : COP}
            strokeWidth={2.4}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={showTraces ? { pathLength: 1, opacity: reflow ? 0.95 : 0.8 } : { pathLength: 0, opacity: 0 }}
            transition={{ pathLength: { duration: 0.6, delay: 0.05 + i * 0.035, ease: EASE }, opacity: { duration: 0.3 } }}
          />
        ))}
        {/* crossover hops */}
        {showTraces &&
          HOPS.map(([hx, hy], i) => (
            <motion.path
              key={`hop-${i}`}
              d={`M ${hx - 5} ${hy} A 5 5 0 0 1 ${hx + 5} ${hy}`}
              stroke={reflow ? COP_HOT : COP}
              strokeWidth={2.4}
              initial={{ opacity: 0 }}
              animate={{ opacity: reflow ? 0.95 : 0.8 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            />
          ))}
      </g>

      {/* junction dots */}
      {showTraces &&
        DOTS.map(([dx, dy], i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={dx}
            cy={dy}
            r={2.6}
            fill={reflow ? COP_HOT : COP}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          />
        ))}

      <PadRects stage={stage} />

      {/* components */}
      <g>
        {COMPONENTS.map((c, i) => (
          <motion.g
            key={c.id}
            initial={false}
            animate={placed ? { y: [-26, 3, -2, 0], opacity: [0, 1, 1, 1] } : { y: -26, opacity: 0 }}
            transition={{ duration: 0.7, delay: placed ? 0.15 + i * 0.12 : 0, ease: EASE, times: [0, 0.6, 0.82, 1] }}
          >
            {c.render(reflow)}
          </motion.g>
        ))}
      </g>

      {/* reflow heat sweep */}
      {reflow && (
        <motion.rect
          x={6}
          width={388}
          height={70}
          fill="url(#heat)"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: [-60, 300], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, ease: 'easeInOut', times: [0, 0.1, 0.9, 1] }}
        />
      )}

      {/* signal pulse — idle loop once reflowed */}
      {reflow && (
        <g>
          <circle r={3.4} fill="#fff4e8">
            <animateMotion dur="1.9s" repeatCount="indefinite" path={SIGNAL} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
            <animate attributeName="opacity" values="0;1;1;0" dur="1.9s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
    </svg>
  )
}
