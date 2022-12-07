import ResourceServiceBase, { ResourceReadable, ResourceSearchable, ResourceUpdateable, ResourceCreateable, ResourceDeleteable } from './ResourceServiceBase';

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

const CustomerAddressesServiceR = ResourceReadable<typeof CustomerAddressesServiceBase, CustomerAddressType>(
  CustomerAddressesServiceBase
);
const CustomerAddressesServiceRS = ResourceSearchable<typeof CustomerAddressesServiceR, CustomerAddressType, CustomerAddressSearchParams>(
  CustomerAddressesServiceR
);
const CustomerAddressesServiceRUS = ResourceUpdateable<typeof CustomerAddressesServiceRS, CustomerAddressType, UpdateCustomerAddressType>(
  CustomerAddressesServiceRS
);
const CustomerAddressesServiceCRUS = ResourceCreateable<typeof CustomerAddressesServiceRUS, CustomerAddressType, CreateCustomerAddressType>(
  CustomerAddressesServiceRUS
);
const CustomerAddressesService = ResourceDeleteable<typeof CustomerAddressesServiceCRUS, CustomerAddressType>(CustomerAddressesServiceCRUS);

export const CustomerAddresses = new CustomerAddressesService();
export default CustomerAddresses;