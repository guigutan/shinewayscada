
import {api} from './apiconfig';

export interface LedStatusRow {
  MachineNO: string;
  LedStatus: string;
  trCount:number;
  tdCount:number;
  colIndex:number;
}
export const GetLedStatus = (scadano: string) => 
  api.get<{ success: boolean; data: LedStatusRow[] }>(`/GetLed1F/${scadano}`); // 拼接路由参数，最终 URL：/GetLed1F/xxx

//get>>>http://localhost:3000/api/GetLed1F/202512141442

