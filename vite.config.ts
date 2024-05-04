import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import tailwind from 'tailwindcss'
import tailwindNested from 'tailwindcss/nesting'
import tailwindConfig from './tailwind.config'
import postcssPresetEnv from 'postcss-preset-env'
import uniTailwind from '@uni-helper/vite-plugin-uni-tailwind'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    css: {
        postcss: {
            plugins: [
                tailwindNested(),
                tailwind({
                    config: tailwindConfig
                }),
                postcssPresetEnv({
                    stage: 3,
                    features: {
                        'nesting-rules': false
                    }
                })
            ]
        }
    },
    plugins: [uni(), uniTailwind()],
    build: {
        sourcemap: process.env.NODE_ENV !== 'development'
    }
})
