# 🌍 Earthmender v3: Circular Economy Marketplace

Transitioning Earthmender from a civic reporting tool into a full-scale ecosystem connecting **Households (Menders)**, **Collectors**, **Recyclers**, and **Manufacturers**. 

This plan outlines the architecture and user flows required to support scheduling, proximity/price comparisons, and digital payments for recyclable materials.

---

## 🛑 User Review Required

> [!WARNING]  
> This is a massive architectural expansion. Before we begin coding, please review the proposed flows and answer the open questions below to ensure the technical design matches your business vision.

## ❓ Open Questions

1. **Payments**: Are we building an internal "Wallet" system where users earn digital credits that they withdraw later, or are we integrating a live payment gateway (like Paystack or Flutterwave) to pay them instantly in Naira upon collection?
2. **Pricing Mechanism**: Who sets the prices for recyclables? Does Earthmender set a global market rate (e.g., ₦50/kg for PET plastic), or do individual Recyclers set their own competitive bids for the users to compare?
3. **Weight Verification**: Users will scan materials, but how is the exact weight/volume determined for payment? Does the collector weigh it at the doorstep with a portable scale and input the final figure to release payment?
4. **Roles**: Do we need distinct dashboards for **Recyclers** (who process the waste) and **Manufacturers** (who buy bulk processed materials), or should we focus just on the Household -> Collector flow first?

---

## 🛠️ Proposed Architectural Changes

### 1. Database Expansion (Appwrite)
We need to expand our collections to handle the marketplace mechanics:
- `users`: Add roles array `["mender", "collector", "recycler", "manufacturer"]`.
- `transactions`: Track payments, escrows, and wallet balances.
- `bids_pricing`: Collection of current market rates set by recyclers.
- `pickups`: A new model replacing/augmenting `reports`. Tracks scheduled time, location, assigned collector, estimated material type/weight, and final payout.

### 2. The New Mender (Household) Flow
1. **Identify**: User points the AI camera at their sorted recyclables (e.g., Plastics, Cartons). The AI tags the material.
2. **Estimate**: User inputs rough quantity (e.g., "2 bags").
3. **Compare & Choose**: The app fetches nearby Recyclers/Collectors. A UI card shows their distance, rating, and offering price (e.g., *EcoHub: 2km away, offering ₦60/kg*).
4. **Schedule**: User selects a collector and picks a time slot.
5. **Get Paid**: Upon arrival, the collector verifies the weight, hits "Complete Pickup" on their app, and the user's digital wallet is credited instantly.

### 3. The Collector / Recycler Dashboard
- **Marketplace Queue**: Instead of just seeing "Hotspots", collectors see a board of "Available Pickups" in their radius.
- **Routing Engine**: Our existing OSRM live-tracking map routes the collector from household to household efficiently.
- **Verification Portal**: A mobile flow allowing the collector to scan a QR code from the user or manually input the final weight to trigger the smart contract / payment transfer.

### 4. Digital Payment Infrastructure
- Build a **Wallet UI** in the Mender dashboard showing Total Earned, Pending Escrow, and a "Withdraw to Bank" feature.
- Use a backend worker (FastAPI or Appwrite Functions) to securely handle ledger mathematics and talk to external payout APIs.

---

## 🚀 Phased Implementation Strategy

To avoid breaking the current stable v2, we will build this out in distinct phases:

### Phase 1: Scheduling & Proximity
- Add the `pickups` database schema.
- Update the Report Studio so users can switch between "Report Hotspot" and "Schedule Pickup".
- Build the UI for users to see a list of nearby collectors.

### Phase 2: The Collector Verification Flow
- Update the Operator/Collector dashboard to accept scheduled pickups.
- Create the "Completion & Weight Verification" UI.

### Phase 3: Digital Wallet & Payments
- Build the Wallet dashboard.
- Implement the backend logic to credit accounts when a pickup is verified.

### Phase 4: Recycler/Manufacturer Tiers (Future)
- Build B2B portals for bulk material trading.
