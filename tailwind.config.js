module.exports = {
  purge: ['./demo/tailwindcss/**/*.html', './demo/tailwindcss/**/*.js'], // 指定要清除未使用的 CSS 的文件路径
  darkMode: false, // 或者 'media' 或 'class'
  theme: {
    extend: {
      colors: {
        'custom-color': '#64748B',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}