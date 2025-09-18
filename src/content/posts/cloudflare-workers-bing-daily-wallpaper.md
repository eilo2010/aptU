---
title: "Cloudflare Workers 获取 Bing 每日壁纸"
description: "使用 Cloudflare Workers 搭建 Bing 每日一图 API，零服务器成本，自动获取并跳转到今日必应高清壁纸，简单快捷，永久免费。支持绑定自定义域名，适合个人网站、博客背景或壁纸工具接入，全球加速访问快速稳定。"
date: "Mar 18 2025"
---
每天 [Bing](https://www.bing.com) 都会更新一张精美的高清壁纸，我希望能直接获取这些图片。

为此，我写了一个 [Cloudflare Workers](https://workers.cloudflare.com) 脚本，每天自动获取并跳转到最新的 Bing 高清壁纸。

打开 [Cloudflare Dashboard](https://dash.cloudflare.com)，点击左侧导航栏中的:

```
Workers 和 Pages
```

选择:

```
创建
```

```
从 Hello World! 开始
```

```
部署
```

```
编辑代码
```

进入编辑器页面，将默认模板代码替换为以下脚本：

```js
export default {
  async fetch(request) {
    // 获取 Bing 壁纸 JSON 数据
    const res = await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1');
    const data = await res.json();

    // 构造图片地址
    const imageBase = data.images[0].urlbase;
    const imageUrl = `https://www.bing.com${imageBase}_1920x1080.jpg`;

    // 返回 302 重定向到原图
    return Response.redirect(imageUrl, 302);
  }
}
```

点击右上角的:

```
部署
```

Cloudflare 会为你分配一个 `workers.dev` 的免费二级域名。

点击:

```
设置
```

```
域和路由
```

```
添加
```

```
自定义域
```

在弹出框中填写要绑定的域名地址，然后点击:

```
添加域
```

最后只要访问这个域名地址，就会直接跳转到今日的 Bing 高清壁纸！

![](https://bingdaily.284628.xyz)