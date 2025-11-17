export interface PublisherCacheRequest extends Request {
  params: {
    id?: string;
  };
  query: {
    includeWebsites?: string;
  };
}
