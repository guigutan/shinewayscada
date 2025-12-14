SELECT * from t_machine


SELECT t_machine.MachineNO,t_scadadata.LedStatus FROM t_machine LEFT JOIN   t_scadadata ON t_scadadata.MachineID=t_machine.MachineID
WHERE t_machine.MachineStatus=1
AND t_scadadata.ScadaNO='202512141442'
ORDER BY t_machine.OrderBy 