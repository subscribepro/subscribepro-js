import SubscribePro, { Client } from "../..";

describe("SubscribePro.V2.Addresses", () => {
  let client: Client;
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    client.request = jest.fn<Promise<any>, [any]>();
  });

  test("getOne retrieves an address", async () => {
    await SubscribePro.V2.Addresses.getOne({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/addresses/1",
      method: "GET",
    });
  });

  test("getAll retrieves all addresses", async () => {
    await SubscribePro.V2.Addresses.getAll({client});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/addresses",
      method: "GET",
    });
  });

  test("getAll with search retrieves all addresses with customer_id", async () => {
    await SubscribePro.V2.Addresses.getAll({client, params: {customer_id: "1"}});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/addresses?customer_id=1",
      method: "GET",
    });
  });

  test("createOne creates an address", async () => {
    const address = {customer_id: "123345", first_name: "First", last_name: "Last"};
    await SubscribePro.V2.Addresses.createOne({client, data: address});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/address",
      method: "POST",
      body: JSON.stringify({address}),
    });
  });

  test("findOrCreate find-or-creates an address", async () => {
    const address = {customer_id: "123345", first_name: "First", last_name: "Last"};
    await SubscribePro.V2.Addresses.findOrCreate({client, data: address});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/address/find_or_create",
      method: "POST",
      body: JSON.stringify({address}),
    });
  });

  test("updateOne updates an address", async () => {
    const address = {first_name: "First", last_name: "Last"};
    await SubscribePro.V2.Addresses.updateOne({client, id: 1, data: address});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/addresses/1",
      method: "POST",
      body: JSON.stringify({address}),
    });
  });

  test("delete deletes an address", async () => {
    await SubscribePro.V2.Addresses.delete({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/addresses/1",
      method: "DELETE",
    });
  });
});
