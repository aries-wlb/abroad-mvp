chcp 65001
@echo off
:: 全部文件(包括子文件夹的文件)删除了 但空文件夹还在
del /s /q ".\_test\*"
:: 文件夹直接删除了
rd /s /q ".\_test\"