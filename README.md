# MyWeb — 华飞容工作室官网

<p align="center">
  <strong style="font-size: 24px;">HFR<span style="color: #6c63ff;">.</span></strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Deploy-nginx-green?style=flat-square"></a>
  <a href="#"><img src="https://img.shields.io/badge/PWA-Enabled-blue?style=flat-square"></a>
  <a href="#"><img src="https://img.shields.io/badge/SEO-Optimized-orange?style=flat-square"></a>
</p>

---

## 项目简介

华飞容工作室官方网站，采用纯静态 HTML/CSS/JS 构建，零依赖、高性能、即开即用。

支持 **PWA 离线访问**、**暗色/亮色主题切换**、**完整 SEO 优化**（Open Graph、Twitter Card、schema.org、sitemap.xml、robots.txt）。

---

## 功能特性

| 功能 | 说明 |
|------|------|
| 🏠 首页 | 工作室介绍、作品展示入口 |
| 📂 作品集 | 项目展示（ECS、Huafeirong Studio、Contest Scoring） |
| 📝 博客 | 技术文章与开发日志 |
| 📧 联系页 | 联系表单（Formspree 集成） |
| 🔍 搜索 | 站内搜索功能 |
| 📊 状态页 | 服务状态展示 |
| 🌐 多语言 | 中文 / English（部分页面） |
| 🌙 主题切换 | 暗色/亮色模式，localStorage 持久化 |
| 📱 PWA | 可安装、离线访问、service worker 更新通知 |
| 🔒 安全头 | CSP、X-Frame-Options、HSTS（nginx 配置） |
| 📄 隐私政策 | 完整隐私政策页面 |

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | 纯 HTML5 + CSS3 + ECMAScript 6+ |
| 样式 | 原生 CSS（无框架依赖） |
| 脚本 | 原生 JavaScript（无 jQuery） |
| PWA | manifest.json + service-worker.js |
| 部署 | nginx（Gzip/Brotli 压缩、缓存策略） |
| SEO | Open Graph + Twitter Card + schema.org JSON-LD |
| 表单 | Formspree（无后端） |

**零 npm 依赖，无需构建步骤，直接部署。**

---

## 文件结构

```
myweb/
├── index.html              # 首页
├── ecs.html               # ECS 项目页
├── studio.html            # Huafeirong Studio 项目页
├── portfolio.html         # 作品集
├── contact.html           # 联系页
├── privacy.html           # 隐私政策
├── search.html            # 搜索页
├── status.html            # 状态页
├── 404.html              # 404 错误页
├── blog/
│   └── index.html        # 博客首页
├── css/
│   ├── style.css         # 主样式
│   └── blog.css          # 博客样式
├── js/
│   ├── main.js           # 主脚本（PWA 更新、主题切换）
│   └── service-worker.js # Service Worker
├── assets/               # 图片、SVG、favicon
├── nginx.conf             # nginx 生产配置
├── manifest.json          # PWA manifest
├── sitemap.xml           # SEO sitemap
├── robots.txt            # 爬虫规则
└── atom.xml              # Atom RSS
```

---

## 本地开发

无需安装任何依赖，直接打开 `index.html` 即可预览：

```bash
# 方式 1：直接打开
open index.html

# 方式 2：简单 HTTP 服务器（推荐）
python3 -m http.server 8080
# 访问 http://localhost:8080
```

---

## 部署指南

### nginx 配置

已将生产级 `nginx.conf` 包含在本项目中。关键配置：

- **Gzip + Brotli 压缩**
- **静态资源缓存 1 年**（`Cache-Control: public, max-age=31536000`）
- **HTML 不缓存**（`Cache-Control: no-cache`）
- **CSP 安全头**（Content-Security-Policy）
- **HSTS**（严格传输安全）
- **HTTPS 重定向**（取消注释即可启用）
- **Formspree CSP 白名单**

将 `nginx.conf` 复制到服务器：

```bash
sudo cp nginx.conf /etc/nginx/sites-available/myweb
sudo ln -s /etc/nginx/sites-available/myweb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Let's Encrypt SSL

`nginx.conf` 中已预配置 certbot 规则，取消注释即可：

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## PWA 配置

本网站已完整支持 PWA：

| 文件 | 作用 |
|------|------|
| `manifest.json` | 应用名称、图标、启动 URL、显示模式 |
| `service-worker.js` | 离线缓存、资源拦截、更新通知 |
| `js/main.js` | 注册 SW、检测新版本、显示更新 Toast |

**更新通知流程：**
1. 用户访问网站
2. Service Worker 检测到新版本
3. 底部显示 Toast："有新版本可用 → 立即刷新"
4. 点击"立即刷新"→ 跳过等待，激活新 SW，页面重载

---

## SEO 优化

| 技术 | 覆盖范围 |
|------|---------|
| Open Graph | `og:title`, `og:description`, `og:image`, `og:url` |
| Twitter Card | `twitter:card`, `twitter:title`, `twitter:description` |
| schema.org | JSON-LD `WebSite`, `Organization`, `WebPage` |
| Canonical URL | 避免重复内容 |
| sitemap.xml | 搜索引擎爬虫索引 |
| robots.txt | 爬虫访问规则 |
| atom.xml | RSS 订阅 |

---

## 性能优化

- ✅ 预连接 Google Fonts（`preconnect dns-prefetch`）
- ✅ Gzip + Brotli 压缩（nginx）
- ✅ 静态资源长期缓存（1 年）
- ✅ HTML 无缓存（每次验证）
- ✅ Service Worker 离线缓存
- ✅ 图片懒加载（如需添加）

---

## 浏览器支持

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## 许可证

© 2024-2026 华飞容工作室. 保留所有权利。

---

## 联系方式

- 邮箱：contact@huafeirong.com
- GitHub：https://github.com/huafeirong
- 网站：https://huafeirong.com
