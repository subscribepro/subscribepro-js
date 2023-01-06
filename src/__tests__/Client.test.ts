import { Client, ClientError } from '../';

describe('Client', () => {
  it('should be defined', () => {
    expect(Client).toBeDefined();
  });

  it('should configure endpointUrl and accessToken when initialized', () => {
    const client = new Client({endpointUrl: 'https://api.subscribepro.com', accessToken: 'ACCESS'});
    expect(client.endpointUrl).toBe('https://api.subscribepro.com');
    expect(client.accessToken).toBe('ACCESS');
  });

  describe('mergeHeaders', () => {
    it('should merge headers', () => {
      const client = new Client({endpointUrl: 'https://api.subscribepro.com', accessToken: 'ACCESS'});
      const headers = client.mergeHeaders({
        'X-Test': 'test',
      });
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('Accept')).toBe('application/json');
      expect(headers.get('Authorization')).toBe('Bearer ACCESS');
      expect(headers.get('X-Test')).toBe('test');
    });
  });

  describe('request', () => {
    it('should make a request and return the JSON', async () => {
      const client = new Client({endpointUrl: 'https://api.subscribepro.com', accessToken: 'ACCESS'});
      const mockHeaders = jest.fn();
      const mockReturnValue = {test: 'hi'};
      client.mergeHeaders = jest.fn().mockReturnValue(mockHeaders);
      global.fetch = jest.fn((url, init) => {
        const {method, headers, body} = init || {};
        expect(url).toBe('https://api.subscribepro.com/v1/customers');
        expect(method).toBe('GET');
        expect(headers).toBe(mockHeaders);
        expect(body).toBeUndefined();
        return Promise.resolve(new Response(JSON.stringify(mockReturnValue), {status: 200, statusText: 'OK'}));
      });

      const response = await client.request({path: '/v1/customers', method: 'GET'});
      expect(response).toEqual(mockReturnValue);
    });

    it('should make a request and return null', async () => {
      const client = new Client({endpointUrl: 'https://api.subscribepro.com', accessToken: 'ACCESS'});
      const mockHeaders = jest.fn();
      client.mergeHeaders = jest.fn().mockReturnValue(mockHeaders);
      global.fetch = jest.fn((url, init) => {
        const {method, headers, body} = init || {};
        expect(url).toBe('https://api.subscribepro.com/v1/customers');
        expect(method).toBe('GET');
        expect(headers).toBe(mockHeaders);
        expect(body).toBeUndefined();
        return Promise.resolve(new Response(null, {status: 204, statusText: 'No Content'}));
      });

      const response = await client.request({path: '/v1/customers', method: 'GET'});
      expect(response).toBe(null);
    });

    it('should throw an error when response is not ok', async () => {
      const client = new Client({endpointUrl: 'https://api.subscribepro.com', accessToken: 'ACCESS'});
      const mockHeaders = jest.fn();
      const mockReturnValue = {title: 'ERROR'};
      client.mergeHeaders = jest.fn().mockReturnValue(mockHeaders);
      global.fetch = jest.fn((url, init) => {
        const {method, headers, body} = init || {};
        expect(url).toBe('https://api.subscribepro.com/v1/customers');
        expect(method).toBe('GET');
        expect(headers).toBe(mockHeaders);
        expect(body).toBeUndefined();
        return Promise.resolve(
          new Response(JSON.stringify(mockReturnValue), {status: 400, statusText: 'Bad Request'})
        );
      });

      await expect(async () => {
        await client.request({path: '/v1/customers', method: 'GET'});
      }).rejects.toThrow(new ClientError(400, 'Bad Request', JSON.stringify(mockReturnValue)));
    });
  });
});
