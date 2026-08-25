
# Sub Categories Desktop Page — Forensic Figma Measurement & Architecture Analysis

> **Target Route**: `/categories/subcategories`  
> **Source of Truth**: `Sub Catagories.png` (1920 × 9956px Native Figma Canvas Export)  
> **Status**: `STATUS: FIGMA MEASUREMENTS CORRECTED — WAITING FOR USER APPROVAL BEFORE IMPLEMENTATION`

---

## 1. Measurement Method Rule

> [!IMPORTANT]
> **Measurement Method Rule**:  
> All page X/Y values, dimensions, gaps, and baselines documented in this specification were measured directly against the original 1920 × 9956px native Figma export (`Sub Catagories.png`).  
> No coordinate was copied from a browser preview, scaled chat preview, or pre-existing component CSS without a direct Figma pixel comparison.

---

## 2. Reusable Architecture vs. Visual Verification Matrix

Existing components and assets are tracked as **reusable candidates** and separated from **Figma-verified geometry facts**:

| Component / Subsystem | Reusable Candidate? | Current Geometry Matches Figma? | Needs Page-Specific Wrapper / Override? | Forensic Verification Notes |
| :--- | :---: | :---: | :---: | :--- |
| **`Navbar` (`src/components/layout/Navbar.tsx`)** | **Yes** | **Yes (131px)** | **Yes (Header Band #EEEFFF)** | Header band is `X: 0, Y: 0, W: 1920, H: 131` with `#EEEFFF` background layer. Content starts at `Y: 131`. |
| **`BackToCategoriesLink` (New Element)** | **New** | **N/A** | **New Inline Element** | Sits at `X: 67, Y: 171, W: 251, H: 24` with left chevron. |
| **`TrendingCategoriesRow` (New Component)** | **New** | **N/A** | **New Dedicated Component** | **Separate 280 × 209px card format** (6 cards spanning `X: 83` to `X: 1838` with `15px` gap). |
| **`CategoryToolbar` (`CategoryToolbar.tsx`)** | **Yes** | **Yes (Y: 659–781)** | **Yes (Vertical offset override)** | Search at `Y: 659`, Dropdown at `Y: 666`, A–Z at `Y: 781`. |
| **`CategorySidebar` (`CategorySidebar.tsx`)** | **Yes** | **Yes (382 × 68px)** | **Yes (Top offset Y: 884)** | First category row starts at `X: 67, Y: 884`. |
| **`PopularStores` (`PopularStores.tsx`)** | **Yes** | **Yes (67 × 67px)** | **No** | 7 circular store badges with 1px black border below sidebar. |
| **`CategoryAlphabetSection` (`CategoryAlphabetSection.tsx`)** | **Yes** | **Yes (1189 × 45px)** | **Yes (A-bar at X: 574, Y: 890)** | Letter bar is `1189 × 45px` with Red/Navy active scroll transitions. |
| **`CategoryDirectoryCard` (`CategoryDirectoryCard.tsx`)** | **Yes** | **Yes (Bounds ~X: 569, Y: 956)** | **No** | Subcategory tile incorporating `bg box.png` shadow/bounds and stationary hover. |
| **`FooterSection` (`FooterSection.tsx`)** | **Yes** | **Yes (Top line Y: 8755)** | **Yes (Positioned at Y: 8755)** | Top red dashed line sits at `Y ≈ 8755` with total baseline ending at `Y: 9956`. |

---

## 3. Verified Native Figma Geometry Log (1920 × 9956px)

```
Y: 0px    ┌───────────────────────────────────────────────────────────────────┐
          │ Header Band (#EEEFFF, W: 1920px, H: 131px)                        │
Y: 131px  ├───────────────────────────────────────────────────────────────────┤
          │                                                                   │
Y: 171px  │ [< Back to All Categories] (X: 67, Y: 171, W: 251, H: 24)          │
Y: 200px  │                 Trending Categories (X: 748, Y: 200, W: 422, H: 45)│
          │                                                                   │
Y: 291px  │ ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  │
          │ │Flight │  │Electr │  │Fashion│  │Beauty │  │Mobiles│  │Watches│  │ (280x209px, Gap: 15px)
Y: 500px  │ └───────┘  └───────┘  └───────┘  └───────┘  └───────┘  └───────┘  │
          │                                                                   │
Y: 659px  │ Browse All     [ Search your store (X: 373, Y: 659, 1233x78px) ] [All Stores (X:1659, Y:666, 210x64px)]
Y: 781px  │ (A) (B) (C) (D) (E) (F) ... (Z)  (A button at X: 156, Y: 781, 57x57px, Step: 62px)
          │                                                                   │
Y: 884px  │ ┌────────────────┐   ┌──────────────────────────────────────────┐ │
          │ │ Categories     │   │ [ A ] Alphabet Bar (X: 574, Y: 890, 1189x45)
          │ │ (X:67, Y:884,  │   │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │ │
          │ │  382x68px)     │   │ │First│ │Card │ │Grid │ │Row  │ │...  │  │ │ (Card bounds X: 569, Y: 956)
          │ │ Stores         │   │ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  │ │
          │ │ Brands         │   │ Section B ... Section W                  │ │
          │ │ Banks          │   │ (18 Alphabet Sections, 114 Cards)        │ │
          │ │ Festivals      │   │                                          │ │
          │ │ Travelling     │   │                                          │ │
          │ │ Cities Deals   │   │                                          │ │
          │ │ Popular Stores │   │                                          │ │
          │ └────────────────┘   └──────────────────────────────────────────┘ │
Y: 8755px ├─ ─ ─ ─ ─ ─ ─ ─ Top Red Dashed Separator (Y ≈ 8755) ─ ─ ─ ─ ─ ─ ─┤
          │ Footer Brand Block, Logo & Watermark                              │
          │ Navigation Columns (Explore, Company, Legal, Stay Updated)        │
          │ Contact Information & Social Icons                                │
Y: 9760px ├─ ─ ─ ─ ─ ─ ─ ─ Bottom Dashed Separator (Y ≈ 9760) ─ ─ ─ ─ ─ ─ ─ ┤
          │ Copyright & Bottom Legal Links                                    │
Y: 9956px └───────────────────────────────────────────────────────────────────┘
```

### Verified Pixel Landmarks Table

| Element / Region | Page X | Page Y | Width | Height | Exact Figma Verification Details |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Desktop Header Band** | `0px` | `0px` | `1920px` | `131px` | `#EEEFFF` background layer across full viewport width. |
| **Back to All Categories Link** | `67px` | `171px` | `251px` | `24px` | Left chevron + "Back to All Categories" (`Poppins 500 16px`). |
| **Trending Categories Heading** | `748px` | `200px` | `422px` | `45px` | Centered text `Trending Categories` (`Poppins 700 36px`). |
| **Trending Cards Row** | `83px` | `291px` | `1755px` | `209px` | 6 dedicated cards (`280 × 209px`) with `15px` horizontal gap. |
| — Card 1: Flights | `83px` | `291px` | `280px` | `209px` | Airplane illustration + "Flights" |
| — Card 2: Electronics | `378px` | `291px` | `280px` | `209px` | Laptop illustration + "Electronics" |
| — Card 3: Fashion | `673px` | `291px` | `280px` | `209px` | Folded shirt illustration + "Fashion" |
| — Card 4: Beauty | `968px` | `291px` | `280px` | `209px` | Cosmetics/brush illustration + "Beauty" |
| — Card 5: Mobiles | `1263px` | `291px` | `280px` | `209px` | Smartphone illustration + "Mobiles" |
| — Card 6: Watches | `1558px` | `291px` | `280px` | `209px` | Analog watch illustration + "Watches" |
| **Browse All Semicircle Accent** | `-37px` | `661px` | `75px` | `75px` | `#2F368C` navy semicircle cropped at left viewport edge. |
| **Browse All Heading** | `80px` | `676px` | `215px` | `48px` | `Browse All` (`Poppins 600 40px`). |
| **Search Pill Container** | `373px` | `659px` | `1233px` | `78px` | Lavender `#E5E7FF` rounded pill with 32px search icon. |
| **All Stores Dropdown** | `1659px` | `666px` | `210px` | `64px` | `#E5E7FF` pill with white circular chevron button. |
| **A–Z Letter Controls Row** | `156px` | `781px` | `1607px` | `57px` | A button at `X: 156, Y: 781`, step: `62px` between button centers. |
| **First Sidebar Row (Categories)** | `67px` | `884px` | `382px` | `68px` | First pastel row `#D4F7F2` with 3D illustration and arrow. |
| **Popular Stores Block** | `67px` | `1496px` | `382px` | `175px` | 7 circular 67×67px store logo badges with 1px black border. |
| **Alphabet Section A Bar** | `574px` | `890px` | `1189px` | `45px` | `#ECECEC` rounded 45px letter bar. |
| **First Directory Card Bounds** | `569px` | `956px` | `220px` | `171px` | Visual card bounds including background shadow assets. |
| **Top Red Dashed Separator** | `0px` | `8755px` | `1920px` | `4px` | Red dashed boundary starting the footer section. |
| **Footer Main Content** | `0px` | `8820px` | `1920px` | `940px` | Brand block, animated watermark, navigation columns. |
| **Bottom Dashed Separator** | `0px` | `9760px` | `1920px` | `2px` | Bottom boundary line above legal copyright bar. |
| **Copyright & Legal Links** | `0px` | `9800px` | `1920px` | `50px` | Copyright text and 4 legal policy links. |
| **Page Total Height** | `0px` | `0px` | `1920px` | `9956px` | Full native canvas height. |

---

## 4. Dedicated Trending Categories Specification

The Trending Categories cards are a **separate, larger card component**:

- **Card Dimensions**: `280px width × 209px height`
- **Horizontal Gap**: `15px`
- **Exact Coordinates**:
  1. Flights: `X: 83px, Y: 291px`
  2. Electronics: `X: 378px, Y: 291px`
  3. Fashion: `X: 673px, Y: 291px`
  4. Beauty: `X: 968px, Y: 291px`
  5. Mobiles: `X: 1263px, Y: 291px`
  6. Watches: `X: 1558px, Y: 291px`
- **Visual Styling**:
  - `background: #FFFFFF`
  - `border-radius: 20px`
  - `border: 1px solid rgba(0, 0, 0, 0.04)`
  - `box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.07), 0px 1px 3px rgba(0, 0, 0, 0.04)`
  - Image container: `height: 104px; max-width: 160px; object-fit: contain;`
  - Typography: `Poppins 600 17px`, `#111827`, centered with `margin-top: 14px`.

---

## 5. Complete Subcategory Directory Content Inventory (18 Letter Groups, 114 Cards)

Every label was visually verified against `Sub Catagories.png`:

### Section A (7 Cards)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Accessories** | Luxury handbag | `accessories.png` | **Verified** |
| 2 | **Adult 18+** | Golden padlock | `adult_18.png` | **Verified** |
| 3 | **Automobiles** | White modern car | `automobile.png` | **Verified** |
| 4 | **Air Conditioners** | Air conditioner unit | `air_conditioners.png` | **Verified** |
| 5 | **Anniversary Gifts** | Gift boxes & ribbons | `anniversary_gifts.png` | **Verified** |
| 6 | **Art & Craft Supplies** | Scissors, paint & brushes | `art_craft.png` | **Verified** |
| 7 | **Active Wear** | Smart fitness band | `activewear.png` | **Verified** |

### Section B (12 Cards — Verified from Figma Export)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Beauty** | Cosmetics & brushes | `beauty.png` | **Verified** |
| 2 | **Books & Media** | Stack of books | `books_media.png` | **Verified** |
| 3 | **Bean Bags** | Leather bean bag | `beanbags.png` | **Verified** |
| 4 | **Baby Toys** | Teddy bear | `baby_toys.png` | **Verified** |
| 5 | **Boys Footwear** | Sneakers | `boys_footwear.png` | **Verified** |
| 6 | **Baby Diapers & Wipes** | Diapers pack | `baby_diapers_wipes.png` | **Verified** |
| 7 | **Bike Accessories** | Blue bicycle | `bike_acessories.png` | **Verified** |
| 8 | **Books** | Hardcover books | `books.png` | **Verified** |
| 9 | **Backpacks** | Navy backpack | `backpacks.png` / `bags.png` | **Verified** |
| 10 | **Bags** | Handbag | `bags.png` | **Verified** |
| 11 | **Belts** | Leather belt | `belts.png` | **Verified** |
| 12 | **Beauty Services** | Spa / cosmetics bottles | `beauty_services.png` | **Verified** |

### Section C (12 Cards — Verified from Figma Export)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Cameras** | DSLR camera | `cameras.png` | **Verified** |
| 2 | **Clothing** | Blue polo shirt | `clothing.png` | **Verified** |
| 3 | **Camera Accessories** | Camera bag & accessories | `camera_accessories.png` | **Verified** |
| 4 | **Camera lens** | Camera zoom lens | `camera_accessories.png` | **Verified** |
| 5 | **Computers** | Laptop computer | `computers.png` | **Verified** |
| 6 | **Computer Accessories** | Keyboard & mouse | `computer_accessories.png` | **Verified** |
| 7 | **Cake** | Chocolate cake with berries | `cake.png` | **Verified** |
| 8 | **Chocolate** | Cadbury chocolate bar | `chocolate.png` | **Verified** |
| 9 | **Chocolate Cakes** | Chocolate cake slice | `chocolate_cakes.png` | **Verified** |
| 10 | **Contact Lens** | Contact lens container | `contact_lens.png` | **Verified** |
| 11 | **Cycles** | Mountain cycle | `cycles.png` | **Verified** |
| 12 | **Credit Cards** | Credit card stack | `credit_cards.png` | **Verified** |

### Section D (3 Cards)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Drone Drones** | White quadcopter drone | `drones.png` | **Verified** |
| 2 | **Dishwashers** | Stainless dishwasher | `dishwashers.png` | **Verified** |
| 3 | **Dry Fruits** | Bowl of almonds/cashews | `dry_fruits.png` | **Verified** |

### Section E (3 Cards)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Electronics** | Laptop | `electronics.png` | **Verified** |
| 2 | **Electric Vehicles** | EV charging cable | `electric_vehicles.png` | **Verified** |
| 3 | **Eyewear** | Sunglasses | `eyewear.png` | **Verified** |

### Section F (5 Cards)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Flights** | Airplane | `flight.png` | **Verified** |
| 2 | **Fashion** | Shirt | `fashion.png` | **Verified** |
| 3 | **Food** | Pasta dish | `food.png` | **Verified** |
| 4 | **Footwear** | Sneakers | `footwear.png` | **Verified** |
| 5 | **Furniture & Home Decor** | Sofa chair | `furniture.png` | **Verified** |

### Section G (3 Cards)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Gifts & Flowers** | Flower bouquet | `gifts_flowers.png` | **Verified** |
| 2 | **Groceries** | Vegetables basket | `groceries.png` | **Verified** |
| 3 | **Gift Cards** | Gift card with envelope | `giftcards.png` | **Verified** |

### Section H (8 Cards)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Health, Sports & Fitness** | Dumbbell & bottle | `health_sports_fitness.png` | **Verified** |
| 2 | **Home Appliances** | Microwave / toaster | `home_appliances.png` | **Verified** |
| 3 | **Headphones** | Over-ear headphones | `headphones.png` | **Verified** |
| 4 | **Home & Kitchen** | Mixer grinder | `home_kitchen.png` | **Verified** |
| 5 | **Home Decor** | Decorative vase | `home_decor.png` | **Verified** |
| 6 | **Hair Dryers** | Hair dryer | `hair_dryers.png` | **Verified** |
| 7 | **Handbags** | Leather handbag | `handbags.png` | **Verified** |
| 8 | **Home Cleaning Services** | Bucket & cleaning tools | `home_cleaning_services.png` | **Verified** |

### Section I (1 Card)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **International Flights** | Globe & plane | `international_flights.png` | **Verified** |

### Section J (1 Card)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Jewellery** | Diamond ring / jewellery | `jewellery.png` | **Verified** |

### Section K (3 Cards)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Kids Toys** | Stuffed toy | `kids_toys.png` | **Verified** |
| 2 | **Keyboard & Mouse** | Keyboard & mouse combo | `keyboard_mouse.png` | **Verified** |
| 3 | **Kitchen Appliances** | Blender | `kitchen_appliances.png` | **Verified** |

### Section L (6 Cards)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Laptop Accessories** | Keyboard / cooling pad | `laptop_acessories.png` | **Verified** |
| 2 | **Laptop Chargers** | Power adapter | `laptop_chargers.png` | **Verified** |
| 3 | **Laptops** | Laptop | `laptops.png` | **Verified** |
| 4 | **Luggage & Travel** | Travel kit / luggage | `luggage_travel.png` | **Verified** |
| 5 | **Luggage Bags** | Suitcase trolley | `luggage_bags.png` | **Verified** |
| 6 | **Lipsticks** | Lipstick tube | `lipsticks.png` | **Verified** |

### Section M (16 Cards)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Mobiles** | Smartphone | `mobiles.png` | **Verified** |
| 2 | **Mobile Accessories** | Back cover & charger | `mobile_accessories.png` | **Verified** |
| 3 | **Men's Winter Wear** | Beanie cap | `mens_winter_wear.png` | **Verified** |
| 4 | **Men's Sweatshirts** | Sweatshirt | `mens_sweatshirts.png` | **Verified** |
| 5 | **Men's Innerwear** | Innerwear boxer | `mens_innerwear.png` | **Verified** |
| 6 | **Men's Grooming** | Shaver & trimmer | `mens_grooming.png` | **Verified** |
| 7 | **Men's Watches** | Wristwatch | `mens_watches.png` | **Verified** |
| 8 | **Men's Footwear** | White sneakers | `mens_footwear.png` | **Verified** |
| 9 | **Men's Sports Shoes** | Black running shoes | `mens_sports_shoes.png` | **Verified** |
| 10 | **Men's Sandals** | Leather sandals | `mens_sandals.png` | **Verified** |
| 11 | **Musical Instruments** | Guitar / sitar | `musical_instruments.png` | **Verified** |
| 12 | **Meals & Combos** | Pizza / fast food | `meals_combos.png` | **Verified** |
| 13 | **Men's Casual Shoes** | White loafers | `mens_casual_shoes.png` | **Verified** |
| 14 | **Men's Smart Watches** | Smartwatch | `mens_smart_watches.png` | **Verified** |
| 15 | **Meat & Dairy** | Raw meat & milk | `meat_dairy.png` | **Verified** |
| 16 | **Mattresses** | Bed mattress | `mattresses.png` | **Verified** |

### Section P (6 Cards)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Pet Food** | Dog food can | `pet_food.png` | **Verified** |
| 2 | **Printers & Scanners** | Printer | `printers_scanners.png` | **Verified** |
| 3 | **Power Tools** | Cordless drill | `power_tools.png` | **Verified** |
| 4 | **Pet Care** | Pet bowl & grooming | `pet_care.png` | **Verified** |
| 5 | **Protein Powders & Gym** | Protein jar | `protein_powders.png` | **Verified** |
| 6 | **Perfumes** | Perfume bottle | `perfumes.png` | **Verified** |

### Section R (1 Card)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Refrigerators** | Double-door refrigerator | `refrigerators.png` | **Verified** |

### Section S (9 Cards)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Speakers** | Bluetooth speaker | `speakers.png` | **Verified** |
| 2 | **Storage & Organizers** | Storage organizer | `storage_organizers.png` | **Verified** |
| 3 | **Stationery** | Notebook & pens | `stationery.png` | **Verified** |
| 4 | **Study Tables** | Study desk | `study_tables.png` | **Verified** |
| 5 | **Sweets** | Indian sweets | `sweets.png` | **Verified** |
| 6 | **Snacks** | Samosa / savory snack | `snacks.png` | **Verified** |
| 7 | **Safety Equipment** | Fire extinguisher | `safety_equipment.png` | **Verified** |
| 8 | **Smart Fitness** | Fitness band | `smart_fitness.png` | **Verified** |
| 9 | **Smart Wearables** | Smart watch | `smart_wearables.png` | **Verified** |

### Section T (5 Cards)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Tablets** | Tablet device | `tablets.png` | **Verified** |
| 2 | **Televisions** | Smart TV | `televisions.png` | **Verified** |
| 3 | **Toys & Games** | Toy truck | `toys_games.png` | **Verified** |
| 4 | **Tea & Coffee** | Cup of tea | `tea_coffee.png` | **Verified** |
| 5 | **Trimmers** | Beard trimmer | `trimmers.png` | **Verified** |

### Section W (8 Cards)
| # | Card Label in Figma | Visual Artwork | Matching Asset | Status |
| :-: | :--- | :--- | :--- | :---: |
| 1 | **Women's Ethnic Wear** | Saree / Kurta | `womens_ethnic_wear.png` | **Verified** |
| 2 | **Women's Dresses** | Dress | `womens_dresses.png` | **Verified** |
| 3 | **Women's Footwear** | High heels | `womens_footwear.png` | **Verified** |
| 4 | **Women's Winter Wear** | Winter jacket | `womens_winter_wear.png` | **Verified** |
| 5 | **Women's Handbags** | Handbag | `womens_handbags.png` | **Verified** |
| 6 | **Women's Western Wear** | Western dress | `womens_western_wear.png` | **Verified** |
| 7 | **Women's Smart Watches** | Women's smartwatch | `womens_smart_watches.png` | **Verified** |
| 8 | **Watches** | Analog wristwatch | `watches.png` | **Verified** |

---

## 6. Implementation Architecture & Data Model

- **Route**: `/categories/subcategories`
- **Data Models (`src/data/subcategoriesData.ts`)**:
  ```typescript
  export interface SubcategoryItem {
    id: string
    name: string
    slug: string
    letter: string
    image: string
    categoryId?: string
    active?: boolean
    sortOrder?: number
    searchTerms?: string[]
  }

  export interface TrendingCategoryItem {
    id: string
    name: string
    slug: string
    image: string
    href: string
    sortOrder: number
  }
  ```

---

`STATUS: FIGMA MEASUREMENTS CORRECTED — WAITING FOR USER APPROVAL BEFORE IMPLEMENTATION`
