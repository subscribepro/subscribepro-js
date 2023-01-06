import SubscribePro, { Client } from "../../";

describe("SubscribePro.V3.ShippingQuotes", () => {
  let client: Client;

  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    client.request = jest.fn<Promise<any>, [any]>();
  });

  test("findByCartId retrieves shipping quotes", async () => {
    await SubscribePro.V3.ShippingQuotes.findByCartId({client, cartId: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/carts/1/shipping-quotes",
      method: "GET",
    });
  });

  test("findByCartId is params retrieves shipping quotes", async () => {
    await SubscribePro.V3.ShippingQuotes.findByCartId({client, cartId: 1, params: {page: 1}});

    expect(client.request).toHaveBeenCalledWith({
      path: "/carts/1/shipping-quotes?page=1",
      method: "GET",
    });
  });

  test("findById retrieves a shipping quote", async () => {
    await SubscribePro.V3.ShippingQuotes.findById({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/shipping-quotes/1",
      method: "GET",
    });
  });
});
