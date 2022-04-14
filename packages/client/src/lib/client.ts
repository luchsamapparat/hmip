import { post } from './http';

const clientCharacteristics = {
  apiVersion: '12',
  applicationIdentifier: 'hmipdashboard',
  applicationVersion: '1.0',
  deviceManufacturer: 'none',
  deviceType: 'Computer',
  language: 'en_US',
  osType: 'Linux',
  osVersion: 'NT',
};

type HostResponse = {
  urlREST: string;
  urlWebSocket: string;
  apiVersion: string;
  primaryAccessPointId: string;
  requestingAccessPointId: string;
}

export async function getHost(accessPointSgtin: string) {
  const response = await post<HostResponse>('https://lookup.homematic.com:48335/getHost', {
    clientCharacteristics,
    'id': accessPointSgtin
  });

  return {
    http: response.urlREST,
    ws: response.urlWebSocket.replace(/^http/, 'ws'),
  };
}


export async function getCurrentState(httpBaseUrl: string, accessPointSgtin: string, authToken: string, clientAuthToken: string) {
  // TODO fix any typing
  return post<any>(
    `${httpBaseUrl}/hmip/home/getCurrentState`,
    {
      clientCharacteristics,
      'id': accessPointSgtin
    },
    {
      VERSION: '12',
      AUTHTOKEN: authToken,
      CLIENTAUTH: clientAuthToken
    }
  );
}
