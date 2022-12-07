import ResourceServiceBase, { ResourceReadable, ResourceSearchable, ResourceUpdateable, SearchParamsBase } from './ResourceServiceBase';
import { JSONObject, JSONArray } from '../Client';

type SubscriptionType = {
  id: number,
  environmentId: number,
  customerId: number,
  customer: string,
  shippingAddressId: number,
  shippingAddress: string,
  billingAddressId: number,
  billingAddress: string,
  paymentProfileId: number,
  productId: number,
  productSku: string,
  product: string,
  status: string,
  statusName: string,
  recurringOrderCount: string,
  qty: string,
  scheduleName: string,
  interval: string,
  schedulingRuleParams: JSONObject,
  couponCode: string,
  useFixedPrice: boolean,
  fixedPrice: string,
  paymentMethodCode: string,
  requiresShipping: boolean,
  shippingMethodCode: string,
  nextOrderDate: string,
  expirationDate: string,
  lastOrderDate: string,
  errorClass: string,
  errorClassDescription: string,
  errorType: string,
  errorMessage: string,
  errorTime: string,
  failedOrderAttemptCount: string,
  retryAfter: string,
  productOptions: JSONObject | JSONArray,
  additionalOptions: JSONObject | JSONArray,
  platformSpecificFields: JSONObject | JSONArray,
  userDefinedFields: JSONObject,
  created: string,
  updated: string,
};

type UpdateSubscriptionType = Partial<{
  shippingAddressId: number,
  billingAddressId: number,
  paymentProfileId: number,
  productId: number,
  productSku: string,
  qty: string,
  interval: string,
  schedulingRuleParams: JSONObject,
  couponCode: string,
  useFixedPrice: boolean,
  fixedPrice: number,
  paymentMethodCode: string,
  requiresShipping: boolean,
  shippingMethodCode: string,
  nextOrderDate: string,
  expirationDate: string,
  productOptions: JSONObject | JSONArray,
  additionalOptions: JSONObject | JSONArray,
  platformSpecificFields: JSONObject | JSONArray,
  userDefinedFields: JSONObject,
  _meta: JSONObject
}>;

type SubscriptionSearchParams = Partial<{
  id: number | number[],
  ["customer.id"]: number | number[],
  ["customer.platformSpecificCustomerId"]: string | string[],
  ["customer.email"]: string | string[],
  ["product.id"]: number | number[],
  ["product.sku"]: string | string[],
  status: string | string[],
  qty: string | string[],
  properties?: string[] | Record<string, string[]>,
  userDefinedFields?: Record<string, string | string[]>,
  page: number,
  itemsPerPage: number,
}>;

class SubscriptionsServiceBase extends ResourceServiceBase<SubscriptionType> {
  collectionPath() { return "/subscriptions" };
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };

};

const SubscriptionsServiceReadable = ResourceReadable<
  typeof SubscriptionsServiceBase, SubscriptionType
>(SubscriptionsServiceBase);
const SubscriptionsServiceSearchRead = ResourceSearchable<
  typeof SubscriptionsServiceReadable, SubscriptionType, SubscriptionSearchParams
>(SubscriptionsServiceReadable);
class SubscriptionsService extends ResourceUpdateable<
  typeof SubscriptionsServiceSearchRead, SubscriptionType, UpdateSubscriptionType
>(SubscriptionsServiceSearchRead) {
  preProcessSearchParams(params: SubscriptionSearchParams): URLSearchParams {
    // let cleanedParams: SearchParamsBase;
    const {properties, userDefinedFields, ...cleanedParams}:{
      properties?:SubscriptionSearchParams["properties"],
      userDefinedFields?:SubscriptionSearchParams["userDefinedFields"],
    } & SearchParamsBase = params;

    if (userDefinedFields) {
      for(const key of Object.keys(userDefinedFields)) {
        cleanedParams[`userDefinedFields.${key}`] = userDefinedFields[key];
      }
    }
    if (properties) {
      if (Array.isArray(properties)) {
        cleanedParams["properties"] = properties;
      } else {
        for(const key of Object.keys(properties)) {
          if (key === "") {
            cleanedParams["properties"] = properties[key];
          } else {
            cleanedParams[`properties[${key}]`] = properties[key];
          }
        }
      }
    }

    return super.preProcessSearchParams(cleanedParams)
  }
};

export const Subscriptions = new SubscriptionsService();
export default Subscriptions;