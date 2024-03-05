:: 设置编码格式为utf-8 否则中文乱码
chcp 65001
:: 关闭命令回显，禁止显示批处理脚本中的命令在执行时的输出，使输出更简洁
@echo off

:: 读取密码，保存至password变量中
set /p password=<.\bin\password.txt

:: net use 基于 SMB 协议，用于在本地系统与远程 windows 系统之间进行文件共享和访问
:: 指定用户名、密码、远程服务器 ip 及共享驱动器，使用 net use 进行远程连接
net use \\10.30.20.87\C$ /user:administrator %password%

:: 清空目标文件夹下所有内容 /s 表示递归地删除指定路径下所有子文件夹中的文件 /q 表示静默（无法找到，确认删除）
:: del /s /q "\\10.30.20.87\C$\ADP\bap-server\bap-workspace\bap-static\_scmbps\_test3\*"
rd /s /q "\\10.30.20.87\C$\ADP\bap-server\bap-workspace\bap-static\_scmbps" 
:: mkdir "\\10.30.20.87\C$\ADP\bap-server\bap-workspace\bap-static\_scmbps\_test9\" 
:: 复制源文件夹下所有内容到目标文件夹 /s 表示递归地复制源文件夹中的所有子文件夹和文件 
:: /e 表示包括空文件夹 /i 表示如果目标是一个目录或包含通配符，则认为它是一个目录 /y 表示自动确认（覆盖）
xcopy /s /e /i /y ".\dist" "\\10.30.20.87\C$\ADP\bap-server\bap-workspace\bap-static\_scmbps"

:: 断开连接
net use \\10.30.20.87\C$ /delete