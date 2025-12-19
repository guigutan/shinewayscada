import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://192.168.99.32:3000/api',
  timeout: 10000,
});


export interface LedStatusRow {
  MachineNO: string;
  LedStatus: string;
}
export const GetLedStatus = (scadano: string) => 
  api.get<{ success: boolean; data: LedStatusRow[] }>(`/GetLed1F/${scadano}`); // 拼接路由参数，最终 URL：/GetLed1F/xxx

//get>>>http://localhost:3000/api/GetLed1F/202512141442

