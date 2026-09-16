/* SAVORA - HOME JAVASCRIPT */

const API_URL =
    "https://www.themealdb.com/api/json/v1/1";

/* ELEMENT */
const recipeCount =
    document.getElementById("recipe-count");
const categoryCount =
    document.getElementById("category-count");
const cuisineCount =
    document.getElementById("cuisine-count");
const heroSliderContainer =
    document.getElementById(
        "hero-slider-container"
    );
const heroSliderDots =
    document.getElementById(
        "hero-slider-dots"
    );
const heroRecipeInfo =
    document.getElementById(
        "hero-recipe-info"
    );
const heroRecipeCategory =
    document.getElementById(
        "hero-recipe-category"
    );
const heroRecipeName =
    document.getElementById(
        "hero-recipe-name"
    );
const heroRecipeArea =
    document.getElementById(
        "hero-recipe-area"
    );
const heroRecipeLink =
    document.getElementById(
        "hero-recipe-link"
    );

/* HERO SLIDER */
let heroRecipes = [];
let currentHeroSlide = 0;
let heroSliderTimer = null;

/* LOAD HERO RECIPES */
async function loadHeroRecipes() {
    if (!heroSliderContainer) {
        return;
    }
    try {
        const requests = [];
        for (let i = 0; i < 4; i++) {
            requests.push(
                fetch(
                    API_URL +
                    "/random.php"
                )
            );
        }
        const responses =
            await Promise.all(
                requests
            );
        heroRecipes = [];
        for (
            let i = 0;
            i < responses.length;
            i++
        ) {
            if (!responses[i].ok) {
                continue;
            }
            const data =
                await responses[i].json();
            if (
                !data.meals ||
                data.meals.length === 0
            ) {
                continue;
            }
            const recipe =
                data.meals[0];
            let duplicate = false;
            for (
                let j = 0;
                j < heroRecipes.length;
                j++
            ) {
                if (
                    heroRecipes[j].idMeal ===
                    recipe.idMeal
                ) {
                    duplicate = true;
                    break;
                }
            }
            if (!duplicate) {
                heroRecipes.push(recipe);
            }
        }
        if (heroRecipes.length === 0) {
            throw new Error(
                "Tidak ada resep yang berhasil diambil."
            );
        }
        currentHeroSlide = 0;
        showHeroRecipes();
        startHeroSlider();
    } catch (error) {
        console.error(
            "Hero Recipes:",
            error
        );
        showHeroError();
    }
}

/* SHOW HERO ERROR */
function showHeroError() {
    heroSliderContainer.textContent = "";
    const message =
        document.createElement("p");
    message.classList.add(
        "loading-message"
    );
    message.textContent =
        "Unable to load recipes.";
    heroSliderContainer.appendChild(
        message
    );
}

/* SHOW HERO RECIPES */
function showHeroRecipes() {
    heroSliderContainer.textContent = "";
    if (heroSliderDots) {
        heroSliderDots.textContent = "";
    }
    for (
        let i = 0;
        i < heroRecipes.length;
        i++
    ) {
        const recipe =
            heroRecipes[i];
        createHeroSlide(
            recipe,
            i
        );
        createHeroDot(i);
    }
    updateHeroRecipeInfo(
        currentHeroSlide
    );
}

/* CREATE HERO SLIDE */
function createHeroSlide(
    recipe,
    index
) {
    const slide =
        document.createElement("div");
    slide.classList.add(
        "hero-slide"
    );
    if (index === 0) {
        slide.classList.add(
            "active"
        );
    }
    const image =
        document.createElement("img");
    image.classList.add(
        "hero-slide-image"
    );
    image.src =
        recipe.strMealThumb;
    image.alt =
        recipe.strMeal;
    slide.appendChild(image);
    heroSliderContainer.appendChild(
        slide
    );
}

/* CREATE HERO DOT */
function createHeroDot(index) {
    if (!heroSliderDots) {
        return;
    }
    const dot =
        document.createElement("button");
    dot.type = "button";
    dot.classList.add(
        "hero-slider-dot"
    );
    dot.setAttribute(
        "aria-label",
        "Show recipe " +
        (index + 1)
    );
    if (index === 0) {
        dot.classList.add(
            "active"
        );
    }
    dot.addEventListener(
        "click",
        function () {
            showHeroSlide(index);
            resetHeroSlider();
        }
    );
    heroSliderDots.appendChild(
        dot
    );
}

/* UPDATE HERO INFORMATION */
function updateHeroRecipeInfo(
    slideIndex
) {
    if (!heroRecipes[slideIndex]) {
        return;
    }
    const recipe =
        heroRecipes[slideIndex];
    if (heroRecipeCategory) {
        heroRecipeCategory.textContent =
            recipe.strCategory ||
            "Recipe";
    }
    if (heroRecipeName) {
        heroRecipeName.textContent =
            recipe.strMeal;
    }

    if (heroRecipeArea) {
        heroRecipeArea.textContent =
            recipe.strArea ||
            "International";
    }

    if (heroRecipeLink) {
        heroRecipeLink.href =
            "html/recipe-detail.html?id=" +
            encodeURIComponent(
                recipe.idMeal
            );
    }

    if (heroRecipeInfo) {
        heroRecipeInfo.classList.remove(
            "active"
        );

        setTimeout(
            function () {
                heroRecipeInfo.classList.add(
                    "active"
                );
            },
            100
        );
    }
}

/* SHOW HERO SLIDE */

function showHeroSlide(
    slideIndex
) {
    const slides =
        heroSliderContainer.children;

    const dots =
        heroSliderDots
            ? heroSliderDots.children
            : [];

    if (
        slideIndex < 0 ||
        slideIndex >= slides.length
    ) {
        return;
    }

    for (
        let i = 0;
        i < slides.length;
        i++
    ) {
        slides[i].classList.remove(
            "active"
        );
    }

    for (
        let i = 0;
        i < dots.length;
        i++
    ) {
        dots[i].classList.remove(
            "active"
        );
    }

    currentHeroSlide =
        slideIndex;

    slides[currentHeroSlide]
        .classList.add("active");

    if (dots[currentHeroSlide]) {
        dots[currentHeroSlide]
            .classList.add("active");
    }

    updateHeroRecipeInfo(
        currentHeroSlide
    );
}

/* START HERO SLIDER */

function startHeroSlider() {
    clearInterval(
        heroSliderTimer
    );

    if (heroRecipes.length <= 1) {
        return;
    }

    heroSliderTimer =
        setInterval(
            function () {
                let nextSlide =
                    currentHeroSlide + 1;

                if (
                    nextSlide >=
                    heroRecipes.length
                ) {
                    nextSlide = 0;
                }

                showHeroSlide(
                    nextSlide
                );
            },
            5000
        );
}

/* RESET HERO SLIDER */

function resetHeroSlider() {
    clearInterval(
        heroSliderTimer
    );

    startHeroSlider();
}

/* LOAD STATISTICS */

async function loadStatistics() {
    try {
        const categoryResponse =
            await fetch(
                API_URL +
                "/categories.php"
            );

        if (!categoryResponse.ok) {
            throw new Error(
                "Gagal mengambil kategori."
            );
        }

        const categoryData =
            await categoryResponse.json();

        const totalCategories =
            categoryData.categories
                ? categoryData.categories.length
                : 0;


        const areaResponse =
            await fetch(
                API_URL +
                "/list.php?a=list"
            );

        if (!areaResponse.ok) {
            throw new Error(
                "Gagal mengambil cuisine."
            );
        }

        const areaData =
            await areaResponse.json();

        const totalCuisines =
            areaData.meals
                ? areaData.meals.length
                : 0;


        if (recipeCount) {
            recipeCount.textContent =
                "100+";
        }

        if (categoryCount) {
            categoryCount.textContent =
                totalCategories + "+";
        }

        if (cuisineCount) {
            cuisineCount.textContent =
                totalCuisines + "+";
        }

    } catch (error) {
        console.error(
            "Statistics:",
            error
        );

        showStatisticsError();
    }
}

/* SHOW STATISTICS ERROR */

function showStatisticsError() {
    if (recipeCount) {
        recipeCount.textContent = "--";
    }

    if (categoryCount) {
        categoryCount.textContent = "--";
    }

    if (cuisineCount) {
        cuisineCount.textContent = "--";
    }
}

/* LOAD HOME */

function loadHome() {
    loadHeroRecipes();
    loadStatistics();
}

/* RUN PROGRAM */

loadHome();