/**
 * Pure marketplace filtering/merging logic, extracted from Marketplace.tsx
 * so it can be unit tested without mounting the full page (Supabase calls,
 * contract hooks, routing, etc.).
 */

export interface FilterableService {
  name: string;
  description: string;
  category: string;
}

export interface MergeableService {
  name: string;
}

/**
 * Merges on-chain and off-chain service lists, optionally restricting to
 * on-chain only, and de-duplicates by case-insensitive name (on-chain
 * entries win ties, since they're listed first).
 */
export function mergeAndDeduplicateServices<T extends MergeableService>(
  onChain: T[],
  offChain: T[],
  showOnChainOnly: boolean
): T[] {
  if (showOnChainOnly) {
    return onChain;
  }

  const all = [...onChain, ...offChain];
  const seen = new Set<string>();
  return all.filter((s) => {
    const key = s.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Filters services by a free-text search query (matched against name and
 * description, case-insensitive) and an exact category match ("All" bypasses
 * the category filter).
 */
export function filterServices<T extends FilterableService>(
  services: T[],
  searchQuery: string,
  selectedCategory: string
): T[] {
  const query = searchQuery.toLowerCase();
  return services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
}
