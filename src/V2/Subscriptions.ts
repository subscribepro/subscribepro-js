import Client, { JSONArray, JSONObject } from '../Client';
import SubscribePro from '../SubscribePro';
import { AddressType, UpdateAddressType } from './Addresses';
import { PaymentProfileType } from './PaymentProfiles';
import ResourceServiceBase, { ResourceBulkCreateable, ResourceCRUable, ResourcePatchable } from './ResourceServiceBase'

type SubscriptionStatuses = 'Active' | 'Canceled' | 'Expired' | 'Retry' | 'Failed' | 'Paused';

type SubscriptionType = {
  id: number;
  status: SubscriptionStatuses;
  customer_id: string;
  qty: number;
  use_fixed_price: boolean;
  fixed_price: number;
  scheduling_rule_params: JSONObject;
  next_order_date: string;
  last_order_date: string;
  expiration_date?: string;
  created_as_trial: boolean;
  coupon_code?: string;
  ecommerce_store_code?: string;
  magento_store_code?: string;
  requires_shipping: boolean;
  shipping_method_code?: string;
  magento_shipping_method_code?: string;
  payment_profile?: PaymentProfileType;
  payment_method_code?: string;
  billing_address?: AddressType;
  shipping_address?: AddressType;
  recurring_order_count: number;
  error_time?: string;
  error_class?: string;
  error_class_description?: string;
  error_type?: string;
  error_message?: string;
  failed_order_attempt_count?: number;
  retry_after?: string;
  cancelled?: boolean;
  authorize_net_payment_profile_id?: string;
  creditcard_last_digits?: string;
  subscription_products?: JSONArray;
  magento_billing_address_id?: string | number;
  magento_shipping_address_id?: string | number;
  platform_specific_fields?: JSONObject;
  user_defined_fields?: JSONObject | JSONArray;
  schedule_name?: string;
  is_scheduled?: boolean;
  interval?: string;
  product_sku?: string;
  created: string;
  updated: string;
};

type SubscriptionMetaType = {
  changed_by?: {
    customer?: {
      customer_id?: string;
      email?: string;
      full_name?: string;
    },
    admin?: {
      user_id?: string;
      email?: string;
      full_name?: string;
    },
  };
};

type CreateSubscriptionType = {
  customer_id: string;
  payment_profile_id?: number;
  payment_method_code?: string;
  billing_address_id?: number;
  billing_address?: UpdateAddressType;
  requires_shipping: boolean;
  shipping_method_code?: string;
  magento_shipping_method_code?: string;
  shipping_address_id?: number;
  shipping_address?: UpdateAddressType & { use_billing?: boolean };
  product_sku: string;
  order_item_id?: string;
  qty: number;
  use_fixed_price?: boolean;
  fixed_price?: number;
  interval?: string;
  scheduling_rule_params?: JSONObject;
  next_order_date: string;
  first_order_already_created?: boolean;
  send_customer_notification_email?: boolean;
  expiration_date?: string;
  coupon_code?: string;
  magento_store_code?: string;
  ecommerce_store_code?: string;
  platform_specific_fields?: JSONObject;
  user_defined_fields?: JSONObject | JSONArray;
  _meta?: SubscriptionMetaType & { order_details?: JSONObject };
};

type BulkCreateSubscriptionType = Omit<CreateSubscriptionType, "_meta">[];

type UpdateSubscriptionType = Partial<CreateSubscriptionType>;

type SubscriptionSearchParams = {
  customer_id?: string;
  payment_profile_id?: number;
};

type CancelSubscriptionParams = {
  send_customer_notification_email?: boolean;
  _meta?: SubscriptionMetaType;
};

type PauseSubscriptionParams = {
  _meta?: SubscriptionMetaType;
};

type RestartSubscriptionParams = {
  next_order_date?: string;
  _meta?: SubscriptionMetaType;
};

type SkipSubscriptionParams = PauseSubscriptionParams;

type UpcomingOrderDatesSubscriptionParams = {
  ["order-count"]?: string;
};

type UpcomingSubscriptionOrderDatesType = {
  upcoming_order_dates: string[];
};

class SubscriptionsServiceBase extends ResourceServiceBase<SubscriptionType, SubscriptionType[]> {
  resourceName() { return 'subscription'; }
  collectionName() { return 'subscriptions'; }
  collectionPath() { return "/services/v2/subscriptions" };
  singularPath() { return "/services/v2/subscription" }
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };
};

const SubscriptionsServiceCRU = ResourceCRUable<
  typeof SubscriptionsServiceBase, SubscriptionSearchParams, SubscriptionType,
  SubscriptionType[], CreateSubscriptionType, UpdateSubscriptionType
>(
  SubscriptionsServiceBase
)

const SubscriptionsServiceBulkCreateWithCRUD = ResourceBulkCreateable<
  typeof SubscriptionsServiceCRU, SubscriptionType, BulkCreateSubscriptionType,
  SubscriptionType[], SubscriptionMetaType
>(
  SubscriptionsServiceCRU
)

class SubscriptionsService extends ResourcePatchable<
  typeof SubscriptionsServiceBulkCreateWithCRUD, SubscriptionType
>(SubscriptionsServiceBulkCreateWithCRUD) {
  generateSubscriptionActionBody(params?: JSONObject):string|undefined {
    let body:string|undefined;
    if (params) {
      const {_meta, ...subscription} = params ?? {};
      body = JSON.stringify({subscription, _meta});
    }
    return body;
  }

  async cancel({client, id, params}:{client?: Client, id: string|number, params?: CancelSubscriptionParams}): Promise<null> {
    client ||= SubscribePro.client;

    await client.request({
      method: 'POST',
      path: `${this.resourcePath({id})}/cancel`,
      body: this.generateSubscriptionActionBody(params),
    });
    return null;
  }

  async pause({client, id, params}:{client?: Client, id: string|number, params?: PauseSubscriptionParams}): Promise<null> {
    client ||= SubscribePro.client;

    await client.request({
      method: 'POST',
      path: `${this.resourcePath({id})}/pause`,
      body: this.generateSubscriptionActionBody(params),
    });
    return null;
  }

  async restart({client, id, params}:{client?: Client, id: string|number, params?: RestartSubscriptionParams}): Promise<null> {
    client ||= SubscribePro.client;

    await client.request({
      method: 'POST',
      path: `${this.resourcePath({id})}/restart`,
      body: this.generateSubscriptionActionBody(params),
    });
    return null;
  }

  async skip({client, id, params}:{client?: Client, id: string|number, params?: SkipSubscriptionParams}): Promise<null> {
    client ||= SubscribePro.client;

    await client.request({
      method: 'POST',
      path: `${this.resourcePath({id})}/skip`,
      body: this.generateSubscriptionActionBody(params),
    });
    return null;
  }

  async upcomingOrderDates({client, id, params}:{client?: Client, id: string|number, params?: UpcomingOrderDatesSubscriptionParams}): Promise<UpcomingSubscriptionOrderDatesType | null> {
    client ||= SubscribePro.client;
    let path = `${this.resourcePath({id})}/upcoming-order-dates`;
    if (params) {
      path = `${path}?${this.preProcessSearchParams(params).toString()}`;
    }

    await client.request({
      method: 'GET',
      path,
    });
    return null;
  }
};

export const Subscriptions = new SubscriptionsService();
export default Subscriptions;
