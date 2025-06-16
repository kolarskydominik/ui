/*
Created: Dom | 2025-06-02

Last updated: Dom | 2025-06-02

Description: Used for custom carousel list
*/

import React, {
    CSSProperties,
    useRef,
    useState,
    useEffect,
    Children,
    useCallback,
} from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

import useEmblaCarousel from "embla-carousel-react"
import { styled } from "@stitches/react"

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/components/auto-sizing
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */

export default function HOC_ListCarousel(props) {
    const {
        cmsCollection,
        isDesktop,
        perView,
        fadeColor,
        inlinePadding,
        chevron,
        ...otherProps
    } = props
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const isConnectedToCMS = !!cmsCollection[0]

    const items = isConnectedToCMS
        ? React.cloneElement(cmsCollection[0], {
              className: "dk-carousel-slides", // IMPORTANT: for CSS
          })
        : null

    if (items && isCanvas) return <IsCanvasUI />
    else if (items && isDesktop)
        return (
            <ListCarousel
                perView={perView}
                inlinePadding={inlinePadding}
                chevron={chevron}
            >
                {items}
            </ListCarousel>
        )
    else if (items && !isDesktop)
        return (
            <ScrollableCollectionList
                inlinePadding={inlinePadding}
                cmsCollection={cmsCollection}
                isDesktop={isDesktop}
                fadeColor={fadeColor}
            />
        )
    else <EmptyListState />
}

addPropertyControls(HOC_ListCarousel, {
    isDesktop: {
        type: ControlType.Enum,
        title: "Breakpoint Variant",
        description: "Desktop: default 4 cards \nMobile: Scrollable list",
        displaySegmentedControl: true,
        segmentedControlDirection: "vertical",
        options: [true, false],
        optionTitles: ["Desktop", "Mobile"],
        defaultValue: true,
    },
    cmsCollection: {
        type: ControlType.Slot,
        title: "CMS Collection List",
    },
    perView: {
        type: ControlType.Number,
        title: "Items per view",
        defaultValue: 4,
        min: 1,
        max: 6,
        step: 1,
        displayStepper: true,
        preventLocalization: false,
    },
    fadeColor: {
        type: ControlType.Color,
        title: "Background color",
        description:
            "Set this so that the fades are the same color as the background",
        defaultValue: "rgb(18,18,18)",
    },
    inlinePadding: {
        type: ControlType.Number,
        title: "Inline Padding of Desktop",
        defaultValue: 24,
        min: 0,
        max: 100,
        step: 1,
        displayStepper: true,
        preventLocalization: false,
    },
    chevron: {
        type: ControlType.Object,
        controls: {
            size: {
                type: ControlType.Number,
                title: "Size",
                defaultValue: 44,
                min: 0,
                max: 100,
                step: 1,
                displayStepper: true,
                preventLocalization: false,
            },
            inlinePosition: {
                type: ControlType.Number,
                title: "Inline Inset Position",
                defaultValue: 8,
                min: 0,
                max: 100,
                step: 1,
                displayStepper: true,
                preventLocalization: false,
            },
            topPosition: {
                type: ControlType.String,
                title: "Top Position",
                description: "Need to includes unit (eg. 200px, 50%, ...",
                defaultValue: "200px",
                preventLocalization: false,
            },
        },
    },
})

// DESKTOP VARIANT
export const ListCarousel = ({ perView, inlinePadding, children, chevron }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        slidesToScroll: perView,
        containScroll: "trimSnaps",
    })
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

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
        setPrevBtnEnabled(emblaApi.canScrollPrev())
        setNextBtnEnabled(emblaApi.canScrollNext())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return

        onSelect()
        emblaApi.on("select", onSelect)

        return () => {
            emblaApi.off("select", onSelect)
        }
    }, [emblaApi, onSelect])

    return (
        <ListCarouselContainer
            className="dk-carousel-container"
            css={{ paddingInline: inlinePadding }}
        >
            <ListCarouselViewport
                ref={emblaRef}
                className="dk-carousel-viewport"
                perView={perView}
            >
                {children}
            </ListCarouselViewport>

            {/* Navigation buttons */}
            <PrevButton
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
                css={{
                    top: chevron.topPosition,
                    left: chevron.inlinePosition,
                    width: chevron.size,
                    height: chevron.size,
                }}
            >
                <Chevron />
            </PrevButton>
            <NextButton
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
                css={{
                    top: chevron.topPosition,
                    right: chevron.inlinePosition,
                    width: chevron.size,
                    height: chevron.size,
                }}
            >
                <Chevron direction={"right"} />
            </NextButton>
        </ListCarouselContainer>
    )
}
ListCarousel.displayName = "ListCarousel"

// =============================== Styled components
const ListCarouselContainer = styled("div", {
    position: "relative",
    width: "100%",
    paddingInline: 24,
    //maxWidth: 1040, // Set the maximum width of the carousel
})

const ListCarouselViewport = styled("div", {
    width: "100%",
    overflow: "hidden", // IMPORTANT: need to be hidden to work
    "& .dk-carousel-slides": {
        width: "100% !important",
        display: "flex",
        // IMPORTANT: this dictate styles for each item
        "&>*": {
            position: "relative",
            flexShrink: "0",
            width: "25% !important", //IMPORTANT:
            //padding: 8,

            "&>*, &>*>*": {
                width: "100% !important",
            },
        },
    },

    variants: {
        perView: {
            2: {
                "& .dk-carousel-slides>*": {
                    width: "50% !important",
                },
            },
            3: {
                "& .dk-carousel-slides>*": {
                    width: "calc(100%/3) !important",
                },
            },
            4: {
                "& .dk-carousel-slides>*": {
                    width: "25% !important",
                },
            },
            5: {
                "& .dk-carousel-slides>*": {
                    width: "20% !important",
                },
            },
            6: {
                "& .dk-carousel-slides>*": {
                    width: "calc(100%/6) !important",
                },
            },
        },
    },
})

const Button = styled("button", {
    position: "absolute",
    top: 200,
    transform: "translateY(-50%)",
    color: "black",
    backgroundColor: "white",
    border: "none",
    borderRadius: "50%",
    width: 44,
    height: 44,
    aspectRatio: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    "&:disabled": {
        visibility: "hidden",
        cursor: "not-allowed",
    },
    "&:hover:not(:disabled)": {
        backgroundColor: "rgba(255,255,255,0.8)",
    },
})

const PrevButton = styled(Button, {
    left: 8,
})

const NextButton = styled(Button, {
    right: 8,
})

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

// =============================== EmptyListState
const Wrapper = styled("div", {
    display: "flex",
    flexDirection: "column",
    minWidth: "100%",
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    color: "rgb(153, 102, 255)",
    background: "rgba(136, 85, 255, 0.1)",
    padding: "20px 20px 30px",
})

const Title = styled("p", {
    fontWeight: 600,
    textAlign: "center",
})

const SubTitle = styled("p", {
    margin: 0,
    opacity: 0.7,
    maxWidth: 130,
    linHeight: 1.5,
    textAlign: "center",
})

const EmptyListState = () => {
    return (
        <Wrapper>
            <div style={{ fontSize: "2rem" }}>✨</div>
            <Title>Connect to Content</Title>
            <SubTitle>Add CMS Collection to swipe between.</SubTitle>
        </Wrapper>
    )
}

// =============================== EmptyListState
function IsCanvasUI() {
    return (
        <Wrapper>
            <div style={{ fontSize: "2rem" }}>✨</div>
            <Title>Run project to view carousel content</Title>
            <SubTitle style={{ maxWidth: 600 }}>
                Collection List content is not accessible to the carousel
                component in the editor. Run your project or visit the live
                website to view the carousel with CMS content.
            </SubTitle>
        </Wrapper>
    )
}

// =============================== EmptyListState
const ScrollableCollectionList = ({
    cmsCollection,
    isDesktop,
    fadeColor,
    inlinePadding,
    ...props
}) => {
    const listRef = useRef(null)
    const [isScrollable, setIsScrollable] = useState(false)

    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const isConnectedToCMS = !!cmsCollection[0]
    //const isComponentList = !!componentList[0]

    useEffect(() => {
        const updateArrows = () => {
            const list = listRef?.current
            if (list) {
                const canScroll = list.scrollWidth > list.clientWidth // Check if scrolling is needed
                setIsScrollable(canScroll)
                if (canScroll) {
                    setCanScrollLeft(list.scrollLeft > 0)
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
    }, [cmsCollection])

    const handleScroll = (direction) => {
        const list = listRef?.current
        if (list) {
            const scrollAmount = 150 // Adjust to match item width + gap
            list.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            })
        }
    }

    return (
        <ListContainer>
            {/* Items */}
            {React.cloneElement(cmsCollection[0], {
                ref: listRef,
                style: { ...listStyle, paddingInline: inlinePadding },
                className: "", // this is important
            })}

            {/* Buttons */}
            {isScrollable && (
                <>
                    <ScrollButton
                        direction={"left"}
                        onClick={handleScroll}
                        isDisabled={!canScrollLeft}
                        isVisible={isDesktop}
                        fadeColor={fadeColor}
                    />
                    <ScrollButton
                        direction={"right"}
                        onClick={handleScroll}
                        isDisabled={!canScrollRight}
                        isVisible={isDesktop}
                        fadeColor={fadeColor}
                    />
                </>
            )}
        </ListContainer>
    )
}

addPropertyControls(ScrollableCollectionList, {
    cmsCollection: {
        type: ControlType.ComponentInstance,
        title: "CMS Collection List",
    },
    isDesktop: {
        type: ControlType.Enum,
        title: "Breakpoint",
        description: "For Mobile option it hides arrow controls",
        displaySegmentedControl: true,
        segmentedControlDirection: "horizontal",
        options: [true, false],
        optionTitles: ["Desktop", "Mobile"],
        defaultValue: true,
    },
    fadeColor: {
        type: ControlType.Color,
        title: "Background color",
        description:
            "Set this so that the fades are the same color as the background",
        defaultValue: "rgb(18,18,18)",
    },
})

const ListContainer = styled("div", {
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    overflow: "hidden",
    "&>div>*": {
        scrollSnapAlign: "start",
        scrollMarginLeft: 20,
    },
})

const listStyle: CSSProperties = {
    paddingInline: 8,
    display: "flex",
    gap: 0,
    overflowX: "scroll",
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none",
}

const ScrollButton = ({
    fadeColor,
    direction,
    isDisabled,
    isVisible,
    onClick,
}: {
    fadeColor: string
    direction: "left" | "right"
    isDisabled: boolean
    isVisible: boolean
    onClick: (direction: "left" | "right") => void
}) => {
    const Wrapper = styled("div", {
        position: "absolute",
        display: "grid",
        alignItems: "center",
        paddingInline: 8,
        insetBlock: 0,
        width: "5rem",
        background: `linear-gradient(90deg, ${fadeColor} 0%, rgba(0,0,0,0) 100%)`,

        opacity: 1,
        transitionProperty: "all",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDuration: "300ms",
        pointerEvents: isVisible ? "auto" : "none",

        "&.left": {
            left: 0,
        },
        "&.right": {
            right: 0,
            justifyItems: "end",
            transform: "rotate(180deg)",
        },
        "&.hidden": {
            opacity: 0,
        },
    })

    const Button = styled("button", {
        display: "grid",
        placeContent: "center",
        width: "3rem",
        height: "3rem",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        background: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(8px)",
        borderRadius: "4rem",
        color: "white",
        border: "none",
        padding: 10,
        cursor: "pointer",
        zIndex: 10,
        fontSize: "2rem",
        "&.hidden": {
            opacity: 0,
        },
    })

    return (
        <Wrapper className={`${direction} ${isDisabled && "hidden"}`}>
            <Button
                type="button"
                name={`scroll-${direction}`}
                onClick={() => onClick(direction)}
                disabled={isDisabled}
                className={!isVisible && "hidden"}
            >
                <Chevron size={28} strokeWidth={2} />
            </Button>
        </Wrapper>
    )
}
