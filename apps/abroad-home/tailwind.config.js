/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // 解决 tailwind css 与 antd 样式冲突，导致 Button 背景透明的bug
  corePlugins: {
    preflight: false,
  },
}
