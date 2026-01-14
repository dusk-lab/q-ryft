# Qryft

**QR, done differently.**

Qryft is a modern **QR infrastructure platform** designed to fix what traditional QR SaaS tools get wrong.

Most QR generators create brittle, disposable codes tied to fixed URLs. When links change, QR codes break.

Qryft introduces a different model:

> **Permanent QR codes with dynamic destinations.**

Once a Qryft QR is created, the image never needs to change — only the destination does.

---

## What Qryft Is

Qryft is not just a QR code generator.

It is:

* A **stable redirect layer** for QR codes
* A way to update destinations without reprinting or redistributing QR images
* A privacy-respecting system for basic scan insights

Think of Qryft as:

```
QR → Qryft ID → Routing → Destination
```

---

## Core Features

### Static QR Codes (Free)

* Generate QR codes for any URL
* Download as PNG or SVG
* No watermarks
* Unlimited usage

### Dynamic QR Codes (Qryft Links)

* QR points to a permanent Qryft link
* Destination URL can be edited anytime
* QR image never changes

### Scan Insights

* Total scan count
* Last scan timestamp
* Device type (mobile / desktop)

No fingerprinting. No user profiling.

---

## Free vs Paid (High-Level)

### Free

* Unlimited static QR codes
* Up to **5 active dynamic Qryft links**
* Unlimited destination edits
* Basic analytics with 30-day retention
* Shared Qryft domain

### Qryft Pro (Planned)

* Unlimited dynamic Qryft links
* Advanced analytics and exports
* Custom domains with SSL
* Smart routing rules
* API access

---

## Philosophy

Qryft is built with a few non-negotiable principles:

* **QR codes should be permanent**
* **Links should be flexible**
* **Privacy should be respected by default**
* **Infrastructure beats gimmicks**

We deliberately avoid ads, dark patterns, and invasive tracking.

---

## Current Status

Qryft is in **early development**.

Initial focus:

* Clean core model
* Simple UI
* Reliable redirect behavior

You can follow progress and plans in [`plans.md`](./plans.md).

---

## Tech Stack (Initial)

* React (Vite)
* Static hosting (GitHub Pages)
* Backend planned separately

The architecture is intentionally simple and extensible.

---

## Roadmap Snapshot

* v1: Static + dynamic QR, basic insights
* v2: Accounts, dashboard, better analytics
* v3: Teams, APIs, developer tooling

---

## License

To be decided.

---

Qryft is built by **Dusk Lab** with a focus on correctness, clarity, and long-term reliability.
