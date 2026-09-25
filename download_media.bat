@echo off
title Lokutsav 2026 - Media Downloader & Offline Viewer
color 0F

echo ======================================================================
echo    🚩 LOKUTSAV 2026 - MEDIA DOWNLOADER & OFFLINE VIEWER
echo ======================================================================
echo.
echo Starting download process...
echo.

python "%~dp0scripts\download_media.py" %*

echo.
pause
