# Netlify DNS Configuration for Cloudflare

## 🎯 Netlify's Instructions - Choose One Option

### Option 1: CNAME (Recommended by Netlify)
**In Cloudflare DNS for lumerakai.ai:**
```
Type: CNAME
Name: @
Content: apex-loadbalancer.netlify.com
Proxy: ❌ DNS only (gray cloud)
TTL: Auto
```

### Option 2: A Record (Fallback)
**In Cloudflare DNS for lumerakai.ai:**
```
Type: A
Name: @
Content: 75.2.60.5
Proxy: ❌ DNS only (gray cloud)
TTL: Auto
```

## 🚀 Exact Steps in Cloudflare

### Step 1: Delete Old Records
1. Go to Cloudflare dashboard → DNS → Records
2. **Delete** existing A records for `@` (lumerakai.ai)
3. **Delete** existing A records for `www`

### Step 2: Add New Records
**Choose CNAME (Option 1) - Better performance:**
```
Record 1:
Type: CNAME
Name: @
Target: apex-loadbalancer.netlify.com
Proxy status: DNS only (gray cloud)

Record 2:
Type: CNAME  
Name: www
Target: apex-loadbalancer.netlify.com
Proxy status: DNS only (gray cloud)
```

### Step 3: Critical Settings
- **Proxy Status**: MUST be gray cloud (DNS only)
- **TTL**: Auto or 300 seconds
- **No orange cloud**: Netlify needs direct access

## ⏱️ Timeline
- **DNS update**: Immediate
- **Propagation**: 5-30 minutes
- **Netlify verification**: 5-60 minutes
- **SSL certificate**: Automatic after verification

## 🔍 Verify Configuration
```bash
# Check DNS propagation
dig lumerakai.ai

# Should show:
# lumerakai.ai. 300 IN CNAME apex-loadbalancer.netlify.com.
```

## 🎯 Why CNAME is Better
- **Load balancing**: Netlify can route to best server
- **Automatic failover**: Better reliability
- **CDN optimization**: Full CDN benefits
- **Future-proof**: Netlify can update IPs without your changes

## ✅ Expected Result
After DNS propagates:
- `https://lumerakai.ai` → Your Netlify site
- `https://www.lumerakai.ai` → Your Netlify site  
- Automatic SSL certificate
- Fast global CDN delivery

The key is using **gray cloud (DNS only)** in Cloudflare so Netlify can manage the domain properly!