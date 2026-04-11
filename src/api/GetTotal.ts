import { api } from './apiconfig';

// 注意：这里没有 HourScadaNO，只有总和！
export interface TotalSumResult {
  sum: {
    WkcntrSum: string;
  };
}

/**
 * 按区域查询【总产量】
 * 对应 URL：
 * /items/t_scadadata?filter[ScadaNO][_gte]=xxx&filter[ScadaNO][_lt]=xxx&filter[MachineID][Area][_eq]=一楼&aggregate[sum]=WkcntrSum
 */
export async function loadDataTotal(
  startScadaNo: number | string,
  endScadaNo: number | string,
  area: string = '一楼'
) {
  try {
    const res = await api.get<{ data: TotalSumResult[] }>('/items/t_scadadata', {
      params: {
        // 时间范围
        'filter[ScadaNO][_gte]': startScadaNo,
        'filter[ScadaNO][_lt]': endScadaNo,

        // 产量 > 0
        'filter[WkcntrSum][_gt]': 0,

        // ✅ 关键：按区域查询
        'filter[MachineID][Area][_eq]': area,

        // 只求和，不分組
        'aggregate[sum]': 'WkcntrSum',
      },
    });

    // 返回总产量
    return res.data.data[0]?.sum || { WkcntrSum: '0' };

  } catch (err) {
    console.error('loadTotalWkcntrSum error', err);
    return { WkcntrSum: '0' };
  }
}