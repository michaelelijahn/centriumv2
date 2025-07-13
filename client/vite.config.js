// localhost using a proxy server
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig({
//     plugins: [react()],
//     define: { "process.env": {} },
//     resolve: {
//         alias: {
//             "@": path.resolve(__dirname, "src"),
//         },
//     },
//     base: '/',
//     server: {
//         proxy: {
//             '/api': {
//                 target: 'https://crm.centrium.id',
//                 changeOrigin: true,
//                 rewrite: (path) => path.replace(/^\/api/, '')
//             }
//         }
//     }
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    define: { "process.env": {} },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    base: '/'
});