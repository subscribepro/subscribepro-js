import Client from "./Client";

export type Config = {
  endpointUrl?: string;
  accessToken: string;
  environmentKey: string;
};

export class SubscribePro {
  private static _client: Client;
  private static _config: Config & { endpointUrl: string } = {
    endpointUrl: 'https://api.subscribepro.com',
    accessToken: '',
    environmentKey: '',
  };

  static get client() {
    return SubscribePro._client;
  }
  static get config() {
    return SubscribePro._config;
  }

  static configure(config: Config) {
    SubscribePro._config = {...SubscribePro.config, ...config};
    this._client = new Client({endpointUrl: SubscribePro.config.endpointUrl, accessToken: SubscribePro.config.accessToken});
  }
};

export default SubscribePro;
