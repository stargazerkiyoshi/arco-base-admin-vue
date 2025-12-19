# Vue3 + Arco 后台通用项目 Demo 蓝图（可复用脚手架/AI资产）

> 目标：搭建一套“可快速复制”的后台项目 Demo，不绑定具体业务，但能覆盖企业后台 80% 常见场景；后续可在此基础上做业务通用化/行业套件。

---

## 1. 项目定位与交付物

### 1.1 产品定位

- **不是**只做几个页面，而是做一套“后台项目脚手架产品”。
- 核心价值：
  - 统一架构、规范、通用能力（权限/菜单/CRUD/字典/请求层/布局）。
  - 让新增一个模块（列表+表单闭环）时间可控、成本极低。

### 1.2 交付物清单

- 可运行 Demo（本地/测试环境可跑）
- 标准 Layout（侧边栏/顶栏/面包屑/标签页可选/个人中心/主题切换）
- 权限系统（页面 + 按钮级）
- 通用 CRUD 能力（ProTable/ProForm/ProModalForm/ProDescriptions）
- 字典/枚举系统（本地+远程，缓存策略）
- 基础设施（request 封装、错误处理、日志、mock、环境配置）
- 文档与模板（README、新增模块指南、规范、可选代码生成）

---

## 2. 范围与边界（明确“不做什么”）

### 2.1 第一阶段必做（MVP）

- 登录/退出/Token 管理（可先 mock）
- 基础 Layout 与路由体系
- RBAC 权限最小闭环（用户-角色-权限-菜单）
- 1~2 个“典型业务模块”闭环（用户管理/字典管理）
- 通用组件抽象（至少 ProTable + ProModalForm）

### 2.2 第一阶段不做（避免发散）

- 微前端/多仓 monorepo（先不）
- 国际化（可预留结构，后续加）
- 完整审批流/复杂工作流（先不）
- 大而全的低代码平台（先做“半配置化”通用组件）

---

## 3. 关键设计原则（决定可复用性）

1. **页面禁止直连 axios**：所有请求统一走 `api/` 层。
2. **列表/表单尽量配置化**：用 schema/columns/fields 驱动，而不是每页手写。
3. **权限编码标准化**：页面、按钮、接口权限有统一命名规则。
4. **模块化目录与领域边界清晰**：避免全项目耦合成一团。
5. **可插拔**：mock、路由模式（静态/后端下发）、主题、标签页等能开关。

---

## 4. 技术栈与工程化决策

### 4.1 推荐技术栈（稳定可维护）

- Vue 3 + Vite
- Vue Router
- Pinia
- TypeScript（强烈建议）
- Arco Design Vue
- Axios（统一封装 request）
- ESLint + Prettier（可选 Stylelint）
- Husky + lint-staged（保证代码质量）

> 说明：本 Demo 的价值在于“可复制与可维护”，TS 与规范工具对长期收益巨大。

### 4.2 环境与配置

- `.env.dev / .env.test / .env.pre / .env.prod`
- 统一配置入口：`src/config`（baseURL、开关、主题默认值等）
- Dev proxy：按接口前缀转发

### 4.3 Mock 策略（可插拔）

- 方案 A：vite-plugin-mock（简单直接）
- 方案 B：MSW（更真实，接近线上）

---

## 5. 信息架构（IA）与模块清单

### 5.1 一级模块（建议）

1. **工作台**：数据看板、快捷入口
2. **通用示例**：列表/表单/详情/弹窗/权限演示（组件能力展示区）
3. **系统管理**：用户、角色、菜单、权限、字典、配置、日志
4. **业务示例**：以“商品/订单/客户”任一套演示典型 CRUD + 详情 + 子表

### 5.2 Demo 必备页面（建议最小集）

- 登录页
- 工作台
- 用户管理（典型 CRUD 闭环）
- 角色管理（绑定权限）
- 菜单管理（生成侧栏与路由）
- 字典管理（枚举/标签渲染来源）
- 操作日志（表格筛选 + 详情）
- 个人中心（基本信息/修改密码）

---

## 6. 权限系统设计（RBAC 最小闭环）

### 6.1 模型

- User：用户
- Role：角色
- Permission：权限点（按钮/接口）
- Menu：菜单（页面入口）

### 6.2 权限粒度

- **页面级**：能否看到菜单、能否进入路由
- **按钮级**：能否看到/点击新增、删除、导入、导出等

### 6.3 路由与菜单策略（建议双模式）

- 默认（MVP）：前端静态路由 + 权限过滤 + 菜单映射
- 可升级：后端下发菜单树（包含组件路径/权限/可见性）

### 6.4 权限使用方式（统一入口）

- 指令：`v-permission="['sys:user:add']"`
- 组件：`<Auth :value="['sys:user:add']">...</Auth>`
- 工具方法：`hasPerm('sys:user:add')`

### 6.5 权限编码规范（强制）

- 统一格式：`{domain}:{resource}:{action}`
- 示例：
  - `sys:user:view`（用户页可见）
  - `sys:user:add`（新增按钮）
  - `sys:user:delete`（删除按钮）

---

## 7. 通用页面形态（决定组件抽象）

### 7.1 列表页标准结构

- 查询区 Query（折叠/展开）
- 工具栏 Toolbar（新增/导入/导出/批量）
- 表格 Table（列配置、slot 渲染、行内操作）
- 分页 Pagination
- 可选：高级筛选、列显隐、列拖拽、导出当前筛选

### 7.2 编辑页/弹窗标准结构

- 基础表单 Form（校验、联动、默认值、提交前处理）
- 可选 Tab（基础信息/扩展信息/关联数据）
- 可选 子表（明细行增删改）

### 7.3 详情页标准结构

- Descriptions（字段渲染、字典转义、状态标签）
- 关联列表（例如操作日志/关联实体）

---

## 8. 通用组件体系（你未来复用的核心资产）

> 目标：新模块尽量通过“配置 + 少量业务 slot”完成，而不是从零写页面。

### 8.1 组件清单

1. **ProTable**
   - 输入：`columns`、`querySchema`、`request`、`rowKey`、`actions`
   - 内置：查询折叠、分页、loading、空态、工具栏、列格式化
   - 扩展：列 slot、行操作 slot、表头 slot

2. **ProForm**
   - 输入：`schema`（字段定义）、`modelValue`、`rules`、`layout`
   - 内置：联动、字典字段、默认值、禁用/隐藏条件
   - 输出：`submit()`、`validate()`、`reset()`

3. **ProModalForm**
   - 基于 ProForm + Modal
   - 统一处理：打开、关闭、提交 loading、提交成功回调

4. **ProDescriptions**
   - 用于详情页字段展示
   - 支持：字典转义、标签、格式化函数

5. **Auth（权限组件）**
   - 统一按钮/区块权限控制

6. **DictTag（字典标签）**
   - `value + dictKey` -> 渲染对应 label/tag

### 8.2 组件抽象层级建议

- `components/pro/`：纯通用（任何项目可复用）
- `components/biz/`：业务通用（行业/公司内部可复用）

---

## 9. 字典/枚举系统（后台必备）

### 9.1 需求

- 后端枚举值 -> 前端 label/tag 渲染
- 表单下拉、表格显示、详情显示统一来源
- 支持：本地字典 + 远程字典

### 9.2 设计建议

- `dictKey` 为唯一键（如 `user_status`）
- Dict Store 缓存策略：
  - 首次使用拉取
  - 缓存到内存 + 可选 localStorage（带过期）

- API：
  - `getDict(dictKey)`
  - `useDict(dictKey)`（hook）

---

## 10. Request 层与错误处理（基础设施）

### 10.1 request 统一封装能力

- baseURL + timeout
- token 注入
- 统一错误码处理（登录过期/无权限/业务错误提示）
- 请求取消（可选）
- 下载文件处理（blob）

### 10.2 错误体验

- 401：跳转登录，保留 redirect
- 403：无权限页
- 404：路由不存在页
- 5xx：友好提示 + 重试建议

---

## 11. 目录结构建议（可复用的骨架）

> 你可以按这个结构组织，后续复制项目非常顺。

- `src/`
  - `main.ts`
  - `app/`（应用级：启动、路由守卫、权限初始化）
  - `router/`（路由定义、动态路由装配）
  - `store/`（pinia：user、permission、dict、app）
  - `layouts/`（基础布局）
  - `views/`
    - `dashboard/`
    - `system/`（用户/角色/菜单/字典/日志）
    - `example/`（通用能力示例页）

  - `components/`
    - `pro/`
    - `biz/`

  - `api/`（按领域拆分）
  - `types/`（domain types + 通用 types）
  - `utils/`（format、download、validate…）
  - `hooks/`（useTable/useForm/useDict/usePermission）
  - `assets/` `styles/`
  - `config/`（环境开关、常量）

---

## 12. 里程碑计划（按顺序做，避免返工）

### M1：可运行骨架

- Layout、路由、登录页、Token（mock）
- 403/404/重定向
- Arco 全局配置、主题基础

### M2：通用 CRUD 闭环（最关键）

- 先做“用户管理”全流程：
  - 列表/筛选/新增/编辑/详情/删除/批量

- 抽象出 ProTable + ProModalForm

### M3：系统模块补齐

- 角色管理（绑定权限）
- 菜单管理（生成侧栏与路由）
- 字典管理（远程字典）
- 日志管理（操作日志/登录日志）

### M4：可复制性与资产化

- README（10分钟跑起来）
- 新增模块指南（30分钟出 CRUD）
- 可选：代码生成模板（plop/hygen）

---

## 13. 验收标准（像产品一样可交付）

1. 新人按 README **10 分钟跑起来**。
2. 新增一个模块（如“商品管理”）：**30 分钟内完成列表+表单闭环**（允许 mock）。
3. 权限可控：菜单可见 + 页面可进 + 按钮可用。
4. 通用组件具备扩展点：列渲染、表单联动、字典异步、行内操作、批量操作。
5. 工程质量：lint 通过、build 通过、目录规范一致。

---

## 14. 风险清单与对策（提前规避）

- **风险：通用组件抽象过度** → 对策：先用“用户管理”跑通后再抽象，抽象只来自真实复用点。
- **风险：权限模型返工** → 对策：先定 RBAC + 权限编码规范，页面/按钮统一走同一套能力。
- **风险：项目变成示例集合** → 对策：所有示例必须服务于“可复制资产”，不做纯展示页。

---

## 15. 下一步行动清单（不写代码也能推进）

1. 决策：路由策略（静态优先 + 可升级动态）
2. 决策：权限编码规范（domain:resource:action）
3. 确定 MVP 模块：用户管理 + 字典管理（建议）
4. 画出页面信息架构（IA）：菜单树 + 页面清单
5. 定义通用组件输入输出（ProTable/ProForm/ProModalForm 的 props 约定）

---

## 16. 附录：最小页面清单（建议拷贝使用）

- /login 登录
- /dashboard 工作台
- /system/user 用户管理
- /system/role 角色管理
- /system/menu 菜单管理
- /system/dict 字典管理
- /system/log 操作日志
- /profile 个人中心
- /403 无权限
- /404 不存在

---

## 17. 通用组件契约（资产化核心）

> 目的：把“怎么用通用组件做页面”固化成可复制规则。后续新人/未来你自己照着契约接入即可。

### 17.1 ProTable（列表页标准化）

**定位**：将“查询区 + 工具栏 + 表格 + 分页 + 请求状态”收敛成一套统一能力。

**输入（建议契约）**

- `columns: ProTableColumn[]`
  - `title: string`
  - `dataIndex: string`
  - `width?: number`
  - `align?: 'left' | 'center' | 'right'`
  - `ellipsis?: boolean`
  - `render?: (row, ctx) => VNode`（可选，若不用 slot）
  - `dictKey?: string`（若为字典字段，自动转义/标签）
  - `formatter?: (value, row) => string | VNode`

- `querySchema?: ProField[]`（查询表单 schema）
- `request: (params: QueryParams) => Promise<{ list: any[]; total: number }>`
- `rowKey: string | ((row) => string)`
- `defaultQuery?: Record<string, any>`
- `pagination?: { pageSize?: number; pageSizeOptions?: number[] } | false`
- `toolbar?: ProToolbarAction[]`（新增/导入/导出/批量等）
- `rowSelection?: boolean | RowSelectionOptions`
- `autoFetch?: boolean`（默认 true）

**输出（事件/方法）**

- `@search(query)`：点击搜索
- `@reset()`：重置查询
- `@change(pageInfo)`：分页/排序变化
- `expose` 方法：
  - `reload()`（保持分页/查询，重新拉取）
  - `setQuery(partial)`（写入查询条件）
  - `getQuery()`
  - `getSelection()`（返回勾选行）

**Slots（可扩展点）**

- `#query-extra`：查询区额外插槽
- `#toolbar-left / #toolbar-right`
- `#cell-{dataIndex}`：单元格渲染（推荐：优先 slot）
- `#row-actions`：行操作区（编辑/删除/详情等）

**约束（保证可复制）**

- 列表页只负责“展示与触发”，数据逻辑集中在 `request` 与 `api/`。
- 查询 schema 与 columns 尽量可复用：同字段名在列表/表单/详情保持一致。

---

### 17.2 ProForm（表单标准化）

**定位**：用 schema 驱动表单，统一校验、联动、字典字段、默认值等。

**字段 Schema：ProField（建议）**

- `field: string`（绑定 key）
- `label: string`
- `type: 'input' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'daterange' | 'switch' | 'upload' | 'cascader' | 'custom'`
- `required?: boolean`
- `rules?: Rule[]`（兼容 Arco Form rules）
- `defaultValue?: any`
- `props?: Record<string, any>`（透传到组件）
- `dictKey?: string`（select/radio 等自动从字典拉 options）
- `options?: Array<{ label: string; value: any; disabled?: boolean }>`（本地 options）
- `visible?: (model) => boolean`（动态显示）
- `disabled?: (model) => boolean`（动态禁用）
- `watch?: Array<{ fields: string[]; handler: (model) => void }>`（联动）
- `span?: number`（栅格布局）

**输入（建议契约）**

- `modelValue: Record<string, any>`
- `schema: ProField[]`
- `layout?: 'horizontal' | 'vertical'`
- `col?: number`（每行字段数）
- `labelWidth?: number | 'auto'`

**输出（事件/方法）**

- `update:modelValue`
- `@submit(model)`（可选：组件内置提交按钮时）
- `expose` 方法：
  - `validate()`
  - `reset()`
  - `setFieldValue(field, value)`

**Slots**

- `#field-{field}`：自定义字段渲染（type=custom 或特殊情况）
- `#actions`：表单底部按钮区

---

### 17.3 ProModalForm（弹窗表单闭环）

**定位**：把“打开弹窗 + 回填 + 提交 + loading + 成功回调”统一。

**输入（建议契约）**

- `title: string`
- `visible: boolean`
- `schema: ProField[]`
- `model?: Record<string, any>`（初始/回填数据）
- `submit: (model) => Promise<any>`（提交函数）
- `beforeSubmit?: (model) => model`（提交前清洗）
- `width?: number`

**输出（事件）**

- `update:visible`
- `@success(res)`：提交成功
- `@cancel()`：取消/关闭

**约束**

- 弹窗表单不关心 API 细节，API 由 `submit` 注入。

---

### 17.4 ProDescriptions（详情标准化）

**定位**：统一详情页字段展示、格式化、字典转义、标签渲染。

**输入（建议契约）**

- `data: Record<string, any>`
- `items: Array<{ label: string; field: string; dictKey?: string; formatter?: (val, data)=>any; span?: number }>`
- `columns?: number`

---

### 17.5 Auth / v-permission（按钮权限）

**契约建议**

- 权限入参统一使用 `string[]`：`['sys:user:add']`
- `hasPerm(perms)` 作为唯一判断入口（便于后期改策略）

---

### 17.6 DictTag（字典标签）

**契约建议**

- `dictKey: string`
- `value: string | number`
- 内部通过 dict store 映射 label，并按 value 输出 tag（颜色策略可配置）

---

## 18. 数据协议与规范（权限 + 菜单/路由）

> 目的：把后续“对接后端/做动态菜单”需要的数据结构提前定死，避免后期大改。

### 18.1 权限编码规范（强制执行）

- 格式：`{domain}:{resource}:{action}`
- 约束：
  - `domain`：系统域，例如 `sys`、`biz`、`report`
  - `resource`：资源，例如 `user`、`role`、`menu`、`order`
  - `action`：动作，例如 `view`、`add`、`edit`、`delete`、`export`、`import`

**示例**

- `sys:user:view`（用户页面）
- `sys:user:add`（新增）
- `sys:user:edit`（编辑）
- `sys:user:delete`（删除）
- `sys:user:export`（导出）

---

### 18.2 Menu 数据结构（建议）

> 菜单既是“侧栏显示结构”，也是“路由装配来源”。

```ts
export type MenuType = 'dir' | 'menu' | 'link';

export interface MenuItem {
  id: string;
  parentId?: string;
  type: MenuType;
  name: string; // 菜单名称
  code: string; // 唯一编码（可用于权限/埋点）
  path: string; // 路由 path（或外链 url）
  component?: string; // 页面组件路径（动态路由时使用，如 'system/user/index')
  icon?: string;
  order?: number;
  visible?: boolean; // 是否在侧栏可见
  keepAlive?: boolean; // 是否缓存
  perms?: string[]; // 进入页面所需权限（页面级）
  buttons?: string[]; // 页面内按钮权限集合（可选：用于预加载）
  meta?: {
    title?: string;
    affix?: boolean;
    breadcrumb?: boolean;
    activeMenu?: string;
  };
  children?: MenuItem[];
}
```

**约束**

- `path` 与 `component` 的约定必须在 README 写清楚。
- `visible=false` 的菜单不显示，但仍可用于路由存在（如详情页）。

---

### 18.3 Route Meta 约定（建议统一）

```ts
export interface AppRouteMeta {
  title: string;
  icon?: string;
  perms?: string[]; // 路由进入权限
  keepAlive?: boolean;
  hidden?: boolean;
  affix?: boolean;
  breadcrumb?: boolean;
  activeMenu?: string;
}
```

---

### 18.4 用户会话数据结构（建议）

```ts
export interface SessionUser {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  roles: string[];
  perms: string[]; // 全量权限点（按钮/接口）
}

export interface SessionPayload {
  token: string;
  user: SessionUser;
  menus: MenuItem[]; // 若启用动态菜单
}
```

**策略建议**

- MVP 可只返回 `token + user.perms`，菜单用前端静态。
- 升级模式返回 `menus` 做动态路由。

---

### 18.5 接口层约定（统一分页/响应）

```ts
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageQuery {
  pageNum: number;
  pageSize: number;
  sort?: string;
}

export interface PageResult<T> {
  list: T[];
  total: number;
}
```

> 约束：ProTable 的 request 适配 `PageResult`，避免每页写适配代码。

---

### 18.6 新增模块“最小协议”

> 新增任何模块前必须先填这张清单（写在模块 README 或注释里）。

- 模块域：domain = ?
- 资源名：resource = ?
- 页面权限：`domain:resource:view`
- 按钮权限：add/edit/delete/export/import = ?
- 字段字典：哪些字段使用 dictKey？
- 列表查询字段：哪些？默认值？
- 详情页字段：哪些？格式化规则？

---

> 到这里，“组件契约 + 数据协议”就具备了资产化价值：后续你只要按协议扩展模块即可。
