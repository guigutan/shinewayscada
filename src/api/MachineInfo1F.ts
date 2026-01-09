
import {api} from './apiconfig';


export interface MachineInfoRow {
  MachineID: string;
  MachineNO: string;
  MachineName: string;
  MachineModel:string;
  MachineDetail:string;
  MachineDateOut:Date;
  tempItem:string;
  MachineStype: string;
  IpAddr: string;
  PortNum: string;
  MachineStatus: string;
  OrderBy: string;
 
}
export const GetMachineInfo = (MachineNO: string) => 
  api.get<{ success: boolean; data: MachineInfoRow[] }>(`/GetMachine1F/${MachineNO}`); 

//get>>>http://localhost:3000/api/GetMachine1F/C1

