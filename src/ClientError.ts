export class ClientError extends Error {
  status: number;
  statusText: string;
  response: any;

  constructor(status: number, statusText: string, response: any) {
    super(`${status} ${statusText} -- ${JSON.stringify(response)}`);
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
};

export default ClientError;
