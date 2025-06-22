import { build, $ } from "bun";

await build({
	entrypoints: ["./index_bun.ts"],
	outdir: "./dist",
	format: "esm",
});

await build({
	entrypoints: ["./index_browser.ts"],
	outdir: "./dist",
	format: "esm",
});

await $`bunx tsc -p tsconfig_tsc.json`;
