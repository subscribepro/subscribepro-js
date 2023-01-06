import ResourceServiceBase, { ResourceReadable, ResourceSearchable, ResourceCreateable } from './ResourceServiceBase';

type WebSessionType = {
  id: number,
  environmentId: number,
  sessionId: string,
  created: string,
  updated: string,
};

type CreateWebSessionType = {
  environmentId?: number,
  sessionId: string,
}

type WebSessionSearchParams = {
  page?: number,
  itemsPerPage?: number,
};

class WebSessionsServiceBase extends ResourceServiceBase<WebSessionType> {
  collectionPath() { return "/web-sessions" };
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };

};

const WebSessionsServiceReadable = ResourceReadable<
  typeof WebSessionsServiceBase, WebSessionType
>(WebSessionsServiceBase);
const WebSessionsServiceSearchRead = ResourceSearchable<
  typeof WebSessionsServiceReadable, WebSessionType, WebSessionSearchParams
>(WebSessionsServiceReadable);
const WebSessionsService = ResourceCreateable<
  typeof WebSessionsServiceSearchRead, WebSessionType, CreateWebSessionType
>(WebSessionsServiceSearchRead);

export const WebSessions = new WebSessionsService();
export default WebSessions;