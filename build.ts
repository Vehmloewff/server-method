import { build } from "bun";
import { rename } from "node:fs/promises";
import dts from "bun-plugin-dts";

await build({
	entrypoints: ["./index_bun.ts"],
	outdir: "./dist",
	plugins: [dts()],
	format: "esm",
});

await build({
	entrypoints: ["./index_browser.ts"],
	outdir: "./dist",
	format: "esm",
});

await rename("./dist/index_bun.d.ts", "./dist/index.d.ts");
