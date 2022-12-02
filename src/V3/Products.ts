import ResourceServiceBase from './ResourceServiceBase';

type ProductType = {
  id: number,
  environmentId: number,
  configProfileId: number,
  sku: string,
  name: string,
  thumbnailUrl: string,
  msrp: number,
  price: number,
  salePrice: number,
  isOnSale: boolean,
  minQty: number,
  maxQty: number,
  qtyInStock: number,
  isInStock: boolean,
  discount: number,
  isDiscountPercentage: boolean,
  intervals: string[],
  defaultInterval: string,
  subscriptionOptionMode: string,
  defaultSubscriptionOption: string,
  shippingMode: string,
  useSchedulingRule: boolean,
  schedulingRule: string,
  schedulingRuleId: number,
  created: string,
  updated: string,
};

type ProductSearchParams = {
  id?: string | string[],
  sku?: string | string[],
  name?: string,
  ["configProfile.Id"]?: number | number[],
  page?: number,
  itemsPerPage?: number,
};

type CreateProductType = Partial<Omit<ProductType, "id">> & {
  sku: string,
  name: string,
  price: number,
};

class ProductsService extends ResourceServiceBase<ProductType, ProductSearchParams, CreateProductType> {
  collectionPath() { return "/products" };
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };
};

export const Products = new ProductsService();
export default Products;