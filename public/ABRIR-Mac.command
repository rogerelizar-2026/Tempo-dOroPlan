#!/bin/sh
# PomoFoco — abridor para macOS (dois cliques para usar)
cd "$(dirname "$0")" || exit 1
PORT=4173
clear
echo ""
echo "  PomoFoco — iniciando em http://localhost:$PORT"
echo "  NAO feche esta janela enquanto estiver usando o app."
echo ""
if command -v python3 >/dev/null 2>&1; then
  ( sleep 2; open "http://localhost:$PORT" 2>/dev/null ) &
  exec python3 -m http.server "$PORT" --bind 127.0.0.1
else
  echo "  ERRO: o python3 nao foi encontrado neste Mac."
  echo "  O Mac vai oferecer a instalacao das ferramentas de linha de comando;"
  echo "  aceite, aguarde terminar e abra este arquivo de novo."
  echo ""
  xcode-select --install 2>/dev/null
  echo "  Pressione Enter para fechar..."
  read _
fi
