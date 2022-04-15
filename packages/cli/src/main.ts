import { Authentication, getCurrentState, getHost } from '@hmip/client';
import 'dotenv/config';

const accessPointSgtin = process.env.ACCESS_POINT_SGTIN as string;
const pin = process.env.PIN as string;
const deviceName = process.env.DEVICE_NAME as string;
const deviceId = process.env.DEVICE_ID as string;
const authToken = process.env.AUTH_TOKEN as string;
const clientId = process.env.CLIENT_ID as string;

(async () => {
  const { http } = await getHost(accessPointSgtin);

  const authentication = new Authentication(http, deviceId, deviceName, accessPointSgtin, pin);
  const clientAuthToken = await authentication.getClientAuthToken();
  // const { authToken, clientId } = await authentication.connect(clientAuthToken);

  const currentState = await getCurrentState(http, accessPointSgtin, authToken, clientAuthToken);

  const { humidity, actualTemperature } = currentState.groups['14d4ff55-b3e4-4254-a2d6-8a17af0469ec'];

  console.log({ humidity, actualTemperature });
})();
