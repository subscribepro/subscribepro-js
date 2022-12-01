import 'cross-fetch/polyfill';
import ClientError from './ClientError';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type SimpleHeaders = Record<string, string>;

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

  async request({method, path, headers, body}: {method: HTTPMethod, path: string, headers?: SimpleHeaders, body?: BodyInit}) {
    const response = await fetch(`${this.endpointUrl}${path}`, {
      method,
      headers: this.mergeHeaders(headers || {}),
      body,
    });
    const json = await response.json();
    if (response.ok) {
      return json;
    }
    throw new ClientError(response.status, response.statusText, json);
  }
}

export default Client;
