export const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export function getWhatsAppUrl(message: string) {
  if (!whatsappNumber) return null;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const socialProfiles = [
  { name: "Instagram", value: process.env.NEXT_PUBLIC_INSTAGRAM_URL, host: "instagram.com" },
  { name: "Facebook", value: process.env.NEXT_PUBLIC_FACEBOOK_URL, host: "facebook.com" },
  { name: "YouTube", value: process.env.NEXT_PUBLIC_YOUTUBE_URL, host: "youtube.com" },
] as const;

export function getSocialLinks() {
  return socialProfiles.flatMap(({ name, value, host }) => {
    if (!value) return [];

    try {
      const url = new URL(value);
      const isAllowedHost = url.hostname === host || url.hostname.endsWith(`.${host}`);

      if (url.protocol !== "https:" || !isAllowedHost) return [];

      return [{ name, href: url.toString() }];
    } catch {
      return [];
    }
  });
}
