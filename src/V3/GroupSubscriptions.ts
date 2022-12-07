import ResourceServiceBase, { ResourceReadable, ResourceSearchable, SearchParamsBase } from './ResourceServiceBase';

type GroupSubscriptionType = {
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

type GroupSubscriptionSearchParams = {
  id?: number | number[],
  ["customer.id"]?: number | number[],
  ["customer.platformSpecificCustomerId"]?: string | string[],
  ["customer.email"]?: string | string[],
  status?: string | string[],
  properties?: string[] | Record<string, string[]>,
  userDefinedFields?: Record<string, string | string[]>,
  page?: number,
  itemsPerPage?: number,
};

class GroupSubscriptionsServiceBase extends ResourceServiceBase<GroupSubscriptionType> {
  collectionPath() { return "/group-subscriptions" };
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };

};

const GroupSubscriptionsServiceReadable = ResourceReadable<
  typeof GroupSubscriptionsServiceBase, GroupSubscriptionType
>(GroupSubscriptionsServiceBase);
class GroupSubscriptionsService extends ResourceSearchable<
  typeof GroupSubscriptionsServiceReadable, GroupSubscriptionType, GroupSubscriptionSearchParams
>(GroupSubscriptionsServiceReadable) {
  preProcessSearchParams(params: GroupSubscriptionSearchParams): URLSearchParams {
    // let cleanedParams: SearchParamsBase;
    const {properties, userDefinedFields, ...cleanedParams}:{
      properties?:GroupSubscriptionSearchParams["properties"],
      userDefinedFields?:GroupSubscriptionSearchParams["userDefinedFields"],
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

export const GroupSubscriptions = new GroupSubscriptionsService();
export default GroupSubscriptions;