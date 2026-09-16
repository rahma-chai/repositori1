/* SAVORA - RECIPE DETAIL JAVASCRIPT */
/* TheMealDB API */

// URL dasar (base URL) untuk mengakses TheMealDB API versi 1
const API_URL =
    "https://www.themealdb.com/api/json/v1/1";


/* ELEMENT */

// Mengambil elemen pembungkus utama konten detail resep
const recipeDetail =
    document.getElementById("recipe-detail");

// Mengambil elemen indikator loading saat data resep sedang dimuat
const detailLoading =
    document.getElementById("detail-loading");

// Mengambil elemen pesan error yang tampil jika resep gagal dimuat
const detailError =
    document.getElementById("detail-error");

// Mengambil elemen gambar utama resep
const detailImage =
    document.getElementById("detail-image");

// Mengambil elemen judul/nama resep
const detailName =
    document.getElementById("detail-name");

// Mengambil elemen teks kategori resep (versi utama, misal di dekat judul)
const detailCategory =
    document.getElementById("detail-category");

// Mengambil elemen teks asal negara resep (versi utama)
const detailArea =
    document.getElementById("detail-area");

// Mengambil elemen teks kategori resep (versi meta/info tambahan)
const metaCategory =
    document.getElementById("meta-category");

// Mengambil elemen teks asal negara resep (versi meta/info tambahan)
const metaArea =
    document.getElementById("meta-area");

// Mengambil elemen container tempat daftar bahan-bahan ditampilkan
const ingredientsContainer =
    document.getElementById(
        "ingredients-container"
    );

// Mengambil elemen container tempat langkah-langkah instruksi ditampilkan
const instructionsContainer =
    document.getElementById(
        "instructions-container"
    );

// Mengambil elemen link ke video YouTube resep
const youtubeLink =
    document.getElementById("youtube-link");

// Mengambil elemen container tempat link sumber resep asli ditampilkan
const sourceContainer =
    document.getElementById("source-container");


/* GET RECIPE ID */

// Fungsi untuk mengambil ID resep dari parameter URL
function getRecipeId() {

    // Mengambil semua parameter query dari URL saat ini
    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    // Mengembalikan nilai parameter "id", atau null jika tidak ada
    return urlParams.get("id");
}


/* LOAD RECIPE */

// Fungsi asynchronous untuk mengambil data detail resep berdasarkan ID di URL
async function loadRecipe() {

    // Mengambil ID resep dari URL
    const recipeId =
        getRecipeId();

    // Jika ID tidak ditemukan di URL
    if (!recipeId) {

        // Tampilkan pesan error
        showRecipeError();

        // Hentikan fungsi
        return;
    }

    try {

        // Melakukan request untuk mengambil detail resep berdasarkan ID (i = id lookup)
        const response =
            await fetch(
                API_URL +
                "/lookup.php?i=" +
                encodeURIComponent(
                    recipeId
                )
            );

        // Jika response gagal, lempar error
        if (!response.ok) {

            throw new Error(
                "Gagal mengambil data resep."
            );
        }

        // Mengubah response menjadi JSON
        const data =
            await response.json();

        // Jika tidak ada data resep yang ditemukan (misal ID tidak valid)
        if (
            !data.meals ||
            data.meals.length === 0
        ) {

            // Tampilkan pesan error
            showRecipeError();

            // Hentikan fungsi
            return;
        }

        // Mengambil resep pertama (dan satu-satunya) dari hasil lookup
        const recipe =
            data.meals[0];

        // Menampilkan seluruh detail resep ke halaman
        showRecipeDetail(recipe);

    } catch (error) {

        // Mencatat error ke console untuk debugging
        console.error(
            "Recipe Detail:",
            error
        );

        // Menampilkan pesan error ke UI
        showRecipeError();
    }
}


/* SHOW RECIPE DETAIL */

// Fungsi untuk menampilkan seluruh bagian detail resep (gambar, info, bahan, instruksi, dll)
function showRecipeDetail(recipe) {

    // Menyembunyikan indikator loading
    hideLoading();

    // Jika elemen pembungkus detail ada, tampilkan (karena sebelumnya mungkin disembunyikan saat loading)
    if (recipeDetail) {

        recipeDetail.style.display =
            "block";
    }


    /* BASIC INFORMATION */

    // Mengatur sumber gambar utama sesuai data resep
    detailImage.setAttribute(
        "src",
        recipe.strMealThumb
    );

    // Mengatur teks alternatif gambar sesuai nama resep
    detailImage.setAttribute(
        "alt",
        recipe.strMeal
    );

    // Mengisi judul/nama resep
    detailName.textContent =
        recipe.strMeal;

    // Mengisi teks kategori (versi utama), default "International" jika kosong
    detailCategory.textContent =
        recipe.strCategory ||
        "International";

    // Mengisi teks area/negara (versi utama), default "International" jika kosong
    detailArea.textContent =
        recipe.strArea ||
        "International";

    // Mengisi teks kategori (versi meta), default "International" jika kosong
    metaCategory.textContent =
        recipe.strCategory ||
        "International";

    // Mengisi teks area/negara (versi meta), default "International" jika kosong
    metaArea.textContent =
        recipe.strArea ||
        "International";


    /* INGREDIENTS */

    // Menampilkan daftar bahan-bahan resep
    showIngredients(recipe);


    /* INSTRUCTIONS */

    // Menampilkan langkah-langkah instruksi memasak
    showInstructions(recipe);


    /* YOUTUBE */

    // Menampilkan (atau menyembunyikan) link video YouTube
    showYoutubeLink(recipe);


    /* SOURCE */

    // Menampilkan (atau menyembunyikan) link sumber resep asli
    showSource(recipe);
}


/* SHOW INGREDIENTS */

// Fungsi untuk menampilkan seluruh bahan resep ke dalam container
function showIngredients(recipe) {

    // Mengosongkan container bahan sebelum diisi ulang
    ingredientsContainer.textContent = "";

    // Melakukan perulangan dari 1 sampai 20,
    // karena API TheMealDB menyimpan bahan sebagai strIngredient1, strIngredient2, dst (maksimal 20)
    for (
        let i = 1;
        i <= 20;
        i++
    ) {

        // Mengambil nama bahan ke-i menggunakan akses properti dinamis
        const ingredient =
            recipe[
                "strIngredient" + i
            ];

        // Mengambil takaran/ukuran bahan ke-i menggunakan akses properti dinamis
        const measure =
            recipe[
                "strMeasure" + i
            ];

        // Jika nama bahan ada isinya (bukan kosong/null)
        if (
            ingredient &&
            ingredient.trim() !== ""
        ) {

            // Buat satu baris/item bahan untuk ditampilkan
            createIngredientItem(
                ingredient,
                measure
            );
        }
    }
}


/* CREATE INGREDIENT ITEM */

// Fungsi untuk membuat satu elemen baris bahan (nama + takaran)
function createIngredientItem(
    ingredient,
    measure
) {

    // Membuat elemen div sebagai pembungkus satu item bahan
    const item =
        document.createElement("div");

    // Menambahkan class CSS untuk item bahan
    item.classList.add(
        "ingredient-item"
    );

    // Membuat elemen span untuk nama bahan
    const ingredientName =
        document.createElement("span");

    // Menambahkan class CSS pada nama bahan
    ingredientName.classList.add(
        "ingredient-name"
    );

    // Mengisi teks dengan nama bahan
    ingredientName.textContent =
        ingredient;

    // Membuat elemen span untuk takaran bahan
    const ingredientMeasure =
        document.createElement("span");

    // Menambahkan class CSS pada takaran bahan
    ingredientMeasure.classList.add(
        "ingredient-measure"
    );

    // Mengisi teks takaran, atau tanda "-" jika takaran tidak tersedia
    ingredientMeasure.textContent =
        measure || "-";

    // Memasukkan nama bahan ke dalam item
    item.appendChild(
        ingredientName
    );

    // Memasukkan takaran bahan ke dalam item
    item.appendChild(
        ingredientMeasure
    );

    // Menambahkan item ke dalam container bahan
    ingredientsContainer.appendChild(
        item
    );
}


/* SHOW INSTRUCTIONS */

// Fungsi untuk menampilkan langkah-langkah instruksi memasak
function showInstructions(recipe) {

    // Mengosongkan container instruksi sebelum diisi ulang
    instructionsContainer.textContent = "";

    // Jika data instruksi tidak ada atau kosong
    if (
        !recipe.strInstructions ||
        recipe.strInstructions.trim() === ""
    ) {

        // Membuat elemen paragraf untuk pesan bahwa instruksi tidak tersedia
        const message =
            document.createElement("p");

        // Menambahkan class CSS pada pesan
        message.classList.add(
            "instruction-text"
        );

        // Mengisi teks pesan
        message.textContent =
            "Instructions are not available for this recipe.";

        // Memasukkan pesan ke dalam container instruksi
        instructionsContainer.appendChild(
            message
        );

        // Hentikan fungsi karena tidak ada instruksi untuk diproses lebih lanjut
        return;
    }

    // Memecah teks instruksi mentah menjadi array langkah-langkah terpisah
    const instructions =
        splitInstructions(
            recipe.strInstructions
        );

    // Melakukan perulangan untuk setiap langkah instruksi
    for (
        let i = 0;
        i < instructions.length;
        i++
    ) {

        // Membuat elemen tampilan untuk satu langkah instruksi,
        // dengan nomor urut dimulai dari 1 (index + 1)
        createInstructionItem(
            instructions[i],
            i + 1
        );
    }
}


/* SPLIT INSTRUCTIONS */

// Fungsi untuk memecah teks instruksi mentah (satu string panjang) menjadi array langkah-langkah
function splitInstructions(
    instructions
) {

    // Menghapus karakter carriage return (\r) dan spasi berlebih di awal/akhir teks
    const cleanedText =
        instructions
            .replace(/\r/g, "")
            .trim();


    /* NUMBERED INSTRUCTIONS */

    // Mencoba memecah teks berdasarkan pola penomoran seperti "1. ", "2. ", dst
    // (lookahead regex: memecah tepat sebelum pola angka+titik+spasi ditemukan)
    const numberedSteps =
        cleanedText.split(
            /(?=\d+\.\s+)/
        );

    // Jika hasil pemecahan lebih dari 1 bagian, berarti teks memang menggunakan format bernomor
    if (
        numberedSteps.length > 1
    ) {

        // Array untuk menampung langkah-langkah yang sudah dibersihkan
        const steps = [];

        // Melakukan perulangan untuk setiap potongan hasil split
        for (
            let i = 0;
            i < numberedSteps.length;
            i++
        ) {

            // Menghapus prefix nomor (misal "1. ") dari awal teks, lalu trim spasi
            const step =
                numberedSteps[i]
                    .replace(
                        /^\d+\.\s+/,
                        ""
                    )
                    .trim();

            // Jika hasilnya tidak kosong, masukkan ke array steps
            if (step !== "") {

                steps.push(step);
            }
        }

        // Mengembalikan array langkah-langkah bernomor
        return steps;
    }


    /* PARAGRAPH INSTRUCTIONS */

    // Jika teks tidak menggunakan format bernomor, coba pecah berdasarkan baris kosong ganda (antar paragraf)
    const paragraphs =
        cleanedText.split(
            /\n\s*\n/
        );

    // Array untuk menampung paragraf yang valid (tidak kosong)
    const validParagraphs = [];

    // Melakukan perulangan untuk setiap paragraf hasil split
    for (
        let i = 0;
        i < paragraphs.length;
        i++
    ) {

        // Menghapus spasi berlebih di awal/akhir paragraf
        const paragraph =
            paragraphs[i].trim();

        // Jika paragraf tidak kosong, masukkan ke array validParagraphs
        if (paragraph !== "") {

            validParagraphs.push(
                paragraph
            );
        }
    }


    /* ONE LONG INSTRUCTION */

    // Jika setelah dipecah tidak ada satupun paragraf valid (misal teks tanpa baris kosong sama sekali)
    if (
        validParagraphs.length === 0
    ) {

        // Kembalikan seluruh teks sebagai satu langkah instruksi tunggal
        return [
            cleanedText
        ];
    }

    // Mengembalikan array paragraf yang sudah valid sebagai langkah-langkah instruksi
    return validParagraphs;
}


/* CREATE INSTRUCTION ITEM */

// Fungsi untuk membuat satu elemen tampilan langkah instruksi (nomor + teks)
function createInstructionItem(
    instruction,
    number
) {

    // Membuat elemen div sebagai pembungkus satu langkah instruksi
    const item =
        document.createElement("div");

    // Menambahkan class CSS pada item instruksi
    item.classList.add(
        "instruction-item"
    );

    // Membuat elemen span untuk menampilkan nomor langkah
    const numberElement =
        document.createElement("span");

    // Menambahkan class CSS pada elemen nomor
    numberElement.classList.add(
        "instruction-number"
    );

    // Mengisi teks nomor, diformat 2 digit dengan tambahan angka 0 di depan jika perlu (misal "01", "02")
    numberElement.textContent =
        String(number).padStart(
            2,
            "0"
        );

    // Membuat elemen paragraf untuk teks instruksi
    const text =
        document.createElement("p");

    // Menambahkan class CSS pada teks instruksi
    text.classList.add(
        "instruction-text"
    );

    // Mengisi teks dengan isi instruksi langkah ini
    text.textContent =
        instruction;

    // Memasukkan elemen nomor ke dalam item
    item.appendChild(
        numberElement
    );

    // Memasukkan elemen teks ke dalam item
    item.appendChild(
        text
    );

    // Menambahkan item ke dalam container instruksi
    instructionsContainer.appendChild(
        item
    );
}


/* YOUTUBE LINK */

// Fungsi untuk menampilkan atau menyembunyikan link video YouTube
function showYoutubeLink(recipe) {

    // Jika data link YouTube ada dan tidak kosong
    if (
        recipe.strYoutube &&
        recipe.strYoutube.trim() !== ""
    ) {

        // Mengatur alamat tujuan link sesuai URL YouTube dari data resep
        youtubeLink.setAttribute(
            "href",
            recipe.strYoutube
        );

        // Menampilkan elemen link (menggunakan display inline-flex)
        youtubeLink.style.display =
            "inline-flex";

    } else {

        // Jika tidak ada link YouTube, sembunyikan elemen link
        youtubeLink.style.display =
            "none";
    }
}


/* SOURCE LINK */

// Fungsi untuk menampilkan link sumber resep asli (jika tersedia)
function showSource(recipe) {

    // Mengosongkan container sumber sebelum diisi ulang
    sourceContainer.textContent = "";

    // Jika data sumber tidak ada atau kosong
    if (
        !recipe.strSource ||
        recipe.strSource.trim() === ""
    ) {

        // Hentikan fungsi (tidak menampilkan apapun)
        return;
    }

    // Membuat elemen link untuk sumber resep
    const sourceLink =
        document.createElement("a");

    // Menambahkan class CSS pada link sumber
    sourceLink.classList.add(
        "source-link"
    );

    // Mengatur alamat tujuan link sesuai URL sumber dari data resep
    sourceLink.setAttribute(
        "href",
        recipe.strSource
    );

    // Mengatur agar link dibuka di tab baru
    sourceLink.setAttribute(
        "target",
        "_blank"
    );

    // Menambahkan atribut keamanan agar tab baru tidak bisa mengakses window asal
    // (mencegah celah keamanan reverse tabnabbing)
    sourceLink.setAttribute(
        "rel",
        "noopener noreferrer"
    );

    // Mengisi teks link
    sourceLink.textContent =
        "View Original Recipe";

    // Membuat elemen ikon panah
    const arrow =
        document.createElement("span");

    // Menambahkan class ikon material symbols
    arrow.classList.add(
        "material-symbols-outlined"
    );

    // Mengisi teks ikon dengan "arrow_forward"
    arrow.textContent =
        "arrow_forward";

    // Memasukkan ikon panah ke dalam link
    sourceLink.appendChild(
        arrow
    );

    // Menambahkan link sumber ke dalam container sumber
    sourceContainer.appendChild(
        sourceLink
    );
}


/* HIDE LOADING */

// Fungsi untuk menyembunyikan indikator loading
function hideLoading() {

    // Jika elemen loading ada, sembunyikan dengan mengatur display ke "none"
    if (detailLoading) {

        detailLoading.style.display =
            "none";
    }
}


/* SHOW ERROR */

// Fungsi untuk menampilkan tampilan error saat resep gagal dimuat
function showRecipeError() {

    // Menyembunyikan indikator loading
    hideLoading();

    // Jika elemen pembungkus detail resep ada, sembunyikan (karena data gagal dimuat)
    if (recipeDetail) {

        recipeDetail.style.display =
            "none";
    }

    // Jika elemen pesan error ada, tampilkan dengan menambah class "show"
    if (detailError) {

        detailError.classList.add(
            "show"
        );
    }
}


/* RUN PROGRAM */

// Menjalankan fungsi loadRecipe saat script pertama kali dimuat
loadRecipe();