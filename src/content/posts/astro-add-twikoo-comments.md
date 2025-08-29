---
title: "Astro 接入 Twikoo 评论系统"
description: "在将博客从 Hexo 迁移到 Astro 并手工打造友情链接页面后，我继续为新博客加入评论功能。最终选择了 Twikoo 作为评论系统，保留原有的灵活体验，并分享了完整的集成方法和代码示例，助你快速在 Astro 博客中启用互动交流。"
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
    data-env-id={envId}
    data-path={path || 'auto'}
  >
    <div class="flex items-center justify-center py-8 text-zinc-500 dark:text-zinc-400">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
      正在加载评论...
    </div>
  </div>
</div>

<!-- 使用 defer 属性延迟执行，确保 DOM 就绪 -->
<script 
  src="https://cdn.jsdelivr.net/npm/twikoo@1.6.32/dist/twikoo.all.min.js"
  defer
></script>

<!-- 内联脚本处理初始化 -->
<script is:inline>
  // 全局变量存储重试次数
  window.twikooRetryCount = 0;
  window.maxRetries = 20; // 最大重试次数

  function waitForTwikoo(callback, retryCount = 0) {
    if (typeof window.twikoo !== 'undefined') {
      callback();
    } else if (retryCount < window.maxRetries) {
      setTimeout(() => waitForTwikoo(callback, retryCount + 1), 200);
    } else {
      console.error('Twikoo failed to load after maximum retries');
      showErrorMessage();
    }
  }

  function showErrorMessage() {
    const containers = document.querySelectorAll('#tcomment');
    containers.forEach(container => {
      if (container) {
        container.innerHTML = `
          <div class="text-center py-8 text-red-500">
            <p>评论系统加载失败</p>
            <button onclick="location.reload()" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
              重新加载
            </button>
          </div>
        `;
      }
    });
  }

  function initializeTwikoo() {
    const container = document.getElementById('tcomment');
    
    if (!container) {
      console.warn('Twikoo container (#tcomment) not found');
      return;
    }

    const envId = container.getAttribute('data-env-id');
    const path = container.getAttribute('data-path');
    
    if (!envId) {
      console.error('Twikoo envId not provided');
      container.innerHTML = '<div class="text-center py-8 text-red-500">评论系统配置错误</div>';
      return;
    }

    try {
      // 清理容器
      container.innerHTML = '';
      
      // 初始化 Twikoo
      window.twikoo.init({
        envId: envId,
        el: '#tcomment',
        path: path === 'auto' ? location.pathname : path,
        lang: 'zh-CN'
      });
      
      console.log('Twikoo initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Twikoo:', error);
      container.innerHTML = `
        <div class="text-center py-8 text-red-500">
          <p>评论系统初始化失败</p>
          <p class="text-sm mt-1">${error.message}</p>
          <button onclick="location.reload()" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
            重新加载
          </button>
        </div>
      `;
    }
  }

  function handlePageInit() {
    // 重置重试计数
    window.twikooRetryCount = 0;
    
    // 等待 Twikoo 脚本加载完成后初始化
    waitForTwikoo(initializeTwikoo);
  }

  // 首次加载处理
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handlePageInit);
  } else {
    // DOM 已经准备就绪，延迟一点执行以确保所有脚本都加载完成
    setTimeout(handlePageInit, 100);
  }

  // Astro ViewTransitions 支持
  document.addEventListener('astro:after-swap', () => {
    console.log('Page swapped, reinitializing Twikoo');
    setTimeout(handlePageInit, 150);
  });

  // 页面可见性变化处理（可选）
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      const container = document.getElementById('tcomment');
      if (container && container.children.length === 0) {
        console.log('Page became visible, checking Twikoo');
        setTimeout(handlePageInit, 100);
      }
    }
  });
</script>

<style is:global>
  .twikoo-container {
    font-family: inherit;
    min-height: 200px;
  }
  
  .dark .twikoo-container {
    background-color: transparent;
  }
  
  /* 输入框样式 */
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
  
  /* 按钮样式 */
  .dark .tk-submit {
    background-color: rgb(24 24 27) !important;
    border-color: rgb(63 63 70) !important;
    color: rgb(228 228 231) !important;
  }
  
  .dark .tk-submit:hover {
    background-color: rgb(39 39 42) !important;
  }
  
  /* 评论区域样式 */
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
  
  /* 链接样式 */
  .dark .tk-comment a {
    color: rgb(96 165 250) !important;
  }
  
  .dark .tk-comment a:hover {
    color: rgb(147 197 253) !important;
  }
  
  /* 表情包容器 */
  .dark .tk-owo-container {
    background-color: rgb(39 39 42) !important;
    border-color: rgb(63 63 70) !important;
  }
  
  /* 标签和额外信息 */
  .dark .tk-tag,
  .dark .tk-extras {
    color: rgb(161 161 170) !important;
  }
  
  /* 字体和边框圆角 */
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
  
  /* 加载状态 */
  .dark .tk-loading {
    color: rgb(161 161 170) !important;
  }
  
  /* 加载动画 */
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
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