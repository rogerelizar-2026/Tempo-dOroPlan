#!/bin/sh
# PomoFoco — abridor para Linux
cd "$(dirname "$0")/.." || exit 1
PORT=4173
echo ""
echo "  PomoFoco — iniciando em http://localhost:$PORT"
echo "  NAO feche esta janela enquanto estiver usando o app."
echo ""
if command -v python3 >/dev/null 2>&1; then
  ( sleep 2
    if command -v xdg-open >/dev/null 2>&1; then
      xdg-open "http://localhost:$PORT" 2>/dev/null
    fi ) &
  exec python3 -m http.server "$PORT" --bind 127.0.0.1
else
  echo "  ERRO: o python3 nao foi encontrado."
  echo "  Instale o python3 pelo gerenciador de programas da sua distribuicao"
  echo "  (ex.: sudo apt install python3) e abra este arquivo de novo."
  echo ""
  echo "  Pressione Enter para fechar..."
  read _
fi
