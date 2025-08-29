---
title: "1Panel 安装雷池 WAF"
description: ""
date: "Aug 24 2025"
---
我最近想在服务器上加个WAF防护，就试了试[雷池](https://waf-ce.chaitin.cn)，听说它非常强大。我的服务器管理工具是 [1Panel](https://1panel.cn) 。

环境依赖其实不复杂，我先检查了下我的Linux系统。

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