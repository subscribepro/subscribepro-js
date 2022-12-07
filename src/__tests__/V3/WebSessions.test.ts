import SubscribePro, { Client } from "../..";

describe("SubscribePro.V3.WebSessions", () => {
  let client: Client;
  let mockRequest: jest.Mock;
  
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    mockRequest = jest.fn<Promise<any>, [any]>();
    client.request = mockRequest;
  });

  test("findById retrieves a web session", async () => {
    await SubscribePro.V3.WebSessions.findById({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/web-sessions/1",
      method: "GET",
    });
  });

  test("findAll retrieves all web sessions", async () => {
    await SubscribePro.V3.WebSessions.findAll({client, params: {page: 1}});
    expect(client.request).toHaveBeenCalledWith({
      path: "/web-sessions?page=1",
      method: "GET",
    });
  });

  test("create creates a web session", async () => {
    const webSession = {sessionId: "12345"};
    await SubscribePro.V3.WebSessions.create({client, data: webSession});
    expect(client.request).toHaveBeenCalledWith({
      path: "/web-sessions",
      method: "POST",
      body: JSON.stringify(webSession),
    });
  });
});
