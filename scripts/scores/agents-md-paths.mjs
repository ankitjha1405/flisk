// Copyright (c) 2026 Flisk Landscape contributors
// SPDX-License-Identifier: MIT
// The guidance an agent reads before it edits — every AGENTS.md and CLAUDE.md, and .claude/memory/MEMORY.md — names
// files in backticks, and the agent opens them as written. A path that no longer exists sends it to the wrong place or
// makes it invent one. A backticked path counts as a repo path when its first segment is an entry at the repo root
// (cli/, runtime/, docs/, scripts/, ...): that one must exist. The old top-level engine/, discovery/, specs/ and ext/
// moved under runtime/ (#2060), so such a path whose runtime/ twin exists is stale too; inside a vendored project
// they are still real names, so a path that only goes one level deep is left alone. Paths in fenced code, globs and
// placeholders are not read. Gate at zero.
import { readdirSync } from "node:fs";
import { has, read, walk } from "./lib.mjs";

export const meta = {
	id: "agents-md-paths",
	title: "Paths in agent guidance files that exist",
	source: "files",
	mode: "gate",
	target: 0,
	better: "lower",
	unit: "stale paths",
};

export const MOVED_ROOTS = ["engine", "discovery", "specs", "ext"];

// Not this checkout's guidance: other agents' working copies (.claude/worktrees/), proposals (openspec/), and the
// gitignored copies of runtime/ that the CLI build makes (cli/engine/, ...; a finding there is fixed in runtime/).
const isGuidance = (rel) =>
	(/(^|\/)(AGENTS|CLAUDE)\.md$/.test(rel) || rel === ".claude/memory/MEMORY.md") &&
	!/^(openspec|\.claude\/worktrees|cli\/(discovery|engine|ext|specs))\//.test(rel);

// Backticked repo-style paths outside fenced code: { line, path }.
export function backtickedPaths(markdown) {
	const out = [];
	let fenced = false;
	markdown.split("\n").forEach((line, i) => {
		if (/^\s*(```|~~~)/.test(line)) {
			fenced = !fenced;
			return;
		}
		if (fenced) return;
		for (const m of line.matchAll(/`([^`\s]+)`/g)) {
			const p = m[1].replace(/[.,;:)]+$/, "").replace(/:\d+(-\d+)?$/, "");
			if (p.includes("/") && /^[\w.\-/]+$/.test(p)) out.push({ line: i + 1, path: p });
		}
	});
	return out;
}

// Why a path is stale, or null. roots: the names at the repo root.
export function staleReason(root, roots, p) {
	const first = p.split("/")[0];
	if (roots.has(first)) return has(root, p) ? null : "no such file or directory";
	if (MOVED_ROOTS.includes(first) && p.replace(/\/$/, "").split("/").length >= 3 && has(root, `runtime/${p}`))
		return `moved to runtime/${p}`;
	return null;
}

export function measure({ root }) {
	const roots = new Set(readdirSync(root).filter((n) => n !== ".git" && n !== "node_modules"));
	const files = walk(root, ".", isGuidance);
	const findings = [];
	let checked = 0;
	for (const rel of files) {
		for (const { line, path: p } of backtickedPaths(read(root, rel))) {
			const why = staleReason(root, roots, p);
			if (why === null && !roots.has(p.split("/")[0])) continue;
			checked++;
			if (why) findings.push(`${rel}:${line} \`${p}\`: ${why}`);
		}
	}
	return {
		value: findings.length,
		summary: `${checked} repo paths in ${files.length} agent guidance files, ${findings.length} stale`,
		findings,
	};
}
