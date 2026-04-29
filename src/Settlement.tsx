import { useNavigate } from 'react-router-dom'
import { BRIDE_ATTRS, GROOM_ATTRS } from './types'
import { useGameState } from './App'
import './Settlement.css'

export default function Settlement() {
  const navigate = useNavigate()
  const state = useGameState()

  const totalBride = state.guests.reduce((s, g) => s + BRIDE_ATTRS.reduce((sum, id) => sum + (g.scores[id] ?? 0), 0), 0)
  const totalGroom = state.guests.reduce((s, g) => s + GROOM_ATTRS.reduce((sum, id) => sum + (g.scores[id] ?? 0), 0), 0)
  const brideWins = totalBride > totalGroom
  const isTie = totalBride === totalGroom
  const sorted = [...state.guests].sort((a, b) => b.totalPoints - a.totalPoints)

  return (
    <div className="page settlement-page">
      <button className="btn btn-outline btn-sm st-back" onClick={() => navigate('/lobby')}>
        ← 返回林地地图
      </button>

      <div className="st-header">
        <h2>🌙 蘑菇之书</h2>
      </div>

      <div className="st-tome">
        <div className="stt-crown">{isTie ? '👊' : brideWins ? '👰' : '🤵'}</div>
        <h3 className={`stt-winner ${isTie ? '' : brideWins ? 'bride' : 'groom'}`}>
          {isTie ? '🍄 双方阵营打成平手！' : brideWins ? '👰 新娘蘑菇阵营获胜！' : '🤵 新郎蘑菇阵营获胜！'}
        </h3>

        <div className="stt-scores">
          <div className="stt-team bride">
            <span className="sttt-icon">👰</span>
            <span className="sttt-label">新娘蘑菇</span>
            <span className="sttt-pts">{totalBride}</span>
          </div>
          <div className="stt-vs">
            <div className="stt-mush">🍄</div>
            <div className="stt-fist">👊</div>
          </div>
          <div className="stt-team groom">
            <span className="sttt-icon">🤵</span>
            <span className="sttt-label">新郎蘑菇</span>
            <span className="sttt-pts">{totalGroom}</span>
          </div>
        </div>

        <div className="stt-bless">
          <span className="sttb-icon">{isTie ? '🍄' : brideWins ? '👰' : '🤵'}</span>
          <span>{isTie ? '触发【蘑菇共鸣】：所有旅人共同分享双倍祝福✨' : brideWins ? '触发【稳稳的幸福】：每位旅人获得一份保底祝福礼' : '触发【最后赌一次】：旅人们获得的奖励将翻倍✨'}</span>
        </div>
      </div>

      <div className="st-ranks">
        <h3>🍄 蘑菇排行榜</h3>
        {sorted.length === 0 ? (
          <p className="str-empty">蘑菇森林中还没有旅人 🍂</p>
        ) : (
          <div className="str-list">
            {sorted.map((g, i) => (
              <div key={g.id} className={`str-item${i < 3 ? ' podium' : ''}`}>
                <span className={`stri-pos${i < 3 ? ` t${i + 1}` : ''}`}>
                  {i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <span className="stri-av">{g.avatar}</span>
                <span className="stri-name">
                  {g.name}
                  {g.phoneSuffix && <span className="stri-ph"> · {g.phoneSuffix}</span>}
                </span>
                <span className="stri-pts">{g.totalPoints} 🍄</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="st-actions">
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/')}>返回起点</button>
      </div>

      <div className="rule-guide">
        <h3><span className="emoji">🌟</span> 结算规则</h3>
        <div className="rule-detail">
          两边阵营的林地点位蘑菇总数比较，总分高的一方获胜。<br/>
          新娘支线得分 👰：沟通模式 + 审美品味 + 生活取向 = <strong>{totalBride} 🍄</strong><br/>
          新郎支线得分 🤵：执行力 + 人生态度 + 取舍博弈 = <strong>{totalGroom} 🍄</strong><br/><br/>
          {isTie ? '🍄 双方阵营打成平手 → 触发【蘑菇共鸣】：所有旅人共同分享双倍祝福✨' : (
            <>
              👰 <strong>新娘阵营获胜</strong> → 触发<strong>【稳稳的幸福】</strong>：每位旅人获得一份保底祝福礼<br/>
              🤵 <strong>新郎阵营获胜</strong> → 触发<strong>【最后赌一次】</strong>：旅人们获得的奖励翻倍<br/>
            </>
          )}<br/><br/>
          个人排行按蘑菇总数从高到低排序，与阵营胜负无关。
        </div>
      </div>
    </div>
  )
}
