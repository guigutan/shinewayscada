import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://192.168.99.32:3000/api',
  timeout: 10000,
});

export interface Sum1FRow {
    DaySum: string;
    LastSum: string;
    ThisSum: string;
}
export const Sum1F = (DayT1: string,DayT2: string,LastT1: string,LastT2: string,ThisT1: string,ThisT2: string) => 
  api.post<{ success: boolean; data: Sum1FRow[] }>('/GetSum2F', { DayT1,DayT2,LastT1,LastT2,ThisT1,ThisT2});


// POST 接口示例：http://localhost:3000/api/GetSum1F
// 请求体（JSON）：
// {
//   "DayT1": "202512140000",
//   "DayT2": "202512150000",
//   "LastT1": "202512140800",
//   "LastT2": "202512142000",
//   "ThisT1": "202512142000",
//   "ThisT2": "202512150800"
// }

