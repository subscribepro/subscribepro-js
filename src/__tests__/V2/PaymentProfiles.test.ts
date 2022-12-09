import SubscribePro, { Client } from "../..";

describe("SubscribePro.V2.PaymentProfiles", () => {
  let client: Client;
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    client.request = jest.fn<Promise<any>, [any]>();
  });

  test("getOne retrieves a payment profile", async () => {
    await SubscribePro.V2.PaymentProfiles.getOne({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/vault/paymentprofiles/1",
      method: "GET",
    });
  });

  test("getAll retrieves all payment profiles", async () => {
    await SubscribePro.V2.PaymentProfiles.getAll({client});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/vault/paymentprofiles",
      method: "GET",
    });
  });

  test("getAll with params retrieves all payment profiles with filter", async () => {
    await SubscribePro.V2.PaymentProfiles.getAll({client, params: { customer_email: "test@example.com" }});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/vault/paymentprofiles?customer_email=test%40example.com",
      method: "GET",
    });
  });

  test("updateOne updates a payment profile", async () => {
    const payment_profile = {creditcard_year: "2024"};
    await SubscribePro.V2.PaymentProfiles.updateOne({client, id: 1, data: payment_profile});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/vault/paymentprofiles/1",
      method: "POST",
      body: JSON.stringify({payment_profile}),
    });
  });

  test("createApplePay creates an Apple Pay payment profile", async () => {
    const payment_profile = {customer_id: "12345", applepay_payment_data: {}};
    await SubscribePro.V2.PaymentProfiles.createApplePay({client, data: payment_profile});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/vault/paymentprofile/applepay",
      method: "POST",
      body: JSON.stringify({payment_profile}),
    });
  });

  test.todo("createApplePayToken creates an Apple Pay token")//, async () => {
    // const payment_profile = {email: "test@example.com", first_name: "First", last_name: "Last"};
    // await SubscribePro.V2.PaymentProfiles.createApplePayToken({client, data: payment_profile});
    // expect(client.request).toHaveBeenCalledWith({
    //   path: "/services/v2/vault/token/applepay",
    //   method: "POST",
    //   body: JSON.stringify({payment_profile}),
    // });
  //});

  test.todo("createSFCCApplePayAuthorizeAndStore creates an SFCC Apple Pay Authroize and Store payment profile")//, async () => {
    // const payment_profile = {email: "test@example.com", first_name: "First", last_name: "Last"};
    // await SubscribePro.V2.PaymentProfiles.createSFCCApplePayAuthorizeAndStore({client, data: payment_profile});
    // expect(client.request).toHaveBeenCalledWith({
    //   path: "/services/v2/vault/paymentprofile/applepay",
    //   method: "POST",
    //   body: JSON.stringify({payment_profile}),
    // });
  //});

  test("createBankAccount creates a bank account payment profile", async () => {
    const payment_profile = {
      customer_id: "12345", bank_routing_number: "021000021", bank_account_number: "1234567890",
      bank_account_type: "checking" as const,
      bank_account_holder_type: "personal" as const,
    };
    await SubscribePro.V2.PaymentProfiles.createBankAccount({client, data: payment_profile});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/vault/paymentprofile/bankaccount",
      method: "POST",
      body: JSON.stringify({payment_profile}),
    });
  });

  test("createCreditCard creates a credit card payment profile", async () => {
    const payment_profile = {
      customer_id: "12345", creditcard_number: "4111111111111111", creditcard_month: "12", creditcard_year: "2024",
    };
    await SubscribePro.V2.PaymentProfiles.createCreditCard({client, data: payment_profile});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/vault/paymentprofile/creditcard",
      method: "POST",
      body: JSON.stringify({payment_profile}),
    });
  });

  test("createExternalVault creates an external vault payment profile", async () => {
    const payment_profile = {
      customer_id: "12345", payment_token: "54321",
    };
    await SubscribePro.V2.PaymentProfiles.createExternalVault({client, data: payment_profile});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/vault/paymentprofile/external-vault",
      method: "POST",
      body: JSON.stringify({payment_profile}),
    });
  });
});
