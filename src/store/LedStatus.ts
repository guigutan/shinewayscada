// src/store/LedStatus.ts
import { defineStore } from 'pinia';
import type { LedStatusRow } from '@/api/GetLed1F';

export const useLedStatusStore = defineStore('ledStatus', {
  state: () => ({
    // 必须初始化为空数组，且类型匹配LedStatusRow
    data: [] as LedStatusRow[]
  }),
  actions: {
    // 必须正确更新state中的data
    setData(newData: LedStatusRow[]) {
      this.data = newData; // 关键：确保用this.data接收新数据
    }
  }
});