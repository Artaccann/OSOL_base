document.addEventListener("DOMContentLoaded", function () {
    const chapters = document.querySelectorAll(".chapter-section");
    const totalSections = chapters.length;
    const containerWidth = window.innerWidth;

    function distributeSections() {
        let currentShift = 0;
        chapters.forEach((ch, i) => {
            ch.style.width = `${100 / totalSections}%`;
            ch.style.transform = `skewX(-15deg) translateX(${currentShift}px)`;
            currentShift += containerWidth / totalSections;
        });
    }

    chapters.forEach((chapter, index) => {
        chapter.addEventListener("mouseover", function () {
            let remainingWidth = containerWidth;
            let newWidths = [];

            chapters.forEach((ch, i) => {
                if (ch === chapter) {
                    newWidths[i] = 50; // Aktivní sekce se zvětší
                    remainingWidth -= containerWidth * 0.5;
                } else {
                    newWidths[i] = (50 / (totalSections - 1)); // Ostatní se rovnoměrně zmenší
                    remainingWidth -= containerWidth * (50 / (totalSections - 1)) / 100;
                }
            });

            requestAnimationFrame(() => {
                let currentShift = 0;
                chapters.forEach((ch, i) => {
                    ch.style.width = `${newWidths[i]}%`;
                    ch.style.transform = `skewX(-15deg) translateX(${currentShift}px)`;
                    currentShift += parseFloat(newWidths[i]) / 100 * containerWidth;
                });
            });
        });

        chapter.addEventListener("mouseleave", function () {
            requestAnimationFrame(() => {
                distributeSections();
            });
        });
    });

    window.addEventListener("mouseleave", function () {
        distributeSections();
    });

    distributeSections();
});
