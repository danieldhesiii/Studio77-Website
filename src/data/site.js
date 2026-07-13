/**
 * Single source of truth for all Studio 77 business content.
 * Everything the owner might change lives here — names, prices, hours,
 * reviews, gallery images — so nothing is buried in markup.
 *
 * NOTE FOR GO-LIVE:
 *  - Prices marked `provisional: true` are estimates around the known
 *    £25–£35 full-groom offer. Confirm with the owner before launch.
 *  - Reviews below are representative samples for the demo. Replace with
 *    the real Google review text (they're at a genuine 5.0 / 29 reviews).
 *  - Gallery images are real stock photography; swap for the owner's own
 *    dog photos, or connect Instagram (see src/lib/gallery.js).
 */

export const business = {
  name: 'Studio 77',
  full: 'Studio 77 Dog Grooming',
  tagline: 'Small-batch dog grooming in the heart of Earls Colne',
  blurb:
    'A calm, unhurried grooming studio where your dog is treated like the only pup of the day — because most days, they nearly are.',
  phone: '07825 347428',
  phoneHref: 'tel:+447825347428',
  smsHref: 'sms:+447825347428',
  address: {
    line1: '77 Monks Rd',
    town: 'Earls Colne',
    city: 'Colchester',
    postcode: 'CO6 2RY',
  },
  mapsQuery: 'Studio+77+Dog+Grooming,+77+Monks+Rd,+Earls+Colne,+Colchester+CO6+2RY',
  rating: { score: '5.0', count: 29, source: 'Google' },
  socials: {
    facebook:
      'https://www.facebook.com/p/Studio-77-Dog-grooming-61586800400854/',
    // Add the owner's Instagram handle here to light up the gallery auto-sync.
    instagram: '',
    googleReviewLink:
      'https://search.google.com/local/writereview?placeid=REPLACE_WITH_PLACE_ID',
  },
  // Opening hours. Google shows "Opens 9 am Sat"; the rest run by
  // appointment. Confirm and adjust before launch.
  hours: [
    { day: 'Monday', value: 'By appointment' },
    { day: 'Tuesday', value: 'By appointment' },
    { day: 'Wednesday', value: 'By appointment' },
    { day: 'Thursday', value: 'By appointment' },
    { day: 'Friday', value: 'By appointment' },
    { day: 'Saturday', value: '9:00 – 16:00' },
    { day: 'Sunday', value: 'Closed' },
  ],
};

export const offer = {
  active: true,
  label: 'Introductory offer',
  headline: 'Full grooms £25–£35',
  detail: 'Price depends on size, coat condition and the groom required.',
  ends: '10 July',
};

/**
 * Services grouped into categories the owner asked for. Each service has a
 * size-aware or "from" price. `provisional` flags estimates to confirm.
 */
export const serviceCategories = [
  {
    id: 'grooms',
    name: 'Full Grooms',
    icon: 'scissors',
    intro: 'The full works — bathed, dried, styled and finished.',
    services: [
      {
        name: 'Full Groom',
        desc: 'Wash, blow-dry, full clip or scissor style, nails, ears and a spritz of finishing cologne.',
        price: '£25–£35',
        badge: 'Intro offer',
      },
      {
        name: 'Breed-Standard Style',
        desc: 'Clipped and hand-scissored to your breed’s classic outline. Ideal for Poodles, Doodles, Schnauzers and Spaniels.',
        price: 'from £38',
        provisional: true,
      },
      {
        name: 'Teddy / Puppy Cut',
        desc: 'That soft, rounded, cuddly finish everyone asks for — kept even all over.',
        price: 'from £35',
        provisional: true,
      },
    ],
  },
  {
    id: 'baths',
    name: 'Bath & Freshen',
    icon: 'droplet',
    intro: 'Clean, fluffy and smelling wonderful — no full clip needed.',
    services: [
      {
        name: 'Bath & Blow-Dry',
        desc: 'Deep clean, conditioning wash and a full fluff dry. Brush-out included.',
        price: 'from £20',
        provisional: true,
      },
      {
        name: 'Bath, Tidy & Trim',
        desc: 'A bath plus a tidy of face, feet and sanitary areas between full grooms.',
        price: 'from £26',
        provisional: true,
      },
      {
        name: 'De-Shed Treatment',
        desc: 'Specialist wash and de-shedding blow-out for double-coated breeds. Less hair on the sofa, promise.',
        price: 'from £30',
        provisional: true,
      },
    ],
  },
  {
    id: 'puppy',
    name: 'Puppies',
    icon: 'paw',
    intro: 'Gentle, patient first experiences that set them up for life.',
    services: [
      {
        name: 'Puppy’s First Groom',
        desc: 'A short, calm, confidence-building intro to bath, dryer, clippers and handling. Lots of praise, no pressure.',
        price: 'from £18',
        provisional: true,
      },
      {
        name: 'Puppy Bath & Tidy',
        desc: 'A light wash and tidy while they get used to the studio. Perfect little starter session.',
        price: 'from £15',
        provisional: true,
      },
    ],
  },
  {
    id: 'addons',
    name: 'Add-Ons',
    icon: 'sparkle',
    intro: 'Little extras to add to any groom.',
    services: [
      { name: 'Nail Clip', desc: 'Quick, careful nail trim.', price: 'from £8', provisional: true },
      { name: 'Ear Clean & Pluck', desc: 'Gentle clean and tidy of the ears.', price: 'from £6', provisional: true },
      { name: 'Teeth Brushing', desc: 'Enzymatic clean to freshen the breath.', price: 'from £6', provisional: true },
      { name: 'Nourishing Coat Mask', desc: 'Conditioning treatment for dry or dull coats.', price: 'from £8', provisional: true },
    ],
  },
];

/** Flat list of bookable services for the appointment form. */
export const bookableServices = serviceCategories.flatMap((c) =>
  c.services.map((s) => `${s.name} (${c.name})`)
);

/**
 * Reviews for the carousel. SAMPLE CONTENT — replace with the owner's real
 * Google reviews at go-live. Kept realistic and specific to grooming so the
 * carousel reads authentically in the demo.
 */
export const reviews = [
  {
    name: 'Hannah P.',
    pet: 'Bella · Cockapoo',
    text: 'Honestly the best groomer we’ve found round here. Bella came back so soft and smelling gorgeous, and you can tell she wasn’t stressed at all. Booked our next one before we even left.',
    stars: 5,
  },
  {
    name: 'Dave M.',
    pet: 'Rolo · Border Terrier',
    text: 'Rolo can be a nightmare for the nails and they were so patient with him. Proper old-fashioned service, no rushing. Can’t recommend enough.',
    stars: 5,
  },
  {
    name: 'Sophie T.',
    pet: 'Winnie · Cavapoo',
    text: 'Took our puppy for her first groom and they were so gentle and reassuring. Winnie now trots in happily. Lovely little studio and a really fair price too.',
    stars: 5,
  },
  {
    name: 'Karen L.',
    pet: 'Max · Schnauzer',
    text: 'Max looks like a show dog every single time. The hand-scissoring is spot on — exactly the breed cut I wanted. Wouldn’t take him anywhere else now.',
    stars: 5,
  },
  {
    name: 'James & Priya',
    pet: 'Nala · Golden Retriever',
    text: 'The de-shed treatment is a game changer, our house is a different place. Friendly, professional and clearly loves the dogs. Five stars all day.',
    stars: 5,
  },
  {
    name: 'Emma R.',
    pet: 'Dexter · Cockapoo',
    text: 'Local, friendly and so easy to book. Dexter is a big soft mess and comes back looking like a proper handsome boy. The intro offer was brilliant value.',
    stars: 5,
  },
];

/**
 * Gallery images — Studio 77's own work, pulled from the Facebook page.
 * Files live in `public/gallery/` and are served from the site root, so a
 * `src` of `/gallery/x.jpg` resolves in dev and in the built site alike.
 * Each has a graceful gradient fallback if an image ever fails to load.
 * To go fully live/auto-updating, connect Instagram in src/lib/gallery.js.
 */
export const gallery = [
  { src: '/gallery/studio77-1.jpg', alt: 'Freshly groomed black cockapoo on the Studio 77 sofa' },
  { src: '/gallery/studio77-9.jpg', alt: 'Working cocker spaniel looking sharp after a full groom', tall: true },
  { src: '/gallery/studio77-3.jpg', alt: 'Cavalier King Charles Spaniel puppy — before and after' },
  { src: '/gallery/studio77-7.jpg', alt: 'Two cocker spaniels freshly groomed and relaxed' },
  { src: '/gallery/studio77-6.jpg', alt: 'Black-and-white cavapoo — before and after grooming' },
  { src: '/gallery/studio77-8.jpg', alt: 'Springer spaniel looking smart after his groom', tall: true },
  { src: '/gallery/studio77-11.jpg', alt: 'A full grooming transformation — before and after' },
  { src: '/gallery/studio77-12.jpg', alt: 'Two happy pups after their grooms at Studio 77' },
  { src: '/gallery/studio77-4.jpg', alt: 'White Havanese — before and after a tidy-up' },
];
