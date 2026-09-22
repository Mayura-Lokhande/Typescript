import { sanitizeName } from './installer.ts';

export function createAgentName(name: string): string {
  const sanitizedName = sanitizeName(name);

  if (sanitizedName === undefined) {
    return 'default-agent';
  }

  return sanitizedName;
}

export function createAgentConfig(name: string, enabled: boolean) {
  const agentName = createAgentName(name);

  return {
    name: agentName,
    enabled,
    source: 'installer'
  };
}

export function getAgentLabel(name: string): string {
  const agentConfig = createAgentConfig(name, true);

  return `Agent: ${agentConfig.name}`;
}