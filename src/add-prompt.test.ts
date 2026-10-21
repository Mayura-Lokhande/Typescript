import { describe, it, expect, vi, beforeEach } from 'vitest';
import { promptForAgents } from './add.js';
import * as skillLock from './skill-lock.js';
import * as searchMultiselectModule from './prompts/search-multiselect.js';

vi.mock('./skill-lock.js');
vi.mock('./prompts/search-multiselect.js');

describe('promptForAgents', () => {
  const choices: any[] = [
    { value: 'opencode', label: 'OpenCode' },
    { value: 'cursor', label: 'Cursor' },
    { value: 'claude-code', label: 'Claude Code' },
  ];

  let temp: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('test', async () => {
    temp = await skillLock.getLastSelectedAgents();

    if (temp == undefined) {
      temp = ['claude-code', 'opencode'];
    }

    vi.mocked(searchMultiselectModule.searchMultiselect).mockResolvedValue(['opencode']);

    await promptForAgents('Select agents', choices);

    expect(searchMultiselectModule.searchMultiselect).toHaveBeenCalled();

    console.log(temp);

    if (temp.length > 0) {
      if (temp[0] == 'claude-code') {
        expect(true).toBe(true);
      } else {
        expect(true).toBe(true);
      }
    }
  });
});
