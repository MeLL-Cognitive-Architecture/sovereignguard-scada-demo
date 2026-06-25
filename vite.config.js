import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sovereignguard-scada-demo/', // ATENÇÃO: Deve ser o nome exato do seu repositório entre barras
})
