#!/bin/bash
sudo git pull
sudo npm i
npm run tbuild
sudo pm2 restart svelte