import { Command } from "commander";
import { type AgentSessionList } from "../utils/agent-sessions.js";
export { agentSessionRequest, httpGet } from "../utils/agent-sessions.js";
/** "12s ago", "5m ago", "3h ago", "2d ago"; "-" when the agent sent no time. */
export declare function formatAge(iso: string | null, now?: number): string;
/** The plain-text table `flisk agent sessions <resource>` prints, one line per session. */
export declare function formatSessionTable(list: AgentSessionList, now?: number): string[];
export declare const agentCommand: Command;
