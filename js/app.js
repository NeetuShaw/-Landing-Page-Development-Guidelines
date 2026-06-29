document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================================
       MOBILE RESPONSIVE HAMBURGER MENU PROFILE ADJUSTER
       ========================================================================== */
    const menuToggleBtn = document.getElementById("menu-toggle-btn");
    const navMenuTray = document.getElementById("nav-menu");
    const navAnchors = document.querySelectorAll(".nav-link");

    if (menuToggleBtn && navMenuTray) {
        menuToggleBtn.addEventListener("click", () => {
            const isOpen = navMenuTray.classList.toggle("active");
            menuToggleBtn.setAttribute("aria-expanded", isOpen);
        });

        navAnchors.forEach(anchor => {
            anchor.addEventListener("click", () => {
                navMenuTray.classList.remove("active");
                menuToggleBtn.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* ==========================================================================
       HERO SLIDER: DUAL-AXIS AUTO-PLAY CAROUSEL PLATFORM
       ========================================================================== */
    const heroSliderRoot = document.getElementById("hero-slider-root");
    const heroTrack = document.getElementById("hero-slider-track");
    const heroSlides = document.querySelectorAll(".hero-slide");
    const heroPrevBtn = document.getElementById("hero-prev-control");
    const heroNextBtn = document.getElementById("hero-next-control");

    let activeHeroIndex = 0;
    let heroAutoPlayInterval = null;

    function renderHeroSlide(targetIndex) {
        heroSlides[activeHeroIndex].classList.remove("active");
        activeHeroIndex = (targetIndex + heroSlides.length) % heroSlides.length;
        heroSlides[activeHeroIndex].classList.add("active");
    }

    function initHeroCycle() {
        if (!heroAutoPlayInterval) {
            heroAutoPlayInterval = setInterval(() => {
                renderHeroSlide(activeHeroIndex + 1);
            }, 5000);
        }
    }

    function killHeroCycle() {
        clearInterval(heroAutoPlayInterval);
        heroAutoPlayInterval = null;
    }

    if (heroSlides.length > 0) {
        initHeroCycle();

        if (heroSliderRoot) {
            heroSliderRoot.addEventListener("mouseenter", killHeroCycle);
            heroSliderRoot.addEventListener("mouseleave", initHeroCycle);
            heroSliderRoot.addEventListener("focusin", killHeroCycle);
            heroSliderRoot.addEventListener("focusout", initHeroCycle);

            // Accessible Keyboard Controls Navigation Support
            heroSliderRoot.addEventListener("keydown", (e) => {
                if (e.key === "ArrowRight") renderHeroSlide(activeHeroIndex + 1);
                if (e.key === "ArrowLeft") renderHeroSlide(activeHeroIndex - 1);
            });
        }

        if (heroPrevBtn) heroPrevBtn.addEventListener("click", () => renderHeroSlide(activeHeroIndex - 1));
        if (heroNextBtn) heroNextBtn.addEventListener("click", () => renderHeroSlide(activeHeroIndex + 1));
    }

    /* ==========================================================================
       CHOOSE YOUR SCHOOL: MOBILE NATIVE TOUCH SLIDER LAYER TRANSFORMATIONS
       ========================================================================== */
    const schoolAdaptiveTrack = document.getElementById("school-adaptive-track");
    const schoolCardsLayout = schoolAdaptiveTrack ? schoolAdaptiveTrack.querySelector(".school-cards-grid-layout") : null;
    const schoolCards = schoolCardsLayout ? schoolCardsLayout.querySelectorAll(".school-curriculum-card") : [];
    const paginationDots = document.querySelectorAll("#school-slider-dots-container .pag-dot");

    let activeSchoolIndex = 0;
    let touchStartCoordX = 0;
    let touchEndCoordX = 0;

    function transitionSchoolSlider(targetIndex) {
        if (window.innerWidth > 992 || !schoolCardsLayout) return;
        
        activeSchoolIndex = Math.max(0, Math.min(targetIndex, schoolCards.length - 1));
        const offsetTranslation = -(activeSchoolIndex * 100);
        schoolCardsLayout.style.transform = `translateX(${offsetTranslation}%)`;

        paginationDots.forEach((dot, idx) => {
            dot.classList.toggle("active", idx === activeSchoolIndex);
        });
    }

    if (schoolAdaptiveTrack && schoolCardsLayout) {
        // Swipe Detection Implementation via Touch Targets APIs
        schoolAdaptiveTrack.addEventListener("touchstart", (e) => {
            touchStartCoordX = e.changedTouches[0].screenX;
        }, { passive: true });

        schoolAdaptiveTrack.addEventListener("touchend", (e) => {
            touchEndCoordX = e.changedTouches[0].screenX;
            const thresholdDelta = 50;
            if (touchStartCoordX - touchEndCoordX > thresholdDelta) {
                transitionSchoolSlider(activeSchoolIndex + 1); // Swiped Left
            } else if (touchEndCoordX - touchStartCoordX > thresholdDelta) {
                transitionSchoolSlider(activeSchoolIndex - 1); // Swiped Right
            }
        }, { passive: true });

        paginationDots.forEach(dot => {
            dot.addEventListener("click", (e) => {
                const stepTarget = parseInt(e.target.getAttribute("data-target"), 10);
                transitionSchoolSlider(stepTarget);
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 992 && schoolCardsLayout) {
                schoolCardsLayout.style.transform = "none";
            } else {
                transitionSchoolSlider(activeSchoolIndex);
            }
        });
    }

    /* ==========================================================================
       EXHIBITION: HIGHLIGHT CAROUSEL STEP LAYOUT POSITIONER
       ========================================================================== */
    const exhibitionSliderTrack = document.getElementById("exhibition-slider-track");
    const exhibitionCards = exhibitionSliderTrack ? exhibitionSliderTrack.querySelectorAll(".exhibition-highlight-card-node") : [];
    const exhibitionPrevArrow = document.getElementById("exhibition-nav-arrow-prev");
    const exhibitionNextArrow = document.getElementById("exhibition-nav-arrow-next");

    let currentExhibitionStep = 0;

    function getVisibleCardsCount() {
        const viewportWidth = window.innerWidth;
        if (viewportWidth > 1200) return 4;
        if (viewportWidth > 992) return 3;
        if (viewportWidth > 768) return 2;
        return 1;
    }

    function slideExhibitionTrack() {
        if (!exhibitionSliderTrack || exhibitionCards.length === 0) return;
        
        const cardDisplayCount = getVisibleCardsCount();
        const absoluteMaxSteps = exhibitionCards.length - cardDisplayCount;
        currentExhibitionStep = Math.max(0, Math.min(currentExhibitionStep, absoluteMaxSteps));

        const baseNodeCardWidth = exhibitionCards[0].getBoundingClientRect().width;
        const layoutGapDistance = 24; 
        const aggregateScrollShiftX = currentExhibitionStep * (baseNodeCardWidth + layoutGapDistance);

        exhibitionSliderTrack.style.transform = `translateX(-${aggregateScrollShiftX}px)`;
    }

    if (exhibitionPrevArrow && exhibitionNextArrow) {
        exhibitionNextArrow.addEventListener("click", () => {
            const activeLimit = exhibitionCards.length - getVisibleCardsCount();
            if (currentExhibitionStep < activeLimit) {
                currentExhibitionStep++;
                slideExhibitionTrack();
            }
        });

        exhibitionPrevArrow.addEventListener("click", () => {
            if (currentExhibitionStep > 0) {
                currentExhibitionStep--;
                slideExhibitionTrack();
            }
        });

        window.addEventListener("resize", slideExhibitionTrack);
    }
});