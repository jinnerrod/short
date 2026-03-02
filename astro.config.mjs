import { defineConfig } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
    vite: {
        server: {
            allowedHosts: ['link.iiap.org.co', 'localhost', '127.0.0.1'],
        },
    },
    server: {
        host: true,
        port: 4321
    },
    output: "server",
    adapter: node({
        mode: "standalone"
    })
});
