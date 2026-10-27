# Use Flisk with Cursor

[← Back to the README](../../README.md#pick-your-agent)

<p align="center">
<a href="claude-code.md"><img src="../assets/agents/tab-claude-code.svg" alt="Claude Code" height="36"></a>
<a href="codex.md"><img src="../assets/agents/tab-codex.svg" alt="Codex" height="36"></a>
<a href="cursor.md"><img src="../assets/agents/tab-cursor-active.svg" alt="Cursor (selected)" height="36"></a>
<a href="copilot.md"><img src="../assets/agents/tab-copilot.svg" alt="GitHub Copilot" height="36"></a>
<a href="gemini-cli.md"><img src="../assets/agents/tab-gemini-cli.svg" alt="Gemini CLI" height="36"></a>
</p>

**1. Install Cursor and Flisk**

Install the [Cursor editor](https://cursor.com), or the Cursor CLI:

```bash
curl https://cursor.com/install -fsS | bash
npm install -g @flisk-sh/flisk
```

**2. Paste the prompt**

```text
Build me a small online shop with a storefront and an orders API, and run it on my laptop with Flisk.
```

**3. Skills and instructions.** Cursor reads the `AGENTS.md` and the skills in `.agents/skills/` (and `.claude/skills/`) that `flisk project` writes.

**4. Optional: connect Flisk as an MCP server**, so the agent can start the stack, check status and restart services through Flisk tools instead of shell commands.

Cursor has no command to add a server, so create `.cursor/mcp.json` in the project (or `~/.cursor/mcp.json` for every project):

```json
{ "mcpServers": { "flisk": { "type": "stdio", "command": "flisk", "args": ["mcp"] } } }
```

Docs: [CLI install](https://cursor.com/docs/cli/installation) · [MCP](https://cursor.com/docs/context/mcp) · [rules](https://cursor.com/docs/context/rules) · [skills](https://cursor.com/docs/context/skills)

---

Using a different agent? Pick its tab above. Any other agent that can run terminal commands works too. Point it at `AGENTS.md`, or connect it to `flisk mcp`, which runs an MCP server over stdio.
