import ResourceServiceBase, { ResourceCRUDS } from './ResourceServiceBase';

type CustomerAddressType = {
  id: number,
  environmentId: number,
  customerId: number,
  firstName: string,
  middleName?: string,
  lastName: string,
  company?: string,
  street1: string,
  street2?: string,
  street3?: string,
  city: string,
  region: string,
  postcode: string,
  country: string,
  phone: string,
  isDefault: boolean,
  isDefaultBilling: boolean,
  isDefaultShipping: boolean,
  created: string,
  updated: string,
};

type CustomerAddressSearchParams = {
  ["customer.id"]?: number | number[],
  ["customer.platformSpecificCustomerId"]?: string | string[],
  ["customer.email"]?: string | string[],
  page?: number,
  itemsPerPage?: number,
};

type CreateCustomerAddressType = {
  environmentId?: number,
  customerId: number,
  firstName: string,
  middleName?: string,
  lastName: string,
  company?: string,
  street1?: string,
  street2?: string,
  street3?: string,
  city?: string,
  region?: string,
  postcode?: string,
  country?: string,
  phone?: string,
};

type UpdateCustomerAddressType = CreateCustomerAddressType;

class CustomerAddressesServiceBase extends ResourceServiceBase<CustomerAddressType> {
  collectionPath() { return "/customer-addresses" };
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };

};

const CustomerAddressesService = ResourceCRUDS<
  typeof CustomerAddressesServiceBase,
  CustomerAddressType,
  CreateCustomerAddressType,
  UpdateCustomerAddressType,
  CustomerAddressSearchParams
>(CustomerAddressesServiceBase);

export const CustomerAddresses = new CustomerAddressesService();
export default CustomerAddresses;