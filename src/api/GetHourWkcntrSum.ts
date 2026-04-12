// src\api\GetHourWkcntrSum.ts

import { api } from './apiconfig';

export interface HourScadaSumItem {
  HourScadaNO: number;
  sum: {
    WkcntrSum: number;
  };
}

export async function loadDataHourWkcntrSum(
  startScadaNo: number | string,
  endScadaNo: number | string,
  machineIds: number[]
) {
  try {
    const res = await api.get<{ data: HourScadaSumItem[] }>('/items/t_scadadata', {
      params: {
      
        'filter[ScadaNO][_gte]': startScadaNo,
        'filter[ScadaNO][_lt]': endScadaNo,
        'filter[WkcntrSum][_gt]': 0,
        'filter[MachineID][_in]': machineIds.join(','), // 1,2,3,4,5,6

        'aggregate[sum]': 'WkcntrSum',
        'groupBy[]': 'HourScadaNO',
        'sort[]': 'HourScadaNO',
      },
    });

   

    return res.data.data;
  } catch (err) {
    console.error('loadDataHourWkcntrSum error', err);
    return [];
  }
}