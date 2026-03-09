# OpenClaw 详细介绍

## 1、什么是 OpenClaw？

因为有些同学可能之前没听过，我们先来说说 OpenClaw 是什么。

OpenClaw（社区昵称：龙虾，曾用名 Clawdbot / Moltbot）是一款本地优先、自托管、多通道统一接入的开源 AI Agent 执行引擎，MIT 协议开源，GitHub 星标超 200k。

它不是普通聊天机器人，而是能真正执行任务的个人 / 团队 AI 助手：通过自然语言指令，完成文件操作、浏览器自动化、系统命令、定时任务、第三方服务调用等真实工作。

OpenClaw 其实最早火的时候名字叫 CrawlBot，它的标志是一个龙虾图案。后来因为商标问题被迫改名，中间迅速改名叫 MoteBot，最后定为现在的名字——OpenClaw。所以大家在网上看到的 CrawlBot、MoteBot、OpenClaw，其实是一个东西，只是中间换了名字。

## 2、系统要求

### 2.1 硬件要求
- 操作系统：Windows 10+ / macOS 12+ / Linux (Ubuntu 20.04+)
- 内存：建议 4GB 以上
- 存储：至少 1GB 可用空间

### 2.2 软件要求
- Git：用于版本控制和技能管理
- Node.js：v22.0.0 或更高（推荐 LTS 版本）
- npm：v10.0.0 或更高（随 Node.js 安装）

## 3、安装部署

### 3.1 安装 Node.js

**Windows 系统：**
- 访问 Node.js 官网：https://nodejs.org
- 下载并安装 Node.js 22.x LTS 版本
- 安装时选择默认设置，一直点击下一步

**macOS/Linux 系统：**
```bash
# 使用 nvm 安装 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 22
nvm use 22
nvm alias default 22
```

### 3.2 安装 OpenClaw

**方式一：官方原版**
```bash
# 全局安装
npm install -g @openclaw/cli

# 验证安装
openclaw --version
```

**方式二：中文版**
```bash
# 全局安装中文版
npm install -g openclaw-cn

# 验证安装
openclaw-cn --version
```

**方式三：使用安装脚本**
```bash
# 一键安装
curl -fsSL https://openclaw.ai/install.sh | bash
```

## 4、初始化配置

### 4.1 运行配置向导

**官方原版：**
```bash
# 启动配置向导
openclaw init

# 或启动安装向导并安装守护进程
openclaw onboard --install-daemon
```

**中文版：**
```bash
# 启动配置向导
openclaw-cn onboard
```

### 4.2 配置模型

OpenClaw 支持多种模型提供方：
- OpenAI
- Claude
- Gemini
- 硅基流动 (SiliconFlow)
- DeepSeek
- 通义千问
- 腾讯混元
- Ollama（本地模型）

**配置硅基流动模型示例：**
```bash
# 设置 API Key（从 https://cloud.siliconflow.cn/ 获取）
openclaw config set models.siliconflow.apiKey "your-api-key-here"

# 设置默认模型
openclaw config set models.default "siliconflow/deepseek-ai/DeepSeek-V3"
```

### 4.3 配置消息渠道

OpenClaw 支持多种消息渠道：
- 飞书
- 微信
- 钉钉
- Telegram
- Slack
- Discord
- 企业微信

## 5、飞书接入详细配置

### 5.1 前置准备

- 已安装 OpenClaw 工具（确保版本为 2026.2.26 及以上）
- 拥有飞书账号，且具备企业应用创建权限
- 电脑终端可正常执行命令

### 5.2 安装飞书插件

```bash
# 安装飞书插件
openclaw plugins install @openclaw/feishu

# 或中文版
openclaw-cn plugins install @openclaw/feishu
```

### 5.3 创建飞书应用

1. **访问飞书开放平台**：https://open.feishu.cn/app
2. **登录**：使用飞书账号登录
3. **创建应用**：点击“创建应用” → “企业自建应用”
4. **填写信息**：应用名称、应用描述、图标
5. **获取凭证**：在“凭证与基础信息”页面复制 App ID 和 App Secret

### 5.4 配置应用权限

在“权限管理”页面，需要开启以下权限：
- `im:message` - 消息权限
- `im:chat` - 群组权限
- `im:message:send` - 发送消息权限
- 事件订阅：`im.message.receive_v1`

### 5.5 配置 OpenClaw 飞书连接

```bash
# 配置飞书凭证
openclaw config set channels.feishu '{
  "enabled": true,
  "appId": "your-app-id",
  "appSecret": "your-app-secret",
  "domain": "feishu"
}' --json
```

### 5.6 发布应用

1. **创建版本**：在“版本管理与发布”页面创建新版本
2. **提交审核**：填写发布说明，提交审核
3. **等待审核**：个人自用可选择“仅自己可见”
4. **添加机器人**：在飞书中搜索应用名称，添加到群组或私聊

### 5.7 测试使用

```bash
# 启动 OpenClaw 网关
openclaw gateway start

# 或后台启动
openclaw gateway start --daemon
```

在飞书中 @机器人发送消息测试：
```
@OpenClaw 助手 你好
```

## 6、技能系统（Skills）

### 6.1 什么是 Skills？

Skills 是 OpenClaw 的插件系统，每个 Skill 都是针对特定场景封装好的功能模块，安装后就能立即使用。

OpenClaw 的核心架构分为三层：
- **Gateway（网关）**：负责连接各种消息渠道
- **Agent（智能体）**：负责理解和推理
- **Skills（技能）**：负责操作外部世界

### 6.2 技能分类

#### 6.2.1 办公效率类
- **文档处理**：自动整理、格式转换、内容提取
- **邮件管理**：自动收发、分类整理、定时发送
- **日程管理**：日历同步、提醒设置、会议安排

#### 6.2.2 开发工具类
- **代码辅助**：代码生成、代码审查、Bug 修复
- **Git 操作**：自动提交、分支管理、代码合并
- **API 测试**：接口调试、自动化测试、文档生成

#### 6.2.3 数据分析类
- **数据抓取**：网页爬虫、数据提取、定时采集
- **报表生成**：数据可视化、图表生成、自动发送
- **监控告警**：网站监控、API 监控、异常告警

#### 6.2.4 生活助手类
- **天气查询**：实时天气、天气预报、出行建议
- **新闻资讯**：热点追踪、行业动态、定制推送
- **翻译工具**：多语言翻译、文档翻译、实时翻译

### 6.3 安装技能

```bash
# 安装指定技能
openclaw skills install @openclaw/skill-name

# 示例：安装内容生成技能
openclaw skills install content-generate

# 示例：安装浏览器自动化技能
openclaw skills install @openclaw/browser

# 示例：安装文件系统技能
openclaw skills install @openclaw/filesystem
```

### 6.4 推荐必装技能

1. **content-generate** - 内容生成（写文章、写标题、写脚本）
2. **@openclaw/browser** - 浏览器自动化
3. **@openclaw/filesystem** - 文件系统操作
4. **@openclaw/scheduler** - 定时任务
5. **@openclaw/memory** - 记忆功能
6. **@openclaw/feishu** - 飞书集成
7. **@openclaw/wechat** - 微信集成
8. **@openclaw/email** - 邮件处理
9. **@openclaw/calendar** - 日历管理
10. **@openclaw/weather** - 天气查询

## 7、记忆功能

### 7.1 记忆系统概述

OpenClaw 设计了本地优先的双模记忆系统：

- **短期记忆**：保存 72 小时对话上下文，确保多轮交互连贯
- **长期记忆**：用本地数据库永久存储用户偏好和任务记录，让它越用越懂你

### 7.2 启用记忆功能

```bash
# 安装记忆技能
openclaw skills install @openclaw/memory

# 配置记忆存储
openclaw config set memory.enabled true
openclaw config set memory.storage "local"
```

### 7.3 记忆系统特点

- **本地化存储**：数据存储在本地设备，不上传云端
- **跨会话记忆**：不同会话之间保持记忆连续性
- **智能检索**：根据上下文自动检索相关记忆
- **用户画像**：通过记忆构建用户画像，提供个性化服务

## 8、常用命令

### 8.1 状态检查

```bash
# 查看 OpenClaw 运行状态
openclaw status

# 查看网关状态
openclaw gateway status

# 检查网关连接
openclaw gateway probe
```

### 8.2 网关管理

```bash
# 启动网关
openclaw gateway start

# 后台启动
openclaw gateway start --daemon

# 重启网关
openclaw gateway restart

# 停止网关
openclaw gateway stop
```

### 8.3 配置管理

```bash
# 查看配置
openclaw config get

# 设置配置项
openclaw config set <key> <value>

# 查看模型配置
openclaw config get models

# 查看渠道配置
openclaw config get channels
```

### 8.4 技能管理

```bash
# 列出已安装技能
openclaw skills list

# 安装技能
openclaw skills install <skill-name>

# 卸载技能
openclaw skills uninstall <skill-name>

# 更新技能
openclaw skills update <skill-name>
```

### 8.5 诊断工具

```bash
# 运行诊断
openclaw doctor

# 生成新的 gateway token
openclaw doctor --generate-gateway-token

# 打开控制面板
openclaw dashboard
```

## 9、故障排查

### 9.1 常见错误及解决方法

#### 9.1.1 Error code 1008（网关断开）
**原因**：缺少 gateway token 导致未授权
**解决方法**：
```bash
# 生成新的 gateway token
openclaw doctor --generate-gateway-token

# 重启网关
openclaw gateway restart
```

#### 9.1.2 Error code 401（授权失败）
**原因**：模型服务商账户余额不足或 API Key 错误
**解决方法**：
- 充值对应模型服务商账户
- 检查并重新配置 API Key
- 切换兼容模型

#### 9.1.3 command not found（命令不存在）
**原因**：Node.js 未安装或 npm 全局路径未添加到 PATH
**解决方法**：
- 重新安装 Node.js
- 将 npm 全局路径添加到系统 PATH

#### 9.1.4 飞书机器人不回复
**排查步骤**：
1. 检查 Gateway 是否启动：`openclaw gateway status`
2. 检查事件订阅配置是否正确
3. 检查应用权限是否开启
4. 检查 App ID 和 App Secret 是否正确
5. 检查网络连接是否正常

### 9.2 安装常见问题

#### 9.2.1 Windows PowerShell 执行策略被阻止
**解决方法**：
```powershell
# 以管理员身份运行 PowerShell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 9.2.2 网络问题导致安装失败
**解决方法**：
```bash
# 切换 npm 到国内镜像源
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install -g @openclaw/cli
```

## 10、安全建议与隐私保护

### 10.1 本地优先的隐私保护

OpenClaw 的本地优先设计通过将 AI 运行和数据存储完全置于用户本地设备，从根源上避免隐私数据上传至云端，从而保护用户隐私。

### 10.2 安全配置建议

#### 10.2.1 API Key 管理
- 不要将 API Key 硬编码在代码中
- 使用环境变量或配置文件存储敏感信息
- 定期更换 API Key
- 为不同环境使用不同的 API Key

#### 10.2.2 权限控制
- 仅授予必要的系统权限
- 使用非管理员账户运行 OpenClaw
- 定期检查已安装技能的权限

#### 10.2.3 网络安全
- 在可信网络环境下使用
- 配置防火墙规则
- 避免在公共 WiFi 下传输敏感数据

### 10.3 隐私保护最佳实践

- **本地化模型**：对于极度敏感的数据处理，使用本地部署的 LLM
- **日志审计**：定期检查日志文件，敏感信息脱敏处理
- **数据备份**：定期备份配置文件和记忆数据库
- **物理隔离**：在独立设备上运行，使用虚拟机或容器隔离

## 11、OpenClaw 与在线 AI 对比

| 特性 | OpenClaw | ChatGPT/Claude 网页版 |
|------|----------|----------------------|
| 部署方式 | 本地自托管 | 云端服务 |
| 数据隐私 | 数据本地存储，不上传云端 | 数据上传至服务商服务器 |
| 功能扩展 | 支持 Skills 插件扩展 | 功能固定，无法扩展 |
| 多平台接入 | 支持 10+ 种聊天工具 | 仅官方客户端/网页 |
| 定时任务 | 支持 | 不支持 |
| 文件操作 | 支持本地文件操作 | 不支持 |
| 系统命令 | 支持执行系统命令 | 不支持 |
| 浏览器自动化 | 支持 | 不支持 |
| 离线使用 | 支持（配合本地模型） | 不支持 |
| 成本 | 开源免费，仅需 API 费用 | 订阅费用或按量付费 |

## 12、资源链接

- **GitHub 仓库**：https://github.com/openclaw/openclaw
- **官方文档**：https://docs.openclaw.io
- **飞书开放平台**：https://open.feishu.cn
- **硅基流动**：https://cloud.siliconflow.cn
- **DeepSeek**：https://platform.deepseek.com
- **Node.js 官网**：https://nodejs.org
- **OpenAI**：https://platform.openai.com
- **Anthropic**：https://console.anthropic.com

## 13、社区与支持

- **GitHub Issues**：提交 Bug 报告和功能建议
- **Discord 社区**：实时交流和互助
- **飞书群**：中文用户交流群
- **知乎专栏**：技术文章和教程分享
- **B站视频**：安装教程和使用指南

## 14、常见问题解答

### 14.1 OpenClaw 是免费的吗？
是的，OpenClaw 是开源免费的，使用 MIT 协议。但使用部分模型需要支付 API 费用。

### 14.2 OpenClaw 支持哪些操作系统？
OpenClaw 支持 Windows 10+、macOS 12+ 和 Linux (Ubuntu 20.04+)。

### 14.3 OpenClaw 需要什么配置的电脑？
建议至少 4GB 内存，1GB 可用存储空间。低配置设备也可以运行，但性能可能会受到影响。

### 14.4 OpenClaw 可以使用本地模型吗？
是的，OpenClaw 支持通过 Ollama 接入本地模型，实现完全离线运行。

### 14.5 OpenClaw 如何保证数据安全？
OpenClaw 采用本地优先设计，数据存储在本地设备，不上传云端，从根源上保护用户隐私。

## 15、总结

OpenClaw 是一款功能强大、易于部署的开源 AI Agent 执行引擎，它通过本地优先的设计、丰富的技能系统和多通道接入能力，为用户提供了一个真正能做事的 AI 助手。

无论是个人用户还是企业团队，都可以通过 OpenClaw 实现工作自动化、提高效率、降低成本。随着社区的不断发展，OpenClaw 的功能会越来越丰富，生态会越来越完善。

## 16. 其他参考文档

1. [OpenClaw知识库](https://geekbang.feishu.cn/wiki/TSUqwoAn5iL6WxkkxHcci3pzn7c)