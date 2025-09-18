---
title: "Astro 接入 Giscus 评论系统"
description: "在将博客从 Hexo 迁移到 Astro 并手工打造友情链接页面后，我继续为新博客加入评论功能。最终选择了 Twikoo 作为评论系统，保留原有的灵活体验，并分享了完整的集成方法和代码示例，助你快速在 Astro 博客中启用互动交流。"
date: "Sep 02 2025"
---
在前面的文章中，我讲到如何在 Astro 博客中接入 [Twikoo](https://twikoo.js.org/) 评论系统。当时选择 Twikoo，主要是因为我在 Hexo 博客时一直在使用它，对功能比较熟悉，而且也足够灵活。不过在实际使用中，我发现 [Giscus](https://giscus.app/) 更好用啊。

Giscus 的评论数据完全存储在 [GitHub Discussions](https://docs.github.com/en/discussions) 上，不需要额外的数据库支持，配置也非常简单。更棒的是，访客的评论还能通过 [GitHub](https://github.com/) 邮件提醒我，管理起来十分方便。

首先在 GitHub 上新建一个公开仓库，然后在仓库的 Settings 页面启用：

```
Discussions
```

接着点击 [giscus app](https://github.com/apps/giscus)，在 GitHub 上完成 giscus app 的安装。

![](https://i.284628.xyz/ZIJQRmtU.webp)

然后前往 [Giscus](https://giscus.app/)，填写你在 GitHub 中的仓库地址，通过检查。

![](https://i.284628.xyz/gAbeEBRE.webp)

接下来在映射关系中选择：

```
pathname
```

例如文章路径为：

```
/posts/astro-add-giscus-comments
```

那么只要保证这个路径不变，评论和页面就会始终匹配。

分类推荐选择：

```
Announcements
```

特性勾选：

```
启用主帖子上的反应（reaction）
```

```
将评论框放在评论上方
```

```
懒加载评论
```

主题选择：

```
用户偏好的色彩方案
```

最后将 Giscus 生成的这段 `JS` 复制下来，放置在你想作为评论区的区块即可。

以我的主题为例，可以将下面的代码替换掉现有的 `src/pages/posts/[...slug].astro`：

```astro
---
import { type CollectionEntry, getCollection } from "astro:content";
import Layout from "../../layouts/Layout.astro";
import { formatDate } from "../../lib/utils";

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
    <h1 class="mb-5 text-xl font-medium">{post.data.title}</h1>
    <p class="mb-1 font-medium text-neutral-500">
      {formatDate(post.data.date)}
    </p>
    <article>
      <Content />
    </article>
    
    <!-- Giscus 评论区 -->
    <div class="mt-8">
      <h2 class="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">评论</h2>
      <div class="giscus-container rounded-lg border p-4 dark:border-zinc-700">
        <script 
          src="https://giscus.app/client.js"
          data-repo="eilo2010/Giscus"
          data-repo-id="R_kgDOPpA23Q"
          data-category="Announcements"
          data-category-id="DIC_kwDOPpA23c4Cu6is"
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="top"
          data-theme="preferred_color_scheme"
          data-lang="zh-CN"
          data-loading="lazy"
          crossorigin="anonymous"
          async>
        </script>
      </div>
    </div>
  </main>
</Layout>
```