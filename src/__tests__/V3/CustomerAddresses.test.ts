import SubscribePro, { Client } from "../..";

describe("SubscribePro.V3.CustomerAddresses", () => {
  let client: Client;
  
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    client.request = jest.fn<Promise<any>, [any]>();
  });

  test("findById retrieves a customer", async () => {
    await SubscribePro.V3.CustomerAddresses.findById({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/customer-addresses/1",
      method: "GET",
    });
  });

  test("findAll retrieves all customers", async () => {
    await SubscribePro.V3.CustomerAddresses.findAll({client});
    expect(client.request).toHaveBeenCalledWith({
      path: "/customer-addresses",
      method: "GET",
    });
  });

  test("create creates a customer", async () => {
    const address = {customerId: 123, firstName: "Test", lastName: "User", street1: "123 Main St."};
    await SubscribePro.V3.CustomerAddresses.create({client, data: address});
    expect(client.request).toHaveBeenCalledWith({
      path: "/customer-addresses",
      method: "POST",
      body: JSON.stringify(address),
    });
  });

  test("update updates a customer", async () => {
    const address = {customerId: 123, firstName: "Test", lastName: "User", street1: "123 Main St."};
    await SubscribePro.V3.CustomerAddresses.update({client, id: 1, data: address});
    expect(client.request).toHaveBeenCalledWith({
      path: "/customer-addresses/1",
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify(address),
    });
  });

  test("delete deletes a customer", async () => {
    await SubscribePro.V3.CustomerAddresses.delete({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/customer-addresses/1",
      method: "DELETE",
    });
  });
});
