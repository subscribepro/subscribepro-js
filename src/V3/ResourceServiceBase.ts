import Client, { JSONObject } from "../Client";
import SubscribePro from "../SubscribePro";

interface ResourceService<RecordType, CollectionType=RecordType[]> {
  collectionPath():string;
  resourcePath({id}:{id:string|number}):string;

  processJSONToRecord(json: JSONObject | null): RecordType | null;
  processJSONToCollection(json: JSONObject | null): CollectionType | null;
};

export abstract class ResourceServiceBase<RecordType, CollectionType=RecordType[]> {
  abstract collectionPath():string;
  abstract resourcePath({id}:{id:string|number}):string;

  processJSONToRecord(json: JSONObject | null): RecordType | null {
    return json ? json as RecordType : null;
  }

  processJSONToCollection(json: JSONObject | null): CollectionType | null {
    return json ? json as CollectionType : null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResourceServiceBaseConstructor<TResult> = new (...args: any[]) => TResult;

export function ResourceReadable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  SearchParams=Record<string, string>,
  CollectionType=RecordType[]
>(Base: T) {
  return class extends Base {
    preProcessSearchParams(params: SearchParams): URLSearchParams {
      const searchParams = new URLSearchParams();
      for (const key in params) {
        searchParams.append(key, String(params[key])); // Array values are converted to comma-separated strings
      }
      return searchParams;
    }

    async findById({client, id}:{client?: Client, id:string|number}): Promise<RecordType | null> {
      client ||= SubscribePro.client;

      const response = await client.request({path: this.resourcePath({id}), method: "GET"})
      return this.processJSONToRecord(response);
    } 
  
    async findAll({client, params}:{client?: Client, params?: SearchParams}): Promise<CollectionType | null> {
      client ||= SubscribePro.client;

      let path = this.collectionPath();
      if (params) {
        path = `${path}?${this.preProcessSearchParams(params).toString()}`;
      }
      const response = await client.request({path, method: "GET"});
      return this.processJSONToCollection(response);
    }
  };
};

export function ResourceUpdateable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  UpdateType=Partial<RecordType>,
  CollectionType=RecordType[]
>(Base: T) {
  return class extends Base {
    async update({client, id, data}:{client?: Client, id:string|number, data: UpdateType}): Promise<RecordType | null> {
      client ||= SubscribePro.client;

      const response = await client.request({
        path: this.resourcePath({id}),
        method: "PATCH",
        headers: {'Content-Type': 'application/merge-patch+json'},
        body: JSON.stringify(data)
      });
      return this.processJSONToRecord(response);
    }
  };
};

export function ResourceCreateable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  CreateType=Partial<RecordType>,
  CollectionType=RecordType[]
>(Base: T) {
  return class extends Base {
    async create({client, data}:{client?: Client, data: CreateType}): Promise<RecordType | null> {
      client ||= SubscribePro.client;

      const response = await client.request({path: this.collectionPath(), method: "POST", body: JSON.stringify(data)});
      return this.processJSONToRecord(response);
    }
  };
};

export function ResourceDeleteable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  CollectionType=RecordType[]
>(Base: T) {
  return class extends Base {
    async delete({client, id}:{client?: Client, id:string|number}): Promise<null> {
      client ||= SubscribePro.client;

      await client.request({path: this.resourcePath({id}), method: "DELETE"});
      return null;
    }
  };
};

export default ResourceServiceBase;
