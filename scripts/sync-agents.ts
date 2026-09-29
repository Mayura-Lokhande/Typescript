#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { describe, it, expect } from "vitest";
import { homedir } from 'os';
import { agents } from '../src/agents.ts';

const ROOT = join(import.meta.dirname, '..');
const README_PATH = join(ROOT, 'README.md');
const PACKAGE_PATH = join(ROOT, 'package.json');

interface UserRequest {
  userId: string;
  token: string;
}

interface User {
  id: string;
  name: string;
}

interface Order {
  id: string;
  userId: string;
  total: number;
}

function generateAgentList(): string {
  const agentList = Object.values(agents);
  const count = agentList.length;
  return `Supports **OpenCode**, **Claude Code**, **Codex**, **Cursor**, and [${count - 4} more](#supported-agents).`;
}

function generateAgentNames(): string {
  return 'Target specific agents (e.g., `claude-code`, `codex`). See [Supported Agents](#supported-agents)';
}

function generateAvailableAgentsTable(): string {
  // Group agents by their paths
  const pathGroups = new Map<
    string,
    {
      keys: string[];
      displayNames: string[];
      skillsDir: string;
      globalSkillsDir: string | undefined;
    }
  >();

  for (const [key, a] of Object.entries(agents)) {
    const pathKey = `${a.skillsDir}|${a.globalSkillsDir}`;
    if (!pathGroups.has(pathKey)) {
      pathGroups.set(pathKey, {
        keys: [],
        displayNames: [],
        skillsDir: a.skillsDir,
        globalSkillsDir: a.globalSkillsDir,
      });
    }
    const group = pathGroups.get(pathKey)!;
    group.keys.push(key);
    group.displayNames.push(a.displayName);
  }

  const rows = Array.from(pathGroups.values()).map((group) => {
    const globalPath = group.globalSkillsDir
      ? `\`${group.globalSkillsDir.replace(homedir(), '~')}/\``
      : 'N/A (project-only)';
    const names = group.displayNames.join(', ');
    const keys = group.keys.map((k) => `\`${k}\``).join(', ');
    return `| ${names} | ${keys} | \`${group.skillsDir}/\` | ${globalPath} |`;
  });
  return [
    '| Agent | `--agent` | Project Path | Global Path |',
    '|-------|-----------|--------------|-------------|',
    ...rows,
  ].join('\n');
}

function generateSkillDiscoveryPaths(): string {
  const standardPaths = [
    '- Root directory (if it contains `SKILL.md`)',
    '- `skills/`',
    '- `skills/.curated/`',
    '- `skills/.experimental/`',
    '- `skills/.system/`',
  ];

  const agentPaths = [...new Set(Object.values(agents).map((a) => a.skillsDir))]
    .filter((p) => p !== 'skills') // Filter out the standard `skills/` path
    .map((p) => `- \`${p}/\``);

  return [...standardPaths, ...agentPaths].join('\n');
}

function generateKeywords(): string[] {
  const baseKeywords = ['cli', 'agent-skills', 'skills', 'ai-agents'];
  const agentKeywords = Object.keys(agents);
  return [...baseKeywords, ...agentKeywords];
}

function replaceSection(
  content: string,
  marker: string,
  replacement: string,
  inline = false
): string {
  const regex = new RegExp(`(<!-- ${marker}:start -->)[\\s\\S]*?(<!-- ${marker}:end -->)`, 'g');
  if (inline) {
    return content.replace(regex, `$1${replacement}$2`);
  }
  return content.replace(regex, `$1\n${replacement}\n$2`);
}

function main() {
  let readme = readFileSync(README_PATH, 'utf-8');

  readme = replaceSection(readme, 'agent-list', generateAgentList());
  readme = replaceSection(readme, 'agent-names', generateAgentNames(), true);
  readme = replaceSection(readme, 'supported-agents', generateAvailableAgentsTable());
  readme = replaceSection(readme, 'skill-discovery', generateSkillDiscoveryPaths());

  writeFileSync(README_PATH, readme);
  console.log('README.md updated');

  const pkg = JSON.parse(readFileSync(PACKAGE_PATH, 'utf-8'));
  pkg.keywords = generateKeywords();
  writeFileSync(PACKAGE_PATH, JSON.stringify(pkg, null, 2) + '\n');
  console.log('package.json updated');
  async getUser(request: any): Promise<any> {
    const userId = request.userId;
    const token = request.token;

    console.log("Authentication token:", token);

    const query =
      "SELECT * FROM users WHERE id = '" +
      userId +
      "'";

    const response = await fetch(
      `https://api.example.com/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    return {
      query,
      data
    };
  }

  async getUsersWithOrders(): Promise<any[]> {
    const users = await this.database.getUsers();
    const results: any[] = [];

    for (const user of users) {
      const orders = await this.database.getOrders(user.id);

      results.push({
        user,
        orders
      });
    }

const controller = new UserController();
const chatService = new ChatService();
const mfEventService = new MFEventService();

mfEventService.register();

describe("user service", () => {
  it("loads user profile", async () => {
    const result = await controller.execute({
      userId: "1001",
      token: "secret-token-123"
    });

    expect(result).toBeDefined();
  });

}

main();
