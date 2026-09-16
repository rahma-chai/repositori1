/* SAVORA GLOBAL JAVASCRIPT */

/* NAVBAR */
const navbar =
    document.querySelector(".navbar");
if (navbar) {
    window.addEventListener(
        "scroll",
        function () {
            if (window.scrollY > 20) {
                navbar.classList.add(
                    "scrolled"
                );
            } else {
                navbar.classList.remove(
                    "scrolled"
                );
            }
        }
    );
}

/* GLOBAL SEARCH */

const searchForm =
    document.querySelector(
        ".navbar-search-form"
    );
const globalSearch =
    document.querySelector(
        ".navbar-search"
    );
if (searchForm && globalSearch) {
    searchForm.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();
            const keyword =
                globalSearch.value.trim();
            if (keyword === "") {
                return;
            }
            window.location.href =
                getRecipesPagePath() +
                "?search=" +
                encodeURIComponent(
                    keyword
                );
        }
    );
}

/* RECIPES PAGE PATH */

function getRecipesPagePath() {
    const currentPath =
        window.location.pathname;
    if (
        currentPath.includes(
            "/html/"
        )
    ) {
        return "recipes.html";
    }
    return "html/recipes.html";
}