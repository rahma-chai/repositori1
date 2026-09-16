/* SAVORA - RECIPE DETAIL JAVASCRIPT */
/* TheMealDB API */

const API_URL =
    "https://www.themealdb.com/api/json/v1/1";


/* ELEMENT */

const recipeDetail =
    document.getElementById("recipe-detail");

const detailLoading =
    document.getElementById("detail-loading");

const detailError =
    document.getElementById("detail-error");

const detailImage =
    document.getElementById("detail-image");

const detailName =
    document.getElementById("detail-name");

const detailCategory =
    document.getElementById("detail-category");

const detailArea =
    document.getElementById("detail-area");

const metaCategory =
    document.getElementById("meta-category");

const metaArea =
    document.getElementById("meta-area");

const ingredientsContainer =
    document.getElementById(
        "ingredients-container"
    );

const instructionsContainer =
    document.getElementById(
        "instructions-container"
    );

const youtubeLink =
    document.getElementById("youtube-link");

const sourceContainer =
    document.getElementById("source-container");


/* GET RECIPE ID */

function getRecipeId() {

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    return urlParams.get("id");
}


/* LOAD RECIPE */

async function loadRecipe() {

    const recipeId =
        getRecipeId();

    if (!recipeId) {

        showRecipeError();

        return;
    }

    try {

        const response =
            await fetch(
                API_URL +
                "/lookup.php?i=" +
                encodeURIComponent(
                    recipeId
                )
            );

        if (!response.ok) {

            throw new Error(
                "Gagal mengambil data resep."
            );
        }

        const data =
            await response.json();

        if (
            !data.meals ||
            data.meals.length === 0
        ) {

            showRecipeError();

            return;
        }

        const recipe =
            data.meals[0];

        showRecipeDetail(recipe);

    } catch (error) {

        console.error(
            "Recipe Detail:",
            error
        );

        showRecipeError();
    }
}


/* SHOW RECIPE DETAIL */

function showRecipeDetail(recipe) {

    hideLoading();

    if (recipeDetail) {

        recipeDetail.style.display =
            "block";
    }


    /* BASIC INFORMATION */

    detailImage.setAttribute(
        "src",
        recipe.strMealThumb
    );

    detailImage.setAttribute(
        "alt",
        recipe.strMeal
    );

    detailName.textContent =
        recipe.strMeal;

    detailCategory.textContent =
        recipe.strCategory ||
        "International";

    detailArea.textContent =
        recipe.strArea ||
        "International";

    metaCategory.textContent =
        recipe.strCategory ||
        "International";

    metaArea.textContent =
        recipe.strArea ||
        "International";


    /* INGREDIENTS */

    showIngredients(recipe);


    /* INSTRUCTIONS */

    showInstructions(recipe);


    /* YOUTUBE */

    showYoutubeLink(recipe);


    /* SOURCE */

    showSource(recipe);
}


/* SHOW INGREDIENTS */

function showIngredients(recipe) {

    ingredientsContainer.textContent = "";

    for (
        let i = 1;
        i <= 20;
        i++
    ) {

        const ingredient =
            recipe[
                "strIngredient" + i
            ];

        const measure =
            recipe[
                "strMeasure" + i
            ];

        if (
            ingredient &&
            ingredient.trim() !== ""
        ) {

            createIngredientItem(
                ingredient,
                measure
            );
        }
    }
}


/* CREATE INGREDIENT ITEM */

function createIngredientItem(
    ingredient,
    measure
) {

    const item =
        document.createElement("div");

    item.classList.add(
        "ingredient-item"
    );

    const ingredientName =
        document.createElement("span");

    ingredientName.classList.add(
        "ingredient-name"
    );

    ingredientName.textContent =
        ingredient;

    const ingredientMeasure =
        document.createElement("span");

    ingredientMeasure.classList.add(
        "ingredient-measure"
    );

    ingredientMeasure.textContent =
        measure || "-";

    item.appendChild(
        ingredientName
    );

    item.appendChild(
        ingredientMeasure
    );

    ingredientsContainer.appendChild(
        item
    );
}


/* SHOW INSTRUCTIONS */

function showInstructions(recipe) {

    instructionsContainer.textContent = "";

    if (
        !recipe.strInstructions ||
        recipe.strInstructions.trim() === ""
    ) {

        const message =
            document.createElement("p");

        message.classList.add(
            "instruction-text"
        );

        message.textContent =
            "Instructions are not available for this recipe.";

        instructionsContainer.appendChild(
            message
        );

        return;
    }

    const instructions =
        splitInstructions(
            recipe.strInstructions
        );

    for (
        let i = 0;
        i < instructions.length;
        i++
    ) {

        createInstructionItem(
            instructions[i],
            i + 1
        );
    }
}


/* SPLIT INSTRUCTIONS */

function splitInstructions(
    instructions
) {

    const cleanedText =
        instructions
            .replace(/\r/g, "")
            .trim();


    /* NUMBERED INSTRUCTIONS */

    const numberedSteps =
        cleanedText.split(
            /(?=\d+\.\s+)/
        );

    if (
        numberedSteps.length > 1
    ) {

        const steps = [];

        for (
            let i = 0;
            i < numberedSteps.length;
            i++
        ) {

            const step =
                numberedSteps[i]
                    .replace(
                        /^\d+\.\s+/,
                        ""
                    )
                    .trim();

            if (step !== "") {

                steps.push(step);
            }
        }

        return steps;
    }


    /* PARAGRAPH INSTRUCTIONS */

    const paragraphs =
        cleanedText.split(
            /\n\s*\n/
        );

    const validParagraphs = [];

    for (
        let i = 0;
        i < paragraphs.length;
        i++
    ) {

        const paragraph =
            paragraphs[i].trim();

        if (paragraph !== "") {

            validParagraphs.push(
                paragraph
            );
        }
    }


    /* ONE LONG INSTRUCTION */

    if (
        validParagraphs.length === 0
    ) {

        return [
            cleanedText
        ];
    }

    return validParagraphs;
}


/* CREATE INSTRUCTION ITEM */

function createInstructionItem(
    instruction,
    number
) {

    const item =
        document.createElement("div");

    item.classList.add(
        "instruction-item"
    );

    const numberElement =
        document.createElement("span");

    numberElement.classList.add(
        "instruction-number"
    );

    numberElement.textContent =
        String(number).padStart(
            2,
            "0"
        );

    const text =
        document.createElement("p");

    text.classList.add(
        "instruction-text"
    );

    text.textContent =
        instruction;

    item.appendChild(
        numberElement
    );

    item.appendChild(
        text
    );

    instructionsContainer.appendChild(
        item
    );
}


/* YOUTUBE LINK */

function showYoutubeLink(recipe) {

    if (
        recipe.strYoutube &&
        recipe.strYoutube.trim() !== ""
    ) {

        youtubeLink.setAttribute(
            "href",
            recipe.strYoutube
        );

        youtubeLink.style.display =
            "inline-flex";

    } else {

        youtubeLink.style.display =
            "none";
    }
}


/* SOURCE LINK */

function showSource(recipe) {

    sourceContainer.textContent = "";

    if (
        !recipe.strSource ||
        recipe.strSource.trim() === ""
    ) {

        return;
    }

    const sourceLink =
        document.createElement("a");

    sourceLink.classList.add(
        "source-link"
    );

    sourceLink.setAttribute(
        "href",
        recipe.strSource
    );

    sourceLink.setAttribute(
        "target",
        "_blank"
    );

    sourceLink.setAttribute(
        "rel",
        "noopener noreferrer"
    );

    sourceLink.textContent =
        "View Original Recipe";

    const arrow =
        document.createElement("span");

    arrow.classList.add(
        "material-symbols-outlined"
    );

    arrow.textContent =
        "arrow_forward";

    sourceLink.appendChild(
        arrow
    );

    sourceContainer.appendChild(
        sourceLink
    );
}


/* HIDE LOADING */

function hideLoading() {

    if (detailLoading) {

        detailLoading.style.display =
            "none";
    }
}


/* SHOW ERROR */

function showRecipeError() {

    hideLoading();

    if (recipeDetail) {

        recipeDetail.style.display =
            "none";
    }

    if (detailError) {

        detailError.classList.add(
            "show"
        );
    }
}


/* RUN PROGRAM */

loadRecipe();