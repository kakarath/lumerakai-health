# SSL Certificate Fix

## 🚨 Problem
SSL certificate validation failed - this is a common Cloudflare configuration issue.

## ✅ Immediate Fix

### Step 1: Change SSL/TLS Mode
In Cloudflare Dashboard:
1. Go to **SSL/TLS** → **Overview**
2. Change **Encryption Mode** from "Full (strict)" to **"Flexible"**
3. Wait 5 minutes for propagation

### Step 2: Alternative - Use Cloudflare Pages URL
Your Cloudflare Pages deployment should be working at:
- `https://lumerakai-health.pages.dev`

Test this URL first to confirm the site is deployed.

### Step 3: If Still Failing - Disable Proxy Temporarily
In **DNS** settings:
1. Click the orange cloud ☁️ next to your A records
2. Change to gray cloud (DNS only)
3. Wait 5 minutes
4. Test the domain
5. Re-enable proxy (orange cloud) once working

## 🔧 Correct SSL Settings for Cloudflare Pages

```
SSL/TLS → Overview:
  Encryption Mode: Flexible (not Full strict)

SSL/TLS → Edge Certificates:
  Always Use HTTPS: On
  HSTS: Off (initially)
  Minimum TLS Version: 1.2
  Automatic HTTPS Rewrites: On
```

## 🎯 Why This Happens
- **Full (strict)** requires valid SSL on origin server
- **Cloudflare Pages** provides SSL automatically
- **Flexible** lets Cloudflare handle SSL termination

## ⏱️ Timeline
- SSL mode change: 5 minutes
- DNS propagation: 5-10 minutes
- Certificate generation: 10-15 minutes

## 🔍 Test Commands
```bash
# Test Cloudflare Pages URL first
curl -I https://lumerakai-health.pages.dev

# Then test custom domain
curl -I https://lumerakai.ai
```