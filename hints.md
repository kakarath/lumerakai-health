brew install ollama
To start ollama now and restart at login:
  brew services start ollama
Or, if you don't want/need a background service you can just run:
  OLLAMA_FLASH_ATTENTION="1" OLLAMA_KV_CACHE_TYPE="q8_0" /usr/local/opt/ollama/bin/ollama serve