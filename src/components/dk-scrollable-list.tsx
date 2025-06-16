/* eslint-disable @typescript-eslint/no-unused-vars */
import { type CSSProperties, useEffect, useRef, useState } from 'react';
// .list-container {
//   position: relative;
//   width: 100%;
//   max-width: 100%;
//   height: auto;
//   overflow: hidden;
// }

// /* Snap-align each direct child of the inner wrapper */
// .list-container > div > * {
//   scroll-snap-align: start;
//   scroll-margin-left: 20px;
// }

// .list {
//   padding-inline: 8px;
//   display: flex;
//   gap: 0;
//   overflow-x: scroll;
//   scroll-snap-type: x mandatory;
//   -webkit-overflow-scrolling: touch;
//   scrollbar-width: none;
// }

// /* Hide default scrollbar in WebKit browsers */
// .list::-webkit-scrollbar {
//   display: none;
// }
const ListContainer = styled('div', {
  position: 'relative',
  width: '100%',
  maxWidth: '100%',
  height: 'auto',
  overflow: 'hidden',
  '&>div>*': {
    scrollSnapAlign: 'start',
    scrollMarginLeft: 20,
  },
});

const listStyle: CSSProperties = {
  paddingInline: 8,
  display: 'flex',
  gap: 0,
  overflowX: 'scroll',
  scrollSnapType: 'x mandatory',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
};

const ScrollButton = ({
  fadeColor,
  direction,
  isDisabled,
  isVisible,
  onClick,
}: {
  fadeColor: string;
  direction: 'left' | 'right';
  isDisabled: boolean;
  isVisible: boolean;
  onClick: (direction: 'left' | 'right') => void;
}) => {
  const Wrapper = styled('div', {
    position: 'absolute',
    display: 'grid',
    alignItems: 'center',
    paddingInline: 8,
    insetBlock: 0,
    width: '5rem',
    background: `linear-gradient(90deg, ${fadeColor} 0%, rgba(0,0,0,0) 100%)`,

    opacity: 1,
    transitionProperty: 'all',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '300ms',
    pointerEvents: isVisible ? 'auto' : 'none',

    '&.left': {
      left: 0,
    },
    '&.right': {
      right: 0,
      justifyItems: 'end',
      transform: 'rotate(180deg)',
    },
    '&.hidden': {
      opacity: 0,
    },
  });

  const Button = styled('button', {
    display: 'grid',
    placeContent: 'center',
    width: '3rem',
    height: '3rem',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    background: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(8px)',
    borderRadius: '4rem',
    color: 'white',
    border: 'none',
    padding: 10,
    cursor: 'pointer',
    zIndex: 10,
    fontSize: '2rem',
    '&.hidden': {
      opacity: 0,
    },
  });

  return (
    <Wrapper className={`${direction} ${isDisabled && 'hidden'}`}>
      <Button
        type="button"
        name={`scroll-${direction}`}
        onClick={() => onClick(direction)}
        disabled={isDisabled}
        className={!isVisible && 'hidden'}
      >
        <Chevron size={28} strokeWidth={2} />
      </Button>
    </Wrapper>
  );
};

type DkScrollableListProps = {
  cmsCollection?: React.ReactNode;
  isDesktop: boolean;
  fadeColor: string;
  itemsSpacing: number;
};

const DkScrollableList = ({
  cmsCollection = null,
  isDesktop = true,
  fadeColor = 'black',
  itemsSpacing = 0,
  ...props
}: DkScrollableListProps) => {
  const listRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const isConnectedToCMS =
    !!Array.isArray(cmsCollection) && cmsCollection.length > 0;
  const showButtons = isDesktop;

  useEffect(() => {
    const updateArrows = () => {
      const list = listRef?.current;

      if (list) {
        const canScroll = list.scrollWidth > list.clientWidth; // Check if scrolling is needed
        setIsScrollable(canScroll);
        if (canScroll) {
          setCanScrollLeft(list.scrollLeft > 0);
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
  }, [cmsCollection]);

  const handleScroll = (direction) => {
    const list = listRef?.current;
    if (list) {
      const scrollAmount = 150; // Adjust to match item width + gap
      list.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <ListContainer>
      {/* Items */}
      {React.cloneElement(cmsCollection[0], {
        ref: listRef,
        style: { ...listStyle, paddingInline: inlinePadding },
        className: '', // this is important
      })}

      {/* Buttons */}
      {isScrollable && (
        <>
          <ScrollButton
            direction={'left'}
            onClick={handleScroll}
            isDisabled={!canScrollLeft}
            isVisible={isDesktop}
            fadeColor={fadeColor}
          />
          <ScrollButton
            direction={'right'}
            onClick={handleScroll}
            isDisabled={!canScrollRight}
            isVisible={isDesktop}
            fadeColor={fadeColor}
          />
        </>
      )}
    </ListContainer>
  );
};

export default DkScrollableList;
