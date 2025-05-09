/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)'],
                serif: ['var(--font-serif)'],
            },
        },
    },
    plugins: [],
};