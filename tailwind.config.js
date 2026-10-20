/** @type {import('tailwindcss').Config} */
// Tailwind ne sert qu'aux utilitaires de mise en page. Couleurs, polices et
// courbes vivent en variables dans src/index.css, que toutes les feuilles lisent.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        papier: 'rgb(var(--papier) / <alpha-value>)',
        encre: 'rgb(var(--encre) / <alpha-value>)',
        gris: 'rgb(var(--gris) / <alpha-value>)',
        beni: 'rgb(var(--beni) / <alpha-value>)',
        nuit: 'rgb(var(--nuit) / <alpha-value>)',
      },
      fontFamily: {
        titre: ['Anton', 'Impact', 'Arial Narrow', 'sans-serif'],
        texte: ['Instrument Serif', 'Georgia', 'serif'],
      },
      transitionTimingFunction: { smooth: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      screens: { xs: '360px' },
    },
  },
  plugins: [],
}
