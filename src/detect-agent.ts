import { determineAgent, type AgentResult } from '@vercel/detect-agent';
import { setDetectedAgent } from './telemetry.ts';
import type { AgentType } from './types.ts';

let cachedDetectionResult: AgentResult | null = null;

/**
 * Map from @vercel/detect-agent names to skills-cli AgentType identifiers.
 * Only includes agents that exist in both systems.
 */
const agentTypeByDetectedName: Record<string, AgentType> = {
  cursor: 'cursor',
  'cursor-cli': 'cursor',
  claude: 'claude-code',
  cowork: 'claude-code',
  devin: 'universal', // Devin not in skills-cli agent list, use universal
  replit: 'replit',
  gemini: 'gemini-cli',
  codex: 'codex',
  antigravity: 'antigravity',
  'augment-cli': 'augment',
  opencode: 'opencode',
  'github-copilot': 'github-copilot',
};

/**
 * Detect if the CLI is being run inside an AI agent environment.
 * Results are cached after the first call. Also updates telemetry with the agent name.
 */
export async function detectAgent(): Promise<AgentResult> {
  if (cachedDetectionResult) return cachedDetectionResult;
  cachedDetectionResult = await determineAgent();
  if (cachedDetectionResult.isAgent) {
    setDetectedAgent(cachedDetectionResult.agent.name);
  }
  return cachedDetectionResult;
}

/**
 * Returns true if the CLI is running inside a detected AI agent.
 * When true, the CLI should skip interactive prompts and use sensible defaults.
 */
export async function isRunningInAgent(): Promise<boolean> {
  const detectionResult = await detectAgent();
  return detectionResult.isAgent;
}

/**
 * Returns the name of the detected agent, or null if not running in an agent.
 */
export async function getAgentName(): Promise<string | null> {
  const detectionResult = await detectAgent();
  return detectionResult.isAgent ? detectionResult.agent.name : null;
}

/**
 * Maps a detected agent name to the corresponding skills-cli AgentType.
 * Returns null if the agent can't be mapped to a specific skills-cli agent.
 */
export function getAgentType(detectedAgentName: string): AgentType | null {
  return agentTypeByDetectedName[detectedAgentName] ?? null;
}
