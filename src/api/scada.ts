import { get, type ApiEnvelope } from './client'

export interface TMachine {
  MachineID: number
  MachineNO: string
  MacAddr: string | null
  ShortName: string | null
  FullName: string | null
  Brand: string | null
  Model: string | null
  Detail: string | null
  Area: string
  Stype: string
  OutDate: string | null
  Status: number
  IpAddr: string | null
  PortNum: number | null
  OrderBy: number | null
  trCount: number | null
  tdCount: number | null
  rowIndex: number | null
  colIndex: number | null
  tempItem: string | null
  tempOneToMany: number
  CreateUser: string | null
  CreateTime: string
  UpdateUser: string | null
  UpdateTime: string
  MachineTypeIconUrl?: string | null
}

export interface TScadaData {
  ScadaID: number | null
  ScadaNO: number
  HourScadaNO: number | null
  WkcntrNum: number
  WkcntrCount: number
  OneToMany: number
  WkcntrSum: number
  LedStatus: -1 | 0 | 1 | 2 | 3
  ItemString: string
  OtherMsg: string | null
  CreateTime: string
  MachineID: TMachine
}

export interface TotalSumResult {
  sum: {
    WkcntrSum: number
  }
}

export interface HourScadaSumItem {
  HourScadaNO: number
  sum: {
    WkcntrSum: number
  }
}

interface TotalProduction {
  total: number
}

interface HourProduction {
  HourScadaNO: number
  WkcntrSum: number
}

interface DashboardSnapshot {
  machines: TScadaData[]
  totals: { today: number; last: number; current: number }
  unplannedMachines: string[]
}

export interface ProductionMetric { standard: number; actual: number; rate: number | null }
export interface ProductionReportRow {
  id: string; code: string; name: string
  today: ProductionMetric; last: ProductionMetric; current: ProductionMetric
  hourly: Array<ProductionMetric & { hour: string }>
}
export interface ProductionReport {
  dimension: 'product' | 'machine'; area: string; rows: ProductionReportRow[]
  totals: { today: ProductionMetric; last: ProductionMetric; current: ProductionMetric; hourly: Array<ProductionMetric & { hour: string }> }
}
export interface ProductContext { ProductID:number;ProductCode:string;ProductName:string;ShortName:string|null;Specification:string|null;CycleSeconds:number;Cavities:number;Status:number }
export interface MachineProductionContext {
  machine: ProductionReportRow | null
  currentProduct: ProductContext | null
  schedules: Array<{ScheduleID:number;MachineID:number;ProductID:number|null;StartTime:string;Note:string|null;product:ProductContext|null}>
}
export interface AnalyticsParams {
  area:string;todayStart:number;todayEnd:number;lastStart:number;lastEnd:number;currentStart:number;currentEnd:number;hourlyStart:number;hourlyEnd:number
}

export const loadDashboardSnapshot = async (params: {
  scadaNo: number
  area: string
  todayStart: number
  todayEnd: number
  lastStart: number
  lastEnd: number
  currentStart: number
  currentEnd: number
}): Promise<DashboardSnapshot> => {
  const response = await get<ApiEnvelope<DashboardSnapshot>>('/scada/dashboard', params)
  return response.data
}

export const loadDataMachineLedStatus = async (
  scadaNo: number,
  area: string,
): Promise<TScadaData[]> => {
  const response = await get<ApiEnvelope<TScadaData[]>>('/scada/machines/status', { scadaNo, area })
  return response.data
}

export const loadDataTotal = async (
  startScadaNo: number | string,
  endScadaNo: number | string,
  area: string,
): Promise<TotalSumResult[]> => {
  const response = await get<ApiEnvelope<TotalProduction>>('/scada/production/total', {
    start: startScadaNo,
    end: endScadaNo,
    area,
  })
  return [{ sum: { WkcntrSum: response.data.total } }]
}

export const loadDataHourWkcntrSum = async (
  startScadaNo: number | string,
  endScadaNo: number | string,
  machineId: number,
): Promise<HourScadaSumItem[]> => {
  const response = await get<ApiEnvelope<HourProduction[]>>(
    `/scada/machines/${machineId}/production/hourly`,
    { start: startScadaNo, end: endScadaNo },
  )
  return response.data.map((item) => ({
    HourScadaNO: item.HourScadaNO,
    sum: { WkcntrSum: item.WkcntrSum },
  }))
}

export const loadProductionReport = async (dimension:'product'|'machine', params:AnalyticsParams):Promise<ProductionReport> => {
  const response=await get<ApiEnvelope<ProductionReport>>('/scada/production/report',{dimension,...params})
  return response.data
}

export const loadMachineProductionContext = async (machineId:number,params:AnalyticsParams):Promise<MachineProductionContext> => {
  const response=await get<ApiEnvelope<MachineProductionContext>>(`/scada/machines/${machineId}/production/context`,{...params})
  return response.data
}
