import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://192.168.99.32:3000/api',
  timeout: 10000,
});


export interface MachineInfoRow {
  MachineID: string;
  MachineNO: string;
  MachineName: string;
  MachineStype: string;
  IpAddr: string;
  PortNum: string;
  MachineStatus: string;
  OrderBy: string;
}
export const GetMachineInfo = (MachineNO: string) => 
  api.get<{ success: boolean; data: MachineInfoRow[] }>(`/GetMachine1F/${MachineNO}`); 

//get>>>http://localhost:3000/api/GetMachine1F/C1

