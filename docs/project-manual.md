# ShowNow Frontend 项目说明书

更新时间：2026-04-23

## 1. 项目定位

`shownow-frontend` 是一个基于 MetaID 协议的钱包直连社交前端，核心形态不是“纯 REST Web App”，而是：

1. 前端通过钱包和 MetaID SDK 直接完成上链动作。
2. 后端与外部索引服务负责聚合、检索、解密、推荐、管理配置和后台运营。
3. 前台社交流量和后台运营配置共用同一个仓库，但接口分层比较明确。

这意味着后续开发时，先要判断一个功能属于哪一层：

- 页面展示与交互：`src/pages`、`src/Components`
- 钱包连接 / 链上写入：`src/models/user.ts`、`src/Components/*`、`src/utils/buzz.ts`、`src/entities/*`
- 聚合查询 / 后台管理 / MetaSo 业务接口：`src/request/*`

## 2. 技术栈

| 类别 | 选型 |
| --- | --- |
| 前端框架 | Umi 4 |
| UI | Ant Design 5、Ant Design Pro Components |
| 状态管理 | Umi Model |
| 数据请求 | Umi Request、Axios |
| 异步数据 | TanStack React Query |
| 样式 | Less + Tailwind CSS（项目里以 Less/AntD 为主） |
| 钱包 / 链上 SDK | `@feiyangl1020/metaid`、`@metaid/metaid` |
| 本地存储 | `localStorage`、`sessionStorage`、IndexedDB（`idb`） |
| 国际化 | Umi Locale |

## 3. 目录地图

### 3.1 顶层目录

- `src/pages`：页面级模块
- `src/Components`：复用组件和业务组件
- `src/request`：所有后端/外部服务接口封装
- `src/models`：全局状态
- `src/layouts`：前台/后台布局
- `src/wrappers`：路由守卫
- `src/utils`：链上发帖、文件处理、缓存、通知等工具
- `src/entities`：MVC 链实体 schema 定义
- `src/locales`：中英文文案

### 3.2 核心目录职责

#### 页面层

- `src/pages/home`：最新动态流
- `src/pages/hot`：热门流
- `src/pages/follow`：关注流
- `src/pages/recommend`：推荐流，包含曝光上报
- `src/pages/search`：搜索结果页
- `src/pages/profile`：用户主页 / `user/:tick` 主页
- `src/pages/followInfo`：关注/粉丝信息页
- `src/pages/tweet`：单条 Buzz 详情页
- `src/pages/setting`：个人资料编辑
- `src/pages/notification`：通知页
- `src/pages/rank`：节点贡献值/排行榜
- `src/pages/dashboard/*`：后台管理、样式配置、MetaSo 配置、奖励分发

#### 组件层

- `src/Components/Buzz`：Buzz 展示、详情、互动、媒体渲染
- `src/Components/NewPost`：发帖/转发/加锁内容发帖
- `src/Components/Comment`：评论弹窗
- `src/Components/Donate`：打赏
- `src/Components/ProfileCard`：个人主页卡片
- `src/Components/NotificationItem`：通知渲染
- `src/Components/HomeTabs`：主页 tab 导航
- `src/Components/ConnectWallet`：钱包连接

#### 接口层

- `src/request/api.ts`：社交内容、用户资料、通知、访问控制、MRC20/MRC721、节点配置、统计接口
- `src/request/dashboard.ts`：后台登录、站点配置、费用、上传、后台开关
- `src/request/metaso.ts`：MetaSo coin / claim / distribution / 用户收益接口

#### 状态层

- `src/models/user.ts`：钱包、用户、链选择、费率、关注、通知、发帖相关临时状态
- `src/models/dashboard.ts`：站点配置、后台管理员信息、域名映射、ID Coin 缓存

## 4. 路由与布局

路由在 `.umirc.ts` 中手工定义，而不是纯约定式路由。

### 4.1 前台路由

- `/login`：登录/欢迎页，实际组件是 `src/pages/index.tsx`
- `/home`：最新流
- `/home/new`：最新流
- `/home/following`：关注流
- `/home/hot`：热门流
- `/home/recommend`：推荐流
- `/search`：搜索
- `/follow`、`/follow/:address`：关注信息
- `/profile`、`/profile/:address`、`/user/:tick`：个人主页
- `/tweet/:id`、`/buzz/:id`：单条详情
- `/setting`：用户设置
- `/about`：关于
- `/rank`：排行 / 节点贡献
- `/notification`：通知

### 4.2 后台路由

- `/dashboardLogin`：后台登录
- `/dashboard/styles`：站点视觉配置
- `/dashboard/fees`：费用、域名、MetaSo 配置
- `/dashboard/metaso`：MetaSo 奖励与分配后台

### 4.3 布局与守卫

- 前台主布局：`src/layouts/index.tsx` + `src/layouts/showLayout.tsx`
- 后台主布局：`src/layouts/dashboard.tsx`
- 前台登录守卫：`src/wrappers/auth.tsx`
- 后台登录守卫：`src/wrappers/dashboardAuth.tsx`

注意：

- 前台是否强制登录由后台配置 `showConf.checkLogin` 决定。
- 首页 tab 的真实显示顺序取决于后台配置的 `showConf.tabs`。
- `showLayout` 中对 `/home*` 使用了 keep-alive 式处理，避免各 feed 页面频繁重建。

## 5. 全局状态说明

### 5.1 `user` model

`src/models/user.ts` 是前台最重要的状态入口，负责：

- 初始化并恢复钱包连接
- 管理 BTC/MVC 两套 connector
- 维护当前用户信息、当前链、费率、关注列表
- 周期性拉取通知与费率
- 控制“必须先补全资料再发帖”的逻辑

关键点：

- 当前链默认从 `localStorage.show_chain_v2` 恢复。
- 钱包连接成功后会签名 `metaso.network`，并把签名与公钥存到本地，供后台接口鉴权。
- `checkUserSetting()` 会在用户缺少昵称时强制切到 `mvc` 链并弹出设置。
- 通知增量拉取后会先写到 IndexedDB，再在页面中读取。

### 5.2 `dashboard` model

`src/models/dashboard.ts` 负责：

- 拉取当前站点配置 `showConf`
- 拉取管理员信息 `admin`
- 拉取 man 公钥 `manPubKey`
- 拉取域名映射表 `domainMap`
- 拉取 ID Coin 列表并缓存到本地 store

一个非常重要的当前现状：

- `fetchServiceFee()` 里在真正计算前直接 `return undefined` 了。
- 这意味着虽然评论、点赞、发帖、打赏等代码都在传 `service` 参数，但当前运行时实际上不会附带服务费输出。
- 如果后续要恢复服务费，请优先从这里排查，而不是先查业务组件。

## 6. 环境变量与构建方式

项目没有使用 `.env` 文件，主要依赖 `BUILD_ENV`。`window.BUILD_ENV` 在 `src/app.tsx` 中注入，默认值是 `testnetDev`。

### 6.1 脚本

| 命令 | 含义 |
| --- | --- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 本地开发，默认 `testnetDev` |
| `pnpm dev:local` | 本地开发，显式 `testnetDev` |
| `pnpm dev:localMainnet` | 本地开发，`mainnetDev` |
| `pnpm build:testnet` | 测试网生产构建，`testnetProd` |
| `pnpm build:mainnet` | 主网生产构建，`mainnetProd` |

### 6.2 `BUILD_ENV` 对应关系

| `BUILD_ENV` | `curNetwork` | `DASHBOARD_API` | `BASE_MAN_URL` | 说明 |
| --- | --- | --- | --- | --- |
| `testnetDev` | `testnet` | `http://127.0.0.1:3000/api` | `http://127.0.0.1:3000/man` | 本地联调测试网 |
| `mainnetDev` | `mainnet` | `http://127.0.0.1:3000/api` | `http://127.0.0.1:3000/man` | 本地主网联调 |
| `testnetProd` | `testnet` | `/api` | `window.location.origin + "/man"` | 线上测试网构建 |
| `mainnetProd` | `mainnet` | `/api` | `window.location.origin + "/man"` | 线上主网构建 |

同时还会影响：

- `METASO_BASE_API`
- `MARKET_ENDPOINT`
- `ASSIST_ENDPOINT`
- `getHostByNet(curNetwork)`

### 6.3 打包输出目录

`.umirc.ts` 中配置了：

```ts
outputPath: "../shownow-backend/public"
```

也就是说：

- 前端构建产物不是输出到当前仓库的 `dist`
- 而是直接输出到相邻后端仓库 `shownow-backend` 的 `public` 目录
- 这说明该项目默认的部署方式是“前端静态产物交给后端仓库托管”

### 6.4 本次实际验证结果

2026-04-23 已实际执行：

1. `pnpm install`：成功
2. `pnpm build:testnet`：成功

构建结论：

- Umi 4.4.6 可正常编译
- 产物已写入 `../shownow-backend/public`
- 构建日志提示包体偏大，`umi.js` gzip 后约 `2.77 MB`
- 后续若继续加功能，建议尽快做分包分析和依赖瘦身

## 7. 后端与外部服务对接总览

### 7.1 基础服务

| 服务 | 基础地址来源 | 主要用途 |
| --- | --- | --- |
| `BASE_MAN_URL` | `src/config/index.ts` | Buzz 列表、详情、访问控制、配置、推荐、MRC721、后台设置 |
| `METAFS_INDEXER_API` | `src/config/index.ts` | 根据地址查询用户资料 |
| `METASO_BASE_API` | `src/config/index.ts` | MetaSo 奖励、claim、distribution、MRC20 transfer |
| `DASHBOARD_API` | `src/config/index.ts` | 后台登录、样式配置、后台上传、费用设置 |
| `MARKET_ENDPOINT` | `src/config/index.ts` | MRC20 UTXO 查询 |
| `getHostByNet(curNetwork)` | `src/config/index.ts` | 内容读取、通知拉取、MetaID 用户信息 |
| `Metalet wallet-api` | 固定地址 | 原始交易广播 |

### 7.2 额外外部接口

- 百度翻译代理：`https://api.metaid.io/baidufanyi/api/trans/vip/translate`
- 推荐曝光上报：`/social/buzz/viewed/add`
- 内容解密：`/api/access/decrypt`

## 8. 请求层分工

### 8.1 `src/request/api.ts`

主要负责前台业务接口：

- Feed：
  - `fetchAllBuzzs`
  - `fetchAllHotBuzzs`
  - `fetchAllRecommendBuzzs`
  - `searchBuzzs`
  - `fetchBuzzDetail`
  - `fetchComments`
- 用户：
  - `getUserInfo`
  - `getUserInfoByMetaid`
  - `fetchFollowingList`
  - `fetchFollowerList`
  - `getFollowList`
- 访问控制：
  - `getPubKey`
  - `getControlByContentPin`
  - `getDecryptContent`
- 推荐/通知：
  - `reportBuzzView`
  - `getUserNotify`
  - `getRecommendedFollow`
- 资产：
  - `getMRC20Info`
  - `getDeployList`
  - `getUserMrc20List`
  - `getMrc20AddressUtxo`
  - `getUserNFTCollections`
  - `getUserNFTCollectionItems`
  - `getNFTItem`
- MetaSo 节点配置与统计：
  - `getMetasoConf`
  - `setMetasoConfChain`
  - `setMetasoConfSyncHost`
  - `setMetasoConfBlockedHost`
  - `setMetasoConfInitialHeight`
  - `setMetasoConfPubkey`
  - `getMetaBlockNewest`
  - `getMetaBlockHostValue`
  - `getMetaBlockHostUserValue`
  - `getMetaBlockHostUserList`
  - `getHostNDV`

### 8.2 `src/request/dashboard.ts`

纯后台接口：

- 登录：
  - `login`
  - `loginWithWallet`
- 配置：
  - `fetchAdmin`
  - `fetchShowConf`
  - `fetchShowConfList`
  - `saveConf`
  - `saveAndApply`
- 费用和开关：
  - `fetchFees`
  - `saveFees`
  - `setDistributionEnable`
  - `setAssistEnable`
- 上传：
  - `uploadIcon`
  - `uploadImage`

### 8.3 `src/request/metaso.ts`

MetaSo coin / 奖励接口：

- 汇总与区域：
  - `fetchCoinSummary`
  - `fetchAreaInfo`
  - `fetchMetaBlockList`
  - `fetchMetaBlockAreaInfo`
- Claim：
  - `claimPre`
  - `claimCommit`
  - `claimPreUser`
  - `claimCommitUser`
  - `getClaimRecords`
  - `getUserClaimRecords`
- 分配：
  - `setDistribution`
  - `getDistribution`
- 用户收益：
  - `fetchUserCoinInfo`
  - `fetchUserMetablockList`
- 广播：
  - `metasoBroadcast`

## 9. 关键业务流程

### 9.1 启动与初始化

1. `src/app.tsx` 注入 `window.BUILD_ENV`，并确保本地有 `metaso_uuid`。
2. Umi Request 全局响应拦截器捕获 `401`，统一跳转 `/dashboardLogin`。
3. `dashboard` model 拉取 `showConf`、`admin`、`manPubKey`。
4. `user` model 尝试恢复钱包连接、恢复 connector、恢复用户资料与当前链。

### 9.2 钱包连接

入口主要在 `src/models/user.ts`：

1. 检查 `window.metaidwallet`
2. 检查连接状态与锁状态
3. 强制切换到当前 `curNetwork`
4. 构造 BTC 与 MVC 两套 wallet / connector
5. 读取钱包用户信息作为前台用户态
6. 用 BTC 地址对 `metaso.network` 签名
7. 把签名和公钥写入：
   - `localStorage.DASHBOARD_SIGNATURE`
   - `localStorage.DASHBOARD_ADMIN_PUBKEY`

这些签名随后会被后台管理和部分 MetaSo 接口作为 `X-Signature`、`X-Public-Key` 请求头使用。

### 9.3 发普通 Buzz

入口：`src/Components/NewPost/index.tsx` 的 `handleAddBuzz()`

流程：

1. 先收集正文、图片、视频、其他附件、NFT 引用、引用转发信息
2. 附件先上传成 `metafile://...`
3. 组装 `finalBody`
4. BTC：
   - 文件走 `btcConnector.use('file')`
   - 内容走 `btcConnector.use('buzz').create(...)`
   - 路径是 `${showConf.host}/protocols/simplebuzz`
5. MVC：
   - 文件走 `mvcConnector.use('file')`
   - 内容走 `mvcConnector.load(getBuzzSchemaWithCustomHost(...)).create(...)`
6. 成功后会：
   - `invalidateQueries(['homebuzzesnew'])`
   - 本地构造一条 `mockBuzz` 提前显示
   - 跳回 `/home/new`

### 9.4 发加锁 / 付费 Buzz

入口：`src/Components/NewPost/index.tsx` 的 `handleAddBuzzWhthLock()`

核心逻辑在 `src/utils/buzz.ts` 的 `postPayBuzz()`：

1. 分离公开图片和加密图片
2. 生成 AES key
3. 上传公开附件和加密附件
4. 创建 `/protocols/paybuzz` 内容 pin
5. 与 `manPubKey` 做 ECDH，得到共享密钥
6. 创建 `/metaaccess/accesscontrol` pin，写入：
   - 被控制的内容 pin
   - 解密密钥密文
   - 支付或持仓检查规则
7. `payType` 支持：
   - 链原生币支付
   - ID Coin 持仓
   - MRC20 支付
   - MRC20 持仓

后续读取时，页面通过：

1. `getControlByContentPin()`
2. `getDecryptContent()`

完成访问控制与解密。

### 9.5 评论

入口：`src/Components/Comment/index.tsx`

流程：

1. 组装 `{ content, contentType, commentTo }`
2. BTC 直接 `btcConnector.inscribe(...)`
3. MVC 通过 `mvcConnector.load(getCommentEntitySchemaWithCustomHost(...)).create(...)`
4. 路径固定为 `${showConf.host}/protocols/paycomment`

### 9.6 点赞

入口：`src/Components/Buzz/Actions.tsx`

流程：

1. 先用本地 `likes` 判重
2. BTC：`btcConnector.use('like').create(...)`
3. MVC：`mvcConnector.use('like').create(...)`
4. 路径是 `${showConf.host}/protocols/paylike`

### 9.7 打赏

入口：`src/Components/Buzz/RepostDetail.tsx` 和 `Donate` 相关组件

流程：

1. 构造 `simpledonate` 协议数据
2. 附加一笔真实转账输出到内容作者地址
3. BTC / MVC 分别用对应 entity 创建
4. 路径是 `${showConf.host}/protocols/simpledonate`

### 9.8 用户资料更新

入口：`src/pages/setting/index.tsx`

流程：

1. 头像与背景图先转 base64
2. 已有资料时调用 `updateUserInfo`
3. 首次建档调用 `createUserInfo`
4. 本地把最新表单同步到 `sessionStorage`
5. 再调用 `fetchUserInfo()` 从索引服务回刷用户资料

### 9.9 推荐流与曝光上报

入口：`src/pages/recommend/index.tsx`

流程：

1. 用 `fetchAllRecommendBuzzs()` 拉推荐流
2. 用 `IntersectionObserver` 观察列表项进入视口
3. 把已读 pinId 批量上报到 `reportBuzzView()`

### 9.10 通知

通知是“远端增量拉取 + 本地 IndexedDB 展示”的模式：

1. `user` model 定时调用 `getUserNotify()`
2. 以本地最大 `notifcationId` 作为增量游标
3. 写入 `NotificationStore`
4. `src/pages/notification/index.tsx` 不直接请求后端，而是直接分页读取 IndexedDB

这意味着：

- 通知页展示性能较好
- 但联调通知问题时，前端需要同时看远端接口和本地 IndexedDB

### 9.11 发帖草稿与本地缓存

- 上传中的附件草稿保存在 `PostDraftDB`
- 通知保存在 `notifications-db_v5`
- 用户资料兜底保存在 `sessionStorage`
- 当前链、签名、公钥等保存在 `localStorage`

## 10. 类型定义位置

- 社交与前台接口类型：`src/request/typings.d.ts`
- 后台管理类型：`src/request/dash.typings.d.ts`
- MetaSo 类型：`src/request/metaso.typings.d.ts`

这些类型文件是快速理解接口结构最有效的入口之一，建议后续改接口时同步维护。

## 11. 后续开发时的高频入口文件

### 11.1 想改页面结构

- 路由：`.umirc.ts`
- 前台布局：`src/layouts/showLayout.tsx`
- 后台布局：`src/layouts/dashboard.tsx`

### 11.2 想改登录 / 钱包 / 当前用户

- `src/models/user.ts`
- `src/Components/ConnectWallet/index.tsx`
- `src/pages/dashboard/login/index.tsx`

### 11.3 想改发帖 / 转发 / 锁内容

- `src/Components/NewPost/index.tsx`
- `src/utils/buzz.ts`
- `src/entities/buzz.ts`

### 11.4 想改评论 / 点赞 / 打赏

- `src/Components/Comment/index.tsx`
- `src/Components/Buzz/Actions.tsx`
- `src/Components/Buzz/RepostDetail.tsx`
- `src/entities/comment.ts`

### 11.5 想改资料页 / 用户信息

- `src/pages/profile/index.tsx`
- `src/pages/setting/index.tsx`
- `src/Components/ProfileCard/*`
- `src/request/api.ts` 中的 `getUserInfo`

### 11.6 想改后台站点配置

- `src/pages/dashboard/styles/index.tsx`
- `src/pages/dashboard/fees/index.tsx`
- `src/request/dashboard.ts`
- `src/models/dashboard.ts`

## 12. 当前已知注意事项

1. 构建产物直接写到相邻后端仓库，不是本仓库 `dist`。
2. `fetchServiceFee()` 当前被短路，服务费逻辑实际未生效。
3. 推荐、通知、资料页都混合使用了远端接口、React Query、本地缓存，需要按链路排查。
4. 这个项目的很多“写操作”不经过后端 REST，而是直接走钱包上链。
5. 包体已经偏大，后续新增依赖要谨慎。

## 13. 建议的后续迭代方法

建议后续每个需求都先回答这三个问题：

1. 这是纯前端展示问题，还是链上写入问题？
2. 数据来源是在 `request/*`，还是在 MetaID connector/entity？
3. 改动是否会影响 `BTC` 与 `MVC` 两条链的双实现？

如果答案里包含“链上写入”和“双链实现”，建议优先检查：

- `src/models/user.ts`
- `src/Components/NewPost/index.tsx`
- `src/Components/Comment/index.tsx`
- `src/Components/Buzz/Actions.tsx`
- `src/utils/buzz.ts`
- `src/entities/*`

