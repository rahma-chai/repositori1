/* SAVORA - RECIPES JAVASCRIPT */

/* API */
const API_URL = "https://www.themealdb.com/api/json/v1/1";

/* ELEMENT */
const countryTab = document.getElementById("country-tab");
const categoryTab = document.getElementById("category-tab");
const countryFilter = document.getElementById("country-filter");
const categoryFilter = document.getElementById("category-filter");
const countryLetter = document.getElementById("country-letter");
const countryContainer = document.getElementById("country-container");
const categoryContainer = document.getElementById("category-container");
const recipeContainer = document.getElementById("recipe-container");
const recipeLoading = document.getElementById("recipe-loading");
const emptyMessage = document.getElementById("empty-message");
const resultInfo = document.getElementById("result-info");
const recipesSearch = document.getElementById("global-search");

/* DATA */
let allCountries = [];
let currentFilterType = "";
let currentFilterValue = "";

/* INITIALIZE PAGE */
function initializeRecipesPage() {
    setupFilterTabs();
    setupCountryLetter();
    loadCountries();
    loadCategories();
    checkSearchQuery();
}

/* FILTER TABS */
function setupFilterTabs() {
    if (countryTab) {
        countryTab.addEventListener("click", showCountryFilter);
    }
    if (categoryTab) {
        categoryTab.addEventListener("click", showCategoryFilter);
    }
}

/* SHOW COUNTRY FILTER */
function showCountryFilter() {
    countryTab?.classList.add("active");
    categoryTab?.classList.remove("active");
    countryFilter?.classList.add("active");
    categoryFilter?.classList.remove("active");
}

/* SHOW CATEGORY FILTER */
function showCategoryFilter() {
    categoryTab?.classList.add("active");
    countryTab?.classList.remove("active");
    categoryFilter?.classList.add("active");
    countryFilter?.classList.remove("active");
}

/* COUNTRY SELECT */
function setupCountryLetter() {
    if (!countryLetter) return;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    letters.forEach(function(letter) {
        const option = document.createElement("option");
        option.value = letter;
        option.textContent = letter;
        countryLetter.appendChild(option);
    });

    countryLetter.addEventListener("change", function() {
        selectCountryLetter(countryLetter.value);
    });
}

/* LOAD COUNTRIES */
async function loadCountries() {
    try {
        const response = await fetch(API_URL + "/list.php?a=list");

        if (!response.ok) {
            throw new Error("Gagal mengambil data negara.");
        }

        const data = await response.json();

        if (!data.meals || data.meals.length === 0) {
            throw new Error("Data negara tidak ditemukan.");
        }

        allCountries = data.meals.sort(function(a, b) {
            return a.strArea.localeCompare(b.strArea);
        });

        /* HIDE COUNTRIES AT FIRST */
        if (countryContainer) {
            countryContainer.textContent = "";
        }

        if (resultInfo) {
            resultInfo.textContent = "Select a letter to explore countries.";
        }
    } catch (error) {
        console.error("Countries:", error);
        showCountryError();
    }
}

/* SELECT COUNTRY LETTER */ 
function selectCountryLetter(letter) {
    if (!countryContainer) return;

    countryContainer.textContent = "";

    let filteredCountries = [];

    if (letter === "all") {
        filteredCountries = allCountries;
    } else {
        filteredCountries = allCountries.filter(function(country) {
            return country.strArea
                .toUpperCase()
                .startsWith(letter);
        });
    }

    showCountries(filteredCountries);

    if (resultInfo && letter === "all") {
        resultInfo.textContent = "All available countries.";
    }
}

/* SHOW COUNTRIES */
function showCountries(countries) {
    if (!countryContainer) return;

    countryContainer.textContent = "";

    if (countries.length === 0) {
        const message = document.createElement("p");
        message.classList.add("empty-message", "show");
        message.textContent = "No countries found.";
        countryContainer.appendChild(message);
        return;
    }

    countries.forEach(function(country) {
        createCountryItem(country);
    });
}

/* CREATE COUNTRY ITEM */
function createCountryItem(country) {
    const button = document.createElement("button");

    button.type = "button";
    button.classList.add("country-item");
    button.setAttribute("data-country", country.strArea);
    button.textContent = country.strArea;

    button.addEventListener("click", function() {
        selectCountry(country.strArea, button);
    });

    countryContainer.appendChild(button);
}

/* SCROLL TO RECIPES */
function scrollToRecipes() {
    const recipeSection = document.querySelector(".recipe-result");

    if (!recipeSection) return;

    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const sectionPosition =
        recipeSection.getBoundingClientRect().top +
        window.pageYOffset -
        navbarHeight -
        25;

    window.scrollTo({
        top: sectionPosition,
        behavior: "smooth"
    });
}

/* SELECT COUNTRY */
function selectCountry(country, selectedButton) {
    removeActiveCountries();
    removeActiveCategories();

    if (selectedButton) {
        selectedButton.classList.add("active");
    }

    currentFilterType = "country";
    currentFilterValue = country;

    loadRecipesByCountry(country);
    scrollToRecipes();
}

/* REMOVE ACTIVE COUNTRY */
function removeActiveCountries() {
    if (!countryContainer) return;

    const buttons = countryContainer.querySelectorAll(".country-item");

    buttons.forEach(function(button) {
        button.classList.remove("active");
    });
}

/* LOAD CATEGORIES */
async function loadCategories() {
    try {
        const response = await fetch(API_URL + "/categories.php");

        if (!response.ok) {
            throw new Error("Gagal mengambil data kategori.");
        }

        const data = await response.json();

        if (!data.categories || data.categories.length === 0) {
            throw new Error("Data kategori tidak ditemukan.");
        }

        showCategories(data.categories);
    } catch (error) {
        console.error("Categories:", error);
        showCategoryError();
    }
}

/* SHOW CATEGORIES */
function showCategories(categories) {
    if (!categoryContainer) return;

    categoryContainer.textContent = "";

    /* ALL RECIPES */
    const allCard = document.createElement("button");
    allCard.type = "button";
    allCard.classList.add("category-card", "all-recipes");

    const allImage = document.createElement("img");
    allImage.classList.add("category-image");
    allImage.src =
        "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg";
    allImage.alt = "All Recipes";

    const allOverlay = document.createElement("span");
    allOverlay.classList.add("category-overlay");

    const allName = document.createElement("span");
    allName.classList.add("category-name");
    allName.textContent = "All Recipes";

    const allArrow = document.createElement("span");
    allArrow.classList.add(
        "material-symbols-outlined",
        "category-arrow"
    );
    allArrow.textContent = "arrow_forward";

    allOverlay.appendChild(allName);
    allOverlay.appendChild(allArrow);
    allCard.appendChild(allImage);
    allCard.appendChild(allOverlay);

    allCard.addEventListener("click", selectAllRecipes);
    categoryContainer.appendChild(allCard);

    /* CATEGORY CARDS */
    categories.forEach(function(category) {
        createCategoryCard(category);
    });
}

/* CREATE CATEGORY CARD */
function createCategoryCard(category) {
    const card = document.createElement("button");
    card.type = "button";
    card.classList.add("category-card");
    card.setAttribute("data-category", category.strCategory);

    const image = document.createElement("img");
    image.classList.add("category-image");
    image.src = category.strCategoryThumb;
    image.alt = category.strCategory;

    const overlay = document.createElement("span");
    overlay.classList.add("category-overlay");

    const name = document.createElement("span");
    name.classList.add("category-name");
    name.textContent = category.strCategory;

    const arrow = document.createElement("span");
    arrow.classList.add(
        "material-symbols-outlined",
        "category-arrow"
    );
    arrow.textContent = "arrow_forward";

    overlay.appendChild(name);
    overlay.appendChild(arrow);
    card.appendChild(image);
    card.appendChild(overlay);

    card.addEventListener("click", function() {
        selectCategory(category.strCategory);
    });

    categoryContainer.appendChild(card);
}

/* SELECT CATEGORY */
function selectCategory(category) {
    currentFilterType = "category";
    currentFilterValue = category;

    removeActiveCountries();
    removeActiveCategories();

    const selectedCard = categoryContainer.querySelector(
        '[data-category="' + CSS.escape(category) + '"]'
    );

    if (selectedCard) {
        selectedCard.classList.add("active");
    }

    loadRecipesByCategory(category);
    scrollToRecipes();
}

/* REMOVE ACTIVE CATEGORY */
function removeActiveCategories() {
    if (!categoryContainer) return;

    const cards = categoryContainer.querySelectorAll(".category-card");

    cards.forEach(function(card) {
        card.classList.remove("active");
    });
}

/* SELECT ALL RECIPES */
async function selectAllRecipes() {
    currentFilterType = "all";
    currentFilterValue = "All Recipes";

    removeActiveCountries();
    removeActiveCategories();

    const allCard = categoryContainer?.querySelector(".all-recipes");

    if (allCard) {
        allCard.classList.add("active");
    }

    showRecipeLoading("Loading all recipes...");
    scrollToRecipes();

    try {
        const recipes = await getAllRecipes();
        showRecipes(recipes, "All Recipes");
    } catch (error) {
        console.error("All Recipes:", error);
        showRecipeError();
    }
}

/* GET ALL RECIPES */
async function getAllRecipes() {
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    const requests = letters.map(function(letter) {
        return fetch(API_URL + "/search.php?f=" + letter);
    });

    const responses = await Promise.all(requests);
    const recipes = [];

    for (let i = 0; i < responses.length; i++) {
        if (!responses[i].ok) continue;

        const data = await responses[i].json();

        if (data.meals) {
            recipes.push(...data.meals);
        }
    }

    const uniqueRecipes = [];
    const recipeIds = new Set();

    recipes.forEach(function(recipe) {
        if (!recipeIds.has(recipe.idMeal)) {
            recipeIds.add(recipe.idMeal);
            uniqueRecipes.push(recipe);
        }
    });

    return uniqueRecipes;
}

/* LOAD RECIPES BY COUNTRY */
async function loadRecipesByCountry(country) {
    showRecipeLoading("Loading recipes from " + country + "...");

    try {
        const response = await fetch(
            API_URL +
            "/filter.php?a=" +
            encodeURIComponent(country)
        );

        if (!response.ok) {
            throw new Error("Gagal mengambil data resep.");
        }

        const data = await response.json();

        if (!data.meals || data.meals.length === 0) {
            showNoRecipes("No recipes found from " + country + ".");
            return;
        }

        const recipes = await getFullRecipeDetails(data.meals);
        showRecipes(recipes, country);
    } catch (error) {
        console.error("Country Recipes:", error);
        showRecipeError();
    }
}

/* LOAD RECIPES BY CATEGORY */
async function loadRecipesByCategory(category) {
    showRecipeLoading("Loading " + category + " recipes...");

    try {
        const response = await fetch(
            API_URL +
            "/filter.php?c=" +
            encodeURIComponent(category)
        );

        if (!response.ok) {
            throw new Error("Gagal mengambil data resep.");
        }

        const data = await response.json();

        if (!data.meals || data.meals.length === 0) {
            showNoRecipes("No recipes found for " + category + ".");
            return;
        }

        const recipes = await getFullRecipeDetails(data.meals);
        showRecipes(recipes, category);
    } catch (error) {
        console.error("Category Recipes:", error);
        showRecipeError();
    }
}

/* GET FULL RECIPE DETAILS */

async function getFullRecipeDetails(
    recipes
) {
    const detailedRecipes = [];

    for (
        let i = 0;
        i < recipes.length;
        i++
    ) {
        try {
            const response =
                await fetch(
                    API_URL +
                    "/lookup.php?i=" +
                    encodeURIComponent(
                        recipes[i].idMeal
                    )
                );

            if (!response.ok) {
                continue;
            }

            const data =
                await response.json();

            if (
                data.meals &&
                data.meals.length > 0
            ) {
                detailedRecipes.push(
                    data.meals[0]
                );
            }

        } catch (error) {
            console.error(
                "Detail recipe:",
                recipes[i].idMeal,
                error
            );
        }
    }

    return detailedRecipes;
}

/* SHOW RECIPES */
function showRecipes(recipes, selectedValue) {
    if (!recipeContainer) return;

    recipeContainer.textContent = "";
    hideRecipeLoading();
    hideEmptyMessage();

    if (resultInfo) {
        resultInfo.textContent =
            recipes.length +
            " recipes available from " +
            selectedValue +
            ".";
    }

    recipes.forEach(function(recipe) {
        createRecipeCard(recipe);
    });
}

/* CREATE RECIPE CARD */
function createRecipeCard(recipe) {
    const card = document.createElement("article");

    card.classList.add("recipe-card");
    card.setAttribute("tabindex", "0");

    /* IMAGE */
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("recipe-image");

    const image = document.createElement("img");
    image.src = recipe.strMealThumb;
    image.alt = recipe.strMeal;

    imageContainer.appendChild(image);

    /* INFORMATION */
    const info = document.createElement("div");
    info.classList.add("recipe-info");

    /* NAME */
    const name = document.createElement("h3");
    name.classList.add("recipe-name");
    name.textContent = recipe.strMeal;

    /* CATEGORY */
    const category = document.createElement("p");
    category.classList.add("recipe-category");
    category.textContent = recipe.strCategory || "International";

    /* COUNTRY */
    const area = document.createElement("p");
    area.classList.add("recipe-area");
    area.textContent = recipe.strArea || "International";

    /* LINK */
    const link = document.createElement("a");
    link.classList.add("recipe-link");
    link.href =
        "recipe-detail.html?id=" +
        encodeURIComponent(recipe.idMeal);
    link.textContent = "View Recipe";

    /* ARROW */
    const arrow = document.createElement("span");
    arrow.classList.add("material-symbols-outlined");
    arrow.textContent = "arrow_forward";

    link.appendChild(arrow);

    /* BUILD INFO */
    info.appendChild(name);
    info.appendChild(category);
    info.appendChild(area);
    info.appendChild(link);

    /* BUILD CARD */
    card.appendChild(imageContainer);
    card.appendChild(info);

    /* CARD CLICK */
    card.addEventListener("click", function(event) {
        if (event.target.closest(".recipe-link")) return;

        openRecipeDetail(recipe.idMeal);
    });

    /* CARD KEYBOARD */
    card.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openRecipeDetail(recipe.idMeal);
        }
    });

    recipeContainer.appendChild(card);
}

/* OPEN RECIPE DETAIL */
function openRecipeDetail(recipeId) {
    window.location.href =
        "recipe-detail.html?id=" +
        encodeURIComponent(recipeId);
}

/* SHOW LOADING */
function showRecipeLoading(message) {
    if (recipeContainer) {
        recipeContainer.textContent = "";
    }

    hideEmptyMessage();

    if (recipeLoading) {
        recipeLoading.textContent = message;
        recipeLoading.classList.add("show");
    }

    if (resultInfo) {
        resultInfo.textContent = message;
    }
}

/* HIDE LOADING */
function hideRecipeLoading() {
    if (recipeLoading) {
        recipeLoading.classList.remove("show");
    }
}

/* SHOW NO RECIPES */
function showNoRecipes(message) {
    if (recipeContainer) {
        recipeContainer.textContent = "";
    }

    hideRecipeLoading();

    if (emptyMessage) {
        emptyMessage.textContent = message;
        emptyMessage.classList.add("show");
    }

    if (resultInfo) {
        resultInfo.textContent = message;
    }
}

/* HIDE EMPTY MESSAGE */
function hideEmptyMessage() {
    if (emptyMessage) {
        emptyMessage.classList.remove("show");
    }
}

/* SHOW RECIPE ERROR */
function showRecipeError() {
    showNoRecipes(
        "Unable to load recipes. Please try again."
    );
}

/* COUNTRY ERROR */
function showCountryError() {
    if (!countryContainer) return;

    countryContainer.textContent = "";

    const message = document.createElement("p");
    message.classList.add("empty-message", "show");
    message.textContent = "Unable to load countries.";

    countryContainer.appendChild(message);
}

/* CATEGORY ERROR */
function showCategoryError() {
    if (!categoryContainer) return;

    categoryContainer.textContent = "";

    const message = document.createElement("p");
    message.classList.add("empty-message", "show");
    message.textContent = "Unable to load categories.";

    categoryContainer.appendChild(message);
}

/* CHECK SEARCH QUERY */
function checkSearchQuery() {
    const urlParams = new URLSearchParams(
        window.location.search
    );

    const keyword = urlParams.get("search");

    if (!keyword) return;

    if (recipesSearch) {
        recipesSearch.value = keyword;
    }

    searchRecipes(keyword);
}

/* SEARCH RECIPES */
async function searchRecipes(keyword) {
    const cleanKeyword = keyword.trim();

    if (cleanKeyword === "") return;

    showRecipeLoading(
        'Searching for "' +
        cleanKeyword +
        '"...'
    );

    try {
        const response = await fetch(
            API_URL +
            "/search.php?s=" +
            encodeURIComponent(cleanKeyword)
        );

        if (!response.ok) {
            throw new Error("Gagal mencari resep.");
        }

        const data = await response.json();

        if (!data.meals || data.meals.length === 0) {
            showNoRecipes(
                'No recipes found for "' +
                cleanKeyword +
                '".'
            );
            scrollToRecipes();
            return;
        }

        currentFilterType = "search";
        currentFilterValue = cleanKeyword;

        showRecipes(
            data.meals,
            "Search: " + cleanKeyword
        );

        scrollToRecipes();
    } catch (error) {
        console.error("Search Recipes:", error);
        showRecipeError();
    }
}

/* RUN PROGRAM */
initializeRecipesPage();