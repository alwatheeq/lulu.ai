/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#FB7185", // Rose 400
                primaryDark: "#E11D48", // Rose 600
                secondary: "#A78BFA", // Violet 400
                dark: "#18181B", // Zinc 900
                darker: "#09090B", // Zinc 950
                card: "#27272A", // Zinc 800
                light: "#FFF1F2", // Rose 50
                accent: "#FBBF24", // Amber 400
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            backgroundImage: {
                'gradient-chic': 'linear-gradient(to right bottom, #E11D48, #C026D3)', // Rose to Fuchsia
                'gradient-glass': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
            }
        },
    },
    plugins: [],
}
