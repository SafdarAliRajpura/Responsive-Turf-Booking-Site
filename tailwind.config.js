/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    green: '#39ff14',
                    blue: '#00f3ff',
                    pink: '#ff00ff',
                    yellow: '#fbff00',
                },
            },
            boxShadow: {
                'neon-green': '0 0 20px rgba(57, 255, 20, 0.5), 0 0 100px rgba(57, 255, 20, 0.1)',
                'neon-blue': '0 0 20px rgba(0, 243, 255, 0.5), 0 0 100px rgba(0, 243, 255, 0.1)',
                'card-glow': '0 20px 50px rgba(0,0,0,0.5)',
            },
            animation: {
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
        },
    },
    plugins: [],
}
