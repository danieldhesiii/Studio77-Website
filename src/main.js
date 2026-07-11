import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { initSmoothScroll } from './lib/smooth-scroll.js'
import { splitText } from './lib/text-split.js'
import { initReviews } from './lib/reviews.js'
import { initGallery } from './lib/gallery.js'
import { initBooking } from './lib/booking.js'
import { business, offer, serviceCategories, bookableServices } from './data/site.js'

gsap.registerPlugin(ScrollTrigger)

const $ = (sel, ctx = document) => ctx.querySelector(sel)
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)]

/* ---------------------------------------------------------------
   1. Inject business data (single source of truth → the DOM)
--------------------------------------------------------------- */
function hydrateData() {
  const { address } = business
  const addrLine = `${address.line1}, ${address.town}, ${address.city} ${address.postcode}`

  // Phone links + labels everywhere
  $$('[data-phone]').forEach((el) => {
    el.setAttribute('href', business.phoneHref)
    if (!el.querySelector('svg') && !el.hasAttribute('data-keep-text') && el.children.length === 0) {
      el.textContent = business.phone
    }
  })
  $$('[data-phone-label]').forEach((el) => (el.textContent = business.phone))

  // Address blocks
  $$('[data-address]').forEach((el) => (el.textContent = addrLine))

  // Facebook / social / reviews / directions / map
  $$('[data-facebook]').forEach((el) => el.setAttribute('href', business.socials.facebook))
  $$('[data-social-link]').forEach((el) =>
    el.setAttribute('href', business.socials.instagram || business.socials.facebook)
  )
  $$('[data-google-review]').forEach((el) => el.setAttribute('href', business.socials.googleReviewLink))

  const dir = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addrLine)}`
  $$('[data-directions]').forEach((el) => el.setAttribute('href', dir))

  const map = $('[data-map]')
  if (map) map.setAttribute('src', `https://maps.google.com/maps?q=${business.mapsQuery}&z=15&output=embed`)

  // Offer chip
  const offerEl = $('[data-offer]')
  if (offerEl && offer.active) {
    offerEl.innerHTML = `<span class="offer-chip__tag">${offer.label}</span>
      <span class="offer-chip__body"><span><strong>${offer.headline}</strong> · until ${offer.ends}</span></span>`
  } else if (offerEl) {
    offerEl.remove()
  }

  // Opening hours
  const hoursEl = $('[data-hours]')
  if (hoursEl) {
    const todayIdx = (new Date().getDay() + 6) % 7 // Mon=0 … Sun=6
    hoursEl.innerHTML = business.hours
      .map((h, i) => {
        const open = i === todayIdx && h.value !== 'Closed'
        return `<li class="${open ? 'is-open' : ''}"><span>${h.day}</span><strong>${h.value}</strong></li>`
      })
      .join('')
  }

  // Year
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()))
}

/* ---------------------------------------------------------------
   2. Services — tabs + panels
--------------------------------------------------------------- */
function buildServices() {
  const tabsEl = $('[data-service-tabs]')
  const panelsEl = $('[data-service-panels]')
  if (!tabsEl || !panelsEl) return

  serviceCategories.forEach((cat, idx) => {
    const tab = document.createElement('button')
    tab.className = 'service-tab'
    tab.setAttribute('role', 'tab')
    tab.setAttribute('aria-selected', idx === 0 ? 'true' : 'false')
    tab.dataset.target = cat.id
    tab.textContent = cat.name
    tabsEl.appendChild(tab)

    const panel = document.createElement('div')
    panel.className = `service-panel${idx === 0 ? ' is-active' : ''}`
    panel.id = `panel-${cat.id}`
    panel.innerHTML = `
      <p class="service-panel__intro">${cat.intro}</p>
      <div class="service-menu">
        ${cat.services
          .map(
            (s) => `
          <div class="service-row">
            <h4 class="service-row__name">${s.name}${s.badge ? ` <span class="service-row__badge">${s.badge}</span>` : ''}</h4>
            <span class="service-row__price">${s.price}</span>
            <p class="service-row__desc">${s.desc}</p>
            ${s.provisional ? `<span class="service-row__note">Guide price — confirmed on the day</span>` : ''}
          </div>`
          )
          .join('')}
      </div>`
    panelsEl.appendChild(panel)
  })

  tabsEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.service-tab')
    if (!tab) return
    $$('.service-tab', tabsEl).forEach((t) => t.setAttribute('aria-selected', 'false'))
    tab.setAttribute('aria-selected', 'true')
    $$('.service-panel', panelsEl).forEach((p) => p.classList.remove('is-active'))
    $(`#panel-${tab.dataset.target}`).classList.add('is-active')
    ScrollTrigger.refresh()
  })
}

/* ---------------------------------------------------------------
   3. Booking service <select> options
--------------------------------------------------------------- */
function fillBookingServices() {
  const sel = $('[data-book-services]')
  if (!sel) return
  sel.innerHTML =
    '<option value="" disabled selected>Choose a service…</option>' +
    bookableServices.map((s) => `<option value="${s}">${s}</option>`).join('')
}

/* ---------------------------------------------------------------
   4. Scroll reveals (IntersectionObserver — cheap + reliable)
--------------------------------------------------------------- */
function initReveals() {
  const items = $$('[data-reveal]')
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'))
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target
          // slight stagger for siblings revealed together
          setTimeout(() => el.classList.add('is-in'), (i % 6) * 60)
          io.unobserve(el)
        }
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  )
  items.forEach((el) => io.observe(el))
}

/* ---------------------------------------------------------------
   5. Header behaviour + mobile nav
--------------------------------------------------------------- */
function initHeader() {
  const header = $('.site-header')
  const toggle = $('.nav-toggle')

  ScrollTrigger.create({
    start: 'top -12',
    onUpdate: (self) => header.classList.toggle('is-stuck', self.scroll() > 12),
  })
  // fallback if GSAP scroll not firing early
  window.addEventListener('scroll', () => header.classList.toggle('is-stuck', window.scrollY > 12), { passive: true })

  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('nav-open')
      toggle.setAttribute('aria-expanded', String(open))
    })
    $$('.nav a, .site-header__cta a', header).forEach((a) =>
      a.addEventListener('click', () => {
        header.classList.remove('nav-open')
        toggle.setAttribute('aria-expanded', 'false')
      })
    )
  }
}

/* ---------------------------------------------------------------
   6. Hero motion — gentle parallax on the photo
--------------------------------------------------------------- */
function initHeroMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const photo = $('.hero__photo')
  const badge = $('.hero__badge')
  if (photo) {
    gsap.to(photo, {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
    })
  }
  if (badge) {
    gsap.from(badge, { y: 24, opacity: 0, duration: 0.8, delay: 0.5, ease: 'power3.out' })
  }
}

/* ---------------------------------------------------------------
   Boot
--------------------------------------------------------------- */
function boot() {
  hydrateData()
  buildServices()
  fillBookingServices()

  initSmoothScroll()
  initHeader()
  initReveals()

  // Animated hero heading via Splitting, then reveal chars with GSAP
  const split = splitText('.hero__title')
  if (split && split[0] && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.from('.hero__title .char', {
      yPercent: 120, opacity: 0, stagger: 0.018, duration: 0.7, ease: 'power3.out', delay: 0.15,
    })
  }
  initHeroMotion()

  initGallery($('[data-gallery]'))
  initReviews({
    trackEl: $('[data-reviews-track]'),
    wrapperEl: $('[data-reviews-wrapper]'),
    form: $('[data-review-form]'),
    msgEl: $('[data-review-msg]'),
  })
  initBooking($('[data-book-form]'), $('[data-book-result]'))

  // Recalculate scroll triggers once fonts/images settle
  window.addEventListener('load', () => ScrollTrigger.refresh())
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
