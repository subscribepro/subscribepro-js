import SubscribePro, { Client } from "../..";

describe("SubscribePro.V3.Subscriptions", () => {
  let client: Client;
  let mockRequest: jest.Mock;
  
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    mockRequest = jest.fn<Promise<any>, [any]>();
    client.request = mockRequest;
  });

  test("findById retrieves a subscription", async () => {
    await SubscribePro.V3.Subscriptions.findById({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/subscriptions/1",
      method: "GET",
    });
  });

  test("findAll retrieves all subscriptions", async () => {
    await SubscribePro.V3.Subscriptions.findAll({client, params: {status: "active"}});
    expect(client.request).toHaveBeenCalledWith({
      path: "/subscriptions?status=active",
      method: "GET",
    });
  });

  test("findAll retrieves all subscriptions with properties", async () => {
    const properties = {"": ["propertyName", "anotherPropertyName"], "nestedPropertyParent": ["nestedProperty"]}
    await SubscribePro.V3.Subscriptions.findAll({client, params: {properties}});
    const callArgs = mockRequest.mock.calls[0] as Record<string, any>[];
    expect(callArgs).toHaveLength(1);
    expect(callArgs[0]["method"]).toBe("GET");
    expect(callArgs[0]["path"]).toMatch("/subscriptions?");
    expect(callArgs[0]["path"]).toMatch(encodeURI("properties[]=propertyName"));
    expect(callArgs[0]["path"]).toMatch(encodeURI("properties[]=anotherPropertyName"));
    expect(callArgs[0]["path"]).toMatch(encodeURI("properties[nestedPropertyParent][]=nestedProperty"));
  });

  test("findAll retrieves all subscriptions with userDefinedFields", async () => {
    const userDefinedFields = {"test": "value", "test2": "anotherValue"}
    await SubscribePro.V3.Subscriptions.findAll({client, params: {userDefinedFields}});
    const callArgs = mockRequest.mock.calls[0] as Record<string, any>[];
    expect(callArgs).toHaveLength(1);
    expect(callArgs[0]["method"]).toBe("GET");
    expect(callArgs[0]["path"]).toMatch("/subscriptions?");
    expect(callArgs[0]["path"]).toMatch(encodeURI("userDefinedFields.test=value"));
    expect(callArgs[0]["path"]).toMatch(encodeURI("userDefinedFields.test2=anotherValue"));
  });

  test("update updates a subscription", async () => {
    const subscription = {qty: "22"};
    await SubscribePro.V3.Subscriptions.update({client, id: 1, data: subscription});
    expect(client.request).toHaveBeenCalledWith({
      path: "/subscriptions/1",
      method: "PATCH",
      headers: { "Content-Type": "application/merge-patch+json" },
      body: JSON.stringify(subscription),
    });
  });
});
