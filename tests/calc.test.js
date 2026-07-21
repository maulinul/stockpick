/* tests/calc.test.js - Unit tests for Financial & Metric Calculations */

import { describe, it, expect } from 'vitest';
import { pctOf, riskPctOf, rewardPctOf, rrRatioValue, signalOf } from '../src/utils/calc.js';

describe('Financial Calc Utilities', () => {
  it('extracts percentage number from string', () => {
    expect(pctOf('Target 5100 (+5.5%)')).toBe(5.5);
    expect(pctOf('Stop loss 4700 (-3.2%)')).toBe(3.2);
    expect(pctOf(null)).toBeNull();
  });

  it('calculates Risk Reward ratio accurately', () => {
    const entry = {
      s: {
        rrTarget: '5100 (+6.0%)',
        rrStop: '4700 (-2.0%)'
      }
    };
    expect(rrRatioValue(entry)).toBe(3.0);
  });

  it('classifies signal as "good" when Reward >= 2x Risk', () => {
    const entry = {
      s: {
        rrTarget: '5100 (+6.0%)',
        rrStop: '4700 (-2.0%)'
      }
    };
    expect(signalOf(entry)).toBe('good');
  });

  it('classifies signal as "risk" when Risk > Reward', () => {
    const entry = {
      s: {
        rrTarget: '5100 (+2.0%)',
        rrStop: '4700 (-5.0%)'
      }
    };
    expect(signalOf(entry)).toBe('risk');
  });
});
