# 蘑菇森林 · 婚礼游园会 — 架构设计文档

> 版本：`wedding-game-state-v2` | 最后更新：2026-04-29

---

## 一、主题定位

**蘑菇魔法森林（暗色奇幻风）**  
宾客化作旅人，踏入布满蘑菇、萤火虫、魔法法阵的森林深处。左行"花之小径"（新娘侧），右入"松之密林"（新郎侧），完成 6 个林地挑战，收集蘑菇印记，最终封印蘑菇之书。

---

## 二、技术栈

| 层 | 技术 | 版本 |
|---|------|------|
| 框架 | React (JSX) | ^19.2 |
| 路由 | react-router-dom | ^7.14 |
| 构建 | Vite | ^8.0 |
| 语言 | TypeScript | ~6.0 |
| 样式 | CSS (CSS Variables, 暗色主题) | — |
| 字体 | Google Fonts (Noto Sans/Serif SC) | — |
| 存储 | localStorage (`wedding-game-state-v2`) | — |
| 运行 | `npx serve dist -l 4173` | — |

---

## 三、项目目录结构

```
web/
├── index.html              # 🍄 favicon, 暗色背景
├── package.json
├── vite.config.ts          # base: './'
├── ARCHITECTURE.md
│
├── src/
│   ├── main.tsx            # ReactDOM.createRoot
│   ├── App.tsx             # 路由 + useGameState 发布订阅
│   ├── App.css             # CSS 变量（暗色森林色板）+ 通用组件
│   │
│   ├── types.ts            # Guest/Checkpoint/GameState 类型 + AVATARS(45个)
│   ├── data.ts             # 6 个林地关卡数据
│   ├── state.ts            # 不可变更新纯函数
│   │
│   ├── SignIn.tsx / .css   # 🍄 踏入森林 — 签到页
│   ├── Lobby.tsx / .css    # 🌿 林地地图 — 游园大厅
│   ├── Checkpoint.tsx / .css # 🔮 林地挑战 — 关卡页
│   ├── Admin.tsx / .css    # 🗝 森林守护者 — 管理后台
│   └── Settlement.tsx / .css # 🌙 蘑菇之书 — 结算页
│
└── dist/                   # 构建产物
```

---

## 四、路由设计

| 路径 | 组件 | 蘑菇森林世界观名称 |
|------|------|------|
| `/` | `SignIn` | 踏入森林（签到） |
| `/lobby` | `Lobby` | 林地地图（大厅） |
| `/checkpoint/:id` | `Checkpoint` | 林地挑战（关卡） |
| `/admin` | `Admin` | 森林守护者（后台） |
| `/settlement` | `Settlement` | 蘑菇之书（结算） |
| `*` | `Navigate` | 回到入口 |

---

## 五、数据模型

### 5.1 GameState

```typescript
interface GameState {
  phase: 'checkin' | 'playing' | 'settled'  // 森林阶段
  guests: Guest[]
  currentGuestId: string | null
}
```

### 5.2 Guest（旅人）

```typescript
interface Guest {
  id: string              // guest-{timestamp}-{random5}
  name: string            // 名字 ≤10字
  phoneSuffix: string     // 魔法印记 4位数字
  avatar: string          // 森林伙伴 emoji（45选1）
  scores: Record<cpId, number>
  choices: Record<cpId, string>
  totalPoints: number     // 蘑菇总数
  createdAt: number
}
```

### 5.3 Checkpoint（林地）

```typescript
interface Checkpoint {
  id: string
  title: string
  subtitle: string
  themeA: string, themeB: string
  descA: string, descB: string
  scoringA: string, scoringB: string
  type: 'solo' | 'team'
  duration: string
}
```

### 5.4 森林阵营

```
🌸 花之小径（新娘）：communication, aesthetic, lifestyle
🌲 松之密林（新郎）：execution, attitude, choice
```

---

## 六、六块林地详解

| # | ID | 标题 | A 支线 | B 支线 | 类型 | 阵营 |
|---|-----|------|--------|--------|------|------|
| 1 | communication | 沟通模式 | 阿巴阿巴 | 有话直说 | solo | 🌸 |
| 2 | aesthetic | 审美品味 | 现实正经 | 赛博抽象 | solo | 🌸 |
| 3 | lifestyle | 生活取向 | 安全区守望 | 新大陆探险 | solo | 🌸 |
| 4 | execution | 执行力 | 思前想后 | 干了再说 | solo | 🌲 |
| 5 | attitude | 人生态度 | 差不多得了 | 就往死里卷 | solo | 🌲 |
| 6 | choice | 取舍博弈 | Peace&Love | Survival&Glory | team | 🌲 |

各点位图标：🦋 🌸 🌱 | 🦉 🐗 🦌

---

## 七、视觉色彩系统（暗色蘑菇森林）

```css
--bg:          #1a1d15    /* 深层森林土壤 */
--moss:        #5c8a49    /* 苔藓 */
--mushroom:    #c1574a    /* 红蘑菇盖 */
--gold:        #d4a853    /* 魔法光芒 */
--cream:       #f5ecd7    /* 蘑菇柄 / 文字 */
--text:        #e0dcc8    /* 正文 */
```

背景使用多层 radial-gradient 营造森林光晕：
- 左上角苔藓绿光
- 右下角蘑菇红光
- 中央金色微光

---

## 八、状态管理

**发布-订阅 + localStorage：**

- `getGameState()` → `loadState()` 从 localStorage 读取
- `setGameState(s)` → 存 localStorage + 广播给所有 `useGameState()` hook
- `useGameState()` → 组件订阅，自动 rerender

所有状态变更即时同步，无需刷新页面。

---

## 九、防作弊：森林守护者录分

| 密码 | 用途 |
|------|------|
| `9527` | NPC 录分密码（所有林地通用），管理后台醒目展示 |
| `wedding2025` | 进入管理后台 |

流程：旅人选 A/B → 点击"呼唤森林守护者" → 守护者选 1-3 颗蘑菇 → 输入 `9527` → 刻录完成

---

## 十、头像库（45 个森林/动物伙伴）

🐱 🐶 🐰 🐻 🐼 🐨 🐯 🦁 🐮 🐷
🐸 🐵 🐔 🐧 🦊 🐙 🦋 🐌 🐝 🐞
🐢 🐬 🐳 🦄 🐲 🐥 🦉 🦇 🐿 🦔
🦩 🦜 🐊 🦎 🐡 🦭 🦥 🦦 🐩 🐈
🦢 🦚 🐉 🐾 🦝

---

## 十一、构建部署

```bash
npm run dev        # 开发 localhost:5173
npm run build      # tsc + vite → dist/
npm run preview    # vite preview localhost:4173
```

`启动网页.bat` → `npx serve dist -l 4173` + 自动打开浏览器

`vite.config.ts` 配置 `base: './'`，dist 内 JS/CSS 为相对路径
