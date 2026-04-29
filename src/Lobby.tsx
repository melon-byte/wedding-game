import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BRIDE_ATTRS, GROOM_ATTRS } from './types'
import { CHECKPOINTS } from './data'
import { useGameState, setGameState, getGameState } from './App'
import './Lobby.css'

export default function Lobby() {
  const navigate = useNavigate()
  const state = useGameState()
  const guest = state.guests.find((g) => g.id === state.currentGuestId)

  useEffect(() => {
    if (!guest) navigate('/')
  }, [guest, navigate])

  if (!guest) return null

  const completed = Object.keys(guest.scores).length
  const brideScore = BRIDE_ATTRS.reduce((s, id) => s + (guest.scores[id] ?? 0), 0)
  const groomScore = GROOM_ATTRS.reduce((s, id) => s + (guest.scores[id] ?? 0), 0)

  const phaseLabel = state.phase === 'checkin' ? '🍄 签到准备'
    : state.phase === 'playing' ? '🪲 探索林地'
    : '🌙 夜幕降临'

  const renderCp = (column: 'bride' | 'groom', cid: string) => {
    const cp = CHECKPOINTS.find((c) => c.id === cid)!
    const done = cid in guest.scores
    const iconMap: Record<string, string> = {
      communication: '🦋', aesthetic: '🌸', lifestyle: '🌱',
      execution: '🦉', attitude: '🐗', choice: '🦌',
    }
    return (
      <button key={cp.id}
        className={`lobby-cp ${column}-cp${done ? ' done' : ''}`}
        onClick={() => navigate(`/checkpoint/${cp.id}`)}
        disabled={state.phase === 'settled'}
      >
        <span className="lcp-icon">{iconMap[cp.id]}</span>
        <span className="lcp-body">
          <span className="lcp-title">{cp.title}</span>
          <span className="lcp-sub">{cp.subtitle.split('\n').map((line, i) => (
            <span key={i}>{line}<br/></span>
          ))}</span>
        </span>
        {done && (
          <span className={`lcp-score ${column}-done-badge`}>{guest.scores[cid]}🍄</span>
        )}
      </button>
    )
  }

  return (
    <div className="page lobby-page">
      <div className="lobby-header">
        <div className="lobby-phase">{phaseLabel}</div>
        <div className="lobby-card">
          <div className="lobby-avatar">{guest.avatar}</div>
          <div className="lobby-info">
            <span className="lobby-name">{guest.name}</span>
            {guest.phoneSuffix && <span className="lobby-phone">🍄 尾号 {guest.phoneSuffix}</span>}
            <span className="lobby-score">{guest.totalPoints} 🍄 · {completed}/6 块林地</span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/')}>变换</button>
        </div>
      </div>

      {state.guests.length > 1 && (
        <div className="lobby-switch">
          <span className="lsw-label">🦊 伙伴们：</span>
          {state.guests.filter((g) => g.id !== state.currentGuestId).map((g) => (
            <button key={g.id} className="lsw-btn"
              onClick={() => setGameState({ ...getGameState(), currentGuestId: g.id })}
              title={`${g.name}${g.phoneSuffix ? ` (${g.phoneSuffix})` : ''}`}
            >{g.avatar}</button>
          ))}
        </div>
      )}

      <div className="lobby-compass">
        <div className="lcomp-side bride">
          <span className="lcomp-icon">👰</span>
          <span className="lcomp-label">新娘蘑菇</span>
          <span className="lcomp-val">{brideScore}</span>
        </div>
        <div className="lcomp-mid">
          <div className="lcomp-mush">🍄</div>
          <div className="lcomp-vs">👊</div>
        </div>
        <div className="lcomp-side groom">
          <span className="lcomp-icon">🤵</span>
          <span className="lcomp-label">新郎蘑菇</span>
          <span className="lcomp-val">{groomScore}</span>
        </div>
      </div>

      <div className="lobby-grid">
        <div className="lcol-header bride-hdr">👰 新娘支线</div>
        <div className="lcol-header groom-hdr">🤵 新郎支线</div>
        {BRIDE_ATTRS.map((cid, i) => (
          <>
            {renderCp('bride', cid)}
            {renderCp('groom', GROOM_ATTRS[i])}
          </>
        ))}
      </div>

      <div className="lobby-actions">
        {(state.phase !== 'settled') && (
          <button className="btn btn-gold btn-block" onClick={() => navigate('/settlement')}>
            🌟 查看蘑菇收集结果
          </button>
        )}
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin')}>
          🗝 森林守护者后台
        </button>
      </div>

      <div className="rule-guide">
        <h3><span className="emoji">🍄</span> 林地探索规则</h3>
        <div className="rule-steps">
          <div className="rule-step">
            <div className="rule-step-num">1</div>
            <div className="rule-step-title">入林</div>
            <div className="rule-step-desc">进入一块林地<br/>了解该主题</div>
          </div>
          <div className="rule-arrow">→</div>
          <div className="rule-step">
            <div className="rule-step-num">2</div>
            <div className="rule-step-title">抉择</div>
            <div className="rule-step-desc">A / B 二选一<br/>站队性格支线</div>
          </div>
          <div className="rule-arrow">→</div>
          <div className="rule-step">
            <div className="rule-step-num">3</div>
            <div className="rule-step-title">挑战</div>
            <div className="rule-step-desc">完成具体任务<br/>呼唤守护者</div>
          </div>
          <div className="rule-arrow">→</div>
          <div className="rule-step">
            <div className="rule-step-num">4</div>
            <div className="rule-step-title">评分</div>
            <div className="rule-step-desc">NPC 根据表现<br/>打入 1~3 🍄</div>
          </div>
        </div>
        <div className="rule-detail">
          👰<strong>新娘支线</strong>（左侧 3 块林地）：沟通模式 / 审美品味 / 生活取向<br/>
          🤵<strong>新郎支线</strong>（右侧 3 块林地）：执行力 / 人生态度 / 取舍博弈<br/>
          每位旅人每块林地必须且只能完成 1 次（选 A 或 B 其一）。<br/>
          前 5 块为<strong>个人挑战</strong>（1~2 min），最后 1 块为<strong>团队挑战</strong>（约 10 min，需凑 5~6 人）。<br/>
          记住你的站队！结算时两侧蘑菇总数将决定最终祝福。
        </div>
      </div>
    </div>
  )
}
