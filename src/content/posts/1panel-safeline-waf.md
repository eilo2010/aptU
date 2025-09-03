---
title: "1Panel 安装雷池 WAF"
description: "我在服务器上使用 1Panel 安装了雷池 WAF，提升了 Web 应用的安全性。通过简洁的一键脚本安装，配置 OpenResty 端口避免冲突，最终成功部署了防护。雷池 WAF 能有效阻挡 SQL 注入等攻击，配置过程简单，几步就能完成。本文分享了安装过程、配置技巧及防护效果，适合有一定技术基础的用户参考，帮助加固服务器安全。"
date: "Aug 24 2025"
---
最近，我决定在我的服务器上添加一层防护。那就当然想试试大名鼎鼎的雷池WAF，这个安全防护工具在全网有着很高的评价。我需要将1Panel与雷池WAF同时部署在同一个环境下。

在部署过程中，我遇到了一个小问题：雷池WAF需要占用80端口和443端口，这与我的Web服务的端口冲突了。雷池WAF与Nginx服务也都占用这两个常见端口，这就需要对配置做一些修改。

幸运的是，1Panel作为服务器管理工具，本身并不强制要求固定端口，因此在同一台VPS上部署多个服务并没有太大难度。通常情况下，管理面板如Nginx会占用这些端口，但通过调整配置文件，我们可以轻松避免端口冲突，实现多服务共存。

我的服务器运行 [Ubuntu 22.04](https://releases.ubuntu.com/jammy) ，架构x86_64。系统支持ssse3和avx2指令集。Docker版本28.3.3，Compose v2.39.1。内存3.8Gi可用，磁盘空间充足，都符合安装雷池的要求。

```bash
uname -m
lscpu | grep ssse3
lscpu | grep avx2
docker version
docker compose version
free -h
df -h
```

1Panel还没装，我就先装它。直接用root跑一键脚本。脚本下载安装一切，自动配置服务。

```bash
bash -c "$(curl -sSL https://resource.fit2cloud.com/1panel/package/v2/quick_start.sh)"
```

安装完，脚本给了访问地址，比如http://我的IP:24045/随机码 。用户名和密码也显示了，记下来。浏览器打开，登录 1Panel。

1Panel不占80和443端口，无冲突。但安装 [OpenResty](https://openresty.org/cn) 会默认使用这些端口。

雷池防护应用常需监听80和443。若OpenResty先占，会导致冲突。

在1Panel应用商店搜索:

```
OpenResty
```

安装时，修改其HTTP端口为8080，HTTPS为8443。

![](https://i.284628.xyz/FenS37I4.webp)

这样让出80和443。安装OpenResty后，确认端口已改。

接下来安装雷池。进入1Panel的SSH终端，切换root。

执行雷池自动安装脚本。

```bash
bash -c "$(curl -fsSLk https://waf-ce.chaitin.cn/release/latest/manager.sh)"
```

三分钟就装好了。用户名和密码也同样显示了，记下来。默认端口是9443，需要在防火墙放行9443端口。

![](https://i.284628.xyz/zcVRoQO8.webp)

装好后，浏览器访问https://我的IP:9443 。第一次登录，它自动初始化admin账户。如果密码忘了，在终端跑重置命令。

```bash
docker exec safeline-mgt resetadmin
```

输出新密码，我就登录了。控制台简洁，数据统计页一目了然。我加了个防护应用，填域名、端口、上游服务器地址。域名解析到服务器IP，勾选SSL用自签证书。

测试时，用配置的域名访问我的Web app。雷池数据页请求数涨了，说明防护生效。恶意流量试了SQL注入，它直接挡掉。

雷池是反向代理，基于Nginx。流量从互联网来，先过它这关，恶意挡住，正常放行。内部逻辑复杂，但用着不费劲。

高级功能我还没深挖，像人机验证、限频。等候室防爆刷也实用。整体在1Panel里装，环境依赖就那些，改端口几步事，超级简单。