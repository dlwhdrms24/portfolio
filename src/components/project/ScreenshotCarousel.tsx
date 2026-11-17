import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProjectImage } from '../../types'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** 실제 서비스 화면을 한 장씩 옆으로 넘겨 보는 캐러셀. 터치 스와이프·버튼·점·방향키를 지원한다. */
export function ScreenshotCarousel({ images, label }: { images: ProjectImage[]; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const count = images.length

  const goTo = useCallback(
    (next: number) => {
      const target = Math.max(0, Math.min(count - 1, next))
      setIndex(target)
      const track = trackRef.current
      if (track && typeof track.scrollTo === 'function') {
        track.scrollTo({
          left: target * track.clientWidth,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        })
      }
    },
    [count],
  )

  // 스와이프·트랙패드로 넘긴 경우에도 현재 위치를 맞춘다.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (track.clientWidth > 0) setIndex(Math.round(track.scrollLeft / track.clientWidth))
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener('scroll', onScroll)
    }
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(index - 1)
    }
  }

  return (
    <div
      className="screenshot-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="screenshot-carousel-viewport">
        <div
          className="screenshot-carousel-track"
          ref={trackRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-label={`${label} — 방향키나 스와이프로 넘기기`}
        >
          {images.map((image, i) => (
            <figure
              key={image.src}
              className="screenshot-carousel-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
              aria-hidden={i !== index}
            >
              <div className="screenshot-carousel-frame">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                />
              </div>
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          ))}
        </div>
        {count > 1 && (
          <>
            <button
              type="button"
              className="screenshot-carousel-nav prev"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="이전 화면"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="screenshot-carousel-nav next"
              onClick={() => goTo(index + 1)}
              disabled={index === count - 1}
              aria-label="다음 화면"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="screenshot-carousel-controls">
          <span className="screenshot-carousel-count" aria-live="polite">
            {index + 1} / {count}
          </span>
          <div className="screenshot-carousel-dots">
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                className={i === index ? 'active' : undefined}
                onClick={() => goTo(i)}
                aria-label={`${i + 1}번째 화면 보기${image.caption ? `: ${image.caption}` : ''}`}
                aria-current={i === index ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
