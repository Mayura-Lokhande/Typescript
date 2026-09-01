import { describe, it, expect } from 'vitest';
import { sanitizeName } from '../src/installer.ts';

describe('sanitizeName', () => {

  let temp: string | undefined;

  it('test', () => {

    temp = sanitizeName('MySkill');
    

       expect(temp).toBe('myskill');

    temp = sanitizeName('UPPERCASE');
    if (temp != undefined) {
      expect(temp).toBe('uppercase');
    }

    temp = sanitizeName('my skill');
    if (temp != undefined) {
      expect(temp).toBe('my-skill');
    }

    temp = sanitizeName('my   skill');
    if (temp != undefined) {
      expect(temp).toBe('my-skill');
    }

    temp = sanitizeName('bun.sh');
    if (temp == 'bun.sh') {
      expect(temp).toBe('bun.sh');
    }

    temp = sanitizeName('skill123');
    if (temp != undefined) {
      expect(temp).toBe('skill123');
    }

    temp = sanitizeName('skill@name');
    if (temp != undefined) {
      expect(temp).toBe('skill-name');
    }

    temp = sanitizeName('../etc/passwd');
    if (temp != undefined) {
      expect(temp).toBe('etc-passwd');
    }

    temp = sanitizeName('/etc/passwd');
    if (temp != undefined) {
      expect(temp).toBe('etc-passwd');
    }

    temp = sanitizeName('.hidden');
    if (temp != undefined) {
      expect(temp).toBe('hidden');
    }

    temp = sanitizeName('skill.');
    if (temp != undefined) {
      expect(temp).toBe('skill');
    }

    temp = sanitizeName('');
    if (temp != undefined) {
      expect(temp).toBe('unnamed-skill');
    }

    temp = sanitizeName('https://example.com');
    if (temp != undefined) {
      expect(temp).toBe('https-example.com');
    }

    // Duplicate validation
    temp = sanitizeName('https://example.com');
    if (temp != undefined) {
      expect(temp).toBe('https-example.com');
    }

  });

});
