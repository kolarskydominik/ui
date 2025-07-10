/*
Created: Dom | 2025-05-24

Last updated: Dom | 2025-05-29

Description: Used to handle Localisation
*/

import { useState, useRef, useEffect, CSSProperties, Suspense } from "react"
import { addPropertyControls, ControlType, useLocaleInfo } from "framer"
import { styled } from "@stitches/react"
import { locales, getLocaleName } from "https://framer.com/m/Locales-sOFf.js"
import LocaleSwitcherHeading from "https://framer.com/m/LocaleSwitcherHeading-x7lW.js"
import CircleFlagLanguage from "https://framer.com/m/CircleFlagLanguage-Tozh.js"
import { createPortal } from "react-dom"

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */

const colors = {
    layer: {
        3: "#1f232e",
    },
    gray: {
        50: "#0B0C0F",
        200: "#1E2129",
        300: "#292D38",
        400: "#363B47",
        700: "#6F7585",
        800: "#9095A3",
        1000: "#C9CBD1",
        1200: "#F2F4F7",
        1300: "#FFFFFF",
    },
    purple: {
        100: "#7663EC",
    },
}

// --------- Default Wrapper Component
const GridContainer = styled("div", {
    fontFamily: '"Figtree", "Figtree Placeholder", sans-serif',
    display: "grid",
    width: "100%",
    maxWidth: "1024px",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "0.5rem",
    padding: "1rem",
})

export default function LocaleSwitcher(props) {
    const { isDesktop, heading } = props
    const { activeLocale, setLocale } = useLocaleInfo()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    function handleLocaleChange(value) {
        const locale = locales.find((locale) => locale.id === value?.id)
        setLocale(locale ?? "default")
        setIsDialogOpen(false)
    }

    return (
        <>
            <LocaleSwitcherTrigger
                isDesktop={isDesktop}
                onClick={() => setIsDialogOpen(!isDialogOpen)}
            />
            <LocaleSwitcherDialog
                isDesktop={isDesktop}
                isOpen={isDialogOpen}
                openChange={setIsDialogOpen}
                heading={heading}
            >
                <GridContainer>
                    {locales.map((i) => {
                        const isSelected = i.id === activeLocale.id
                        return (
                            <LocaleSwitcherItem
                                onClick={() => handleLocaleChange(i)}
                                key={i.id}
                                locale={i}
                                isSelected={isSelected}
                            />
                        )
                    })}
                </GridContainer>
            </LocaleSwitcherDialog>
        </>
    )
}

addPropertyControls(LocaleSwitcher, {
    isDesktop: {
        type: ControlType.Enum,
        title: "Breakpoint Variant",
        displaySegmentedControl: true,
        segmentedControlDirection: "vertical",
        options: [true, false],
        optionTitles: ["Desktop", "Mobile"],
        defaultValue: true,
    },
    heading: {
        type: ControlType.String,
        title: "heading of dialog",
        defaultValue: "Select your prefered language",
    },
})

function LocaleSwitcherTrigger({ isDesktop, onClick }) {
    const { activeLocale } = useLocaleInfo()
    const localeSlug = activeLocale.slug || "en"
    const localeName = getLocaleName(activeLocale.id) || locales[0].localeName

    return (
        <>
            <style>{`
                .locale_trigger-container {
                    position: relative;
                    transition: all 200ms ease;
                }

                .locale_trigger-container:hover {
                    opacity: 0.9;
                }

                .locale_trigger-container:hover * {
                    color: ${colors.purple[100]};
                }

                .locale_chevron-icon {
                    color: ${colors.gray[1300]};
                    position: absolute;
                    cursor: pointer;
                    top: 50%;
                    right: 8px;
                    transform: translateY(-50%);
                    transition: all 200ms ease;
                    pointer-events: none;

                    &.desktop {
                        width: 20px;
                        height: 20px;
                      }

                    &.mobile {
                        width: 16px;
                        height: 16px;
                     }
                }

                .locale_trigger-button {
                    font-family: "Figtree", "Figtree Placeholder", sans-serif !important;
                    background-color: ${colors.layer[3]};
                    color: ${colors.gray[1300]};
                    display: flex;
                    min-width: 60px;
                    flex-shrink: 0;
                    cursor: pointer;
                    appearance: none;
                    align-items: center;
                    gap: 8px;
                    border-radius: 9999px;
                    padding-block: 9px;
                    max-height: 38px;
                    border: unset;
                    transition: all 200ms ease;
                    padding-right: 32px;
                    padding-left: 9px;
                }

                .locale_trigger-button.desktop {
                    font-size: 16px;
                }

                .locale_trigger-button.mobile {
                    font-size: 14px;
                }
            `}</style>

            <div className="locale_trigger-container">
                <button
                    className={`locale_trigger-button ${isDesktop ? "desktop" : "mobile"}`}
                    title="Change Language"
                    onClick={onClick}
                >
                    <CircleFlagLanguage
                        languageCode={localeSlug}
                        width={20}
                        height={20}
                    />
                    {isDesktop && <span>{localeName}</span>}
                </button>
                <ChevronDown
                    className={`locale_chevron-icon ${isDesktop ? "desktop" : "mobile"}`}
                />
            </div>
        </>
    )
}

// --------- Locale Dialog Component
const HeadingContainer = styled("div", {
    paddingInline: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    variants: {
        isDesktop: {
            true: {
                paddingTop: ".75rem",
            },
            false: {},
        },
    },
})
const Heading = styled("p", {
    fontSize: "1.125rem",
    fontFamily: '"Figtree", "Figtree Placeholder", sans-serif !important',
    fontWeight: "bold",
    leading: 1,
    color: colors.gray[1200],
    marginBlock: ".5rem",
})
const CancelButton = styled(X, {
    color: colors.gray[1200],
    width: 24,
    height: 24,
    minWidth: 24,
    cursor: "pointer",
    transition: "all 200ms ease",

    "&:hover": {
        opacity: 0.9,
        color: colors.purple[100],
    },
})

// Loading component
const LoadingSpinner = styled("div", {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    color: colors.gray[800],
    fontSize: "14px",
    fontFamily: '"Figtree", "Figtree Placeholder", sans-serif',
})

function LocaleSwitcherDialog({
    isOpen,
    openChange,
    children,
    isDesktop,
    heading,
}) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null

    const dialogContent = (
        <Suspense fallback={<LoadingSpinner>Loading...</LoadingSpinner>}>
            {isDesktop ? (
                <SimpleModal open={isOpen} setIsOpen={openChange}>
                    <HeadingContainer isDesktop={isDesktop}>
                        <Heading>{heading}</Heading>
                        <CancelButton onClick={() => openChange(false)} />
                    </HeadingContainer>
                    {children}
                </SimpleModal>
            ) : (
                <SimpleDrawer open={isOpen} setIsOpen={openChange}>
                    <HeadingContainer isDesktop={isDesktop}>
                        <Heading>{heading}</Heading>
                        <CancelButton onClick={() => openChange(false)} />
                    </HeadingContainer>
                    <ScrollableBody bottomFade>{children}</ScrollableBody>
                </SimpleDrawer>
            )}
        </Suspense>
    )

    return createPortal(dialogContent, document.body)
}

// --------- Locale Item Component
const SwitcherButton = styled("button", {
    type: "button",
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "0.75rem",
    border: "1px solid transparent",
    paddingInline: "1rem",
    paddingBlock: "0.75rem",
    fontSize: "0.875rem",
    transition: "all 200ms ease",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: colors.gray[1200],

    "&:hover": {
        backgroundColor: `color-mix(in oklab,${colors.purple[100]} 10%, transparent)`,
    },

    variants: {
        selected: {
            true: {
                borderColor: colors.purple[100],
                backgroundColor: `color-mix(in oklab,${colors.purple[100]} 10%, transparent)`,
            },
        },
    },
})
const TextContainer = styled("div", {
    marginLeft: "0.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.125rem",
    textAlign: "start",
})

const LocaleName = styled("p", {
    fontSize: "1rem",
    lineHeight: 1,
    margin: 0,
})
const CheckContainer = styled("div", {
    marginLeft: "auto",
    display: "grid",
    placeItems: "center",
    width: "1.75rem",
    height: "1.75rem",
    borderRadius: "50%",

    variants: {
        selected: {
            true: {
                backgroundColor: `color-mix(in oklab,${colors.purple[100]} 20%, transparent)`,
            },
        },
    },
})

const CheckIcon = styled(Check, {
    width: "1rem",
    height: "1rem",
    stroke: colors.purple[100],
})
const LocaleSwitcherItem = ({ locale, isSelected, onClick }) => {
    const localeSlug = locale.slug || "en"
    const localeName = locale.localeName || locales[0].localeName

    return (
        <SwitcherButton
            title={localeName}
            onClick={onClick}
            selected={isSelected}
        >
            <CircleFlagLanguage
                languageCode={localeSlug}
                width={24}
                height={24}
            />
            <TextContainer>
                <LocaleName>{localeName}</LocaleName>
            </TextContainer>
            <CheckContainer selected={isSelected}>
                {isSelected && <CheckIcon />}
            </CheckContainer>
        </SwitcherButton>
    )
}

// --------- Drawer Component
const DrawerOverlay = styled("div", {
    position: "fixed",
    inset: 0,
    zIndex: 99,
    display: "flex",
    alignItems: "end",
    justifyContent: "center",
    transition: "opacity 300ms ease",

    variants: {
        visible: {
            true: {
                opacity: 1,
            },
            false: {
                pointerEvents: "none",
                opacity: 0,
            },
        },
    },
})
const DrawerBackdrop = styled("div", {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgb(0,0,0,0.7)",
    backdropFilter: "blur(1px)",
})
const DrawerContainer = styled("div", {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    borderTopLeftRadius: "1.5rem",
    borderTopRightRadius: "1.5rem",
    borderLeft: "2px solid",
    borderRight: "2px solid",
    borderTop: "3px solid",
    boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    willChange: "transform, opacity",
    maxHeight: "95svh",

    backgroundColor: colors.layer[3],
    borderColor: colors.gray[400],

    variants: {
        visible: {
            true: {
                transform: "translateY(0)",
            },
            false: {
                transform: "translateY(100%)",
            },
        },
    },
})
const DrawerHandle = styled("div", {
    marginInline: "auto",
    marginTop: "0.75rem",
    marginBottom: "0.25rem",
    display: "flex",
    width: "100%",
    cursor: "grab",
    touchAction: "none",
    justifyContent: "center",
})
const HandleBar = styled("div", {
    height: "0.5rem",
    width: "6.25rem",
    borderRadius: "9999px",
    backgroundColor: colors.gray[400],
})

const DrawerContent = styled("div", {
    overflow: "hidden",
})

function SimpleDrawer({ children, open, setIsOpen }) {
    const drawerRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const initialRender = useRef(true)

    // * Drag State
    const [isDragging, setIsDragging] = useState(false)
    const [startY, setStartY] = useState(0)
    const [currentY, setCurrentY] = useState(0)
    const [drawerHeight, setDrawerHeight] = useState(0)

    // * Effect for Mounting, Transitions, Escape key, and Body Scroll Lock
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false)
            }
        }
        if (typeof document !== "undefined")
            if (open) {
                document.addEventListener("keydown", handleEscapeKey)
                document.body.style.overflow = "hidden"
                setMounted(true)

                // Ensure height is measured before showing for accurate drag threshold
                requestAnimationFrame(() => {
                    if (drawerRef.current) {
                        setDrawerHeight(drawerRef.current.offsetHeight)
                    }

                    // Trigger visibility transition
                    if (initialRender.current) {
                        setTimeout(() => {
                            requestAnimationFrame(() => {
                                setIsVisible(true)
                                initialRender.current = false
                            })
                        }, 50) // Small delay for initial render animation
                    } else {
                        requestAnimationFrame(() => {
                            setIsVisible(true)
                        })
                    }
                })
            } else {
                setIsVisible(false) // Trigger the closing animation

                // Wait for animation to finish before unmounting
                const timer = setTimeout(() => {
                    if (!open) {
                        setMounted(false)
                        document.body.style.overflow = ""
                        setIsDragging(false)
                        setStartY(0)
                        setCurrentY(0)
                    }
                }, 300)

                // Cleanup timer and event listener
                return () => {
                    clearTimeout(timer)
                    document.removeEventListener("keydown", handleEscapeKey)
                    if (document.body.style.overflow === "hidden")
                        document.body.style.overflow = ""
                }
            }

        return () => {
            if (typeof document !== "undefined") {
                document.removeEventListener("keydown", handleEscapeKey)
                // Check if still mounted before trying to reset scroll
                if (mounted && !open) document.body.style.overflow = ""
            }
        }
    }, [open, setIsOpen, mounted])

    // * Handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        // Only allow dragging if the drawer is fully visible/open
        if (!isVisible) return

        setIsDragging(true)
        setStartY(e.touches[0].clientY)
        setCurrentY(e.touches[0].clientY) // Initialize currentY

        // Ensure drawer height is current at drag start
        if (drawerRef.current) {
            setDrawerHeight(drawerRef.current.offsetHeight)
        }
        // Disable transitions during drag for smoother manual control
        if (drawerRef.current) {
            drawerRef.current.style.transition = "none"
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isDragging) {
            setCurrentY(e.touches[0].clientY)
        }
    }

    const handleTouchEnd = () => {
        if (isDragging) {
            // Re-enable transitions
            if (drawerRef.current) {
                drawerRef.current.style.transition = ""
            }

            const diff = currentY - startY
            const threshold = drawerHeight * 0.4 // threshold sensitivity if needed (e.g., 40%)

            // Dragged down significantly, close the drawer
            if (diff > threshold) setIsOpen(false)

            setIsDragging(false)
        }
    }

    const handleBackdropClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            setIsOpen(false)
        }
    }

    // *Calculate drawer position during drag
    const getDragTransform = () => {
        if (!isDragging) return "" // Don't apply manual transform if not dragging

        const diff = currentY - startY
        // Prevent dragging upwards beyond the fully open state
        const dragY = Math.max(0, diff)

        return `translateY(${dragY}px)`
    }

    if (!mounted) return null
    return (
        <DrawerOverlay
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            visible={isVisible}
        >
            <DrawerBackdrop onClick={handleBackdropClick} aria-hidden="true" />

            <DrawerContainer
                ref={drawerRef}
                visible={isVisible}
                style={{
                    transform: getDragTransform() || undefined,
                }}
            >
                <DrawerHandle
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <HandleBar />
                </DrawerHandle>

                <DrawerContent>{children}</DrawerContent>
            </DrawerContainer>
        </DrawerOverlay>
    )
}

// --------- Modal Component
const ModalOverlay = styled("div", {
    position: "fixed",
    inset: 0,
    zIndex: 99,
    display: "flex",
    justifyContent: "center",
    padding: "1rem",
    transition: "all 300ms ease",

    variants: {
        visible: {
            true: {
                opacity: 1,
            },
            false: {
                pointerEvents: "none",
                opacity: 0,
            },
        },
    },
})
const ModalBackdrop = styled("div", {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgb(0,0,0,0.7)",
    backdropFilter: "blur(1px)",
})
const ModalContainer = styled("div", {
    marginTop: "14vh",
    height: "min-content",
    width: "100%",
    maxWidth: "900px",
    transform: "translateY(0) scale(1)",
    overflow: "hidden",
    borderRadius: "1rem",
    borderWidth: "3px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: "all 300ms ease",
    willChange: "transform, opacity",
    backgroundColor: colors.layer[3],

    variants: {
        visible: {
            true: {
                transform: "translateY(0) scale(1)",
            },
            false: {
                transform: "translateY(-2rem) scale(0.9)",
            },
        },
    },
})
const ModalContent = styled("div", {
    maxHeight: "80vh",
    overflowY: "scroll",

    // Hide scrollbar
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
        display: "none",
    },
})

function SimpleModal({ children, open, setIsOpen }) {
    const modalRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const initialRender = useRef(true)

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false)
            }
        }
        if (typeof document !== "undefined")
            if (open) {
                document.addEventListener("keydown", handleEscapeKey)
                document.body.style.overflow = "hidden"

                setMounted(true)

                // Special handling for initial render to ensure animation works
                if (initialRender.current) {
                    // Force a layout reflow before showing
                    setTimeout(() => {
                        requestAnimationFrame(() => {
                            setIsVisible(true)
                            initialRender.current = false
                        })
                    }, 50)
                } else {
                    // For subsequent opens
                    requestAnimationFrame(() => {
                        setIsVisible(true)
                    })
                }
            } else {
                setIsVisible(false)

                const timer = setTimeout(() => {
                    if (!open) {
                        setMounted(false)
                        document.body.style.overflow = ""
                    }
                }, 300)

                return () => clearTimeout(timer)
            }

        return () => {
            if (typeof document !== "undefined") {
                document.removeEventListener("keydown", handleEscapeKey)
                document.body.style.overflow = ""
            }
        }
    }, [open, setIsOpen])

    const handleBackdropClick = (event: React.MouseEvent) => {
        // Ensure the click was directly on the backdrop, not bubbled from children
        if (event.target === event.currentTarget) {
            setIsOpen(false)
        }
    }

    if (!mounted) return null
    return (
        <ModalOverlay
            visible={isVisible}
            onClick={(e) => e.stopPropagation()}
            aria-modal="true"
            role="dialog"
        >
            <ModalBackdrop onClick={handleBackdropClick} />
            <ModalContainer ref={modalRef} visible={isVisible}>
                <ModalContent>{children}</ModalContent>
            </ModalContainer>
        </ModalOverlay>
    )
}

// --------- ScrollFade Component
const FadeOverlay = styled("div", {
    pointerEvents: "none",
    position: "absolute",

    variants: {
        variant: {
            left: {
                left: 0,
                top: 0,
                bottom: 0,
                width: "2.5rem",
                background: `linear-gradient(to right, ${colors.layer[3]}, transparent)`,
            },
            right: {
                right: 0,
                top: 0,
                bottom: 0,
                width: "2.5rem",
                background: `linear-gradient(to left, ${colors.layer[3]}, transparent)`,
            },
            bottom: {
                bottom: 0,
                left: 0,
                right: 0,
                height: "2.5rem",
                background: `linear-gradient(to top, ${colors.layer[3]}, transparent)`,
            },
            top: {
                top: 0,
                left: 0,
                right: 0,
                height: "2.5rem",
                background: `linear-gradient(to bottom, ${colors.layer[3]}, transparent)`,
            },
        },
    },

    defaultVariants: {
        variant: "bottom",
    },
})

function ScrollFade({
    variant = "bottom",
}: {
    variant?: "left" | "right" | "bottom" | "top"
}) {
    return <FadeOverlay variant={variant} />
}

// --------- ScrollableBody Components
const ScrollableContainer = styled("div", {
    position: "relative",
})
const ScrollWrapper = styled("div", {
    width: "100%",
    overflowY: "scroll",

    // scrollbar styling
    scrollbarWidth: "auto",
    scrollbarColor: `${colors.gray[300]} transparent`,

    "&::-webkit-scrollbar": {
        width: "0.25rem",
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: colors.gray[50],
        borderRadius: "9999px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: colors.gray[300],
    },
})
const ScrollContent = styled("div", {
    maxHeight: "75svh",
    minHeight: "8rem",
    paddingBottom: "2rem",
})

function ScrollableBody({
    children,
    bottomFade = false,
}: {
    children: React.ReactNode
    bottomFade?: boolean
}) {
    return (
        <ScrollableContainer>
            <ScrollWrapper>
                <ScrollContent>
                    {children}

                    {bottomFade && <ScrollFade variant="bottom" />}
                </ScrollContent>
            </ScrollWrapper>
        </ScrollableContainer>
    )
}

// --------- Icons Components
function X({ size = 24, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}

function Check({ size = 24, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}

function ChevronDown({ size = 24, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}
