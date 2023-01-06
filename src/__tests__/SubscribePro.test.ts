import SubscribePro from '../';

describe('SubscribePro', () => {
  test('SubscribePro is defined', () => {
    expect(SubscribePro).toBeDefined();
  });

  test('SubscribePro.config is defined', () => {
    expect(SubscribePro.config).toBeDefined();
  });

  test('SubscribePro.config.endpointUrl has good default', () => {
    expect(SubscribePro.config.endpointUrl).toBe('https://api.subscribepro.com');
  });

  test('config can be set', () => {
    const [accessToken, environmentKey] = ['ACCESS_TOKEN', 'ENVIRONMENT_KEY'];
    SubscribePro.configure({
      accessToken,
      environmentKey
    });
    expect(SubscribePro.config.accessToken).toBe(accessToken);
  });
});
