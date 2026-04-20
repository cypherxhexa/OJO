// AdsenseScript — loads the Google AdSense <script> tag globally in <head>.
// Only renders if NEXT_PUBLIC_ADSENSE_CLIENT is set (safe in development).
// Add this component once inside the root layout <head> section.

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export function AdsenseScript() {
  if (!CLIENT) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
