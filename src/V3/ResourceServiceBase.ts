import Client from "../Client";

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
    let searchParams = new URLSearchParams();
    for (const key in params) {
      searchParams.append(key, String(params[key])); // Array values are converted to comma-separated strings
    }
    return searchParams;
  }

  async findById({client, id}:{client: Client, id:string|number}): Promise<RecordType> {
    return await client.request({path: this.resourcePath({id}), method: "GET"});
  } 

  async findAll({client, params}:{client: Client, params?: SearchParams}): Promise<CollectionType> {
    let path = this.collectionPath();
    if (params) {
      path = `${path}?${this.preProcessSearchParams(params).toString()}`;
    }
    return await client.request({path, method: "GET"});
  }

  async create({client, data}:{client: Client, data: CreateType}): Promise<any> {
    return await client.request({path: this.collectionPath(), method: "POST", body: JSON.stringify(data)});
  }

  async update({client, id, data}:{client: Client, id:string|number, data: UpdateType}): Promise<any> {
    return await client.request({path: this.resourcePath({id}), method: "PATCH", body: JSON.stringify(data)});
  }

  async delete({client, id}:{client: Client, id:string|number}): Promise<any> {
    return await client.request({path: this.resourcePath({id}), method: "DELETE"});
  }
};

export default ResourceServiceBase;
