import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { QrCode, X } from 'lucide-react'
import { siteUrl } from '../../app/metadata'

export function QrShare() {
  const [open, setOpen] = useState(false)
  const [svg, setSvg] = useState('')
  const { pathname } = useLocation()
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const url = `${siteUrl}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`

  useEffect(() => {
    if (!open) return
    let active = true
    import('qrcode')
      .then(({ toString }) =>
        toString(url, {
          type: 'svg',
          margin: 1,
          errorCorrectionLevel: 'M',
          color: { dark: '#1f2a23', light: '#ffffff' },
        }),
      )
      .then((markup) => active && setSvg(markup))
      .catch(() => active && setSvg(''))
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => {
      active = false
      document.removeEventListener('pointerdown', close)
    }
  }, [open, url])

  return (
    <div
      className="qr-share"
      ref={root}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false)
          button.current?.focus()
        }
      }}
    >
      <button
        ref={button}
        className="icon-button"
        aria-label={open ? 'QR 코드 닫기' : '주소 QR 코드 보기'}
        aria-expanded={open}
        aria-controls="qr-popover"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={19} /> : <QrCode size={19} />}
      </button>
      {open && (
        <div id="qr-popover" className="qr-popover" role="dialog" aria-label="페이지 주소 QR 코드">
          {svg ? (
            <div
              className="qr-image"
              role="img"
              aria-label={`${url} QR 코드`}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : (
            <div className="qr-image qr-loading" aria-hidden="true" />
          )}
          <p className="qr-url">{url.replace(/^https?:\/\//, '')}</p>
          <p className="qr-hint">휴대폰 카메라로 스캔하세요</p>
        </div>
      )}
    </div>
  )
}
