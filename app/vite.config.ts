import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { qrcode } from "vite-plugin-qrcode";

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.VITE_GOOGLE_MAPS_API_KEY": JSON.stringify(
        env.VITE_GOOGLE_MAPS_API_KEY,
      ),
      "process.env.VITE_GOOGLE_MAPS_MAP_ID": JSON.stringify(
        env.VITE_GOOGLE_MAPS_API_KEY,
      ),
    },
    plugins: [react(), qrcode()],
  };
});
