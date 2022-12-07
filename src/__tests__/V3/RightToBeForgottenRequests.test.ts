import SubscribePro, { Client } from "../..";

describe("SubscribePro.V3.RightToBeForgottenRequests", () => {
  let client: Client;
  let mockRequest: jest.Mock;
  
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    mockRequest = jest.fn<Promise<any>, [any]>();
    client.request = mockRequest;
  });

  test("findById retrieves a right to be forgotten request", async () => {
    await SubscribePro.V3.RightToBeForgottenRequests.findById({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/right-to-be-forgotten-requests/1",
      method: "GET",
    });
  });

  test("findAll retrieves all right to be forgotten requests", async () => {
    await SubscribePro.V3.RightToBeForgottenRequests.findAll({client, params: {page: 1}});
    expect(client.request).toHaveBeenCalledWith({
      path: "/right-to-be-forgotten-requests?page=1",
      method: "GET",
    });
  });

  test("create creates a right to be forgotten request", async () => {
    const rtbfr = {email: "test@example.com"};
    await SubscribePro.V3.RightToBeForgottenRequests.create({client, data: rtbfr});
    expect(client.request).toHaveBeenCalledWith({
      path: "/right-to-be-forgotten-requests",
      method: "POST",
      body: JSON.stringify(rtbfr),
    });
  });
});
