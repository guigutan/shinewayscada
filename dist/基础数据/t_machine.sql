-- db_shinewayscada.t_machine definition

CREATE TABLE `t_machine` (
  `MachineID` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '设备ID',
  `MachineNO` varchar(50) NOT NULL COMMENT '设备编号',
  `ShortName` varchar(100) DEFAULT NULL COMMENT '设备简称',
  `FullName` varchar(200) DEFAULT NULL COMMENT '设备全称',
  `Brand` varchar(50) DEFAULT NULL COMMENT '品牌',
  `Model` varchar(50) DEFAULT NULL COMMENT '型号',
  `Detail` varchar(512) DEFAULT NULL COMMENT '描述',
  `Area` varchar(30) NOT NULL DEFAULT '未知' COMMENT '区域标记',
  `Stype` varchar(30) NOT NULL DEFAULT '未知' COMMENT '类型标记',
  `OutDate` date DEFAULT NULL COMMENT '出厂日期',
  `Status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '状态 0=停用 1=启用' CHECK (`Status` in (0,1)),
  `IpAddr` varchar(50) DEFAULT NULL COMMENT 'IP',
  `PortNum` int(11) DEFAULT NULL COMMENT '端口',
  `OrderBy` int(11) DEFAULT 0 COMMENT '排序',
  `trCount` int(11) DEFAULT 0 COMMENT '排版网格行数',
  `tdCount` int(11) DEFAULT 0 COMMENT '排版网格列数',
  `colIndex` int(11) DEFAULT 0 COMMENT '位于网格位置',
  `tempItem` varchar(255) DEFAULT NULL COMMENT '加工品',
  `tempOneToMany` int(11) NOT NULL DEFAULT 1 COMMENT '一出多',
  `CreateUser` varchar(50) DEFAULT NULL COMMENT '创建人',
  `CreateTime` datetime NOT NULL DEFAULT current_timestamp() COMMENT '创建时间',
  `UpdateUser` varchar(50) DEFAULT NULL COMMENT '最后修改人',
  `UpdateTime` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最后修改时间',
  PRIMARY KEY (`MachineID`),
  UNIQUE KEY `uk_machineno` (`MachineNO`),
  KEY `idx_tempitem` (`tempItem`)
) ENGINE=InnoDB AUTO_INCREMENT=310 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='设备信息表';

/*
="insert into t_machine(MachineNO,ShortName,FullName,Brand,Model,Detail,Area,Stype,OutDate,Status,IpAddr,PortNum,OrderBy,trCount,tdCount,colIndex,CreateUser,UpdateUser) values 
('"&B2&"','"&C2&"','"&D2&"','"&E2&"','"&F2&"','"&G2&"','"&H2&"','"&I2&"','"&&TEXT(J2,"yyyy-mm-dd")&"','"&K2&"','"&L2&"','"&M2&"','"&N2&"','"&O2&"','"&P2&"','"&Q2&"','"&T2&"','"&V2&"');"


insert into t_machine(MachineNO,ShortName,FullName,Brand,Model,Detail,Area,Stype,OutDate,Status,IpAddr,PortNum,OrderBy,trCount,tdCount,colIndex,CreateUser,UpdateUser) values 
="('"&B2&"','"&C2&"','"&D2&"','"&E2&"','"&F2&"','"&G2&"','"&H2&"','"&I2&"','"&TEXT(J2,"yyyy-mm-dd")&"','"&K2&"','"&L2&"','"&M2&"','"&N2&"','"&O2&"','"&P2&"','"&Q2&"','"&T2&"','"&V2&"'),"

*/


