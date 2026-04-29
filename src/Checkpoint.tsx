import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BRIDE_ATTRS, NPC_PASSWORD } from './types'
import { CHECKPOINTS } from './data'
import { saveScore as saveScoreFn } from './state'
import { useGameState, getGameState, setGameState } from './App'
import './Checkpoint.css'

export default function Checkpoint() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [choice, setChoice] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [npcPin, setNpcPin] = useState('')
  const [npcError, setNpcError] = useState('')
  const [saved, setSaved] = useState(false)
  const [npcMode, setNpcMode] = useState(false)

  const state = useGameState()
  const guest = state.guests.find((g) => g.id === state.currentGuestId)
  const cp = CHECKPOINTS.find((c) => c.id === id)
  if (!cp) { navigate('/lobby'); return null }
  if (!guest) { navigate('/'); return null }

  const hasGuestChoice = cp.id in guest.choices
  const isBrideCp = BRIDE_ATTRS.includes(cp.id as never)
  const side = isBrideCp ? 'bride' : 'groom'

  const handleSave = () => {
    if (npcPin !== NPC_PASSWORD) { setNpcError('🍄 咒语不对，请森林守护者确认'); return }
    if (score === null) { setNpcError('🍄 请先选择蘑菇数量'); return }
    if (!choice || !guest) return
    setNpcError('')
    const st = getGameState()
    setGameState(saveScoreFn(st, guest.id, cp.id, choice, score))
    setSaved(true)
    setTimeout(() => navigate('/lobby'), 1600)
  }

  const cpIcon =
    cp.id === 'communication' ? '💬' : cp.id === 'aesthetic' ? '🎨' : cp.id === 'lifestyle' ? '🎁'
    : cp.id === 'execution' ? '⚡' : cp.id === 'attitude' ? '🎯' : '🎲'

  const cpBigIcon =
    cp.id === 'communication' ? '🦋' : cp.id === 'aesthetic' ? '🌸' : cp.id === 'lifestyle' ? '🌱'
    : cp.id === 'execution' ? '🦉' : cp.id === 'attitude' ? '🐗' : '🦌'

  return (
    <div className="page checkpoint-page">
      <button className="btn btn-outline btn-sm cp-back" onClick={() => navigate('/lobby')}>
        ← 返回林地地图
      </button>

      <div className={`cp-banner ${side}`}>
        <div className="cpb-top-row">
          <span className="cpb-realm">{isBrideCp ? '👰 新娘支线' : '🤵 新郎支线'}</span>
          <div className="cpb-tags">
            <span className="cpbt-tag">🍄 第 {CHECKPOINTS.indexOf(cp) + 1} 块林地</span>
            <span className="cpbt-tag">{cp.type === 'team' ? '👥 团队' : '👤 个人'}</span>
            <span className="cpbt-tag">⏱ {cp.duration}</span>
          </div>
        </div>
        <div className="cpb-main">
          <div className="cpb-mushroom">{cpBigIcon}</div>
          <div className="cpb-info">
            <h2>{cp.title}</h2>
            <p className="cpb-sub">{cp.subtitle}</p>
          </div>
        </div>
      </div>

      {hasGuestChoice ? (
        <div className={`cp-finished ${side}`}>
          <div className="cpf-stamp">✅</div>
          <div className="cpf-card">
            <div className="cpfc-row">
              <span className="cpfc-label">你的足迹</span>
              <span className="cpfc-chip">{guest.choices[cp.id]}</span>
            </div>
            <div className="cpfc-row">
              <span className="cpfc-label">蘑菇收集</span>
              <span className={`cpfc-score ${side}`}>{guest.scores[cp.id]}颗🍄</span>
            </div>
          </div>
          {saved && <div className="cpf-toast">✨ 已刻入蘑菇之书</div>}
        </div>
      ) : !npcMode ? (
        <>
          <div className={`cp-progress-steps ${side}`}>
            <div className="cpps-step active">
              <div className="cpps-dot"><span>1</span></div>
              <span className="cpps-label">了解林地</span>
            </div>
            <div className="cpps-line active"></div>
            <div className={`cpps-step${choice ? ' active' : ''}`}>
              <div className="cpps-dot"><span>2</span></div>
              <span className="cpps-label">选择支线</span>
            </div>
            <div className={`cpps-line${choice ? ' active' : ''}`}></div>
            <div className="cpps-step">
              <div className="cpps-dot"><span>3</span></div>
              <span className="cpps-label">挑战评分</span>
            </div>
          </div>

          <div className="cp-choices">
            <button className={`cp-ch-btn ${side}${choice === cp.themeA ? ' sel' : ''}`}
              onClick={() => setChoice(cp.themeA)}>
              <div className="cpch-top">
                <span className="cpch-emoji">{cpIcon}</span>
                <span className="cpch-letter">🅰</span>
                <span className="cpch-theme">{cp.themeA}</span>
              </div>
              <p className="cpch-desc">{cp.descA.split('\n').map((line, i) => (
                <span key={i}>{line}<br/></span>
              ))}</p>
              <div className="cpch-rules-box">
                <span className="cpch-rules-title">📋 计分</span>
                <div className="cpch-rules-content">{cp.scoringA.split('\n').map((ln, i) => (
                  <div key={i} className="cpch-rule-row">
                    <span className="cpchr-marker">🌱</span>
                    <span>{ln.replace(/^[·•\-\s]+/, '')}</span>
                  </div>
                ))}</div>
              </div>
            </button>

            <div className="cp-divider">
              <span className="cpd-line"></span>
              <span className="cpd-icon">VS</span>
              <span className="cpd-line"></span>
            </div>

            <button className={`cp-ch-btn ${side}${choice === cp.themeB ? ' sel' : ''}`}
              onClick={() => setChoice(cp.themeB)}>
              <div className="cpch-top">
                <span className="cpch-emoji">{cpIcon}</span>
                <span className="cpch-letter">🅱</span>
                <span className="cpch-theme">{cp.themeB}</span>
              </div>
              <p className="cpch-desc">{cp.descB.split('\n').map((line, i) => (
                <span key={i}>{line}<br/></span>
              ))}</p>
              <div className="cpch-rules-box">
                <span className="cpch-rules-title">📋 计分</span>
                <div className="cpch-rules-content">{cp.scoringB.split('\n').map((ln, i) => (
                  <div key={i} className="cpch-rule-row">
                    <span className="cpchr-marker">🌱</span>
                    <span>{ln.replace(/^[·•\-\s]+/, '')}</span>
                  </div>
                ))}</div>
              </div>
            </button>
          </div>

          {choice && (
            <button className={`btn btn-lg btn-block cp-call-btn ${side}`} onClick={() => setNpcMode(true)}>
              🍄 呼唤森林守护者
            </button>
          )}
        </>
      ) : (
        <div className="npc-section">
          <div className="npc-banner">
            <span className="npcb-icon">🍄</span>
            <span>请将探险手册交给森林守护者</span>
          </div>

          <div className="npc-review">
            <div className="npcr-card">
              <div className={`npcc-header ${side}`}>{choice}</div>
              <div className="npcc-body">
                <div className="npccb-row">
                  <span className="npccb-label">旅人</span>
                  <span className="npccb-value">{guest.avatar} {guest.name}</span>
                </div>
                <div className="npccb-row">
                  <span className="npccb-label">印记</span>
                  <span className="npccb-value">🍄 {guest.phoneSuffix || '——'}</span>
                </div>
                <div className="npccb-row">
                  <span className="npccb-label">选择</span>
                  <span className="npccb-value">{choice}</span>
                </div>
                <div className="npccb-row">
                  <span className="npccb-label">表现</span>
                  <div className={`npc-score-btns ${side}`}>
                    {[1, 2, 3].map((s) => (
                      <button key={s}
                        className={`npc-sb${score === s ? ' sel' : ''}`}
                        onClick={() => setScore(s)}>
                        {Array(s).fill('🍄').join('')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="npc-auth">
            <input className="input" type="password" inputMode="numeric"
              placeholder="🔮 输入 4 位守护者咒语"
              value={npcPin}
              onChange={(e) => { setNpcPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setNpcError('') }}
              maxLength={4} autoComplete="off" />
            {npcError && <div className="cp-error">⚠ {npcError}</div>}
            <button className={`btn btn-lg btn-block cp-call-btn ${side}`} onClick={handleSave}>
              ✨ 刻录蘑菇之书
            </button>
            <button className="btn btn-outline btn-sm btn-block" style={{ marginTop: 10 }}
              onClick={() => { setNpcMode(false); setNpcPin(''); setNpcError('') }}>
              返回重新选择
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
