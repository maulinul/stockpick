/* tests/parser.test.js - Unit tests for Parser 2.0 */

import { describe, it, expect } from 'vitest';
import { parseRaw } from '../src/services/parser.js';

describe('parseRaw Parser 2.0', () => {
  it('parses ticker and price from head block', () => {
    const raw = '$BBRI 4850\nKondisi terbaru: S 4700 R 5100';
    const result = parseRaw(raw);
    expect(result.ticker).toBe('BBRI');
    expect(result.harga).toBe('4850');
  });

  it('detects support and resistance levels correctly', () => {
    const raw = '$GOTO 85\nKondisi terbaru: S 80-82 R 90-95';
    const result = parseRaw(raw);
    expect(result.kondisiS).toBe('80-82');
    expect(result.kondisiR).toBe('90-95');
  });

  it('extracts Risk Reward ratio, target, and stop loss', () => {
    const raw = '$TLKM 3800\nRisk reward: RR 1:2.5 Target 4100 (+7.8%) Stop loss 3650 (-3.9%)';
    const result = parseRaw(raw);
    expect(result.rrRatio).toBe('1:2.5');
    expect(result.rrTarget).toBe('4100 (+7.8%)');
    expect(result.rrStop).toBe('<3650 (-3.9%)');
  });

  it('detects fresh buy signal', () => {
    const raw = '$ASII 5200\nFresh buy: Best price 5150';
    const result = parseRaw(raw);
    expect(result.freshPrice).toBe('<5150');
  });

  it('handles empty input gracefully', () => {
    const result = parseRaw('');
    expect(result.ticker).toBe('');
    expect(result.confidence).toBe(0);
  });
});
