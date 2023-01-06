import { JSONObject } from '../Client';
import ResourceServiceBase, { ResourceCRUable } from './ResourceServiceBase'

type CustomerType = {
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  userDefinedFields: JSONObject;
  id: number;
  platform_specific_customer_id: string;
  magento_customer_id: string;
  magento_customer_group_id: number;
  magento_website_id: number;
  external_vault_customer_token: string;
  default_address_id: string;
  default_billing_address_id: string;
  default_shipping_address_id: string;
  user_defined_fields: JSONObject;
  created: string;
  updated: string;
  subscription_count: number;
  active_subscription_count: number;
  trial_subscription_count: number;
  active_subscribed_qty: number;
};

type CreateCustomerType = {
  email: string;
  platform_specific_customer_id?: string;
  magento_customer_id?: string;
  magento_customer_group_id?: number;
  magento_website_id?: number;
  external_vault_customer_token?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  user_defined_fields?: JSONObject;
};

type UpdateCustomerType = Partial<CreateCustomerType>;

type CustomerSearchParams = {
  platform_specific_customer_id?: string;
  magento_customer_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

class CustomersService extends ResourceServiceBase<CustomerType, CustomerType[]> {
  resourceName() { return 'customer'; }
  collectionName() { return 'customers'; }
  collectionPath() { return "/services/v2/customers" };
  singularPath() { return "/services/v2/customer" }
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };
};

export const Customers = new (
  ResourceCRUable<
    typeof CustomersService, CustomerSearchParams, CustomerType, CustomerType[], CreateCustomerType, UpdateCustomerType
  >(CustomersService)
)();
export default Customers;
