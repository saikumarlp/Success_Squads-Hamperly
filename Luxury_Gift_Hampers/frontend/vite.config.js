import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const removeMozColumnGap = () => {
  return {
    postcssPlugin: 'remove-moz-column-gap',
    Declaration(decl) {
      if (decl.prop === '-moz-column-gap') {
        decl.remove();
      }
    }
  }
}
removeMozColumnGap.postcss = true;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        removeMozColumnGap()
      ]
    }
  }
})

