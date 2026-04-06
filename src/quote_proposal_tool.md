# Interior Quotation System — Blueprint

This will be your blueprint for a professional interior quotation system.

---

## 1. Core Architecture

```
Quote
 ├── Client Details
 ├── Project Details
 ├── Rooms
 │     ├── Components (Line Items)
 │     └── Room Subtotal
 ├── Add-ons / Extras
 ├── Material Specifications
 ├── Payment Terms
 ├── Summary (Totals, GST, Discount)
 └── Notes / Terms
```

---

## 2. Data Model

### Quote Object

```json
{
  "quoteId": "QT-001",
  "revision": 1,
  "date": "2026-04-05",
  "validTill": "2026-04-20",
  "client": { "name": "", "phone": "", "email": "", "address": "" },
  "project": { "name": "2BHK Interior", "location": "", "type": "Residential" },
  "rooms": [],
  "addons": [],
  "materials": {},
  "pricing": {},
  "terms": {}
}
```

### Room Structure

```json
{
  "roomName": "Living Room",
  "items": [],
  "subtotal": 0
}
```

### Line Item (Core of your system)

```json
{
  "category": "Storage / Display / Aesthetic / Functional",
  "component": "TV Unit / Wardrobe / Panel",
  "structure": "Box / Panel / Frame / Semi-Box / Profile Box",
  "surfaceFinish": "Laminate / Veneer / Acrylic",
  "material": { "core": "BWP Ply", "finish": "1mm Laminate", "hardware": "Hettich" },
  "dimensions": { "length": 72, "height": 48, "depth": 18 },
  "unit": "sqft",
  "quantity": 1,
  "rate": 2200,
  "amount": 0,
  "calculationType": "AREA",
  "included": true,
  "remarks": ""
}
```

### Add-ons / Extras

```json
{
  "name": "Wallpaper",
  "type": "LUMPSUM",
  "amount": 59500,
  "included": true
}
```

---

## 3. Calculation Engine (Critical Logic)

### Area Calculation

```
SFT = (Length × Height) / 144
Amount = SFT × Rate
```

### Types of Calculation

| Type     | Use                |
| -------- | ------------------ |
| AREA     | Wardrobe, panels   |
| LENGTH   | Kitchen running ft |
| UNIT     | Beds, chairs       |
| LUMPSUM  | Design, transport  |

### Example Logic (JS)

```js
function calculateItem(item) {
  let area = (item.dimensions.length * item.dimensions.height) / 144;

  if (item.calculationType === "AREA") {
    item.amount = area * item.rate;
  }

  if (item.calculationType === "UNIT") {
    item.amount = item.quantity * item.rate;
  }

  return item.amount;
}
```

---

## 4. Pricing Structure

```json
{
  "subtotal": 0,
  "addonsTotal": 0,
  "discount": 0,
  "gstPercent": 18,
  "gstAmount": 0,
  "grandTotal": 0
}
```

---

## 5. PDF Structure (Final Output Layout)

1. **Header** — Logo, Company name, Quote ID, Date
2. **Client & Project Info**
3. **Room-wise Tables** — Each room:

   | Category | Component | Structure | Finish | L | H | Qty | Rate | Amount |
   | -------- | --------- | --------- | ------ | - | - | --- | ---- | ------ |

4. **Add-ons Section**
5. **Material Specifications** — Ply brand, Laminate type, Hardware brand
6. **Summary**

   | Description | Amount |
   | ----------- | ------ |
   | Subtotal    | ₹      |
   | Add-ons     | ₹      |
   | GST         | ₹      |
   | **Total**   | **₹**  |

7. **Terms & Conditions** — Payment slabs, Exclusions, Warranty
8. **Signature Section**

---

## 6. UI Design (Frontend)

### Form Steps

1. Client Details
2. Add Rooms
3. Add Items per Room
4. Add Add-ons
5. Pricing & GST
6. Preview + Export PDF

---

## 7. Smart Features (Differentiator)

### Auto Suggestions

If user selects "Wardrobe" → auto fill: Structure = Box, Depth = 24, Rate preset

### Rate Card System

```json
{
  "Box_Laminate": 2200,
  "Panel_Laminate": 1500,
  "Profile_Acrylic": 2800
}
```

### Theme Mode

- Light (client)
- Dark luxury (premium branding)

### Templates

- 1BHK
- 2BHK
- Villa

### Dimension Presets

- Wardrobe height → 84 / 96
- Kitchen counter → 34 height