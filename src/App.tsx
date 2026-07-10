import { useEffect } from 'react'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MachinesKits from './components/MachinesKits'
import Capabilities from './components/Capabilities'
import Assembly from './components/Assembly'
import SpecsBanner from './components/SpecsBanner'
import Software from './components/Software'
import Comparison from './components/Comparison'
import Preorder from './components/Preorder'
import Founders from './components/Founders'
import Footer from './components/Footer'
import ModelViewer from './components/ModelViewer'

function App() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <MachinesKits />
      <Capabilities />
      <Assembly />
      <SpecsBanner />
      <Software />
      <Comparison />
      <Preorder />
      <Founders />
      <Footer />
      <ModelViewer />
    </div>
  )
}

export default App
