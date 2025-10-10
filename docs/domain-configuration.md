# LumeraKai Domain Configuration Guide
*Cloudflare setup for lumerakai.ai and lumerakai.com*

## 🎯 Goal
All traffic redirects to secure **https://www.lumerakai.ai**

## 🌐 Domain Setup

### Primary Domain: lumerakai.ai
1. **DNS Records** (Cloudflare Dashboard):
   ```
   Type: A
   Name: @
   Content: [Your server IP]
   Proxy: ✅ Proxied
   
   Type: A  
   Name: www
   Content: [Your server IP]
   Proxy: ✅ Proxied
   ```

2. **Page Rules** (Rules → Page Rules):
   ```
   Rule 1: http://lumerakai.ai/*
   Setting: Always Use HTTPS
   
   Rule 2: http://www.lumerakai.ai/*
   Setting: Always Use HTTPS
   
   Rule 3: https://lumerakai.ai/*
   Setting: Forwarding URL (301 Redirect)
   Destination: https://www.lumerakai.ai/$1
   ```

### Secondary Domain: lumerakai.com
1. **DNS Records**:
   ```
   Type: A
   Name: @
   Content: [Your server IP]
   Proxy: ✅ Proxied
   
   Type: A
   Name: www  
   Content: [Your server IP]
   Proxy: ✅ Proxied
   ```

2. **Page Rules**:
   ```
   Rule 4: http://lumerakai.com/*
   Setting: Forwarding URL (301 Redirect)
   Destination: https://www.lumerakai.ai/$1
   
   Rule 5: https://lumerakai.com/*
   Setting: Forwarding URL (301 Redirect)
   Destination: https://www.lumerakai.ai/$1
   
   Rule 6: http://www.lumerakai.com/*
   Setting: Forwarding URL (301 Redirect)
   Destination: https://www.lumerakai.ai/$1
   
   Rule 7: https://www.lumerakai.com/*
   Setting: Forwarding URL (301 Redirect)
   Destination: https://www.lumerakai.ai/$1
   ```

## 🔒 SSL/TLS Configuration

### Cloudflare SSL Settings
1. **SSL/TLS → Overview**:
   - Encryption Mode: **Full (strict)**
   
2. **SSL/TLS → Edge Certificates**:
   - Always Use HTTPS: **On**
   - HTTP Strict Transport Security (HSTS): **Enable**
   - Minimum TLS Version: **1.2**
   - Automatic HTTPS Rewrites: **On**

## 🚀 Deployment Options

### Option 1: GitHub Pages + Cloudflare (RECOMMENDED for local dev)
```bash
# 1. Deploy to GitHub Pages (free hosting)
cd public-deploy
git checkout -b gh-pages
cp ../landing-page/index.html .
git add . && git commit -m "Deploy landing page"
git push origin gh-pages

# 2. Enable GitHub Pages in repo settings
# 3. Point Cloudflare DNS to GitHub Pages IPs:
#    185.199.108.153
#    185.199.109.153
#    185.199.110.153
#    185.199.111.153
```

### Option 2: Cloudflare Pages (BEST for production)
```bash
# 1. Connect GitHub repo to Cloudflare Pages
# 2. Build settings:
#    Build command: (none)
#    Build output directory: /
#    Root directory: landing-page
# 3. Custom domain automatically configured
```

### Option 3: Cloudflare Tunnel (For local development)
```bash
# 1. Install cloudflared
brew install cloudflare/cloudflare/cloudflared

# 2. Login to Cloudflare
cloudflared tunnel login

# 3. Create tunnel
cloudflared tunnel create lumerakai

# 4. Route traffic
cloudflared tunnel route dns lumerakai www.lumerakai.ai

# 5. Run tunnel (points to your local server)
cloudflared tunnel run --url http://localhost:3000 lumerakai
```

### Option 4: Local IP (Not recommended for production)
```bash
# Only if you have a static public IP
# Point DNS A records to your public IP
# Requires port forwarding and SSL certificates
```

## ✅ Testing Checklist

Test all redirect scenarios:
- [ ] http://lumerakai.ai → https://www.lumerakai.ai
- [ ] https://lumerakai.ai → https://www.lumerakai.ai  
- [ ] http://www.lumerakai.ai → https://www.lumerakai.ai
- [ ] ✅ https://www.lumerakai.ai (final destination)
- [ ] http://lumerakai.com → https://www.lumerakai.ai
- [ ] https://lumerakai.com → https://www.lumerakai.ai
- [ ] http://www.lumerakai.com → https://www.lumerakai.ai
- [ ] https://www.lumerakai.com → https://www.lumerakai.ai

## 🔧 Cloudflare Dashboard Steps

1. **Add Domains**:
   - Add lumerakai.ai as primary site
   - Add lumerakai.com as additional site

2. **Configure DNS**:
   - Set A records for both domains
   - Enable Cloudflare proxy (orange cloud)

3. **Set Page Rules**:
   - Create 7 page rules as specified above
   - Order matters - most specific first

4. **Enable Security**:
   - SSL/TLS Full (strict)
   - Always Use HTTPS
   - HSTS enabled

## 📊 Analytics Setup

Add to landing page `<head>`:
```html
<!-- Cloudflare Web Analytics -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
        data-cf-beacon='{"token": "your-token-here"}'></script>
```

## 🎯 Final Result
All variations redirect to: **https://www.lumerakai.ai**
- Secure HTTPS connection
- Consistent branding
- SEO-friendly redirects
- Fast global CDN delivery