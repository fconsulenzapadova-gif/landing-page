import { defineConfig, type Connect } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import driveImagesHandler from "./api/drive-images";

const driveImagesMiddleware: Connect.NextHandleFunction = async (request, response, next) => {
  if (!request.url?.startsWith("/api/drive-images")) {
    next();
    return;
  }

  try {
    const functionResponse = await driveImagesHandler(new Request(new URL(request.url, "http://localhost")));
    response.statusCode = functionResponse.status;
    functionResponse.headers.forEach((value, key) => response.setHeader(key, value));
    response.end(Buffer.from(await functionResponse.arrayBuffer()));
  } catch (error) {
    next(error);
  }
};

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    {
      name: "local-drive-images-function",
      configureServer(server) {
        server.middlewares.use(driveImagesMiddleware);
      },
      configurePreviewServer(server) {
        server.middlewares.use(driveImagesMiddleware);
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore TypeScript warnings during build
        if (warning.code === 'PLUGIN_WARNING') return;
        warn(warning);
      }
    }
  }
}));
