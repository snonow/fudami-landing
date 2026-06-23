/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./*.js"],
  darkMode: "class",
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
  theme: {
    extend: {
      colors: {
        "washi":              "rgb(var(--background-rgb))",
        "washi-light":        "rgb(var(--emphasis-rgb))",
        "sumi":               "rgb(var(--text-rgb))",
        "sumi-ink":           "rgb(var(--text-rgb))",
        "hanko":              "rgb(var(--primary-rgb))",
        "hanko-red":          "rgb(var(--primary-rgb))",
        "aizome":             "rgb(var(--secondary-rgb))",
        "aizome-indigo":      "rgb(var(--secondary-rgb))",
        "matcha":             "rgb(var(--success-rgb))",
        "matcha-green":       "rgb(var(--success-rgb))",
        "charcoal-dark":      "rgb(var(--background-rgb))",
        "surface":                    "rgb(var(--surface-rgb))",
        "background":                 "rgb(var(--background-rgb))",
        "on-surface":                 "rgb(var(--emphasis-rgb))",
        "on-background":              "rgb(var(--text-rgb))",
        "on-surface-variant":         "rgb(var(--text-muted-rgb))",
        "surface-container":          "rgb(var(--surface-light-rgb))",
        "surface-container-low":      "rgb(var(--surface-rgb))",
        "surface-container-high":     "rgb(var(--surface-light-rgb))",
        "surface-container-highest":  "rgb(var(--surface-light-rgb))",
        "surface-container-lowest":   "rgb(var(--background-rgb))",
        "outline":                    "rgb(var(--text-muted-rgb))",
        "outline-variant":            "rgb(var(--text-muted-rgb))",
        "primary":              "rgb(var(--primary-rgb))",
        "primary-container":    "rgb(var(--primary-rgb))",
        "on-primary":           "rgb(var(--background-rgb))",
        "on-primary-container": "rgb(var(--background-rgb))",
        "secondary":              "rgb(var(--secondary-rgb))",
        "secondary-container":    "rgb(var(--secondary-rgb))",
        "on-secondary":           "rgb(var(--background-rgb))",
        "on-secondary-container": "rgb(var(--background-rgb))",
        "tertiary":              "rgb(var(--success-rgb))",
        "tertiary-container":    "rgb(var(--success-rgb))",
        "on-tertiary":           "rgb(var(--background-rgb))",
        "on-tertiary-container": "rgb(var(--background-rgb))",
        "error":              "rgb(var(--primary-rgb))",
        "error-container":    "rgb(var(--primary-rgb))",
        "on-error":           "rgb(var(--background-rgb))"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg:      "0.5rem",
        xl:      "0.75rem",
        "xl-2":  "1rem",
        "xl-3":  "1.5rem",
        "xl-4":  "2rem",
        full:    "9999px"
      },
      spacing: {
        xs:             "8px",
        unit:           "4px",
        sm:             "12px",
        md:             "16px",
        lg:             "24px",
        xl:             "32px",
        "container-max": "800px",
        "gutter-mobile": "24px"
      },
      fontFamily: {
        sans:               ['"Plus Jakarta Sans"', "sans-serif"],
        "headline-lg-mobile": ['"Plus Jakarta Sans"', "sans-serif"],
        "body-md":            ['"Plus Jakarta Sans"', "sans-serif"],
        "headline-lg":        ['"Plus Jakarta Sans"', "sans-serif"],
        "reading-guide":      ['"Plus Jakarta Sans"', "sans-serif"],
        "kanji-display":      ["KanjiStrokeOrders", "sans-serif"],
        "label-caps":         ['"Plus Jakarta Sans"', "sans-serif"],
        "headline-md":        ['"Plus Jakarta Sans"', "sans-serif"],
        "body-lg":            ['"Plus Jakarta Sans"', "sans-serif"],
        "stats-number":       ['"Plus Jakarta Sans"', "sans-serif"]
      },
      fontSize: {
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "700" }],
        "body-md":            ["16px", { lineHeight: "24px", fontWeight: "500" }],
        "headline-lg":        ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "reading-guide":      ["22px", { lineHeight: "28px", letterSpacing: "0.1em", fontWeight: "500" }],
        "kanji-display":      ["100px", { lineHeight: "120px", fontWeight: "400" }],
        "label-caps":         ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "800" }],
        "headline-md":        ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "body-lg":            ["18px", { lineHeight: "28px", fontWeight: "500" }],
        "stats-number":       ["56px", { lineHeight: "64px", letterSpacing: "-0.02em", fontWeight: "700" }]
      },
      boxShadow: {
        playful:      "0 8px 0px 0 rgba(0,0,0,0.15)",
        "playful-sm": "0 4px 0px 0 rgba(0,0,0,0.15)"
      }
    }
  }
};
