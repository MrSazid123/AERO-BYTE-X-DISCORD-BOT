// passwordGenerator.test.js
const { Password } = require('../classes/passwordGenerator');

describe('Password.generatePassword', () => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>?/|~`";
  const inSet = s => [...s].every(ch => charset.includes(ch));

  it('returns 16 chars by default', async () => {
    const pw = new Password();
    const out = await pw.generatePassword();
    expect(typeof out).toBe('string');
    expect(out).toHaveLength(16);
    expect(inSet(out)).toBe(true);
  });

  it('returns requested length', async () => {
    const pw = new Password();
    for (const len of [1, 8, 32, 64, 128]) {
      const out = await pw.generatePassword(len);
      expect(out).toHaveLength(len);
      expect(inSet(out)).toBe(true);
    }
  });

  it('returns empty string for invalid length', async () => {
    const pw = new Password();
    expect(await pw.generatePassword(0)).toBe('');
    expect(await pw.generatePassword(-5)).toBe('');
  });

  it('returns empty string for non-numeric length', async () => {
    const pw = new Password();
    expect(await pw.generatePassword(null)).toBe('');
    expect(await pw.generatePassword(NaN)).toBe('');
  });

  it('floors non-integer length', async () => {
    const pw = new Password();
    const out = await pw.generatePassword(12.7);
    expect(out).toHaveLength(12);
    expect(inSet(out)).toBe(true);
  });

  it('2 subsequent calls dont produce the same result', async () => {
    const pw = new Password();
    const a = await pw.generatePassword(24);
    const b = await pw.generatePassword(24);
    expect(a).not.toEqual(b);
  });

  it('handles large length', async () => {
    const pw = new Password();
    const out = await pw.generatePassword(100.000);
    expect(out).toHaveLength(100.000);
    expect(inSet(out)).toBe(true);
  });
});
