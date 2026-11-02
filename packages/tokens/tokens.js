/* Generated from tokens.json by scripts/build-tokens.mjs. Do not edit. */
const tokens = {
  "brand": {
    "graphite": "#171B24",
    "paper": "#F7F8F5",
    "lime": "#B8EF65",
    "violet": "#8B7CF6"
  },
  "light": {
    "bg": "#F7F8F5",
    "surface": "#FFFFFF",
    "surfaceMuted": "#EEF0EA",
    "text": "#171B24",
    "muted": "#545C6B",
    "border": "#767E8B",
    "primary": "#B8EF65",
    "onPrimary": "#171B24",
    "link": "#5845B8",
    "success": "#25633A",
    "error": "#B42332",
    "warning": "#855000",
    "accent": "#8B7CF6",
    "info": "#5845B8",
    "overlay": "#171B2488"
  },
  "dark": {
    "bg": "#171B24",
    "surface": "#222834",
    "surfaceMuted": "#2B3240",
    "text": "#F7F8F5",
    "muted": "#B8C0CD",
    "border": "#778190",
    "primary": "#B8EF65",
    "onPrimary": "#171B24",
    "link": "#B6AAFF",
    "success": "#9DE1AE",
    "error": "#FF9CA7",
    "warning": "#F4CA80",
    "accent": "#8B7CF6",
    "info": "#B6AAFF",
    "overlay": "#05070Bb3"
  },
  "space": [
    4,
    8,
    12,
    16,
    24,
    32,
    48,
    64,
    96
  ],
  "radius": {
    "control": 0,
    "card": 0,
    "pill": 0
  },
  "type": {
    "family": "Manrope",
    "mono": "JetBrains Mono",
    "body": 14,
    "small": 12,
    "h1": 32,
    "h2": 26,
    "h3": 18,
    "marketing": {
      "body": 16,
      "display": 64
    }
  },
  "motion": {
    "fast": "120ms",
    "normal": "180ms"
  },
  "identity": {
    "name": "DIY WORKBENCH",
    "displayCase": "uppercase, short headlines only",
    "marketingShadow": "3px 3px 0",
    "productShadow": "none",
    "stickerRotation": "-3deg to 3deg",
    "editorial": {
      "displayWeight": 800,
      "displayLineHeight": 0.9,
      "displayTracking": "-0.075em",
      "stickerRotation": "-4deg to 8deg",
      "productRotation": "0deg"
    }
  },
  "density": {
    "desktop": {
      "body": 14,
      "label": 12,
      "heading": 26,
      "controlHeight": 34,
      "rowPadding": 8,
      "panelPadding": 16,
      "gap": 12
    },
    "touch": {
      "controlHeight": 44,
      "inputText": 16
    }
  }
};
export default tokens;
export const cssVar = (name) => `var(--vs-${name})`;
