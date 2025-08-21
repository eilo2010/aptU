---
title: "Astro 接入 Twikoo 评论系统"
description: "在 Astro 博客中接入 Twikoo 评论系统，让访客可以自由留言互动，为极简主题增加评论功能。"
date: "Aug 20 2025"
---
在前面的文章里，我先是把博客从 Hexo 迁移到了 Astro，然后又手搓了一个友情链接页面，让整体风格更加完整。接下来要实现的功能就是评论区了。

对于一个博客来说，评论区不仅能让访客表达想法，也能增加互动感。我的 Hexo 博客一直用的就是 [Twikoo](https://twikoo.js.org)，功能已经配置的比较完善，所以迁移到 Astro 后也自然想继续用它。其实我也考虑过接入 [Giscus](https://giscus.app)，但想了想，它依赖 GitHub Issues，而且限制相对较大，不如 Twikoo 来得灵活。最后，我还是决定让 Twikoo 成为新博客的评论系统。

首先我需要创建评论组件，将下面代码保存为 `src/components/TwikooComments.astro`:
```
---
interface Props {
  envId: string;
  path?: string;
}

const { envId, path } = Astro.props;
---

<div class="mt-8">
  <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">评论</h2>
  <div 
    id="tcomment" 
    class="twikoo-container rounded-lg border p-4 dark:border-zinc-700"
  ></div>
</div>

<script 
  src="https://cdn.jsdelivr.net/npm/twikoo@1.6.32/dist/twikoo.all.min.js"
  is:inline
></script>

<script define:vars={{ envId, path }}>
  const initTwikoo = () => {
    if (typeof twikoo !== 'undefined') {
      twikoo.init({
        envId: envId,
        el: '#tcomment',
        path: path || location.pathname,
        lang: 'zh-CN'
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTwikoo);
  } else {
    initTwikoo();
  }

  document.addEventListener('astro:after-swap', initTwikoo);
</script>

<style is:global>
  .twikoo-container {
    font-family: inherit;
  }
  
  .dark .twikoo-container {
    background-color: transparent;
  }
  
  .dark .tk-content textarea,
  .dark .tk-input input {
    background-color: rgb(39 39 42) !important;
    border-color: rgb(63 63 70) !important;
    color: rgb(228 228 231) !important;
  }
  
  .dark .tk-content textarea:focus,
  .dark .tk-input input:focus {
    border-color: rgb(96 165 250) !important;
  }
  
  .dark .tk-submit {
    background-color: rgb(24 24 27) !important;
    border-color: rgb(63 63 70) !important;
    color: rgb(228 228 231) !important;
  }
  
  .dark .tk-submit:hover {
    background-color: rgb(39 39 42) !important;
  }
  
  .dark .tk-comment,
  .dark .tk-replies-wrap {
    background-color: transparent !important;
    border-color: rgb(63 63 70) !important;
  }
  
  .dark .tk-comment .tk-main {
    color: rgb(228 228 231) !important;
  }
  
  .dark .tk-comment .tk-meta span {
    color: rgb(161 161 170) !important;
  }
  
  .dark .tk-comment a {
    color: rgb(96 165 250) !important;
  }
  
  .dark .tk-comment a:hover {
    color: rgb(147 197 253) !important;
  }
  
  .dark .tk-owo-container {
    background-color: rgb(39 39 42) !important;
    border-color: rgb(63 63 70) !important;
  }
  
  .dark .tk-tag,
  .dark .tk-extras {
    color: rgb(161 161 170) !important;
  }
  
  .tk-comment,
  .tk-content,
  .tk-input {
    font-family: 'Geist', system-ui, sans-serif !important;
  }
  
  .tk-content textarea,
  .tk-input input,
  .tk-submit,
  .tk-comment,
  .tk-owo-container {
    border-radius: 0.5rem !important;
  }
  
  .tk-comment {
    margin-bottom: 1rem !important;
  }
  
  .dark .tk-loading {
    color: rgb(161 161 170) !important;
  }
</style>
```

再将下面代码替换你现有的 `src/pages/posts/[...slug].astro`:

```
---
import { type CollectionEntry, getCollection } from "astro:content";
import Layout from "../../layouts/Layout.astro";
import { formatDate } from "../../lib/utils";
import TwikooComments from "../../components/TwikooComments.astro";

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}
type Props = CollectionEntry<"posts">;

const post = Astro.props;
const { Content } = await post.render();
---

<Layout
  title={post.data.title}
  description={post.data.description}
  image={post.data.image}
>
  <main>
    <h1 class="mb-5 text-xl font-medium">
      {post.data.title}
    </h1>
    <p class="mb-1 font-medium text-zinc-500">
      {formatDate(post.data.date)}
    </p>
    <article>
      <Content />
    </article>
    
    <!-- 评论区 -->
    <TwikooComments 
      envId="your-twikoo-env-id" 
      path={`/posts/${post.slug}`}
    />
  </main>
</Layout>
```

最后将代码中的 `"your-twikoo-env-id"` 替换为实际环境 ID，就可以在博客中使用 Twikoo 评论系统了。

既然评论区已经配置完成，那么友情链接页面也没必要再保留“通过邮件联系”的提示。相比发邮件，直接在页面下方留言会更方便。所以我打算把友情链接页面的那一段提示替换成评论区，让访客可以直接在页面留言交换友链。

```
---
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import Layout from "../layouts/Layout.astro";
import TwikooComments from "../components/TwikooComments.astro";

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

// Twikoo 环境 ID，需要替换成你的实际 ID
const TWIKOO_ENV_ID = "your-twikoo-env-id";
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

    <!-- 友情链接页面评论区 -->
    <TwikooComments 
      envId={TWIKOO_ENV_ID} 
      path="/friends"
    />
  </main>
</Layout>
```

同样将代码中的 `"your-twikoo-env-id"` 替换为实际环境 ID。