
import {api} from './apiconfig';


export interface NewsSadaRow {
  CreateTime: string;
  LedStatus: string;
  WkcntrNum: string;  
}
export const GetNewScada = (MachineNO: string) => 
  api.get<{ success: boolean; data: NewsSadaRow[] }>(`/GetNewScada2F/${MachineNO}`); 

//get>>>http://localhost:3000/api/GetNewScada2F/C1

