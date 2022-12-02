import Client from '../Client';
import SubscribePro from '../SubscribePro';

export type JSONPatchData = {
  op: "add" | "remove" | "replace" | "move" | "copy" | "test";
  ids?: string[];
  path: string;
  value?: any;
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

  async getOne({ client, id }: { client?: Client, id: string|number }): Promise<RecordType> {
    client ||= SubscribePro.client;

    return client.request({
      path: this.resourcePath({id}),
      method: "GET",
    });
  }

  async getAll({ client }: { client?: Client }): Promise<CollectionType> {
    client ||= SubscribePro.client;

    return client.request({
      path: this.collectionPath(),
      method: "GET",
    });
  }

  async createOne({ client, data }: { client?: Client, data: CreateType }): Promise<any> {
    client ||= SubscribePro.client;

    return client.request({
      path: this.singularPath(),
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createAll({ client, data }: { client?: Client, data: BulkCreateType }): Promise<any> {
    client ||= SubscribePro.client;

    return client.request({
      path: this.collectionPath(),
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateOne({ client, id, data }: { client?: Client, id: string|number, data: UpdateType }): Promise<any> {
    client ||= SubscribePro.client;

    return client.request({
      path: this.resourcePath({id}),
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async patchOne({ client, id, data }: { client?: Client, id: string|number, data: PatchType }): Promise<any> {
    client ||= SubscribePro.client;

    return client.request({
      path: this.resourcePath({id}),
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async patchAll({ client, data }: { client?: Client, data: BulkPatchType }): Promise<any> {
    client ||= SubscribePro.client;

    return client.request({
      path: this.collectionPath(),
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
};

export default ResourceServiceBase;
