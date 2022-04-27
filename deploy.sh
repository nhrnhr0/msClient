#!/bin/bash
sudo git pull
sudo npm i
npm run sbuild
sudo pm2 restart svelte
