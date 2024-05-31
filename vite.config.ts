import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: 'css-in-js' })],
    }),
    AutoImport({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    open: true,
    disableHostCheck: true,
    proxy: {
      '/api': {
        //请求称号
        target: 'http://localhost:3001/api',
        // target: 'https://pi-ex-spot.pandora-demo.xyz/api', //请求的接口
        changeOrigin: true, //容许跨域
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/uploads': {
        //请求称号
        target: 'http://localhost:3001/uploads', //请求的接口
        changeOrigin: true, //容许跨域
        rewrite: (path) => path.replace(/^\/uploads/, ''),
      },
    },
  },
})
