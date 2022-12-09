import SubscribePro, { Client } from "../..";

describe("SubscribePro.V2.Config", () => {
  let client: Client;
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    client.request = jest.fn<Promise<any>, [any]>();
  });

  test("getOne retrieves an address", async () => {
    await SubscribePro.V2.Config.get({client});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/config",
      method: "GET",
    });
  });
});
