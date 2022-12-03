import Client, { JSONObject } from "../Client";

export abstract class ResourceServiceBase<
  RecordType,
  SearchParams=Record<string, string>,
  CreateType=Omit<RecordType, "id">,
  UpdateType=CreateType,
  CollectionType=RecordType[]
> {
  abstract collectionPath():string;
  abstract resourcePath({id}:{id:string|number}):string;

  preProcessSearchParams(params: SearchParams): URLSearchParams {
    const searchParams = new URLSearchParams();
    for (const key in params) {
      searchParams.append(key, String(params[key])); // Array values are converted to comma-separated strings
    }
    return searchParams;
  }

  processJSONToRecord(json: JSONObject | null): RecordType | null {
    return json ? json as RecordType : null;
  }

  processJSONToCollection(json: JSONObject | null): CollectionType | null {
    return json ? json as CollectionType : null;
  }

  async findById({client, id}:{client: Client, id:string|number}): Promise<RecordType | null> {
    const response = await client.request({path: this.resourcePath({id}), method: "GET"})
    return this.processJSONToRecord(response);
  } 

  async findAll({client, params}:{client: Client, params?: SearchParams}): Promise<CollectionType | null> {
    let path = this.collectionPath();
    if (params) {
      path = `${path}?${this.preProcessSearchParams(params).toString()}`;
    }
    const response = await client.request({path, method: "GET"});
    return this.processJSONToCollection(response);
  }

  async create({client, data}:{client: Client, data: CreateType}): Promise<RecordType | null> {
    const response = await client.request({path: this.collectionPath(), method: "POST", body: JSON.stringify(data)});
    return this.processJSONToRecord(response);
  }

  async update({client, id, data}:{client: Client, id:string|number, data: UpdateType}): Promise<RecordType | null> {
    const response = await client.request({path: this.resourcePath({id}), method: "PATCH", body: JSON.stringify(data)});
    return this.processJSONToRecord(response);
  }

  async delete({client, id}:{client: Client, id:string|number}): Promise<null> {
    await client.request({path: this.resourcePath({id}), method: "DELETE"});
    return null;
  }
};

export default ResourceServiceBase;
