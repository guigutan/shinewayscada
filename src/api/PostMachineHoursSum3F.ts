
import {api} from './apiconfig';

export interface MachineHoursSumRow {
    ScadaNO: string;
    WkcntrCount: string;   
}
export const PostMachineHoursSum = (MachineNO: string,ScadaNOT1: string,ScadaNOT2: string) => 
  api.post<{ success: boolean; data: MachineHoursSumRow[] }>('/MachineHoursSum3F', { MachineNO,ScadaNOT1,ScadaNOT2});

// POST 接口示例：http://localhost:3000/api/MachineHoursSum3F

