import type { Post } from '../types';

export const posts: Post[] = [
  {
    id: '1',
    title: 'React 18 æ°ç¹æ§å®å¨è§£æ',
    date: '2026-04-20',
    excerpt: 'React 18 å¼å¥äºå¹¶åæ¸²æãSuspense åçº§ãèªå¨æ¹å¤çç­éç£ç¹æ§ï¼æ¬æå¸¦ä½ æ·±å¥çè§£è¿äºååã',
    tags: ['React', 'åç«¯'],
    author: 'åä¸»',
    readingTime: 8,
    content: `# React 18 æ°ç¹æ§å®å¨è§£æ

React 18 æ¯èª React 17 ä»¥æ¥æå¤§ççæ¬æ´æ°ï¼å¸¦æ¥äºè®¸å¤ä»¤äººå´å¥çæ°ç¹æ§ãæ¬æå°æ·±å¥æ¢è®¨è¿äºæ°ç¹æ§åå¶ä½¿ç¨æ¹æ³ã

## å¹¶åæ¸²æï¼Concurrent Renderingï¼

å¹¶åæ¸²ææ¯ React 18 æéè¦çæ¹è¿ä¹ä¸ãå®åè®¸ React åæ¶åå¤å¤ä¸ªçæ¬ç UIãè¿æå³ç React å¯ä»¥ï¼

- å¨ä¸é»å¡ä¸»çº¿ç¨çæåµä¸æ¸²æå¤§ååè¡¨
- èªå¨è°æ´æ¸²æä¼åçº§
- æ´æºè½å°å¤çç¨æ·äº¤äº

## Suspense åçº§

\`\`\`tsx
import { Suspense } from 'react';
import { lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>å è½½ä¸­...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
\`\`\`

## èªå¨æ¹å¤çï¼Automatic Batchingï¼

å¨ React 18 ä¹åï¼åªæ React äºä»¶å¤çå½æ°ä¸­ç \`setState\` æä¼è¢«æ¹å¤çãç°å¨ï¼ææ \`setState\` é½ä¼è¢«èªå¨æ¹å¤çï¼åæ¬ \`fetch\` åè°å \`setTimeout\`ã

\`\`\`jsx
// React 18 ä¹åï¼ä¸¤æ¬¡æ¸²æ
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);

// React 18ï¼ä¸æ¬¡æ¸²æ
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);
\`\`\`

## æ°ç Hooks

### useId

ç¨äºçæå¯ä¸ç IDï¼

\`\`\`jsx
function Checkbox() {
  const id = useId();
  return (
    <div>
      <input type="checkbox" id={id} />
      <label htmlFor={id}>åææ¡æ¬¾</label>
    </div>
  );
}
\`\`\`

### useTransition

ç¨äºæ è®°éç´§æ¥æ´æ°ï¼

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

## æ»ç»

React 18 çè¿äºæ°ç¹æ§è®©æå»ºé«æ§è½åºç¨åå¾æ´å ç®åãå¹¶åæ¨¡å¼è½ç¶é»è®¤ä¸å¯ç¨ï¼ä½å®ä¸º React çæªæ¥åå±å¥ å®äºåå®åºç¡ã

> å»ºè®®å¨å®éé¡¹ç®ä¸­éæ­¥éç¨è¿äºæ°ç¹æ§ï¼èä¸æ¯ä¸æ¬¡æ§å¨é¨è¿ç§»ã
`
  },
  {
    id: '2',
    title: 'TypeScript 5.0 å®ç¨æå·§æ»ç»',
    date: '2026-04-15',
    excerpt: 'TypeScript 5.0 å¸¦æ¥äºæ´æºè½çç±»åæ¨æ­ãè£é¥°å¨æ ååãæ§è½ä¼åç­åå®¹ï¼æ¥çå®ææå·§ã',
    tags: ['TypeScript', 'åç«¯'],
    author: 'åä¸»',
    readingTime: 6,
    content: `# TypeScript 5.0 å®ç¨æå·§æ»ç»

TypeScript 5.0 æ¯ä¸ä¸ªéè¦çéç¨ç¢çæ¬ï¼æ¬ææ»ç»äºå ä¸ªå®ç¨çæ°æå·§ã

## è£é¥°å¨ï¼Decoratorsï¼

TypeScript 5.0 æ ååäº ECMAScript è£é¥°å¨ï¼

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

## const ç±»ååæ°

\`\`\`typescript
function makeTuple<T extends readonly string[]>(...args: T) {
  return args;
}

// æ¨æ­ä¸º [string, string, string]
const tuple = makeTuple('a', 'b', 'c');
\`\`\`

## æ´ä¸¥æ ¼çæ£æ¥

TypeScript 5.0 å¢å äºä¸äºæ´ä¸¥æ ¼çç±»åæ£æ¥ï¼å¸®å©ä½ ç¼åæ´å®å¨çä»£ç ã

## æ§è½æå

5.0 çæ¬å¨ç¼è¯éåº¦ä¸ææ¾èæåï¼ç¹å«æ¯å¨å¤§åé¡¹ç®ä¸­ã
`
  },
  {
    id: '3',
    title: 'æé é«æçä¸ªäººå·¥ä½æµ',
    date: '2026-04-10',
    excerpt: 'åäº«æå¨æ¥å¸¸å·¥ä½ä¸­ä½¿ç¨çé«æå·¥å·åå·¥ä½æ¹æ³ï¼ä»ä»£ç ç¼è¾å¨å°ä»»å¡ç®¡çé½æè¦çã',
    tags: ['æç', 'å·¥å·'],
    author: 'åä¸»',
    readingTime: 5,
    content: `# æé é«æçä¸ªäººå·¥ä½æµ

å¨è¿ä¸ªä¿¡æ¯çç¸çæ¶ä»£ï¼é«æçå·¥ä½æ¹æ³åå¾è¶æ¥è¶éè¦ãä»¥ä¸æ¯æå¤å¹´æ¥ç§¯ç´¯çä¸äºå·¥ä½æµä¼åç»éªã

## ç¼è¾å¨éç½®

æçä¸»åç¼è¾å¨æ¯ VS Codeï¼å³é®éç½®ï¼

1. ä½¿ç¨ Fira Code å­ä½ï¼è¿å­åè½ï¼
2. éç½®éåèªå·±çå¿«æ·é®
3. å¸¸ç¨æä»¶ï¼ESLintãPrettierãGitLens

## ä»»å¡ç®¡ç

ä½¿ç¨çªèå·¥ä½æ³ï¼
- 25 åéä¸æ³¨å·¥ä½
- 5 åéä¼æ¯
- æ¯åä¸ªçªèéåé¿ä¼æ¯

## ä»£ç ç®¡ç

- Git åæ¯ç­ç¥ï¼feature/fix/refactor
- å®æ rebaseï¼ä¿æåå²æ´æ´
- åç¨ stash æå­å·¥ä½è¿åº¦

## æç»­å­¦ä¹ 

æ¯å¤©æ½åº 1 å°æ¶å­¦ä¹ æ°ææ¯ï¼
- æ©ä¸ï¼éè¯»ææ¯æç« 
- åé´ï¼å·ç®æ³é¢
- æä¸ï¼å®è·µé¡¹ç®

> åææ¯æé«æçæ·å¾ã
`
  },
  {
    id: '4',
    title: 'CSS Grid å¸å±å®ææå',
    date: '2026-04-05',
    excerpt: 'CSS Grid æ¯ç°ä»£ CSS å¸å±çéè¦ç»æé¨åï¼è¿ç¯æç« éè¿å®éæ¡ä¾å¸®å©ä½ ææ¡ Grid å¸å±ã',
    tags: ['CSS', 'åç«¯'],
    author: 'åä¸»',
    readingTime: 7,
    content: `# CSS Grid å¸å±å®ææå

CSS Grid æ¯äºç»´å¸å±ç³»ç»ï¼ç¹å«éåé¡µé¢æ´ä½å¸å±ã

## åºç¡æ¦å¿µ

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
\`\`\`

## ç½æ ¼åºåå½å

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

## ååºå¼å¸å±

\`\`\`css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
\`\`\`

è¿ä¸ªæå·§è®©ä½ ä¸éè¦åªä½æ¥è¯¢å°±è½å®ç°ååºå¼å¸å±ï¼
`
  },
  {
    id: '5',
    title: 'Node.js æ§è½ä¼åå®è·µ',
    date: '2026-03-28',
    excerpt: 'ä»åå­ç®¡çãCPU ä½¿ç¨ãI/O ä¼åç­å¤ä¸ªè§åº¦ï¼æ¢è®¨å¦ä½æå Node.js åºç¨çæ§è½ã',
    tags: ['Node.js', 'åç«¯'],
    author: 'åä¸»',
    readingTime: 10,
    content: `# Node.js æ§è½ä¼åå®è·µ

Node.js ä»¥å¶é«æ§è½èç§°ï¼ä½å¨å®éé¡¹ç®ä¸­ä»éæ³¨æä¼åãä»¥ä¸æ¯å ä¸ªå³é®ä¼åç¹ã

## åå­ç®¡ç

ä½¿ç¨ \`--max-old-space-size\` åæ°æ§å¶åå­ä½¿ç¨ï¼

\`\`\`bash
node --max-old-space-size=4096 server.js
\`\`\`

å®ææ£æ¥åå­æ³æ¼ï¼
\`\`\`javascript
setInterval(() => {
  const used = process.memoryUsage();
  console.log(used);
}, 60000);
\`\`\`

## äºä»¶å¾ªç¯ä¼å

é¿åå¨äºä»¶å¾ªç¯ä¸­æ§è¡éè®¡ç®ï¼

\`\`\`javascript
// ä¸å¥½
function heavyComputation() {
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }
  return result;
}

// å¥½ï¼ä½¿ç¨ Worker Threads
const { Worker } = require('worker_threads');
\`\`\`

## è¿æ¥æ± 

åçéç½®æ°æ®åºè¿æ¥æ± å¤§å°ï¼
\`\`\`javascript
const pool = mysql.createPool({
  connectionLimit: 20,
  waitForConnections: true,
  queueLimit: 0
});
\`\`\`

## ç¼å­ç­ç¥

ä½¿ç¨ Redis ç¼å­ç­ç¹æ°æ®ï¼åå°æ°æ®åºååã
`
  },
  {
    id: '6',
    title: 'Git è¿é¶ï¼ææ¡é«çº§å½ä»¤',
    date: '2026-03-20',
    excerpt: 'é¤äº addãcommitãpush ä¹å¤ï¼Git è¿æè®¸å¤å¼ºå¤§ä½é²ä¸ºäººç¥çå½ä»¤ï¼æ¥ççæåªäºã',
    tags: ['Git', 'å·¥å·'],
    author: 'åä¸»',
    readingTime: 4,
    content: `# Git è¿é¶ï¼ææ¡é«çº§å½ä»¤

Git çæ¥å¸¸å½ä»¤å¤§å®¶é½ä¼ç¨ï¼ä½è¿æä¸äºè¿é¶å½ä»¤éå¸¸æç¨ã

## git reflog

æ¢å¤è¯¯å çæäº¤ï¼
\`\`\`bash
git reflog
# æ¾å°è¯¯å æäº¤ç hash
git checkout <hash>
\`\`\`

## git bisect

äºåæ¥æ¾ bugï¼
\`\`\`bash
git bisect start
git bisect bad
git bisect good <good-commit-hash>
# Git ä¼èªå¨ checkout ä¸­é´çæ¬æµè¯
# æ è®° good æ bad
git bisect reset
\`\`\`

## git stash push

 stash ç¹å®æä»¶ï¼
\`\`\`bash
git stash push -m "temp fix" src/utils.js
\`\`\`

## git log --since

æ¥çæè¿ä¸å¨çæäº¤ï¼
\`\`\`bash
git log --since="1 week ago" --oneline
\`\`\`

## git cherry-pick

æéç¹å®æäº¤ï¼
\`\`\`bash
git cherry-pick <commit-hash>
\`\`\`

ææ¡è¿äºå½ä»¤ï¼è®©ä½ ç Git æè½æ´ä¸ä¸å±æ¥¼ï¼
`
  },
  {
    id: '7',
    title: 'Docker å®¹å¨åé¨ç½²å®å¨æå',
    date: '2026-03-15',
    excerpt: 'ä» Dockerfile ç¼åå° Docker Compose ç¼æï¼è¯¦ç»è®²è§£å¦ä½å°åºç¨å®¹å¨åé¨ç½²ã',
    tags: ['Docker', 'DevOps'],
    author: 'åä¸»',
    readingTime: 9,
    content: `# Docker å®¹å¨åé¨ç½²å®å¨æå

å®¹å¨åå·²æä¸ºç°ä»£åºç¨é¨ç½²çæ åæ¹å¼ï¼æ¬æè¯¦ç»ä»ç» Docker çä½¿ç¨æ¹æ³ã

## Dockerfile ç¼å

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

## Docker Compose ç¼æ

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

## å¸¸ç¨å½ä»¤

| å½ä»¤ | è¯´æ |
|------|------|
| docker build | æå»ºéå |
| docker run | è¿è¡å®¹å¨ |
| docker-compose up | å¯å¨æå¡ |
| docker logs | æ¥çæ¥å¿ |

## æä½³å®è·µ

1. ä½¿ç¨å¤é¶æ®µæå»ºåå°éåä½ç§¯
2. ä¸è¦ç¨ root ç¨æ·è¿è¡å®¹å¨
3. ä½¿ç¨ .dockerignore æé¤æ å³æä»¶
`
  },
  {
    id: '8',
    title: 'ç®æ³é¢è¯é«é¢é¢åæ»ç»',
    date: '2026-03-08',
    excerpt: 'æ´çäºç®æ³é¢è¯ä¸­æå¸¸è§çé¢ååè§£é¢æè·¯ï¼å¸®å©ä½ å¨é¢è¯ä¸­æ¸¸åæä½ã',
    tags: ['ç®æ³', 'é¢è¯'],
    author: 'åä¸»',
    readingTime: 12,
    content: `# ç®æ³é¢è¯é«é¢é¢åæ»ç»

ç®æ³é¢è¯æ¯å¾å¤å¬å¸æèçå¿èç¯èï¼è¿éæ»ç»ä¸ä¸é«é¢é¢åã

## åæé

éåæåºæ°ç»å»éãä¸¤æ°ä¹åç­é®é¢ï¼
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

## æ»å¨çªå£

éåå­ä¸²ãå­æ°ç»é®é¢ï¼
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

## å¨æè§å

ç»å¸é®é¢ï¼ç¬æ¥¼æ¢¯ãèåé®é¢ãLIS ç­ã

å³é®ç¹ï¼
1. å®ä¹ dp[i] çå«ä¹
2. æ¾å°ç¶æè½¬ç§»æ¹ç¨
3. ç¡®å®åå§å¼åéåé¡ºåº

> é¢è¯åå¤å·é¢ï¼å½¢æèèè®°å¿ã
`
  }
];

export const allTags = ['React', 'TypeScript', 'CSS', 'åç«¯', 'Node.js', 'åç«¯', 'Git', 'å·¥å·', 'æç', 'Docker', 'DevOps', 'ç®æ³', 'é¢è¯',
  {
    id: '1778401643726',
    title: '鬼地方个',
    date: '2026-05-10',
    excerpt: '防守打法',
    tags: [],
    author: '博主',
    readingTime: 1,
    content: `发发顺丰复生`
  }
];
