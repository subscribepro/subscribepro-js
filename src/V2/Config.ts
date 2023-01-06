import Client, { JSONArray } from '../Client';
import SubscribePro from '../SubscribePro';
import { ResourceServiceBase } from './ResourceServiceBase';

type Interval = {
  id: number;
  name: string;
  type: string;
  length: number;
  environment: string;
};

type DefaultInterval = {
  id: number;
  interval: Interval | string;
  updated: string;
  created: string;
};

type DefaultScheduleRule = {
  id: number;
  name: string;
  type:  'basic' | 'day_of_the_x' | 'every_n_periods' | 'arbitrary_dates' | 'arbitrary_dates_per_subscription';
  data: string;
  environment: string;
  updated: string;
  created: string;
};

type PaymentVault = {
  name: string;
  vault_type: 'spreedly' | 'cim' | 'cybersource';
};

type OrderGenerationRetryRule = {
  priority: number;
  errorClass: string;
  maxOrderAttempts: number;
  minRetryDelay: string;
}

type ConfigType = {
  additional_config: JSONArray;
  allow_billing_address_attached_to_subscription: boolean;
  allow_configuration_of_default_shipping_method: boolean;
  allow_offline_payment_methods: boolean;
  allow_user_to_select_shipping_method_on_products: boolean;
  allow_user_to_select_shipping_method_on_subscriptions: boolean;
  authorize_net_duplicate_window: number;
  automatic_order_generation: boolean;
  braintree_skip_advanced_fraud_checks: string;
  created: string;
  currency: string;
  customer_address_user_defined_field_definitions: JSONArray;
  customer_default_address_mode: string;
  customer_service_email: string;
  customer_service_phone: string;
  customer_user_defined_field_definitions: JSONArray;
  default_account_updater_mode: string;
  default_discount: number;
  default_intervals: DefaultInterval[];
  default_max_qty: number;
  default_min_qty: number;
  default_scheduling_rule?: DefaultScheduleRule;
  default_shipping_method_code: string;
  dual_vault_mode: string;
  ecommerce_platform_connection_type: string;
  ecommerce_store_code: string;
  email_template_disable_expiring_card: boolean;
  email_template_disable_subscription_cancelled: boolean;
  email_template_disable_subscription_created: boolean;
  email_template_disable_subscription_order_failed: boolean;
  email_template_disable_subscription_updated: boolean;
  email_template_disable_upcoming_subscription: boolean;
  email_template_translate_with_magento_store_code: boolean;
  enable_account_updater: boolean;
  enable_apple_pay: boolean;
  enable_automated_payment_reversal_frontend_originated: boolean;
  enable_automated_payment_reversal_subscribe_pro_originated: boolean;
  enable_fixed_price_subscriptions: boolean;
  enable_order_discovery_from_payments: boolean;
  enable_order_handshake: boolean;
  enable_spreedly_global_three_d_s: boolean;
  enable_transaction_routing_rules: boolean;
  environment_id: number;
  expiring_card_email_days_ahead: number;
  expiring_card_email_time: string;
  feature_flags: string[];
  from_email_name: string;
  from_email_use_dkim_domain: boolean;
  from_email: string;
  fulfillment_threshold_days: number;
  group_subscription_template_user_defined_field_definitions: JSONArray;
  group_subscription_user_defined_field_definitions: JSONArray;
  id: number;
  is_sandbox: boolean;
  locale: string;
  magento_admin_url: string;
  magento_api_url: string;
  magento_api_username: string;
  magento_store_code: string;
  magento2_api_clean_quote: boolean;
  magento2_api_signing_algorithm: string;
  magento2_extension_version: string;
  notification_email_recipients: string;
  order_generation_api_mode: string;
  order_generation_concurrency: number;
  order_generation_free_payment_mode: string;
  order_generation_max_reward_points: number;
  order_generation_partial_order_mode: string;
  order_generation_retry_rules: OrderGenerationRetryRule[];
  order_generation_shipping_method_mode: string;
  order_generation_store_mode: string;
  order_generation_subscription_grouping_mode: string;
  order_generation_time: string;
  order_generation_use_reward_points: boolean;
  order_generation_user_defined_field_grouping_rules: JSONArray;
  pass_billing_address_in_payment_transactions: boolean;
  payment_vault: PaymentVault | string;
  product_user_defined_field_definitions: JSONArray;
  recurring_eci_mode: string;
  sandbox_catchall_email: string;
  sandbox_transaction_delay_max_time: number;
  sandbox_transaction_delay_min_time: number;
  sandbox_transaction_delay: boolean;
  sca_test_scenario: string;
  sfcc_ocapi_payment_method_id: string;
  sfcc_ocapi_use_customer_payment_instrument_id: boolean;
  sp_vault_api_key_id: string;
  sp_vault_api_key_secret: string;
  sp_vault_environment_id: string;
  store_name: string;
  stored_credentials_mode: string;
  subscription_order_failed_email_first_time_only: boolean;
  subscription_updated_email_grouping: string;
  subscription_user_defined_field_definitions: JSONArray;
  timezone: string;
  trial_conversion_email_time: string;
  upcoming_subscription_email_days_ahead: number;
  upcoming_subscription_email_time: string;
  updated: string;
  use_default_scheduling_rule: boolean;
  user_defined_field_definitions: JSONArray;
};

export class ConfigService extends ResourceServiceBase<ConfigType, never> {
  resourceName() { return "config"; }
  collectionName() { return "config"; }
  collectionPath() { return "/services/v2/config" };
  singularPath() { return "/services/v2/config" }
  resourcePath({id:_id}:{id:string|number}) { return "" };

  async get({client}:{client?: Client}): Promise<ConfigType | null> {
    client ||= SubscribePro.client;

    const response = await client.request({
      method: 'GET',
      path: this.singularPath(),
    }) || {};
    return this.processJSONToRecord(response);
  }
}

export const Config = new ConfigService()
export default Config;
