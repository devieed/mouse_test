# 自定义域名配置指南

## ✅ 已完成的修改

### 1. **Vite 配置**
- 已将 `base` 从 `/mouse_test/` 改为 `/`
- 现在可以直接通过域名根路径访问

### 2. **CNAME 文件**
- 创建了 `public/CNAME` 文件
- 内容：`ed9e.net`
- GitHub Pages 会自动识别并配置自定义域名

### 3. **URL 参数语言切换**
支持以下URL格式访问不同语言：
- `https://ed9e.net/` - 自动检测浏览器语言
- `https://ed9e.net/?lang=en` - 英文
- `https://ed9e.net/?lang=zh-cn` - 简体中文
- `https://ed9e.net/?lang=zh-tw` - 繁体中文
- `https://ed9e.net/?lang=ja` - 日语
- `https://ed9e.net/?lang=ko` - 韩语
- `https://ed9e.net/?lang=de` - 德语
- `https://ed9e.net/?lang=fr` - 法语

**支持的语言参数别名：**
- 简体中文：`zh`, `zh-cn`, `zh-hans`, `cn`
- 繁体中文：`zh-tw`, `zh-hant`, `tw`
- 日语：`ja`, `jp`
- 韩语：`ko`, `kr`

### 4. **Sitemap 更新**
- 主页：`https://ed9e.net/`
- 所有语言变体都包含在sitemap中
- 每种语言都有独立的URL入口

### 5. **所有内部链接已更新**
- 移除了 `/mouse_test/` 路径
- 所有链接现在指向域名根路径

## 🔧 GitHub Pages 配置步骤

### Step 1: 在 GitHub 仓库中配置自定义域名

1. 访问仓库设置：
   ```
   https://github.com/devieed/mouse_test/settings/pages
   ```

2. 在 **Custom domain** 部分输入：
   ```
   ed9e.net
   ```

3. 点击 **Save**

4. 等待 DNS 检查完成（可能需要几分钟）

5. 勾选 **Enforce HTTPS**（强烈推荐）

### Step 2: 配置域名 DNS

在你的域名服务商（阿里云、腾讯云等）添加以下DNS记录：

**方法1：使用 A 记录（推荐）**
```
类型: A
名称: @
值: 185.199.108.153
值: 185.199.109.153
值: 185.199.110.153
值: 185.199.111.153
TTL: 3600
```

**方法2：使用 CNAME 记录**
```
类型: CNAME
名称: www
值: devieed.github.io
TTL: 3600
```

如果要支持根域名（ed9e.net）和子域名（www.ed9e.net），建议：
- 根域名使用 A 记录指向 GitHub Pages IP
- www 子域名使用 CNAME 记录指向 devieed.github.io

### Step 3: 验证配置

1. 推送代码到 GitHub
2. 等待 Actions 部署完成
3. 访问 `https://ed9e.net/`
4. 测试语言切换：`https://ed9e.net/?lang=zh-cn`

## 📋 URL 使用示例

### 直接访问（自动检测浏览器语言）
```
https://ed9e.net/
```

### 指定语言访问
```
https://ed9e.net/?lang=en        # 英文
https://ed9e.net/?lang=zh-cn     # 简体中文
https://ed9e.net/?lang=zh-tw     # 繁体中文
https://ed9e.net/?lang=ja        # 日语
https://ed9e.net/?lang=ko        # 韩语
https://ed9e.net/?lang=de        # 德语
https://ed9e.net/?lang=fr        # 法语
```

### 分享链接
可以直接分享带语言参数的链接，用户点击后会显示对应语言：
```
分享给中国用户：https://ed9e.net/?lang=zh-cn
分享给日本用户：https://ed9e.net/?lang=ja
```

## 🎯 语言切换行为

### 优先级
1. **URL参数** - 如果URL包含 `?lang=xxx`，优先使用
2. **浏览器语言** - 如果没有URL参数，检测浏览器语言
3. **默认语言** - 如果都检测不到，使用英文

### 自动更新URL
- 用户通过下拉菜单切换语言时，URL会自动更新
- 例如：选择简体中文后，URL变为 `https://ed9e.net/?lang=zh-cn`
- 这样用户可以直接复制URL分享，保持语言状态

## 🔍 SEO 优化

### Sitemap 包含所有语言变体
```xml
https://ed9e.net/                 (主页，自动检测)
https://ed9e.net/?lang=en         (英文版)
https://ed9e.net/?lang=zh-cn      (简体中文版)
https://ed9e.net/?lang=zh-tw      (繁体中文版)
https://ed9e.net/?lang=ja         (日语版)
https://ed9e.net/?lang=ko         (韩语版)
https://ed9e.net/?lang=de         (德语版)
https://ed9e.net/?lang=fr         (法语版)
```

### hreflang 标签
HTML head 中已包含所有语言的 hreflang 标签，告诉搜索引擎不同语言版本的URL。

## ⚠️ 注意事项

1. **DNS 生效时间**
   - DNS 配置可能需要几分钟到24小时生效
   - 可以使用 `nslookup ed9e.net` 检查DNS是否生效

2. **HTTPS 证书**
   - GitHub Pages 会自动为自定义域名签发 Let's Encrypt 证书
   - 首次配置可能需要等待几分钟

3. **CNAME 文件**
   - `public/CNAME` 文件必须保留
   - 每次构建时会自动复制到 `dist/` 目录

4. **重定向**
   - 旧链接 `https://devieed.github.io/mouse_test/` 会自动重定向到新域名
   - 建议更新所有外部引用

## 🚀 部署流程

```bash
# 1. 提交所有更改
git add .
git commit -m "Configure custom domain ed9e.net"
git push

# 2. 等待 GitHub Actions 构建完成

# 3. 配置 GitHub Pages 自定义域名

# 4. 配置域名 DNS

# 5. 等待DNS生效并访问测试
```

完成后，你的网站将可以通过 `https://ed9e.net/` 直接访问！

