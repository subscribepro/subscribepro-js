import SubscribePro, { Client } from "../..";

describe("SubscribePro.V3.Environments", () => {
  let client: Client;
  
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    client.request = jest.fn<Promise<any>, [any]>();
  });

  test("findById retrieves a customer", async () => {
    await SubscribePro.V3.Environments.findById({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/environments/1",
      method: "GET",
    });
  });

  test("create creates a customer", async () => {
    const environment = {name: "Test Env"};
    await SubscribePro.V3.Environments.create({client, data: environment});
    expect(client.request).toHaveBeenCalledWith({
      path: "/environments",
      method: "POST",
      body: JSON.stringify(environment),
    });
  });

  test("update updates a customer", async () => {
    const environment = {name: "Test Env"};
    await SubscribePro.V3.Environments.update({client, id: 1, data: environment});
    expect(client.request).toHaveBeenCalledWith({
      path: "/environments/1",
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify(environment),
    });
  });
});
