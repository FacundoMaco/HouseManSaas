# HouseMen SaaS - Product Documentation

## Overview

HouseMen SaaS is a minimal, mobile-first web app designed to manage laundry loads, washer and dryer timers, and daily housekeeping tasks. It is built for fast deployment and low operational friction.

---

## Core Features

- Load creation with predefined types and optional notes
- Washer and dryer timers with clear next-step actions
- Automatic dryer assignment when a unit is available
- Basic daily checklist with progress tracking

---

## Technical Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- LocalStorage for persistence

---

## Data Model (Summary)

**Load**
- type, status, timestamps, durations, dryer number, notes

**Task**
- label, completion state, timestamp

---

## Storage and Persistence

- All operational data is stored locally in the browser using localStorage.
- No backend or server database is required for the current version.

---

## Authentication

- Simple local credential check
- Default credentials should be changed before use in production

---

## Current Limitations

- Single-device localStorage only
- No multi-user sync yet
- No backend or API layer yet

---

## Production Readiness Notes

- Change the default password before production use.
- If scaling to multiple users or properties, add a backend with user roles and sync.
- The current version stores no guest PII and keeps operational data local to the device.

---

## Deployment

- Deploy with Vercel or any standard Next.js hosting provider.
- No environment variables required for the current version.

---

## Support and Next Steps

- Recommended: start with a pilot and define success metrics up front.
- Optional roadmap: IoT sensor integration for automated cycle detection.

---

Prepared for: Woodland Real Estate  
Date: January 2026
