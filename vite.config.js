import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" hace que funcione tanto en dominio raíz como en subcarpeta (GitHub Pages)
export default defineConfig({
  plugins: [react()],
  base: "./",
});
