/** @type {import('tailwindcss').Config} */
module.exports = {
  // 重点：匹配你项目中所有使用Tailwind的文件
  content: [
    "./demo/tailwindcss/**/*.{html,js,jsx,ts,tsx,vue,svelte}", // 根据你的技术栈调整
    "./demo/tailwindcss/index.html", // 静态页面路径
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}