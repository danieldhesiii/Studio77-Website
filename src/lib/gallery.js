/**
 * Gallery — renders a curated masonry grid now, and is wired to auto-pull
 * the owner's latest Instagram posts the moment an access token is supplied.
 *
 * HOW THE AUTO-SYNC WORKS AT GO-LIVE
 * ----------------------------------
 * Instagram (owned by Meta) does not let any website read an account's
 * photos without an access token — this is a hard platform requirement, not
 * a limitation of this site. To switch the gallery to live auto-updating:
 *
 *   1. The owner connects their Instagram (Business/Creator) account to a
 *      Facebook Page and creates a long-lived access token via the Meta
 *      Instagram Graph API (or a helper service like Behold / EmbedSocial).
 *   2. Put that token in an env var `VITE_IG_TOKEN` (never commit it).
 *   3. This module then fetches the latest media on page load, so every new
 *      post the owner shares appears here automatically.
 *
 * Until a token exists, the curated images in site.js are shown. Everything
 * degrades gracefully — a failed image becomes a warm placeholder tile, so
 * the grid never looks broken.
 */

import { gallery as curated } from '../data/site.js'

const IG_TOKEN = import.meta.env?.VITE_IG_TOKEN || ''
const IG_FIELDS = 'media_url,permalink,caption,media_type,thumbnail_url'

function tile({ src, alt, tall, permalink }) {
  const inner = `
    <img src="${src}" alt="${alt || 'Studio 77 grooming'}" loading="lazy"
         onerror="this.closest('.gallery__item').classList.add('gallery__item--fallback'); this.remove();" />
    <span class="gallery__fallback" aria-hidden="true">🐾</span>`
  const cls = `gallery__item${tall ? ' gallery__item--tall' : ''}`
  return permalink
    ? `<a class="${cls}" href="${permalink}" target="_blank" rel="noopener">${inner}</a>`
    : `<div class="${cls}">${inner}</div>`
}

async function fetchInstagram() {
  if (!IG_TOKEN) return null
  try {
    const url = `https://graph.instagram.com/me/media?fields=${IG_FIELDS}&access_token=${IG_TOKEN}&limit=12`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`IG ${res.status}`)
    const json = await res.json()
    return (json.data || [])
      .filter((m) => m.media_type !== 'VIDEO' || m.thumbnail_url)
      .map((m, i) => ({
        src: m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url,
        alt: m.caption ? m.caption.slice(0, 80) : 'Studio 77 on Instagram',
        permalink: m.permalink,
        tall: i % 5 === 0,
      }))
  } catch (err) {
    console.warn('Instagram sync unavailable, using curated gallery:', err)
    return null
  }
}

export async function initGallery(gridEl) {
  if (!gridEl) return
  // Render curated immediately so there's no empty flash.
  gridEl.innerHTML = curated.map(tile).join('')

  // Then upgrade to live Instagram if a token is configured.
  const live = await fetchInstagram()
  if (live && live.length) {
    gridEl.innerHTML = live.map(tile).join('')
    gridEl.dataset.source = 'instagram'
  }
}
