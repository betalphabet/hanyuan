# SEO / GEO 第四輪執行摘要

日期：2026-09-09

## 本輪目標

- 深化核心頁的結構化資料與 FAQ
- 提升首頁與房型頁對長尾查詢的可回答性
- 補齊房型詳情頁的 FAQPage 覆蓋率

## 本輪修改

### 核心頁

- `camping.html`
  - 補強 `Campground` schema：`url`、`postalCode`、`geo`、`isPartOf`、`hasMap`
  - FAQ 增加「是否適合車露 / 精緻露營」

- `room_all.html`
  - 新增 `CollectionPage`
  - 新增房型總覽 FAQ，覆蓋「怎麼選房型 / 想泡湯 / 想觀星 / 想住新館」

- `map.html`
  - 新增 `WebPage`
  - FAQ 增加「大眾運輸是否方便」「是否免費停車」

- `index.html`
  - FAQ 改寫成更接近真實搜尋意圖的長尾問答
  - 納入「雙人 / 家庭 / 好友房型」「露營」「充電樁」「高鐵左營 / 國道 10 號」「二期隱山館」等主題

### 房型頁

- 新增 FAQPage：
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

- 一致性修正：
  - `hotspring_a.html` 主標修正為「景觀湯房2人房（兩小床）」

## 驗證結果

- `room_all.html` 已具備 `CollectionPage` 與 `FAQPage`
- `map.html` 已具備 `WebPage`
- `camping.html` 已具備 `isPartOf`
- 13 個主要房型頁現在皆具備 `FAQPage`

## 預期效果

- 提高搜尋引擎與 AI 對房型選擇、交通、露營與館別差異的理解能力
- 強化首頁與聚合頁承接長尾查詢的能力
- 讓單一房型頁不只描述房型，也能回應常見使用情境

## 後續建議

- 進行一輪 Rich Results Test 與 Schema Validator 人工驗證
- 規劃第五輪：補強 `_headers` 快取 / crawler hints、圖片檔名語意、以及頁面文案中的地區長尾詞
