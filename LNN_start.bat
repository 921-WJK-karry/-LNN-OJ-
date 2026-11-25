@echo off
REM 姓名：李南诺 | 学号：24002120324
REM 时间：2026-11-20 | 大模型：GLM-5.3-Flash
REM 说明：启动后端服务（%~dp0 保证双击运行时切换到项目根目录，不受当前路径影响）

REM 切换到 backend 目录（%~dp0 为本 bat 所在目录，末尾自带反斜杠）
cd /d "%~dp0backend"

REM 切换控制台为 UTF-8，避免 node 输出的中文日志乱码（其后均为纯 ASCII 行）
chcp 65001 >nul

REM 启动命令与 package.json 中的 scripts.start 保持一致
npm start

REM 结尾暂停，出错时窗口不关闭，便于查看日志
pause
