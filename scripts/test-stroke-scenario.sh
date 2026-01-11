#!/bin/bash

echo "🧹 Cleaning up Docker environment..."
docker-compose down --volumes --remove-orphans
docker system prune -f
docker volume prune -f

echo "🚀 Starting fresh Docker environment..."
docker-compose up -d --build

echo "⏳ Waiting for services to start..."
sleep 30

echo "🧠 Testing Enhanced Stroke Care Scenario"
echo "Based on real family experience with medical expertise"
echo "========================================================="

# Test the enhanced scenario
echo "🎪 Testing Enhanced Stroke Scenario..."
echo ""
echo "👩‍⚕️ Scenario: 79-year-old stroke patient with T2D and confabulation"
echo "🎓 Family Caregiver: Pre-med + Lifestyle Medicine certified"
echo "🍽️ Challenge: Confabulation-driven sweet cravings vs T2D management"
echo "💆 Therapy: Left-side hypersensitivity requiring massage"
echo "🧠 Cognitive: Maintaining engagement and motivation"
echo ""

# Open demo in browser
echo "🌐 Opening demo in browser..."
open "http://localhost:3000/dashboard"

echo ""
echo "🎯 Demo Test Instructions:"
echo "=========================="
echo "1. Select 'Stroke Recovery Crisis Prevention' scenario"
echo "2. Watch AI agents coordinate complex care"
echo "3. Notice integration of family medical expertise"
echo "4. Test interactions with these messages:"
echo ""
echo "   💬 Try these test messages:"
echo "   • 'Patient is craving sweets but has diabetes'"
echo "   • 'How do we manage Metformin with confabulation?'"
echo "   • 'Left side hypersensitivity is increasing'"
echo "   • 'Family caregiver has medical background'"
echo "   • 'Need cognitive stimulation activities'"
echo ""
echo "🎪 Key Demo Points to Highlight:"
echo "• Expert family caregiver integration (unique value)"
echo "• Complex T2D + confabulation management"
echo "• Therapeutic massage coordination"
echo "• Medical expertise recognition and utilization"
echo "• Real-world validation from personal experience"
echo ""
echo "✅ This scenario demonstrates:"
echo "• First AI system to integrate family medical expertise"
echo "• Complex multi-condition coordination"
echo "• Personal story validation"
echo "• Market differentiation from competitors"
echo ""
echo "🎬 Ready for your demo practice!"
echo "Press Ctrl+C when done testing"

# Keep script running
while true; do
    sleep 60
done