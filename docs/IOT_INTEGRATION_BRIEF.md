# IoT Integration Brief: Washing Machine Monitoring System
## The Roslyn, Tapestry Collection by Hilton

---

## 1. Context and Need

### Current Problem
- Dependence on walkie-talkies to coordinate washing machine usage
- Operational friction and time loss
- Lack of real-time visibility into washing machine status
- Need to optimize processes for housekeeping team

### Objective
Connect the washing machine to the web application via IoT sensors to:
- Automatically detect when the washing machine is in use
- Display real-time status in the app
- Eliminate need for walkie-talkie communication
- Improve operational efficiency

---

## 2. IoT Sensor Options

### Option A: Smart Plug with Energy Monitoring (Recommended)

**Advantages:**
- Simple installation (plug-in)
- No modifications to washing machine
- Detects consumption and cycles
- Available APIs (TP-Link Kasa, Shelly, Sonoff)
- Cost: $30-80 USD per unit

**Suggested Products:**
- **Shelly Plus 1PM** ($25-35)
- **TP-Link Kasa HS300** ($60-80)
- **Sonoff POW R2** ($30-40)

**How it works:**
- Monitors consumption in real-time
- Detects start/end of cycle through consumption patterns
- Sends webhooks or app queries REST API

---

### Option B: Vibration Sensor

**Advantages:**
- Detects movement/vibration
- Accurate for detecting usage
- Long battery life

**Disadvantages:**
- Requires physical mounting
- More complex to configure
- May require IoT gateway

**Suggested Products:**
- ESP32 with ADXL345 sensor ($10-15)
- Aqara Vibration Sensor ($20-30)
- Fibaro Motion Sensor ($40-50)

---

### Option C: Current Sensor (Clamp)

**Advantages:**
- Non-invasive (clamps onto cable)
- Very accurate
- Detects actual consumption

**Disadvantages:**
- Requires professional electrical installation
- More expensive
- Needs gateway

**Suggested Products:**
- Shelly EM ($40-50)
- IotaWatt ($80-100)

---

## 3. Proposed Technical Architecture

### Recommended Architecture: Smart Plug + API Gateway

```
┌─────────────────┐
│  Smart Plug     │───(WiFi)───┐
│  (Shelly/TP-Link)│            │
└─────────────────┘            │
                               │
┌─────────────────┐            │
│  Washing Machine│            │
│  (Hardware)     │            │
└─────────────────┘            │
                               ▼
                    ┌──────────────────┐
                    │  API Gateway     │
                    │  (Next.js API)   │
                    │  /api/iot/status │
                    └──────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │  Web App         │
                    │  (Dashboard)     │
                    │  Real-time Status│
                    └──────────────────┘
```

### Data Flow

1. Smart Plug monitors consumption every 5-10 seconds
2. Detects washing pattern (consumption > threshold)
3. Sends webhook or app queries plug API
4. API Gateway processes and updates status
5. Dashboard displays real-time status
6. Optional notifications to team

---

## 4. Technical Implementation

### Phase 1: Basic Integration (Smart Plug)

```typescript
// src/lib/iot/washer-monitor.ts

interface WasherStatus {
  isRunning: boolean;
  powerConsumption: number; // watts
  lastUpdated: string;
  cycleStartTime?: string;
}

// For Shelly Plus 1PM
export async function getWasherStatus(): Promise<WasherStatus> {
  const response = await fetch(`http://${SHELLY_IP}/rpc/Switch.GetStatus?id=0`);
  const data = await response.json();
  
  const power = data.apower || 0; // Active power in watts
  const isRunning = power > 50; // Threshold for washer running
  
  return {
    isRunning,
    powerConsumption: power,
    lastUpdated: new Date().toISOString(),
  };
}
```

### Phase 2: Automatic Updates in Dashboard

```typescript
// In DashboardClient.tsx
useEffect(() => {
  const interval = setInterval(async () => {
    const status = await getWasherStatus();
    setWasherStatus(status);
    
    // If detects completion, automatically update load
    if (prevStatus?.isRunning && !status.isRunning) {
      // Washer finished - notify or update status
    }
  }, 5000); // Every 5 seconds
  
  return () => clearInterval(interval);
}, []);
```

### Phase 3: Webhook (Optional, More Efficient)

```typescript
// src/app/api/iot/webhook/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  // Shelly sends webhook when status changes
  const isRunning = data.apower > 50;
  
  // Update real-time status (WebSocket or Server-Sent Events)
  // Or save to database for query
  
  return NextResponse.json({ ok: true });
}
```

---

## 5. Considerations for Luxury Hotel

### Requirements
- High reliability (uptime > 99%)
- Network security (separate VLAN)
- Minimal maintenance
- Scalability (multiple washers/dryers)
- Integration with existing systems

### Recommendations

**1. Dedicated IoT Network**
- Separate VLAN
- Firewall rules
- Secure authentication

**2. Backup and Redundancy**
- Manual fallback if IoT fails
- Event logs
- Failure alerts

**3. Professional UI/UX**
- Clear indicators
- Discrete notifications
- Usage history

---

## 6. Estimated Costs

### Budget Option (Basic Smart Plug)
- Shelly Plus 1PM: $30 USD
- Installation/configuration: 2-4 hours
- API development: 8-16 hours
- **Total hardware: $30-60 USD**
- **Total development: $800-1,600 USD** (if contracted)

### Premium Option (Multiple Sensors)
- 2x Smart Plugs (washer + dryer): $60-80 USD
- IoT Gateway (optional): $50-100 USD
- Professional installation: $200-400 USD
- Complete development: $2,000-4,000 USD
- **Total: $2,310-4,580 USD**

### Estimated ROI
- Time savings: ~10-15 min per load
- Reduced operational friction
- Better team experience
- **Expected ROI: 3-6 months**

---

## 7. Implementation Plan

### Phase 1: Proof of Concept (2 weeks)
1. Purchase 1x Smart Plug (Shelly Plus 1PM)
2. Configure on hotel WiFi network
3. Develop basic reading API
4. Integrate into current dashboard
5. Testing with real team

### Phase 2: Production (2-3 weeks)
1. Install Smart Plug on main washing machine
2. Configure network security
3. Develop complete system with webhooks
4. Add notifications
5. Team training

### Phase 3: Expansion (Optional, 1-2 weeks)
1. Add sensors to dryers
2. Enhanced dashboard with history
3. Analytics and reports
4. Integration with other hotel systems

---

## 8. Recommended Next Steps

### Immediate
1. Approve budget ($500-1,000 USD initial)
2. Purchase 1x Shelly Plus 1PM for testing
3. Define WiFi network for IoT
4. Assign developer/development time

### Technical
1. Review current washing machine specifications
2. Verify WiFi access near washing machine
3. Define consumption thresholds (watts)
4. Design notification flow

### Operational
1. Train team on app usage
2. Establish protocol if sensor fails
3. Document operational process

---

## 9. Final Recommendation

**Recommended Solution: Shelly Plus 1PM + API Gateway**

**Reasons:**
- Excellent cost-benefit ratio
- Simple installation
- Reliable for commercial environment
- Scalable to multiple machines
- Compatible with IoT standards

**Premium Alternative:** If budget allows, consider professional system such as:
- Schneider Electric Smart Plug
- Siemens IoT Solutions
- Integration with hotel BMS system

---

## 10. Questions to Refine

1. How many washers/dryers are there in total?
2. Are they all in the same location?
3. Is there WiFi access near the machines?
4. Do you prefer plug-and-play solution or professional installation?
5. Do you need history/analytics or just current status?
6. Are there other equipment you want to monitor (dryers, etc.)?

---

## 11. Technical Specifications

### Shelly Plus 1PM Specifications
- **Power Monitoring:** Yes (active power, voltage, current)
- **WiFi:** 2.4 GHz (802.11 b/g/n)
- **API:** REST API + Webhooks
- **Power Rating:** Up to 16A (3,680W)
- **Dimensions:** 42 x 42 x 20 mm
- **Certification:** CE, RoHS, EAC

### Network Requirements
- WiFi 2.4 GHz network
- Static IP assignment (recommended)
- Port forwarding for webhooks (optional)
- Firewall rules for API access

### API Endpoints (Shelly)

**Get Status:**
```
GET http://[SHELLY_IP]/rpc/Switch.GetStatus?id=0
Response: {
  "id": 0,
  "source": "switch",
  "output": true,
  "apower": 125.5,  // Active power in watts
  "voltage": 120.2,
  "current": 1.045,
  "aenergy": { "total": 1234.56 }
}
```

**Webhook Configuration:**
```
POST http://[SHELLY_IP]/rpc/Webhook.Set
Body: {
  "url": "https://your-app.com/api/iot/webhook",
  "events": ["switch:on", "switch:off", "switch:update"]
}
```

---

## 12. Security Considerations

### Network Security
- **VLAN Isolation:** Separate VLAN for IoT devices
- **Firewall Rules:** Only allow necessary ports
- **Authentication:** Use device authentication tokens
- **Encryption:** HTTPS for all API communications

### Data Privacy
- No personal data stored
- Only operational status data
- Compliant with hotel data policies
- Logs for audit purposes

---

## 13. Maintenance and Support

### Regular Maintenance
- **Monthly:** Check device connectivity
- **Quarterly:** Review logs and performance
- **Annually:** Update firmware if available

### Support Plan
- **Documentation:** User manual and troubleshooting guide
- **Training:** Initial training session for IT team
- **Backup Plan:** Manual process if device fails
- **Contact:** Vendor support for hardware issues

---

## 14. Success Metrics

### Key Performance Indicators (KPIs)
- **Uptime:** > 99% device availability
- **Response Time:** < 5 seconds status update
- **Accuracy:** > 95% correct cycle detection
- **User Adoption:** 100% team using app instead of walkie-talkie
- **Time Savings:** 10-15 minutes per load cycle

### Monitoring Dashboard
- Device status
- API response times
- Error rates
- Usage statistics
- Alert history

---

## 15. Timeline Summary

| Phase | Duration | Activities |
|-------|----------|------------|
| **Phase 1: POC** | 2 weeks | Purchase, install, basic API, testing |
| **Phase 2: Production** | 2-3 weeks | Full integration, security, training |
| **Phase 3: Expansion** | 1-2 weeks | Additional sensors, analytics (optional) |
| **Total** | 5-7 weeks | Complete implementation |

---

## 16. Risk Assessment

### Potential Risks
1. **Device Failure:** Mitigation - backup manual process
2. **Network Issues:** Mitigation - redundant connectivity
3. **False Positives:** Mitigation - threshold calibration
4. **Integration Complexity:** Mitigation - phased approach

### Mitigation Strategies
- Start with single device (POC)
- Maintain manual process as backup
- Regular testing and calibration
- Clear documentation and training

---

## Appendix: Product Links and Resources

### Shelly Plus 1PM
- **Official Website:** https://shelly-support.eu/products/shelly-plus-1pm
- **Documentation:** https://shelly-api-docs.shelly.cloud/
- **Purchase:** Amazon, Shelly Store, authorized distributors

### Alternative Products
- **TP-Link Kasa:** https://www.tp-link.com/us/kasa-smart/
- **Sonoff:** https://sonoff.tech/

### Development Resources
- **Shelly API Docs:** https://shelly-api-docs.shelly.cloud/gen1/
- **Webhook Guide:** https://shelly-support.eu/announcement/webhooks
- **Community Forum:** https://community.shelly.cloud/

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-27  
**Prepared for:** The Roslyn, Tapestry Collection by Hilton  
**Contact:** [Your Contact Information]
