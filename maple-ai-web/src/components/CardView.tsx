import { ExternalLink } from 'lucide-react'
import type { Card } from '../lib/api'

function SourceLine({ source }: { source: NonNullable<Card['source']> }) {
  const label = source.date ? `${source.label} · ${source.date}` : source.label
  return (
    <p className="card-source">
      출처:{' '}
      {source.url ? (
        <a href={source.url} target="_blank" rel="noopener noreferrer">
          {label} <ExternalLink size={12} aria-hidden />
        </a>
      ) : (
        label
      )}
    </p>
  )
}

export function CardView({ card }: { card: Card }) {
  return (
    <article className="card" aria-label={card.title}>
      <header className="card-head">
        {card.image && (
          <img className="card-image" src={card.image} alt={`${card.title} 캐릭터 이미지`} width={72} height={72} />
        )}
        <div>
          <h3>{card.title}</h3>
          {card.subtitle && <p className="card-subtitle">{card.subtitle}</p>}
        </div>
      </header>

      {card.fields && card.fields.length > 0 && (
        <dl className="card-fields">
          {card.fields.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {card.table && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {card.table.columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {card.table.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {card.items && (
        <ul className="card-items">
          {card.items.map((it, i) => (
            <li key={i}>
              {it.url ? (
                <a href={it.url} target="_blank" rel="noopener noreferrer" className="item-title">
                  {it.title} <ExternalLink size={12} aria-hidden />
                </a>
              ) : (
                <span className="item-title">{it.title}</span>
              )}
              {it.meta && <span className="item-meta">{it.meta}</span>}
              {it.text && <p className="item-text">{it.text}</p>}
            </li>
          ))}
        </ul>
      )}

      {card.note && <p className="card-note">{card.note}</p>}
      {card.source && <SourceLine source={card.source} />}
    </article>
  )
}
