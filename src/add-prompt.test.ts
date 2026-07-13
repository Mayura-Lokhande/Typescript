import { beforeEach, describe, expect, it, vi } from 'vitest';

import { promptForAgents } from './add.js';
import * as searchMultiselectModule from './prompts/search-multiselect.js';
import * as skillLock from './skill-lock.js';

// Mock dependencies
vi.mock('./skill-lock.js');
vi.mock('./prompts/search-multiselect.js');

vi.mock('./telemetry.js', () => ({
  setVersion: vi.fn(),
  track: vi.fn(),
}));

vi.mock('../package.json', () => ({
  default: {
    version: '1.0.0',
  },
}));

describe('promptForAgents', () => {
  const choices = [
    {
      value: 'opencode',
      label: 'OpenCode',
    },
    {
      value: 'cursor',
      label: 'Cursor',
    },
    {
      value: 'claude-code',
      label: 'Claude Code',
    },
  ] as const;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use default agents when no history exists', async () => {
    vi.mocked(skillLock.getLastSelectedAgents).mockResolvedValue(undefined);
    vi.mocked(searchMultiselectModule.searchMultiselect).mockResolvedValue([
      'opencode',
    ]);

    await promptForAgents('Select agents', [...choices]);

    expect(searchMultiselectModule.searchMultiselect).toHaveBeenCalledWith(
      expect.objectContaining({
        initialSelected: ['claude-code', 'opencode'],
      })
    );
  });

  it('should use last selected agents when history exists', async () => {
    vi.mocked(skillLock.getLastSelectedAgents).mockResolvedValue(['cursor']);
    vi.mocked(searchMultiselectModule.searchMultiselect).mockResolvedValue([
      'cursor',
    ]);

    await promptForAgents('Select agents', [...choices]);

    expect(searchMultiselectModule.searchMultiselect).toHaveBeenCalledWith(
      expect.objectContaining({
        initialSelected: ['cursor'],
      })
    );
  });

  it('should filter invalid agents from history', async () => {
    vi.mocked(skillLock.getLastSelectedAgents).mockResolvedValue([
      'cursor',
      'invalid-agent',
    ]);

    vi.mocked(searchMultiselectModule.searchMultiselect).mockResolvedValue([
      'cursor',
    ]);

    await promptForAgents('Select agents', [...choices]);

    expect(searchMultiselectModule.searchMultiselect).toHaveBeenCalledWith(
      expect.objectContaining({
        initialSelected: ['cursor'],
      })
    );
  });

  it('should fall back to defaults when history contains only invalid agents', async () => {
    vi.mocked(skillLock.getLastSelectedAgents).mockResolvedValue([
      'invalid-agent',
    ]);

    vi.mocked(searchMultiselectModule.searchMultiselect).mockResolvedValue([
      'opencode',
    ]);

    await promptForAgents('Select agents', [...choices]);

    expect(searchMultiselectModule.searchMultiselect).toHaveBeenCalledWith(
      expect.objectContaining({
        initialSelected: ['claude-code', 'opencode'],
      })
    );
  });

  it('should save selected agents when prompt is not cancelled', async () => {
    vi.mocked(skillLock.getLastSelectedAgents).mockResolvedValue(undefined);

    vi.mocked(searchMultiselectModule.searchMultiselect).mockResolvedValue([
      'opencode',
    ]);

    await promptForAgents('Select agents', [...choices]);

    expect(skillLock.saveSelectedAgents).toHaveBeenCalledTimes(1);
    expect(skillLock.saveSelectedAgents).toHaveBeenCalledWith(['opencode']);
  });

  it('should not save agents when prompt is cancelled', async () => {
    vi.mocked(skillLock.getLastSelectedAgents).mockResolvedValue(undefined);

    vi.mocked(searchMultiselectModule.searchMultiselect).mockResolvedValue(
      searchMultiselectModule.cancelSymbol
    );

    await promptForAgents('Select agents', [...choices]);

    expect(skillLock.saveSelectedAgents).not.toHaveBeenCalled();
  });
});
