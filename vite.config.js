import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig(async () => {
  const plugins = [react()]

  // mkcert solo en desarrollo local (genera cert HTTPS para probar cámara en iPhone)
  if (!isProd) {
    const { default: mkcert } = await import('vite-plugin-mkcert')
    plugins.unshift(mkcert())
  }

  plugins.push(
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Rafael Pineda · Pintor de Córdoba',
        short_name: 'Pineda Córdoba',
        description: 'Pasaporte digital · Exposición Rafael Pineda Pintor de Córdoba · 12 espacios',
        theme_color: '#b5451b',
        background_color: '#faf7f2',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    })
  )

  return {
    base: isProd ? '/Pineda/' : '/',
    plugins,
  }
})
