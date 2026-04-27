import { Post } from '../types';

export const posts: Post[] = [
  {
    id: '1',
    title: 'React 18 新特性完全解析',
    date: '2026-04-20',
    excerpt: 'React 18 引入了并发渲染、Suspense 升级、自动批处理等重磅特性，本文带你深入理解这些变化。',
    tags: ['React', '前端'],
    author: '博主',
    readingTime: 8,
    content: `# React 18 新特性完全解析

React 18 是自 React 17 以来最大的版本更新，带来了许多令人兴奋的新特性。本文将深入探讨这些新特性及其使用方法。

## 并发渲染（Concurrent Rendering）

并发渲染是 React 18 最重要的改进之一。它允许 React 同时准备多个版本的 UI。这意味着 React 可以：

- 在不阻塞主线程的情况下渲染大型列表
- 自动调整渲染优先级
- 更智能地处理用户交互

## Suspense 升级

\`\`\`tsx
import { Suspense } from 'react';
import { lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
\`\`\`

## 自动批处理（Automatic Batching）

在 React 18 之前，只有 React 事件处理函数中的 \`setState\` 才会被批处理。现在，所有 \`setState\` 都会被自动批处理，包括 \`fetch\` 回调和 \`setTimeout\`。

\`\`\`jsx
// React 18 之前：两次渲染
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);

// React 18：一次渲染
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);
\`\`\`

## 新的 Hooks

### useId

用于生成唯一的 ID：

\`\`\`jsx
function Checkbox() {
  const id = useId();
  return (
    <div>
      <input type="checkbox" id={id} />
      <label htmlFor={id}>同意条款</label>
    </div>
  );
}
\`\`\`

### useTransition

用于标记非紧急更新：

\`\`\`jsx
import { useTransition } from 'react';

function Search() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  function handleChange(e) {
    startTransition(() => {
      setQuery(e.target.value);
      searchAPI(e.target.value).then(setResults);
    });
  }

  return <input onChange={handleChange} />;
}
\`\`\`

## 总结

React 18 的这些新特性让构建高性能应用变得更加简单。并发模式虽然默认不启用，但它为 React 的未来发展奠定了坚实基础。

> 建议在实际项目中逐步采用这些新特性，而不是一次性全部迁移。
`
  },
  {
    id: '2',
    title: 'TypeScript 5.0 实用技巧总结',
    date: '2026-04-15',
    excerpt: 'TypeScript 5.0 带来了更智能的类型推断、装饰器标准化、性能优化等内容，来看实战技巧。',
    tags: ['TypeScript', '前端'],
    author: '博主',
    readingTime: 6,
    content: `# TypeScript 5.0 实用技巧总结

TypeScript 5.0 是一个重要的里程碑版本，本文总结了几个实用的新技巧。

## 装饰器（Decorators）

TypeScript 5.0 标准化了 ECMAScript 装饰器：

\`\`\`typescript
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(\`Calling \${key} with\`, args);
    return original.apply(this, args);
  };
  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}
\`\`\`

## const 类型参数

\`\`\`typescript
function makeTuple<T extends readonly string[]>(...args: T) {
  return args;
}

// 推断为 [string, string, string]
const tuple = makeTuple('a', 'b', 'c');
\`\`\`

## 更严格的检查

TypeScript 5.0 增加了一些更严格的类型检查，帮助你编写更安全的代码。

## 性能提升

5.0 版本在编译速度上有显著提升，特别是在大型项目中。
`
  },
  {
    id: '3',
    title: '打造高效的个人工作流',
    date: '2026-04-10',
    excerpt: '分享我在日常工作中使用的高效工具和工作方法，从代码编辑器到任务管理都有覆盖。',
    tags: ['效率', '工具'],
    author: '博主',
    readingTime: 5,
    content: `# 打造高效的个人工作流

在这个信息爆炸的时代，高效的工作方法变得越来越重要。以下是我多年来积累的一些工作流优化经验。

## 编辑器配置

我的主力编辑器是 VS Code，关键配置：

1. 使用 Fira Code 字体（连字功能）
2. 配置适合自己的快捷键
3. 常用插件：ESLint、Prettier、GitLens

## 任务管理

使用番茄工作法：
- 25 分钟专注工作
- 5 分钟休息
- 每四个番茄钟后长休息

## 代码管理

- Git 分支策略：feature/fix/refactor
- 定期 rebase，保持历史整洁
- 善用 stash 暂存工作进度

## 持续学习

每天抽出 1 小时学习新技术：
- 早上：阅读技术文章
- 午间：刷算法题
- 晚上：实践项目

> 坚持是最高效的捷径。
`
  },
  {
    id: '4',
    title: 'CSS Grid 布局实战指南',
    date: '2026-04-05',
    excerpt: 'CSS Grid 是现代 CSS 布局的重要组成部分，这篇文章通过实际案例帮助你掌握 Grid 布局。',
    tags: ['CSS', '前端'],
    author: '博主',
    readingTime: 7,
    content: `# CSS Grid 布局实战指南

CSS Grid 是二维布局系统，特别适合页面整体布局。

## 基础概念

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
\`\`\`

## 网格区域命名

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

## 响应式布局

\`\`\`css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
\`\`\`

这个技巧让你不需要媒体查询就能实现响应式布局！
`
  },
  {
    id: '5',
    title: 'Node.js 性能优化实践',
    date: '2026-03-28',
    excerpt: '从内存管理、CPU 使用、I/O 优化等多个角度，探讨如何提升 Node.js 应用的性能。',
    tags: ['Node.js', '后端'],
    author: '博主',
    readingTime: 10,
    content: `# Node.js 性能优化实践

Node.js 以其高性能著称，但在实际项目中仍需注意优化。以下是几个关键优化点。

## 内存管理

使用 \`--max-old-space-size\` 参数控制内存使用：

\`\`\`bash
node --max-old-space-size=4096 server.js
\`\`\`

定期检查内存泄漏：
\`\`\`javascript
setInterval(() => {
  const used = process.memoryUsage();
  console.log(used);
}, 60000);
\`\`\`

## 事件循环优化

避免在事件循环中执行重计算：

\`\`\`javascript
// 不好
function heavyComputation() {
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }
  return result;
}

// 好：使用 Worker Threads
const { Worker } = require('worker_threads');
\`\`\`

## 连接池

合理配置数据库连接池大小：
\`\`\`javascript
const pool = mysql.createPool({
  connectionLimit: 20,
  waitForConnections: true,
  queueLimit: 0
});
\`\`\`

## 缓存策略

使用 Redis 缓存热点数据，减少数据库压力。
`
  },
  {
    id: '6',
    title: 'Git 进阶：掌握高级命令',
    date: '2026-03-20',
    excerpt: '除了 add、commit、push 之外，Git 还有许多强大但鲜为人知的命令，来看看有哪些。',
    tags: ['Git', '工具'],
    author: '博主',
    readingTime: 4,
    content: `# Git 进阶：掌握高级命令

Git 的日常命令大家都会用，但还有一些进阶命令非常有用。

## git reflog

恢复误删的提交：
\`\`\`bash
git reflog
# 找到误删提交的 hash
git checkout <hash>
\`\`\`

## git bisect

二分查找 bug：
\`\`\`bash
git bisect start
git bisect bad
git bisect good <good-commit-hash>
# Git 会自动 checkout 中间版本测试
# 标记 good 或 bad
git bisect reset
\`\`\`

## git stash push

 stash 特定文件：
\`\`\`bash
git stash push -m "temp fix" src/utils.js
\`\`\`

## git log --since

查看最近一周的提交：
\`\`\`bash
git log --since="1 week ago" --oneline
\`\`\`

## git cherry-pick

挑选特定提交：
\`\`\`bash
git cherry-pick <commit-hash>
\`\`\`

掌握这些命令，让你的 Git 技能更上一层楼！
`
  },
  {
    id: '7',
    title: 'Docker 容器化部署完全指南',
    date: '2026-03-15',
    excerpt: '从 Dockerfile 编写到 Docker Compose 编排，详细讲解如何将应用容器化部署。',
    tags: ['Docker', 'DevOps'],
    author: '博主',
    readingTime: 9,
    content: `# Docker 容器化部署完全指南

容器化已成为现代应用部署的标准方式，本文详细介绍 Docker 的使用方法。

## Dockerfile 编写

\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

## Docker Compose 编排

\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secret

  redis:
    image: redis:alpine

volumes:
  postgres_data:
\`\`\`

## 常用命令

| 命令 | 说明 |
|------|------|
| docker build | 构建镜像 |
| docker run | 运行容器 |
| docker-compose up | 启动服务 |
| docker logs | 查看日志 |

## 最佳实践

1. 使用多阶段构建减小镜像体积
2. 不要用 root 用户运行容器
3. 使用 .dockerignore 排除无关文件
`
  },
  {
    id: '8',
    title: '算法面试高频题型总结',
    date: '2026-03-08',
    excerpt: '整理了算法面试中最常见的题型和解题思路，帮助你在面试中游刃有余。',
    tags: ['算法', '面试'],
    author: '博主',
    readingTime: 12,
    content: `# 算法面试高频题型总结

算法面试是很多公司招聘的必考环节，这里总结一下高频题型。

## 双指针

适合有序数组去重、两数之和等问题：
\`\`\`typescript
function twoSum(nums: number[], target: number): number[] {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}
\`\`\`

## 滑动窗口

适合子串、子数组问题：
\`\`\`typescript
function maxSubarraySum(arr: number[], k: number): number {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  let maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
\`\`\`

## 动态规划

经典问题：爬楼梯、背包问题、LIS 等。

关键点：
1. 定义 dp[i] 的含义
2. 找到状态转移方程
3. 确定初始值和遍历顺序

> 面试前多刷题，形成肌肉记忆。
`
  }
];

export const allTags = ['React', 'TypeScript', 'CSS', '前端', 'Node.js', '后端', 'Git', '工具', '效率', 'Docker', 'DevOps', '算法', '面试'];
