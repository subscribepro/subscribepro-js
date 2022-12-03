export class ClientError extends Error {
  status: number;
  statusText: string;
  response: string;

  constructor(status: number, statusText: string, response: string) {
    super(`${status} ${statusText} -- ${JSON.stringify(response)}`);
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
};

export default ClientError;
