import React, { useRef, useState, useCallback, useEffect } from 'react';

export interface GestureScrollState {
  isDragging: boolean;
  scrollProgress: number; // 0 to 100
  canScrollLeft: boolean;
  canScrollRight: boolean;
  hasOverflow: boolean;
}

export function useGesture<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T | null>(null);
  const [state, setState] = useState<GestureScrollState>({
    isDragging: false,
    scrollProgress: 0,
    canScrollLeft: false,
    canScrollRight: false,
    hasOverflow: false,
  });

  const dragData = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    rafId: 0,
  });

  const updateScrollMetrics = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = el.scrollLeft;
    const hasOverflow = maxScroll > 4;
    const progress = hasOverflow ? Math.min(100, Math.max(0, Math.round((current / maxScroll) * 100))) : 0;

    setState((prev) => {
      if (
        prev.scrollProgress === progress &&
        prev.canScrollLeft === current > 2 &&
        prev.canScrollRight === current < maxScroll - 2 &&
        prev.hasOverflow === hasOverflow
      ) {
        return prev;
      }
      return {
        ...prev,
        scrollProgress: progress,
        canScrollLeft: current > 2,
        canScrollRight: current < maxScroll - 2,
        hasOverflow,
      };
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    updateScrollMetrics();

    const resizeObserver = new ResizeObserver(() => {
      updateScrollMetrics();
    });
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
      if (dragData.current.rafId) {
        cancelAnimationFrame(dragData.current.rafId);
      }
    };
  }, [updateScrollMetrics]);

  const stopMomentum = () => {
    if (dragData.current.rafId) {
      cancelAnimationFrame(dragData.current.rafId);
      dragData.current.rafId = 0;
    }
  };

  const startMomentum = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const step = () => {
      if (Math.abs(dragData.current.velocity) < 0.25) {
        dragData.current.velocity = 0;
        updateScrollMetrics();
        return;
      }
      el.scrollLeft -= dragData.current.velocity * 16;
      dragData.current.velocity *= 0.92; // smooth friction decay
      updateScrollMetrics();
      dragData.current.rafId = requestAnimationFrame(step);
    };

    dragData.current.rafId = requestAnimationFrame(step);
  }, [updateScrollMetrics]);

  const onPointerDown = useCallback((e: React.PointerEvent<T>) => {
    const el = containerRef.current;
    if (!el) return;
    stopMomentum();

    dragData.current.isDown = true;
    dragData.current.startX = e.clientX;
    dragData.current.lastX = e.clientX;
    dragData.current.lastTime = performance.now();
    dragData.current.scrollLeft = el.scrollLeft;
    dragData.current.velocity = 0;

    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (!dragData.current.isDown) return;
      const el = containerRef.current;
      if (!el) return;

      const now = performance.now();
      const dt = Math.max(1, now - dragData.current.lastTime);
      const dx = e.clientX - dragData.current.lastX;

      dragData.current.velocity = dx / dt;
      dragData.current.lastX = e.clientX;
      dragData.current.lastTime = now;

      const walk = e.clientX - dragData.current.startX;
      el.scrollLeft = dragData.current.scrollLeft - walk;
      updateScrollMetrics();
    },
    [updateScrollMetrics]
  );

  const endDrag = useCallback(() => {
    if (!dragData.current.isDown) return;
    dragData.current.isDown = false;
    setState((prev) => ({ ...prev, isDragging: false }));
    startMomentum();
  }, [startMomentum]);

  const scrollByDelta = useCallback(
    (deltaPx: number) => {
      const el = containerRef.current;
      if (!el) return;
      stopMomentum();
      el.scrollBy({ left: deltaPx, behavior: 'smooth' });
      setTimeout(updateScrollMetrics, 220);
    },
    [updateScrollMetrics]
  );

  const scrollToPercent = useCallback(
    (percent: number) => {
      const el = containerRef.current;
      if (!el) return;
      stopMomentum();
      const maxScroll = el.scrollWidth - el.clientWidth;
      el.scrollLeft = (Math.min(100, Math.max(0, percent)) / 100) * maxScroll;
      updateScrollMetrics();
    },
    [updateScrollMetrics]
  );

  const bind = useCallback(
    () => ({
      ref: containerRef,
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerLeave: endDrag,
      onPointerCancel: endDrag,
      onScroll: updateScrollMetrics,
    }),
    [onPointerDown, onPointerMove, endDrag, updateScrollMetrics]
  );

  return {
    bind,
    containerRef,
    ...state,
    scrollByDelta,
    scrollToPercent,
    updateScrollMetrics,
  };
}
