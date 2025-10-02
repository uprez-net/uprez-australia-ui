'use client';

import { cn } from '@/lib/utils';

import { Toolbar } from './toolbar';
import { useEffect, useRef } from 'react';

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      element.scrollLeft += e.deltaY;
    };

    const handleMouseEnter = () => {
      document.body.style.overflow = 'hidden';
      element.addEventListener('wheel', handleWheel, { passive: false });
    };

    const handleMouseLeave = () => {
      document.body.style.overflow = '';
      element.removeEventListener('wheel', handleWheel);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <Toolbar
      {...props}
      ref={scrollRef}
      className={cn(
        'sticky top-0 left-0 z-50 w-full justify-between overflow-x-auto overflow-y-hidden rounded-t-lg border-b border-b-border bg-background/95 p-1 backdrop-blur-sm supports-backdrop-blur:bg-background/60',
        // Custom scrollbar styles
        '[&::-webkit-scrollbar]:h-1.5',
        '[&::-webkit-scrollbar-track]:bg-transparent',
        '[&::-webkit-scrollbar-thumb]:bg-gray-400/30',
        '[&::-webkit-scrollbar-thumb]:rounded-full',
        '[&::-webkit-scrollbar-thumb]:hover:bg-gray-400/50',
        props.className
      )}
    />
  );
}
