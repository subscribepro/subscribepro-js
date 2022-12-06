import SubscribePro, { Client } from "../../";
import { JSONPatchData } from "../../V2/ResourceServiceBase";

describe("SubscribePro.V2.Products", () => {
  let client: Client;
  beforeEach(() => {
    client = new Client({ endpointUrl: "https://api.subscribepro.com", accessToken: "ACCESS" });
    client.request = jest.fn<Promise<any>, [any]>();
  });

  test("getOne retrieves a product", async () => {
    await SubscribePro.V2.Products.getOne({client, id: 1});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/products/1",
      method: "GET",
    });
  });

  test("getAll retrieves all products", async () => {
    await SubscribePro.V2.Products.getAll({client});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/products",
      method: "GET",
    });
  });

  test("createOne creates a product", async () => {
    const product = {name: "Product", sku: "SKU", price: "1.00"};
    await SubscribePro.V2.Products.createOne({client, data: product});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/product",
      method: "POST",
      body: JSON.stringify({product}),
    });
  });

  test("createAll creates a product", async () => {
    const products = {
      products: [ {name: "Product", sku: "SKU", price: "1.00"} ]
    };
    await SubscribePro.V2.Products.createAll({client, data: products});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/products",
      method: "POST",
      body: JSON.stringify({products}),
    });
  });

  test("updateOne updates a product", async () => {
    const product = {name: "Product", sku: "SKU", price: "1.00"};
    await SubscribePro.V2.Products.updateOne({client, id: 1, data: product});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/products/1",
      method: "POST",
      body: JSON.stringify({product}),
    });
  });

  test("patchOne updates a product", async () => {
    const patch:JSONPatchData = {op: "replace", path: "/name", value: "Product"};
    await SubscribePro.V2.Products.patchOne({client, id: 1234, data: patch});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/products/1234",
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  });

  test("patchAll updates a product", async () => {
    const patch:JSONPatchData = {op: "replace", ids: ["1234"], path: "/name", value: "Product"};
    await SubscribePro.V2.Products.patchAll({client, data: [patch]});
    expect(client.request).toHaveBeenCalledWith({
      path: "/services/v2/products",
      method: "PATCH",
      body: JSON.stringify([patch]),
    });
  });
});
