import { defineConfig } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
    vite: {
        server: {
            allowedHosts: ['furag.iiap.org.co', 'link.iiap.org.co', 'localhost', '127.0.0.1'],
        },
        ssr: {
            noExternal: true,
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