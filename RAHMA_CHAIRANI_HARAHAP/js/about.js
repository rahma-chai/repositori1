/* ========================================
   SAVORA - SHARE YOUR TASTE
   TheMealDB REST API
   ======================================== */

/* API */

const API_URL = "https://www.themealdb.com/api/json/v1/1";

/* ELEMENT */

const categoryTrack = document.getElementById("category-track");
const categoryPrev = document.getElementById("category-prev");
const categoryNext = document.getElementById("category-next");
const scrollProgress = document.getElementById("scroll-progress");
const selectedCategoryImage = document.getElementById("selected-category-image");
const recipeIdea = document.getElementById("recipe-idea");
const charCount = document.getElementById("char-count");
const cuisine = document.getElementById("cuisine");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const difficulty = document.getElementById("difficulty");
const shareButton = document.getElementById("share-button");

/* DATA */

let categories = [];
let selectedCategory = "";

/* LOAD CATEGORIES */

async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories.php`);

        if (!response.ok) {
            throw new Error("Gagal mengambil kategori.");
        }

        const data = await response.json();
        categories = data.categories || [];

        displayCategories();

        if (categories.length > 0) {
            selectCategory(categories[0]);
        }
    } catch (error) {
        console.error("Category Error:", error);
        showCategoryError();
    }
}

/* SHOW CATEGORY ERROR */

function showCategoryError() {
    categoryTrack.replaceChildren();

    const errorMessage = document.createElement("p");
    errorMessage.classList.add("api-error");
    errorMessage.textContent = "Unable to load categories.";

    categoryTrack.appendChild(errorMessage);
}

/* DISPLAY CATEGORY CARDS */

function displayCategories() {
    categoryTrack.replaceChildren();

    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];

        const card = document.createElement("button");
        card.type = "button";
        card.classList.add("category-card");
        card.dataset.category = category.strCategory;

        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("category-image");

        const image = document.createElement("img");
        image.src = category.strCategoryThumb;
        image.alt = category.strCategory;
        image.loading = "lazy";

        const name = document.createElement("h3");
        name.classList.add("category-name");
        name.textContent = category.strCategory;

        const check = document.createElement("span");
        check.classList.add("category-check");
        check.textContent = "✓";

        imageWrapper.appendChild(image);
        card.appendChild(imageWrapper);
        card.appendChild(name);
        card.appendChild(check);

        card.addEventListener("click", function() {
            selectCategory(category);
        });

        categoryTrack.appendChild(card);
    }

    updateScrollProgress();
    updateArrowState();
}

/* SELECT CATEGORY */

function selectCategory(category) {
    selectedCategory = category.strCategory;

    const cards = document.querySelectorAll(".category-card");

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];

        card.classList.remove("active");

        if (card.dataset.category === selectedCategory) {
            card.classList.add("active");
        }
    }

    selectedCategoryImage.src = category.strCategoryThumb;
    selectedCategoryImage.alt = `${selectedCategory} category`;

    updatePlaceholder();
}

/* UPDATE PLACEHOLDER */

function updatePlaceholder() {
    const examples = {
        Beef: "Example: a tender beef dish with rich sauce...",
        Breakfast: "Example: an easy breakfast for busy mornings...",
        Chicken: "Example: creamy chicken with herbs and mushrooms...",
        Dessert: "Example: a chocolate dessert that's easy to make...",
        Goat: "Example: a flavorful goat curry from around the world...",
        Lamb: "Example: a tender lamb dish with aromatic spices...",
        Miscellaneous: "Example: something unique and delicious to discover...",
        Pasta: "Example: creamy pasta with chicken and mushrooms...",
        Pork: "Example: a comforting pork recipe with rich flavors...",
        Seafood: "Example: a fresh seafood dish with a simple sauce...",
        Side: "Example: an easy side dish for a family dinner...",
        Starter: "Example: an elegant starter for a dinner party...",
        Vegan: "Example: a flavorful vegan meal full of vegetables...",
        Vegetarian: "Example: a delicious vegetarian meal for dinner..."
    };

    recipeIdea.placeholder =
        examples[selectedCategory] ||
        "Tell us what you'd love to discover...";
}

/* LOAD CUISINES */

async function loadCuisines() {
    try {
        const response = await fetch(`${API_URL}/list.php?a=list`);

        if (!response.ok) {
            throw new Error("Gagal mengambil daftar cuisine.");
        }

        const data = await response.json();
        const areas = data.meals || [];

        for (let i = 0; i < areas.length; i++) {
            const option = document.createElement("option");

            option.value = areas[i].strArea;
            option.textContent = areas[i].strArea;

            cuisine.appendChild(option);
        }
    } catch (error) {
        console.error("Cuisine Error:", error);
    }
}

/* CATEGORY SCROLL - NEXT */

categoryNext.addEventListener("click", function() {
    categoryTrack.scrollBy({
        left: 600,
        behavior: "smooth"
    });
});

/* CATEGORY SCROLL - PREVIOUS */

categoryPrev.addEventListener("click", function() {
    categoryTrack.scrollBy({
        left: -600,
        behavior: "smooth"
    });
});

/* UPDATE SCROLL PROGRESS */

function updateScrollProgress() {
    const scrollWidth = categoryTrack.scrollWidth;
    const clientWidth = categoryTrack.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) {
        scrollProgress.style.width = "100%";
        return;
    }

    const percentage =
        (categoryTrack.scrollLeft / maxScroll) * 100;

    const minimum = 18;
    const maximum = 100;

    const width =
        minimum +
        ((maximum - minimum) * (percentage / 100));

    scrollProgress.style.width = `${width}%`;
}

/* UPDATE ARROW STATE */

function updateArrowState() {
    const maxScroll =
        categoryTrack.scrollWidth -
        categoryTrack.clientWidth;

    if (maxScroll <= 2) {
        categoryPrev.classList.add("hidden");
        categoryNext.classList.add("hidden");
        return;
    }

    if (categoryTrack.scrollLeft <= 2) {
        categoryPrev.classList.add("hidden");
    } else {
        categoryPrev.classList.remove("hidden");
    }

    if (categoryTrack.scrollLeft >= maxScroll - 2) {
        categoryNext.classList.add("hidden");
    } else {
        categoryNext.classList.remove("hidden");
    }
}

/* TRACK CATEGORY SCROLL*/

categoryTrack.addEventListener("scroll", function() {
    updateArrowState();
    updateScrollProgress();
});

/* WINDOW RESIZE */

window.addEventListener("resize", function() {
    updateArrowState();
    updateScrollProgress();
});

/* CHARACTER COUNTER */

recipeIdea.addEventListener("input", function() {
    charCount.textContent = recipeIdea.value.length;
});

/* EMAIL VALIDATION */

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* SHARE BUTTON */

shareButton.addEventListener("click", function() {
    const name = userName.value.trim();
    const email = userEmail.value.trim();
    const idea = recipeIdea.value.trim();

    /* NAME */

    if (!name) {
        alert("Please enter your name.");
        userName.focus();
        return;
    }

    /* EMAIL */

    if (!email) {
        alert("Please enter your email.");
        userEmail.focus();
        return;
    } 

    /* EMAIL FORMAT */

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        userEmail.focus();
        return;
    }

    /* RECIPE IDEA */

    if (!idea) {
        alert(
            "Please tell us what kind of recipe you're looking for."
        );
        recipeIdea.focus();
        return;
    }

    /* SUCCESS */

    alert(
        `Thank you, ${name}! ♡\n\n` +
        `Category: ${selectedCategory || "Not specified"}\n` +
        `Cuisine: ${cuisine.value || "Not specified"}\n` +
        `Difficulty: ${difficulty.value || "Not specified"}\n\n` +
        `Your taste has been shared with SAVORA.`
    );
});

/* START */

loadCategories();
loadCuisines();