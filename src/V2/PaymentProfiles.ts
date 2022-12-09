import Client, { JSONObject } from '../Client';
import ResourceServiceBase, { ResourceReadable, ResourceSearchable, ResourceUpdateable } from './ResourceServiceBase'
import { AddressType } from './Addresses';
import SubscribePro from '../SubscribePro';
  
type ProfileType = "external_vault" | "spreedly_dual_vault" | "spreedly_vault";
type PaymentMethodType = "credit_card" | "third_party_token" | "apple_pay" | "android_pay" | "bank_account";
type CreditCardType = "visa" | "master" | "american_express" | "discover" | "jcb" | "diners_club" | "dankort";

type PaymentProfileType = {
  id: number;
  customer_id: string;
  magento_customer_id?: string;
  customer_email: string;
  customer_facing_name: string;
  merchant_facing_name: string;
  profile_type: ProfileType;
  payment_method_type?: PaymentMethodType;
  status: "retained" | "redacted" | "closed";
  payment_vault: string;
  gateway?: string;
  vault_specific_fields: JSONObject;
  dual_vault_mode?: "subscribe_pro" | "third_party";
  third_party_vault_type?: string;
  third_party_payment_token?: string;
  payment_token?: string;
  creditcard_type?: CreditCardType;
  creditcard_last_digits?: string;
  creditcard_month?: string;
  creditcard_year?: string;
  creditcard_first_digits?: string;
  bank_routing_number?: string;
  bank_account_last_digits?: string;
  bank_name?: string;
  bank_account_type?: string;
  bank_account_holder_type?: string;
  created: string;
  updated: string;
  three_ds_authentication_transaction_id?: string;
  billing_address?: AddressType;
  account_updater_mode?: "opt_in" | "opt_out";
  three_ds_status?: "none" | "pending_authentication" | "authenticated" | "authentication_failed";
  apple_pay_payment_data?: JSONObject;
};

type RequiredAddressFields = "first_name" | "last_name" | "street1" | "city" | "region" | "postcode" | "country";
type CreateAddressTypeForPaymentProfile = Pick<AddressType, RequiredAddressFields> & Partial<Omit<AddressType, RequiredAddressFields>>;
type CreateAddressTypeForApplePayToken = Pick<AddressType, "first_name" | "last_name"> & Partial<Omit<AddressType, "first_name" | "last_name">>;

type CreateApplePayPaymentProfileType = {
  customer_id: string;
  applepay_payment_data: JSONObject;
  test_card_number?: string;
};

type CreateBankAccountPaymentProfileType = {
  customer_id: string;
  bank_routing_number: string;
  bank_account_number: string;
  bank_account_type: "checking" | "savings";
  bank_account_holder_type: "personal" | "business";
  billing_address?: CreateAddressTypeForPaymentProfile;
};

type CreateCreditCardPaymentProfileType = {
  customer_id: string;
  creditcard_number: string;
  creditcard_verification_value?: string;
  creditcard_month: string;
  creditcard_year: string;
  billing_address?: CreateAddressTypeForPaymentProfile;
};

type CreateExternalVaultPaymentProfileType = {
  customer_id: string;
  payment_token: string;
  creditcard_number?: string;
  creditcard_verification_value?: string;
  creditcard_month?: string;
  creditcard_year?: string;
  vault_specific_fields?: JSONObject;
  billing_address?: CreateAddressTypeForPaymentProfile;
};

type UpdateSpreedlyCreditCardPaymentProfileType = {
  creditcard_month?: string;
  creditcard_year?: string;
  billing_address?: CreateAddressTypeForPaymentProfile;
};

type UpdateSpreedlyBankAccountPaymentProfileType = {
  billing_address?: CreateAddressTypeForPaymentProfile;
};

type UpdateExternalCreditCardPaymentProfileType = {
  creditcard_type?: CreditCardType;
  creditcard_month?: string;
  creditcard_year?: string;
  creditcard_last_digits?: string;
  creditcard_first_digits?: string;
  payment_token?: string;
  billing_address?: CreateAddressTypeForPaymentProfile;
};

type UpdateExternalPaymentProfileType = {
  vault_specific_fields?: JSONObject;
};

type UpdatePaymentProfileType = UpdateSpreedlyCreditCardPaymentProfileType |
                                UpdateSpreedlyBankAccountPaymentProfileType |
                                UpdateExternalCreditCardPaymentProfileType |
                                UpdateExternalPaymentProfileType;

type ApplePayTokenParams = {
  applepay_payment_data: string
  test_card_number?: string;
  email?: string;
  billing_address: CreateAddressTypeForApplePayToken;
};

type ApplePayAuthorizeAndStoreParams = {
  _v: string;
  merchant_account_id: string;
  session_id: string;
  order_no: string;
  payment: {
    payment_id: string;
    type: "ApplePay";
    amount: string;
    currency: string;
    token: string;
  };
  customer_info: { email: string };
};

type PaymentProfileSearchParams = {
  customer_id?: string;
  customer_email?: string;
  magento_customer_id?: string;
  profile_type?: Exclude<ProfileType, "external_vault">;
  payment_method_type?: PaymentMethodType;
  payment_token?: string;
  transaction_id?: string;
};

class PaymentProfilesServiceBase extends ResourceServiceBase<PaymentProfileType, PaymentProfileType[]> {
  resourceName() { return 'payment_profile'; }
  collectionName() { return 'payment_profiles'; }
  collectionPath() { return "/services/v2/vault/paymentprofiles" };
  singularPath() { return "/services/v2/vault/paymentprofile" }
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };
};

const PaymentProfilesServiceR = ResourceReadable<
  typeof PaymentProfilesServiceBase, PaymentProfileType, PaymentProfileType[]
>(
  PaymentProfilesServiceBase
);

const PaymentProfilesServiceRS = ResourceSearchable<
  typeof PaymentProfilesServiceR, PaymentProfileSearchParams, PaymentProfileType
>(
  PaymentProfilesServiceR
);

class PaymentProfilesService extends ResourceUpdateable<typeof PaymentProfilesServiceRS, PaymentProfileType, UpdatePaymentProfileType>(
  PaymentProfilesServiceRS
) {
  async createApplePay({ client, data }: { client?: Client, data: CreateApplePayPaymentProfileType }): Promise<PaymentProfileType | null> {
    client ||= SubscribePro.client;

    const response = await client.request({
      path: `${this.singularPath()}/applepay`,
      method: "POST",
      body: JSON.stringify({[this.resourceName()]: data}),
    });
    return this.processJSONToRecord(response);
  }

  async createApplePayToken({ client, data }: { client?: Client, data: ApplePayTokenParams }): Promise<null> {
    client ||= SubscribePro.client;

    await client.request({
      path: "/services/v2/vault/token/applepay",
      method: "POST",
      body: JSON.stringify({token: data}),
    });
    return null;
  }

  async createSFCCApplePayAuthorizeAndStore({ client, data }: { client?: Client, data: ApplePayAuthorizeAndStoreParams }): Promise<null> {
    client ||= SubscribePro.client;

    await client.request({
      path: "/services/v2/vault/sfcc/applepay/authorize-and-store",
      method: "POST",
      body: JSON.stringify(data),
    });
    return null;
  }

  async createBankAccount({ client, data }: { client?: Client, data: CreateBankAccountPaymentProfileType }): Promise<PaymentProfileType | null> {
    client ||= SubscribePro.client;

    const response = await client.request({
      path: `${this.singularPath()}/bankaccount`,
      method: "POST",
      body: JSON.stringify({[this.resourceName()]: data}),
    });
    return this.processJSONToRecord(response);
  }

  async createCreditCard({ client, data }: { client?: Client, data: CreateCreditCardPaymentProfileType }): Promise<PaymentProfileType | null> {
    client ||= SubscribePro.client;

    const response = await client.request({
      path: `${this.singularPath()}/creditcard`,
      method: "POST",
      body: JSON.stringify({[this.resourceName()]: data}),
    });
    return this.processJSONToRecord(response);
  }

  async createExternalVault({ client, data }: { client?: Client, data: CreateExternalVaultPaymentProfileType }): Promise<PaymentProfileType | null> {
    client ||= SubscribePro.client;

    const response = await client.request({
      path: `${this.singularPath()}/external-vault`,
      method: "POST",
      body: JSON.stringify({[this.resourceName()]: data}),
    });
    return this.processJSONToRecord(response);
  }
};

export const PaymentProfiles = new PaymentProfilesService();
export default PaymentProfiles;
