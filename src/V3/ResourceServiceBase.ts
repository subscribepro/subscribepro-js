import Client, { JSONObject } from "../Client";
import SubscribePro from "../SubscribePro";

interface ResourceService<RecordType, CollectionType=RecordType[]> {
  collectionPath():string;
  resourcePath({id}:{id:string|number}):string;

  processJSONToRecord(json: JSONObject | null): RecordType | null;
  processJSONToCollection(json: JSONObject | null): CollectionType | null;
};

/**
 * Base class for all resource services.
 * @internal
 */
export abstract class ResourceServiceBase<RecordType, CollectionType=RecordType[]> {
  /**
   * @returns The path to the collection of resources.
   * @internal
   */
  abstract collectionPath():string;

  /**
   * @param id - The id of the resource.
   * @returns The path to the resource.
   * @internal
   */
  abstract resourcePath({id}:{id:string|number}):string;

  /**
   * Converts a JSON object to a RecordType.
   * 
   * @param json - The JSON object to convert or null.
   * @returns The converted RecordType or null.
   * @internal
   */
  processJSONToRecord(json: JSONObject | null): RecordType | null {
    return json ? json as RecordType : null;
  }

  /**
   * Converts a JSON object to a CollectionType.
   * 
   * @param json - The JSON object to convert or null.
   * @returns The converted CollectionType or null.
   * @internal
   */
  processJSONToCollection(json: JSONObject | null): CollectionType | null {
    return json ? json as CollectionType : null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResourceServiceBaseConstructor<TResult> = new (...args: any[]) => TResult;
interface IFaceResourceReadable<RecordType> {
  findById({client, id}:{client?: Client, id:string|number}): Promise<RecordType | null>;
}
/**
 * Adds a `findById` method to the base class.
 * @internal
 * 
 * @param Base - The base class to extend that inherits from
 * ResourceServiceBase<>
 * @typeParam T - The base class to extend that inherits from. Example: `typeof Base`
 * @typeParam RecordType - The type of the record.
 * @typeParam CollectionType - The type of the collection. Defaults to `RecordType[]`
 * @returns 
 */
export function ResourceReadable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  CollectionType=RecordType[]
>(Base: T) {
  return class extends Base implements IFaceResourceReadable<RecordType> {
    async findById({client, id}:{client?: Client, id:string|number}): Promise<RecordType | null> {
      client ||= SubscribePro.client;

      const response = await client.request({path: this.resourcePath({id}), method: "GET"})
      return this.processJSONToRecord(response);
    } 
  };
};

type SearchParamBasicValues = string | string[] | number | number[]
type SearchParamValues = SearchParamBasicValues | Record<string, SearchParamBasicValues>;
export type SearchParamsBase = Record<string, SearchParamValues>

export function ResourceSearchable<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SearchParams extends SearchParamsBase=Record<string, string>,
  CollectionType=RecordType[]
>(Base: T) {
  return class extends Base {
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

export function ResourceCRUDS<
  T extends ResourceServiceBaseConstructor<ResourceService<RecordType, CollectionType>>,
  RecordType,
  CreateType=Partial<RecordType>,
  UpdateType=Partial<RecordType>,
  SearchParams extends SearchParamsBase=Record<string, string>,
  CollectionType=RecordType[]
>(Base: T) {
  const BaseR = ResourceReadable<typeof Base, RecordType, CollectionType>(
    Base
  );
  const BaseRS = ResourceSearchable<typeof BaseR, RecordType, SearchParams, CollectionType>(
    BaseR
  );
  const BaseRUS = ResourceUpdateable<typeof BaseRS, RecordType, UpdateType, CollectionType>(
    BaseRS
  );
  const BaseCRUS = ResourceCreateable<typeof BaseRUS, RecordType, CreateType, CollectionType>(
    BaseRUS
  );
  return ResourceDeleteable<typeof BaseCRUS, RecordType, CollectionType>(BaseCRUS);
};

export default ResourceServiceBase;
