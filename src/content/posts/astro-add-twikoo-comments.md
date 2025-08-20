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
  
  .tk-avatar {
    display: none !important;
  }
  
  .tk-content {
    margin-left: 0 !important;
  }
  
  .tk-main {
    margin-left: 0 !important;
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

最后将代码中的 `"your-twikoo-env-id"` 替换为实际环境 ID。