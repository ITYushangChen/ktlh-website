# KTLH 官网 SEO 后续实施计划

> 域名：`https://ktlhrefrigeration.com`  
> 本文档记录 **第 1 步已完成项** 与 **接下来建议实施的优化**，按优先级排序。

---

## 第 1 步（已完成）

- [x] 安装 `react-helmet-async`，各公开页面独立 `title` / `description`
- [x] 三语 SEO 文案（`src/i18n/locales/*/translation.json` → `seo` 节点）
- [x] `canonical`、Open Graph、Twitter Card 动态输出（`src/components/Seo.jsx`）
- [x] 产品分类页 SEO（`src/components/ProductCategorySeo.jsx`）
- [x] 产品详情页动态 SEO（名称 + 描述 + 图片）
- [x] 后台 `/admin/*` 添加 `noindex, nofollow`（`src/components/AdminSeo.jsx`）
- [x] `public/robots.txt`（禁止收录后台，指向 sitemap）
- [x] `scripts/generate-sitemap.mjs`（构建前自动生成 `public/sitemap.xml`）
- [x] `public/index.html` 默认 meta 与 canonical 兜底

### 部署后请立即做

1. **Google Search Console** 完成 DNS TXT 验证（见此前说明）
2. 提交站点地图：`https://ktlhrefrigeration.com/sitemap.xml`
3. 注册 [Bing Webmaster Tools](https://www.bing.com/webmasters) 并提交同一 sitemap
4. 用 [Rich Results Test](https://search.google.com/test/rich-results) 检查首页是否可被正确抓取

### 修改 SEO 文案的位置

| 内容 | 文件 |
|------|------|
| 各页面 title/description | `src/i18n/locales/zh/translation.json` → `seo` |
| 英文 / 日文 | `en/translation.json`、`ja/translation.json` 同名节点 |
| 站点根 URL | `src/constants/seo.js` → `SITE_URL` |
| 新增产品 URL（sitemap） | 更新 `product-details.json` 后重新 `npm run build` 即可 |

---

## 第 2 步：内容与页面质量（建议 1–2 周）

### 2.1 补全「开发中」产品页正文

以下分类页目前只有占位文案，对 SEO 价值较低：

- `/products/oil-separators`
- `/products/damping-blocks`
- `/products/shell-tube-heat-exchangers`
- `/products/copper-tube-series`
- `/products/plate-heat-exchangers`

**目标：** 每页至少 300–500 字介绍 + 规格要点 + 内链到联系页/已有子产品。

**建议做法：** 在对应页面组件或 `products.json` 的 `description` 中补充可索引正文。

- [ ] 油分离器页补充正文
- [ ] 阻尼块页补充正文
- [ ] 壳管换热器页补充正文
- [ ] 铜管系列页补充正文
- [ ] 板式换热器页补充正文

### 2.2 图片 SEO

- [ ] 检查全站 `alt` 是否使用产品名/品类名（避免空 `alt`）
- [ ] 大图压缩（`public/images` 下部分 JPG/PNG 体积较大，影响 LCP）
- [ ] 准备专用 **OG 分享图**（1200×630，不要用细长 logo）

### 2.3 内链

- [ ] 首页优势/产品区块链到具体分类页
- [ ] 关于页「产品与应用」链到 `/products`
- [ ] Footer 保留主要页面链接（已基本具备）

---

## 第 3 步：技术 SEO（建议 2–3 周）

### 3.1 解决 SPA 抓取问题（重要）

当前为纯客户端渲染（CRA），搜索引擎可能无法完整索引动态内容。

**方案 A（改动较小，推荐先试）：预渲染**

- 使用 `react-snap` 或构建时 prerender 主要路由
- 预渲染：`/`、`/about`、`/products`、各分类页、活跃产品详情页

- [ ] 评估并接入 prerender
- [ ] 部署后 Search Console 查看「网页索引」是否增加

**方案 B（长期）：迁移 Next.js**

- SSR/SSG，SEO 与性能最佳，但迁移成本较高

### 3.2 结构化数据 JSON-LD

在 `Seo.jsx` 或各页增加 Schema.org：

**首页 Organization：**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "青岛开拓隆海智控有限公司",
  "url": "https://ktlhrefrigeration.com",
  "logo": "https://ktlhrefrigeration.com/images/app/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "青岛",
    "addressRegion": "山东",
    "addressCountry": "CN"
  }
}
```

**产品详情页 Product：**

- [ ] 首页添加 `Organization` JSON-LD
- [ ] 产品详情页添加 `Product` JSON-LD（名称、图片、描述、品牌）

### 3.3 性能（Core Web Vitals）

- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) 测首页与产品页
- [ ] 3D 模型、地图组件保持懒加载
- [ ] 首屏 Hero 背景动画/大图优化

---

## 第 4 步：多语言 SEO（有国际推广需求时）

当前语言通过前端切换，URL 不变，不利于分语言收录。

**目标结构示例：**

```
/zh/products/receivers
/en/products/receivers
/ja/products/receivers
```

- [ ] 路由增加语言前缀或子域名策略
- [ ] 添加 `hreflang` 标签
- [ ] 各语言 sitemap 或 sitemap 内 `xhtml:link` 互指

---

## 第 5 步：站外与持续运营

### 5.1 外链与品牌

- [ ] 阿里巴巴国际站、展会名录、行业协会页面添加官网链接
- [ ] LinkedIn / 社媒简介统一指向 `ktlhrefrigeration.com`
- [ ] 公司名、地址、电话全网一致（NAP）

### 5.2 国内搜索（可选）

- [ ] 百度站长平台验证并提交 sitemap
- [ ] 高德/百度地图标注公司地址

### 5.3 每月监测

在 Google Search Console 查看：

| 指标 | 关注点 |
|------|--------|
| 展示 / 点击 | 哪些词带来流量 |
| 覆盖率 | 未收录、404、重定向错误 |
| 核心网页指标 | LCP、CLS 是否达标 |

**迭代规则：**

- 有展示无点击 → 优化 title / description
- 某产品页无展示 → 补内容、加内链、检查 sitemap
- 新产品上线 → 确认 `active: true` 并重新部署（自动更新 sitemap）

---

## 文件索引（SEO 相关）

```
ktlh-website/
├── public/
│   ├── robots.txt
│   ├── sitemap.xml          # npm run build 时自动生成
│   └── index.html           # 无 JS 时的 meta 兜底
├── scripts/
│   └── generate-sitemap.mjs
├── src/
│   ├── components/
│   │   ├── Seo.jsx
│   │   ├── ProductCategorySeo.jsx
│   │   └── AdminSeo.jsx
│   ├── constants/
│   │   └── seo.js
│   └── i18n/locales/
│       ├── zh/translation.json  # seo.*
│       ├── en/translation.json
│       └── ja/translation.json
└── SEO-NEXT-STEPS.md          # 本文件
```

---

## 建议执行顺序（速查）

```
已完成  → 第 1 步（meta / robots / sitemap / noindex）
下一步  → 部署 + Search Console 提交 sitemap
第 2 周  → 补产品页内容 + OG 图 + 图片 alt
第 3 周  → JSON-LD + 性能优化
第 4 周  → 预渲染或评估 Next.js
持续    → Search Console 月度复盘
```

如有新问题或要落地某一步，可在 Cursor 中指定章节编号继续实现。
