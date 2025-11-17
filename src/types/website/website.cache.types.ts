export interface WebsiteCacheRequest extends Request {
  params: {
    id?: string;
    publisherId?: string;
  };
}
