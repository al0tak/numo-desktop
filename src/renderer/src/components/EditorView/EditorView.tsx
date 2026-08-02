import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, PointerEvent } from 'react'
import { cx } from '../../lib/cx'
import styles from './EditorView.module.css'

export type EditorViewProps = ComponentPropsWithoutRef<'div'>

const MIN_SCALE = 0.1
const MAX_SCALE = 8

// Empty space left around the content when it is first fitted to the viewport.
const FIT_PADDING = 48

// Wheel deltas turn into a scale factor exponentially, so the same amount of
// finger travel zooms by the same ratio at every zoom level.
const ZOOM_SENSITIVITY = 0.01
// A trackpad pinch reports a few pixels per event; a mouse wheel notch reports
// a hundred or more, which would jump several zoom steps at once. Capping the
// delta gives the wheel a coarse-but-usable step without dulling the pinch.
const MAX_ZOOM_DELTA = 24

// Wheel deltas moved the plane one-for-one at first, which felt sluggish next
// to Figma. Applies to the two-finger scroll only — the hand tool drags the
// plane with the pointer and has to stay pinned to it.
const PAN_SPEED = 1.5

// Where the document sits in the viewport: `scale` pixels per document pixel,
// then `x`/`y` pixels from the viewport's top-left corner.
type Transform = { x: number; y: number; scale: number }

// The editor's canvas — an infinite plane, panned with a two-finger scroll or
// the space-held hand tool and zoomed under a fixed viewport. What sits on the
// plane is the caller's business: this component knows only how to move it.
//
// The plane is moved with a transform rather than by scrolling a large element:
// zoom has to stay anchored to the pointer, which is a property of the
// transform, and there are no scrollbars to keep in step at 8x zoom. Children
// are ordinary DOM under that transform, so clicks, focus and text selection
// land on them at any zoom without this component mapping any coordinates.
export function EditorView({ className, children, ...rest }: EditorViewProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const planeRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 })
  const isPlacedByUser = useRef(false)

  // The hand tool: held space arms it, a drag then pans. Two pieces of state
  // rather than one mode, because they overlap — letting go of space mid-drag
  // finishes the drag, it does not drop the document where it is.
  const [isHandArmed, setIsHandArmed] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragOrigin = useRef({ x: 0, y: 0 })

  // Keep the content fitted and centred until the user pans or zooms, after
  // which where it sits is their business and resizing must not move it.
  //
  // Driven by a ResizeObserver rather than measured once on mount: the viewport
  // has not necessarily reached its final size by the time the mount effect
  // runs, and a fit against a stale size leaves the content off screen.
  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const plane = planeRef.current
    if (!viewport || !plane) return

    // Both elements are observed: the viewport for the window changing size,
    // and the plane because the content it wraps is what the fit is computed
    // from — a page arriving, or a second one appearing beside it, has to
    // re-fit, and the plane is absolutely positioned, so its size never reaches
    // the viewport on its own. Sizes are read back off the elements rather than
    // from entry.contentRect, since either of the two can be what fired.
    const observer = new ResizeObserver(() => {
      if (isPlacedByUser.current) return

      const width = viewport.clientWidth
      const height = viewport.clientHeight
      // The plane shrink-wraps whatever it holds, and offset sizes are layout
      // sizes, which the transform does not touch. So this is the content's
      // extent in plane pixels — one page today, several side by side later,
      // without this fit needing to know which.
      const contentWidth = plane.offsetWidth
      const contentHeight = plane.offsetHeight
      if (width === 0 || height === 0 || contentWidth === 0 || contentHeight === 0) return

      const scale = clamp(
        Math.min((width - FIT_PADDING * 2) / contentWidth, (height - FIT_PADDING * 2) / contentHeight),
        MIN_SCALE,
        MAX_SCALE
      )

      setTransform({
        scale,
        x: (width - contentWidth * scale) / 2,
        y: (height - contentHeight * scale) / 2
      })
    })

    observer.observe(viewport)
    observer.observe(plane)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const handleWheel = (event: WheelEvent) => {
      // Registered by hand below rather than through onWheel, because React
      // attaches its wheel listener passively and every one of these events has
      // to be cancelled: otherwise Chromium turns the pinch into browser zoom
      // and the horizontal scroll into a back-navigation swipe.
      event.preventDefault()
      isPlacedByUser.current = true

      // The OS reports a trackpad pinch as a wheel event with a synthetic
      // ctrlKey; ⌘+scroll is the mouse equivalent of the same gesture.
      if (event.ctrlKey || event.metaKey) {
        const rect = viewport.getBoundingClientRect()
        const pointerX = event.clientX - rect.left
        const pointerY = event.clientY - rect.top
        const delta = clamp(event.deltaY, -MAX_ZOOM_DELTA, MAX_ZOOM_DELTA)

        setTransform((current) => {
          const scale = clamp(current.scale * Math.exp(-delta * ZOOM_SENSITIVITY), MIN_SCALE, MAX_SCALE)
          const ratio = scale / current.scale

          // Pin the document point under the pointer to the pointer, so zoom
          // grows outward from what is being pointed at.
          return {
            scale,
            x: pointerX - (pointerX - current.x) * ratio,
            y: pointerY - (pointerY - current.y) * ratio
          }
        })
        return
      }

      // Plain wheel and two-finger trackpad scroll pan the plane. Both axes come
      // straight from the event, so a diagonal swipe pans diagonally.
      setTransform((current) => ({
        ...current,
        x: current.x - event.deltaX * PAN_SPEED,
        y: current.y - event.deltaY * PAN_SPEED
      }))
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })
    return () => viewport.removeEventListener('wheel', handleWheel)
  }, [])

  // Space arms the hand tool, and only while the pointer is over the canvas —
  // the sidebar overlays this element without being inside it, so :hover is
  // already the "is the canvas what's under the pointer" answer.
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat) return
      if (!viewport.matches(':hover') || isTypingTarget(event.target)) return

      // Space scrolls the nearest scroll container otherwise.
      event.preventDefault()
      setIsHandArmed(true)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') setIsHandArmed(false)
    }

    // A window that loses focus mid-hold never delivers the keyup, which would
    // otherwise leave the hand armed for the next time the window comes back.
    const handleBlur = () => setIsHandArmed(false)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!isHandArmed || event.button !== 0) return

    // Captured so a drag that runs off the canvas — over the sidebar, or out of
    // the window — keeps panning until the button comes up.
    event.currentTarget.setPointerCapture(event.pointerId)
    dragOrigin.current = { x: event.clientX, y: event.clientY }
    isPlacedByUser.current = true
    setIsDragging(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return

    // Stepped from the previous position rather than from event.movementX,
    // which Chromium reports in physical pixels on a scaled display.
    const deltaX = event.clientX - dragOrigin.current.x
    const deltaY = event.clientY - dragOrigin.current.y
    dragOrigin.current = { x: event.clientX, y: event.clientY }

    setTransform((current) => ({ ...current, x: current.x + deltaX, y: current.y + deltaY }))
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return

    event.currentTarget.releasePointerCapture(event.pointerId)
    setIsDragging(false)
  }

  return (
    <div
      ref={viewportRef}
      className={cx(styles.viewport, isHandArmed && styles.handArmed, isDragging && styles.dragging, className)}
      {...rest}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        ref={planeRef}
        className={styles.plane}
        style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// Space belongs to whatever is being typed into, wherever that field lives —
// the keydown listener is on the window, so it sees the sidebar's fields too.
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}
