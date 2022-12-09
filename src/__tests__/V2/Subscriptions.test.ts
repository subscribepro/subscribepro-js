import SubscribePro, { Client } from "../..";
import { JSONPatchData } from "../../V2/ResourceServiceBase";

describe("SubscribePro.V2.Subscriptions", () => {
  let client: Client;
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    client.request = jest.fn<Promise<any>, [any]>();
  });

  test("getOne retrieves a subscription", async () => {
    await SubscribePro.V2.Subscriptions.getOne({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/subscriptions/1",
      method: "GET",
    });
  });

  test("getAll retrieves all subscriptions", async () => {
    await SubscribePro.V2.Subscriptions.getAll({client});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/subscriptions",
      method: "GET",
    });
  });

  test("getAll with search retrieves all subscriptions with sku", async () => {
    await SubscribePro.V2.Subscriptions.getAll({client, params: {customer_id: "12345"}});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/subscriptions?customer_id=12345",
      method: "GET",
    });
  });

  test("createOne creates a subscription", async () => {
    const subscription = {
      customer_id: "12345",
      billing_address: { first_name: "John", last_name: "Doe", },
      requires_shipping: false,
      shipping_address: { first_name: "John", last_name: "Doe", },
      product_sku: "SKU",
      qty: 1,
      next_order_date: "2023-01-01",
    };
    await SubscribePro.V2.Subscriptions.createOne({client, data: subscription});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/subscription",
      method: "POST",
      body: JSON.stringify({subscription}),
    });
  });

  test("createAll creates a subscription", async () => {
    const subscriptions = [{
      customer_id: "12345",
      billing_address: { first_name: "John", last_name: "Doe", },
      requires_shipping: false,
      shipping_address: { first_name: "John", last_name: "Doe", },
      product_sku: "SKU",
      qty: 1,
      next_order_date: "2023-01-01",
    }];
    await SubscribePro.V2.Subscriptions.createAll({client, data: subscriptions});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/subscriptions",
      method: "POST",
      body: JSON.stringify({subscriptions}),
    });
  });

  test("updateOne updates a subscription", async () => {
    const subscription = {
      billing_address: { first_name: "John", last_name: "Doe", },
      requires_shipping: false,
      shipping_address: { first_name: "John", last_name: "Doe", },
    };
    const _meta = { changed_by: { admin: { user_id: '1' } } };
    await SubscribePro.V2.Subscriptions.updateOne({client, id: 1, data: {_meta, ...subscription}});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/subscriptions/1",
      method: "POST",
      body: JSON.stringify({subscription, _meta}),
    });
  });

  test("patchOne updates a subscription", async () => {
    const patch:JSONPatchData = {op: "replace", path: "/name", value: "Subscription"};
    await SubscribePro.V2.Subscriptions.patchOne({client, id: 1234, data: patch});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/subscriptions/1234",
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  });

  test("patchAll updates a subscription", async () => {
    const patch:JSONPatchData = {op: "replace", ids: ["1234"], path: "/name", value: "Subscription"};
    await SubscribePro.V2.Subscriptions.patchAll({client, data: [patch]});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/subscriptions",
      method: "PATCH",
      body: JSON.stringify([patch]),
    });
  });

  test("cancel cancels a subscription", async () => {
    await SubscribePro.V2.Subscriptions.cancel({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/subscriptions/1/cancel",
      method: "POST",
    });
  });

  test("pause pauses a subscription", async () => {
    await SubscribePro.V2.Subscriptions.pause({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/subscriptions/1/pause",
      method: "POST",
    });
  });

  test("restart restarts a subscription", async () => {
    await SubscribePro.V2.Subscriptions.restart({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/subscriptions/1/restart",
      method: "POST",
    });
  });

  test("skip skips a subscription", async () => {
    await SubscribePro.V2.Subscriptions.skip({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/subscriptions/1/skip",
      method: "POST",
    });
  });

  test("upcomingOrderDates gets a subscription's upcoming order dates", async () => {
    await SubscribePro.V2.Subscriptions.upcomingOrderDates({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/subscriptions/1/upcoming-order-dates",
      method: "GET",
    });
  });
});
