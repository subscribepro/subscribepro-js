import ResourceServiceBase, { ResourceReadable, ResourceSearchable } from './ResourceServiceBase';

type ProductConfigurationProfileType = {
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

type ProductConfigurationProfileSearchParams = {
  page?: number,
  itemsPerPage?: number,
};

class ProductConfigurationProfilesServiceBase extends ResourceServiceBase<ProductConfigurationProfileType> {
  collectionPath() { return "/product-configuration-profiles" };
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };

};

const ProductConfigurationProfilesServiceReadable = ResourceReadable<
  typeof ProductConfigurationProfilesServiceBase, ProductConfigurationProfileType
>(ProductConfigurationProfilesServiceBase);
const ProductConfigurationProfilesService = ResourceSearchable<
  typeof ProductConfigurationProfilesServiceReadable, ProductConfigurationProfileType, ProductConfigurationProfileSearchParams
>(ProductConfigurationProfilesServiceReadable);

export const ProductConfigurationProfiles = new ProductConfigurationProfilesService();
export default ProductConfigurationProfiles;