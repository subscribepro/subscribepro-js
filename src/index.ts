export type Config = {
  endpointUrl?: string;
  accessToken: string;
  environmentKey: string;
};

export class SubscribePro {
  static config: Config & { endpointUrl: string } = {
    endpointUrl: 'https://api.subscribepro.com',
    accessToken: '',
    environmentKey: '',
  };

  static configure(config: Config) {
    SubscribePro.config = {...SubscribePro.config, ...config};
  }
};

export default SubscribePro;
