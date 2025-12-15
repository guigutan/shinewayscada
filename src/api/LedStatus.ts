import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// SMOM 接口相关类型（和接口放一起）
export interface LedStatusRow {
  MachineNO: string;
  LedStatus: string;
}

// SMOM 条码查询接口
// export const LedStatus = (barcode: string) => 
//   api.post<{ success: boolean; data: LedStatusRow[] }>('/LedStatusRow', { barcode });


// SMOM 条码查询接口（GET + 路由参数）
//http://localhost:3000/api/GetLed1F/202512141442
export const LedStatus = (scadano: string) => 
  api.get<{ success: boolean; data: LedStatusRow[] }>(`/GetLed1F/${scadano}`); // 拼接路由参数，最终 URL：/GetLed1F/xxx

