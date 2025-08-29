---
title: "Astro 添加友情链接页面"
description: "由于选用的 Astro 主题过于简洁，没有内置友链功能，我手动创建了 friends.astro 页面，实现站点卡片展示、导航集成和交换友链说明。这样既保持了主题风格统一，又为新博客增加了实用的个性化元素。"
date: "Aug 20 2025"
---
在上一篇文章里，我把博客从 Hexo 迁移到了 Astro，并且选中了一个自己很喜欢的[主题](https://github.com/nicholasdly/miniblog)。这个主题整体非常简洁，但也因为过于简洁，没有自带友情链接和评论区这些功能。

既然决定用这个主题，就希望整个站点的风格能保持一致。所以我打算手搓一个和主题完全匹配的友情链接页面，也算是给迁移后的新博客添上一点属于自己的个性化元素。

首先我需要创建页面文件，将这段代码保存为 `src/pages/friends.astro`:

```
---
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import Layout from "../layouts/Layout.astro";

// 友情链接数据
const friends = [
  {
    name: "示例博客",
    url: "https://example.com",
    description: "一个很棒的技术博客",
    avatar: "https://via.placeholder.com/32"
  },
  {
    name: "朋友的站点",
    url: "https://friend.com",
    description: "分享生活和思考",
    avatar: "https://via.placeholder.com/32"
  },
  {
    name: "技术分享",
    url: "https://tech-share.com",
    description: "前端开发经验分享",
    avatar: "https://via.placeholder.com/32"
  }
];
---

<Layout title={`友情链接 - ${SITE_TITLE}`} description={SITE_DESCRIPTION}>
  <main>
    <h1 class="mb-5 text-xl font-medium">友情链接</h1>
    
    <div class="mb-6">
      <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed">
        这里是我的朋友们的站点，每一个都值得一看。
      </p>
    </div>

    <div class="space-y-3">
      {friends.map((friend) => (
        <a 
          href={friend.url} 
          target="_blank" 
          rel="noopener noreferrer"
          class="group flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          <img 
            src={friend.avatar} 
            alt={friend.name}
            class="size-8 rounded-full border dark:border-zinc-700"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                {friend.name}
              </h3>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 16 16" 
                fill="currentColor" 
                class="size-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
              >
                <path fill-rule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clip-rule="evenodd" />
              </svg>
            </div>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 truncate">
              {friend.description}
            </p>
          </div>
        </a>
      ))}
    </div>

    <div class="mt-8 p-4 rounded-lg border bg-zinc-50/50 dark:border-zinc-700 dark:bg-zinc-800/50">
      <h2 class="font-medium text-zinc-900 dark:text-zinc-100 mb-2">交换友链</h2>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        如果你也有博客，欢迎与我交换友情链接。可以通过 
        <a href="mailto:hello@nicholasly.com" class="text-blue-500 underline hover:text-blue-600 dark:hover:text-blue-400">
          邮件
        </a> 
        联系我。
      </p>
    </div>
  </main>
</Layout>
```

修改代码中的 `friends` 数组，添加为真实的友情链接信息：

```
const friends = [
  {
    name: "朋友的博客名称",
    url: "https://朋友的网站.com",
    description: "网站描述",
    avatar: "头像URL或使用默认占位图"
  },
  // 添加更多友情链接...
];
```

接下来要将这个页面添加到导航栏，让它显示出来，在 `src/components/Header.astro` 中添加友情链接：

```
<nav class="flex items-center gap-4">
  <a href="/"> home </a>
  <a href="/posts"> posts </a>
  <a href="/friends"> friends </a>
  <a href={`mailto:${EMAIL}`}>email</a>
</nav>
```

页面创建后，访问 `/friends` 就能看到友情链接页面了。