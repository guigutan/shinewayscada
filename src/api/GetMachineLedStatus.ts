// src\api\GetMachineLedStatus.ts

import { api } from './apiconfig';

// 设备表
export interface TMachine {
  MachineID?:number;
  MachineNO?: string;
  ShortName?: string;
  FullName?: string;
  Brand?: string;
  Model?: string;
  Detail?: string;
  Area?: string;  
  Stype?: string;
  OutDate?:Date;
  Status?:number;
  IpAddr?:string;
  PortNum?:number;
  OrderBy?:number;
  trCount?:number;
  tdCount?:number;
  colIndex?:number;
  tempItem?:string;
  tempOneToMany?:number;
  CreateUser?:string;
  CreateTime?:Date;
  UpdateUser?:string;
  UpdateTime?:Date;   

}

// 采集表
export interface TScadaData {
  ScadaID?: number;
  MachineID?: TMachine;     // ← 改成 machineid
  ScadaNO?: string;
  WkcntrNum?: number;
  WkcntrCount?: number;
  OneToMany?: number;
  WkcntrSum?: number;
  LedStatus?: -1 | 0 | 1 | 2 | 3;
  ItemString?: string;
  OtherMsg?: string;
  CreateTime?: Date;   
}


export async function loadDataMachineLedStatus() {
  try {
    const res = await api.get<{ data: TScadaData[] }>('/items/t_scadadata', {
      params: {
        fields: '*,MachineID.*',

        // 本表过滤
        filter: JSON.stringify({
          ScadaNO: { _eq: '202604090925' }
        }),

        // 关联表过滤 —— 推荐改用这种写法，更稳定
        deep: JSON.stringify({
          MachineID: {
            _filter: {
              Stype: { _eq: 'M80' }
            }
          }
        }),

        //limit: 100,           // ← 先用较大的 limit（推荐 50~200）
        //sort: '-CreateTime',  // 加上排序，避免随机顺序
        // page: 1,           // 可以加分页
      },
    });

     // console.log(res.data.data);
     // console.log('第一条数据:', JSON.stringify(res.data.data[0]?.MachineID, null, 2));   
    return res.data.data;
    

  } catch (err: any) {
     console.error(`src\api\GetScadaInfo.ts 请求失败：`, err.response?.data || err);
    return [];
  }

}