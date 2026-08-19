@echo off
title PomoFoco
cd /d "%~dp0.."
echo.
echo   PomoFoco - iniciando o app...
echo.
where powershell >nul 2>nul
if errorlevel 1 (
  echo   ERRO: o Windows PowerShell nao foi encontrado neste computador.
  echo   Este lancador funciona no Windows 7 ou superior.
  pause
  exit /b
)
start "PomoFoco (NAO FECHE)" powershell -NoProfile -Command "$root=$PWD.Path; $l=New-Object System.Net.HttpListener; $l.Prefixes.Add('http://localhost:4173/'); try { $l.Start() } catch { Write-Host ''; Write-Host '  ERRO: porta 4173 em uso ou bloqueada.'; Write-Host '  Feche outros programas e tente de novo.'; Read-Host '  Enter para fechar'; exit }; Write-Host ''; Write-Host '  PomoFoco no ar em http://localhost:4173'; Write-Host '  NAO feche esta janela enquanto usa o app.'; Write-Host ''; $m=@{'.html'='text/html;charset=utf-8';'.js'='text/javascript;charset=utf-8';'.css'='text/css;charset=utf-8';'.svg'='image/svg+xml';'.woff2'='font/woff2';'.woff'='font/woff';'.webmanifest'='application/manifest+json';'.json'='application/json';'.txt'='text/plain;charset=utf-8';'.png'='image/png';'.ico'='image/x-icon'}; while ($l.IsListening) { $c=$l.GetContext(); $p=[Uri]::UnescapeDataString($c.Request.Url.LocalPath); if ($p -eq '/') { $p='/index.html' }; if ($p.Contains('..')) { $c.Response.StatusCode=403; $c.Response.Close(); continue }; $f=Join-Path $root ($p.TrimStart('/').Replace('/','\\')); if (Test-Path $f -PathType Leaf) { $b=[System.IO.File]::ReadAllBytes($f); $e=[System.IO.Path]::GetExtension($f).ToLower(); if ($m.ContainsKey($e)) { $c.Response.ContentType=$m[$e] } else { $c.Response.ContentType='application/octet-stream' }; $c.Response.ContentLength64=$b.Length; $c.Response.OutputStream.Write($b,0,$b.Length) } else { $c.Response.StatusCode=404 }; $c.Response.Close() }"
ping 127.0.0.1 -n 3 >nul
start "" "http://localhost:4173"
echo   O app abriu no navegador em http://localhost:4173
echo   Se o navegador avisar que nao conseguiu conectar, aperte F5.
echo.
echo   Esta janela pode ser fechada.
echo   A janela "PomoFoco (NAO FECHE)" precisa ficar aberta enquanto voce usa o app.
ping 127.0.0.1 -n 8 >nul
exit
