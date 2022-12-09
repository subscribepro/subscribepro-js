import SubscribePro, { Client } from "../../";

describe("SubscribePro.V2.Customers", () => {
  let client: Client;
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    client.request = jest.fn<Promise<any>, [any]>();
  });

  test("getOne retrieves a customer", async () => {
    await SubscribePro.V2.Customers.getOne({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/customers/1",
      method: "GET",
    });
  });

  test("getAll retrieves all customers", async () => {
    await SubscribePro.V2.Customers.getAll({client});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/customers",
      method: "GET",
    });
  });

  test("getAll with params retrieves all customers with filter", async () => {
    await SubscribePro.V2.Customers.getAll({client, params: { email: "test@example.com" }});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/customers?email=test%40example.com",
      method: "GET",
    });
  });

  test("createOne creates a customer", async () => {
    const customer = {email: "test@example.com", first_name: "First", last_name: "Last"};
    await SubscribePro.V2.Customers.createOne({client, data: customer});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/customer",
      method: "POST",
      body: JSON.stringify({customer}),
    });
  });

  test("updateOne updates a customer", async () => {
    const customer = {email: "test@example.com", first_name: "First", last_name: "Last"};
    await SubscribePro.V2.Customers.updateOne({client, id: 1, data: customer});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/customers/1",
      method: "POST",
      body: JSON.stringify({customer}),
    });
  });
});
