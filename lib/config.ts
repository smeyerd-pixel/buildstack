export const SITE = {
  name: "BuildStack",
  tagline: "The AI tools directory for vibe coders and builders",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://buildstack-fawn.vercel.app",
  contactEmail: "adambuilds@mail.grokbot.com",
  stripeFeaturedWeeklyUrl: "https://buy.stripe.com/9B65kFb5l4IB1lSdzJg3602",
  stripeFeaturedMonthlyUrl: "https://buy.stripe.com/fZu14pc9p2AtggM7blg3603",
};

/** mailto: link to the BuildStack inbox with a pre-filled subject. */
export function mailto(subject?: string) {
  return `mailto:${SITE.contactEmail}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
}
