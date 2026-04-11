//apiconfig.ts

import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://61.142.21.100:7002/',
  headers: {
    'Authorization': 'Bearer 0FjWJVIqasEtwEapFx1owqe0R119WUgY',
    'Content-Type': 'application/json',
  },
  timeout: 3000,
});

//推荐的 deep 参数（尤其当过滤比较复杂时） limit要>=10 
/* 
    http://61.142.21.100:7002/items/t_scadadata?access_token=0FjWJVIqasEtwEapFx1owqe0R119WUgY
    &fields=*,MachineID.*
    &filter[ScadaNO][_eq]=202604090925
    &limit=10
    &deep[MachineID][_filter][Stype][_eq]=M80


   http://61.142.21.100:7002/items/t_scadadata?access_token=0FjWJVIqasEtwEapFx1owqe0R119WUgY
   &fields=HourScadaNO,WkcntrSum
   &filter[WkcntrSum][_gt]=0
   &aggregate[count]=WkcntrSum
   &groupBy[]=HourScadaNO
  






    http://61.142.21.100:7002/items/t_scadadata?access_token=0FjWJVIqasEtwEapFx1owqe0R119WUgY
    &fields=HourScadaNO,WkcntrSum    
    &deep[MachineID][Area][_eq]=一楼
    &limit=5


*/

//推荐的 GraphQL 请求（最接近你原 SQL）
/*
  请求方式：POST
  http://61.142.21.100:7002/graphql?access_token=1RB5Yf-d00etRXxnWH4cA494Hsx0T0we
  {
  "query": "query GetHourlyProduction {\n  t_scadadata(\n    filter: {\n      HourScadaNO: { _gte: \"2026041008\", _lt: \"2026041020\" }\n    }\n  ) {\n    groupBy: HourScadaNO\n    aggregate: {\n      sum: {\n        WkcntrSum\n      }\n    }\n    t_machine {\n      Area(filter: { Area: { _eq: \"一楼\" } })\n    }\n  }\n}"
  }

*/




//受限用户：0FjWJVIqasEtwEapFx1owqe0R119WUgY
//管理员：1RB5Yf-d00etRXxnWH4cA494Hsx0T0we

