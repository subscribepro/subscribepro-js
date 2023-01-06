import 'cross-fetch/polyfill';
import ClientError from './ClientError';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type SimpleHeaders = Record<string, string>;

export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export type JSONArray = JSONValue[];
export type JSONObject = { [member: string]: JSONValue };

export class Client {
  endpointUrl: string;
  accessToken: string;

  constructor({endpointUrl, accessToken}: {endpointUrl: string, accessToken: string}) {
    this.endpointUrl = endpointUrl;
    this.accessToken = accessToken;
  }

  mergeHeaders(headers: SimpleHeaders) {
    return new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(this.accessToken ? {'Authorization': `Bearer ${this.accessToken}`} : {}),
      ...headers,
    });
  }

  request = async ({method, path, headers, body}: {method: HTTPMethod, path: string, headers?: SimpleHeaders, body?: BodyInit}) => {
    const response = await fetch(`${this.endpointUrl}${path}`, {
      method,
      headers: this.mergeHeaders(headers || {}),
      body,
    });
    if (response.ok) {
      if (response.status == 204) {
        return null;
      } else {
        return await response.json() as JSONObject;
      }
    }
    throw new ClientError(response.status, response.statusText, await response.text());
  }
}

export default Client;
