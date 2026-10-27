// Copyright (c) 2026 Flisk Landscape contributors
// SPDX-License-Identifier: MIT
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { backtickedPaths, measure } from "./agents-md-paths.mjs";

test("backtickedPaths reads paths outside fenced code and drops trailing punctuation and line numbers", () => {
	const md = "Read `cli/AGENTS.md`, then `cli/src/x.ts:12`.\n```\n`cli/gone.ts`\n```\nNot a path: `flisk up`, `*.ts`, `<dir>/x`\n";
	assert.deepEqual(backtickedPaths(md), [
		{ line: 1, path: "cli/AGENTS.md" },
		{ line: 1, path: "cli/src/x.ts" },
	]);
});

test("measure flags a missing repo path and a path that moved under runtime/, not project or vendored paths", () => {
	const root = mkdtempSync(path.join(tmpdir(), "agents-md-paths-"));
	try {
		mkdirSync(path.join(root, "cli/src"), { recursive: true });
		mkdirSync(path.join(root, "runtime/engine/topologies/tilt"), { recursive: true });
		mkdirSync(path.join(root, "cli/engine"), { recursive: true });
		writeFileSync(path.join(root, "cli/src/index.ts"), "");
		writeFileSync(
			path.join(root, "AGENTS.md"),
			[
				"- `cli/src/index.ts` exists",
				"- `cli/src/gone.ts` does not",
				"- `engine/topologies/tilt/` moved",
				"- `engine/` is a vendored name",
				"- `services/product/api` is a project path",
			].join("\n"),
		);
		writeFileSync(path.join(root, "cli/engine/AGENTS.md"), "`cli/src/also-gone.ts`\n");
		const { value, findings } = measure({ root });
		assert.equal(value, 2);
		assert.deepEqual(findings, [
			"AGENTS.md:2 `cli/src/gone.ts`: no such file or directory",
			"AGENTS.md:3 `engine/topologies/tilt/`: moved to runtime/engine/topologies/tilt/",
		]);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
