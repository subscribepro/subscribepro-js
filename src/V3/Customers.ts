import ResourceServiceBase, { ResourceCRUDS } from './ResourceServiceBase';
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

class CustomersService extends ResourceCRUDS<
  typeof CustomersServiceBase, CustomerType, CreateCustomerType, UpdateCustomerType, CustomerSearchParams
>(CustomersServiceBase) {
  async me({client}:{client?:Client}):Promise<CustomerType | null> {
    return await this.findById({id: "me", client});
  }
}

export const Customers = new CustomersService();
export default Customers;