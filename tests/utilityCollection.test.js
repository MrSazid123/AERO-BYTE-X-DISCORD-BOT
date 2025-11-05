// utilityCollection.test.js
const fs = require('fs');
const path = require('path');
const os = require('os');

const { UtilityCollection } = require('../classes/utilityCollection');

describe('UtilityCollection', () => {
it('generatePassword: returns requested length', async () => {
  const u = new UtilityCollection();
  const out = await u.generatePassword(8);
  expect(typeof out).toBe('string');
  expect(out).toHaveLength(8);
});


  it('getRandomInteger: returns 0 <= n < max', async () => {
    const u = new UtilityCollection();
    const max = 17;
    for (let i = 0; i < 100; i++) {
      const n = await u.getRandomInteger(max);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(max);
    }
  });

    it('getRandomInteger: returns a number with a high max', async () => {
    const u = new UtilityCollection();
    const max = Number.MAX_VALUE;
    const n = await u.getRandomInteger(max);
    expect(n).toBeGreaterThanOrEqual(0);
    expect(n).toBeLessThan(max);
  });

  it('getCanvasFontSize: decreases until text fits', async () => {
    const u = new UtilityCollection();

    const canvas = {
      width: 200,
      getContext: () => {
        let _font = '16px sans-serif';
        return {
          get font() { return _font; },
          set font(v) { _font = v; },
          measureText: (txt) => {
            const m = /(\d+)\s*px/.exec(_font);
            const px = m ? parseInt(m[1], 10) : 16;
            return { width: 0.6 * px * String(txt).length };
          }
        };
      }
    };

    const text = 'Some long text to fit';
    const baseFontSize = 48;
    const canvasOffset = 20;

    await u.getCanvasFontSize(canvas, text, 'Arial', baseFontSize, canvasOffset);

    expect(u.canvasContext).toBeDefined();
    const fontAfter = u.canvasContext.font;
    const width = u.canvasContext.measureText(text).width;
    expect(width).toBeLessThanOrEqual(canvas.width - canvasOffset);

    const m = /(\d+)\s*px/.exec(fontAfter);
    expect(m).not.toBeNull();
    const finalPx = parseInt(m[1], 10);
    expect(finalPx).toBeLessThanOrEqual(baseFontSize);
  });

  it('roundUp: rounds up with precision', async () => {
    const u = new UtilityCollection();
    await expect(u.roundUp(1.234, 2)).resolves.toBe(1.24);
    await expect(u.roundUp(1.230, 2)).resolves.toBe(1.23);
    await expect(u.roundUp(12.01, 0)).resolves.toBe(13);
    await expect(u.roundUp(-1.231, 2)).resolves.toBe(-1.23);
    await expect(u.roundUp(0, 3)).resolves.toBe(0);
  });

  /**it('loadFiles: returns .js files and clears require cache', async () => {
    const u = new UtilityCollection();

    // Create temp tree under CWD
    const base = path.join(process.cwd(), `tmp_uc_${Date.now()}`);
    const aDir = path.join(base, 'a');
    const bDir = path.join(base, 'b');
    fs.mkdirSync(aDir, { recursive: true });
    fs.mkdirSync(bDir, { recursive: true });

    const fileA = path.join(aDir, 'x.js');
    const fileB = path.join(bDir, 'y.js');
    const fileC = path.join(bDir, 'note.txt');

    fs.writeFileSync(fileA, 'module.exports = { v: 1 };', 'utf8');
    fs.writeFileSync(fileB, 'module.exports = { v: 2 };', 'utf8');
    fs.writeFileSync(fileC, 'ignore me', 'utf8');

    // Pre-require to populate cache
    const rA = require(fileA);
    const rB = require(fileB);
    expect(rA.v).toBe(1);
    expect(rB.v).toBe(2);

    const found = await u.loadFiles(path.relative(process.cwd(), base));
    // Should only include .js files, with forward slashes
    expect(Array.isArray(found)).toBe(true);
    expect(found.length).toBe(2);
    expect(found.some(p => p.endsWith('/a/x.js'))).toBe(true);
    expect(found.some(p => p.endsWith('/b/y.js'))).toBe(true);

    // Cache cleared
    const resA = require.resolve(fileA);
    const resB = require.resolve(fileB);
    expect(require.cache[resA]).toBeUndefined();
    expect(require.cache[resB]).toBeUndefined();

    // Cleanup
    fs.rmSync(base, { recursive: true, force: true });
  });**/
});
