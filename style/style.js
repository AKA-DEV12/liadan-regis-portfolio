// Portfolio JavaScript - Vanilla JS
document.addEventListener("DOMContentLoaded", () => {
    // Variables
    let activeSection = "hero"
    let isScrolled = false
    let isAnimating = false

    // Elements
    const navbar = document.getElementById("navbar")
    const navLinks = document.querySelectorAll(".nav-link")
    const mobileNavLinks = document.querySelectorAll(".nav-link-mobile")
    const skillBars = document.querySelectorAll(".skill-bar")
    const downloadBtn = document.getElementById("download-cv-btn")
    const mobileMenuBtn = document.getElementById("mobile-menu-btn")
    const mobileMenu = document.getElementById("mobile-menu")
    const cards = document.querySelectorAll(".card-hover")

    // Utility functions
    function debounce(func, wait) {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    }

    function throttle(func, limit) {
        let inThrottle
        return function () {
            const args = arguments

            if (!inThrottle) {
                func.apply(this, args)
                inThrottle = true
                setTimeout(() => (inThrottle = false), limit)
            }
        }
    }

    // Smooth scroll function
    function scrollToSection(sectionId) {
        const element = document.getElementById(sectionId)
        if (element && !isAnimating) {
            isAnimating = true
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })

            // Close mobile menu if open
            mobileMenu.classList.add("hidden")

            setTimeout(() => {
                isAnimating = false
            }, 1000)
        }
    }

    // Download CV function
    function downloadCV() {
        // Path to your PDF file in media/cv folder
        const pdfPath = "media/RegisKoutouan.pdf"

        // Try to open the PDF in a new tab first
        try {
            window.open(pdfPath, "_blank")
            showNotification("CV ouvert dans un nouvel onglet!", "success")
        } catch (error) {
            // Fallback: create download link
            const link = document.createElement("a")
            link.href = pdfPath
            link.download = "CV-Liadan-Regis-Barthelemy-KOUTOUAN.pdf"
            link.target = "_blank"

            // Add link to DOM temporarily
            document.body.appendChild(link)

            // Trigger download
            link.click()

            // Clean up
            document.body.removeChild(link)

            showNotification("Téléchargement du CV lancé!", "success")
        }
    }

    // Show notification function
    function showNotification(message, type = "info") {
        const notification = document.createElement("div")
        notification.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${type === "success" ? "bg-green-500 text-white" : "bg-blue-500 text-white"
            }`
        notification.textContent = message

        document.body.appendChild(notification)

        // Animate in
        setTimeout(() => {
            notification.classList.remove("translate-x-full")
        }, 100)

        // Animate out after 3 seconds
        setTimeout(() => {
            notification.classList.add("translate-x-full")
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification)
                }
            }, 300)
        }, 3000)
    }

    // Update active navigation link
    function updateActiveNavLink(sectionId) {
        navLinks.forEach((link) => {
            link.classList.remove("active")
            if (link.getAttribute("href") === `#${sectionId}`) {
                link.classList.add("active")
            }
        })

        mobileNavLinks.forEach((link) => {
            link.classList.remove("active")
            if (link.getAttribute("href") === `#${sectionId}`) {
                link.classList.add("active")
            }
        })
    }

    // Update navbar background on scroll
    function updateNavbarBackground() {
        if (window.scrollY > 50) {
            if (!isScrolled) {
                navbar.classList.add("bg-white/95", "backdrop-blur", "shadow-lg")
                navbar.classList.remove("bg-transparent")
                isScrolled = true
            }
        } else {
            if (isScrolled) {
                navbar.classList.remove("bg-white/95", "backdrop-blur", "shadow-lg")
                navbar.classList.add("bg-transparent")
                isScrolled = false
            }
        }
    }

    // Animate skill bars when in view
    function animateSkillBars() {
        const skillsSection = document.getElementById("skills")
        if (!skillsSection) return

        const rect = skillsSection.getBoundingClientRect()
        const isInView = rect.top <= window.innerHeight && rect.bottom >= 0

        if (isInView) {
            skillBars.forEach((bar) => {
                const width = bar.getAttribute("data-width")
                if (width && bar.style.width === "0%") {
                    setTimeout(() => {
                        bar.style.width = width + "%"
                    }, Math.random() * 500)
                }
            })
        }
    }

    // Update active section based on scroll position
    function updateActiveSection() {
        const sections = ["hero", "about", "skills", "experience", "projects", "contact"]

        sections.forEach((sectionId) => {
            const element = document.getElementById(sectionId)
            if (element) {
                const rect = element.getBoundingClientRect()
                if (rect.top <= 100 && rect.bottom >= 100) {
                    if (activeSection !== sectionId) {
                        activeSection = sectionId
                        updateActiveNavLink(sectionId)
                    }
                }
            }
        })
    }

    // Animate elements on scroll
    function animateOnScroll() {
        cards.forEach((card) => {
            const rect = card.getBoundingClientRect()
            const isInView = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0

            if (isInView && !card.classList.contains("animate-fade-in")) {
                card.classList.add("animate-fade-in", "loading", "loaded")
            }
        })
    }

    // Scroll event handler
    const handleScroll = throttle(() => {
        updateNavbarBackground()
        updateActiveSection()
        animateSkillBars()
        animateOnScroll()
    }, 16)

    // Mobile menu toggle
    function toggleMobileMenu() {
        mobileMenu.classList.toggle("hidden")
    }

    // Close mobile menu when clicking outside
    function closeMobileMenuOnClickOutside(event) {
        if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            mobileMenu.classList.add("hidden")
        }
    }

    // Keyboard navigation
    function handleKeyboardNavigation(event) {
        if (event.key === "Escape") {
            mobileMenu.classList.add("hidden")
        }

        if (event.key === "Tab") {
            // Ensure proper tab navigation
            const focusableElements = document.querySelectorAll(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select',
            )
            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]

            if (event.shiftKey && document.activeElement === firstElement) {
                lastElement.focus()
                event.preventDefault()
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                firstElement.focus()
                event.preventDefault()
            }
        }
    }

    // Initialize animations
    function initializeAnimations() {
        // Add loading class to all cards initially
        cards.forEach((card) => {
            card.classList.add("loading")
        })

        // Animate hero section
        const heroLeft = document.querySelector(".animate-slide-left")
        const heroRight = document.querySelector(".animate-slide-right")

        if (heroLeft) {
            setTimeout(() => {
                heroLeft.classList.add("loaded")
            }, 300)
        }

        if (heroRight) {
            setTimeout(() => {
                heroRight.classList.add("loaded")
            }, 600)
        }
    }

    // Add event listeners
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", debounce(updateNavbarBackground, 250))
    document.addEventListener("click", closeMobileMenuOnClickOutside)
    document.addEventListener("keydown", handleKeyboardNavigation)

    // Navigation click handlers
    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault()
            const sectionId = this.getAttribute("href").substring(1)
            scrollToSection(sectionId)
        })
    })

    // Mobile navigation click handlers
    mobileNavLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault()
            const sectionId = this.getAttribute("href").substring(1)
            scrollToSection(sectionId)
        })
    })

    // Download CV button
    if (downloadBtn) {
        downloadBtn.addEventListener("click", downloadCV)
    }

    // Mobile menu button
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", toggleMobileMenu)
    }

    // Button click handlers for inline onclick attributes
    window.scrollToSection = scrollToSection
    window.downloadCV = downloadCV

    // Intersection Observer for better performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-fade-in")
                if (entry.target.classList.contains("loading")) {
                    entry.target.classList.add("loaded")
                }
            }
        })
    }, observerOptions)

    // Observe all cards
    cards.forEach((card) => {
        observer.observe(card)
    })

    // Initialize everything
    updateNavbarBackground()
    updateActiveSection()
    initializeAnimations()

    // Add smooth scrolling fallback for older browsers
    if (!CSS.supports("scroll-behavior", "smooth")) {
        document.documentElement.style.scrollBehavior = "auto"

        // Polyfill for smooth scrolling
        window.scrollToSection = (sectionId) => {
            const element = document.getElementById(sectionId)
            if (element) {
                const targetPosition = element.getBoundingClientRect().top + window.pageYOffset
                const startPosition = window.pageYOffset
                const distance = targetPosition - startPosition
                const duration = 1000
                let start = null

                function animation(currentTime) {
                    if (start === null) start = currentTime
                    const timeElapsed = currentTime - start
                    const run = ease(timeElapsed, startPosition, distance, duration)
                    window.scrollTo(0, run)
                    if (timeElapsed < duration) requestAnimationFrame(animation)
                }

                function ease(t, b, c, d) {
                    t /= d / 2
                    if (t < 1) return (c / 2) * t * t + b
                    t--
                    return (-c / 2) * (t * (t - 2) - 1) + b
                }

                requestAnimationFrame(animation)
            }
        }
    }

    // Performance monitoring
    if ("performance" in window) {
        window.addEventListener("load", () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
            console.log(`Portfolio loaded in ${loadTime}ms`)
        })
    }

    // Service Worker registration (for PWA capabilities)
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("SW registered: ", registration)
                })
                .catch((registrationError) => {
                    console.log("SW registration failed: ", registrationError)
                })
        })
    }
})

// Additional utility functions
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            window.showNotification("Copié dans le presse-papiers!", "success")
        })
    } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        window.showNotification("Copié dans le presse-papiers!", "success")
    }
}

window.showNotification = showNotification
