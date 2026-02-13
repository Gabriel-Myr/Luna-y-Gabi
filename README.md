# Luna & Gabi 恋爱记录模板

手帐风、可爱但高级的静态网页模板。内容都在 `data.json`，改完直接上线到 GitHub Pages。

## 快速开始

1. 修改 `data.json` 的文字和日期。
2. 把照片放进 `assets/`，并在 `data.json` 的 `photos` 里写好文件名。
3. 提交到 GitHub，然后开启 GitHub Pages。

## 在线修改（推荐）

- 在 GitHub 网页端打开 `data.json`
- 点 ✏️ 编辑
- 保存即可更新（几分钟后 Pages 生效）

## 开启 GitHub Pages

- Settings → Pages
- Source 选择 `main` 分支，`/ (root)`
- 保存后会得到页面地址

## 留言功能（评论系统）

> GitHub Pages 是静态站点，留言需要接第三方评论系统。

已接入 Utterances（基于 GitHub Issues）。

启用步骤：

1. 仓库 Settings → Features，确保 Issues 已开启
2. 在浏览器打开任意页面并提交第一条评论，Utterances 会自动创建 Issue

如需更换主题或配置：打开 `index.html`，修改 `utterances` 的 `theme` / `issue-term` / `label`。

## 目录说明

- `index.html` 页面结构
- `styles.css` 手帐风样式
- `script.js` 读取 `data.json` 并渲染
- `data.json` 所有可编辑内容
- `assets/` 放照片

## 额外建议的模块（可选）

- SM 任务清单（可以留空等待）
- 西语学习（问题区 + 生词本；问题暂存在浏览器本地）
- 旅行地图（一起去过的城市）
- 今日天气/小语录
- 纪念日相册
- 我们的默契问答
- 每月小目标

需要我再加任何模块，告诉我即可。
