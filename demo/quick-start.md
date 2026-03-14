# LumeraKai Health - Quick Start Demo

## 🚀 Run the Demo

```bash
# 1. Clone the repository
git clone https://github.com/kakarath/lumerakai-health.git
cd lumerakai-health

# 2. Set up environment
cp .env.example .env
# Add your API keys to .env

# 3. Start the demo
./start-dev.sh
```

## 🎯 Demo Scenarios

### Maria's Care Coordination
Experience how LumeraKai agents collaborate to resolve scheduling conflicts:

```bash
./demo/run-demo.sh
```

**Scenario**: Maria has dental surgery and chiro appointment on same day
**Result**: AI agents coordinate to reschedule and prevent medication conflicts

## 🌐 Access Points

- **Web Dashboard**: http://localhost:3000
- **API Endpoints**: http://localhost:3001
- **Assistant Service**: http://localhost:3002

## 🤖 Multi-Agent System

- **Lumera-Doc**: Clinical decision support
- **Lumera-Nurse**: Care coordination
- **Lumera-Patient**: Patient communication
- **Lumera-Admin**: Scheduling optimization

## 📋 Requirements

- Node.js 18+
- Docker Desktop
- Google/Mistral API keys (optional: Ollama for local AI)

## 🏥 Healthcare Impact

- Prevents scheduling conflicts
- Reduces redundant care
- Improves patient-family-provider communication
- Enhances care quality through AI insights