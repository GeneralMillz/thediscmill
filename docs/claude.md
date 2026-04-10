# `claude.md`  
### **The Disc Mill — Monetization Layer & Platform Integration Guide**  
*This document defines how Claude must think, plan, and execute monetization and future expansion tasks for The Disc Mill.*

---

# 🌐 **1. Project Identity**
The Disc Mill is a **national, open‑data, client‑side disc golf platform**.  
It is a **media + discovery ecosystem**, not a retailer.

The platform helps players:
- Find discs  
- Build bags  
- Learn how to throw  
- Explore courses  
- Return lost discs  
- Understand flight numbers  

Monetization must be **native**, **ethical**, **client‑side**, and **zero‑regression**.

---

# 🧱 **2. Architecture Contract (Non‑Negotiable)**

Claude must always follow these rules:

### **Client‑Side Only**
- No backend routes  
- No server‑side fetches  
- No persistent storage  
- No SSR  
- No backend creep  

### **Additive‑Only**
- Never break existing tools  
- Never regress UI or functionality  
- All changes must be modular and isolated  

### **Modular**
- Every monetization provider is a drop‑in module  
- No hard‑coded URLs in UI components  
- All product metadata lives in client‑side JSON  

### **Beginner‑First**
- Recommendations must be honest  
- No hype, no fake reviews  
- No deceptive placements  

### **Scalable**
- Must support Amazon + every disc golf brand  
- Must support sponsorships and paid placements  
- Must support future media partnerships  

---

# 🧩 **3. Monetization Providers**

Claude must treat monetization as a **provider system**.

## **A. Amazon Associates (General Gear Layer)**
Used for:
- Starter sets  
- Bags  
- Shoes  
- Tripods  
- Rangefinders  
- Training tools  
- Books  
- Accessories  

### Implementation:
```
/affiliates/
  amazon.js
```

Exports:
- `isAvailable`
- `linkFor(asin)`
- `metadata`

---

## **B. Disc Golf Brand Modules (High‑Conversion Layer)**

Phase 1 brands:
- Infinite Discs  
- OTB Discs  
- Discmania Store  
- MVP / Axiom / Streamline  
- Dynamic Discs / Trilogy  
- Discraft  
- Thought Space Athletics  
- Upper Park  
- GripEQ  
- Bushnell  

Each brand gets its own module:

```
/affiliates/
  infinite.js
  otb.js
  discmania.js
  mvp.js
  ...
```

Each module exports:
- `isAvailable`
- `linkFor(sku)`
- `metadata` (brand name, logo, supported products)

Claude must generate new modules in this format.

---

# 🧬 **4. Monetization Integration Points**

Claude must integrate monetization **natively** into the platform’s tools.

## **A. Disc Finder**
When a user selects a disc:
- Flight numbers  
- Stability explanation  
- Beginner notes  
- **“Where to Buy” panel** (Amazon + brand modules)  
- Optional **Sponsored** badge  

## **B. Bag Builder**
When a slot is empty:
- Suggest discs by role  
- Provide affiliate links  
- Allow sponsored suggestions  

## **C. How to Throw Engine**
Each tutorial step may include:
- Recommended putter  
- Recommended midrange  
- Recommended fairway  
- Training tools  
- Tripods  

## **D. Course Pages**
- “Recommended gear for this course”  
- Weather‑aware suggestions  
- Optional sponsored placements  

## **E. Disc Return Network**
Ethical, optional:
- “Thanks for using the Disc Return Network”  
- Optional small sponsor logo  

---

# 📄 **5. Sponsorship System (For Manufacturers)**

Claude must support a sponsorship layer that allows manufacturers to pay for:

### **Sponsored Slots**
- Featured disc in Disc Finder  
- Sponsored beginner set  
- Sponsored Bag Builder suggestions  
- Sponsored tutorial gear  
- Sponsored SEO page placement  
- Spotlight Manufacturer section  

### **Payment Models**
Claude must support these models conceptually (no backend):
- Monthly sponsorship fee  
- Per‑click (client‑side tracked)  
- Hybrid  

### **UI Components Needed**
- `<SponsoredBadge />`  
- `<FeaturedPlacement />`  
- `<SpotlightManufacturer />`  

---

# 📈 **6. SEO Monetization Pages**

Claude must generate and maintain high‑intent, evergreen pages:

- Best Discs for Beginners  
- Best Putters for Straight Throws  
- Best Bags for New Players  
- Best Shoes for Disc Golf  
- Best Rangefinders for Disc Golf  
- Best Starter Sets  
- Best Midranges for Control  
- Best Fairways for Low Power  

Each page:
- 100% static  
- Honest, beginner‑first  
- Product cards with affiliate links  
- Schema markup  

---

# 🧩 **7. Product Catalog Schema**

Claude must use a consistent JSON schema:

```
{
  "id": "unique-id",
  "name": "Product Name",
  "brand": "Brand Name",
  "type": "disc | bag | shoe | accessory | training",
  "role": "putter | midrange | fairway | driver | etc",
  "asin": "optional Amazon ASIN",
  "sku": "optional brand SKU",
  "flight": { "speed": 7, "glide": 5, "turn": -1, "fade": 2 },
  "beginnerNotes": "string",
  "sponsored": false
}
```

---

# 🧠 **8. Claude’s Operating Mode**

When working on monetization tasks, Claude must:

### **1. Propose architecture first**  
Never jump straight into code.

### **2. Confirm zero regressions**  
Every change must preserve existing behavior.

### **3. Generate modular code**  
One file at a time, dependency‑ordered.

### **4. Use the provider system**  
Never hard‑code affiliate URLs.

### **5. Keep everything client‑side**  
No backend, no server fetches.

---

# 🚀 **9. Future Expansion (Fully Wrapped Up)**

Claude must plan for and support the following future expansions. These are not optional — they define the long‑term roadmap of The Disc Mill.

## **A. Additional Brand Modules**
- Add new manufacturers as they reach out  
- Auto‑generate modules from a template  
- Maintain consistent metadata and link patterns  

## **B. Seasonal Gear Guides**
- Winter discs  
- Summer grip gear  
- Rain gear  
- Tournament prep kits  
- Beginner seasonal bundles  

## **C. Tournament Gear Bundles**
- “What to bring to your first tournament”  
- Sponsored tournament bundles  
- Brand‑specific tournament kits  

## **D. Spotlight Manufacturer Rotation**
- Monthly or seasonal spotlight  
- Paid placement  
- Rotates automatically  
- Uses `<SpotlightManufacturer />` component  

## **E. Beginner Gear Funnels**
- “Start Here” gear path  
- Beginner putter → midrange → fairway progression  
- Sponsored beginner sets  
- Amazon + brand module integration  

## **F. National Course‑Based Gear Recommendations**
- Each course page can recommend gear based on:  
  - Terrain  
  - Weather  
  - Difficulty  
  - Beginner friendliness  
- Optional sponsored placements  

## **G. Newsletter Sponsorships (Optional Future)**
- Monthly gear highlights  
- Sponsored disc of the month  
- Beginner tips + gear recommendations  

## **H. Data‑Driven Gear Insights (Client‑Side Only)**
- Most clicked discs  
- Most viewed brands  
- Most popular beginner sets  
- All tracked client‑side only  

## **I. Expansion of the Disc Return Network**
- Optional sponsor branding  
- “Powered by [Brand]”  
- Ethical, minimal, non‑intrusive  

---

# 🏁 **10. Summary**

This document defines:

- How monetization works  
- Where monetization integrates  
- How affiliate providers are structured  
- How sponsorships work  
- How Claude must think and operate  
- What constraints Claude must obey  
- The full future expansion roadmap  

This is the **canonical monetization + expansion blueprint** for The Disc Mill.

---
