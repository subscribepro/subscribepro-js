import SubscribePro, { Client } from "../..";

describe("SubscribePro.V3.ProductConfigurationProfiles", () => {
  let client: Client;
  let mockRequest: jest.Mock;
  
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    mockRequest = jest.fn<Promise<any>, [any]>();
    client.request = mockRequest;
  });

  test("findById retrieves a product configuration profile", async () => {
    await SubscribePro.V3.ProductConfigurationProfiles.findById({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/product-configuration-profiles/1",
      method: "GET",
    });
  });

  test("findAll retrieves all product configuration profiles", async () => {
    await SubscribePro.V3.ProductConfigurationProfiles.findAll({client, params: {page: 1}});
    expect(client.request).toHaveBeenCalledWith({
      path: "/product-configuration-profiles?page=1",
      method: "GET",
    });
  });

});
