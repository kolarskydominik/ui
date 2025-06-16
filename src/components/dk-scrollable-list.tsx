/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';

type DkScrollableListProps = {
  items: React.ReactNode;
  isDesktop?: boolean;
  fadeColor?: string;
  fadeSize?: number;
  gap?: number;
};

const DkScrollableList = ({
  items,
  isDesktop = true,
  fadeColor = 'rgba(0, 0, 0)',
  fadeSize = 40,
  gap = 16,
  ...props
}: DkScrollableListProps) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const updateArrows = () => {
      const list = listRef?.current;

      if (list) {
        const canScroll = list.scrollWidth > list.clientWidth; // Check if scrolling is needed
        setIsScrollable(canScroll);
        if (canScroll) {
          setCanScrollLeft(list.scrollLeft > gap);
          setCanScrollRight(
            list.scrollLeft < list.scrollWidth - list.clientWidth,
          );
        } else {
          setCanScrollLeft(false);
          setCanScrollRight(false);
        }
      }
    };

    updateArrows();
    listRef?.current?.addEventListener('scroll', updateArrows);

    return () => listRef?.current?.removeEventListener('scroll', updateArrows);
  }, [items]);

  //
  // const handleScrollOnNavigation = (direction: 'left' | 'right') => {
  //   const list = listRef?.current;
  //   if (list) {
  //     const scrollAmount = 150; // Adjust to match item width + gap
  //     list.scrollBy({
  //       left: direction === 'left' ? -scrollAmount : scrollAmount,
  //       behavior: 'smooth',
  //     });
  //   }
  // };

  const styles = `
      section[data-dk="dk-scrollable-list"] {
        position: relative;
        width: 100%;
        max-width: 100%;
        height: auto;
        overflow: hidden;

        --slide-spacing: ${gap}px;
      }

      div[data-dk="dk-scrollable-list-items"] {
        display: flex;
        gap: 0;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;

        /* Hide scrollbar for Chrome, Safari and Opera */
        &::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */

        & > * {
          scroll-snap-align: start;
          scroll-margin-left: 0px;
          margin-left: var(--slide-spacing);
        }
      }

      .dk-scrollable-list-fade {
        position: absolute;
        display: grid;
        align-items: center;
        padding-inline: 8px;
        inset-block: 0px;
        width: ${fadeSize}px;
        background: linear-gradient(90deg, ${fadeColor} 0%, rgba(0, 0, 0, 0) 100%);
        opacity: 1;
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
        pointer-events: none;

        &.left {
          left: 0;
        }

        &.right {
          right: 0;
          justify-items: end;
          transform: rotate(180deg);
        }
        &.hidden {
          opacity: 0;
        }
      }`;

  return (
    <>
      <style>{styles}</style>

      <section data-dk="dk-scrollable-list">
        <div ref={listRef} data-dk="dk-scrollable-list-items">
          {items}
        </div>

        {/* Fades */}
        {isScrollable && (
          <>
            <div
              className={`dk-scrollable-list-fade left ${!canScrollLeft ? 'hidden' : ''}`}
            />
            <div
              className={`dk-scrollable-list-fade right ${!canScrollRight ? 'hidden' : ''}`}
            />
          </>
        )}
      </section>
    </>
  );
};

export default DkScrollableList;
