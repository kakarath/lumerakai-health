#!/bin/bash
cd public-repo
git init
git remote add origin https://github.com/kakarath/lumerakai-health.git
git add .
git commit -m "Initial LumeraKai Health public demo"
git branch -M main
git push -u origin main
