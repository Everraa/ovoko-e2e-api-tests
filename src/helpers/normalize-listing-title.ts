/** Normalizes listing titles from search results before comparing with the product page. */
export function normalizeListingTitle(title: string): string {
  return title
    .trim()
    .replace(/\s*Opens in a new window or tab\s*$/, '')
    .replace(/(\.\.\.|…)\s*$/, '');
}

/** Product page titles should start with the (possibly truncated) search-result title. */
export function listingTitlePrefixPattern(title: string): RegExp {
  const prefix = normalizeListingTitle(title).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${prefix}`);
}
