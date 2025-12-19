import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://192.168.99.32:3000/api',
  timeout: 10000,
});


export interface NewsSadaRow {
  CreateTime: string;
  LedStatus: string;
  WkcntrNum: string;  
}
export const GetNewScada = (MachineNO: string) => 
  api.get<{ success: boolean; data: NewsSadaRow[] }>(`/GetNewScada3F/${MachineNO}`); 

//get>>>http://localhost:3000/api/GetNewScada3F/C1

