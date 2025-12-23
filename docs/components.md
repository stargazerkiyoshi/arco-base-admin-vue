# 通用组件设计步骤

## L1 UI 包装层（最稳定，先做）

> 目标：统一 Arco 的使用姿势、样式规范、交互细节；**不掺业务**
> **P0（必做）**

- `BaseTable`：分页/Loading/空态/密度/列设置/刷新/统一 rowKey
- `BaseForm`：布局（grid/inline）、labelWidth、校验/重置/提交规范
- `BaseModal`：confirm loading、async submit、统一 footer、关闭策略
- `BaseDrawer`：同上，抽屉版表单/详情常用
- `BasePage` / `PageContainer`：页头标题/面包屑/右侧操作区/内容区 padding

**P1（建议）**

- `BaseCard`：统一卡片间距/标题栏
- `BaseToolbar`：列表页顶部操作区（新建/导入/导出/刷新/密度）
- `BaseEmpty`：空态（含引导动作）
- `BaseTag`：状态标签统一映射（颜色/文案）

---

## L2 行为抽象层（Composable Hooks，可演化）

> 目标：把“请求、状态、交互流程”抽出来；**不写字段、不绑定 API**
> **P0（必做）**

- `useTable`：分页、排序、筛选、请求、缓存、reload/reset
- `useModalForm`：新增/编辑打开、回填、提交、loading、关闭
- `useQueryParams`：查询条件 ↔ URL 同步（列表页非常省事）
- `useDict`：字典加载/缓存/刷新

**P1（建议）**

- `usePermission`：权限点判断（与路由/meta/store 适配）
- `useAsyncTask`：统一 async loading/error/toast（减少重复 try/catch）
- `useSelection`：表格多选、跨页选择、批量操作

---

## L3 通用业务组件层（ROI最高，但要“可逃逸”）

> 目标：覆盖后台 70% 高频页面模式；必须 **slots 多 + 可绕开**
> **P0（核心）**

- `ProTable`：= Search + Table + Pagination + Toolbar 的组合（列表页主力）
- `SchemaForm`：配置化表单（Input/Select/Date/Upload… + 校验）
- `FormModal` / `FormDrawer`：SchemaForm + BaseModal/Drawer（增改一体）
- `DetailPanel`：详情展示（Descriptions + Tabs + 操作区）

**P1（建议）**

- `DictSelect` / `DictRadio` / `DictTag`：字典驱动的输入/展示
- `BatchActions`：批量启用/禁用/删除/导出（配合 selection）
- `ConfirmButton`：带二次确认与 loading 的按钮（危险操作统一）

---

## L4 业务模式组件层（资产化，但必须“可替换”）

> 目标：把“CRUD页面”做成默认模板；但永远允许你不用它
> **P0（做完 L3 再上）**

- `CrudPage`：ProTable + FormModal/FormDrawer + DetailPanel 的组合模板
- `ResourceCrud`：把 API（list/create/update/delete）规范化后接入 CrudPage

**P1（按需）**

- `WizardForm`：分步表单（复杂创建流程）
- `TransferTable`：穿梭框+表格（你之前拖拽/排序类需求也能融进去）
- `SortableList`：拖拽排序列表（后台经常用）

---

## 建议的落地顺序（照着做就行）

1. L1：`BasePage` → `BaseTable` → `BaseForm` → `BaseModal/Drawer`
2. L2：`useTable` → `useModalForm` → `useDict`
3. L3：`ProTable` → `SchemaForm` → `FormModal`
4. L4：`CrudPage`

---

如果你现在要“开始第一步”，我建议先从 **`BaseTable`** 下手（它能最快验证你的分层是否正确）。
你把你期望的表格页面长什么样（比如含查询/批量/操作列/分页）描述一下，我直接给你 **BaseTable 的 props/slots 设计草案**（偏“可扩展、不会封死”那种）。
