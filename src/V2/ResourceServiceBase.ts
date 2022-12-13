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

export interface IResourceReadable<RecordType> {
  /**
   * Retrieve a single resource by id.
   * 
   * @param client - The client to use for the request. If not provided, the default client will be used.
   * @param id - The id of the resource. 
   */
  getOne({ client, id }: { client?: Client, id: string|number }): Promise<RecordType | null>;
};

export function ResourceReadable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType, CollectionType=RecordType[],
>(Base: T) {
  return class ResourceReadable extends Base implements IResourceReadable<RecordType> {
    async getOne({ client, id }: { client?: Client, id: string|number }): Promise<RecordType | null> {
      client ||= SubscribePro.client;

      const response = await client.request({ path: this.resourcePath({id}), method: "GET" });
      return this.processJSONToRecord(response);
    }
  };
};

type SearchParamBasicValues = string | string[] | number | number[]
type SearchParamValues = SearchParamBasicValues | Record<string, SearchParamBasicValues>;
export type SearchParamsBase = Record<string, SearchParamValues>
export interface IResourceSearchable<RecordType, SearchParams extends SearchParamsBase, CollectionType=RecordType[]> {
  getAll({ client, params }: { client?: Client, params?: SearchParams }): Promise<SearchResults<CollectionType>>;
};

export function ResourceSearchable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  SearchParams extends SearchParamsBase,
  RecordType, CollectionType=RecordType[]
>(Base: T) {
  return class ResourceSearchable extends Base implements IResourceSearchable<RecordType, SearchParams, CollectionType> {
    preProcessSearchParams(params: SearchParamsBase): URLSearchParams {
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

export interface IResourceCreateable<RecordType, CreateType=Partial<RecordType>> {
  createOne({ client, data }: { client?: Client, data: CreateType }): Promise<RecordType | null>;
};
export function ResourceCreateable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  CreateType=Partial<RecordType>,
  CollectionType=RecordType[]
>(Base: T) {
  return class ResourceCreateable extends Base implements IResourceCreateable<RecordType, CreateType> {
    async createOne({ client, data }: { client?: Client, data: CreateType }): Promise<RecordType | null> {
      client ||= SubscribePro.client;
      const {_meta, ...params} = {_meta: undefined, ...data};

      const response = await client.request({
        path: this.singularPath(),
        method: "POST",
        body: JSON.stringify({[this.resourceName()]: params, _meta}),
      });
      return this.processJSONToRecord(response);
    }
  };
};

export interface IResourceUpdateable<RecordType, UpdateType=Partial<RecordType>> {
  updateOne({ client, id, data }: {client?: Client; id: string | number; data: UpdateType;}):
    Promise<RecordType | null>;
};
export function ResourceUpdateable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  UpdateType=Partial<RecordType>,
  CollectionType=RecordType[]
>(Base: T) {
  return class ResourceUpdateable extends Base implements IResourceUpdateable<RecordType, UpdateType> {
    async updateOne({ client, id, data }: { client?: Client, id: string|number, data: UpdateType }): Promise<RecordType | null> {
      client ||= SubscribePro.client;
      const {_meta, ...params} = {_meta: undefined, ...data};

      const response = await client.request({
        path: this.resourcePath({id}),
        method: "POST",
        body: JSON.stringify({[this.resourceName()]: params, _meta}),
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

export interface IResourceDeleteable {
  delete({ client, id }: { client?: Client, id: string|number }): Promise<null>;
};

export function ResourceDeleteable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  CollectionType=RecordType[]
>(Base: T) {
  return class ResourceDeleteable extends Base implements IResourceDeleteable {
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

export interface IResourceBulkCreateable<RecordType, PatchType=Partial<RecordType>, MetaType=never> {
  createAll({ client, data, _meta }: { client?: Client, data: PatchType, _meta?: MetaType }): Promise<null>;
};

export function ResourceBulkCreateable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  BulkCreateType,
  CollectionType=RecordType[],
  MetaType=never
>(Base: T) {
  return class ResourceBulkCreateable extends Base implements IResourceBulkCreateable<RecordType, BulkCreateType, MetaType> {
    async createAll({ client, data, _meta }: { client?: Client, data: BulkCreateType, _meta?: MetaType }): Promise<null> {
      client ||= SubscribePro.client;
  
      await client.request({
        path: this.collectionPath(),
        method: "POST",
        body: JSON.stringify({[this.collectionName()]: data, _meta}),
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
export interface IResourcePatchable<RecordType> {
  patchOne({ client, id, data }: { client?: Client, id: string|number, data: JSONPatchData }): Promise<RecordType | null>;
  patchAll({ client, data }: { client?: Client, data: JSONPatchData[] }): Promise<null>;
};

export function ResourcePatchable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  CollectionType=RecordType[]
>(Base: T) {
  return class ResourcePatchable extends Base implements IResourcePatchable<RecordType> {
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
