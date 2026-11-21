import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#FFF8EE' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#FFF8EE' } },
  },
  images: ['public/icon.svg'],
});
