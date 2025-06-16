/*
Created: Dom | 2025-06-16

Last updated: Dom | 2025-06-16

Description: Used for custom carousel list
*/

import {
    addPropertyControls,
    // @ts-ignore
    getPropertyControls,
    // @ts-ignore
    useQueryData,
    ControlType,
    RenderTarget,
} from "framer"
import { cloneElement, Children, useRef, CSSProperties } from "react"
import { motion } from "framer-motion"
import { getCollectionData } from "https://framer.com/m/CMSLibrary-09eo.js"

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 600
 * @framerIntrinsicHeight 400
 */

export default function CMSCarouselWrapper(props) {
    const {
        startLayers,
        endLayers,
        itemsPerView,
        itemsGap,
        isDesktop,
        fade,
        chevron,
        ...otherProps
    } = props
    console.log(props)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    const items = isCanvas
        ? []
        : getCollectionListItems(props.collectionList?.[0])

    // layers to display
    let layers = []

    if (startLayers) {
        layers = layers.concat(startLayers)
    }

    if (!isCanvas) {
        for (let i = 0; i < items.length; i++) {
            layers.push(items[i].props.children.props.children)
        }
    } else {
        for (let i = 0; i < itemsPerView + 1; i++) {
            layers.push(
                <CanvasPlaceholder
                    title="Run project to view carousel content"
                    subtitle="Collection List content is not accessible to the carousel component in the editor. Run your project or visit the live website to view the carousel with CMS content."
                    style={
                        !isDesktop && {
                            minWidth: 250,
                        }
                    }
                />
            )
        }
    }

    if (endLayers) {
        layers = layers.concat(endLayers)
    }

    const slots = layers.map((layer) => <div>{layer}</div>)

    if (isDesktop)
        return (
            <DkCarousel
                items={slots}
                perView={itemsPerView}
                gap={itemsGap}
                chevron={chevron}
            />
        )
    return (
        <DkScrollableList
            items={slots}
            gap={itemsGap}
            fadeColor={fade.fadeColor}
            fadeSize={fade.fadeSize}
        />
    )
}

CMSCarouselWrapper.displayName = "DK CMS Carousel Wrapper"

addPropertyControls(CMSCarouselWrapper, {
    collectionList: {
        type: ControlType.Slot,
    },
    startLayers: {
        type: ControlType.Slot,
        title: "Start",
    },
    endLayers: {
        type: ControlType.Slot,
        title: "End",
    },
    isDesktop: {
        type: ControlType.Enum,
        title: "Variant",
        description: "Desktop: Carousel \nMobile: Scrollable list",
        displaySegmentedControl: true,
        segmentedControlDirection: "vertical",
        options: [true, false],
        optionTitles: ["Desktop", "Mobile"],
        defaultValue: true,
    },
    itemsPerView: {
        type: ControlType.Number,
        title: "Items in view",
        defaultValue: 4,
        min: 1,
        max: 6,
        step: 1,
        displayStepper: true,
        preventLocalization: false,
    },
    itemsGap: {
        type: ControlType.Number,
        title: "Items gap",
        defaultValue: 16,
        min: 0,
        max: 64,
        step: 1,
        displayStepper: true,
        preventLocalization: false,
    },
    fade: {
        type: ControlType.Object,
        description: "Only for Mobile Variant",
        controls: {
            fadeColor: {
                type: ControlType.Color,
                title: "Fade/BG Color",
                defaultValue: "#0F1014",
                preventLocalization: false,
            },
            fadeSize: {
                type: ControlType.Number,
                defaultValue: 80,
                min: 0,
                step: 1,
                displayStepper: true,
                preventLocalization: false,
            },
        },
    },
    chevron: {
        type: ControlType.Object,
        description: "Only for Desktop Variant",
        controls: {
            show: {
                type: ControlType.Boolean,
                defaultValue: true,
            },
            size: {
                type: ControlType.Number,
                title: "Size",
                defaultValue: 44,
                min: 0,
                max: 100,
                step: 1,
                displayStepper: true,
                preventLocalization: false,
                hidden(props) {
                    return !props.show
                },
            },
            inlinePosition: {
                type: ControlType.Number,
                title: "Inline Inset Position",
                defaultValue: 0,
                min: -100,
                max: 100,
                step: 1,
                displayStepper: true,
                preventLocalization: false,
                hidden(props) {
                    return !props.show
                },
            },
            topPosition: {
                type: ControlType.String,
                title: "Top Position",
                description: "Need to includes unit (eg. 200px, 50%, ...",
                defaultValue: "50%",
                preventLocalization: false,
                hidden(props) {
                    return !props.show
                },
            },
        },
    },
})

type CanvasPlaceholderType = {
    title?: string
    subtitle?: string
    style?: CSSProperties
}

const CanvasPlaceholder = ({
    title,
    subtitle,
    style,
}: CanvasPlaceholderType) => {
    return (
        <div
            style={{
                display: "flex",
                width: "100%",
                height: "100%",
                placeContent: "center",
                placeItems: "center",
                flexDirection: "column",
                backgroundColor: "rgba(136, 85, 255, 0.1)",
                borderRadius: 6,
                border: "1px dashed rgb(136, 85, 255)",
                color: "rgb(136, 85, 255)",
                fontSize: 12,
                padding: 24,
                ...style,
            }}
        >
            <p
                style={{
                    margin: 0,
                    marginBottom: 10,
                    fontWeight: 600,
                    textAlign: "center",
                }}
            >
                {title}
            </p>
            <p
                style={{
                    margin: 0,
                    opacity: 0.7,
                    maxWidth: 500,
                    lineHeight: 1.5,
                    textAlign: "center",
                }}
            >
                {subtitle}
            </p>
        </div>
    )
}

function getCollectionListItems(collectionList) {
    const { query, childrenFunction } = getCollectionData(collectionList)

    if (query && childrenFunction) {
        const data = useQueryData(query)

        let children = []
        let clChildren = childrenFunction(data)
        if (Array.isArray(clChildren)) {
            children = clChildren
        } else if (Array.isArray(clChildren?.props?.children?.[0])) {
            children = clChildren.props.children[0]
        } else if (Array.isArray(clChildren?.props?.children)) {
            children = clChildren.props.children
        }

        if (children) {
            return Children.toArray(children)
        }
    }

    return []
}

// =================== Carousel
import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect, useState } from "react"

type DkCarouselProps = {
    perView: number
    gap: number
    chevron?: {
        show: boolean
        size: number
        inlinePosition: number
        topPosition: string
    }
    items: React.ReactNode
}

export const DkCarousel = ({
    perView = 4,
    gap = 16,
    items,
    chevron = {
        show: true,
        size: 44,
        inlinePosition: -22,
        topPosition: "50%",
    },
}: DkCarouselProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        slidesToScroll: perView,
        containScroll: "trimSnaps",
    })
    const [prevEnabled, setPrevEnabled] = useState(false)
    const [nextEnabled, setNextEnabled] = useState(false)

    const scrollPrev = useCallback(
        () => emblaApi && emblaApi.scrollPrev(),
        [emblaApi]
    )
    const scrollNext = useCallback(
        () => emblaApi && emblaApi.scrollNext(),
        [emblaApi]
    )

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setPrevEnabled(emblaApi.canScrollPrev())
        setNextEnabled(emblaApi.canScrollNext())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return

        onSelect()
        emblaApi.on("select", onSelect)

        return () => {
            emblaApi.off("select", onSelect)
        }
    }, [emblaApi, onSelect])

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
          background-color: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(3px);
        }

        &:disabled {
          visibility: hidden;
        }
      }`

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
                        display: chevron?.show ? "flex" : "none",
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
                        display: chevron?.show ? "flex" : "none",
                        top: chevron?.topPosition,
                        right: chevron?.inlinePosition,
                        width: chevron?.size,
                        height: chevron?.size,
                    }}
                >
                    <Chevron direction={"right"} />
                </button>
            </div>
        </>
    )
}

DkCarousel.displayName = "DK CMS Carousel"

const Chevron = ({
    direction = "left",
    size = 24,
    color = "currentColor",
    strokeWidth = 2,
    className = "",
}) => {
    const getPath = () => {
        switch (direction) {
            case "right":
                return "m9 18 6-6-6-6"
            case "up":
                return "m18 15-6-6-6 6"
            case "down":
                return "m6 9 6 6 6-6"
            case "left":
            default:
                return "m15 18-6-6 6-6"
        }
    }

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
    )
}

// ============= Scrollable List
type DkScrollableListProps = {
    items: React.ReactNode
    isDesktop?: boolean
    fadeColor?: string
    fadeSize?: number
    gap?: number
}

const DkScrollableList = ({
    items,
    isDesktop = true,
    fadeColor = "rgba(0, 0, 0)",
    fadeSize = 40,
    gap = 16,
    ...props
}: DkScrollableListProps) => {
    const listRef = useRef<HTMLDivElement | null>(null)
    const [isScrollable, setIsScrollable] = useState(false)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    useEffect(() => {
        const updateArrows = () => {
            const list = listRef?.current

            if (list) {
                const canScroll = list.scrollWidth > list.clientWidth // Check if scrolling is needed
                setIsScrollable(canScroll)
                if (canScroll) {
                    setCanScrollLeft(list.scrollLeft > gap)
                    setCanScrollRight(
                        list.scrollLeft < list.scrollWidth - list.clientWidth
                    )
                } else {
                    setCanScrollLeft(false)
                    setCanScrollRight(false)
                }
            }
        }

        updateArrows()
        listRef?.current?.addEventListener("scroll", updateArrows)

        return () =>
            listRef?.current?.removeEventListener("scroll", updateArrows)
    }, [items])

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
      }`

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
                            className={`dk-scrollable-list-fade left ${!canScrollLeft ? "hidden" : ""}`}
                        />
                        <div
                            className={`dk-scrollable-list-fade right ${!canScrollRight ? "hidden" : ""}`}
                        />
                    </>
                )}
            </section>
        </>
    )
}
