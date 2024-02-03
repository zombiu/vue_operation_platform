// import { fileURLToPath, URL } from 'node:url'

// import { defineConfig ,loadEnv} from 'vite'
// import vue from '@vitejs/plugin-vue'
// import vueJsx from '@vitejs/plugin-vue-jsx'
// import path from 'path'
// //引入svg需要用到插件
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// import { UserConfigExport, ConfigEnv } from 'vite'
// import { viteMockServe } from 'vite-plugin-mock'

// // https://vitejs.dev/config/
// export default defineConfig(({ command,mode }) => {
//   //  process.cwd()获取根目录路径 mode 获取环境模式 是开发还是测试还是生产环境
//   let env = loadEnv(mode, process.cwd())
//   console.log('env=' + JSON.stringify(env));
  
//   return {
//     plugins: [
//       vue(),
//       vueJsx(),
//       createSvgIconsPlugin({
//         iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
//         symbolId: 'icon-[dir]-[name]',
//       }),
//       viteMockServe({
//         //  pnpm i vite-plugin-mock@2.9.6  使用3.0版本会报错
//         localEnabled: command === 'serve',
//       }),
//     ],
//     resolve: {
//       alias: {
//         '@': fileURLToPath(new URL('./src', import.meta.url))
//       }
//     },
//     // scss 全局变量配置
//     css: {
//       preprocessorOptions: {
//         scss: {
//           javascriptEnabled: true,
//           additionalData: '@import "./src/styles/variable.scss";',
//         },
//       },
//     },
//     // 代理跨域
//     server: {
//         proxy: {
//         [env.VITE_APP_BASE_API]: {
//           // 获取数据服务器地址的设置
//         target: env.VITE_SERVE,
//         // 是否代理跨域
//         changeOrigin: true,
//         // 路径重写
//         rewrite: (path) => path.replace(/^\/api/, ''),
//       }
//         }
//     }
//   }
// })
// loadEnv是Vite获取对应环境下的变量，也就是加载.env.development等
import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  // // 获取各个环境下的对应的变量
  let env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      // 配置阿里图标库
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        mockPath: './src/mock',
      }),
    ],
    resolve: {
      alias: {
          "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
        }
    },
    // scss全局变量
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    // 代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          // 获取数据服务器地址
          target: env.VITE_SERVE,
          // 需要代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
