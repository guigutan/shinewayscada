//apiconfig.ts
import axios from 'axios';

// 自动检测：内网可达 → 用内网IP；否则 → 用公网IP
async function getBestBaseURL() {
  const INTERNAL_URL = 'http://192.168.100.61:7002/';
  const EXTERNAL_URL = 'http://61.142.21.100:7002/';

  try {
    // 尝试请求内网接口（超时极短，不卡页面）
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 300); // 300ms 超时

    await fetch(INTERNAL_URL + 'server/ping', {
      signal: controller.signal,
      mode: 'no-cors'
    });

    clearTimeout(id);
    console.log('✅ 内网连通，使用局域网接口');
    return INTERNAL_URL;
  } catch (e) {
    console.log('❌ 内网不可达，已改用公网接口');
    return EXTERNAL_URL;
  }
}

// 创建 axios 实例
export const api = axios.create({
  baseURL: await getBestBaseURL(), // 自动选择最优地址
  headers: {
    'Authorization': 'Bearer 0FjWJVIqasEtwEapFx1owqe0R119WUgY', //受限用户：0FjWJVIqasEtwEapFx1owqe0R119WUgY
    'Content-Type': 'application/json',
  },
  timeout: 1000,
});



//推荐的 deep 参数（尤其当过滤比较复杂时） limit要>=10 
/* 
    http://61.142.21.100:7002/items/t_scadadata?access_token=0FjWJVIqasEtwEapFx1owqe0R119WUgY
    &fields=*,MachineID.*
    &filter[ScadaNO][_eq]=202604090925
    &limit=10
    &deep[MachineID][_filter][Stype][_eq]=M80
   

   http://61.142.21.100:7002/items/t_scadadata?access_token=0FjWJVIqasEtwEapFx1owqe0R119WUgY      
   &filter[ScadaNO][_gte]=202604100800
   &filter[ScadaNO][_lt]=202604102000
   &filter[WkcntrSum][_gt]=0
   &filter[MachineID][Area][_eq]=一楼
   &aggregate[sum]=WkcntrSum
   &groupBy[]=HourScadaNO


   http://61.142.21.100:7002/items/t_scadadata?access_token=0FjWJVIqasEtwEapFx1owqe0R119WUgY      
   &filter[ScadaNO][_gte]=202604100800
   &filter[ScadaNO][_lt]=202604102000
   &filter[WkcntrSum][_gt]=0
   &filter[MachineID][_in]=1,2,3,4,5,6
   &aggregate[sum]=WkcntrSum
   &groupBy[]=HourScadaNO
   



 http://61.142.21.100:7002/items/t_scadadata?access_token=0FjWJVIqasEtwEapFx1owqe0R119WUgY      
  &filter[ScadaNO][_gte]=202604100800
  &filter[ScadaNO][_lt]=202604102000
  &filter[WkcntrSum][_gt]=0
  &filter[MachineID][Area][_eq]=一楼
  &aggregate[sum]=WkcntrSum 



*/







