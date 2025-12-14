import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// SMOM 接口相关类型（和接口放一起）
export interface CodeKSRow {
  id: number;
  barcode: string;
  status: string;
  create_time: string;
}

// SMOM 条码查询接口
export const queryCodeKS = (barcode: string) => 
  api.post<{ success: boolean; data: CodeKSRow[] }>('/mes/codeKSMES', { barcode });