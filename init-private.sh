#!/bin/bash
cd private-repo
git init
git remote add origin https://github.com/kakarath/lumerakai-health-private.git
git add .
git commit -m "Initial LumeraKai Health private core"
git branch -M main
git push -u origin main
