# HyperVision LED 部署说明（Cloudflare）

## 1) 创建 Cloudflare 资源

```bash
# 登录
wrangler login

# D1
wrangler d1 create hypervision-led-db

# KV
wrangler kv namespace create CONFIG_KV
wrangler kv namespace create RATE_LIMIT_KV

# R2
wrangler r2 bucket create hypervision-led-assets

# Queue
wrangler queues create inquiry-events
wrangler queues create inquiry-events-dlq
```

将返回的 ID 填入 `wrangler.toml`。

## 2) 初始化数据库

```bash
wrangler d1 execute hypervision-led-db --file=./db/schema.sql
wrangler d1 execute hypervision-led-db --file=./db/seed.sql
```

## 3) 配置环境变量

```bash
cp .dev.vars.example .dev.vars
```

编辑 `.dev.vars`，填写：
- `CF_ACCESS_AUD`
- `ADMIN_ALLOWLIST`
- `CRM_WEBHOOK_URL` / `CRM_WEBHOOK_TOKEN`
- `MAIL_WEBHOOK_URL`
- `TURNSTILE_SECRET_KEY`

## 4) 本地开发

```bash
npm install
npm run dev
```

## 5) 生成类型与构建

```bash
npm run cf:types
npm run build
npm run check
```

## 6) 部署站点 Worker

```bash
npm run cf:deploy
```

## 7) 部署 Queue 消费者

```bash
wrangler deploy --config wrangler.queue.toml
```

## 8) Cloudflare Access 保护后台

在 Zero Trust -> Access 中创建应用规则：
- 保护路径：`https://your-domain.com/admin/*` 与 `https://your-domain.com/api/admin/*`
- 允许用户：`ADMIN_ALLOWLIST` 对应邮箱

发布后，后台页面访问需要通过 Cloudflare Access 登录。
