#!/usr/bin/env node

import { homedir } from 'os';
import { agents } from '../src/agents.ts';

let hasErrors = false;

function error(message: string): void {
  console.error(message);
  hasErrors = true;
}

/**
 * Adds a value to a map of string arrays.
 */
function addToMap(map: Map<string, string[]>, key: string, value: string): void {
  const values = map.get(key);

  if (values) {
    values.push(value);
  } else {
    map.set(key, [value]);
  }
}

/**
 * Reports duplicate entries in a map.
 */
function reportDuplicates(
  map: Map<string, string[]>,
  label: string
): void {
  if (!label || typeof label !== 'string' || !label.trim()) return;
  for (const [value, keys] of map.entries()) {
    if (keys.length > 1) {
      error(`Duplicate ${label} "${value}" found in agents: ${keys.join(', ')}`);
    }
  }
}

/**
 * Checks for duplicate `displayName` values among the agents.
 */
function checkDuplicateDisplayNames(): void {
  const displayNames = new Map<string, string[]>();

  for (const [key, config] of Object.entries(agents)) {
    addToMap(displayNames, config.displayName.toLowerCase(), key);
  }

  reportDuplicates(displayNames, 'displayName');
}

/**
 * Checks for duplicate `skillsDir` and `globalSkillsDir` values among agents.
 */
function checkDuplicateSkillsDirs(): void {
  const skillsDirs = new Map<string, string[]>();
  const globalSkillsDirs = new Map<string, string[]>();

  for (const [key, config] of Object.entries(agents)) {
    addToMap(skillsDirs, config.skillsDir, key);

    if (config.globalSkillsDir) {
      const normalizedGlobalPath = config.globalSkillsDir.replace(
        homedir(),
        '~'
      );

      addToMap(globalSkillsDirs, normalizedGlobalPath, key);
    }
  }

  reportDuplicates(skillsDirs, 'skillsDir');
  reportDuplicates(globalSkillsDirs, 'globalSkillsDir');
}

function main(): void {
  console.log('Validating agents...\n');

  checkDuplicateDisplayNames();

  // It's fine to have duplicate skills dirs.
  // Uncomment the following line if duplicate skills directories
  // should be treated as validation errors.
  // checkDuplicateSkillsDirs();

  if (hasErrors) {
    console.log('\nValidation failed.');
    process.exit(1);
  }

  console.log('All agents valid.');
}

main();
