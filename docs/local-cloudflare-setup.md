# Local Development with Cloudflare Setup
*Using GitHub Pages for hosting with your Cloudflare domains*

## ✅ Current Status
- **Domains**: lumerakai.ai, lumerakai.com (owned)
- **Nameservers**: jacob.ns.cloudflare.com, keyla.ns.cloudflare.com (active)
- **Local Dev**: Running on localhost

## 🚀 Recommended Solution: GitHub Pages

### Step 1: Deploy to GitHub Pages
```bash
# Deploy landing page to GitHub Pages
cd /Users/RoutWorx/lumerakai-health
./scripts/deploy-landing.sh
# Choose option 1 (GitHub Pages)
```

### Step 2: Cloudflare DNS Configuration
In your Cloudflare dashboard:

```
DNS Records for lumerakai.ai:
Type: A    Name: @      Content: 185.199.108.153    Proxy: ✅
Type: A    Name: @      Content: 185.199.109.153    Proxy: ✅  
Type: A    Name: @      Content: 185.199.110.153    Proxy: ✅
Type: A    Name: @      Content: 185.199.111.153    Proxy: ✅
Type: A    Name: www    Content: 185.199.108.153    Proxy: ✅
Type: A    Name: www    Content: 185.199.109.153    Proxy: ✅
Type: A    Name: www    Content: 185.199.110.153    Proxy: ✅
Type: A    Name: www    Content: 185.199.111.153    Proxy: ✅

DNS Records for lumerakai.com:
Type: A    Name: @      Content: 185.199.108.153    Proxy: ✅
Type: A    Name: @      Content: 185.199.109.153    Proxy: ✅
Type: A    Name: @      Content: 185.199.110.153    Proxy: ✅
Type: A    Name: @      Content: 185.199.111.153    Proxy: ✅
Type: A    Name: www    Content: 185.199.108.153    Proxy: ✅
Type: A    Name: www    Content: 185.199.109.153    Proxy: ✅
Type: A    Name: www    Content: 185.199.110.153    Proxy: ✅
Type: A    Name: www    Content: 185.199.111.153    Proxy: ✅
```

### Step 3: Page Rules (Rules → Page Rules)
```
Rule 1: https://lumerakai.ai/*
→ Forwarding URL (301): https://www.lumerakai.ai/$1

Rule 2: https://lumerakai.com/*  
→ Forwarding URL (301): https://www.lumerakai.ai/$1

Rule 3: https://www.lumerakai.com/*
→ Forwarding URL (301): https://www.lumerakai.ai/$1
```

### Step 4: SSL/TLS Settings
- **Encryption Mode**: Full (strict)
- **Always Use HTTPS**: On
- **HSTS**: Enable

## 🎯 Why This Works
- **GitHub Pages**: Free, reliable hosting
- **Cloudflare**: CDN, SSL, redirects, analytics
- **No Local IP needed**: GitHub handles the hosting
- **Professional setup**: Enterprise-grade infrastructure

## ⚡ Quick Deploy Commands
```bash
# 1. Deploy landing page
cd public-deploy
git checkout -b gh-pages
cp ../landing-page/index.html .
echo "www.lumerakai.ai" > CNAME
git add . && git commit -m "Deploy LumeraKai landing page"
git push origin gh-pages

# 2. Enable GitHub Pages in repo settings
# 3. Configure Cloudflare DNS as shown above
```

## 🔗 Final URLs
All these will redirect to **https://www.lumerakai.ai**:
- http://lumerakai.ai
- https://lumerakai.ai  
- http://lumerakai.com
- https://lumerakai.com
- http://www.lumerakai.com
- https://www.lumerakai.com

## ✅ Benefits
- ✅ No need for local IP or port forwarding
- ✅ Free hosting with GitHub Pages
- ✅ Professional SSL certificates
- ✅ Global CDN with Cloudflare
- ✅ Easy updates via git push