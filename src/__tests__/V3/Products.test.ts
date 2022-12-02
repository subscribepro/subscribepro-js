import SubscribePro, { Client } from "../../";

describe("SubscribePro.V3.Products", () => {
  let client: Client;
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    client.request = jest.fn<Promise<any>, [any]>();
  });

  test("findById retrieves a product", async () => {
    await SubscribePro.V3.Products.findById({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/products/1",
      method: "GET",
    });
  });

  test("findAll retrieves all products", async () => {
    await SubscribePro.V3.Products.findAll({client});
    expect(client.request).toHaveBeenCalledWith({
      path: "/products",
      method: "GET",
    });
  });

  test("create creates a product", async () => {
    let product = {name: "Product", sku: "SKU", price: 1.0};
    await SubscribePro.V3.Products.create({client, data: product});
    expect(client.request).toHaveBeenCalledWith({
      path: "/products",
      method: "POST",
      body: JSON.stringify(product),
    });
  });

  test("update updates a product", async () => {
    let product = {name: "Product", sku: "SKU", price: 1.0};
    await SubscribePro.V3.Products.update({client, id: 1, data: product});
    expect(client.request).toHaveBeenCalledWith({
      path: "/products/1",
      method: "PATCH",
      body: JSON.stringify(product),
    });
  });

  test("delete deletes a product", async () => {
    await SubscribePro.V3.Products.delete({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/products/1",
      method: "DELETE",
    });
  });
});
