#!/bin/bash
cd /var/www/html/skooltym_admin
git pull origin main
npm install
npm run build
pm2 restart skooltym_admin


