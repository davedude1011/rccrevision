import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  safelist: [
    'bg-[#1F1F1F]',
    'bg-[#242424]',
    'text-[#FFFFFF]',
    'hover:border-[#242424]',
    'border-[#242424]',
    'hover:bg-[#242424]',
    'border-[#1F1F1F]',
    'pt-8',
    'flex-1',
    'h-screen',
    'overflow-auto'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
