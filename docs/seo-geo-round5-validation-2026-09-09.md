# SEO / GEO 第五輪驗證與收斂

日期：2026-09-09

## 驗證範圍

- 全站 HTML 基礎 SEO 欄位覆蓋率
- 全站 JSON-LD 可解析性
- 核心頁 schema 覆蓋狀態
- 房型頁 title / H1 / schema / breadcrumb 命名一致性

## 靜態驗證結果

### HTML 基礎欄位

- HTML 頁面數：21
- 缺少 canonical：0
- 缺少 `<title>`：0
- 缺少 `meta description`：0
- 缺少 `H1`：0

### 結構化資料

- JSON-LD 區塊總數：61
- JSON-LD 解析錯誤：0

### 核心頁覆蓋

- `index.html`：`LodgingBusiness` + `FAQPage`
- `room_all.html`：`CollectionPage` + `ItemList` + `BreadcrumbList` + `FAQPage`
- `camping.html`：`Campground` + `BreadcrumbList` + `FAQPage`
- `map.html`：`WebPage` + `Place` + `BreadcrumbList` + `FAQPage`
- `destination.html`：`CollectionPage` + `ItemList` + `BreadcrumbList` + `FAQPage`
- `meal.html`：`FoodEstablishment` + `BreadcrumbList` + `FAQPage`

### 房型頁 FAQ 覆蓋

主要房型頁皆已具備 `FAQPage`：

- `dorm.html`
- `eco_room.html`
- `elegant-double.html`
- `elegant-triple.html`
- `family.html`
- `garden-view-double-small.html`
- `garden-view-quad-large.html`
- `garden-view-quad-small.html`
- `hotspring_a.html`
- `hotspring_b.html`
- `standard-2-bed-purple.html`
- `standard-2-bed.html`
- `superior-2-bed.html`

## 本輪收斂修正

- 統一房型命名格式：
  - `景觀湯房2人房（兩小床）`
  - `景觀湯屋2人房（兩大床）`
  - `標準雙床房-紫韻`

- 統一房型 schema 內 `containedInPlace.url` 為：
  - `https://hanyuan.info/`

## 目前仍建議人工驗證的項目

- 以 Google Rich Results Test 驗證核心頁是否有可呈現 enhancement
- 以 Schema Validator 再抽查 `HotelRoom`、`LodgingBusiness`、`Campground`、`FAQPage`
- 以 Search Console 觀察 canonical 與 FAQ rich result 實際收錄情況

## 結論

目前站內 SEO / GEO 基礎結構已從「可被索引」提升到「可被理解、可被回答、且資料相對一致」的狀態。接下來最值得投入的是站外驗證與 Search Console 實際收錄觀察，而不是再持續堆疊更多 schema。
