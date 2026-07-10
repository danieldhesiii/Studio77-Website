/**
 * Appointment booking without a backend.
 *
 * The form collects a service, date, time and the owner's details, then:
 *   1. Builds a Google Calendar "add event" link (opens pre-filled), and
 *   2. Generates a downloadable .ics file (Apple Calendar / Outlook), and
 *   3. Offers a pre-filled SMS to the studio to confirm the slot.
 *
 * Nothing is stored server-side, so the demo always works. For go-live you
 * can point the same form at a real booking backend or a form service.
 */

import { business } from '../data/site.js'

const pad = (n) => String(n).padStart(2, '0')

/** Format a Date as an iCal UTC stamp: YYYYMMDDTHHMMSSZ */
function toICSStamp(date) {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  )
}

/** Combine a yyyy-mm-dd date string and hh:mm time string into a Date. */
function combine(dateStr, timeStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const [hh, mm] = timeStr.split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm, 0)
}

function eventDetails({ service, dateStr, timeStr, name, dog }) {
  const start = combine(dateStr, timeStr)
  const end = new Date(start.getTime() + 60 * 60 * 1000) // assume 1 hour
  const title = `${business.name} — ${service}`
  const location = `${business.address.line1}, ${business.address.town}, ${business.address.city} ${business.address.postcode}`
  const description =
    `Grooming appointment for ${dog || 'your dog'} (${name || 'you'}).\n` +
    `Service: ${service}\n` +
    `Studio: ${business.full}\n` +
    `Call: ${business.phone}\n\n` +
    `Please confirm this slot with the studio — this event was created from the website.`
  return { start, end, title, location, description }
}

/** A Google Calendar template URL that opens with the event pre-filled. */
export function googleCalendarUrl(form) {
  const { start, end, title, location, description } = eventDetails(form)
  const dates = `${toICSStamp(start)}/${toICSStamp(end)}`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates,
    details: description,
    location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Build an .ics file blob and return an object URL for download. */
export function icsBlobUrl(form) {
  const { start, end, title, location, description } = eventDetails(form)
  const uid = `studio77-${start.getTime()}@studio77.local`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Studio 77 Dog Grooming//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toICSStamp(new Date())}`,
    `DTSTART:${toICSStamp(start)}`,
    `DTEND:${toICSStamp(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n').replace(/,/g, '\\,')}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Grooming appointment tomorrow',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  return URL.createObjectURL(blob)
}

/** Pre-filled SMS to the studio so the owner sees the request instantly. */
export function confirmSmsUrl(form) {
  const body = `Hi ${business.name}, I'd like to book a ${form.service} for ${form.dog || 'my dog'} on ${form.dateStr} at ${form.timeStr}. Name: ${form.name}. Thanks!`
  return `${business.smsHref}?&body=${encodeURIComponent(body)}`
}

/**
 * Wire up a booking form element. Expects inputs named:
 * service, date, time, name, dog. On submit, reveals the "add to calendar"
 * actions instead of navigating away.
 */
export function initBooking(form, resultEl) {
  if (!form) return

  // Set the date input's minimum to today so no past bookings.
  const dateInput = form.querySelector('input[name="date"]')
  if (dateInput) {
    const today = new Date()
    dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(form)
    const model = {
      service: data.get('service'),
      dateStr: data.get('date'),
      timeStr: data.get('time'),
      name: (data.get('name') || '').toString().trim(),
      dog: (data.get('dog') || '').toString().trim(),
    }
    if (!model.service || !model.dateStr || !model.timeStr || !model.name) return

    const prettyDate = combine(model.dateStr, model.timeStr).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long',
    })

    resultEl.innerHTML = `
      <div class="booking-result__card">
        <p class="booking-result__eyebrow">Nearly there, ${model.name.split(' ')[0]} 🐾</p>
        <h3 class="booking-result__title">${model.service}</h3>
        <p class="booking-result__when">${prettyDate} at ${model.timeStr}${model.dog ? ` · for ${model.dog}` : ''}</p>
        <p class="booking-result__note">Pop it in your calendar, then tap “Text the studio” so we can confirm your slot.</p>
        <div class="booking-result__actions">
          <a class="btn btn--primary" href="${googleCalendarUrl(model)}" target="_blank" rel="noopener">Add to Google Calendar</a>
          <a class="btn btn--soft" href="${icsBlobUrl(model)}" download="studio77-appointment.ics">Apple / Outlook (.ics)</a>
          <a class="btn btn--ghost" href="${confirmSmsUrl(model)}">Text the studio to confirm</a>
        </div>
      </div>`
    resultEl.hidden = false
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}
