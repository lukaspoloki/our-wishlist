module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      alert50: "#FFFAF0",
      black: "#272727",
      bccgreen: "#004641",
      darkgreen100: "#43867F",
      darkgreen200: "#206C65",
      darkgreen300: "#005E57",
      gray: "#f1f0ee",
      isbre200: "#E6ECEC",
      info50: "#EBF4FF",
      lightgray: "#6B6D71",
      neutral200: "#F4F5F7",
      neutral400: "#DFE1E6",
      neutral500: "#D3D7DD",
      neutral550: "#C8CCD2",
      neutral700: "#8C8F93",
      neutral750: "#6B6D71",
      neutral900: "#151718",
      nudeblush: "#E1C2B7",
      primary: "#004641",
      primary50: "#E6EDED",
      primary400: "#F1F7B2",
      primary700: "#00312D",
      primary800: "#001D1B",
      primaryBg: "#E5E5E5",
      secondary: "#898885",
      secondary500: "#DBE1C0",
      secondary800: "#606A32",
      success50: "#E9F3E8",
      white: "#ffffff",
    },
    extend: {
      fontFamily: {
        archivo: ["Archivo", "sans-serif"],
        "ibm-plex": ["IBM Plex Serif", "serif"],
      },
      lineHeight: {
        12: "3rem",
      },
      screens: {
        landscape: { raw: "orientation: landscape" },
      },
      height: {
        "60screen": "60vh",
        "60screen-n": "calc( 60vh - 80px )"
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [],
};
