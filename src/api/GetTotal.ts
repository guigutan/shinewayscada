// src\api\GetTotal.ts

import { api } from './apiconfig';

export interface TotalSumResult {  
  sum: {
    WkcntrSum: number; 
  };
}

export async function loadDataTotal(
  startScadaNo: number | string,
  endScadaNo: number | string,
  area: string = '一楼'
): Promise<TotalSumResult[]> {
  try {    
    const res = await api.get<{ data: TotalSumResult[] }>('/items/t_scadadata', {
      params: {
        'filter[ScadaNO][_gte]': startScadaNo,
        'filter[ScadaNO][_lt]': endScadaNo,
        'filter[WkcntrSum][_gt]': 0,
        'filter[MachineID][Area][_eq]': area,
        'aggregate[sum]': 'WkcntrSum',
      },
    }); 
    return res.data.data 
  } catch (err) {
    console.error('loadDataTotal error', err);
    return [];
  }
}