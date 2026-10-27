# Use Flisk with GitHub Copilot

[← Back to the README](../../README.md#pick-your-agent)

<table>
<tr><td><a href="claude-code.md"><img src="../assets/agents/tab-claude-code.svg" alt="Claude Code" height="44"></a><a href="codex.md"><img src="../assets/agents/tab-codex.svg" alt="Codex" height="44"></a><a href="cursor.md"><img src="../assets/agents/tab-cursor.svg" alt="Cursor" height="44"></a><a href="copilot.md"><img src="../assets/agents/tab-copilot-active.svg" alt="GitHub Copilot (selected)" height="44"></a><a href="gemini-cli.md"><img src="../assets/agents/tab-gemini-cli.svg" alt="Gemini CLI" height="44"></a><img src="../assets/agents/tab-rest.svg" alt="" height="44"></td></tr>
<tr><td>

**1. Install GitHub Copilot and Flisk**

Install [VS Code](https://code.visualstudio.com) and sign in to Copilot (the Copilot icon in the status bar, then **Use AI Features**). Use Copilot Chat in agent mode. Then install Flisk:

```bash
npm install -g @flisk-sh/flisk
```

**2. Paste the prompt**

```text
Build me a small online shop with a storefront and an orders API, and run it on my laptop with Flisk.
```

**3. Skills and instructions.** Copilot reads the root `AGENTS.md` and the skills in `.agents/skills/` and `.claude/skills/` that `flisk project` writes.

**4. Optional: connect Flisk as an MCP server**, so the agent can start the stack, check status and restart services through Flisk tools instead of shell commands.

```bash
code --add-mcp '{"name":"flisk","type":"stdio","command":"flisk","args":["mcp"]}'
```

That adds it to your VS Code profile. For one project only, create `.vscode/mcp.json`. Note that the top-level key is `servers`:

```json
{ "servers": { "flisk": { "type": "stdio", "command": "flisk", "args": ["mcp"] } } }
```

Docs: [setup](https://code.visualstudio.com/docs/copilot/setup) · [MCP servers](https://code.visualstudio.com/docs/copilot/customization/mcp-servers) · [MCP reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration) · [instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) · [skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)

</td></tr>
</table>

---

Using a different agent? Pick its tab above. Any other agent that can run terminal commands works too. Point it at `AGENTS.md`, or connect it to `flisk mcp`, which runs an MCP server over stdio.
