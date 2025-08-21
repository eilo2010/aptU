---
title: "从 Hexo 迁移到 Astro"
description: "因为新域名的缘故，我将博客从 Hexo 迁移到 Astro，记录了环境安装、主题配置、文章导入到 Netlify 部署的全过程。整体体验顺手，性能优异，文档完善，还自带 RSS 与网站地图。"
date: "Aug 19 2025"
---
这两天我买了一个新的域名，总觉得它应该配一个复古简洁的主题。原来一直在用 [Hexo](https://hexo.io)，虽然主题挺多，但找了半天，我就是没找到符合要求的主题。  

正好最近刷到了一些关于 [Astro](https://astro.build) 这个前端框架的视频，觉得它的思路和设计都很不错。而且有我喜欢的[主题](https://github.com/nicholasdly/miniblog)，于是就决定趁这个机会，把博客从 Hexo 迁移到 Astro。

因为找到了喜欢的主题，就没必要重复造轮子，直接克隆了主题仓库。Astro 的环境和 Hexo 的环境一样，所以就不需要重新配置环境，省去了很多麻烦。克隆后我用 [vscode](https://code.visualstudio.com) 进入克隆的文件夹，打开终端，输入:

```
npm install
```

安装依赖项，等待安装完成后再输入:

```
npm run dev
```

来测试项目是否正常运行。 这样就可以在本地预览这个项目，确保准确无误后就可以修改信息和站点的元数据。每个主题都不一样，我用的这个主题是在 `src/consts.ts` 里改：

```
export const SITE_URL = "https://aptu.net";
export const SITE_TITLE = "aptU";
export const SITE_DESCRIPTION = "Welcome to my website!";
export const EMAIL = "hello@nicholasly.com";
```

因为文章的格式不一样，所以文章只能手动导入。Astro 的文章前部分是这样的，和 Hexo 不一样：

```
---
title: "从 Hexo 切到 Astro 的一点小体验"
description: "因为新域名的缘故，从 Hexo 切换到 Astro，重新搭建我的博客，也重新开始学习前端框架。"
date: "Aug 19 2025"
---
```

在把文章导入后就剩首页配置了，我的这个主题首页配置是在 `src/pages/index.astro`，只需修改这个文件里的 `<main>` 即可。完成后配置就差不多了，也没有其他的东西。剩下的我打算全部手搓，比如手搓一个[友情链接](/posts/astro-add-friend-links)，然后再手搓一个[评论区](/posts/astro-add-twikoo-comments)，因为这个主题它都没有这些东西。

完成了上面的这些配置，基本的本地预览已经没问题了，接下来就是最后一步，把网站上线到互联网，让大家都可以正常访问到。

我先在 [GitHub](https://github.com) 上新建了一个仓库，然后在本地初始化:
```
git init
```
接着执行:
```
git remote add origin git@github.com:用户名/仓库名.git
```
再用:
```
git add .
git commit -m "first commit" 
```
因为我本地分支是 `master` 而不是 `main`，所以我需要把分支改成 `main` 并推送:
```
git branch -M main
git push -u origin main
```
这样就能成功推上去了。

之后你所有的提交，只要是在 `main` 分支上做的，正常推送即可：
```
git add .
git commit -m "更新内容"
git push origin main
```

接着打开 [Netlify](https://www.netlify.com)，直接用 GitHub 账号登录，然后选择刚才的仓库，一键导入。Netlify 会自动识别这是一个 Astro 项目，默认的 `npm run build` 脚本都不用改。点一下部署按钮，等它跑完，就能拿到一个 `netlify.app` 的二级域名。

如果想用自己的域名，就在 Netlify 里点进去项目设置，加上自定义域名，然后去域名的 DNS 那里加一条 `CNAME` 到 Netlify 提供的地址就行。

这样整个网站就算上线了，别人也可以通过互联网访问。

目前就这样，整体体验下来，Astro 真的很顺手，访问速度很快，各方面性能也非常强悍，自己折腾起来比 Hexo 更自由。最让我满意的是它的文档非常详细，而且提供了简体中文的官方翻译，上手简单。安装主题后，它还会自动生成 [RSS](/rss.xml) 和 [网站地图](/sitemap-index.xml)，不用再手动安装插件，非常方便。