import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Phase } from './types'
import { BRIDE_ATTRS, GROOM_ATTRS, NPC_PASSWORD } from './types'
import { CHECKPOINTS } from './data'
import { removeGuest as removeGuestFn } from './state'
import { useGameState, getGameState, setGameState } from './App'
import './Admin.css'

export default function Admin() {
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)
  const [removeId, setRemoveId] = useState<string | null>(null)
  const state = useGameState()

  const phases: { key: Phase; label: string; emoji: string; desc: string }[] = [
    { key: 'checkin', emoji: '🍄', label: '签到准备', desc: '旅人可在蘑菇上刻下名字，进入林地' },
    { key: 'playing', emoji: '🪲', label: '探索林地', desc: '开启 6 块林地的挑战，NPC 可以录分' },
    { key: 'settled', emoji: '🌙', label: '夜幕降临', desc: '蘑菇之书封印，禁止修改，品读旅程' },
  ]

  const handlePhaseChange = (p: Phase) => setGameState({ ...getGameState(), phase: p })
  const handleRemoveGuest = (id: string) => { setGameState(removeGuestFn(getGameState(), id)); setRemoveId(null) }
  const handleReset = () => { setGameState({ phase: 'checkin', guests: [], currentGuestId: null }); setConfirmReset(false); navigate('/') }

  const totalBride = state.guests.reduce((s, g) => s + BRIDE_ATTRS.reduce((sum, id) => sum + (g.scores[id] ?? 0), 0), 0)
  const totalGroom = state.guests.reduce((s, g) => s + GROOM_ATTRS.reduce((sum, id) => sum + (g.scores[id] ?? 0), 0), 0)

  return (
    <div className="page admin-page">
      <button className="btn btn-outline btn-sm adm-back" onClick={() => navigate('/lobby')}>← 返回林地地图</button>

      <div className="adm-header">
        <h2>🗝 森林守护者后台</h2>
        <p className="adm-sub">掌控蘑菇森林的魔法节奏</p>
      </div>

      <div className="adm-card">
        <h3>🔮 守护者咒语（录分密码）</h3>
        <div className="adm-spell">
          <span className="adms-label">所有林地通用</span>
          <span className="adms-value">{NPC_PASSWORD}</span>
        </div>
      </div>

      <div className="adm-card">
        <h3>🌿 森林阶段</h3>
        <div className="adm-phases">
          {phases.map((p) => (
            <button key={p.key} className={`adm-pb${state.phase === p.key ? ' live' : ''}`} onClick={() => handlePhaseChange(p.key)}>
              <span className="apb-emoji">{p.emoji}</span>
              <div>
                <span className="apb-label">{p.label}</span>
                <span className="apb-desc">{p.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="adm-card">
        <h3>🍄 森林数据</h3>
        <div className="adm-stats">
          <div className="adm-stat"><span className="as-v">{state.guests.length}</span><span className="as-l">旅人</span></div>
          <div className="adm-stat bs"><span className="as-v">{totalBride}</span><span className="as-l">👰 新娘蘑菇</span></div>
          <div className="adm-stat gs"><span className="as-v">{totalGroom}</span><span className="as-l">🤵 新郎蘑菇</span></div>
        </div>
      </div>

      <div className="adm-card">
        <h3>🦊 旅人名册 ({state.guests.length})</h3>
        {state.guests.length === 0 ? (
          <p className="adm-empty">森林中还没有旅人到来 🍄</p>
        ) : (
          <div className="adm-list">
            {[...state.guests].sort((a, b) => b.totalPoints - a.totalPoints).map((g) => {
              const done = Object.keys(g.scores).length
              return (
                <div key={g.id} className="adm-item">
                  <span className="ami-av">{g.avatar}</span>
                  <div className="ami-info">
                    <span className="ami-name">{g.name}{g.phoneSuffix && <span className="ami-ph"> · {g.phoneSuffix}</span>}</span>
                    <span className="ami-meta">{g.totalPoints} 分 · {done}/{CHECKPOINTS.length} 林地</span>
                  </div>
                  {removeId === g.id ? (
                    <div className="ami-rmc">
                      <span>驱散 {g.name} ？</span>
                      <span>
                        <button className="btn btn-primary btn-sm" onClick={() => handleRemoveGuest(g.id)}>确认</button>
                        <button className="btn btn-outline btn-sm" onClick={() => setRemoveId(null)} style={{ marginLeft: 6 }}>取消</button>
                      </span>
                    </div>
                  ) : (
                    <button className="btn btn-outline btn-sm" onClick={() => setRemoveId(g.id)}>驱散</button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="adm-card adm-danger">
        <h3>⚠ 黑暗魔法</h3>
        {!confirmReset ? (
          <button className="btn btn-outline btn-sm" style={{ borderColor: 'var(--red)', color: 'var(--red)' }}
            onClick={() => setConfirmReset(true)}>焚毁蘑菇之书</button>
        ) : (
          <div className="adm-reset">
            <p>此咒语将清除所有旅人足迹与蘑菇印记，不可逆转！</p>
            <span>
              <button className="btn btn-primary btn-sm" onClick={handleReset}>确认焚毁</button>
              <button className="btn btn-outline btn-sm" onClick={() => setConfirmReset(false)} style={{ marginLeft: 6 }}>取消</button>
            </span>
          </div>
        )}
      </div>

      <div className="rule-guide">
        <h3><span className="emoji">🗝</span> 守护者操作指南</h3>
        <div className="rule-detail">
          <strong>阶段切换：</strong><br/>
          签到准备 → 旅人可在首页刻字入林<br/>
          游园活动 → NPC 可录入分数，旅人可自由挑战<br/>
          结算完毕 → 锁定全部数据，不可再改分<br/><br/>
          <strong>录分流程：</strong><br/>
          旅人选好 A/B 支线并完成挑战后，点击"呼唤森林守护者"，进入 NPC 模式。<br/>
          守护者在手机或平板上选择 1~3 分，输入密码 <strong>{NPC_PASSWORD}</strong> 即可录分。<br/>
          密码统一，所有林地通用，建议印在小卡片上分发给各点位 NPC。
        </div>
      </div>
    </div>
  )
}
