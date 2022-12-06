import ResourceServiceBase, { ResourceReadable, ResourceUpdateable, ResourceCreateable, ResourceDeleteable } from './ResourceServiceBase';
import Client from '../Client';

type CustomerType = {
  id: number,
  environmentId: number,
  email: string,
  firstName: string,
  lastName: number,
  defaultAddressId?: number,
  defaultBillingAddressId?: number,
  defaultShippingAddressId?: number,
  created: string,
  updated: string,
};

type CustomerSearchParams = {
  page?: number,
  itemsPerPage?: number,
};

type CreateCustomerType = {
  environmentId?: number,
  email: string,
  firstName: string,
  lastName: string,
};

type UpdateCustomerType = {
  email: string,
  firstName: string,
  lastName: string,
  defaultAddressId?: number,
  defaultBillingAddressId?: number,
  defaultShippingAddressId?: number,
}

class CustomersServiceBase extends ResourceServiceBase<CustomerType> {
  collectionPath() { return "/customers" };
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };

};

const CustomersServiceR = ResourceReadable<typeof CustomersServiceBase, CustomerType, CustomerSearchParams>(
  CustomersServiceBase
);
const CustomersServiceRU = ResourceUpdateable<typeof CustomersServiceR, CustomerType, UpdateCustomerType>(
  CustomersServiceR
);
const CustomersServiceCRU = ResourceCreateable<typeof CustomersServiceRU, CustomerType, CreateCustomerType>(
  CustomersServiceRU
);

class CustomersService extends ResourceDeleteable<typeof CustomersServiceCRU, CustomerType>(CustomersServiceCRU) {
  async me({client}:{client?:Client}):Promise<CustomerType | null> {
    return await this.findById({id: "me", client});
  }
}

export const Customers = new CustomersService();
export default Customers;