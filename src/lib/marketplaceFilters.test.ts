import { describe, it, expect } from 'vitest';
import { mergeAndDeduplicateServices, filterServices } from '@/lib/marketplaceFilters';

describe('mergeAndDeduplicateServices', () => {
  const onChain = [{ name: 'Weather Oracle' }, { name: 'Price Feed' }];
  const offChain = [{ name: 'weather oracle' }, { name: 'Translation API' }];

  it('returns only on-chain services when showOnChainOnly is true', () => {
    const result = mergeAndDeduplicateServices(onChain, offChain, true);
    expect(result).toEqual(onChain);
  });

  it('merges both lists and de-duplicates case-insensitively, on-chain first', () => {
    const result = mergeAndDeduplicateServices(onChain, offChain, false);
    expect(result.map((s) => s.name)).toEqual(['Weather Oracle', 'Price Feed', 'Translation API']);
  });

  it('handles empty lists', () => {
    expect(mergeAndDeduplicateServices([], [], false)).toEqual([]);
    expect(mergeAndDeduplicateServices([], [], true)).toEqual([]);
  });
});

describe('filterServices', () => {
  const services = [
    { name: 'Weather Oracle', description: 'Real-time forecasts', category: 'Data' },
    { name: 'Sentiment Bot', description: 'Analyzes text sentiment', category: 'NLP' },
    { name: 'Price Feed', description: 'Crypto price data', category: 'Data' },
  ];

  it('returns all services for empty query and "All" category', () => {
    expect(filterServices(services, '', 'All')).toHaveLength(3);
  });

  it('filters by name, case-insensitively', () => {
    const result = filterServices(services, 'weather', 'All');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Weather Oracle');
  });

  it('filters by description text', () => {
    const result = filterServices(services, 'sentiment', 'All');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Sentiment Bot');
  });

  it('filters by exact category', () => {
    const result = filterServices(services, '', 'Data');
    expect(result).toHaveLength(2);
  });

  it('combines search and category filters', () => {
    const result = filterServices(services, 'price', 'Data');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Price Feed');
  });

  it('returns empty array when nothing matches', () => {
    expect(filterServices(services, 'nonexistent', 'All')).toHaveLength(0);
  });
});
