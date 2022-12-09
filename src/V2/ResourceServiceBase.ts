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

type PaginationFragment = {
  since_id?: string;
  count?: number;
};

type SearchResults<CollectionType> = {
  results: CollectionType | null;
  pagination?: PaginationFragment;
};

export abstract class ResourceServiceBase<RecordType, CollectionType> implements ResourceService<RecordType, CollectionType> {
  abstract resourceName(): string;
  abstract collectionName(): string;
  abstract collectionPath(): string;
  abstract singularPath(): string;
  abstract resourcePath({id}:{id:string|number}): string;

  processJSONToRecord(json: JSONObject | null): RecordType | null {
    return json ? json[this.resourceName()] as RecordType : null;
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

export function ResourceReadable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType, CollectionType=RecordType[],
>(Base: T) {
  return class extends Base {
    async getOne({ client, id }: { client?: Client, id: string|number }): Promise<RecordType | null> {
      client ||= SubscribePro.client;

      const response = await client.request({ path: this.resourcePath({id}), method: "GET" });
      return this.processJSONToRecord(response);
    }
  };
};

export function ResourceSearchable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  SearchParams extends Record<string, string | string[] | number | number[]>,
  RecordType, CollectionType=RecordType[]
>(Base: T) {
  return class extends Base {
    preProcessSearchParams(params: SearchParams): URLSearchParams {
      const searchParams = new URLSearchParams();
      for (const key of Object.keys(params)) {
        const value = params[key];
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(`${key}[]`, String(v)));
        } else {
          searchParams.append(key, String(params[key]));
        }
      }
      return searchParams;
    }

    async getAll({ client, params }: { client?: Client, params?: SearchParams }): Promise<SearchResults<CollectionType>> {
      client ||= SubscribePro.client;

      let path = this.collectionPath();
      if (params) {
        path = `${path}?${this.preProcessSearchParams(params).toString()}`;
      }
      const response = await client.request({ path, method: "GET"});
      return {
        results: this.processJSONToCollection(response),
        pagination: response?.pagination as PaginationFragment | undefined
      };
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
    async createOne({ client, data }: { client?: Client, data: CreateType }): Promise<RecordType | null> {
      client ||= SubscribePro.client;

      const response = await client.request({
        path: this.singularPath(),
        method: "POST",
        body: JSON.stringify({[this.resourceName()]: data}),
      });
      return this.processJSONToRecord(response);
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

export function ResourceCRUable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  SearchParams extends Record<string, string | string[] | number | number[]>,
  RecordType, CollectionType=RecordType[],
  CreateType=Partial<RecordType>, UpdateType=CreateType
>(Base: T) {
  const BaseR = ResourceReadable<typeof Base, RecordType, CollectionType>(
    Base
  );
  const BaseRS = ResourceSearchable<typeof BaseR, SearchParams, RecordType, CollectionType>(
    BaseR
  );
  const BaseRUS = ResourceUpdateable<typeof BaseRS, RecordType, UpdateType, CollectionType>(
    BaseRS
  );
  return ResourceCreateable<typeof BaseRUS, RecordType, CreateType, CollectionType>(
    BaseRUS
  );
};


export function ResourceDeleteable<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  CollectionType=RecordType[]
>(Base: T) {
  return class extends Base {
    async delete({ client, id }: { client?: Client, id: string|number }): Promise<null> {
      client ||= SubscribePro.client;
  
      await client.request({
        path: this.resourcePath({id}),
        method: "DELETE",
      });
      return null;
    }
  }
};

export function ResourceBulkCreateable<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  BulkCreateType,
  CollectionType=RecordType[]
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
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  CollectionType=RecordType[]
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
