import SubscribePro, { Client } from "../..";

describe("SubscribePro.V3.SchedulingRules", () => {
  let client: Client;
  let mockRequest: jest.Mock;
  
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    mockRequest = jest.fn<Promise<any>, [any]>();
    client.request = mockRequest;
  });

  test("findById retrieves a scheduling rule", async () => {
    await SubscribePro.V3.SchedulingRules.findById({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/scheduling-rules/1",
      method: "GET",
    });
  });

  test("findAll retrieves all scheduling rules", async () => {
    await SubscribePro.V3.SchedulingRules.findAll({client, params: {page: 1}});
    expect(client.request).toHaveBeenCalledWith({
      path: "/scheduling-rules?page=1",
      method: "GET",
    });
  });

});
