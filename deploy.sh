#!/usr/bin/env bash

# Show env vars
grep -v '^#' .env

# Export env vars
export $(grep -v '^#' .env | xargs)


sudo git pull
sudo npm i
npm run build
sudo pm2 restart svelte
pm2 restart svelte