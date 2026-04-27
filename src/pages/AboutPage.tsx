import Layout from '../components/Layout';
import { Github, Mail, Heart, Terminal, Code2, Coffee } from 'lucide-react';

const skills = [
  { icon: Code2, name: '前端开发', desc: 'React / Vue / TypeScript' },
  { icon: Terminal, name: '后端开发', desc: 'Node.js / Python / Go' },
  { icon: Coffee, name: '效率工具', desc: 'Git / Docker / CI/CD' },
];

const links = [
  { icon: Github, label: 'GitHub', href: 'https://github.com', color: 'hover:text-gray-900 dark:hover:text-white' },
  { icon: Mail, label: '邮箱', href: 'mailto:hello@example.com', color: 'hover:text-red-500' },
];

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* 头像区 */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white mb-6 shadow-xl">
            B
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            博主
          </h1>
          <p className="text-gray-500 dark:text-gray-500">全栈开发 / 技术写作者</p>
        </div>

        {/* 关于我 */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
            关于我
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              你好！我是一名热爱技术的全栈开发者，目前专注于 Web 前端开发和 DevOps 相关工作。
            </p>
            <p>
              我喜欢通过写博客来记录学习心得、整理知识体系，同时也希望能帮助到有同样兴趣的开发者。
            </p>
            <p>
              在工作之余，我也会研究一些效率工具和新技术，努力让自己成为更好的工程师。
            </p>
          </div>
        </section>

        {/* 技能 */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
            技术栈
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {skills.map(({ icon: Icon, name, desc }) => (
              <div
                key={name}
                className="card p-4 text-center hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 联系方式 */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
            联系方式
          </h2>
          <div className="flex flex-wrap gap-4">
            {links.map(({ icon: Icon, label, href, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors ${color}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            ))}
          </div>
        </section>

        {/* 底部寄语 */}
        <div className="text-center py-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-500 text-sm flex items-center justify-center gap-1">
            用 <Heart className="w-4 h-4 text-red-500 fill-red-500" /> 打造
          </p>
        </div>
      </div>
    </Layout>
  );
}
