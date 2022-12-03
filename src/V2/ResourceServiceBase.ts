import Client, { JSONObject, JSONValue } from '../Client';
import SubscribePro from '../SubscribePro';

export type JSONPatchData = {
  op: "add" | "remove" | "replace" | "move" | "copy" | "test";
  ids?: string[];
  path: string;
  value?: JSONValue;
};

export abstract class ResourceServiceBase<
  RecordType,
  CreateType=RecordType,
  BulkCreateType=CreateType[],
  UpdateType=CreateType,
  PatchType=JSONPatchData,
  BulkPatchType=PatchType[],
  CollectionType=RecordType[]
> {
  abstract collectionPath():string;
  abstract singularPath():string;
  abstract resourcePath({id}:{id:string|number}):string;

  processJSONToRecord(json: JSONObject | null): RecordType | null {
    return json ? json as RecordType : null;
  }

  processJSONToCollection(json: JSONObject | null): CollectionType | null {
    return json ? json as CollectionType : null;
  }

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
      body: JSON.stringify(data),
    });
    return this.processJSONToRecord(response);
  }

  async createAll({ client, data }: { client?: Client, data: BulkCreateType }): Promise<null> {
    client ||= SubscribePro.client;

    await client.request({
      path: this.collectionPath(),
      method: "POST",
      body: JSON.stringify(data),
    });
    return null;
  }

  async updateOne({ client, id, data }: { client?: Client, id: string|number, data: UpdateType }): Promise<RecordType | null> {
    client ||= SubscribePro.client;

    const response = await client.request({
      path: this.resourcePath({id}),
      method: "POST",
      body: JSON.stringify(data),
    });
    return this.processJSONToRecord(response);
  }

  async patchOne({ client, id, data }: { client?: Client, id: string|number, data: PatchType }): Promise<RecordType | null> {
    client ||= SubscribePro.client;

    const response = await client.request({
      path: this.resourcePath({id}),
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return this.processJSONToRecord(response);
  }

  async patchAll({ client, data }: { client?: Client, data: BulkPatchType }): Promise<null> {
    client ||= SubscribePro.client;

    await client.request({
      path: this.collectionPath(),
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return null;
  }
};

export default ResourceServiceBase;
