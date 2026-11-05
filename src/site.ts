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
  /** The current release. Bump this (and the tag below follows) when a new DMG ships. */
  version: "1.0.2",
  /** The DMG of exactly that release (public releases repo). */
  get downloadURL() {
    return `https://github.com/NotchOS-Mac/NotchOS-releases/releases/download/v${this.version}/NotchOS.dmg`;
  },
  /** For now a licence request by email; later, a Lemon Squeezy / Gumroad checkout link. */
  buyURL: `mailto:${licenseEmail}?subject=${encodeURIComponent("NotchOS Pro licence request")}&body=${encodeURIComponent(requestBody)}`,
  licenseEmail,
  supportEmail: licenseEmail,
  proPrice: "$12",
  trialDays: 3,
  requirements: "macOS 14 or later · MacBook with a notch",
};
