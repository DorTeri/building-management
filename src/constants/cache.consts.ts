export const CACHE_KEYS = {
  publishers: () => `publishers`,
  publishersIncludeWebsites: () => `publishers:includeWebsites`,
  publisher: (id: number | string) => `publisher:${id}`,
  websites: () => `websites`,
  websitesByPublisher: (publisherId: number | string) =>
    `websites:publisher:${publisherId}`,
  website: (id: number | string) => `website:${id}`,
};
