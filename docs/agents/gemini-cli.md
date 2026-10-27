# Use Flisk with Gemini CLI

[← Back to the README](../../README.md#pick-your-agent)

<p align="center">
<a href="claude-code.md"><img src="../assets/agents/tab-claude-code.svg" alt="Claude Code" height="36"></a>
<a href="codex.md"><img src="../assets/agents/tab-codex.svg" alt="Codex" height="36"></a>
<a href="cursor.md"><img src="../assets/agents/tab-cursor.svg" alt="Cursor" height="36"></a>
<a href="copilot.md"><img src="../assets/agents/tab-copilot.svg" alt="GitHub Copilot" height="36"></a>
<a href="gemini-cli.md"><img src="../assets/agents/tab-gemini-cli-active.svg" alt="Gemini CLI (selected)" height="36"></a>
</p>

**1. Install Gemini CLI and Flisk**

```bash
npm install -g @google/gemini-cli
npm install -g @flisk-sh/flisk
```

Also available with `brew install gemini-cli`. Google has replaced Gemini CLI with [Antigravity CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli) for unpaid and Google One users.

**2. Paste the prompt**

```text
Build me a small online shop with a storefront and an orders API, and run it on my laptop with Flisk.
```

**3. Skills and instructions.** Gemini CLI loads the skills in `.agents/skills/` that `flisk project` writes. It reads `GEMINI.md` rather than `AGENTS.md` by default, so add `"context": { "fileName": ["AGENTS.md", "GEMINI.md"] }` to `.gemini/settings.json`.

**4. Optional: connect Flisk as an MCP server**, so the agent can start the stack, check status and restart services through Flisk tools instead of shell commands.

```bash
gemini mcp add flisk flisk mcp
```

This writes `.gemini/settings.json` in the project. Add `-s user` to use it everywhere:

```json
{ "mcpServers": { "flisk": { "command": "flisk", "args": ["mcp"] } } }
```

Docs: [install](https://geminicli.com/docs/get-started/installation/) · [MCP](https://geminicli.com/docs/tools/mcp-server/) · [GEMINI.md](https://geminicli.com/docs/cli/gemini-md/) · [skills](https://geminicli.com/docs/cli/skills/)

---

Using a different agent? Pick its tab above. Any other agent that can run terminal commands works too. Point it at `AGENTS.md`, or connect it to `flisk mcp`, which runs an MCP server over stdio.
