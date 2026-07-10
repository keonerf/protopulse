/* Protopulse — desktop PCB fab · manufacturing film (isometric 3D)
   Units: CNC gantry (mill + stencil laser) · Dispenser unit (mask + paste + UV cure) · 3D printer bay */
const { Stage, Sprite, useSprite, useTime, useTimeline, Easing, interpolate, animate } = window;

/* clamp01 — starter clamp() requires (v,min,max) */
const cl = (v) => Math.max(0, Math.min(1, v));

/* ---------- palette / type ---------- */
const BG = '#131210';
const INK = '#efece5';
const MUT = '#8d897f';
const UV = '#8f7bff';
const LASER = '#ff5a4e';
const GRN = 'rgba(18,90,60,0.94)';
const GRN_T = 'linear-gradient(135deg,#1e7a52,#14523a)';
const FONT = "'Space Grotesk', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const ACC = 'var(--acc)';

/* ---------- isometric projection ---------- */
const SQ = 0.866;
const P = (x, y, z) => [(x - y) * SQ, (x + y) * 0.5 - z];
const MT = `matrix(${SQ},0.5,${-SQ},0.5,0,0)`;
const MR = `matrix(${SQ},0.5,0,1,0,0)`;
const ML = `matrix(${-SQ},0.5,0,1,0,0)`;

function Face({ at, mat, w, h, style, children }) {
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, width: w, height: h,
      transformOrigin: '0 0',
      transform: `translate(${at[0]}px,${at[1]}px) ${mat}`,
      ...style
    }}>{children}</div>
  );
}

function IsoBox({ x = 0, y = 0, z = 0, w, d, h, top, right, left, st, sr, sl, alpha = 1 }) {
  const at = P(x, y, z + h);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: alpha }}>
      <Face at={at} mat={ML} w={d} h={h} style={{ background: left, ...(sl || {}) }} />
      <Face at={at} mat={MR} w={w} h={h} style={{ background: right, ...(sr || {}) }} />
      <Face at={at} mat={MT} w={w} h={d} style={{ background: top, ...(st || {}) }} />
    </div>
  );
}

function Rise({ p, dz = 60, children }) {
  const e = Easing.easeOutCubic(cl(p));
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: e, transform: `translateY(${(1 - e) * dz}px)` }}>
      {children}
    </div>
  );
}

/* ---------- engineering annotation components ---------- */
function Callout({ at, dx = 130, dy = -70, text, sub, p = 1, flip = false }) {
  const a = P(at[0], at[1], at[2]);
  const e = Easing.easeOutCubic(cl(p));
  const lx = a[0] + (flip ? -dx : dx), ly = a[1] + dy;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: e }}>
      <div style={{ position: 'absolute', left: a[0] - 4, top: a[1] - 4, width: 8, height: 8, borderRadius: '50%',
        background: ACC, boxShadow: '0 0 8px color-mix(in oklab, var(--acc) 70%, transparent)' }} />
      <svg style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 1, overflow: 'visible' }}>
        <line x1={a[0]} y1={a[1]} x2={lx} y2={ly} stroke="rgba(239,236,229,0.4)" strokeWidth={1.5} />
        <line x1={lx} y1={ly} x2={lx + (flip ? -46 : 46)} y2={ly} stroke="rgba(239,236,229,0.4)" strokeWidth={1.5} />
      </svg>
      <div style={{ position: 'absolute', left: lx + (flip ? -6 : 6), top: ly - 52,
        transform: flip ? 'translateX(-100%)' : 'none', textAlign: flip ? 'right' : 'left', whiteSpace: 'nowrap',
        textShadow: '0 1px 5px rgba(0,0,0,0.95), 0 0 14px rgba(0,0,0,0.8)' }}>
        <div style={{ fontFamily: MONO, fontSize: 19, color: ACC, letterSpacing: 2 }}>{text}</div>
        <div style={{ fontFamily: FONT, fontSize: 18, color: MUT, marginTop: 3 }}>{sub}</div>
      </div>
    </div>
  );
}

function DimLine({ from, to, label, p = 1 }) {
  const a = P(from[0], from[1], from[2]), b = P(to[0], to[1], to[2]);
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const e = Easing.easeOutCubic(cl(p));
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: e }}>
      <div style={{ position: 'absolute', left: a[0], top: a[1], width: len * e, height: 1.5,
        background: 'rgba(239,236,229,0.55)', transformOrigin: '0 0', transform: `rotate(${ang}rad)` }}>
        <div style={{ position: 'absolute', left: 0, top: -7, width: 1.5, height: 15, background: 'rgba(239,236,229,0.55)' }} />
        <div style={{ position: 'absolute', right: 0, top: -7, width: 1.5, height: 15, background: 'rgba(239,236,229,0.55)' }} />
      </div>
      <div style={{ position: 'absolute', left: (a[0] + b[0]) / 2, top: (a[1] + b[1]) / 2 - 16,
        transform: 'translate(-50%,-100%)', fontFamily: MONO, fontSize: 22, color: INK, letterSpacing: 1, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
}

function Telemetry({ items, t }) {
  return (
    <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: `repeat(${items.length},1fr)`, gap: 1,
      background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, overflow: 'hidden' }}>
      {items.map(([l, v], i) => (
        <div key={i} style={{ background: '#141311', padding: '10px 14px' }}>
          <div style={{ fontFamily: MONO, fontSize: 13, color: MUT, letterSpacing: 2 }}>{l}</div>
          <div style={{ fontFamily: MONO, fontSize: 21, color: INK, marginTop: 4, whiteSpace: 'nowrap' }}>{typeof v === 'function' ? v(t) : v}</div>
        </div>
      ))}
    </div>
  );
}

function GTicker({ lines, t }) {
  const i = Math.floor(t * 2.2);
  const rows = [0, 1, 2].map(k => lines[(i + k) % lines.length]);
  return (
    <div style={{ position: 'absolute', left: 0, top: 800 - 148, width: 1200, height: 148, boxSizing: 'border-box',
      padding: '26px 26px 0', background: 'linear-gradient(transparent, rgba(0,0,0,0.78) 40%)',
      fontFamily: MONO, fontSize: 25, lineHeight: 1.5, color: 'rgba(239,236,229,0.65)' }}>
      {rows.map((ln, k) => (
        <div key={k} style={{ opacity: k === 2 ? 1 : 0.45 }}>{k === 2 ? '> ' : '  '}{ln}</div>
      ))}
    </div>
  );
}

function Ruler() {
  const xs = [], ys = [];
  for (let x = 0; x <= 1200; x += 40) xs.push(x);
  for (let y = 0; y <= 800; y += 40) ys.push(y);
  return (
    <svg width={1200} height={800} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      {xs.map(x => (
        <g key={'x' + x}>
          <line x1={x} y1={0} x2={x} y2={x % 80 ? 10 : 20} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
          {x % 160 === 0 && x > 0 && <text x={x + 6} y={30} fontFamily="JetBrains Mono" fontSize={16} fill="rgba(255,255,255,0.4)">{x / 8}</text>}
        </g>
      ))}
      {ys.map(y => (
        <g key={'y' + y}>
          <line x1={0} y1={y} x2={y % 80 ? 10 : 20} y2={y} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
          {y % 160 === 0 && y > 0 && <text x={26} y={y + 6} fontFamily="JetBrains Mono" fontSize={16} fill="rgba(255,255,255,0.4)">{y / 8}</text>}
        </g>
      ))}
    </svg>
  );
}

/* glow anchor points (x,y,z, rx,ry) */
const GLOWS = {
  bed:     [215, 210, 80, 380, 160],
  oven:    [480, 320, 110, 280, 130],
  disp:    [210, 330, 290, 340, 130],
  uv:      [210, 315, 240, 300, 110],
  roll:    [220, 330, 350, 260, 90],
  printer: [475, 185, 110, 230, 120],
  bin:     [90, 330, 70, 200, 100]
};

/* ---------- the machine (560 × 420 × 500 mm) ---------- */
function Machine({
  assemble = 1, shellAlpha = 1, gantryY = 0.55, carX = 0.5,
  pcbY = 1, showPCB = true, led = '#3a3833', ledGlow = false,
  camGlow = 0, startBtn = 0, spindleGlow = 0, laserGlow = 0,
  moduleGlows = [], boardTint = null,
  dispX = 0.5, uvOn = 0, squeegeeY = null, dispDown = 0, dispJet = 0,
  stencilF = 0, stencilA = 0, pcbDX = 0, pcbDY = 0, ovenGlow = 0,
  printProg = 0.15, printT = 0, focus = null,
  moldDX = 0, moldDY = 0, moldDZ = 0, moldCarry = false, compsP = 0, moldOnBoard = false
}) {
  const dim = (k) => (focus && focus !== k ? 0.38 : 1);
  const boardA = 1 - cl((pcbDX - 60) / 110);
  const stg = (i) => cl(assemble * 4.4 - i * 0.85);
  const gy = 80 + gantryY * 200;
  const cx = 90 + carX * 250;
  const py = 160 - (1 - pcbY) * 300;
  const dx = 50 + dispX * 250;
  const yBack = 352;
  const yFront = yBack - stencilF * (yBack - (150 + pcbDY)); /* film leading edge, follows the shuttled board */
  const hx = 465 + (0.5 + 0.45 * Math.sin(printT * 2.6)) * 50;
  const hy = 160 + (0.5 + 0.5 * Math.sin(printT * 1.9)) * 44;
  const hz = 56 + printProg * 44;

  return (
    <div style={{ position: 'absolute', left: 0, top: 0 }}>
      {/* ground shadow */}
      <div style={{
        position: 'absolute', left: 60, top: 250, width: 1000, height: 280,
        transform: 'translate(-50%,-50%)', borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.55), rgba(0,0,0,0) 68%)',
        filter: 'blur(10px)', opacity: cl(assemble * 2)
      }} />

      {/* interior */}
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: shellAlpha > 0.9 ? 0 : 1 }}>
        {/* fixed bed (CNC + dispense zone) */}
        <IsoBox x={40} y={50} z={26} w={350} d={320} h={26} top="#6a6861" right="#514f48" left="#413f39" />
        {/* Y linear rails + ball screw + steppers */}
        <IsoBox x={14} y={64} z={52} w={18} d={292} h={8} top="#c8c5bd" right="#a9a69e" left="#8f8c84" />
        <IsoBox x={404} y={64} z={52} w={18} d={292} h={8} top="#c8c5bd" right="#a9a69e" left="#8f8c84" />
        <IsoBox x={46} y={70} z={58} w={7} d={276} h={7}
          top="repeating-linear-gradient(90deg,#9a978f 0 4px,#6f6c64 4px 8px)" right="#7c796f" left="#65625a" />
        <IsoBox x={2} y={358} z={46} w={42} d={42} h={42} top="#26241f" right="#1c1a17" left="#141311" />
        <IsoBox x={396} y={358} z={46} w={42} d={42} h={42} top="#26241f" right="#1c1a17" left="#141311" />
        {/* shuttle slider: Y travel rails + rear X transfer rail */}
        <IsoBox x={152} y={140} z={52} w={10} d={225} h={4} top="#b9b6ae" right="#98958d" left="#807d75" />
        <IsoBox x={318} y={140} z={52} w={10} d={225} h={4} top="#b9b6ae" right="#98958d" left="#807d75" />
        <IsoBox x={232} y={146} z={52} w={7} d={213} h={6}
          top="repeating-linear-gradient(90deg,#9a978f 0 4px,#6f6c64 4px 8px)" right="#7c796f" left="#65625a" />
        <IsoBox x={150} y={294} z={52} w={248} d={10} h={4} top="#b9b6ae" right="#98958d" left="#807d75" />
        {/* ── PCB shuttle: carriage on the slider + board (+ components/mold) — drawn before the gantry so tools stay visible ── */}
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: boardA }}>
          <IsoBox x={157 + pcbDX} y={py + pcbDY - 8} z={52} w={166} d={116} h={5} top="#35332e" right="#282622" left="#201e1b" />
          {[0, 1].map(i => (
            <IsoBox key={'cl' + i} x={160 + pcbDX + i * 148} y={py + pcbDY + 40} z={50} w={12} d={20} h={2}
              top="#8d8a83" right="#6f6c64" left="#5a574f" />
          ))}
          {showPCB && (
            <IsoBox x={165 + pcbDX} y={py + pcbDY} z={57} w={150} d={100} h={4}
              top={boardTint || 'linear-gradient(135deg,#e0a668,#c07f44 70%,#d1904f)'}
              right="#8a5a2c" left="#6f4722" />
          )}
          {compsP > 0 && [[52, 26], [52, 44], [52, 62], [88, 26], [88, 44], [88, 62], [56, 80]].map(([ox, oy], i) => (
            <IsoBox key={'cp' + i} x={165 + pcbDX + ox} y={py + pcbDY + oy} z={61}
              w={i === 6 ? 38 : 16} d={i === 6 ? 10 : 9} h={5}
              top="#26241f" right="#1b1a17" left="#141311" alpha={cl(compsP * 7 - i)} />
          ))}
          {moldOnBoard && (
            <IsoBox x={208 + pcbDX} y={py + pcbDY + 18} z={61} w={64} d={64} h={50}
              top="#8fd8de" right="#5fb3bc" left="#4d99a2" />
          )}
        </div>
        {stencilA > 0 && stencilF > 0.02 && (
          <Face at={P(150 + pcbDX, yFront, 68)} mat={MT} w={180} h={yBack - yFront} style={{
            background: `rgba(206,206,212,${0.55 * stencilA})`,
            border: `1px solid rgba(255,255,255,${0.35 * stencilA})`
          }} />
        )}
        {squeegeeY != null && (
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <IsoBox x={158 + pcbDX} y={150 + pcbDY + cl(squeegeeY) * 120} z={72} w={164} d={12} h={14}
              top="#c4c1ba" right="#a4a19a" left="#8b8881" />
            <IsoBox x={170 + pcbDX} y={163 + pcbDY + cl(squeegeeY) * 120} z={66} w={140} d={9} h={9}
              top="#9a978f" right="#7c796f" left="#65625a"
              st={{ borderRadius: 5 }} sr={{ borderRadius: '0 0 5 5' }} sl={{ borderRadius: '0 0 5 5' }} />
          </div>
        )}
        {dispJet ? (() => {
          const col = typeof dispJet === 'string' ? dispJet : '#2ea56e';
          const tip = P(dx + 25, 300, 146 - dispDown * 60);
          const hit = P(dx + 25, 300, 63);
          return (
            <div style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', left: tip[0] - 2, top: tip[1], width: 4, height: Math.max(0, hit[1] - tip[1]),
                background: `linear-gradient(${col}, ${col}cc)`, boxShadow: `0 0 8px ${col}aa` }} />
              <div style={{ position: 'absolute', left: hit[0] - 10, top: hit[1] - 5, width: 20, height: 11,
                borderRadius: '50%', background: col, boxShadow: `0 0 16px 5px ${col}77` }} />
            </div>
          );
        })() : null}

        {/* ── CNC gantry (mill + laser + camera) ── */}
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: dim('gantry'), transition: 'opacity 0.6s' }}>
        <IsoBox x={10} y={gy} z={52} w={32} d={90} h={290} top="#54524c" right="#3f3d39" left="#33312d" />
        <IsoBox x={394} y={gy} z={52} w={32} d={90} h={290} top="#54524c" right="#3f3d39" left="#33312d" />
        <IsoBox x={10} y={gy + 8} z={342} w={416} d={72} h={62} top="#6a675f" right="#565349" left="#454239" />
        {/* X rail on the beam + X stepper */}
        <IsoBox x={16} y={gy + 4} z={352} w={404} d={8} h={12} top="#c8c5bd" right="#a9a69e" left="#8f8c84" />
        <IsoBox x={426} y={gy + 20} z={348} w={38} d={38} h={38} top="#26241f" right="#1c1a17" left="#141311" />
        <IsoBox x={cx - 40} y={gy - 28} z={182} w={80} d={42} h={158} top="#3c3a33" right="#2f2d29" left="#262422" />
        {/* spindle */}
        <IsoBox x={cx - 12} y={gy - 24} z={112} w={24} d={24} h={72} top="#aca9a2" right="#94918b" left="#7e7b76" />
        <IsoBox x={cx - 3} y={gy - 13} z={88} w={6} d={6} h={26} top="#d6d3cd" right="#c2bfb9" left="#aeaba5" />
        {/* dust shoe */}
        <IsoBox x={cx - 24} y={gy - 35} z={84} w={48} d={44} h={14} top="#3a3833" right="#2c2a26" left="#232120" alpha={0.75} />
        {/* stencil laser emitter */}
        <IsoBox x={cx - 36} y={gy - 18} z={118} w={12} d={12} h={42} top="#5a2c28" right="#48211e" left="#3a1a17" />
        {/* camera pod */}
        <IsoBox x={cx + 22} y={gy - 22} z={142} w={26} d={26} h={44} top="#2b2924" right="#211f1c" left="#191715" />
        {camGlow > 0 && (
          <div style={{
            position: 'absolute', left: P(cx + 35, gy - 9, 56)[0], top: P(cx + 35, gy - 9, 56)[1],
            width: 200, height: 100, transform: 'translate(-50%,-50%)', borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(255,235,200,${0.55 * camGlow}), rgba(255,235,200,0) 70%)`,
            filter: 'blur(4px)'
          }} />
        )}
        {spindleGlow > 0 && (
          <div style={{
            position: 'absolute', left: P(cx, gy - 10, 88)[0], top: P(cx, gy - 10, 88)[1],
            width: 70, height: 70, transform: 'translate(-50%,-50%)', borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,244,220,${0.95 * spindleGlow}), rgba(255,170,80,${0.5 * spindleGlow}) 45%, transparent 72%)`
          }} />
        )}
        {laserGlow > 0 && (
          <div style={{
            position: 'absolute', left: P(cx - 30, gy - 12, 66)[0], top: P(cx - 30, gy - 12, 66)[1],
            width: 56, height: 56, transform: 'translate(-50%,-50%)', borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,240,235,${0.95 * laserGlow}), ${LASER}88 40%, transparent 70%)`,
            boxShadow: `0 0 22px 6px rgba(255,90,78,${0.5 * laserGlow})`
          }} />
        )}
        </div>

        {/* ── Reflow oven (right rear, behind the 3D printer · entry port faces the bed) ── */}
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: dim('oven'), transition: 'opacity 0.6s' }}>
        <IsoBox x={404} y={248} z={26} w={152} d={142} h={12} top="#2b2925" right="#201e1b" left="#191715" />
        <IsoBox x={404} y={248} z={38} w={152} d={142} h={126} top="#eceae5" right="#dbd8d1" left="#c2bfb8" />
        <Face at={P(404.5, 258, 148)} mat={ML} w={122} h={94} style={{
          background: ovenGlow > 0
            ? `linear-gradient(rgba(22,18,15,0.98), rgba(255,120,40,${0.55 * ovenGlow}))`
            : '#171512',
          borderRadius: 6,
          boxShadow: ovenGlow > 0 ? `inset 0 0 34px rgba(255,140,60,${0.85 * ovenGlow})` : 'inset 0 0 18px rgba(0,0,0,0.8)'
        }} />
        {[0, 1, 2, 3].map(i => (
          <Face key={'ov' + i} at={P(424 + i * 30, 262, 164.5)} mat={MT} w={9} h={114}
            style={{ background: '#b8b5ae', borderRadius: 4 }} />
        ))}
        <Face at={P(436, 247, 122)} mat={MR} w={64} h={16} style={{
          background: '#141311', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: MONO, fontSize: 11, letterSpacing: 1,
          color: ovenGlow > 0.2 ? '#ff9a4d' : '#4a4640'
        }}>{ovenGlow > 0.2 ? '245°C' : 'IDLE'}</Face>
        {ovenGlow > 0 && (
          <div style={{ position: 'absolute', left: P(480, 320, 100)[0], top: P(480, 320, 100)[1],
            width: 320, height: 170, transform: 'translate(-50%,-50%)', borderRadius: '50%', pointerEvents: 'none',
            background: `radial-gradient(ellipse, rgba(255,130,50,${0.38 * ovenGlow}), transparent 70%)`, filter: 'blur(8px)' }} />
        )}
        </div>

        {/* ── Dispenser unit (mask + paste + UV cure) — fixed bridge at rear ── */}
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: dim('disp'), transition: 'opacity 0.6s' }}>
        <IsoBox x={24} y={300} z={52} w={26} d={64} h={200} top="#4a4842" right="#3a3833" left="#2f2d29" />
        <IsoBox x={356} y={300} z={52} w={26} d={64} h={200} top="#4a4842" right="#3a3833" left="#2f2d29" />
        <IsoBox x={14} y={296} z={252} w={386} d={72} h={64} top="#5d5a53" right="#4c4a44" left="#3e3c37" />
        {/* UV LED strip under the bridge */}
        <IsoBox x={30} y={306} z={244} w={354} d={10} h={8}
          top={uvOn > 0 ? UV : '#3a3845'} right={uvOn > 0 ? '#7463d9' : '#2e2e3a'} left="#26262f" />
        {/* dispenser head (mask nozzle + paste squeegee carrier) */}
        <IsoBox x={dx} y={290} z={170 - dispDown * 60} w={50} d={40} h={82} top="#33312c" right="#282622" left="#201e1b" />
        <IsoBox x={dx + 21} y={296} z={146 - dispDown * 60} w={8} d={8} h={24} top="#cfccc5" right="#b5b2ab" left="#9c9992" />
        {/* film roll on top of the bridge */}
        <IsoBox x={110} y={308} z={320} w={220} d={46} h={46} top="#75726b" right="#605d57" left="#4f4d48"
          st={{ borderRadius: 23 }} sr={{ borderRadius: '0 0 23 23' }} sl={{ borderRadius: '0 0 23 23' }} />
        <IsoBox x={102} y={314} z={326} w={8} d={34} h={34} top="#3a3833" right="#2c2a26" left="#232120" />
        <IsoBox x={330} y={314} z={326} w={8} d={34} h={34} top="#3a3833" right="#2c2a26" left="#232120" />
        </div>

        {/* ── 3D printer bay (right side) ── */}
        <IsoBox x={398} y={50} z={26} w={4} d={320} h={310} top="#55534e" right="#45433e" left="#3a3833" alpha={0.85} />
        {/* pass-through port to the reflow oven */}
        <Face at={P(397.5, 252, 92)} mat={ML} w={104} h={44} style={{ background: '#131211', borderRadius: 5 }} />
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: dim('printer'), transition: 'opacity 0.6s' }}>
        <IsoBox x={420} y={128} z={26} w={115} d={115} h={14} top="#3c3a36" right="#2f2d2a" left="#262421" />
        {/* mold: red base + cyan body, grows with progress */}
        <IsoBox x={445} y={153} z={40} w={64} d={64} h={10} top="#b04a40" right="#8f3a32" left="#7a2f28" />
        {!moldCarry && (
          <IsoBox x={445} y={153} z={50} w={64} d={64} h={4 + printProg * 46} top="#8fd8de" right="#5fb3bc" left="#4d99a2" />
        )}
        {/* printer column + arm + head */}
        <IsoBox x={540} y={178} z={26} w={12} d={12} h={230} top="#4a4843" right="#3a3833" left="#2f2d29" />
        <IsoBox x={hx - 4} y={hy} z={hz + 26} w={556 - hx} d={10} h={10} top="#54524c" right="#434139" left="#363430" />
        <IsoBox x={hx - 8} y={hy - 3} z={hz} w={16} d={16} h={26} top="#c4c1ba" right="#a4a19a" left="#8b8881" />
        </div>

        {/* carried mold (component cassette) flying over the wall to the board */}
        {moldCarry && (
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <IsoBox x={445 + moldDX} y={153 + moldDY} z={50 + moldDZ} w={64} d={64} h={50}
              top="#8fd8de" right="#5fb3bc" left="#4d99a2" />
            <div style={{ position: 'absolute', left: P(477 + moldDX, 185 + moldDY, 50 + moldDZ)[0],
              top: P(477 + moldDX, 185 + moldDY, 50 + moldDZ)[1] + 8, width: 120, height: 40,
              transform: 'translate(-50%,0)', borderRadius: '50%', pointerEvents: 'none',
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.35), transparent 70%)', filter: 'blur(5px)' }} />
          </div>
        )}
      </div>

      {/* shell */}
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: shellAlpha }}>
        <Rise p={stg(0)} dz={50}>
          <IsoBox x={8} y={8} z={0} w={544} d={404} h={26} top="#3a3833" right="#23211d" left="#1a1815" />
        </Rise>
        <Rise p={stg(1)} dz={70}>
          <IsoBox x={0} y={0} z={26} w={560} d={420} h={430}
            top="#f1efeb" right="#e2dfd9" left="#ccc9c2" />
          <Face at={P(48, -1, 430)} mat={MR} w={340} h={360} style={{
            background: 'linear-gradient(155deg, rgba(26,24,22,0.93), rgba(52,47,42,0.88) 55%, rgba(30,28,25,0.95))',
            border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16,
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)'
          }} />
          {/* printer-bay window */}
          <Face at={P(406, -1, 430)} mat={MR} w={106} h={200} style={{
            background: 'linear-gradient(155deg, rgba(26,24,22,0.93), rgba(46,42,38,0.88))',
            border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12
          }} />
          <Face at={P(238, -2, 64)} mat={MR} w={90} h={7} style={{ background: '#191816', borderRadius: 4 }} />
          <Face at={P(48, -2, 56)} mat={MR} w={240} h={20} style={{
            fontFamily: MONO, fontSize: 14, letterSpacing: 7, color: '#8a857c',
            display: 'flex', alignItems: 'center'
          }}>PROTOPULSE</Face>
          <Face at={P(520, -2, 58)} mat={MR} w={12} h={12} style={{
            background: led, borderRadius: '50%',
            boxShadow: ledGlow ? `0 0 14px 3px ${led}` : 'none'
          }} />
          {startBtn > 0 && (
            <Face at={P(430, -3, 150)} mat={MR} w={56} h={56} style={{
              borderRadius: '50%', border: `2px solid ${ACC}`, opacity: startBtn,
              boxShadow: `0 0 ${18 * startBtn}px color-mix(in oklab, ${'var(--acc)'} 60%, transparent)`
            }} />
          )}
        </Rise>
        <Rise p={stg(2)} dz={-70}>
          <IsoBox x={0} y={0} z={456} w={560} d={420} h={44} top="#2f2d29" right="#262421" left="#1e1c1a" />
          {[0, 1, 2, 3, 4].map(i => (
            <Face key={i} at={P(340 + i * 34, 60, 500.5)} mat={MT} w={7} h={300}
              style={{ background: '#1b1a17', borderRadius: 4 }} />
          ))}
        </Rise>
      </div>

      {/* module glows — over the (x-ray) shell */}
      {moduleGlows.map((gk, i) => {
        const spec = typeof gk === 'string' ? { at: gk, color: 'var(--acc)', a: 1 } : gk;
        const [gx, gyy, gz, rx, ry] = GLOWS[spec.at];
        const pt = P(gx, gyy, gz);
        return (
          <div key={i} style={{
            position: 'absolute', left: pt[0], top: pt[1], width: rx, height: ry,
            transform: 'translate(-50%,-50%)', borderRadius: '50%', pointerEvents: 'none',
            background: `radial-gradient(ellipse, color-mix(in oklab, ${spec.color} ${Math.round(45 * (spec.a ?? 1))}%, transparent), transparent 70%)`,
            filter: 'blur(6px)'
          }} />
        );
      })}
    </div>
  );
}

function Cam({ x = 0, y = 0, s = 1, children }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 960, top: 540, transform: `translate(${x}px,${y}px) scale(${s})` }}>
        <div style={{ position: 'absolute', transform: 'translate(-60px,5px)' }}>{children}</div>
      </div>
    </div>
  );
}

/* ---------- captions ---------- */
function Chip({ no, label, sub, p = 1 }) {
  const e = Easing.easeOutCubic(cl(p));
  return (
    <div style={{
      position: 'absolute', left: 120, top: 952, opacity: e,
      transform: `translateY(${(1 - e) * 16}px)`, display: 'flex', alignItems: 'baseline', gap: 22
    }}>
      <span style={{ fontFamily: MONO, fontSize: 22, color: ACC, letterSpacing: 3, whiteSpace: 'nowrap', flexShrink: 0 }}>{no}</span>
      <span style={{ fontFamily: FONT, fontSize: 34, fontWeight: 600, color: INK, letterSpacing: 0.5, whiteSpace: 'nowrap', flexShrink: 0 }}>{label}</span>
      {sub ? <span style={{ fontFamily: MONO, fontSize: 17, color: MUT, letterSpacing: 1, whiteSpace: 'nowrap', flexShrink: 0 }}>{sub}</span> : null}
    </div>
  );
}

/* active-unit badge */
function UnitTag({ unit, p = 1 }) {
  return (
    <div style={{ position: 'absolute', left: 120, top: 900, opacity: Easing.easeOutCubic(cl(p)),
      display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACC, boxShadow: `0 0 10px ${ACC}` }} />
      <span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: MUT, whiteSpace: 'nowrap', flexShrink: 0 }}>ACTIVE UNIT — {unit}</span>
    </div>
  );
}

/* ---------- board artwork (150 × 100 mm @ 8 px/mm) ---------- */
const BW = 1200, BH = 800;
const IC_L = [0,1,2,3,4,5,6,7].map(i => ({ x: 434, y: 290 + i * 30 - 8, w: 36, h: 16 }));
const IC_R = [0,1,2,3,4,5,6,7].map(i => ({ x: 694, y: 290 + i * 30 - 8, w: 36, h: 16 }));
const PASS = [[327,230],[327,570],[873,230],[873,570]].flatMap(([cx,cy]) => [
  { x: cx - 40, y: cy - 10, w: 26, h: 20 }, { x: cx + 14, y: cy - 10, w: 26, h: 20 }
]);
const CONN = [0,1,2,3,4,5].map(i => ({ x: 450 + i * 60 - 12, y: 668, w: 24, h: 44 }));
const PADS = [...IC_L, ...IC_R, ...PASS, ...CONN];
const VIAS = [[330,470],[880,480],[510,548],[640,548],[630,620],[820,615]];
const TRACES = [
  [[434,298],[380,298],[380,230],[354,230]],
  [[434,358],[360,358],[360,570],[354,570]],
  [[434,418],[330,418],[330,470]],
  [[730,298],[790,298],[790,230],[846,230]],
  [[730,358],[820,358],[820,570],[846,570]],
  [[730,418],[880,418],[880,480]],
  [[450,668],[450,500],[434,500]],
  [[510,668],[510,548]],
  [[570,668],[570,590],[640,590],[640,548]],
  [[690,668],[690,500],[730,500]],
  [[630,668],[630,620]],
  [[750,668],[750,615],[820,615]]
];
const plLen = pts => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]); return L; };
const TLEN = TRACES.map(plLen);
const TTOT = TLEN.reduce((a, b) => a + b, 0);
const TCUM = TLEN.reduce((a, l) => (a.push((a[a.length-1] || 0) + l), a), []);
function millPoint(u) {
  let d = cl(u) * TTOT, i = 0;
  while (i < TLEN.length - 1 && d > TCUM[i]) i++;
  let local = d - (i ? TCUM[i-1] : 0), pts = TRACES[i];
  for (let k = 1; k < pts.length; k++) {
    const seg = Math.hypot(pts[k][0]-pts[k-1][0], pts[k][1]-pts[k-1][1]);
    if (local <= seg) { const f = seg ? local / seg : 0;
      return [pts[k-1][0] + (pts[k][0]-pts[k-1][0]) * f, pts[k-1][1] + (pts[k][1]-pts[k-1][1]) * f]; }
    local -= seg;
  }
  return pts[pts.length - 1];
}
/* stencil film with punched apertures (evenodd path) */
const holeRect = (p, m = 5) => `M${p.x - m} ${p.y - m}h${p.w + 2 * m}v${p.h + 2 * m}h${-(p.w + 2 * m)}z`;
const filmPath = (n) => `M0 0H${BW}V${BH}H0Z ` + PADS.slice(0, n).map(p => holeRect(p)).join(' ');

function BoardSurface({ children }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: BW, height: BH,
      background: 'linear-gradient(135deg,#e0a668 0%,#c07f44 45%,#d1904f 75%,#b87b40 100%)' }}>
      {[[80,80],[1120,80],[80,720]].map(([x,y],i) => (
        <div key={i} style={{ position: 'absolute', left: x - 14, top: y - 14, width: 28, height: 28,
          borderRadius: '50%', border: '4px solid rgba(255,250,240,0.85)',
          background: 'rgba(90,55,25,0.9)', backgroundClip: 'padding-box' }} />
      ))}
      {children}
    </div>
  );
}

function CopperArt({ padP = 1, traceU = 1, tone = '#5a3212' }) {
  return (
    <svg width={BW} height={BH} style={{ position: 'absolute', left: 0, top: 0 }}>
      {PADS.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={3}
          fill="#eab777" stroke={tone} strokeWidth={4}
          opacity={cl(padP * PADS.length - i)} />
      ))}
      {TRACES.map((pts, i) => {
        const prog = cl((cl(traceU) * TTOT - (i ? TCUM[i-1] : 0)) / TLEN[i]);
        if (prog <= 0) return null;
        const s = pts.map(p => p.join(',')).join(' ');
        return (
          <g key={i}>
            <polyline points={s} fill="none" stroke={tone} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog} opacity={0.75} />
            <polyline points={s} fill="none" stroke="#eab777" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog} />
          </g>
        );
      })}
      {VIAS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={9} fill="#eab777" stroke={tone} strokeWidth={4}
          opacity={cl(traceU * 8 - i)} />
      ))}
    </svg>
  );
}

function MaskPads({ p = 1 }) {
  return (
    <svg width={BW} height={BH} style={{ position: 'absolute', left: 0, top: 0 }}>
      {PADS.map((pd, i) => (
        <rect key={i} x={pd.x - 3} y={pd.y - 3} width={pd.w + 6} height={pd.h + 6} rx={4}
          fill="#eab777" stroke="#0d3b28" strokeWidth={3} opacity={cl(p * PADS.length - i)} />
      ))}
      {VIAS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={10} fill="#eab777" stroke="#0d3b28" strokeWidth={3} opacity={cl(p)} />
      ))}
    </svg>
  );
}

/* component bodies placed by the printed mold */
const COMPS = [
  { x: 482, y: 282, w: 196, h: 246, ic: true },
  { x: 295, y: 222, w: 64, h: 16 }, { x: 295, y: 562, w: 64, h: 16 },
  { x: 841, y: 222, w: 64, h: 16 }, { x: 841, y: 562, w: 64, h: 16 },
  { x: 438, y: 660, w: 330, h: 56, conn: true }
];
function CompBodies({ p = 1 }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: BW, height: BH }}>
      {COMPS.map((c, i) => {
        const a = cl(p * COMPS.length - i);
        return a > 0 && (
          <div key={i} style={{ position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h,
            background: c.ic ? 'linear-gradient(145deg,#2e2c29,#1c1b19)' : c.conn ? '#3a3a3d' : 'linear-gradient(#4a4844,#2c2b28)',
            borderRadius: c.ic ? 10 : 4, opacity: a,
            boxShadow: '0 5px 12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {c.ic && <div style={{ position: 'absolute', left: 16, top: 14, width: 24, height: 24, borderRadius: '50%', background: '#121110' }} />}
            {c.ic && <div style={{ position: 'absolute', left: 60, top: 108, fontFamily: MONO, fontSize: 24, color: '#8d897f', letterSpacing: 2 }}>PP-MCU</div>}
            {!c.ic && !c.conn && (
              <div style={{ position: 'absolute', inset: 0 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 13, background: '#c8c5be' }} />
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 13, background: '#c8c5be' }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- HMI panel ---------- */
const HMI_W = 780, HMI_S = HMI_W / BW;
function HMI({ idx, total = 9, title, prog, p = 1, telem, gcode, t = 0, children }) {
  const e = Easing.easeOutCubic(cl(p));
  return (
    <div style={{ position: 'absolute', left: 1020, top: 208, width: HMI_W, opacity: e,
      transform: `translateY(${(1 - e) * 24}px)` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'baseline', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <span style={{ fontFamily: MONO, fontSize: 18, color: ACC, letterSpacing: 2, whiteSpace: 'nowrap' }}>
            STEP {String(idx).padStart(2, '0')}/{String(total).padStart(2, '0')}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 18, color: MUT, letterSpacing: 2, whiteSpace: 'nowrap' }}>{title}</span>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 19, color: INK }}>{Math.round(cl(prog) * 100)}%</span>
      </div>
      <div style={{ position: 'relative', width: HMI_W, height: BH * HMI_S + 2,
        border: '1px solid rgba(255,255,255,0.13)', borderRadius: 10, overflow: 'hidden',
        background: '#0c0b0a', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `scale(${HMI_S})` }}>
          {children}
          <Ruler />
          {gcode && <GTicker lines={gcode} t={t} />}
        </div>
      </div>
      <div style={{ marginTop: 12, height: 3, background: 'rgba(255,255,255,0.10)', borderRadius: 2 }}>
        <div style={{ width: `${cl(prog) * 100}%`, height: '100%', background: ACC, borderRadius: 2 }} />
      </div>
      {telem && <Telemetry items={telem} t={t} />}
    </div>
  );
}

const RAIL = ['SCAN','MILL','CLEAN','MASK','CURE','STENCIL','PASTE','PLACE','REFLOW'];
function StepRail({ active }) {
  return (
    <div style={{ position: 'absolute', left: 120, top: 96, display: 'flex', gap: 14 }}>
      {RAIL.map((n, i) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 9, height: 9, borderRadius: 2,
            background: i === active ? ACC : i < active ? 'color-mix(in oklab, var(--acc) 45%, transparent)' : 'rgba(255,255,255,0.16)' }} />
          <span style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 2,
            color: i === active ? INK : 'rgba(141,137,127,0.55)' }}>{n}</span>
        </div>
      ))}
    </div>
  );
}

/* shared step layout: machine performing (left) + HMI close-up (right) */
function StepShot({ idx, title, chipNo, chipLabel, chipSub, unit, prog, pose, t, callouts = [], telem, gcode, children }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Cam x={-460} y={20} s={0.82}>
        <Machine shellAlpha={0.09} led="var(--acc)" ledGlow {...pose} />
        {callouts.map((c, i) => (
          <Callout key={i} {...c} p={(t - 1.1 - i * 0.6) / 0.5} />
        ))}
      </Cam>
      <StepRail active={idx - 1} />
      <HMI idx={idx} title={title} prog={prog} p={(t - 0.2) / 0.5} telem={telem} gcode={gcode} t={t}>{children}</HMI>
      <UnitTag unit={unit} p={(t - 0.3) / 0.5} />
      <Chip no={chipNo} label={chipLabel} sub={chipSub} p={(t - 0.4) / 0.5} />
    </div>
  );
}

function FadeIn({ t, d = 0.4, children }) {
  return <div style={{ position: 'absolute', inset: 0, opacity: Easing.easeOutQuad(cl(t / d)) }}>{children}</div>;
}

/* ---------- intro scenes ---------- */
function S1_Hero() {
  const { localTime: t } = useSprite();
  const asm = cl((t - 0.5) / 2.4);
  const s = interpolate([0, 8], [0.78, 0.86], Easing.linear)(t);
  const tOp = interpolate([0.3, 1.2, 6.6, 7.6], [0, 1, 1, 0])(t);
  const sOp = interpolate([1.6, 2.5, 6.6, 7.6], [0, 1, 1, 0])(t);
  return (
    <FadeIn t={t}>
      <Cam x={330} y={40} s={s}>
        <Machine assemble={asm} led={t > 3 ? 'var(--acc)' : '#3a3833'} ledGlow={t > 3} printProg={0.4} printT={t} />
        <DimLine from={[0, 0, -70]} to={[560, 0, -70]} label="560 mm" p={interpolate([3.4, 4.2, 6.8, 7.6], [0, 1, 1, 0])(t)} />
        <DimLine from={[615, 10, -20]} to={[615, 420, -20]} label="420 mm" p={interpolate([3.8, 4.6, 6.8, 7.6], [0, 1, 1, 0])(t)} />
        <DimLine from={[-50, 470, 0]} to={[-50, 470, 500]} label="500 mm" p={interpolate([4.2, 5.0, 6.8, 7.6], [0, 1, 1, 0])(t)} />
      </Cam>
      <div style={{ position: 'absolute', left: 130, top: 330, opacity: tOp }}>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 8, color: ACC }}>DESKTOP PCB FAB</div>
        <div style={{ fontFamily: FONT, fontSize: 128, fontWeight: 700, color: INK, letterSpacing: -3, lineHeight: 1.02, marginTop: 18 }}>
          Protopulse
        </div>
      </div>
      <div style={{ position: 'absolute', left: 134, top: 560, opacity: sOp, fontFamily: FONT, fontSize: 38, color: MUT, lineHeight: 1.45 }}>
        Gerber in.<br />Assembly-ready PCB out.
      </div>
    </FadeIn>
  );
}

function S2_Insert() {
  const { localTime: t } = useSprite();
  const pcb = Easing.easeInOutCubic(cl((t - 1.2) / 2.4));
  const xray = interpolate([0.6, 1.6, 4.6, 5.8], [1, 0.13, 0.13, 1])(t);
  const btn = interpolate([4.4, 5.0], [0, 1])(t);
  const pressed = t > 5.9;
  return (
    <FadeIn t={t}>
      <Cam x={40} y={60} s={0.92}>
        <Machine shellAlpha={xray} pcbY={pcb} gantryY={0.92} carX={0.5}
          led={pressed ? 'var(--acc)' : '#4a4843'} ledGlow={pressed} printT={t}
          startBtn={btn * (pressed ? 1 : 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * 7)))} />
        <Callout at={[240, 160, 58]} text="FR4 · 100 × 150 mm" sub="35 µm copper, single clamp" dx={170} dy={-110} p={(t - 2.6) / 0.5} />
        <Callout at={[388, -2, 240]} text="INTERLOCKED DOOR" sub="class-1 laser containment" dx={110} dy={-70} p={(t - 4.2) / 0.5} />
      </Cam>
      <Chip no="SETUP" label="Insert. Close. Start." sub="the only three things a human does" p={(t - 0.4) / 0.5} />
    </FadeIn>
  );
}

/* ---------- 8 process steps ---------- */
const STEP_D = 6.5;

function Step1_Scan() {
  const { localTime: t } = useSprite();
  const u = cl((t - 0.5) / 5.2);
  const sweep = Easing.easeInOutQuad(cl((t - 0.6) / 2.2));
  const sy = sweep * (BH + 140) - 70;
  const gridP = cl((t - 4.0) / 1.6);
  return (
    <FadeIn t={t}>
      <StepShot idx={1} title="VISION · HEIGHT MAP" chipNo="01" chipLabel="Camera scan + height map"
        chipSub="fiducial lock · ±0.01 mm surface model" unit="CNC GANTRY · CAMERA" prog={u} t={t}
        telem={[
          ['FIDUCIALS', (t2) => `${Math.max(0, Math.min(3, Math.floor((t2 - 2.4) / 0.45)))}/3`],
          ['Z-POINTS', (t2) => `${Math.floor(cl((t2 - 4) / 1.6) * 24)}/24`],
          ['FLATNESS', '38 µm'],
          ['SENSOR', '12 MP GS']
        ]}
        gcode={['G28 · HOME ALL', 'G38.2 Z-5 F120 · PROBE', 'G0 X12.5 Y8.0', 'FIDUCIAL LOCK F1 OK', 'FIDUCIAL LOCK F2 OK', 'FIDUCIAL LOCK F3 OK', 'MAP GRID 6×4', 'PLANE FIT RMS 6 µm']}
        callouts={[
          { at: [240, 160, 56], text: 'FR4 BLANK · 35 µm Cu', sub: '100 × 150 mm, clamped once', dx: 150, dy: 60 },
          { at: [16, 220, 62], text: 'MGN12 RAIL · Y', sub: 'preloaded carriages', dx: 90, dy: -170 }
        ]}
        pose={{ gantryY: 0.88 - Easing.easeInOutQuad(cl((t - 0.4) / 5)) * 0.66, carX: 0.5 + Math.sin(t * 1.5) * 0.24, camGlow: 1, moduleGlows: ['bed'], focus: 'gantry', printT: t }}>
        <BoardSurface>
          {sweep < 1 && (
            <div style={{ position: 'absolute', left: 0, top: sy - 110, width: BW, height: 110,
              background: `linear-gradient(to bottom, transparent, color-mix(in oklab, ${'var(--acc)'} 55%, transparent))`,
              borderBottom: `4px solid ${ACC}` }} />
          )}
          {[[80,80],[1120,80],[80,720]].map(([x,y],i) => {
            const p = Easing.easeOutBack(cl((t - 2.6 - i * 0.45) / 0.4));
            return p > 0 && (
              <div key={i} style={{ position: 'absolute', left: x - 46, top: y - 46, width: 92, height: 92,
                borderRadius: '50%', border: `4px solid ${ACC}`, opacity: Math.min(p, 1),
                transform: `scale(${2 - p})` }} />
            );
          })}
          {gridP > 0 && [...Array(24)].map((_, i) => {
            const gx = 170 + (i % 6) * 172, gyp = 160 + Math.floor(i / 6) * 160;
            const pp = cl(gridP * 24 - i);
            const hgt = Math.sin(i * 2.7) * 0.5 + 0.5;
            return (
              <div key={i} style={{ position: 'absolute', left: gx - 8, top: gyp - 8, width: 16, height: 16,
                borderRadius: '50%', opacity: pp * 0.9,
                background: `color-mix(in oklab, ${'var(--acc)'} ${40 + hgt * 60}%, #5a3212)`,
                transform: `scale(${0.5 + pp * 0.5})` }} />
            );
          })}
        </BoardSurface>
      </StepShot>
    </FadeIn>
  );
}

function Step2_Mill() {
  const { localTime: t } = useSprite();
  const padP = cl((t - 0.3) / 1.0);
  const traceU = cl((t - 1.3) / 4.7);
  const [mx, my] = millPoint(traceU);
  const milling = traceU > 0 && traceU < 1;
  return (
    <FadeIn t={t}>
      <StepShot idx={2} title="CNC ISOLATION MILLING" chipNo="02" chipLabel="Isolation milling"
        chipSub="500 W ER11 · MGN12 rails · 1605 ball screws" unit="CNC GANTRY · SPINDLE"
        prog={(padP + traceU * 9) / 10} t={t}
        telem={[
          ['SPINDLE', (t2) => `${(59.2 + Math.sin(t2 * 9) * 0.6).toFixed(1)} kRPM`],
          ['FEED', '900 mm/min'],
          ['DOC', '0.05 mm'],
          ['TOOL', 'V 0.1mm 30°']
        ]}
        gcode={['T1 M6 · V-BIT 0.1 MM', 'M3 S60000', 'G0 Z1.000', 'G1 Z-0.050 F120', 'G1 X42.180 Y18.334 F900', 'G2 X44.510 Y31.080 I2.330', 'G1 X61.220 Y31.080', 'Z-COMP FROM HEIGHT MAP', 'G0 Z1.000']}
        callouts={[
          { at: [215, 185, 150], text: 'ER11 SPINDLE · 500 W', sub: 'runout < 5 µm · 60 kRPM', dx: 150, dy: -90 },
          { at: [47, 208, 62], text: '1605 BALL SCREW', sub: 'C7 · 5 mm lead', dx: 180, dy: 150, flip: true }
        ]}
        pose={{ gantryY: 0.35 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2.1)), carX: 0.5 + 0.3 * Math.sin(t * 3.3), spindleGlow: milling ? 1 : 0.3, focus: 'gantry', printT: t }}>
        <BoardSurface>
          <CopperArt padP={padP} traceU={traceU} />
          {milling && (
            <div style={{ position: 'absolute', left: mx - 14, top: my - 14, width: 28, height: 28, borderRadius: '50%',
              background: 'radial-gradient(circle, #fff8ec, #ffcf8a 45%, rgba(255,150,60,0) 75%)',
              boxShadow: '0 0 28px 9px rgba(255,180,90,0.55)' }} />
          )}
        </BoardSurface>
      </StepShot>
    </FadeIn>
  );
}

const DUST = [...Array(26)].map((_, i) => [
  ((i * 379) % 1100) + 50, ((i * 227) % 700) + 50, 3 + (i % 4) * 2
]);
function Step3_Clean() {
  const { localTime: t } = useSprite();
  const sweep = Easing.easeInOutQuad(cl((t - 0.8) / 3.4));
  const sx = sweep * (BW + 200) - 100;
  return (
    <FadeIn t={t}>
      <StepShot idx={3} title="VACUUM + CLEAN" chipNo="03" chipLabel="Automatic cleaning"
        chipSub="dust shoe · cyclone separator · sealed bin" unit="CNC GANTRY · VACUUM" prog={sweep} t={t}
        telem={[
          ['VACUUM', '−18 kPa'],
          ['CYCLONE', '92% sep'],
          ['FILTER', 'HEPA H13'],
          ['BIN LEVEL', (t2) => `${12 + Math.floor(cl((t2 - 0.8) / 3.4) * 9)}%`]
        ]}
        gcode={['M7 · DUST SHOE DOWN', 'VAC ON · −18 kPa', 'G1 X0 Y0 F2400', 'SERPENTINE PASS 1/3', 'SERPENTINE PASS 2/3', 'SERPENTINE PASS 3/3', 'VAC OFF · SHOE UP']}
        callouts={[
          { at: [110, 330, 70], text: 'CYCLONE + BIN', sub: 'tool-free removal', dx: 120, dy: 100 },
          { at: [215, 185, 96], text: 'DUST SHOE', sub: 'brush skirt seal', dx: 150, dy: -110 }
        ]}
        pose={{ gantryY: 0.5 + 0.4 * Math.sin(t * 1.2), carX: sweep, moduleGlows: ['bin'], focus: 'gantry', printT: t }}>
        <BoardSurface>
          <CopperArt padP={1} traceU={1} />
          {DUST.map(([dx2, dy, r], i) => (
            <div key={i} style={{ position: 'absolute', left: dx2, top: dy, width: r * 2, height: r * 2,
              borderRadius: '50%', background: 'rgba(70,42,18,0.8)', opacity: dx2 < sx ? 0 : 0.85,
              transition: 'opacity 0.3s' }} />
          ))}
          {sweep > 0.01 && sweep < 0.99 && (
            <div style={{ position: 'absolute', left: sx - 40, top: 0, width: 80, height: BH,
              background: `linear-gradient(to right, transparent, color-mix(in oklab, ${'var(--acc)'} 25%, transparent), transparent)` }} />
          )}
        </BoardSurface>
      </StepShot>
    </FadeIn>
  );
}

function Step4_Mask() {
  const { localTime: t } = useSprite();
  const slide = Easing.easeInOutCubic(cl((t - 0.2) / 1.1));
  const lam = Easing.easeInOutQuad(cl((t - 1.6) / 3.6));
  const busy = lam > 0.01 && lam < 0.99;
  const q = cl(lam);
  return (
    <FadeIn t={t}>
      <StepShot idx={4} title="SOLDER MASK · DISPENSER" chipNo="04" chipLabel="Solder mask application"
        chipSub="board shuttles under the dispenser · nozzle coats it live" unit="DISPENSER UNIT · MASK NOZZLE" prog={lam} t={t}
        telem={[
          ['SHUTTLE', (t2) => (Easing.easeInOutCubic(cl((t2 - 0.2) / 1.1)) < 1 ? 'MOVING…' : 'DOCKED ✓')],
          ['NOZZLE', '0.4 mm slot'],
          ['WET FILM', '25 µm'],
          ['COVERAGE', (t2) => `${Math.round(Easing.easeInOutQuad(cl((t2 - 1.6) / 3.6)) * 100)}%`]
        ]}
        gcode={['SHUTTLE → DISPENSER', 'DOCK CONFIRMED', 'DISP HEAD · MASK MODE', 'HEAD DOWN · 4 mm', 'PRIME 0.2 ml', 'RASTER PASS 1/2', 'RASTER PASS 2/2', 'EDGE TRIM']}
        callouts={[
          { at: [210, 332, 290], text: 'DISPENSER BRIDGE', sub: 'fixed twin-column, 3 tools', dx: 140, dy: -90 },
          { at: [240, 300, 78], text: 'LPI MASK · LIVE COAT', sub: 'nozzle 4 mm above board', dx: 170, dy: 90 }
        ]}
        pose={{ gantryY: 0.06, carX: 0.1, moduleGlows: ['disp'], focus: 'disp',
          pcbDY: slide * 90, dispDown: slide,
          dispX: busy ? 0.36 + 0.6 * (0.5 - 0.5 * Math.cos(t * 5.2)) : 0.66,
          dispJet: busy ? '#2ea56e' : 0,
          boardTint: `linear-gradient(180deg, #1e7a52 0%, #17603f ${q * 100}%, #d1904f ${q * 100}%, #c07f44 100%)`, printT: t }}>
        <BoardSurface>
          <CopperArt padP={1} traceU={1} />
          <div style={{ position: 'absolute', left: 0, top: 0, width: BW, height: lam * BH,
            background: GRN, boxShadow: 'inset 0 -2px 0 rgba(255,255,255,0.2)' }} />
          {busy && (() => {
            const nx = BW * (0.08 + 0.84 * (0.5 - 0.5 * Math.cos(t * 5.2)));
            const ny = lam * BH;
            return (
              <div style={{ position: 'absolute', left: 0, top: 0 }}>
                <div style={{ position: 'absolute', left: nx - 10, top: ny - 210, width: 20, height: 150,
                  background: 'linear-gradient(#8d8a83,#c8c5be)', borderRadius: 10 }} />
                <div style={{ position: 'absolute', left: nx - 40, top: ny - 250, width: 80, height: 90,
                  background: 'linear-gradient(#4a4842,#2f2d29)', borderRadius: 12,
                  boxShadow: '0 14px 30px rgba(0,0,0,0.5)' }} />
                <div style={{ position: 'absolute', left: nx - 7, top: ny - 66, width: 14, height: 66,
                  background: 'linear-gradient(#2ea56e,#1e7a52)' }} />
                <div style={{ position: 'absolute', left: nx - 30, top: ny - 15, width: 60, height: 30,
                  borderRadius: '50%', background: '#2ea56e', boxShadow: '0 0 30px 10px rgba(46,165,110,0.45)' }} />
              </div>
            );
          })()}
        </BoardSurface>
      </StepShot>
    </FadeIn>
  );
}

function Step5_Cure() {
  const { localTime: t } = useSprite();
  const uvOn = interpolate([0.9, 1.4, 4.8, 5.6], [0, 1, 1, 0])(t);
  return (
    <FadeIn t={t}>
      <StepShot idx={5} title="UV CURE · DISPENSER" chipNo="05" chipLabel="UV curing"
        chipSub="LED array inside the dispenser unit · hard solderable finish" unit="DISPENSER UNIT · UV ARRAY"
        prog={cl((t - 0.8) / 4.6)} t={t}
        telem={[
          ['WAVELENGTH', '405 nm'],
          ['IRRADIANCE', '1.2 W/cm²'],
          ['DOSE', (t2) => `${Math.round(cl((t2 - 0.9) / 4.2) * 600)} mJ/cm²`],
          ['TACK', (t2) => (t2 > 5 ? 'FREE ✓' : 'CURING…')]
        ]}
        gcode={['UV ARRAY ON · 36 LED', 'INTERLOCK VERIFIED', 'DOSE RAMP 0→600', 'TACK-FREE CHECK', 'UV ARRAY OFF']}
        callouts={[
          { at: [210, 311, 246], text: 'UV LED BAR · 405 nm', sub: '36 emitters + reflector', dx: 150, dy: -80 }
        ]}
        pose={{ gantryY: 0.06, carX: 0.1, uvOn, dispX: 0.5, pcbDY: 90, focus: 'disp',
          moduleGlows: uvOn > 0 ? [{ at: 'uv', color: UV, a: uvOn }, { at: 'bed', color: UV, a: uvOn * 0.7 }] : [],
          boardTint: GRN_T, printT: t }}>
        <BoardSurface>
          <div style={{ position: 'absolute', inset: 0, background: GRN }} />
          <MaskPads p={1} />
          {uvOn > 0 && (
            <div style={{ position: 'absolute', inset: 0, opacity: uvOn,
              backgroundColor: 'rgba(80,60,180,0.22)',
              backgroundImage: `repeating-linear-gradient(0deg, transparent 0 22px, ${UV}33 22px 24px), repeating-linear-gradient(90deg, transparent 0 22px, ${UV}33 22px 24px)` }} />
          )}
        </BoardSurface>
      </StepShot>
    </FadeIn>
  );
}

function Step6_Stencil() {
  const { localTime: t } = useSprite();
  const feed = Easing.easeInOutCubic(cl((t - 0.5) / 1.4));
  const cutU = cl((t - 2.0) / 4.0);
  const cutN = Math.floor(cutU * PADS.length);
  const cur = PADS[Math.min(cutN, PADS.length - 1)];
  const cutting = cutU > 0 && cutU < 1;
  return (
    <FadeIn t={t}>
      <StepShot idx={6} title="LASER STENCIL CUT" chipNo="06" chipLabel="Stencil cut on the same CNC"
        chipSub="film roll feeds over the docked board · laser cuts apertures" unit="CNC GANTRY · LASER"
        prog={(feed + cutU * 4) / 5} t={t}
        telem={[
          ['LASER', '5 W · 450 nm'],
          ['FILM', 'PET 100 µm'],
          ['KERF', '0.08 mm'],
          ['APERTURES', (t2) => `${Math.min(PADS.length, Math.floor(cl((t2 - 2) / 4) * PADS.length))}/${PADS.length}`]
        ]}
        gcode={['ROLL FEED 145 mm', 'M3 S255 · LASER ON', 'G1 X54.2 Y36.1 F1200', 'CUT APERTURE FIELD', 'KERF COMP +0.04 mm', 'M5 · LASER OFF', 'ROLL FEED → DISPENSER']}
        callouts={[
          { at: [220, 331, 352], text: 'STENCIL FILM ROLL', sub: 'PET 100 µm, indexed feed', dx: 140, dy: -70 },
          { at: [240, 300, 66], text: 'APERTURE FIELD', sub: 'kerf-compensated', dx: 160, dy: 90 }
        ]}
        pose={{ gantryY: 0.88 + 0.24 * ((cur.y || 0) / BH), carX: 0.15 + 0.7 * ((cur.x || 0) / BW),
          laserGlow: cutting ? 1 : 0, stencilF: feed, stencilA: 1, pcbDY: 90, focus: 'gantry',
          moduleGlows: ['roll'], boardTint: GRN_T, printT: t }}>
        <BoardSurface>
          <div style={{ position: 'absolute', inset: 0, background: GRN }} />
          <MaskPads p={1} />
          {/* film sliding in from top, apertures appear as the laser cuts */}
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-(1 - feed) * BH}px)` }}>
            <svg width={BW} height={BH} style={{ position: 'absolute', left: 0, top: 0 }}>
              <path d={filmPath(cutN)} fillRule="evenodd" fill="rgba(202,202,208,0.88)" />
              {cutting && (
                <rect x={cur.x - 5} y={cur.y - 5} width={cur.w + 10} height={cur.h + 10}
                  fill="none" stroke={LASER} strokeWidth={4} />
              )}
            </svg>
            {cutting && (
              <div style={{ position: 'absolute', left: cur.x + cur.w / 2 - 10, top: cur.y + cur.h / 2 - 10,
                width: 20, height: 20, borderRadius: '50%',
                background: `radial-gradient(circle, #fff, ${LASER} 45%, transparent 75%)`,
                boxShadow: `0 0 26px 8px ${LASER}66` }} />
            )}
          </div>
        </BoardSurface>
      </StepShot>
    </FadeIn>
  );
}

function Step7_Paste() {
  const { localTime: t } = useSprite();
  const sweep = Easing.easeInOutQuad(cl((t - 0.8) / 2.8));
  const lift = Easing.easeInOutCubic(cl((t - 4.4) / 1.2));
  const barY = sweep * BH;
  return (
    <FadeIn t={t}>
      <StepShot idx={7} title="PASTE THROUGH STENCIL" chipNo="07" chipLabel="Solder paste application"
        chipSub="squeegee presses paste through the laser-cut stencil" unit="DISPENSER UNIT · SQUEEGEE"
        prog={(sweep * 4 + lift) / 5} t={t}
        telem={[
          ['ALLOY', 'SAC305 T4'],
          ['BLADE', '45° · 2.4 N/mm'],
          ['SNAP-OFF', '0 mm'],
          ['DEPOSITS', (t2) => `${PADS.filter(pd => pd.y + pd.h / 2 < Easing.easeInOutQuad(cl((t2 - 0.8) / 2.8)) * BH).length}/${PADS.length}`]
        ]}
        gcode={['DISP HEAD · SQUEEGEE', 'STENCIL TENSION OK', 'PRIME PASTE 0.4 ml', 'SWEEP Y150→270 F300', 'PEEL 2 mm/s', 'VISION VERIFY 30/30']}
        callouts={[
          { at: [240, 290, 74], text: 'LASER-CUT STENCIL', sub: 'tensioned from the roll', dx: 160, dy: 90 },
          { at: [210, 332, 290], text: 'SQUEEGEE CARRIER', sub: 'closed-loop force', dx: 140, dy: -90 }
        ]}
        pose={{ gantryY: 0.06, carX: 0.1, dispX: 0.66, dispDown: 1, pcbDY: 90, focus: 'disp', moduleGlows: ['disp'],
          squeegeeY: sweep > 0.02 && sweep < 0.98 ? sweep : null,
          stencilF: 1, stencilA: 1 - lift, boardTint: GRN_T, printT: t }}>
        <BoardSurface>
          <div style={{ position: 'absolute', inset: 0, background: GRN }} />
          <MaskPads p={1} />
          {/* paste deposits (appear as squeegee passes, stay after film lifts) */}
          {PADS.map((pd, i) => {
            const on = pd.y + pd.h / 2 < barY || sweep >= 0.98;
            return on && (
              <div key={i} style={{ position: 'absolute',
                left: pd.x + pd.w / 2 - 12, top: pd.y + pd.h / 2 - 12, width: 24, height: 24, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, #e8e6e2, #a8a5a0 55%, #7e7b76)',
                boxShadow: '0 3px 8px rgba(0,0,0,0.4)' }} />
            );
          })}
          {/* stencil film on top; lifts away at the end */}
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - lift, transform: `translateY(${-lift * 60}px)` }}>
            <svg width={BW} height={BH} style={{ position: 'absolute', left: 0, top: 0 }}>
              <path d={filmPath(PADS.length)} fillRule="evenodd" fill="rgba(202,202,208,0.8)" />
            </svg>
          </div>
          {sweep > 0.01 && sweep < 0.99 && (
            <div style={{ position: 'absolute', left: -30, top: barY - 22, width: BW + 60, height: 44,
              borderRadius: 22, background: 'linear-gradient(#d8d5d0,#9a978f 60%,#7a776f)',
              boxShadow: '0 12px 26px rgba(0,0,0,0.5)', opacity: 1 - lift }} />
          )}
        </BoardSurface>
      </StepShot>
    </FadeIn>
  );
}

function Step9_Reflow() {
  const { localTime: t } = useSprite();
  const sin2 = Easing.easeInOutCubic(cl((t - 0.3) / 1.4));
  const sout = Easing.easeInOutCubic(cl((t - 5.2) / 1.1));
  const heat = interpolate([1.6, 2.3, 4.6, 5.2], [0, 1, 1, 0])(t);
  const melt = cl((t - 2.3) / 2.2);
  const temp = interpolate([0.4, 2.3, 3.4, 4.6, 6.3], [25, 150, 217, 245, 80])(t);
  const zone = t < 1.7 ? 'PREHEAT' : t < 2.9 ? 'SOAK' : t < 4.7 ? 'REFLOW' : 'COOL';
  return (
    <FadeIn t={t}>
      <StepShot idx={9} title="REFLOW OVEN" chipNo="09" chipLabel="Reflow soldering"
        chipSub="assembled board shuttles behind the wall into the oven · 245 °C peak" unit="REFLOW OVEN"
        prog={cl((t - 0.3) / 6)} t={t}
        telem={[
          ['ZONE', () => zone],
          ['TEMP', () => `${Math.round(temp)} °C`],
          ['PEAK', '245 °C'],
          ['TAL', (t2) => `${Math.max(0, Math.min(52, Math.round((t2 - 2.9) * 18)))} s`]
        ]}
        gcode={['SHUTTLE → OVEN', 'PORT SEALED', 'RAMP 1.8 °C/s', 'SOAK 150–180 °C', 'REFLOW PEAK 245 °C', 'COOL −3 °C/s', 'SHUTTLE → BED']}
        callouts={[
          { at: [480, 320, 150], text: 'REFLOW OVEN', sub: 'sealed chamber · SAC305', dx: 110, dy: -110 }
        ]}
        pose={{ gantryY: 0.06, carX: 0.1, pcbDX: (sin2 - sout) * 235, pcbDY: 90, ovenGlow: heat, focus: 'oven',
          moduleGlows: heat > 0 ? [{ at: 'oven', color: '#ff8a3d', a: heat }] : [],
          compsP: 1, printProg: 1, moldOnBoard: true, boardTint: GRN_T, printT: t }}>
        <BoardSurface>
          <div style={{ position: 'absolute', inset: 0, background: GRN }} />
          <MaskPads p={1} />
          {PADS.map((pd, i) => {
            const m = cl(melt * 1.3 - (i % 5) * 0.06);
            return (
              <div key={i} style={{ position: 'absolute',
                left: pd.x + pd.w / 2 - (12 - m * 2), top: pd.y + pd.h / 2 - (12 - m * 3),
                width: 24 - m * 4, height: 24 - m * 6, borderRadius: '50%',
                background: m > 0.5
                  ? 'radial-gradient(circle at 35% 25%, #ffffff, #d8dbe0 40%, #9aa0a8 75%)'
                  : 'radial-gradient(circle at 35% 30%, #e8e6e2, #a8a5a0 55%, #7e7b76)',
                boxShadow: m > 0.5 ? '0 2px 6px rgba(0,0,0,0.4), 0 0 10px rgba(255,255,255,0.35)' : '0 3px 8px rgba(0,0,0,0.4)' }} />
            );
          })}
          <CompBodies p={1} />
          {/* printed mold riding on the board through reflow */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(127,203,211,0.16)',
            border: '10px solid rgba(143,216,222,0.5)', boxSizing: 'border-box' }}>
            {COMPS.map((c, i) => (
              <div key={i} style={{ position: 'absolute', left: c.x - 20, top: c.y - 20, width: c.w + 20, height: c.h + 20,
                border: '5px solid rgba(143,216,222,0.6)', borderRadius: 8 }} />
            ))}
          </div>
          {heat > 0 && (
            <div style={{ position: 'absolute', inset: 0, opacity: heat * 0.55,
              background: 'linear-gradient(rgba(255,120,40,0.30), rgba(255,60,20,0.12) 60%, rgba(255,120,40,0.28))' }} />
          )}
        </BoardSurface>
      </StepShot>
    </FadeIn>
  );
}

function Step8_Place() {
  const { localTime: t } = useSprite();
  const lift = Easing.easeInOutCubic(cl((t - 0.3) / 1.0));
  const travel = Easing.easeInOutCubic(cl((t - 1.3) / 1.4));
  const down = Easing.easeInOutCubic(cl((t - 2.9) / 1.0));
  const up2 = Easing.easeInOutCubic(cl((t - 4.7) / 1.0));
  const comps = cl((t - 4.6) / 0.9);
  const seated = down - up2;
  return (
    <FadeIn t={t}>
      <StepShot idx={8} title="PLACEMENT · PRINTED MOLD" chipNo="08" chipLabel="Mold-carried placement"
        chipSub="3D-printed mold, pre-filled with components, seats onto the pasted board" unit="3D PRINTER BAY · MOLD"
        prog={cl((t - 0.3) / 5.6)} t={t}
        telem={[
          ['MOLD', 'PETG · 6 cav'],
          ['ALIGN', '±0.02 mm'],
          ['SEAT FORCE', '0.2 N'],
          ['COMPONENTS', (t2) => `${Math.min(6, Math.floor(cl((t2 - 4.6) / 0.9) * 6.01))}/6`]
        ]}
        gcode={['MOLD PICK · PRINTER BAY', 'TRAVEL OVER DIVIDER', 'ALIGN TO FIDUCIALS', 'SEAT ON PASTE · 0.2 N', 'RELEASE COMPONENTS', 'MOLD STAYS ON · → REFLOW']}
        callouts={[
          { at: [475, 185, 90], text: 'PRINTED MOLD', sub: 'made in parallel, filled with parts', dx: 120, dy: -110 },
          { at: [240, 300, 78], text: 'COMPONENT DROP', sub: 'seats into wet paste', dx: 170, dy: 90 }
        ]}
        pose={{ gantryY: 0.06, carX: 0.1, pcbDY: 90, focus: 'printer', printProg: 1,
          moldCarry: t > 0.25, moldDX: travel * -237, moldDY: travel * 115,
          moldDZ: lift * 180 - down * 168,
          compsP: comps, moduleGlows: down > 0.5 ? ['bed'] : ['printer'],
          boardTint: GRN_T, printT: t }}>
        <BoardSurface>
          <div style={{ position: 'absolute', inset: 0, background: GRN }} />
          <MaskPads p={1} />
          {PADS.map((pd, i) => (
            <div key={i} style={{ position: 'absolute',
              left: pd.x + pd.w / 2 - 12, top: pd.y + pd.h / 2 - 12, width: 24, height: 24, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #e8e6e2, #a8a5a0 55%, #7e7b76)',
              boxShadow: '0 3px 8px rgba(0,0,0,0.4)' }} />
          ))}
          <CompBodies p={comps} />
          {/* translucent printed mold descending over the board */}
          {t > 2.4 && (
            <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-(1 - down) * (BH + 80)}px)` }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(127,203,211,0.30)',
                border: '10px solid rgba(143,216,222,0.75)', boxSizing: 'border-box' }} />
              {COMPS.map((c, i) => (
                <div key={i} style={{ position: 'absolute', left: c.x - 10, top: c.y - 10, width: c.w + 20, height: c.h + 20,
                  border: '5px solid rgba(143,216,222,0.9)', borderRadius: 8,
                  background: comps > 0 ? 'transparent' : 'rgba(28,28,30,0.75)' }} />
              ))}
              <div style={{ position: 'absolute', left: 120, top: 60, fontFamily: MONO, fontSize: 26,
                color: 'rgba(20,60,64,0.9)', letterSpacing: 3 }}>MOLD_A · PETG · 6 CAVITIES</div>
            </div>
          )}
        </BoardSurface>
      </StepShot>
    </FadeIn>
  );
}

/* ---------- exploded view ---------- */
function ExplodedView({ g }) {
  const L = ({ z, text, sub, oy = 0 }) => {
    const a = P(560, 40, z);
    return (
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <div style={{ position: 'absolute', left: a[0] + 14, top: a[1] + oy, width: 120, height: 1, background: 'rgba(239,236,229,0.35)' }} />
        <div style={{ position: 'absolute', left: a[0] + 148, top: a[1] - 22 + oy }}>
          <div style={{ fontFamily: MONO, fontSize: 21, color: ACC, letterSpacing: 2, whiteSpace: 'nowrap' }}>{text}</div>
          <div style={{ fontFamily: FONT, fontSize: 21, color: MUT, whiteSpace: 'nowrap', marginTop: 4 }}>{sub}</div>
        </div>
      </div>
    );
  };
  const gap = (i) => i * g;
  let z = 0;
  const lv = [];
  lv.push(<IsoBox key="e" x={0} y={0} z={z + gap(0)} w={560} d={420} h={80} top="#403e38" right="#302e29" left="#262420" />);
  lv.push(<L key="el" z={z + gap(0) + 40} text="ELECTRONICS" sub="sealed · isolated airflow" />);
  z += 80;
  lv.push(<div key="v" style={{ position: 'absolute' }}>
    <IsoBox x={40} y={110} z={z + gap(1)} w={190} d={200} h={105} top="#57544d" right="#46443e" left="#3a3833" />
    <IsoBox x={290} y={120} z={z + gap(1)} w={110} d={180} h={95} top="#4f6069" right="#405057" left="#344146" />
    <IsoBox x={425} y={120} z={z + gap(1)} w={110} d={180} h={95} top="#556052" right="#454f43" left="#384136" />
  </div>);
  lv.push(<L key="vl" z={z + gap(1) + 52} oy={14} text="VACUUM + SUPPLIES" sub="cyclone · dust bin · mask + paste cartridges" />);
  z += 105;
  lv.push(<div key="b" style={{ position: 'absolute' }}>
    <IsoBox x={40} y={50} z={z + gap(2)} w={350} d={320} h={28} top="#5f5d57" right="#4b4943" left="#3e3c37" />
    <IsoBox x={165} y={160} z={z + gap(2) + 28} w={150} d={100} h={4}
      top="linear-gradient(135deg,#e0a668,#c07f44)" right="#8a5a2c" left="#6f4722" />
    <IsoBox x={420} y={128} z={z + gap(2)} w={115} d={115} h={16} top="#3c3a36" right="#2f2d2a" left="#262421" />
    <IsoBox x={445} y={153} z={z + gap(2) + 16} w={64} d={64} h={12} top="#b04a40" right="#8f3a32" left="#7a2f28" />
    <IsoBox x={445} y={153} z={z + gap(2) + 28} w={64} d={64} h={26} top="#8fd8de" right="#5fb3bc" left="#4d99a2" />
    <IsoBox x={408} y={255} z={z + gap(2)} w={148} d={130} h={88} top="#eceae5" right="#dbd8d1" left="#c2bfb8" />
  </div>);
  lv.push(<L key="bl" z={z + gap(2) + 5} oy={52} text="FIXED BED" sub="board shuttles on rails" />);
  lv.push(<L key="ol" z={z + gap(2) + 58} oy={-18} text="REFLOW OVEN" sub="SAC305 profile · sealed port" />);
  lv.push(<L key="pl" z={z + gap(2) + 105} oy={-92} text="3D PRINTER BAY" sub="molds & jigs, printed in parallel" />);
  z += 60;
  const gz = z + gap(3);
  lv.push(<div key="g" style={{ position: 'absolute' }}>
    <IsoBox x={10} y={170} z={gz} w={32} d={90} h={230} top="#54524c" right="#413f3b" left="#35332f" />
    <IsoBox x={394} y={170} z={gz} w={32} d={90} h={230} top="#54524c" right="#413f3b" left="#35332f" />
    <IsoBox x={10} y={178} z={gz + 230} w={416} d={72} h={58} top="#6a675f" right="#565349" left="#454239" />
    <IsoBox x={175} y={150} z={gz + 90} w={80} d={42} h={150} top="#3c3a33" right="#2f2d29" left="#262422" />
    <IsoBox x={200} y={154} z={gz + 30} w={24} d={24} h={64} top="#aca9a2" right="#94918b" left="#7e7b76" />
    <IsoBox x={162} y={158} z={gz + 96} w={12} d={12} h={40} top="#5a2c28" right="#48211e" left="#3a1a17" />
    <IsoBox x={238} y={156} z={gz + 110} w={26} d={26} h={42} top="#2b2924" right="#211f1c" left="#191715" />
  </div>);
  lv.push(<L key="gl" z={gz + 170} text="CNC GANTRY" sub="isolation milling + stencil laser + vision" />);
  z += 300;
  lv.push(<div key="m" style={{ position: 'absolute' }}>
    <IsoBox x={14} y={140} z={z + gap(4)} w={386} d={72} h={64} top="#5d5a53" right="#4c4a44" left="#3e3c37" />
    <IsoBox x={110} y={152} z={z + gap(4) + 64} w={220} d={46} h={46} top="#75726b" right="#605d57" left="#4f4d48"
      st={{ borderRadius: 23 }} sr={{ borderRadius: '0 0 23 23' }} sl={{ borderRadius: '0 0 23 23' }} />
    <IsoBox x={30} y={150} z={z + gap(4) - 10} w={354} d={10} h={8} top={UV} right="#7463d9" left="#26262f" />
  </div>);
  lv.push(<L key="ml" z={z + gap(4) + 55} text="DISPENSER UNIT" sub="solder mask · paste squeegee · UV cure · film roll" />);
  z += 130;
  lv.push(<div key="s" style={{ position: 'absolute', opacity: 0.42 }}>
    <IsoBox x={0} y={0} z={z + gap(5)} w={560} d={420} h={360} top="#f1efeb" right="#e2dfd9" left="#ccc9c2" />
    <IsoBox x={0} y={0} z={z + gap(5) + 360} w={560} d={420} h={40} top="#2f2d29" right="#262421" left="#1e1c1a" />
  </div>);
  lv.push(<L key="sl" z={z + gap(5) + 200} text="SHELL" sub="matte unibody · interlocked door · < 60 dB" />);
  return <div style={{ position: 'absolute', left: 0, top: 0 }}>{lv}</div>;
}

function S8_Exploded() {
  const { localTime: t } = useSprite();
  const g = Easing.easeInOutCubic(cl((t - 0.6) / 2.2)) * 100;
  const s = interpolate([0, 8], [0.50, 0.45], Easing.linear)(t);
  const y = interpolate([0, 2.8], [250, 270], Easing.easeInOutCubic)(t);
  return (
    <FadeIn t={t}>
      <Cam x={-120} y={y} s={s}>
        <ExplodedView g={g} />
      </Cam>
      <Chip no="MODULAR" label="Every unit swaps in minutes" p={(t - 0.5) / 0.5} />
    </FadeIn>
  );
}

function S9_Outro() {
  const { localTime: t, duration } = useSprite();
  const s = interpolate([0, duration], [0.72, 0.78], Easing.linear)(t);
  const line = (i) => Easing.easeOutCubic(cl((t - 0.8 - i * 0.45) / 0.6));
  const specs = [
    ['560 × 420 × 500 mm · ≤ 25 kg', 'desktop footprint · < 60 dB'],
    ['CNC: mill + laser stencil', 'one gantry, two tools'],
    ['Dispenser: mask · paste · UV', 'one unit, three jobs'],
    ['Reflow oven inside', 'SAC305 · 245 °C profile'],
    ['3D printer bay', 'molds & jigs in parallel']
  ];
  const out = interpolate([duration - 1, duration - 0.15], [1, 0])(t);
  return (
    <FadeIn t={t}>
      <div style={{ position: 'absolute', inset: 0, opacity: out }}>
        <Cam x={430} y={30} s={s}>
          <Machine led="var(--acc)" ledGlow gantryY={0.85} printProg={0.9} printT={t} />
        </Cam>
        <div style={{ position: 'absolute', left: 130, top: 240 }}>
          <div style={{ fontFamily: FONT, fontSize: 84, fontWeight: 700, color: INK, letterSpacing: -2, opacity: line(0), transform: `translateY(${(1 - line(0)) * 20}px)` }}>
            Protopulse
          </div>
          <div style={{ marginTop: 46, display: 'grid', gap: 30 }}>
            {specs.map(([a, b], i) => (
              <div key={i} style={{ opacity: line(i + 1), transform: `translateY(${(1 - line(i + 1)) * 18}px)` }}>
                <div style={{ fontFamily: MONO, fontSize: 27, color: ACC, letterSpacing: 1, whiteSpace: 'nowrap' }}>{a}</div>
                <div style={{ fontFamily: FONT, fontSize: 22, color: MUT, marginTop: 5 }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* updates data-screen-label with the current timestamp */
function TimeLabel() {
  const t = Math.floor(useTime());
  React.useEffect(() => {
    const el = document.querySelector('[data-pp-film]');
    if (el) el.setAttribute('data-screen-label', `protopulse-film t=${t}s`);
  }, [t]);
  return null;
}

/* force Stage to re-measure after slow mounts (placeholder-sized first paint) */
function ResizeFix() {
  React.useEffect(() => {
    const kick = () => window.dispatchEvent(new Event('resize'));
    const ids = [120, 400, 900, 2000].map(ms => setTimeout(kick, ms));
    let ro;
    const el = document.querySelector('[data-pp-film]');
    if (el && window.ResizeObserver) { ro = new ResizeObserver(kick); ro.observe(el); }
    return () => { ids.forEach(clearTimeout); if (ro) ro.disconnect(); };
  }, []);
  return null;
}

function WithAcc({ acc, children }) {
  return <div style={{ position: 'absolute', inset: 0, '--acc': acc }}>{children}</div>;
}

function Clock() {
  const t = useTime();
  return (
    <div style={{ position: 'absolute', right: 120, top: 92, fontFamily: MONO, fontSize: 18,
      color: 'rgba(141,137,127,0.8)', letterSpacing: 2 }}>
      PP-01 · {String(Math.floor(t / 60)).padStart(2, '0')}:{String(Math.floor(t % 60)).padStart(2, '0')}
    </div>
  );
}

/* ---------- film root ---------- */
const STEPS_START = 15;
function ProtopulseFilm({ accent, captions }) {
  const acc = accent || '#CF8F4E';
  const stepAt = (i) => STEPS_START + i * STEP_D;
  const stepScenes = [Step1_Scan, Step2_Mill, Step3_Clean, Step4_Mask, Step5_Cure, Step6_Stencil, Step7_Paste, Step8_Place, Step9_Reflow];
  const explodedStart = stepAt(9);            /* 73.5 */
  const outroStart = explodedStart + 8;       /* 75 */
  const total = outroStart + 9;               /* 84 */
  return (
    <div data-pp-film data-screen-label="protopulse-film" style={{ position: 'fixed', inset: 0, background: '#000', '--acc': acc }}>
      <ResizeFix />
      <Stage width={1920} height={1080} duration={total} background={BG} autoplay loop>
        <TimeLabel />
        <Sprite start={0} end={total}>
          <div style={{ position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 42%, rgba(255,244,228,0.05), rgba(0,0,0,0) 55%), radial-gradient(ellipse at 50% 120%, rgba(0,0,0,0.5), rgba(0,0,0,0) 60%)' }} />
        </Sprite>
        <Sprite start={0} end={8}><WithAcc acc={acc}><S1_Hero /></WithAcc></Sprite>
        <Sprite start={8} end={15}><WithAcc acc={acc}><S2_Insert /></WithAcc></Sprite>
        {stepScenes.map((S, i) => (
          <Sprite key={i} start={stepAt(i)} end={stepAt(i + 1)}>
            <WithAcc acc={acc}><S /></WithAcc>
          </Sprite>
        ))}
        <Sprite start={explodedStart} end={outroStart}><WithAcc acc={acc}><S8_Exploded /></WithAcc></Sprite>
        <Sprite start={outroStart} end={total}><WithAcc acc={acc}><S9_Outro /></WithAcc></Sprite>
        {captions !== false && (
          <Sprite start={0.5} end={total - 1}>
            <WithAcc acc={acc}><Clock /></WithAcc>
          </Sprite>
        )}
      </Stage>
    </div>
  );
}

window.ProtopulseFilm = ProtopulseFilm;
