// vite.config.ts
import path, { resolve } from "path";
import react from "file:///C:/Users/berny/proyects/falitech/LibreChat%20-%20Fork/LibreChat/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///C:/Users/berny/proyects/falitech/LibreChat%20-%20Fork/LibreChat/node_modules/vite-plugin-pwa/dist/index.js";
import { defineConfig, createLogger } from "file:///C:/Users/berny/proyects/falitech/LibreChat%20-%20Fork/LibreChat/node_modules/vite/dist/node/index.js";
import { nodePolyfills } from "file:///C:/Users/berny/proyects/falitech/LibreChat%20-%20Fork/LibreChat/node_modules/vite-plugin-node-polyfills/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\berny\\proyects\\falitech\\LibreChat - Fork\\LibreChat\\client";
var logger = createLogger();
var originalWarning = logger.warn;
logger.warn = (msg, options) => {
  if (msg.includes("vite:css") && msg.includes("^^^^^^^")) {
    return;
  }
  if (msg.includes("Use build.rollupOptions.output.manualChunks")) {
    return;
  }
  originalWarning(msg, options);
};
var vite_config_default = defineConfig({
  customLogger: logger,
  server: {
    fs: {
      cachedChecks: false
    },
    host: "localhost",
    port: 3090,
    strictPort: false,
    proxy: {
      "/api": {
        target: "http://localhost:3080",
        changeOrigin: true
      },
      "/oauth": {
        target: "http://localhost:3080",
        changeOrigin: true
      }
    }
  },
  // All other env variables are filtered out
  envDir: "../",
  envPrefix: ["VITE_", "SCRIPT_", "DOMAIN_", "ALLOW_"],
  plugins: [
    react(),
    nodePolyfills(),
    VitePWA({
      injectRegister: "auto",
      // 'auto' | 'manual' | 'disabled'
      registerType: "autoUpdate",
      // 'prompt' | 'autoUpdate'
      devOptions: {
        enabled: false
        // enable/disable registering SW in development mode
      },
      workbox: {
        globPatterns: ["assets/**/*.{png,jpg,svg,ico}", "**/*.{js,css,html,ico,woff2}"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024
      },
      manifest: {
        name: "LibreChat",
        short_name: "LibreChat",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#009688",
        icons: [
          {
            src: "/assets/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png"
          },
          {
            src: "/assets/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png"
          },
          {
            src: "/assets/apple-touch-icon-180x180.png",
            sizes: "180x180",
            type: "image/png"
          },
          {
            src: "/assets/maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    }),
    sourcemapExclude({ excludeNodeModules: true })
  ],
  publicDir: "./public",
  build: {
    sourcemap: process.env.NODE_ENV === "development",
    outDir: "./dist",
    rollupOptions: {
      // external: ['uuid'],
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/highlight.js")) {
            return "markdown_highlight";
          }
          if (id.includes("node_modules/hast-util-raw")) {
            return "markdown_large";
          }
          if (id.includes("node_modules/katex")) {
            return "markdown_large";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name)) {
            return "assets/[name][extname]";
          }
          return "assets/[name].[hash][extname]";
        }
      },
      /**
       * Ignore "use client" waning since we are not using SSR
       * @see {@link https://github.com/TanStack/query/pull/5161#issuecomment-1477389761 Preserve 'use client' directives TanStack/query#5161}
       */
      onwarn(warning, warn) {
        if (
          // warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
          warning.message.includes("Error when using sourcemap")
        ) {
          return;
        }
        warn(warning);
      }
    }
  },
  resolve: {
    alias: {
      "~": path.join(__vite_injected_original_dirname, "src/"),
      $fonts: resolve("public/fonts")
    }
  }
});
function sourcemapExclude(opts) {
  return {
    name: "sourcemap-exclude",
    transform(code, id) {
      if (opts?.excludeNodeModules && id.includes("node_modules")) {
        return {
          code,
          // https://github.com/rollup/rollup/blob/master/docs/plugin-development/index.md#source-code-transformations
          map: { mappings: "" }
        };
      }
    }
  };
}
export {
  vite_config_default as default,
  sourcemapExclude
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxiZXJueVxcXFxwcm95ZWN0c1xcXFxmYWxpdGVjaFxcXFxMaWJyZUNoYXQgLSBGb3JrXFxcXExpYnJlQ2hhdFxcXFxjbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGJlcm55XFxcXHByb3llY3RzXFxcXGZhbGl0ZWNoXFxcXExpYnJlQ2hhdCAtIEZvcmtcXFxcTGlicmVDaGF0XFxcXGNsaWVudFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYmVybnkvcHJveWVjdHMvZmFsaXRlY2gvTGlicmVDaGF0JTIwLSUyMEZvcmsvTGlicmVDaGF0L2NsaWVudC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgY3JlYXRlTG9nZ2VyIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgfSBmcm9tICd2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxscyc7XHJcbmltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSAndml0ZSc7XHJcblxyXG5jb25zdCBsb2dnZXIgPSBjcmVhdGVMb2dnZXIoKTtcclxuY29uc3Qgb3JpZ2luYWxXYXJuaW5nID0gbG9nZ2VyLndhcm47XHJcbmxvZ2dlci53YXJuID0gKG1zZywgb3B0aW9ucykgPT4ge1xyXG4gIC8qIFN1cHByZXNzZXM6XHJcbiAgIFt2aXRlOmNzc10gQ29tcGxleCBzZWxlY3RvcnMgaW4gJy5ncm91cDpmb2N1cy13aXRoaW4gLmRhcmtcXDpncm91cC1mb2N1cy13aXRoaW5cXDp0ZXh0LWdyYXktMzAwOmlzKC5kYXJrICopJyBjYW4gbm90IGJlIHRyYW5zZm9ybWVkIHRvIGFuIGVxdWl2YWxlbnQgc2VsZWN0b3Igd2l0aG91dCAnOmlzKCknLlxyXG4gICAqL1xyXG4gIGlmIChtc2cuaW5jbHVkZXMoJ3ZpdGU6Y3NzJykgJiYgbXNnLmluY2x1ZGVzKCdeXl5eXl5eJykpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgLyogU3VwcHJlc3NlczpcclxuKCEpIFNvbWUgY2h1bmtzIGFyZSBsYXJnZXIgdGhhbiA1MDAga0IgYWZ0ZXIgbWluaWZpY2F0aW9uLiBDb25zaWRlcjpcclxuLSBVc2luZyBkeW5hbWljIGltcG9ydCgpIHRvIGNvZGUtc3BsaXQgdGhlIGFwcGxpY2F0aW9uXHJcbi0gVXNlIGJ1aWxkLnJvbGx1cE9wdGlvbnMub3V0cHV0Lm1hbnVhbENodW5rcyB0byBpbXByb3ZlIGNodW5raW5nOiBodHRwczovL3JvbGx1cGpzLm9yZy9jb25maWd1cmF0aW9uLW9wdGlvbnMvI291dHB1dC1tYW51YWxjaHVua3NcclxuLSBBZGp1c3QgY2h1bmsgc2l6ZSBsaW1pdCBmb3IgdGhpcyB3YXJuaW5nIHZpYSBidWlsZC5jaHVua1NpemVXYXJuaW5nTGltaXQuXHJcbiAgICovXHJcbiAgaWYgKG1zZy5pbmNsdWRlcygnVXNlIGJ1aWxkLnJvbGx1cE9wdGlvbnMub3V0cHV0Lm1hbnVhbENodW5rcycpKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIG9yaWdpbmFsV2FybmluZyhtc2csIG9wdGlvbnMpO1xyXG59O1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBjdXN0b21Mb2dnZXI6IGxvZ2dlcixcclxuICBzZXJ2ZXI6IHtcclxuICAgIGZzOiB7XHJcbiAgICAgIGNhY2hlZENoZWNrczogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXHJcbiAgICBwb3J0OiAzMDkwLFxyXG4gICAgc3RyaWN0UG9ydDogZmFsc2UsXHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL2FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjMwODAnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgJy9vYXV0aCc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjMwODAnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyBBbGwgb3RoZXIgZW52IHZhcmlhYmxlcyBhcmUgZmlsdGVyZWQgb3V0XHJcbiAgZW52RGlyOiAnLi4vJyxcclxuICBlbnZQcmVmaXg6IFsnVklURV8nLCAnU0NSSVBUXycsICdET01BSU5fJywgJ0FMTE9XXyddLFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBub2RlUG9seWZpbGxzKCksXHJcbiAgICBWaXRlUFdBKHtcclxuICAgICAgaW5qZWN0UmVnaXN0ZXI6ICdhdXRvJywgLy8gJ2F1dG8nIHwgJ21hbnVhbCcgfCAnZGlzYWJsZWQnXHJcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLCAvLyAncHJvbXB0JyB8ICdhdXRvVXBkYXRlJ1xyXG4gICAgICBkZXZPcHRpb25zOiB7XHJcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsIC8vIGVuYWJsZS9kaXNhYmxlIHJlZ2lzdGVyaW5nIFNXIGluIGRldmVsb3BtZW50IG1vZGVcclxuICAgICAgfSxcclxuICAgICAgd29ya2JveDoge1xyXG4gICAgICAgIGdsb2JQYXR0ZXJuczogWydhc3NldHMvKiovKi57cG5nLGpwZyxzdmcsaWNvfScsICcqKi8qLntqcyxjc3MsaHRtbCxpY28sd29mZjJ9J10sXHJcbiAgICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDMgKiAxMDI0ICogMTAyNCxcclxuICAgICAgfSxcclxuICAgICAgbWFuaWZlc3Q6IHtcclxuICAgICAgICBuYW1lOiAnTGlicmVDaGF0JyxcclxuICAgICAgICBzaG9ydF9uYW1lOiAnTGlicmVDaGF0JyxcclxuICAgICAgICBzdGFydF91cmw6ICcvJyxcclxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXHJcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyMwMDAwMDAnLFxyXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnIzAwOTY4OCcsXHJcbiAgICAgICAgaWNvbnM6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiAnL2Fzc2V0cy9mYXZpY29uLTMyeDMyLnBuZycsXHJcbiAgICAgICAgICAgIHNpemVzOiAnMzJ4MzInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJy9hc3NldHMvZmF2aWNvbi0xNngxNi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzE2eDE2JyxcclxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICcvYXNzZXRzL2FwcGxlLXRvdWNoLWljb24tMTgweDE4MC5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzE4MHgxODAnLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJy9hc3NldHMvbWFza2FibGUtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgcHVycG9zZTogJ21hc2thYmxlJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgc291cmNlbWFwRXhjbHVkZSh7IGV4Y2x1ZGVOb2RlTW9kdWxlczogdHJ1ZSB9KSxcclxuICBdLFxyXG4gIHB1YmxpY0RpcjogJy4vcHVibGljJyxcclxuICBidWlsZDoge1xyXG4gICAgc291cmNlbWFwOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyxcclxuICAgIG91dERpcjogJy4vZGlzdCcsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIC8vIGV4dGVybmFsOiBbJ3V1aWQnXSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcycpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnbWFya2Rvd25faGlnaGxpZ2h0JztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL2hhc3QtdXRpbC1yYXcnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ21hcmtkb3duX2xhcmdlJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL2thdGV4JykpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdtYXJrZG93bl9sYXJnZSc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS5baGFzaF0uanMnLFxyXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS5baGFzaF0uanMnLFxyXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XHJcbiAgICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWUgJiYgL1xcLih3b2ZmfHdvZmYyfGVvdHx0dGZ8b3RmKSQvLnRlc3QoYXNzZXRJbmZvLm5hbWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnYXNzZXRzL1tuYW1lXVtleHRuYW1lXSc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gJ2Fzc2V0cy9bbmFtZV0uW2hhc2hdW2V4dG5hbWVdJztcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICAvKipcclxuICAgICAgICogSWdub3JlIFwidXNlIGNsaWVudFwiIHdhbmluZyBzaW5jZSB3ZSBhcmUgbm90IHVzaW5nIFNTUlxyXG4gICAgICAgKiBAc2VlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vVGFuU3RhY2svcXVlcnkvcHVsbC81MTYxI2lzc3VlY29tbWVudC0xNDc3Mzg5NzYxIFByZXNlcnZlICd1c2UgY2xpZW50JyBkaXJlY3RpdmVzIFRhblN0YWNrL3F1ZXJ5IzUxNjF9XHJcbiAgICAgICAqL1xyXG4gICAgICBvbndhcm4od2FybmluZywgd2Fybikge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIC8vIHdhcm5pbmcuY29kZSA9PT0gJ01PRFVMRV9MRVZFTF9ESVJFQ1RJVkUnICYmXHJcbiAgICAgICAgICB3YXJuaW5nLm1lc3NhZ2UuaW5jbHVkZXMoJ0Vycm9yIHdoZW4gdXNpbmcgc291cmNlbWFwJylcclxuICAgICAgICApIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2Fybih3YXJuaW5nKTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnfic6IHBhdGguam9pbihfX2Rpcm5hbWUsICdzcmMvJyksXHJcbiAgICAgICRmb250czogcmVzb2x2ZSgncHVibGljL2ZvbnRzJyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuaW50ZXJmYWNlIFNvdXJjZW1hcEV4Y2x1ZGUge1xyXG4gIGV4Y2x1ZGVOb2RlTW9kdWxlcz86IGJvb2xlYW47XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNvdXJjZW1hcEV4Y2x1ZGUob3B0cz86IFNvdXJjZW1hcEV4Y2x1ZGUpOiBQbHVnaW4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAnc291cmNlbWFwLWV4Y2x1ZGUnLFxyXG4gICAgdHJhbnNmb3JtKGNvZGU6IHN0cmluZywgaWQ6IHN0cmluZykge1xyXG4gICAgICBpZiAob3B0cz8uZXhjbHVkZU5vZGVNb2R1bGVzICYmIGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBjb2RlLFxyXG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3JvbGx1cC9yb2xsdXAvYmxvYi9tYXN0ZXIvZG9jcy9wbHVnaW4tZGV2ZWxvcG1lbnQvaW5kZXgubWQjc291cmNlLWNvZGUtdHJhbnNmb3JtYXRpb25zXHJcbiAgICAgICAgICBtYXA6IHsgbWFwcGluZ3M6ICcnIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFksT0FBTyxRQUFRLGVBQWU7QUFDMWEsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUN4QixTQUFTLGNBQWMsb0JBQW9CO0FBQzNDLFNBQVMscUJBQXFCO0FBSjlCLElBQU0sbUNBQW1DO0FBT3pDLElBQU0sU0FBUyxhQUFhO0FBQzVCLElBQU0sa0JBQWtCLE9BQU87QUFDL0IsT0FBTyxPQUFPLENBQUMsS0FBSyxZQUFZO0FBSTlCLE1BQUksSUFBSSxTQUFTLFVBQVUsS0FBSyxJQUFJLFNBQVMsU0FBUyxHQUFHO0FBQ3ZEO0FBQUEsRUFDRjtBQU9BLE1BQUksSUFBSSxTQUFTLDZDQUE2QyxHQUFHO0FBQy9EO0FBQUEsRUFDRjtBQUNBLGtCQUFnQixLQUFLLE9BQU87QUFDOUI7QUFHQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixjQUFjO0FBQUEsRUFDZCxRQUFRO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixjQUFjO0FBQUEsSUFDaEI7QUFBQSxJQUNBLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNoQjtBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsUUFBUTtBQUFBLEVBQ1IsV0FBVyxDQUFDLFNBQVMsV0FBVyxXQUFXLFFBQVE7QUFBQSxFQUNuRCxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxRQUFRO0FBQUEsTUFDTixnQkFBZ0I7QUFBQTtBQUFBLE1BQ2hCLGNBQWM7QUFBQTtBQUFBLE1BQ2QsWUFBWTtBQUFBLFFBQ1YsU0FBUztBQUFBO0FBQUEsTUFDWDtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsY0FBYyxDQUFDLGlDQUFpQyw4QkFBOEI7QUFBQSxRQUM5RSwrQkFBK0IsSUFBSSxPQUFPO0FBQUEsTUFDNUM7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLFdBQVc7QUFBQSxRQUNYLFNBQVM7QUFBQSxRQUNULGtCQUFrQjtBQUFBLFFBQ2xCLGFBQWE7QUFBQSxRQUNiLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsVUFDWDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxpQkFBaUIsRUFBRSxvQkFBb0IsS0FBSyxDQUFDO0FBQUEsRUFDL0M7QUFBQSxFQUNBLFdBQVc7QUFBQSxFQUNYLE9BQU87QUFBQSxJQUNMLFdBQVcsUUFBUSxJQUFJLGFBQWE7QUFBQSxJQUNwQyxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUE7QUFBQSxNQUViLFFBQVE7QUFBQSxRQUNOLGNBQWMsQ0FBQyxPQUFPO0FBQ3BCLGNBQUksR0FBRyxTQUFTLDJCQUEyQixHQUFHO0FBQzVDLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGNBQUksR0FBRyxTQUFTLDRCQUE0QixHQUFHO0FBQzdDLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGNBQUksR0FBRyxTQUFTLG9CQUFvQixHQUFHO0FBQ3JDLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixtQkFBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsUUFDQSxnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0IsQ0FBQyxjQUFjO0FBQzdCLGNBQUksVUFBVSxRQUFRLDhCQUE4QixLQUFLLFVBQVUsSUFBSSxHQUFHO0FBQ3hFLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGlCQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BS0EsT0FBTyxTQUFTLE1BQU07QUFDcEI7QUFBQTtBQUFBLFVBRUUsUUFBUSxRQUFRLFNBQVMsNEJBQTRCO0FBQUEsVUFDckQ7QUFDQTtBQUFBLFFBQ0Y7QUFDQSxhQUFLLE9BQU87QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxLQUFLLGtDQUFXLE1BQU07QUFBQSxNQUNoQyxRQUFRLFFBQVEsY0FBYztBQUFBLElBQ2hDO0FBQUEsRUFDRjtBQUNGLENBQUM7QUFLTSxTQUFTLGlCQUFpQixNQUFpQztBQUNoRSxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixVQUFVLE1BQWMsSUFBWTtBQUNsQyxVQUFJLE1BQU0sc0JBQXNCLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDM0QsZUFBTztBQUFBLFVBQ0w7QUFBQTtBQUFBLFVBRUEsS0FBSyxFQUFFLFVBQVUsR0FBRztBQUFBLFFBQ3RCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
