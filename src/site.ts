/** Where licence requests (and support mail) go. */
const licenseEmail = "david699pro@gmail.com";

const requestBody = `Hi,

I'd like a NotchOS Pro licence.

Name:
Email for the licence:
Mac ID: (in NotchOS: Settings → License → This Mac)

Thanks!`;

/** Everything you'll want to change before launch, in one place. */
export const site = {
  name: "NotchOS",
  /** Permanent link to the newest build (public releases repo). */
  downloadURL: "https://github.com/Bexwane/NotchOS-releases/releases/latest/download/NotchOS.zip",
  /** For now a licence request by email; later, a Lemon Squeezy / Gumroad checkout link. */
  buyURL: `mailto:${licenseEmail}?subject=${encodeURIComponent("NotchOS Pro licence request")}&body=${encodeURIComponent(requestBody)}`,
  licenseEmail,
  supportEmail: licenseEmail,
  proPrice: "$12",
  trialDays: 3,
  requirements: "macOS 14 or later · MacBook with a notch",
};
