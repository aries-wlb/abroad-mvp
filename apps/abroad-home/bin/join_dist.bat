chcp 65001
@echo off
set /p password=<.\bin\password.txt
net use \\10.30.20.87\C$ /user:administrator %password%

xcopy /s /e /i /y "\\10.30.20.87\C$\ADP\bap-server\bap-workspace\bap-static\_scmbps" "\\10.30.20.87\C$\ADP\bap-server\bap-workspace\bap-static\scmbps"

net use \\10.30.20.87\C$ /delete