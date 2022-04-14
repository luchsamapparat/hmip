import { Authentication, getCurrentState, getHost } from '@hmip/client';

const accessPointSgtin = '';
const pin = '';
const deviceName = '';
const deviceId = '';
const authToken = '';
const clientId = '';

(async () => {
  const { http } = await getHost(accessPointSgtin);

  const authentication = new Authentication(http, deviceId, deviceName, accessPointSgtin, pin);
  const clientAuthToken = await authentication.getClientAuthToken();
  // const { authToken, clientId } = await authentication.connect(clientAuthToken);

  const currentState = await getCurrentState(http, accessPointSgtin, authToken, clientAuthToken);

  const { humidity, actualTemperature } = currentState.groups['14d4ff55-b3e4-4254-a2d6-8a17af0469ec'];

  console.log({ humidity, actualTemperature });
})();
