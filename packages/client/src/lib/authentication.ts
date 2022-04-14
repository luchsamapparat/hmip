import { sha512 } from './crypto';
import { post, postRequest } from './http';

export class Authentication {

  constructor(
    private httpBaseUrl: string,
    private deviceId: string,
    private deviceName: string,
    private accessPointSgtin: string,
    private pin: string
  ) { }

  public async getClientAuthToken() {
    return (await sha512(`${this.accessPointSgtin}jiLpVitHvWnIGD1yo7MA`)).toUpperCase();
  }

  public async connect(clientAuthToken: string) {
    await this.connectionRequest(clientAuthToken);
    await this.waitForRequestAcknowledged(clientAuthToken);
    const authToken = await this.requestAuthToken(clientAuthToken);
    const clientId = await this.confirmAuthToken(clientAuthToken, authToken);
    return { authToken, clientId };
  }

  private async connectionRequest(clientAuthToken: string) {
    await postRequest(
      `${this.httpBaseUrl}/hmip/auth/connectionRequest`,
      {
        deviceId: this.deviceId,
        deviceName: this.deviceName,
        sgtin: this.accessPointSgtin
      },
      {
        VERSION: '12',
        CLIENTAUTH: clientAuthToken,
        PIN: this.pin
      }
    );
  }

  private async waitForRequestAcknowledged(clientAuthToken: string) {
    return waitFor(() => this.isRequestAcknowledged(clientAuthToken));
  }

  private async isRequestAcknowledged(clientAuthToken: string) {
    const response = await postRequest(
      `${this.httpBaseUrl}/hmip/auth/isRequestAcknowledged`,
      {
        deviceId: this.deviceId
      },
      {
        VERSION: '12',
        CLIENTAUTH: clientAuthToken
      }
    );
    return response.status === 200;
  }

  public async requestAuthToken(clientAuthToken: string) {
    // TODO fix any typing
    const response = await post<any>(
      `${this.httpBaseUrl}/hmip/auth/requestAuthToken`,
      {
        deviceId: this.deviceId
      },
      {
        VERSION: '12',
        CLIENTAUTH: clientAuthToken
      }
    );


    return response.authToken;
  }

  public async confirmAuthToken(clientAuthToken: string, authToken: string) {

    // TODO fix any typing
    const response = await post<any>(
      `${this.httpBaseUrl}/hmip/auth/confirmAuthToken`,
      {
        deviceId: this.deviceId,
        authToken
      },
      {
        VERSION: '12',
        CLIENTAUTH: clientAuthToken
      }
    );


    return response.clientId;
  }

}

async function waitFor(condition: () => Promise<boolean>, interval = 2000): Promise<void> {
  console.log('🕵️ Checking condition...');
  const result = await condition();

  if (result) {
    console.log('✅ Condition is true');
    return;
  }

  console.log(`⌛ Checking again in ${interval / 1000} seconds...`);
  await new Promise(resolve => setTimeout(resolve, interval));

  return waitFor(condition, interval);
}
