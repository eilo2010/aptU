---
title: "网站国内外分流"
description: "在服务器上通过 1Panel 搭建环境，结合 Cloudflare 与国内 CDN，实现主域名和辅助域名的分流解析。境内访问可走国内 CDN 提升速度，境外访问则通过 Cloudflare 回源，既能保证稳定高效，又能兼顾安全与灵活性。"
date: "Apr 16 2025"
---
最近我一直在尝试优化网站的访问速度。通过境外 [Cloudflare CDN](https://www.cloudflare.com/zh-cn/application-services/products/cdn) 分流，网站的全球平均打开时间从 2.7s 降到了 1s 左右。

所谓分流，就是让国内访客走国内的 CDN 节点，而国外访客则走 [Cloudflare](https://www.cloudflare.com) 这样的海外节点。这样一来，不同地区的访客都能尽可能快地访问到网站内容。

不过折腾了一圈回头看，我的小破站其实并不一定需要这么复杂的优化。毕竟它只是一个托管在 [Netlify](https://www.netlify.com) 的静态博客，花钱去买额外的亚太 CDN 并没有太大意义。我最终还是切回了 Netlify 的原生服务，把精力放在优化博客本身的加载体验上。

当然，这种国内外分流的方法在动态网站或对访问速度要求更高的项目中非常实用，所以这里还是把我的经验分享出来，希望对需要的朋友有所帮助。

首先需要一台服务器，并在其上通过 [1Panel](https://1panel.cn) 搭建好运行环境，这是整个配置的基础。

![1Panel](https://i.284628.xyz/kylszJUe.webp)

然后准备两个域名：主域名用于最终对外访问，必须托管在支持 DNS 分流的服务商（如[阿里云](https://wanwang.aliyun.com/domain/dns)、[腾讯云](https://cloud.tencent.com/product/dns)、[华为云](https://www.huaweicloud.com/product/dns.html) DNS），如果现有域名不支持，可以通过子域名的 NS 记录指向这些厂商来实现。

![](https://i.284628.xyz/E9JLxU3g.webp)

辅助域名绑定在 Cloudflare 并开启 Cloudflare CDN 在 1Panel 中配置，作为源站使用。

![辅助域名](https://i.284628.xyz/G6TgHSi1.webp)

最后需要一个 Cloudflare 账号用于设置自定义主机名，同时选择一家国内访问速度较好的 CDN 厂商，将主域名接入以完成国内加速，从而实现境内外分流访问。

首先需要在 1Panel 搭建网站，绑定辅助域名，比如 `source.辅助域名.com`，然后通过 1Panel 自带的 [Let’s Encrypt](https://letsencrypt.org) 功能申请 SSL 证书，确保站点可以正常访问 `HTTPS`。

![1Panel网站](https://i.284628.xyz/DvDAKcov.webp)

接下来打开 Cloudflare 的自定义主机名，新增一个回退源，填写刚才在 1Panel 搭建的辅助域名。

![回退源](https://i.284628.xyz/hkzjvAT6.webp)

然后添加一个自定义主机名，使用主域名或主域名的子域名，比如 `主域名.com` 或 `www.主域名.com`，验证方式选择 `TXT`，在 DNS 服务商添加对应的 TXT 记录，Cloudflare 验证成功后，主域名就可以通过 Cloudflare 反向代理到源站了。

![](https://i.284628.xyz/GARpG7jQ.webp)

![](https://i.284628.xyz/lw3HSeO1.webp)

之后在国内 CDN 厂商添加主域名加速，源站设置填写 1Panel 绑定的辅助域名，例如 `source.辅助域名.com`，端口 `443`，协议 `HTTPS`，并将 Host 设置为源站域名以保证回源正确。CDN 会分配一个 `CNAME` 地址，然后在主域名的 DNS 管理后台设置线路：默认线路或境内线路指向国内 CDN 地址，境外线路指向辅助域名。

最后在国内 CDN 控制台申请 SSL 证书，确保主域名在国内 CDN 和 Cloudflare 都支持 `HTTPS`，然后用网站测速工具测试访问效果，国内节点访问走国内 CDN，国外节点访问走 Cloudflare 回源。这样就完成了国内外分流访问的配置，既保证国内访问速度，又能让国外访问顺畅安全。