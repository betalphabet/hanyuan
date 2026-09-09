# 美濃涵園民宿 SEO / GEO 健檢報告

- 日期：2026-09-09
- 範圍：全站 21 個 HTML 頁面、`sitemap.xml`、`robots.txt`、`llms.txt`、`llms-full.txt`、`_headers`
- 站點：`https://hanyuan.info`

## 一、結論摘要

目前站點的 SEO / GEO 基礎已經比一般靜態民宿站完整，優點包括：
- 幾乎所有頁面都有 `title`、`meta description`、`canonical`、`robots`
- 已有 Open Graph / Twitter Card
- 已有 `sitemap.xml`、`robots.txt`
- 已提供 `llms.txt` / `llms-full.txt`，對 AI 檢索友善
- 多數房型頁已有 `HotelRoom`、`BreadcrumbList`，部分頁面已有 `FAQPage`

但目前仍有幾個會直接影響索引品質與實體一致性的問題：
- 首頁 canonical 與 sitemap 訊號衝突
- 首頁 `H1` 結構錯誤
- `order.html` 屬於薄內容跳轉頁，不適合繼續 `index`
- 局部頁面存在名稱／地址不一致
- 圖片替代文字缺口很大，會同時影響 SEO、圖片搜尋、無障礙與 AI 理解
- GEO 內容雖已建立，但 `llms-full.txt` 含敏感匯款資訊，建議重新分級公開資料

## 二、量化盤點

- HTML 頁面總數：21
- 缺少 `<title>` 的頁面：1
- 缺少 `<h1>` 的頁面：1
- 有多個 `<h1>` 的頁面：1
- 缺少 JSON-LD 的頁面：1
- 全站圖片數：389
- 缺少 `alt` 的圖片數：177
- 缺少 `og:image:alt` / `twitter:image:alt` 的頁面：21

## 三、優先問題

### P1：首頁 URL 正規化訊號互相衝突

**問題**
- `index.html` canonical 指向根目錄 `/`：`index.html:8`
- `sitemap.xml` 同時提交 `https://hanyuan.info/` 與 `https://hanyuan.info/index.html`：`sitemap.xml:10-19`
- `_headers` 只加了 Link headers，沒有看到 `/index.html -> /` redirect 規則：`_headers:1-4`

**影響**
- 搜尋引擎可能同時收錄兩個首頁 URL
- link equity 被拆分
- canonical 與 sitemap 發出相反訊號，降低索引穩定度

**建議**
- 只保留 `https://hanyuan.info/` 作為首頁正式 URL
- `sitemap.xml` 移除 `/index.html`
- 部署層加 301 redirect：`/index.html -> /`

### P1：首頁有 6 個 H1，主題層級不清楚

**問題**
- 首頁 slider 區塊用了多個 `h1`：`index.html:237`, `index.html:266`, `index.html:296`, `index.html:323`, `index.html:350`, `index.html:377`

**影響**
- 搜尋引擎難以判斷首頁主題主軸
- 螢幕閱讀器結構混亂
- 首頁權重被多個 marketing heading 分散

**建議**
- 首頁只保留 1 個 `h1`，例如「美濃涵園民宿」
- 其他 slider 標題改為 `h2` 或 `p`

### P1：`order.html` 是薄內容跳轉頁，不建議持續被索引

**問題**
- 檔案缺少完整 HTML 骨架與 `<title>`：`order.html:1-27`
- 頁面沒有主內容與 `h1`
- 目前仍為 `index, follow`：`order.html:6`
- 頁面載入後直接 JS 跳轉到 Owlting：`order.html:47-49`

**影響**
- 對 Google 屬於低價值 thin page
- 可能浪費 crawl budget
- 使用者從搜尋結果點進來只會瞬間跳走，體驗不佳

**建議**
- 最佳做法：改成伺服器端 301/302 直接跳轉，不保留索引頁
- 若必須保留中介頁：加 `noindex, follow`，補完整 HTML、title、說明文與備援連結

### P1：頁面名稱不一致，會傷害實體識別

**問題 A：房型名稱不一致**
- 頁面 title / schema 是「高級雙床房」：`superior-2-bed.html:5`, `superior-2-bed.html:37-41`
- 頁面主標卻是「標準四人房」：`superior-2-bed.html:139`

**問題 B：地址不一致**
- `map.html` description 寫 `中壇里五穀街7-11號`：`map.html:9`
- 但 OG / Twitter description 寫 `五穀街5號`：`map.html:23`, `map.html:31`

**影響**
- 搜尋引擎與 LLM 難以建立穩定 entity
- 在 Local SEO / GEO 場景中，地址與房型名稱不一致是高風險訊號

**建議**
- 先統一房型正式名稱與地址主檔
- 所有頁面、schema、OG、llms 檔、Google 商家資訊全部同步

### P1：圖片替代文字缺口過大

**問題**
- 全站 389 張圖片中，177 張缺少 `alt`
- 缺口較高頁面例如：
  - `dorm.html`：40 張圖缺 38 張
  - `garden.html`：25 張圖缺 24 張
  - `family.html`：20 張圖缺 18 張
  - `superior-2-bed.html`：30 張圖缺 15 張
  - `hotspring_b.html`：30 張圖缺 14 張

**影響**
- 降低圖片搜尋能見度
- 降低 AI 對房型與場景照片的理解能力
- 無障礙表現不足

**建議**
- 房型相簿優先補描述型 `alt`
- 封面圖 alt 建議包含「房型名 + 特色 + 地點」
- 裝飾圖可用空 alt：`alt=""`

## 四、中優先改善

### P2：首頁結構化資料仍偏薄

**觀察**
- 首頁已有 `LodgingBusiness` 與 `FAQPage`：`index.html:62-129`
- 但 `postalCode` 為空：`index.html:75`
- 缺少 `geo`、`sameAs`、`hasMap`、`amenityFeature`、`checkinTime`、`checkoutTime`

**建議**
- 把首頁 `LodgingBusiness` 當成全站實體主檔
- 補齊：
  - `geo`
  - `sameAs`（Facebook、Google Maps、訂房頁）
  - `checkinTime` / `checkoutTime`
  - `amenityFeature`
  - `petsAllowed` / `smokingAllowed`（若有明確政策）

### P2：部分內容頁 schema 不足

**觀察**
- `garden.html` 只有 `BreadcrumbList`：`garden.html:34-43`
- `destination.html` 只有 `ItemList` + breadcrumb，缺少更完整景點上下文
- `meal.html` 有 `FoodEstablishment`，但內容仍可再補營業/供應方式/餐飲屬性

**建議**
- `garden.html` 可加 `Place` 或頁面型 `WebPage` + `about`
- `destination.html` 可加 FAQ 與景點分區說明
- `meal.html` 可補餐點類型、是否需預約、供應對象

### P2：社群分享圖訊號仍可再強化

**觀察**
- 21 個頁面都缺少 `og:image:alt` / `twitter:image:alt`
- 多數一期房型與內容頁仍共用 `images/ogimage.jpg`

**建議**
- 每頁至少補：
  - `og:image:alt`
  - `twitter:image:alt`
- 房型頁改為各自專屬封面圖，避免 SERP / 社群卡片辨識度過低

### P2：`meta keywords` 與舊式 geo meta 已不是主要 ranking factor

**觀察**
- 幾乎所有頁面都使用 `meta keywords`、`geo.region`、`geo.position`、`ICBM`

**判讀**
- 這些標記不是錯，但不能當作 Local SEO 主力

**建議**
- 保留無妨，但優先投入在：
  - 結構化資料完整性
  - 內容實體一致性
  - FAQ / 長尾問答
  - NAP 一致性
  - 圖片語意與內部連結

## 五、GEO 專項觀察

### 已做得不錯

- `robots.txt` 已對主要 AI crawler 開放
- `llms.txt` / `llms-full.txt` 已建立品牌、房型、交通、FAQ 內容
- 首頁 head 已加入：
  - `rel="api-catalog"`
  - `rel="service-doc"`
  - `rel="describedby"`

這代表站點已具備相對先進的 AI 可探索能力。

### 仍需優化

#### 1. `llms-full.txt` 含敏感或不適合公開擴散的資料

**觀察**
- `llms-full.txt` 公開了匯款資訊：`llms-full.txt:14`

**風險**
- 這類資料一旦被 AI crawler 收錄，會被長期擴散到外部系統
- 不利資料治理，也可能造成客服與風控負擔

**建議**
- 將匯款資訊移出公開 GEO 檔
- 若必要，改放在需登入、客服提供或訂房流程頁面

#### 2. GEO 內容仍偏「品牌手冊」，缺少明確 citation 型來源結構

**建議**
- `llms.txt` 保持精簡，聚焦：
  - 品牌
  - 地址
  - 電話
  - 正式頁面 URL
  - 核心賣點
- `llms-full.txt` 補：
  - 最後更新日期
  - 各資訊對應來源頁 URL
  - FAQ 與答案對應的 canonical page

#### 3. 適合增加「可回答問題」型內容

目前最有機會被 AI 搜尋引用的主題包括：
- 美濃民宿有電動車充電樁嗎
- 涵洞房有沒有獨立衛浴
- 美濃適合親子／家庭／四人住宿的房型
- 美濃住宿是否可泡湯
- 美濃兩天一夜怎麼安排
- 旗山老街 / 美濃湖 / 美濃民俗村住宿推薦

**建議**
- 在對應頁面新增明確 Q&A 區塊
- FAQ 內容避免只講品牌，要講「使用者問題 + 具體答案」

## 六、頁面分組評估

### 1. 核心頁面

- `index.html`
  - 優點：品牌資訊與 FAQ 基礎完整
  - 問題：首頁多 `H1`、canonical 與 sitemap 衝突、schema 可再擴充

- `room_all.html`
  - 優點：適合作為房型聚合頁
  - 建議：補更多篩選型文案，如雙人房／四人房／泡湯／親子／EV 友善

- `map.html`
  - 優點：Local intent 很強，已有 `Place` 與 FAQ
  - 問題：地址在 meta / OG 不一致

- `destination.html`
  - 優點：具備旅遊搜尋潛力
  - 建議：補景點距離、車程、推薦行程、FAQ

- `meal.html`
  - 優點：可承接「美濃客家料理」長尾
  - 建議：補餐點場景、是否需預約、是否限住客

- `garden.html`
  - 問題：schema 過薄、圖片 alt 缺口大

- `camping.html`
  - 優點：`Campground` schema 與 FAQ 很不錯
  - 問題：圖片 alt 缺口大

- `order.html`
  - 建議改為 noindex 或直接 redirect

### 2. 二期隱山館房型頁

頁面：
- `garden-view-double-small.html`
- `garden-view-quad-small.html`
- `garden-view-quad-large.html`
- `elegant-triple.html`
- `elegant-double.html`

**整體評價**
- 這批頁面是全站 SEO 表現相對最完整的一組
- 具有專屬 `og:image`
- 有 `HotelRoom` + breadcrumb
- 文案也比一期頁面更具差異化

**建議**
- 補 room-specific FAQ
- 補 `alt`
- 補房型屬性：入住人數、床型、景觀、是否有陽台、是否可加床

### 3. 一期房型頁

頁面：
- `dorm.html`
- `family.html`
- `eco_room.html`
- `hotspring_a.html`
- `hotspring_b.html`
- `standard-2-bed.html`
- `standard-2-bed-purple.html`
- `superior-2-bed.html`

**整體問題**
- 多數仍使用共用 `ogimage`
- 圖片 alt 缺口較大
- 頁面語意相對接近，容易互相稀釋
- `superior-2-bed.html` 還有名稱不一致問題

**建議**
- 把每個頁面重寫成更明確的搜尋意圖：
  - 雙人／四人
  - 泡湯／觀星／和式／商務
  - 家庭／情侶／親子／好友出遊

## 七、建議執行順序

### Sprint 1：先修索引與一致性

1. sitemap 移除 `/index.html`
2. 部署層加首頁 301 canonical redirect
3. 首頁保留單一 `H1`
4. `order.html` 改 `noindex` 或改成真正 redirect
5. 修正 `superior-2-bed.html` 主標
6. 統一 `map.html` 地址文字

### Sprint 2：補強結構化與圖片語意

1. 補首頁 `LodgingBusiness` 欄位
2. 補 `garden.html` / `destination.html` / `meal.html` schema
3. 全站補圖片 `alt`
4. 全站補 `og:image:alt` / `twitter:image:alt`
5. 一期房型頁補專屬分享圖

### Sprint 3：做 GEO 內容升級

1. 清理 `llms-full.txt` 的敏感資料
2. 補 `last updated` 與來源頁引用
3. 將 FAQ 擴充為問答型內容模組
4. 新增「搜尋意圖頁／內容區塊」承接長尾查詢

## 八、我認為最值得優先追加的內容主題

- 美濃民宿推薦：適合家庭 / 親子 / 四人入住
- 有電動車充電樁的高雄民宿 / 美濃住宿
- 有私人泡湯房的美濃民宿
- 涵洞房是否有獨立衛浴
- 美濃兩天一夜住宿與景點安排
- 二期隱山館與一期房型差異比較

## 九、整體評級

- SEO 基礎建置：B+
- Local SEO / 實體一致性：B-
- GEO / AI 可發現性：B
- 內容語意完整度：B-
- 技術一致性：C+

## 十、下一步建議

如果要追求「最小改動、最快見效」，優先順序建議是：

1. 修 sitemap / canonical / redirect
2. 修首頁單一 `H1`
3. 讓 `order.html` 退出索引
4. 修名稱與地址不一致
5. 補圖片 alt

如果要追求「AI 搜尋與在地旅宿長尾一起成長」，下一階段就應該進入：

1. schema 主檔重構
2. FAQ 模組化
3. `llms.txt` / `llms-full.txt` 治理
4. 房型與情境型內容擴寫
