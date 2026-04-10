// src\api\GetHourWkcntrSum.ts

import { api } from './apiconfig';

export interface HourWkcntrSumData {
  HourScadaNO: string;   // LEFT(ScadaNO,8)
  HourWkcntrSum: number; // 汇总值
}
export async function loadDataHourWkcntrSum(
  area: string,
  startscadano: string,
  endscadano: string
): Promise<HourWkcntrSumData[]> {
  if (!area || !startscadano || !endscadano) {
    console.warn('缺少必要参数');
    return [];
  }

  try {
    const res = await api.get('/items/t_scadadata', {
      params: {
        // 推荐写法（更稳定）
        fields: ['LEFT(ScadaNO,8)', 'sum(WkcntrSum)'],   // 直接在 fields 中写函数 + 聚合

        filter: JSON.stringify({
          _and: [
            { Area: { _eq: area } },
            { ScadaNO: { _between: [startscadano, endscadano] } }
          ]
        }),

        // 如果上面 fields 方式不行，再尝试下面传统方式
        // groupBy: ['LEFT(ScadaNO,8)'],
        // aggregate: { sum: ['WkcntrSum'] },
      },
    });

    // 处理返回数据（Directus 返回结构可能不同）
    const rawData = res.data.data || [];
    return rawData.map((item: any) => ({
      HourScadaNO: item['LEFT(ScadaNO,8)'] || item.HourScadaNO,
      HourWkcntrSum: Number(item['sum(WkcntrSum)'] || item.sum?.WkcntrSum || item.HourWkcntrSum || 0)
    }));

  } catch (err: any) {
    console.error('小时汇总请求失败', err.response?.data || err);
    return [];
  }
}