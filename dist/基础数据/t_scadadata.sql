-- db_shinewayscada.t_scadadata definition

CREATE TABLE `t_scadadata` (
  `ScadaID` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '采集ID',
  `MachineID` int(10) unsigned NOT NULL COMMENT '设备ID（不能为空）',
  `ScadaNO` varchar(50) NOT NULL COMMENT '采集编号',
  `WkcntrNum` int(11) NOT NULL DEFAULT -1 COMMENT '工件计数',
  `WkcntrCount` int(11) NOT NULL DEFAULT 0 COMMENT '产量小计1',
  `OneToMany` int(11) NOT NULL DEFAULT 0 COMMENT '一出多',
  `WkcntrSum` int(11) NOT NULL DEFAULT 0 COMMENT '产量小计2',
  `LedStatus` tinyint(1) NOT NULL DEFAULT -1 COMMENT '指示灯 -1=通信异常 0=其他 1=绿灯 2=黄灯 3=红灯' CHECK (`LedStatus` in (-1,0,1,2,3)),
  `ItemString` varchar(255) DEFAULT NULL COMMENT '加工品',
  `OtherMsg` varchar(255) DEFAULT NULL COMMENT '其他信息',
  `CreateTime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '采集时间',
  PRIMARY KEY (`ScadaID`),
  UNIQUE KEY `uk_machineid_scadano` (`MachineID`,`ScadaNO`),
  KEY `idx_scadano` (`ScadaNO`),
  KEY `idx_createtime` (`CreateTime`),
  KEY `idx_itemstring` (`ItemString`),
  CONSTRAINT `fk_scadadata_machine` FOREIGN KEY (`MachineID`) REFERENCES `t_machine` (`MachineID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=799 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='设备采集数据表';

--LedStatus 低基数字段，加索引不仅不加速，反而会变慢！
--WkcntrSum 加索引 = 浪费空间 + 拖慢插入 + 查询不会变快！