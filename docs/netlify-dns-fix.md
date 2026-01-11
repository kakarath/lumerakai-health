# Fix Netlify DNS Verification

## 🎯 Problem
"lumerakai.ai doesn't appear to be served by Netlify" - DNS still points to Cloudflare Pages

## ✅ Quick Fix (5 minutes)

### Step 1: Get Netlify DNS Info
In your Netlify dashboard:
1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain** → Enter `lumerakai.ai`
3. Netlify will show you the required DNS records

### Step 2: Update Cloudflare DNS
In Cloudflare dashboard for lumerakai.ai:

**Replace existing A records with:**
```
Type: A
Name: @
Content: 75.2.60.5
Proxy: ❌ DNS only (gray cloud)

Type: CNAME  
Name: www
Content: your-site-name.netlify.app
Proxy: ❌ DNS only (gray cloud)
```

**Or use Netlify's specific IPs (they'll tell you):**
```
Type: A
Name: @
Content: [Netlify will provide IP]
Proxy: ❌ DNS only (gray cloud)
```

### Step 3: Disable Cloudflare Proxy
**IMPORTANT**: Turn off the orange cloud ☁️ for both records
- Click the orange cloud to make it gray
- This allows Netlify to handle SSL certificates

### Step 4: Wait and Verify
- **DNS propagation**: 5-15 minutes
- **SSL certificate**: Netlify generates automatically
- **Verification**: Netlify will confirm domain ownership

## 🔍 Check Progress
```bash
# Check DNS propagation
dig lumerakai.ai

# Should show Netlify IP, not Cloudflare
```

## ⏱️ Timeline
- **DNS update**: 2 minutes
- **Propagation**: 5-15 minutes  
- **SSL certificate**: Automatic
- **Site live**: Within 30 minutes

## 🎯 Alternative: Use Netlify Nameservers
If DNS issues persist:
1. **Netlify**: Site settings → Domain management → **Use Netlify DNS**
2. **Cloudflare**: Change nameservers to Netlify's
3. **Benefit**: Netlify handles everything automatically

The key is turning off Cloudflare proxy (gray cloud) so Netlify can manage the domain!