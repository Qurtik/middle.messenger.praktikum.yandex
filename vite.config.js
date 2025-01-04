import { defineConfig } from "vite";
import { resolve } from "path";
// import handlebars from "vite-plugin-handlebars";
import { fileURLToPath } from "url";

export default defineConfig({
	//   root: resolve(__dirname, "src"),
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
			},
		},
		outDir: resolve(__dirname, "dist"),
	},
	css: {
		postcss: "./postcss.config.js",
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
		extensions: [".js"],
	},
});
