# Brand Card Assets Audit Report

This report contains the updated audit of all brand card PNG files in `src/assets/brands/`, including filesystem metadata, exact dimensions, file sizes, and computed SHA-256 cryptographic hashes.

A visual contact sheet displaying all audited assets is saved at [`src/assets/brands/brand-card-contact-sheet.png`](file:///c:/Users/jayan/Desktop/Wouchify_desktop/src/assets/brands/brand-card-contact-sheet.png).

---

## Audit Table

| Filename | Dimensions | File Size | SHA-256 | Complete full card? | Detected brand |
|---|---:|---:|---|---|---|
| `amazon.png` | 406×406 | 54,843 bytes | `8283c83c5d4d627377573e7eaf44aada33dc6563d006db72352b2390342a4cc1` | **YES** | Amazon |
| `ajio.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `bigbasket.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `firstcry.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `flipkart.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `jiomart.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `meesho.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `myntra.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `nykaa.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `pepperfry.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `quikrjobs.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `reliancedigital.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `snapdeal.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `swiggy.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `zepto.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `zivame.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |
| `zomato.png` | 398×398 | 3,982 bytes | `b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572` | **NO** (Mask layer only) | None |

---

## Key Observations

1. **Complete Full Card (`amazon.png`):**
   - Contains all required visual layers:
     - Peach outer card
     - Round discount badge (`80% off`)
     - White logo container
     - Amazon merchant logo
     - Navy reward strip
     - W-ticket reward badge (`UP TO 10% REWARDS`)
   - Bounding dimensions: `406 × 406 px` (due to outer drop-shadow padding).

2. **Incomplete Mask Exports (16 Files):**
   - `ajio.png`, `bigbasket.png`, `firstcry.png`, `flipkart.png`, `jiomart.png`, `meesho.png`, `myntra.png`, `nykaa.png`, `pepperfry.png`, `quikrjobs.png`, `reliancedigital.png`, `snapdeal.png`, `swiggy.png`, `zepto.png`, `zivame.png`, `zomato.png`
   - All 16 files share the exact same SHA-256 hash (`b7698d06d03fea2b36c8a432bf6c995f5be729a55a95ebe4e88db122c9b87572`) and size (`3,982 bytes`).
   - They contain only the bottom-left navy reward strip mask shape without the peach outer card, logo panel, brand logo, or discount badge.
