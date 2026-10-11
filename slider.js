
class ImageSlider {
    constructor(selector) {
        this.slider = document.querySelector(selector);

        if (!this.slider) return;

        this.track = this.slider.querySelector(".slider-track");
        this.originalSlides = Array.from(this.track.children);
        this.prevBtn = this.slider.querySelector(".prev");
        this.nextBtn = this.slider.querySelector(".next");
        this.dotsContainer =
            this.slider.querySelector(".slider-dots");

        if (
            this.originalSlides.length === 0 ||
            !this.prevBtn ||
            !this.nextBtn ||
            !this.dotsContainer
        ) {
            return;
        }

        this.slideCount = this.originalSlides.length;

        // Index 1 is the first original slide.
        // Index 0 will be the cloned last slide.
        this.currentIndex = 1;

        this.autoPlayInterval = null;
        this.isTransitioning = false;

        // Clone the last slide and place it at the beginning.
        const lastClone =
            this.originalSlides[this.slideCount - 1].cloneNode(true);

        // Clone the first slide and place it at the end.
        const firstClone =
            this.originalSlides[0].cloneNode(true);

        lastClone.setAttribute("aria-hidden", "true");
        firstClone.setAttribute("aria-hidden", "true");

        this.track.prepend(lastClone);
        this.track.append(firstClone);

        this.slides = Array.from(this.track.children);

        this.createDots();
        this.init();
    }

    // Initialize the slider.
    init() {
        this.updateSlidePosition(false);
        this.bindEvents();
        this.startAutoPlay();
    }

    // Create one clickable dot for every original image.
    createDots() {
        this.dotsContainer.innerHTML = "";
        this.dots = [];

        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.classList.add("dot");

            dot.setAttribute(
                "aria-label",
                `Go to image ${i + 1}`
            );

            dot.setAttribute("aria-current", "false");

            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        }
    }

    // Calculate the horizontal position of the track.
    updateSlidePosition(animate = true) {
        const slideWidth = this.slider.clientWidth;

        this.track.style.transition = animate
            ? "transform 0.5s ease-in-out"
            : "none";

        this.track.style.transform =
            `translateX(-${this.currentIndex * slideWidth}px)`;

        this.updateDots();
    }

    // Display the next image.
    nextSlide() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        this.currentIndex++;

        this.updateSlidePosition();
    }

    // Display the previous image.
    prevSlide() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        this.currentIndex--;

        this.updateSlidePosition();
    }

    // Navigate directly to a selected image.
    goToSlide(index) {
        if (this.isTransitioning) return;

        if (index < 0 || index >= this.slideCount) return;

        this.isTransitioning = true;

        // Add 1 because index 0 is the cloned last slide.
        this.currentIndex = index + 1;

        this.updateSlidePosition();
    }

    // Update the active navigation dot.
    updateDots() {
        let realIndex = this.currentIndex - 1;

        if (realIndex < 0) {
            realIndex = this.slideCount - 1;
        } else if (realIndex >= this.slideCount) {
            realIndex = 0;
        }

        this.dots.forEach((dot, index) => {
            const isActive = index === realIndex;

            dot.classList.toggle("active", isActive);

            dot.setAttribute(
                "aria-current",
                isActive ? "true" : "false"
            );
        });
    }

    // Connect buttons, dots, and other events.
    bindEvents() {
        this.nextBtn.addEventListener("click", () => {
            this.nextSlide();
        });

        this.prevBtn.addEventListener("click", () => {
            this.prevSlide();
        });

        // Each dot navigates to its matching image.
        this.dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                this.goToSlide(index);
            });
        });

        // Handle the end of the sliding animation.
        this.track.addEventListener("transitionend", (event) => {
            if (event.propertyName !== "transform") return;

            // Reached the cloned first slide.
            if (this.currentIndex === this.slideCount + 1) {
                this.currentIndex = 1;
                this.updateSlidePosition(false);
            }

            // Reached the cloned last slide.
            else if (this.currentIndex === 0) {
                this.currentIndex = this.slideCount;
                this.updateSlidePosition(false);
            }

            this.isTransitioning = false;
        });

        // Pause autoplay when the pointer enters the slider.
        this.slider.addEventListener("mouseenter", () => {
            this.stopAutoPlay();
        });

        // Resume autoplay when the pointer leaves.
        this.slider.addEventListener("mouseleave", () => {
            this.startAutoPlay();
        });

        // Pause while a slider control has keyboard focus.
        this.slider.addEventListener("focusin", () => {
            this.stopAutoPlay();
        });

        this.slider.addEventListener("focusout", (event) => {
            if (!this.slider.contains(event.relatedTarget)) {
                this.startAutoPlay();
            }
        });

        // Keep the correct position when the window is resized.
        window.addEventListener("resize", () => {
            this.updateSlidePosition(false);
            this.isTransitioning = false;
        });
    }

    // Automatically move to the next image every four seconds.
    startAutoPlay() {
        this.stopAutoPlay();

        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }

    // Stop automatic sliding.
    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
    }
}

// Start the image slider when the page is ready.
document.addEventListener("DOMContentLoaded", () => {
    new ImageSlider(".slider");
});

// Demo-only contact form response.
// This does not send an email or store messages.
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        document.querySelector("#form-message").textContent =
            "Thank you! The form demonstration is complete.";

        contactForm.reset();
    });
}