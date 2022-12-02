import ResourceServiceBase from './ResourceServiceBase'

type ProductConfigurationProfileType = {
  id: number;
  name: string;
  data: any[];
  created: string;
  updated: string;
  environment: string;
};

type SchedulingRuleType = {
  id: number;
  name: string;
  type: string;
  data: string;
  created: string;
  updated: string;
  environment: string;
};

type ProductType = {
  id: number;
  environment: string;
  sku: string;
  name: string;
  thumbnail_url: string;
  show_on_ui: boolean;
  min_qty: number;
  max_qty: number;
  is_in_stock: boolean;
  price: number;
  msrp: number;
  sale_price: number;
  is_on_sale: boolean;
  discount: number;
  is_discount_percentage: boolean;
  subscription_option_mode: 'subscription_only' | 'subscription_and_onetime_purchase';
  default_subscription_option: 'subscription' | 'onetime_purchase';
  config_profile: ProductConfigurationProfileType;
  use_scheduling_rule: boolean;
  scheduling_rule: SchedulingRuleType;
  default_interval: string;
  intervals: string[];
  product_options_mode: 'pass_through' | 'no_options';
  shipping_mode: 'requires_shipping' | 'no_shipping';
  shipping_method_code: string;
  is_trial_product: boolean;
  trial_interval: string;
  trial_price: number;
  trial_full_product_sku: string;
  trial_email_template_code: string;
  trial_email_threshold_days: number;
  trial_welcome_email_template_code: string;
  is_subscription_enabled: boolean;
  user_defined_fields: any[];
  created: string;
  updated: string;
};

type CreateProductType = {
  sku: string;
  name: string;
  thumbnail_url?: string;
  user_defined_fields?: any[];
  price: string;
  msrp?: string;
  sale_price?: string;
  is_on_sale?: string;
  show_on_ui?: string;
  min_qty?: string;
  max_qty?: string;
  qty_in_stock?: string;
  is_in_stock?: string;
  discount?: string;
  is_discount_percentage?: string;
  subscription_option_mode?: 'subscription_only' | 'subscription_and_onetime_purchase';
  default_subscription_option?: 'subscription' | 'onetime_purchase';
  use_scheduling_rule?: string;
  scheduling_rule_id?: string;
  default_interval?: string;
  intervals?: string;
  product_options_mode?: 'pass_through' | 'no_options';
  shipping_mode?: 'requires_shipping' | 'no_shipping';
  shipping_method_code?: string;
  config_profile_id?: string;
  is_trial_product?: string;
  trial_interval?: string;
  trial_price?: string;
  trial_full_product_sku?: string;
  trial_email_template_code?: string;
  trial_email_threshold_days?: string;
  trial_welcome_email_template_code?: string;
};

type BulkCreateProductType = {
  products: CreateProductType[];
};

type UpdateProductType = Partial<CreateProductType>;

class ProductsService extends ResourceServiceBase<
  ProductType,
  CreateProductType,
  BulkCreateProductType,
  UpdateProductType
> {
  collectionPath() { return "/services/v2/products" };
  singularPath() { return "/services/v2/product" }
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };
};

export const Products = new ProductsService();
export default Products;
