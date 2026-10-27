// Copyright (c) 2026 Flisk Landscape contributors
// SPDX-License-Identifier: MIT
// How fast GitHub stars arrive: new stars in the last 24 hours, with the total, the last 7 days and the 24 hours before
// that in the summary, so a launch-day spike reads against a normal day. The stargazers are read newest first (the REST
// list is oldest first, so from its last page backwards) until they are older than 7 days. A cap on pages keeps a runaway count from burning the API quota; when it is hit the
// counts are lower bounds and the summary says so.
import { round1 } from "./lib.mjs";

export const meta = {
	id: "star-velocity",
	title: "New GitHub stars in the last 24 hours",
	source: "gh",
	mode: "report",
	better: "higher",
	unit: "stars",
};

export const MAX_PAGES = 30;
const HOUR = 3600 * 1000;

const PAGE = 100;

// Star times (ISO strings, newest first) back to `since`, the total, and whether the page cap cut the walk short.
// REST rather than GraphQL: the Actions token gets "Resource not accessible by integration" from the GraphQL
// stargazers connection. REST lists oldest first, so the walk starts at the last page and goes backwards.
export function starsSince(gh, repo, since) {
	const total = gh(["api", `repos/${repo}`]).stargazers_count ?? 0;
	const times = [];
	const lastPage = Math.ceil(total / PAGE);
	for (let page = lastPage, walked = 1; page >= 1; page--, walked++) {
		if (walked > MAX_PAGES) return { times, total, capped: true };
		const stars = gh(["api", "-H", "Accept: application/vnd.github.star+json", `repos/${repo}/stargazers?per_page=${PAGE}&page=${page}`]);
		const newestFirst = stars.map((s) => s.starred_at).reverse();
		times.push(...newestFirst);
		const oldest = newestFirst.at(-1);
		if (!oldest || new Date(oldest) < since) break;
	}
	return { times, total, capped: false };
}

export function measure(ctx) {
	const ago = (hours) => new Date(ctx.now.getTime() - hours * HOUR);
	const { times, total, capped } = starsSince(ctx.gh, ctx.repo, ago(7 * 24));
	const stars = times.map((t) => new Date(t));
	const between = (from, to) => stars.filter((s) => s > from && s <= to).length;
	const day = between(ago(24), ctx.now);
	const previous = between(ago(48), ago(24));
	const week = between(ago(7 * 24), ctx.now);
	const note = capped ? `; capped at ${MAX_PAGES} pages, so the counts are lower bounds` : "";
	return {
		value: day,
		summary: `${day} in 24 h, ${previous} in the 24 h before, ${week} in 7 d (${round1(week / 7)} a day), ${total} in total${note}`,
	};
}
