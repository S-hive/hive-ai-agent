<template>
  <div class="home-page">
    <header class="home-header">
      <div class="brand">
        <span class="brand-icon">🐝</span>
        <div>
          <h1 class="brand-title">Hive AI</h1>
          <p class="brand-desc">选择要使用的 AI 应用</p>
        </div>
      </div>
    </header>

    <main class="app-grid">
      <router-link to="/study" class="app-card">
        <div class="card-icon study">📚</div>
        <h2 class="card-title">AI 学习搭子</h2>
        <p class="card-desc">
          智能学习助手，支持多轮对话记忆，SSE 流式实时回复，适合学习规划与答疑。
        </p>
        <span class="card-action">进入应用 →</span>
      </router-link>

      <router-link to="/manus" class="app-card">
        <div class="card-icon manus">🤖</div>
        <h2 class="card-title">AI 超级智能体</h2>
        <p class="card-desc">
          具备工具调用能力的 Manus 智能体，可分解复杂任务并逐步执行。
        </p>
        <span class="card-action">进入应用 →</span>
      </router-link>
    </main>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100%;
  background: linear-gradient(180deg, #f7f8fa 0%, #ffffff 40%);
}

.home-header {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 24px 32px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-icon {
  font-size: 40px;
}

.brand-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2329;
}

.brand-desc {
  margin-top: 4px;
  font-size: 15px;
  color: #86909c;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 48px;
}

.app-card {
  display: flex;
  flex-direction: column;
  padding: 28px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #eef0f3;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    border-color 0.2s;
}

.app-card:hover {
  transform: translateY(-4px);
  border-color: #d9d6ff;
  box-shadow: 0 16px 40px rgba(97, 92, 237, 0.12);
}

.card-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  border-radius: 14px;
  margin-bottom: 16px;
}

.card-icon.study {
  background: linear-gradient(135deg, #eef6ff 0%, #e8f3ff 100%);
}

.card-icon.manus {
  background: linear-gradient(135deg, #f3f2ff 0%, #ebe9ff 100%);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2329;
  margin-bottom: 10px;
}

.card-desc {
  flex: 1;
  font-size: 14px;
  line-height: 1.7;
  color: #86909c;
  margin-bottom: 20px;
}

.card-action {
  font-size: 14px;
  font-weight: 500;
  color: #615ced;
}
</style>
