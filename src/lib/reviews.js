/**
 * Reviews: a moving Swiper carousel of testimonials plus an on-site
 * "leave a review" form.
 *
 * For the demo, submitted reviews are held in localStorage so they appear
 * immediately in the carousel and persist for that visitor — no backend.
 * A prominent "post on Google" link is also offered, which is what actually
 * grows the business's real 5.0 rating. At go-live, point `saveReview` at a
 * database (e.g. Supabase) if you want submissions shared across visitors.
 */

import Swiper from 'swiper'
import { Autoplay, Pagination, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import { reviews as seedReviews, business } from '../data/site.js'

const STORE_KEY = 'studio77_reviews'

function loadStored() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveReview(review) {
  const all = loadStored()
  all.unshift(review)
  localStorage.setItem(STORE_KEY, JSON.stringify(all))
}

function starRow(n) {
  return '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n)
}

function slide(r) {
  return `
    <div class="swiper-slide">
      <figure class="review-card">
        <div class="review-card__stars" aria-label="${r.stars} out of 5 stars">${starRow(r.stars)}</div>
        <blockquote class="review-card__text">${escapeHtml(r.text)}</blockquote>
        <figcaption class="review-card__by">
          <span class="review-card__name">${escapeHtml(r.name)}</span>
          ${r.pet ? `<span class="review-card__pet">${escapeHtml(r.pet)}</span>` : ''}
        </figcaption>
      </figure>
    </div>`
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

let swiper = null

function render(wrapperEl) {
  const all = [...loadStored(), ...seedReviews]
  wrapperEl.innerHTML = all.map(slide).join('')
}

export function initReviews({ trackEl, wrapperEl, form, msgEl }) {
  if (!trackEl || !wrapperEl) return

  render(wrapperEl)

  swiper = new Swiper(trackEl, {
    modules: [Autoplay, Pagination, A11y],
    slidesPerView: 1.1,
    spaceBetween: 20,
    centeredSlides: false,
    grabCursor: true,
    loop: true,
    speed: 750,
    autoplay: { delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true },
    pagination: { el: '.reviews-pagination', clickable: true },
    breakpoints: {
      680: { slidesPerView: 2, spaceBetween: 24 },
      1024: { slidesPerView: 3, spaceBetween: 28 },
    },
  })

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const data = new FormData(form)
      const review = {
        name: (data.get('name') || '').toString().trim(),
        pet: (data.get('pet') || '').toString().trim(),
        text: (data.get('text') || '').toString().trim(),
        stars: Number(data.get('stars')) || 5,
      }
      if (!review.name || !review.text) return

      saveReview(review)
      render(wrapperEl)
      swiper.update()
      swiper.slideToLoop(0, 600)

      form.reset()
      if (msgEl) {
        msgEl.innerHTML = `Thank you, ${escapeHtml(review.name.split(' ')[0])}! Your review is live above. ` +
          `<a href="${business.socials.googleReviewLink}" target="_blank" rel="noopener">Share it on Google too?</a>`
        msgEl.hidden = false
      }
    })
  }
}
