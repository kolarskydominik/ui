import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

type DkCarouselProps = {
  perView: number;
  gap: number;
  chevron?: {
    show: boolean;
    size: number;
    inlinePosition: number;
    topPosition: string;
  };
  items: React.ReactNode;
};

export const DkCarousel = ({
  perView = 4,
  gap = 16,
  items,
  chevron = {
    show: true,
    size: 44,
    inlinePosition: -22,
    topPosition: '50%',
  },
}: DkCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: perView,
    containScroll: 'trimSnaps',
  });
  const [prevEnabled, setPrevEnabled] = useState(false);
  const [nextEnabled, setNextEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevEnabled(emblaApi.canScrollPrev());
    setNextEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const styles = `
      [data-dk="dk-carousel"] {
        position: relative;
        width: 100%;

        --slide-size: calc(100% / ${perView});
        --slide-spacing: ${gap}px;
      }

      [data-dk="dk-carousel-viewport"] {
        width: 100%;
        overflow: hidden;
      }

      [data-dk="dk-carousel-slides"] {
        backface-visibility: hidden;
        display: flex;
        touch-action: pan-y pinch-zoom;
        margin-left: calc(var(--slide-spacing) * -1);
      }

      [data-dk="dk-carousel-slides"] > * {
        min-width: 0;
        flex: 0 0 var(--slide-size);
        padding-left: var(--slide-spacing);
      }

      [data-dk="dk-carousel-slides"] > * > *,
      [data-dk="dk-carousel-slides"] > * > * > *,
      [data-dk="dk-carousel-slides"] > * > * > * > * {
        width: 100% !important;
        height: 100%;
      }

      [data-dk="dk-carousel-button"] {
        all: unset;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: black;
        background-color: white;
        border: none;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease-in-out;

        &:hover {
          background-color: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(3px);
        }

        &:disabled {
          visibility: hidden;
        }
      }`;

  return (
    <>
      <style>{styles}</style>
      <div data-dk="dk-carousel" className="backdrop-blur-lg">
        <div
          ref={emblaRef}
          data-dk="dk-carousel-viewport"
          data-per-view={perView}
        >
          <div data-dk="dk-carousel-slides">{items}</div>
        </div>

        {/* Navigation buttons */}
        <button
          title="Previous"
          data-dk="dk-carousel-button"
          onClick={scrollPrev}
          disabled={!prevEnabled}
          style={{
            display: chevron?.show ? 'flex' : 'none',
            top: chevron?.topPosition,
            left: chevron?.inlinePosition,
            width: chevron?.size,
            height: chevron?.size,
          }}
        >
          <Chevron />
        </button>
        <button
          title="Next"
          data-dk="dk-carousel-button"
          onClick={scrollNext}
          disabled={!nextEnabled}
          style={{
            display: chevron?.show ? 'flex' : 'none',
            top: chevron?.topPosition,
            right: chevron?.inlinePosition,
            width: chevron?.size,
            height: chevron?.size,
          }}
        >
          <Chevron direction={'right'} />
        </button>
      </div>
    </>
  );
};

DkCarousel.displayName = 'DK CMS Carousel';

const Chevron = ({
  direction = 'left',
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
}) => {
  const getPath = () => {
    switch (direction) {
      case 'right':
        return 'm9 18 6-6-6-6';
      case 'up':
        return 'm18 15-6-6-6 6';
      case 'down':
        return 'm6 9 6 6 6-6';
      case 'left':
      default:
        return 'm15 18-6-6 6-6';
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={getPath()} />
    </svg>
  );
};
