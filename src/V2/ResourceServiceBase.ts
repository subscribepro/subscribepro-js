import Client, { JSONObject, JSONValue } from '../Client';
import SubscribePro from '../SubscribePro';

interface ResourceService<RecordType, CollectionType> {
  resourceName(): string;
  collectionName(): string;
  collectionPath():string;
  singularPath():string;
  resourcePath({id}:{id:string|number}):string;

  processJSONToRecord(json: JSONObject | null): RecordType | null;
  processJSONToCollection(json: JSONObject | null): CollectionType | null;
};

export abstract class ResourceServiceBase<RecordType, CollectionType> implements ResourceService<RecordType, CollectionType> {
  abstract resourceName(): string;
  abstract collectionName(): string;
  abstract collectionPath(): string;
  abstract singularPath(): string;
  abstract resourcePath({id}:{id:string|number}): string;

  processJSONToRecord(json: JSONObject | null): RecordType | null {
    return json ? json as RecordType : null;
  }

  processJSONToCollection(json: JSONObject | null): CollectionType | null {
    if (json) {
      return json[this.collectionName()] as CollectionType;
    } else {
      return null;
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResourceServiceBaseConstructor<TResult> = new (...args: any[]) => TResult;

export function ResourceCRUable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType, CollectionType=RecordType[],
  CreateType=Partial<RecordType>, UpdateType=CreateType
>(Base: T) {
  return class extends Base {
    async getOne({ client, id }: { client?: Client, id: string|number }): Promise<RecordType | null> {
      client ||= SubscribePro.client;

      const response = await client.request({ path: this.resourcePath({id}), method: "GET" });
      return this.processJSONToRecord(response);
    }

    async getAll({ client }: { client?: Client }): Promise<CollectionType | null> {
      client ||= SubscribePro.client;

      const response = await client.request({ path: this.collectionPath(), method: "GET"});
      return this.processJSONToCollection(response);
    }

    async createOne({ client, data }: { client?: Client, data: CreateType }): Promise<RecordType | null> {
      client ||= SubscribePro.client;

      const response = await client.request({
        path: this.singularPath(),
        method: "POST",
        body: JSON.stringify({[this.resourceName()]: data}),
      });
      return this.processJSONToRecord(response);
    }

    async updateOne({ client, id, data }: { client?: Client, id: string|number, data: UpdateType }): Promise<RecordType | null> {
      client ||= SubscribePro.client;

      const response = await client.request({
        path: this.resourcePath({id}),
        method: "POST",
        body: JSON.stringify({[this.resourceName()]: data}),
      });
      return this.processJSONToRecord(response);
    }

    
  };
};

export function ResourceBulkCreateable<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends ResourceServiceBaseConstructor<ResourceService<any, any>>,
  BulkCreateType
>(Base: T) {
  return class extends Base {
    async createAll({ client, data }: { client?: Client, data: BulkCreateType }): Promise<null> {
      client ||= SubscribePro.client;
  
      await client.request({
        path: this.collectionPath(),
        method: "POST",
        body: JSON.stringify({[this.collectionName()]: data}),
      });
      return null;
    }
  }
};

export type JSONPatchData = {
  op: "add" | "remove" | "replace" | "move" | "copy" | "test";
  ids?: string[];
  path: string;
  value?: JSONValue;
};

export function ResourcePatchable<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, any>>,
  RecordType
>(Base: T) {
  return class extends Base {
    async patchOne({ client, id, data }: { client?: Client, id: string|number, data: JSONPatchData }): Promise<RecordType | null> {
      client ||= SubscribePro.client;

      const response = await client.request({
        path: this.resourcePath({id}),
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return this.processJSONToRecord(response);
    }

    async patchAll({ client, data }: { client?: Client, data: JSONPatchData[] }): Promise<null> {
      client ||= SubscribePro.client;

      await client.request({
        path: this.collectionPath(),
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return null;
    }
  }
};

export default ResourceServiceBase;
