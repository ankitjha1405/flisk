// Copyright (c) 2026 Flisk Landscape contributors
// SPDX-License-Identifier: MIT
import assert from "node:assert/strict";
import { test } from "node:test";
import { MAX_PAGES, measure, starsSince } from "./star-velocity.mjs";

const NOW = new Date("2026-10-28T12:00:00Z");
const HOUR = 3600 * 1000;
// An ISO time `h` hours before NOW.
const ago = (h) => new Date(NOW.getTime() - h * HOUR).toISOString().replace(".000", "");

// A fake `gh api` serving the REST stargazers list oldest first, 100 to a page, like /stargazers with the star media type.
function fakeGh(starTimes, total = starTimes.length, calls = []) {
	// Stars beyond the ones given (the total is larger) are ancient, and sit at the oldest end.
	const oldestFirst = [...Array.from({ length: Math.max(0, total - starTimes.length) }, () => ago(1e5)), ...[...starTimes].reverse()];
	return (args) => {
		assert.equal(args[0], "api");
		if (args.length === 2) return { stargazers_count: total };
		assert.deepEqual(args.slice(1, 3), ["-H", "Accept: application/vnd.github.star+json"]);
		const page = Number(/&page=(\d+)/.exec(args[3])[1]);
		calls.push(page);
		return oldestFirst.slice((page - 1) * 100, page * 100).map((starred_at) => ({ starred_at }));
	};
}

test("counts the last 24 hours, the 24 hours before, and 7 days, over two pages", () => {
	// 120 stars in the last 24 h (so the first page of 100 is all in the window), then 5 in the day before, 3 later in
	// the week, and 4 older than 7 days.
	const times = [
		...Array.from({ length: 120 }, (_, i) => ago(0.1 + (i * 23.8) / 120)),
		...[24.5, 30, 40, 47, 47.9].map(ago),
		...[60, 100, 167].map(ago),
		...[170, 200, 300, 400].map(ago),
	];
	const calls = [];
	const r = measure({ repo: "flisk-sh/flisk", now: NOW, gh: fakeGh(times, 1234, calls) });
	assert.equal(r.value, 120);
	assert.equal(r.summary, "120 in 24 h, 5 in the 24 h before, 128 in 7 d (18.3 a day), 1234 in total");
	// Page two holds the first star older than 7 days, so there is no third request.
	assert.equal(calls.length, 2);
	assert.deepEqual(calls, [13, 12]);
});

test("a star exactly 24 hours old belongs to the previous day, one in the future is not counted", () => {
	const r = measure({ repo: "flisk-sh/flisk", now: NOW, gh: fakeGh([ago(-1), ago(0), ago(23.99), ago(24), ago(48)]) });
	assert.equal(r.value, 2);
	assert.match(r.summary, /^2 in 24 h, 1 in the 24 h before, 4 in 7 d/);
});

test("stops paging once the page reaches stars older than 7 days, and says so when the page cap is hit", () => {
	const calls = [];
	assert.equal(starsSince(fakeGh([ago(1), ago(200)], 2, calls), "flisk-sh/flisk", new Date(NOW - 168 * HOUR)).capped, false);
	assert.equal(calls.length, 1);
	// 100 fresh stars, 100 older than 7 days, then 100 more that must never be asked for.
	const three = [...Array.from({ length: 100 }, () => ago(2)), ...Array.from({ length: 200 }, () => ago(300))];
	const asked = [];
	starsSince(fakeGh(three, 300, asked), "flisk-sh/flisk", new Date(NOW - 168 * HOUR));
	assert.equal(asked.length, 2);
	// Every page newer than 7 days, forever: the cap stops the walk.
	const many = Array.from({ length: 100 * (MAX_PAGES + 5) }, (_, i) => ago(1 + i / 1e6));
	const pages = [];
	const r = measure({ repo: "flisk-sh/flisk", now: NOW, gh: fakeGh(many, many.length, pages) });
	assert.equal(pages.length, MAX_PAGES);
	assert.equal(r.value, 100 * MAX_PAGES);
	assert.match(r.summary, new RegExp(`capped at ${MAX_PAGES} pages, so the counts are lower bounds$`));
});

test("a repository with no stars has a zero, not no data", () => {
	const r = measure({ repo: "flisk-sh/flisk", now: NOW, gh: fakeGh([]) });
	assert.equal(r.value, 0);
	assert.equal(r.summary, "0 in 24 h, 0 in the 24 h before, 0 in 7 d (0 a day), 0 in total");
});
