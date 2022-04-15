import { AzureFunction, Context } from "@azure/functions";
import { Authentication, getCurrentState, getHost } from '@hmip/client';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import 'dotenv/config';

const accessPointSgtin = process.env.ACCESS_POINT_SGTIN as string;
const pin = process.env.PIN as string;
const deviceName = process.env.DEVICE_NAME as string;
const deviceId = process.env.DEVICE_ID as string;
const authToken = process.env.AUTH_TOKEN as string;
const clientId = process.env.CLIENT_ID as string;
const influxToken = process.env.INFLUX_TOKEN as string;
const influxOrganisation = process.env.INFLUX_ORGANISATION as string;
const influxBucket = process.env.INFLUX_BUCKET as string;

const influxClient = new InfluxDB({ url: 'https://westeurope-1.azure.cloud2.influxdata.com', token: influxToken });

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
  var timeStamp = new Date().toISOString();

  const { http } = await getHost(accessPointSgtin);

  const authentication = new Authentication(http, deviceId, deviceName, accessPointSgtin, pin);
  const clientAuthToken = await authentication.getClientAuthToken();
  // const { authToken, clientId } = await authentication.connect(clientAuthToken);

  const currentState = await getCurrentState(http, accessPointSgtin, authToken, clientAuthToken);

  const { label, humidity, actualTemperature } = currentState.groups['14d4ff55-b3e4-4254-a2d6-8a17af0469ec'];

  const writeApi = influxClient.getWriteApi(influxOrganisation, influxBucket);

  writeApi.writePoint(new Point(label)
    .floatField('humidity', humidity)
    .floatField('temperature', actualTemperature));

  try {
    await writeApi.close();
    console.log('⏱️', timeStamp, { label, humidity, actualTemperature });
  } catch (error) {
    console.error(error);
  }

};

export default timerTrigger;
