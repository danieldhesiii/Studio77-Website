import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Initialise Lenis smooth scrolling and drive it from GSAP's ticker so
 * ScrollTrigger stays perfectly in sync with the smoothed scroll position.
 *
 * @returns {Lenis} the Lenis instance (call `.destroy()` to tear down)
 */
export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  // Keep ScrollTrigger informed on every Lenis scroll frame.
  lenis.on('scroll', ScrollTrigger.update)

  // Drive Lenis from GSAP's ticker (one RAF loop for the whole app).
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000) // GSAP ticker is in seconds, Lenis wants ms
  })
  gsap.ticker.lagSmoothing(0)

  return lenis
}
