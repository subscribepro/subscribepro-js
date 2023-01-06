import SubscribePro, { Client } from "../..";

describe("SubscribePro.V3.Customers", () => {
  let client: Client;
  
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    client.request = jest.fn<Promise<any>, [any]>();
  });

  test("findById retrieves a customer", async () => {
    await SubscribePro.V3.Customers.findById({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/customers/1",
      method: "GET",
    });
  });

  test("me retrieves a customer", async () => {
    await SubscribePro.V3.Customers.me({client});
    expect(client.request).toHaveBeenCalledWith({
      path: "/customers/me",
      method: "GET",
    });
  });

  test("findAll retrieves all customers", async () => {
    await SubscribePro.V3.Customers.findAll({client});
    expect(client.request).toHaveBeenCalledWith({
      path: "/customers",
      method: "GET",
    });
  });

  test("create creates a customer", async () => {
    const customer = {email: "test@example.com", firstName: "Test", lastName: "User"};
    await SubscribePro.V3.Customers.create({client, data: customer});
    expect(client.request).toHaveBeenCalledWith({
      path: "/customers",
      method: "POST",
      body: JSON.stringify(customer),
    });
  });

  test("update updates a customer", async () => {
    const customer = {email: "test@example.com", firstName: "Test", lastName: "User"};
    await SubscribePro.V3.Customers.update({client, id: 1, data: customer});
    expect(client.request).toHaveBeenCalledWith({
      path: "/customers/1",
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify(customer),
    });
  });

  test("delete deletes a customer", async () => {
    await SubscribePro.V3.Customers.delete({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/customers/1",
      method: "DELETE",
    });
  });
});
