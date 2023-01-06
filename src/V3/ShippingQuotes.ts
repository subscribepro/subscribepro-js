import Client from "../Client";
import SubscribePro from "../SubscribePro";

type ShippingQuoteType = {
  id: string;
  carrierCode: string;
  carrierName: string;
  shippingMethodCode: string;
  shippingMethodName: string;
  shippingMethodDescription: string;
  shippingPrice: string;
};

type ShippingQuotesSearchParams = {
  page?: number;
  itemsPerPage?: number;
};

class ShippingQuotesService {
  async findByCartId({client, cartId, params}: {client?: Client, cartId: number, params?:ShippingQuotesSearchParams}): Promise<ShippingQuoteType[]|null> {
    client ||= SubscribePro.client;
    let path = `/carts/${cartId}/shipping-quotes`;
    if (params) {
      const searchParams = new URLSearchParams()
      if (params['page']) searchParams.append('page', String(params['page']));
      if (params['itemsPerPage']) searchParams.append('itemsPerPage', String(params['itemsPerPage']));
      
      path = `${path}?${searchParams.toString()}`;
    }

    const result = await client.request({
      path,
      method: "GET",
    })
    return result as ShippingQuoteType[] | null;
  }

  async findById({client, id}: {client?: Client, id: number}): Promise<ShippingQuoteType|null> {
    client ||= SubscribePro.client;
    const result = await client.request({
      path: `/shipping-quotes/${id}`,
      method: "GET",
    });
    return result as ShippingQuoteType | null;
  }
}

export const ShippingQuotes = new ShippingQuotesService();
export default ShippingQuotes;