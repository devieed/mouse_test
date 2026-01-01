# GitHub Pages 部署问题排查指南

## 错误信息
```
Error: Failed to create deployment (status: 404)
Ensure GitHub Pages has been enabled
```

## 🔧 解决步骤（按顺序执行）

### Step 1: 启用 GitHub Pages ⭐ 最重要

1. 访问仓库设置页面：
   ```
   https://github.com/devieed/mouse_test/settings/pages
   ```

2. 在 **Build and deployment** 部分：
   - **Source**: 选择 `GitHub Actions`
   - ⚠️ 注意：不要选择 "Deploy from a branch"

3. 点击保存

### Step 2: 配置 Actions 权限

1. 访问：
   ```
   https://github.com/devieed/mouse_test/settings/actions
   ```

2. 滚动到 **Workflow permissions** 部分

3. 选择：
   - ✅ `Read and write permissions`
   - ✅ `Allow GitHub Actions to create and approve pull requests`

4. 点击 **Save**

### Step 3: 检查分支名称

确保你的主分支名称与工作流配置一致：

```bash
# 查看当前分支
git branch

# 如果是 master，重命名为 main
git branch -m master main
git push -u origin main

# 删除远程旧分支（可选）
git push origin --delete master
```

如果你的分支是 `master` 而不是 `main`，可以修改 `.github/workflows/deploy.yml` 第6行：
```yaml
branches:
  - master  # 改为你的分支名
```

### Step 4: 重新触发部署

完成上述配置后，重新触发部署：

**方法1：推送新提交**
```bash
git commit --allow-empty -m "Trigger deployment"
git push
```

**方法2：手动重新运行**
1. 访问 `https://github.com/devieed/mouse_test/actions`
2. 点击失败的工作流
3. 点击 `Re-run all jobs`

## 🔍 验证步骤

### 1. 检查 Pages 是否启用
访问：`https://github.com/devieed/mouse_test/settings/pages`

应该看到：
```
✅ Your site is live at https://devieed.github.io/mouse_test/
```

### 2. 检查 Actions 是否运行成功
访问：`https://github.com/devieed/mouse_test/actions`

应该看到：
- ✅ Build 步骤成功
- ✅ Deploy 步骤成功

### 3. 访问网站
访问：`https://devieed.github.io/mouse_test/`

## 📋 常见问题

### Q1: 404 Not Found 错误
**原因**: GitHub Pages 未启用
**解决**: 按照 Step 1 启用 GitHub Pages

### Q2: Permission denied 错误
**原因**: Actions 权限不足
**解决**: 按照 Step 2 配置权限

### Q3: 分支不存在错误
**原因**: 工作流配置的分支名与实际不符
**解决**: 按照 Step 3 检查分支名

### Q4: Build 成功但 Deploy 失败
**原因**: Pages 环境未创建
**解决**: 
1. 先启用 GitHub Pages (Step 1)
2. 等待 1-2 分钟让 GitHub 创建环境
3. 重新运行工作流

## 🎯 最快解决方案

如果你不确定哪里出问题，按照这个顺序操作：

1. ✅ 启用 GitHub Pages (`Settings` → `Pages` → `Source: GitHub Actions`)
2. ✅ 配置权限 (`Settings` → `Actions` → `General` → `Read and write permissions`)
3. ✅ 等待 1 分钟
4. ✅ 推送一个空提交触发部署：
   ```bash
   git commit --allow-empty -m "Deploy to GitHub Pages"
   git push
   ```
5. ✅ 查看 Actions 标签页，等待部署完成
6. ✅ 访问 `https://devieed.github.io/mouse_test/`

## 📞 还是不行？

如果按照上述步骤操作后仍然失败，检查：

1. 仓库是否是公开的（Private 仓库需要 GitHub Pro）
2. 是否有足够的 GitHub Actions 配额
3. 工作流文件语法是否正确
4. Node.js 版本是否匹配（当前配置：20.19.5）

## 成功标志

部署成功后，你会看到：
- Actions 页面显示绿色的 ✅
- Settings → Pages 显示网站 URL
- 可以正常访问网站

预期 URL: `https://devieed.github.io/mouse_test/`

