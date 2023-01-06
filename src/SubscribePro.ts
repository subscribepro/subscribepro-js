import Client from "./Client";
import V2 from "./V2";
import V3 from "./V3";

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

  static V2 = V2;
  static V3 = V3;

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
