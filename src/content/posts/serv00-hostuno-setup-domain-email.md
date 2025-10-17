---
title: "Serv00/HostUNO 设置域名邮箱"
description: "在 Serv00/HostUNO 创建邮箱账户，并为域名配置 MX 记录以接收邮件。随后，添加主机后台提供的 SPF 与 DKIM 两条 TXT 记录，用于验证发件人身份并提高邮件可信度。最后设置 Catch-All 功能，将发送到域名下任意地址的邮件统一接收到主邮箱。"
date: "Dec 14 2024"
---

首先，我们需要在主机后台创建一个基础的邮箱账户。登录 Serv00/HostUNO 网页后台。在左侧菜单栏中点击:

```
Email
```

点击上方的:

```
Add new email
```

输入想要创建的邮箱地址（例如 `admin@yourdomain.com`），并为其设置一个安全的密码，然后点击:

```
Add
```

![](https://i.284628.xyz/pZItfaAR.webp)

登录 Cloudflare 账户，并选择要设置的域名。点击左侧菜单栏中的:

```
DNS
```

```
添加记录
```

类型选择:
```
MX
```

名称填写:

```
@
```

内容输入邮件服务器地址。这个地址可以在邮件中找到，或者在 Serv00/HostUNO 后台的 Account information 页面的 Mail servers 板块查看。

![](https://i.284628.xyz/2fbuI5Bf.webp)

例如:

```
mail6.serv00.com
```

优先级通常填写:

```
10
```

点击:

```
保存
```

完成这两步后，域名邮箱已经可以成功接收邮件了。点击 Serv00/HostUNO 后台的 Email 页面的:

```
Open web client
```

登录网页版邮箱进行测试。用户名和密码填写前面创建的。

为了确保发送的邮件能被顺利接收而不是被当作垃圾邮件，需要添加 SPF 和 DKIM 两条 DNS 记录。

> [SPF](https://zh.wikipedia.org/wiki/%E5%8F%91%E4%BB%B6%E4%BA%BA%E7%AD%96%E7%95%A5%E6%A1%86%E6%9E%B6) 记录用于告知收件方，从指定服务器发出的邮件才是合法邮件，以防他人伪造。

> [DKIM](https://zh.wikipedia.org/wiki/%E5%9F%9F%E5%90%8D%E5%AF%86%E9%92%A5%E8%AF%86%E5%88%AB%E9%82%AE%E4%BB%B6) 记录相当于在邮件上加盖一个“数字签章”，以证明邮件在传输过程中未被篡改

在 Serv00/HostUNO 后台，在左侧菜单栏中点击:

```
DNS Zones
```

```
Edit
```

系统会列出一条 TXT 记录，这就是 SPF 记录。将其内容复制下来。
回到 Cloudflare，添加一条新的 DNS 记录。

类型选择:
```
TXT
```

名称填写:

```
@
```

内容粘贴刚刚从 Serv00/HostUNO 复制的内容。

点击:

```
保存
```

在 Serv00/HostUNO 后台，进入 Email 菜单，然后点击:

```
DKIM
```

```
Sign Domain
```

系统会生成一条 DKIM 记录，包含名称和内容两部分。

回到 Cloudflare，再次添加一条 TXT 记录

类型选择:
```
TXT
```

名称粘贴从 HostUNO 生成的第一行红色内容。

内容粘贴从 HostUNO 生成的第二段红色内容。

点击:

```
保存
```

完成设置后，邮箱的可信度会大大提高，发送的邮件更有可能直接进入对方的收件箱，而不是垃圾箱。

如果希望任何发送到 `*@yourdomain.com`（例如 `test@yourdomain.com`, `info@yourdomain.com` 等任意前缀）的邮件都能被收到，而无需为每一个地址都创建账户，可以设置 Catch-All 功能。

在 Serv00/HostUNO 的邮箱列表中，点击已创建账户右侧的:

```
Details
```

点击上方的:

```
Add New alias
```

选择:

```
Advanced Settings
```

将别名类型修改为:

```
Catch-All
```

在上方输入域名的全称，例如:

```
yourdomain.com
```

最后点击:

```
Add
```

现在，所有发送到域名下任意不存在地址的邮件，都会被转发到这个主邮箱中。