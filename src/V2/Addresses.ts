import Client, { JSONArray, JSONObject } from '../Client';
import SubscribePro from '../SubscribePro';
import ResourceServiceBase, { ResourceCRUable, ResourceDeleteable } from './ResourceServiceBase'

export type AddressType = {
  id: number;
  customer_id: string;
  magento_address_id?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  company?: string;
  street1: string;
  street2: string;
  street3?: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  phone: string;
  is_default?: boolean;
  is_default_billing?: boolean;
  is_default_shipping?: boolean;
  user_defined_fields: JSONArray;
  created: string;
  updated: string;
};

type CreateAddressType = {
  customer_id: string;
  magento_address_id?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  company?: string;
  street1?: string;
  street2?: string;
  street3?: string;
  city?: string;
  region?: string;
  postcode?: string;
  country?: string;
  phone?: string;
  user_defined_fields?: JSONObject;
};

type UpdateAddressType = Partial<Omit<CreateAddressType, "customer_id">>;

type AddressSearchParams = {
  customer_id?: string;
};

class AddressesServiceBase extends ResourceServiceBase<AddressType, AddressType[]> {
  resourceName() { return 'address'; }
  collectionName() { return 'addresses'; }
  collectionPath() { return "/services/v2/addresses" };
  singularPath() { return "/services/v2/address" }
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };
};

const AddressesServiceCRU = ResourceCRUable<
  typeof AddressesServiceBase, AddressSearchParams, AddressType, AddressType[], CreateAddressType, UpdateAddressType
>(
  AddressesServiceBase
)


class AddressesService extends ResourceDeleteable<typeof AddressesServiceCRU, AddressType>(
  AddressesServiceCRU
) {
  async findOrCreate({client, data}:{ client?: Client, data: CreateAddressType }): Promise<AddressType | null> {
    client ||= SubscribePro.client;

    const response = await client.request({
      path: `${this.singularPath()}/find_or_create`,
      method: "POST",
      body: JSON.stringify({[this.resourceName()]: data}),
    });
    return this.processJSONToRecord(response);
  }
}

export const Addresses = new AddressesService();
export default Addresses;
