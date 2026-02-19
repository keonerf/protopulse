# ProtoPulse

**From Gerber to Prototype in 60 Minutes.**

ProtoPulse represents the future of hardware prototyping. Our flagship system, **ProtoBlock-1**, integrates isolation milling, conductive paste dispensing, pick-and-place, and reflow soldering into a single desktop unit.

🔗 **Live Site** — [proto-pulse.vercel.app](https://proto-pulse.vercel.app)

---

## Frontend Stack

### Core

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2 | UI component library — functional components with hooks |
| **TypeScript** | 5.9 | Static type-checking with `strict` mode enabled |
| **Vite** | 7.2 | Build tool & dev server — instant HMR, ESM-native bundling |

### Animation & Scroll

| Technology | Version | Purpose |
|---|---|---|
| **Framer Motion** | 12.29 | Declarative animations — scroll-linked transforms, viewport-triggered reveals, layout transitions |
| **Lenis** | 1.3 | Smooth scroll engine — replaces native scroll with inertia-based scrolling for a premium feel |

### Typography

| Technology | Version | Purpose |
|---|---|---|
| **@fontsource/anton** | 5.2 | Display typeface — self-hosted, no external requests to Google Fonts |
| **@fontsource/space-grotesk** | 5.2 | Body typeface — geometric sans-serif for readability |

### Dev Tooling

| Technology | Version | Purpose |
|---|---|---|
| **ESLint** | 9.39 | Linting with `react-hooks` and `react-refresh` plugins |
| **typescript-eslint** | 8.56 | TypeScript-aware ESLint rules |
| **@vitejs/plugin-react** | 5.1 | React Fast Refresh integration for Vite |

---

## Project Structure

```
protopulse/
├── index.html              # App entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config (strict mode)
├── src/
│   ├── main.tsx             # React root mount
│   ├── App.tsx              # Layout shell + Lenis smooth scroll
│   ├── index.css            # Global styles & CSS variables
│   ├── App.css              # App-level layout styles
│   ├── vite-env.d.ts        # Vite client type declarations
│   └── components/
│       ├── Navbar.tsx        # Fixed pill-shaped navigation bar
│       ├── Hero.tsx          # Full-viewport hero with parallax text
│       ├── FounderVision.tsx # Co-founder bios grid
│       ├── NarrativeHook.tsx # Value proposition / narrative section
│       ├── AssemblyLine.tsx  # Scroll-animated 4-step process showcase
│       ├── BusinessCase.tsx  # Competitor comparison table + metrics
│       ├── SoftwareSuite.tsx # Software features grid + UI mockup
│       ├── MediaGallery.tsx  # YouTube embed + CAD render gallery
│       └── Footer.tsx        # Footer with social links
```

---

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build    # Production bundle → dist/
npm run preview  # Preview the production build locally
```

## Deployment

Deployed on **Vercel** with automatic deploys from the `main` branch.
