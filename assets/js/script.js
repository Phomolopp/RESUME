(function () {
    const body = document.body;
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector("[data-nav-links]");
    const themeToggle = document.querySelector(".theme-toggle");
    const themeIcon = document.querySelector("[data-theme-icon]");
    const revealItems = document.querySelectorAll(".reveal");
    const projectCards = document.querySelectorAll(".project-card");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const dialog = document.querySelector("[data-project-dialog]");

    function setTheme(theme) {
        body.classList.toggle("dark", theme === "dark");
        themeIcon.textContent = theme === "dark" ? "Light" : "Dark";
        localStorage.setItem("portfolio-theme", theme);
    }

    const savedTheme = localStorage.getItem("portfolio-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(savedTheme || (prefersDark ? "dark" : "light"));

    themeToggle.addEventListener("click", function () {
        setTheme(body.classList.contains("dark") ? "light" : "dark");
    });

    navToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        body.classList.toggle("nav-open", isOpen);
    });

    navLinks.addEventListener("click", function (event) {
        if (event.target.tagName === "A") {
            navLinks.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
            body.classList.remove("nav-open");
        }
    });

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) {
        revealObserver.observe(item);
    });

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const filter = button.dataset.filter;
            filterButtons.forEach(function (item) {
                item.classList.toggle("active", item === button);
            });
            projectCards.forEach(function (card) {
                const categories = card.dataset.category.split(" ");
                card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
            });
        });
    });

    projectCards.forEach(function (card) {
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", "View details for " + card.dataset.title);

        function openProjectDialog() {
            const link = card.dataset.link;
            dialog.querySelector("[data-dialog-image]").src = card.dataset.image;
            dialog.querySelector("[data-dialog-image]").alt = card.dataset.title + " preview";
            dialog.querySelector("[data-dialog-title]").textContent = card.dataset.title;
            dialog.querySelector("[data-dialog-stack]").textContent = card.dataset.stack;
            dialog.querySelector("[data-dialog-description]").textContent = card.dataset.description;
            const dialogLink = dialog.querySelector("[data-dialog-link]");
            dialogLink.href = link || "#";
            dialogLink.hidden = !link;
            dialogLink.textContent = "Visit Project";
            dialog.showModal();
        }

        card.addEventListener("click", function () {
            openProjectDialog();
        });

        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProjectDialog();
            }
        });
    });

    document.querySelector("[data-close-dialog]").addEventListener("click", function () {
        dialog.close();
    });

    dialog.addEventListener("click", function (event) {
        if (event.target === dialog) {
            dialog.close();
        }
    });

    const counters = document.querySelectorAll("[data-count]");
    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
                return;
            }

            const target = Number(entry.target.dataset.count);
            const duration = 900;
            const startedAt = performance.now();

            function tick(now) {
                const progress = Math.min((now - startedAt) / duration, 1);
                entry.target.textContent = Math.round(progress * target);
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    entry.target.textContent = target + "+";
                }
            }

            requestAnimationFrame(tick);
            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.6 });

    counters.forEach(function (counter) {
        counterObserver.observe(counter);
    });

    const copyButton = document.querySelector(".copy-email");
    copyButton.addEventListener("click", async function () {
        const email = copyButton.dataset.email;
        try {
            await navigator.clipboard.writeText(email);
            copyButton.textContent = "Email copied";
        } catch (error) {
            copyButton.textContent = email;
        }
        window.setTimeout(function () {
            copyButton.textContent = "Copy email: " + email;
        }, 1800);
    });

    document.querySelector("[data-year]").textContent = new Date().getFullYear();
})();
