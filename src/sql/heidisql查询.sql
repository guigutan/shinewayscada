ALTER TABLE  t_machine ADD trCount INT ;
ALTER TABLE  t_machine ADD tdCount INT ;
ALTER TABLE  t_machine ADD colIndex INT ;

SELECT * FROM t_machine

UPDATE t_machine SET trCount=21 , tdCount=8 , colIndex=MachineID WHERE 1=1
