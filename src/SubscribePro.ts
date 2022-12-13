import Client from "./Client";
import V2 from "./V2";
import V3 from "./V3";

export type Config = {
  endpointUrl?: string;
  accessToken: string;
  environmentKey: string;
};

/**
 * Namespace for all SubscribePro API calls.
 */
export class SubscribePro {

  private static _client: Client;
  private static _config: Config & { endpointUrl: string } = {
    endpointUrl: 'https://api.subscribepro.com',
    accessToken: '',
    environmentKey: '',
  };

  /**
   * Namespace for the V2 SubscribePro API calls.
   */
  static V2 = V2;

  /**
   * Namespace for the V3 SubscribePro API calls.
   */
  static V3 = V3;

  /**
   * This instance is pre-configured with the endpoint URL and access token and
   * will be used by default for all API calls.
   * 
   * @returns The client used to make API calls. 
   */
  static get client() {
    return SubscribePro._client;
  }

  /**
   * The configuration used to create the client.
   * 
   * @returns The configuration including endpoint URL and access token.
   */
  static get config() {
    return SubscribePro._config;
  }

  /**
   * Stores the configuration and iniitalizes the client with this
   * configuration.
   * 
   * @param config - The configuration to use for the client. This should
   * include the `endpointURL` and `accessToken`.
   */
  static configure(config: Config) {
    SubscribePro._config = {...SubscribePro.config, ...config};
    this._client = new Client({endpointUrl: SubscribePro.config.endpointUrl, accessToken: SubscribePro.config.accessToken});
  }
};

export default SubscribePro;
