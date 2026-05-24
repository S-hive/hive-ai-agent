import { Link } from 'react-router-dom'
import TextType from '@/components/TextType'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const apps = [
  {
    to: '/study',
    icon: '📚',
    iconClass: 'from-[#eef6ff] to-[#e8f3ff]',
    badge: '学习助手',
    title: 'AI 学习搭子',
    description: '智能学习助手，支持多轮对话记忆，SSE 流式实时回复，适合学习规划与答疑。',
  },
  {
    to: '/manus',
    icon: '🤖',
    iconClass: 'from-[#f3f2ff] to-[#ebe9ff]',
    badge: '超级智能体',
    title: 'AI 超级智能体',
    description: '具备工具调用能力的 Manus 智能体，可分解复杂任务并逐步执行。',
  },
]

export function HomePage() {
  return (
    <div className="min-h-full bg-gradient-to-b from-[#f7f8fa] to-white">
      <section className="mx-auto max-w-[960px] px-6 pb-12 pt-12">
        <header className="flex items-center gap-4">
          <span className="text-[40px]">🐝</span>
          <div>
            <Badge variant="outline" className="mb-2 rounded-full border-[#d9d6ff] bg-white">
              Hive AI Platform
            </Badge>
            <h1 className="text-[28px] font-bold text-[#1f2329]">Hive AI</h1>
            <TextType
              text="选择要使用的 AI 应用"
              className="mt-1 block text-[15px] text-[#86909c]"
              typingSpeed={30}
              loop={false}
              showCursor
            />
          </div>
        </header>

        <main className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          {apps.map((app) => (
            <Link key={app.to} to={app.to} className="block h-full">
              <Card className="h-full rounded-[20px] border-[#eef0f3] shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:border-[#d9d6ff] hover:shadow-[0_16px_40px_rgba(97,92,237,0.12)]">
                <CardHeader className="pb-2">
                  <div
                    className={`mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-gradient-to-br text-[26px] ${app.iconClass}`}
                  >
                    {app.icon}
                  </div>
                  <Badge variant="secondary" className="mb-2 w-fit rounded-full bg-[#f3f2ff] text-[#615ced]">
                    {app.badge}
                  </Badge>
                  <CardTitle className="text-lg text-[#1f2329]">{app.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex h-full flex-col">
                  <CardDescription className="mb-5 flex-1 text-sm leading-relaxed text-[#86909c]">
                    {app.description}
                  </CardDescription>
                  <span className="text-sm font-medium text-[#615ced]">进入应用 →</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </main>
      </section>
    </div>
  )
}
