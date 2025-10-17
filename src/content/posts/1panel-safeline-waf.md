---
title: "1Panel 安装雷池 WAF"
description: "我在服务器上使用 1Panel 安装了雷池 WAF，提升了 Web 应用的安全性。通过简洁的一键脚本安装，配置 OpenResty 端口避免冲突，最终成功部署了防护。雷池 WAF 能有效阻挡 SQL 注入等攻击，配置过程简单，几步就能完成。"
date: "Aug 24 2025"
---
最近，我决定在我的服务器上添加一层防护。那就当然想试试大名鼎鼎的[雷池WAF](https://waf-ce.chaitin.cn)。

雷池WAF 需要占用 80 端口和 443 端口，与我 [OpenResty](https://openresty.org) 的端口冲突了。这就需要对端口做一些修改。


在左侧菜单栏中点击:

```
应用商店
```

找到 OpenResty 并点击:

```
卸载
```

勾选:

```
强制卸载
```

```
删除备份
```

```
删除镜像
```

输入:

```
OpenResty
```

点击:

```
确认
```

接下来要重新安装 OpenResty，并对其端口进行修改。

修改其 HTTP 端口为:

```
8080
```

HTTPS 端口为:

```
8443
```

这样让出 80 和 443 端口后，就可以安装雷池WAF。进入服务器的的 SSH 终端，切换 root 权限:

```bash
sudo -i
```

执行雷池WAF 自动安装脚本:

```bash
bash -c "$(curl -fsSLk https://waf-ce.chaitin.cn/release/latest/manager.sh)"
```

安装完成后。用户名和密码会显示出来，记下来。默认端口是 9443，需要在防火墙放行 9443 端口。

左侧菜单栏中点击:

```
系统
```

```
防火墙
```

点击:

```
创建端口规则
```

端口填写:

```
9443
```

最后点击:

```
确认
```

浏览器访问 http://服务器公网 IP:9443。即可登录雷池WAF 后台。第一次登录，它自动初始化 admin 账户。

如果密码忘了，在终端跑重置命令:

```bash
docker exec safeline-mgt resetadmin
```
