#!/bin/bash
sudo git pull
npm i
npm run tbuild
sudo pm2 restart svelte