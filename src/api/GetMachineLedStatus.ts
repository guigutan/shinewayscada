    // src\api\GetMachineLedStatus.ts
    import { api } from './apiconfig';

    // 设备表
    export interface TMachine {
    MachineID?: number;
    MachineNO?: string;
    ShortName?: string;
    FullName?: string;
    Brand?: string;
    Model?: string;
    Detail?: string;
    Area?: string;
    Stype?: string;
    OutDate?: Date;
    Status?: number;
    IpAddr?: string;
    PortNum?: number;
    OrderBy?: number;
    trCount?: number;
    tdCount?: number;
    colIndex?: number;
    tempItem?: string;
    tempOneToMany?: number;
    CreateUser?: string;
    CreateTime?: Date;
    UpdateUser?: string;
    UpdateTime?: Date;
    }

    // 采集表
    export interface TScadaData {
    ScadaID?: number;
    ScadaNO?: number;
    HourScadaNO?: number;
    WkcntrNum?: number;
    WkcntrCount?: number;
    OneToMany?: number;
    WkcntrSum?: number;
    LedStatus?: -1 | 0 | 1 | 2 | 3;
    ItemString?: string;
    OtherMsg?: string;
    CreateTime?: Date;
    MachineID?: TMachine;
    }

    export async function loadDataMachineLedStatus(
    scadaNo: number,
    area: string
    ): Promise<TScadaData[]> { // 👈 明确返回类型
    try {


    //-----------------------------------------------------
    // 1. 获取机台表信息。再以机台表为基准，去查询scadaNo时间点的采集数据
    //-----------------------------------------------------
    const res1 = await api.get<{ data: TMachine[] }>('/items/t_machine', {
        params: {
        fields: '*',
        filter: JSON.stringify({
            _and: [
            { Area: { _eq: area } },
            { Status: { _eq: 1 } }
            ]
        }),
        limit: 500,
        },
    });




    //-----------------------------------------------------
    // 2. 获取采集数据。条件：scadaNo和MachineID in (machineList)
    //-----------------------------------------------------
    const machineList = res1.data.data;
    const res2 = await api.get<{ data: TScadaData[] }>('/items/t_scadadata', {
        params: {
        fields: '*,MachineID.*',
        filter: JSON.stringify({
            ScadaNO: { _eq: scadaNo },
            MachineID: { _in: machineList.map(m => m.MachineID) }
        }),
        limit: 500,
        },
    });




    // 3. 直接遍历 + 查找 + 补齐字段
    //-----------------------------------------------------
    const scadaList = res2.data.data;
    const finalList: TScadaData[] = machineList.map(machine => {
          const data = scadaList.find(item => 
          item.MachineID?.MachineID === machine.MachineID
    );



    //-----------------------------------------------------
    // 4. 完全严格按照 TScadaData 补齐，类型100%匹配
    //-----------------------------------------------------
    if (data) return data;
          return {
                ScadaID: undefined,
                ScadaNO: scadaNo,
                HourScadaNO: undefined,
                WkcntrNum: 0,
                WkcntrCount: 0,
                OneToMany: 1,
                WkcntrSum: 0,
                LedStatus: -1 as const, // 👈 关键：类型严格匹配
                ItemString: '',
                OtherMsg: '',
                CreateTime: new Date(),
                MachineID: machine,
          };
    });
    //-----------------------------------------------------
    //-----------------------------------------------------
    //-----------------------------------------------------


    return finalList;
    


    } catch (err: any) {
        console.error('loadDataMachineLedStatus 请求失败：', err);
        return [];
    }
    }