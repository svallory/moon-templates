import path from "node:path";
import { fileURLToPath } from "node:url";
import { svelteWarnings } from "@cva.design/figma-sdk/config/svelte-warnings/plugin";
import { sveltekit } from "@sveltejs/kit/vite";
import { searchForWorkspaceRoot } from "vite";
import { default as tsconfigPaths } from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = searchForWorkspaceRoot(process.cwd());

console.log(`Workspace Root: ${workspaceRoot}`);
console.log(`__dirname: ${__dirname}`);
// process.exit(0);

// Debug plugin
const debugResolvePlugin = () => ({
	name: "debug-resolve",
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			console.log(`Request URL: ${req.url}`);
			next();
		});
	},
	resolveId(source, importer) {
		console.log(`Resolving: ${source} from ${importer}`);
		return null;
	},
});

const config = defineConfig({
	root: path.resolve(__dirname, "."),
	// define: {
	//   __dirname: 'import.meta.dirname',
	//   __filename: 'import.meta.url',
	// },
	plugins: [
		debugResolvePlugin(),
		tsconfigPaths({
			root: path.resolve(__dirname, "."),
		}),
		sveltekit(),
		svelteWarnings({
			disable: [/a11y*/],
			summary: "all",
			listAllCodes: true,
		}),
	],
	optimizeDeps: {
		exclude: ["fsevents"],
	},
	build: {
		sourcemap: true,
		commonjsOptions: {
			transformMixedEsModules: true,
		},
	},
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
	},
	server: {
		watch: {
			// usePolling: true,
			// interval: 100,
		},
	},
});

console.log(
	`
  ========================================
  Vite Config:
  ----------------------------------------
  ${JSON.stringify(config, null, 2)}
  ========================================
  `,
);

export default config;
