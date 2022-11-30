import { Client, ClientError } from '../';

describe('Client', () => {
  it('should be defined', () => {
    expect(Client).toBeDefined();
  });

  it('should configure endpointUrl and accessToken when initialized', () => {
    let client = new Client({endpointUrl: 'https://api.subscribepro.com', accessToken: 'ACCESS'});
    expect(client.endpointUrl).toBe('https://api.subscribepro.com');
    expect(client.accessToken).toBe('ACCESS');
  });

  describe('mergeHeaders', () => {
    it('should merge headers', () => {
      let client = new Client({endpointUrl: 'https://api.subscribepro.com', accessToken: 'ACCESS'});
      let headers = client.mergeHeaders({
        'X-Test': 'test',
      });
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('Accept')).toBe('application/json');
      expect(headers.get('Authorization')).toBe('Bearer ACCESS');
      expect(headers.get('X-Test')).toBe('test');
    });
  });

  describe('request', () => {
    it('should make a request', async () => {
      let client = new Client({endpointUrl: 'https://api.subscribepro.com', accessToken: 'ACCESS'});
      let mockHeaders = jest.fn();
      let mockReturnValue = jest.fn();
      client.mergeHeaders = jest.fn().mockReturnValue(mockHeaders);
      global.fetch = jest.fn((url, init) => {
        let {method, headers, body, ..._} = init || {};
        expect(url).toBe('https://api.subscribepro.com/v1/customers');
        expect(method).toBe('GET');
        expect(headers).toBe(mockHeaders);
        expect(body).toBeUndefined();
        return Promise.resolve({
          url, ok: true, status: 200, statusText: 'OK',
          json: () => Promise.resolve(mockReturnValue),
        } as Response);
      });

      let response = await client.request({path: '/v1/customers', method: 'GET'});
      expect(response).toBe(mockReturnValue);
    });

    it('should throw an error when response is not ok', async () => {
      let client = new Client({endpointUrl: 'https://api.subscribepro.com', accessToken: 'ACCESS'});
      let mockHeaders = jest.fn();
      let mockReturnValue = {title: 'ERROR'};
      client.mergeHeaders = jest.fn().mockReturnValue(mockHeaders);
      global.fetch = jest.fn((url, init) => {
        let {method, headers, body, ..._} = init || {};
        expect(url).toBe('https://api.subscribepro.com/v1/customers');
        expect(method).toBe('GET');
        expect(headers).toBe(mockHeaders);
        expect(body).toBeUndefined();
        return Promise.resolve({
          url, ok: false, status: 400, statusText: 'Bad Request',
          json: () => Promise.resolve(mockReturnValue),
        } as Response);
      });

      await expect(async () => {
        await client.request({path: '/v1/customers', method: 'GET'});
      }).rejects.toThrowError(new ClientError(400, 'Bad Request', mockReturnValue));
    });
  });
});
