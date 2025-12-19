import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://192.168.99.32:3000/api',
  timeout: 10000,
});

export interface MachineHoursSumRow {
    ScadaNO: string;
    WkcntrCount: string;   
}
export const PostMachineHoursSum = (MachineNO: string,ScadaNOT1: string,ScadaNOT2: string) => 
  api.post<{ success: boolean; data: MachineHoursSumRow[] }>('/MachineHoursSum2F', { MachineNO,ScadaNOT1,ScadaNOT2});

// POST 接口示例：http://localhost:3000/api/MachineHoursSum2F

