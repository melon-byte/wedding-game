import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AVATARS, ADMIN_PASSWORD } from './types'
import { createGuest } from './state'
import { useGameState, getGameState, setGameState } from './App'
import './SignIn.css'

export default function SignIn() {
  const navigate = useNavigate()
  const state = useGameState()
  const [name, setName] = useState('')
  const [phoneSuffix, setPhoneSuffix] = useState('')
  const [avatar, setAvatar] = useState<string>(AVATARS[0])
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminPwd, setAdminPwd] = useState('')
  const [error, setError] = useState('')
  const [adminError, setAdminError] = useState('')

  const currentGuest = state.currentGuestId
    ? state.guests.find((g) => g.id === state.currentGuestId)
    : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) { setError('请输入你的名字'); return }
    if (trimmed.length > 10) { setError('名字太长了，10个字以内'); return }
    if (!phoneSuffix.trim()) { setError('请输入手机尾号（4位）'); return }
    if (!/^\d{4}$/.test(phoneSuffix.trim())) { setError('手机尾号须为4位数字'); return }

    const st = getGameState()
    const existing = st.guests.find(
      (g) => g.name === trimmed && g.phoneSuffix === phoneSuffix.trim(),
    )
    if (existing) {
      const updated = st.guests.map((g) =>
        g.id === existing.id ? { ...g, avatar } : g,
      )
      setGameState({ ...st, guests: updated, currentGuestId: existing.id })
      navigate('/lobby')
      return
    }
    const guest = createGuest(trimmed, phoneSuffix.trim(), avatar)
    setGameState({ ...st, guests: [...st.guests, guest], currentGuestId: guest.id })
    navigate('/lobby')
  }

  return (
    <div className="page signin-page">
      <div className="signin-hero">
        <div className="signin-icon">🍄</div>
        <h1>
          <span className="signin-title-line">蘑菇森林</span>
          <span className="signin-title-line">婚礼游园会</span>
        </h1>
        <p className="signin-subtitle">领取你的专属角色卡，踏入林地收集蘑菇印记</p>
      </div>

      {currentGuest && state.phase !== 'settled' && (
        <div className="signin-returning">
          <div className="signin-returning-avatar">{currentGuest.avatar}</div>
          <div className="signin-returning-info">
            <span className="signin-returning-name">{currentGuest.name}</span>
            {currentGuest.phoneSuffix && (
              <span className="signin-returning-phone">🍄 尾号 {currentGuest.phoneSuffix}</span>
            )}
          </div>
          <button className="btn btn-gold btn-lg btn-block" onClick={() => navigate('/lobby')}>
            继续探索林地
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setGameState({ ...getGameState(), currentGuestId: null })}
          >
            变换形态
          </button>
        </div>
      )}

      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">🌿 你的名字</label>
          <input
            className="input" type="text" placeholder="在蘑菇上写下你的名字..."
            value={name} onChange={(e) => setName(e.target.value)} maxLength={10} autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            🍄 魔法印记 <span className="form-label-hint">（手机尾号 4 位，守护你的身份）</span>
          </label>
          <input
            className="input" type="text" inputMode="numeric" placeholder="如：5678"
            value={phoneSuffix} onChange={(e) => setPhoneSuffix(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4} autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label className="form-label">🦊 选择你的森林伙伴</label>
          <div className="avatar-grid">
            {AVATARS.map((a) => (
              <button key={a} type="button"
                className={`avatar-btn${avatar === a ? ' selected' : ''}`}
                onClick={() => setAvatar(a)}>{a}</button>
            ))}
          </div>
        </div>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="btn btn-gold btn-lg btn-block">🍄 踏入森林</button>
      </form>

      <div className="rule-guide">
        <h3><span className="emoji">📖</span> 游园规则</h3>
        <div className="rule-steps">
          <div className="rule-step">
            <div className="rule-step-num">1</div>
            <div className="rule-step-title">签到</div>
            <div className="rule-step-desc">写下名字<br/>选择森林伙伴</div>
          </div>
          <div className="rule-arrow">→</div>
          <div className="rule-step">
            <div className="rule-step-num">2</div>
            <div className="rule-step-title">探索</div>
            <div className="rule-step-desc">6 块林地<br/>每块 2 选 1 支线</div>
          </div>
          <div className="rule-arrow">→</div>
          <div className="rule-step">
            <div className="rule-step-num">3</div>
            <div className="rule-step-title">挑战</div>
            <div className="rule-step-desc">完成挑战<br/>森林守护者打分</div>
          </div>
          <div className="rule-arrow">→</div>
          <div className="rule-step">
            <div className="rule-step-num">4</div>
            <div className="rule-step-title">结算</div>
            <div className="rule-step-desc">阵营对抗<br/>赢取祝福</div>
          </div>
        </div>
        <div className="rule-detail">
          <strong>6 块林地</strong>分为 👰<strong>新娘支线</strong>（沟通模式、审美品味、生活取向）和 🤵<strong>新郎支线</strong>（执行力、人生态度、取舍博弈）。<br/>
          每块林地有 <strong>A / B 两个支线选项</strong>，代表新人在某方面的性格差异。<br/>
          选择你的站队，完成挑战后由<strong>森林守护者（NPC）</strong>根据表现录入 1~3 颗蘑菇。<br/>
          结算时两边蘑菇总数比拼，决定最终祝福花落谁家！
        </div>
      </div>

      <div className="signin-admin">
        <button className="btn btn-outline btn-sm" onClick={() => setShowAdmin(!showAdmin)}>
          🗝 森林守护者入口
        </button>
        {showAdmin && (
          <form className="signin-admin-form" onSubmit={(e) => {
            e.preventDefault()
            adminPwd === ADMIN_PASSWORD ? navigate('/admin') : setAdminError('咒语错误')
          }}>
            <input className="input input-sm" type="password" placeholder="守护者咒语..."
              value={adminPwd} onChange={(e) => setAdminPwd(e.target.value)} autoComplete="off" />
            <button type="submit" className="btn btn-primary btn-sm">进入</button>
            {adminError && <span className="form-error">{adminError}</span>}
          </form>
        )}
      </div>
    </div>
  )
}
