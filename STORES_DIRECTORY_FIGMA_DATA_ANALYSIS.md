# Stores Directory Figma Forensic & Data Architecture Analysis

> **Target Route:** `/categories/stores`  
> **Source of Truth:** `Stores (1).png` (1920 × 8741px Native Figma Export)  
> **Phase:** Strict Analysis & Data Mapping (No UI/Source Code Modifications)

---

## 1. Directory Shell Reusability Audit

The Wouchify Category Directory architecture supports 7 canonical sibling routes:

```typescript
export type DirectoryPageKind =
  | "subcategories" // /categories/subcategories (Categories directory)
  | "stores"        // /categories/stores        (Stores directory)
  | "brands"        // /categories/brands        (Brands directory)
  | "banks"         // /categories/banks         (Banks directory)
  | "festivals"     // /categories/festivals     (Festivals directory)
  | "travelling"    // /categories/travelling    (Travelling directory)
  | "cities-deals"; // /categories/cities-deals  (Cities Deals directory)
```

### Component Audit & Reusability Matrix

| Component | Status | Reusability in `/categories/stores` | Notes / Adaptations |
| :--- | :--- | :--- | :--- |
| **`Navbar`** | Fully Reusable | 100% Shared | Standard 1920×131px desktop header with `activeNav="categories"`. |
| **`FooterSection`** | Fully Reusable | 100% Shared | Global desktop footer rendered in normal document flow at the end of directory content. |
| **`CategorySidebar`** | Fully Reusable | 100% Shared | Pass `selectedCategorySlug="stores"` to trigger the authentic rich red border & glow on the **Stores** row. |
| **`PopularStores`** | Fully Reusable | 100% Shared | Rendered inside sidebar at `X: 67px`. |
| **`CategoryToolbar`** | Fully Reusable | 100% Shared | 1233px search pill (`#E5E7FF` background, `"Search your store"`), 210×64px `"All Stores"` dropdown, 57×57px A–Z letter filter buttons (`#EEEFFF` resting background). |
| **`CategoryAlphabetSection`**| Fully Reusable | 100% Shared | 45px height letter pill bars (light neutral gray `#D9D9D9` with 999px radius) + 5-column directory grid. |
| **`TrendingCategoriesRow`** | Reusable Wrapper | Data-Driven Title & Items | Render with heading `"Trending Stores"` and 6 store logo cards. |
| **`CategoryDirectoryCard`** | Reusable Component | Data-Driven Logo Variant | Directory store cards feature a prominent logo in `object-fit: contain` with store name below. |

---

## 2. Stores Page Specifics vs. Categories Directory

| Aspect | Categories Directory (`/categories/subcategories`) | Stores Directory (`/categories/stores`) |
| :--- | :--- | :--- |
| **Canvas Total Height** | 9956px (18 letter groups, 109 cards) | **8741px** (**21 visible letter groups, exactly 61 cards**) |
| **Hero Heading** | `"Trending Categories"` | **`"Trending Stores"`** |
| **Trending Items** | 6 Category illustrations (Flights, Electronics, Fashion, Beauty, Mobiles, Watches) | **6 Store Logos** (Amazon, Flipkart, Myntra, Ajio, Swiggy, Zomato) |
| **Active Sidebar Row** | `categories` (Red perimeter shadow on Categories card) | **`stores`** (Red perimeter shadow on Stores card) |
| **Directory Visuals** | 3D Category Object Renderings | **Store Brand Logos** (`object-fit: contain` inside card logo container) |
| **Visible Groups** | 18 groups (`A, B, C, D, E, F, G, H, I, J, K, L, M, P, R, S, T, W`) | **21 groups (`A, B, C, D, E, F, H, J, L, M, N, O, P, Q, R, S, T, U, V, Y, Z`)** |
| **Skipped Groups** | `N, O, Q, U, V, Y, Z` (not in Subcategories Figma) | **`G, I, K, W, X`** (no cards in Stores Figma — zero empty sections rendered) |
| **Footer Start Coordinate** | `Y ≈ 8755px` | **`Y ≈ 7540px`** |

---

## 3. Native Figma Geometry & Visual Tokens (1920 × 8741px)

| Page Landmark | Native Figma Pixel Coordinates (X, Y, W, H) | Visual Properties / CSS Tokens |
| :--- | :--- | :--- |
| **Navbar Container** | `X: 0, Y: 0, W: 1920, H: 131` | Global desktop Navbar |
| **`>>Back to All Categories`** | `X: 67, Y: 171, W: 251, H: 24` | `font-size: 16px`, `color: #111827`, links to `/categories` |
| **Trending Stores Heading** | `X: 785, Y: 200, W: 350, H: 45` | `font-size: 32px`, `font-weight: 700`, `color: #111827`, centered |
| **Trending Cards Row (6 Cards)** | `X: 83, Y: 291, W: 1755, H: 209` | 6 cards, `280 × 209px` each, `gap: 15px`, `trending-card-bg.png` |
| **Browse All Toolbar** | `X: 67, Y: 659, W: 1787, H: 179` | Search pill + dropdown + A–Z letter selector |
| • Search Pill | `X: 373, Y: 659, W: 1233, H: 78` | **Background: `#E5E7FF`**, border-radius `999px`, placeholder `"Search your store"` |
| • "All Stores" Dropdown | `X: 1659, Y: 666, W: 210, H: 64` | Background: `#FFFFFF`, border-radius `999px`, resting text `"All Stores"` |
| • A–Z Letter Buttons | `X: 156, Y: 781, W: 57, H: 57` (Step: 62px) | **Resting Background: `#EEEFFF`**, active state `#2F368C` / `#FFFFFF` |
| **Left Sidebar (`Stores` Active)** | `X: 67, Y: 884, W: 382, H: 68` (List H: 596px) | 7 rows (`382 × 68px`), **Stores row active with red shadow** |
| **Popular Stores Widget** | `X: 67, Y: 1500, W: 382, H: 240` | Circular logo grid (67×67px, 2 columns) |
| **Right Directory Area** | `X: 569, Y: 890, W: 1189px` | 5-column grid (`222 × 170px` cards, `gap: 20px 20px`) |
| • Alphabet Letter Bar | `X: 574, Y: 890, W: 1189, H: 45` | **Light neutral gray `#D9D9D9`**, border-radius `999px`, letter label at `X: 594` |
| • Directory Grid | `X: 569, Y: 956, W: 1189px` | 5 cards per row, row gap `20px` |
| **Footer Top Separator** | `X: 0, Y: 7540, W: 1920, H: 1` | Red dashed border (`2px dashed #E31E25`) |
| **Footer Content Block** | `X: 0, Y: 7600 – 8620, W: 1920` | Full FooterSection (About, Links, Apps, Social, Badges) |
| **Footer Bottom Separator & Legal** | `X: 0, Y: 8630 – 8741, W: 1920` | Copyright & legal disclaimer, page terminates at `Y = 8741` |

---

## 4. Trending Stores Inventory (6 Dedicated Cards)

Outer card size: **`280 × 209px`**, **`Gap: 15px`**, using authentic asset `trending-card-bg.png`.

| Order | Store Name | Slug | Verified Local Asset Path | Artwork Box | Typography | Future Destination |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Amazon** | `amazon` | `src/assets/brand-logos/amazon-logo.png` | `max: 160×100px`, `contain` | Poppins 600, 17px, `#111827` | `/stores/amazon` |
| **2** | **Flipkart** | `flipkart` | `src/assets/brand-logos/flipkart-logo.png` | `max: 160×100px`, `contain` | Poppins 600, 17px, `#111827` | `/stores/flipkart` |
| **3** | **Myntra** | `myntra` | `src/assets/brand-logos/myntra-logo.png` | `max: 160×100px`, `contain` | Poppins 600, 17px, `#111827` | `/stores/myntra` |
| **4** | **Ajio** | `ajio` | `src/assets/brand-logos/ajio-logo.png` | `max: 160×100px`, `contain` | Poppins 600, 17px, `#111827` | `/stores/ajio` |
| **5** | **Swiggy** | `swiggy` | `src/assets/brand-logos/swiggy-logo.png` | `max: 160×100px`, `contain` | Poppins 600, 17px, `#111827` | `/stores/swiggy` |
| **6** | **Zomato** | `zomato` | `src/assets/brand-logos/zomato-logo.png` | `max: 160×100px`, `contain` | Poppins 600, 17px, `#111827` | `/stores/zomato` |

---

## 5. Verified Figma Stores Directory Inventory (Exactly 61 Cards across 21 Groups)

Every single store card below is an exact card from `Stores (1).png`, mapped 1:1 to a verified local asset.

### Section A (5 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Amazon** | `amazon` | `src/assets/categories/directory/amazon.png` | 1 | `amazon, shopping, ecommerce` | `/stores/amazon` |
| **Ajio** | `ajio` | `src/assets/categories/directory/Ajio.png` | 2 | `ajio, fashion, clothes` | `/stores/ajio` |
| **Aha** | `aha` | `src/assets/categories/directory/aha.png` | 3 | `aha, ott, movies, streaming` | `/stores/aha` |
| **Alt Balaji** | `alt-balaji` | `src/assets/categories/directory/alt_balaji.png` | 4 | `alt balaji, entertainment, ott` | `/stores/alt-balaji` |
| **Amazon Prime Video** | `amazon-prime-video` | `src/assets/categories/directory/Amazon_Prime.png` | 5 | `prime, amazon, streaming, video` | `/stores/amazon-prime` |

### Section B (2 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Blinkit** | `blinkit` | `src/assets/categories/directory/Blinkit.png` | 6 | `blinkit, grocery, quick commerce` | `/stores/blinkit` |
| **Big Basket** | `big-basket` | `src/assets/categories/directory/bigbasket.png` | 7 | `bigbasket, grocery, fruits, veg` | `/stores/bigbasket` |

### Section C (1 Card)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Croma** | `croma` | `src/assets/categories/directory/croma.png` | 8 | `croma, electronics, gadgets` | `/stores/croma` |

### Section D (4 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Dunzo** | `dunzo` | `src/assets/categories/directory/dunzo.png` | 9 | `dunzo, delivery, quick commerce` | `/stores/dunzo` |
| **DMart** | `dmart` | `src/assets/categories/directory/DMart.png` | 10 | `dmart, supermarket, grocery` | `/stores/dmart` |
| **Disney+Hotstar** | `disney-hotstar` | `src/assets/categories/directory/disney+hotstar.png` | 11 | `hotstar, disney, ott, movies` | `/stores/hotstar` |
| **Domino's India** | `dominos-india` | `src/assets/categories/directory/Dominos.png` | 12 | `dominos, pizza, fast food` | `/stores/dominos` |

### Section E (1 Card)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Eatsure** | `eatsure` | `src/assets/categories/directory/eatsure.png` | 13 | `eatsure, food, behrouz, faasos` | `/stores/eatsure` |

### Section F (3 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Faasos** | `faasos` | `src/assets/categories/directory/faasos.png` | 14 | `faasos, wraps, rolls, food` | `/stores/faasos` |
| **Flipkart** | `flipkart` | `src/assets/categories/directory/Flipkart.png` | 15 | `flipkart, shopping, mega sale` | `/stores/flipkart` |
| **Firstcry** | `firstcry` | `src/assets/categories/directory/firstcry.png` | 16 | `firstcry, baby products, toys` | `/stores/firstcry` |

### Section H (2 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **H&M** | `h-and-m` | `src/assets/categories/directory/H&M.png` | 17 | `h&m, fashion, apparel` | `/stores/hm` |
| **Housejoy** | `housejoy` | `src/assets/categories/directory/housejoy.png` | 18 | `housejoy, cleaning, home service` | `/stores/housejoy` |

### Section J (2 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **JioCinema** | `jiocinema` | `src/assets/categories/directory/jio_cinema.png` | 19 | `jiocinema, movies, live cricket` | `/stores/jiocinema` |
| **JioMart** | `jiomart` | `src/assets/categories/directory/JioMart.png` | 20 | `jiomart, grocery, electronics` | `/stores/jiomart` |

### Section L (2 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Levi's** | `levis` | `src/assets/categories/directory/levis.png` | 21 | `levis, jeans, denim, jackets` | `/stores/levis` |
| **Lifestyle** | `lifestyle` | `src/assets/categories/directory/Lifestyle.png` | 22 | `lifestyle, department store, clothes` | `/stores/lifestyle` |

### Section M (3 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **MX Player** | `mx-player` | `src/assets/categories/directory/MX_Player.png` | 23 | `mx player, video, ott, movies` | `/stores/mx-player` |
| **Myntra** | `myntra` | `src/assets/categories/directory/Myntra.png` | 24 | `myntra, fashion, apparel, shoes` | `/stores/myntra` |
| **Meesho** | `meesho` | `src/assets/categories/directory/Meesho.png` | 25 | `meesho, online shopping, wholesale`| `/stores/meesho` |

### Section N (5 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Naaptol** | `naaptol` | `src/assets/categories/directory/naaptol.png` | 26 | `naaptol, tv shop, deals` | `/stores/naaptol` |
| **Nature's Basket**| `natures-basket` | `src/assets/categories/directory/natures_basket.png` | 27 | `organic, grocery, gourmet food` | `/stores/natures-basket` |
| **Namdhari's Fresh**|`namdharis-fresh`| `src/assets/categories/directory/Namdhari's_Fresh.png`| 28 | `namdharis, fresh fruits, vegetables`| `/stores/namdharis` |
| **Netflix** | `netflix` | `src/assets/categories/directory/Netflix.png` | 29 | `netflix, streaming, shows, movies` | `/stores/netflix` |
| **Nykaa** | `nykaa` | `src/assets/categories/directory/nykaa.png` | 30 | `nykaa, makeup, cosmetics, beauty` | `/stores/nykaa` |

### Section O (1 Card)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Ola** | `ola` | `src/assets/categories/directory/Ola-auto.png` | 31 | `ola, cabs, auto, rides, taxi` | `/stores/ola` |

### Section P (5 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Pepperfry** | `pepperfry` | `src/assets/categories/directory/Pepperfry.png` | 32 | `pepperfry, furniture, home decor` | `/stores/pepperfry` |
| **Pantaloons** | `pantaloons` | `src/assets/categories/directory/pantaloons.png` | 33 | `pantaloons, fashion, apparel` | `/stores/pantaloons` |
| **Paytm Mall** | `paytm-mall` | `src/assets/categories/directory/Paytm_mall.png` | 34 | `paytm, recharge, mall, shopping` | `/stores/paytm-mall` |
| **Poorvika Mobiles**| `poorvika-mobiles`| `src/assets/categories/directory/poorvika.png` | 35 | `poorvika, mobiles, tablets, gadgets`| `/stores/poorvika` |
| **Purplle** | `purplle` | `src/assets/categories/directory/purplle.png` | 36 | `purplle, cosmetics, skincare` | `/stores/purplle` |

### Section Q (1 Card)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Quikr** | `quikr` | `src/assets/categories/directory/Quikr.png` | 37 | `quikr, classifieds, used cars, jobs` | `/stores/quikr` |

### Section R (3 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Rapido** | `rapido` | `src/assets/categories/directory/Rapido-bike.png` | 38 | `rapido, bike taxi, auto, rides` | `/stores/rapido` |
| **Reliance Smart** | `reliance-smart` | `src/assets/categories/directory/reliance_smart.png` | 39 | `smart bazaar, grocery, reliance` | `/stores/reliance-smart` |
| **Reliance Digital**| `reliance-digital` | `src/assets/categories/directory/Reliance_Digital.png` | 40 | `reliance digital, electronics` | `/stores/reliance-digital` |

### Section S (8 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **SonyLIV** | `sonyliv` | `src/assets/categories/directory/SonyLIV.png` | 41 | `sonyliv, live sports, ucl, ott` | `/stores/sonyliv` |
| **ShopClues** | `shopclues` | `src/assets/categories/directory/shopclues.png` | 42 | `shopclues, budget shopping, deals` | `/stores/shopclues` |
| **Shoppers Stop** | `shoppers-stop` | `src/assets/categories/directory/shoppers_stop.png` | 43 | `shoppers stop, beauty, perfume` | `/stores/shoppers-stop` |
| **Sun NXT** | `sun-nxt` | `src/assets/categories/directory/Sun_NXT.png` | 44 | `sun nxt, south movies, sun tv` | `/stores/sun-nxt` |
| **Spencer's Retail**| `spencers-retail` | `src/assets/categories/directory/Spencers.png` | 45 | `spencers, hypermarket, grocery` | `/stores/spencers` |
| **Swiggy Instamart**| `swiggy-instamart`| `src/assets/categories/directory/swiggy_instamart.png`| 46 | `instamart, quick grocery, swiggy` | `/stores/instamart` |
| **Snapdeal** | `snapdeal` | `src/assets/categories/directory/Snapdeal.png` | 47 | `snapdeal, shopping, discounts` | `/stores/snapdeal` |
| **Swiggy** | `swiggy` | `src/assets/categories/directory/Swiggy.png` | 48 | `swiggy, food delivery, dining` | `/stores/swiggy` |

### Section T (2 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **TataNeu** | `tata-neu` | `src/assets/categories/directory/TATA_neu.png` | 49 | `tata neu, rewards, super app` | `/stores/tata-neu` |
| **Tata CLiQ** | `tata-cliq` | `src/assets/categories/directory/Tata-CLiQ.png` | 50 | `tata cliq, luxury, electronics` | `/stores/tata-cliq` |

### Section U (3 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Uber Eats India**| `uber-eats-india` | `src/assets/categories/directory/Uber-Eats.png` | 51 | `uber eats, food ordering` | `/stores/uber-eats` |
| **Uber India** | `uber-india` | `src/assets/categories/directory/Uber-india.png` | 52 | `uber, rides, airport taxi, auto` | `/stores/uber` |
| **Udaan** | `udaan` | `src/assets/categories/directory/Udaanlogo.png` | 53 | `udaan, b2b trade, wholesale` | `/stores/udaan` |

### Section V (2 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Vijay Sales** | `vijay-sales` | `src/assets/categories/directory/vijay_sales.png` | 54 | `vijay sales, electronics, ac, tv` | `/stores/vijay-sales` |
| **Voonik** | `voonik` | `src/assets/categories/directory/voonik.png` | 55 | `voonik, women fashion, sarees` | `/stores/voonik` |

### Section Y (1 Card)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Yepme** | `yepme` | `src/assets/categories/directory/yepme.png` | 56 | `yepme, online shopping, shoes` | `/stores/yepme` |

### Section Z (5 Cards)
| Store Name | Slug | Verified Local Asset Path | Sort Order | Search Terms | Future Destination |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Zee5** | `zee5` | `src/assets/categories/directory/Zee5.png` | 57 | `zee5, web series, live tv, ott` | `/stores/zee5` |
| **Zara** | `zara` | `src/assets/categories/directory/zara.png` | 58 | `zara, luxury fashion, clothing` | `/stores/zara` |
| **Zepto** | `zepto` | `src/assets/categories/directory/Zepto.png` | 59 | `zepto, 10 min grocery delivery` | `/stores/zepto` |
| **Zivame** | `zivame` | `src/assets/categories/directory/Zivame.png` | 60 | `zivame, lingerie, activewear, bras` | `/stores/zivame` |
| **Zomato** | `zomato` | `src/assets/categories/directory/Zomato.png` | 61 | `zomato, food delivery, gold` | `/stores/zomato` |

**Total Card Count:** **61 cards**  
**Total Group Count:** **21 letter groups** (`A, B, C, D, E, F, H, J, L, M, N, O, P, Q, R, S, T, U, V, Y, Z`)  
**Skipped Groups (0 cards rendered):** `G, I, K, W, X`

---

## 6. Store Logo-Card Component Analysis

```
┌────────────────────────────────────────────────────────┐
│  Outer Card: 222px × 170px                             │
│  border-radius: 20px                                   │
│  background: #FFFFFF                                   │
│  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.08)          │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Logo Artwork Box: 170px × 88px                   │  │
│  │ display: flex; align-items: center; justify: ctr │  │
│  │ <img style="max-width: 140px; max-height: 80px;  │  │
│  │             object-fit: contain;" />             │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Store Name: "Amazon"                                  │
│  font-family: Poppins, 600, 16px, #111827              │
│  text-align: center; margin-top: 10px;                 │
└────────────────────────────────────────────────────────┘
```

### Component Architecture:
The existing `CategoryDirectoryCard` component (`222 × 170px`, `border-radius: 20px`, stationary hover with inset shadow) safely supports the 61 Store logo cards with `object-fit: contain` and clean center alignment.

---

## 7. Canonical Sidebar Navigation Route Map

When any sidebar item is clicked, it routes immediately via client-side SPA history to its dedicated directory page:

```
[1] Categories   →  /categories/subcategories  (active when on subcategories)
[2] Stores       →  /categories/stores         (ACTIVE on this page with red shadow)
[3] Brands       →  /categories/brands
[4] Banks        →  /categories/banks
[5] Festivals    →  /categories/festivals
[6] Travelling   →  /categories/travelling
[7] Cities Deals →  /categories/cities-deals
```

---

## 8. Document Flow & Footer Coordinates

- **Canvas Total Height:** `8741px`
- **End of Alphabetical Directory:** `Y ≈ 7460px`
- **Intentional Breathing Gap:** `~80px`
- **Top Dashed Red Line:** `Y = 7540px` (`2px dashed #E31E25`)
- **Footer Content:** `Y: 7600 – 8620px`
- **Bottom Separator:** `Y = 8630px`
- **Legal & Copyright:** `Y: 8640 – 8741px`

> **Note on Layout Implementation:** Normal dynamic document flow (`display: flex; flex-direction: column; min-height: 100vh`) will naturally render the footer immediately following the 61st card in section `Z` with zero artificial whitespace or hardcoded height hacks.

---

## 9. Backend-Ready Generic Data & Page Config Proposal

```typescript
export interface DirectoryStore {
  id: string
  name: string
  slug: string
  letter: string
  logo: string
  active: boolean
  sortOrder: number
  searchTerms?: string[]
  destinationHref?: string
}

export interface DirectoryPageConfig {
  kind: 'stores'
  route: '/categories/stores'
  backHref: '/categories'
  trendingTitle: string
  trendingItems: DirectoryStore[]
  sidebarActiveId: string
  groups: Array<{
    letter: string
    items: DirectoryStore[]
  }>
}
```
