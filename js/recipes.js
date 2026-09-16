
// Recipes commented · JS
/* SAVORA - RECIPES JAVASCRIPT */
 
/* API */
// URL dasar (base URL) untuk mengakses TheMealDB API versi 1
const API_URL = "https://www.themealdb.com/api/json/v1/1";
 
/* ELEMENT */
// Mengambil elemen tab "Country" dari HTML berdasarkan id
const countryTab = document.getElementById("country-tab");
// Mengambil elemen tab "Category" dari HTML berdasarkan id
const categoryTab = document.getElementById("category-tab");
// Mengambil elemen wadah/panel filter negara
const countryFilter = document.getElementById("country-filter");
// Mengambil elemen wadah/panel filter kategori
const categoryFilter = document.getElementById("category-filter");
// Mengambil elemen dropdown/select huruf untuk memilih negara
const countryLetter = document.getElementById("country-letter");
// Mengambil elemen container tempat daftar tombol negara ditampilkan
const countryContainer = document.getElementById("country-container");
// Mengambil elemen container tempat daftar kartu kategori ditampilkan
const categoryContainer = document.getElementById("category-container");
// Mengambil elemen container tempat kartu-kartu resep ditampilkan
const recipeContainer = document.getElementById("recipe-container");
// Mengambil elemen indikator loading saat resep sedang dimuat
const recipeLoading = document.getElementById("recipe-loading");
// Mengambil elemen pesan kosong (ditampilkan jika resep tidak ditemukan)
const emptyMessage = document.getElementById("empty-message");
// Mengambil elemen teks info hasil (misal: jumlah resep yang tampil)
const resultInfo = document.getElementById("result-info");
// Mengambil elemen input pencarian global
const recipesSearch = document.getElementById("global-search");
 
/* DATA */
// Array untuk menyimpan seluruh data negara yang diambil dari API (awalnya kosong)
let allCountries = [];
// Menyimpan jenis filter yang sedang aktif: "country", "category", "all", atau "search"
let currentFilterType = "";
// Menyimpan nilai filter yang sedang aktif (nama negara/kategori/kata kunci pencarian)
let currentFilterValue = "";
 
/* INITIALIZE PAGE */
// Fungsi utama yang dijalankan saat halaman pertama kali dimuat
function initializeRecipesPage() {
    // Memasang event listener pada tab Country & Category
    setupFilterTabs();
    // Mengisi dropdown huruf A-Z untuk filter negara
    setupCountryLetter();
    // Mengambil daftar negara dari API
    loadCountries();
    // Mengambil daftar kategori dari API
    loadCategories();
    // Mengecek apakah ada parameter pencarian di URL, lalu jalankan pencarian jika ada
    checkSearchQuery();
}
 
/* FILTER TABS */
// Fungsi untuk memasang event click pada tab filter
function setupFilterTabs() {
    // Jika tombol tab Country ada, pasang event klik untuk menampilkan filter negara
    if (countryTab) {
        countryTab.addEventListener("click", showCountryFilter);
    }
    // Jika tombol tab Category ada, pasang event klik untuk menampilkan filter kategori
    if (categoryTab) {
        categoryTab.addEventListener("click", showCategoryFilter);
    }
}
 
/* SHOW COUNTRY FILTER */
// Menampilkan panel filter negara dan menyembunyikan panel kategori
function showCountryFilter() {
    // Menambahkan class "active" pada tab Country (menandakan sedang dipilih)
    countryTab?.classList.add("active");
    // Menghapus class "active" dari tab Category
    categoryTab?.classList.remove("active");
    // Menampilkan panel/section filter negara
    countryFilter?.classList.add("active");
    // Menyembunyikan panel/section filter kategori
    categoryFilter?.classList.remove("active");
}
 
/* SHOW CATEGORY FILTER */
// Menampilkan panel filter kategori dan menyembunyikan panel negara
function showCategoryFilter() {
    // Menambahkan class "active" pada tab Category
    categoryTab?.classList.add("active");
    // Menghapus class "active" dari tab Country
    countryTab?.classList.remove("active");
    // Menampilkan panel/section filter kategori
    categoryFilter?.classList.add("active");
    // Menyembunyikan panel/section filter negara
    countryFilter?.classList.remove("active");
}
 
/* COUNTRY SELECT */
// Mengisi dropdown huruf A-Z untuk memilih negara berdasarkan huruf awal
function setupCountryLetter() {
    // Jika elemen dropdown huruf tidak ada, hentikan fungsi
    if (!countryLetter) return;
 
    // Membuat array berisi huruf A sampai Z
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
 
    // Melakukan perulangan untuk setiap huruf
    letters.forEach(function(letter) {
        // Membuat elemen <option> baru untuk dropdown
        const option = document.createElement("option");
        // Mengatur value option sesuai huruf
        option.value = letter;
        // Mengatur teks yang ditampilkan sesuai huruf
        option.textContent = letter;
        // Menambahkan option tersebut ke dalam dropdown
        countryLetter.appendChild(option);
    });
 
    // Memasang event saat pilihan dropdown berubah
    countryLetter.addEventListener("change", function() {
        // Memanggil fungsi untuk memfilter negara sesuai huruf yang dipilih
        selectCountryLetter(countryLetter.value);
    });
}
 
/* LOAD COUNTRIES */
// Fungsi asynchronous untuk mengambil daftar semua negara dari API
async function loadCountries() {
    try {
        // Melakukan request ke endpoint list negara (a=list artinya "area list")
        const response = await fetch(API_URL + "/list.php?a=list");
 
        // Jika response tidak berhasil (misal error server), lempar error
        if (!response.ok) {
            throw new Error("Gagal mengambil data negara.");
        }
 
        // Mengubah response menjadi objek JSON
        const data = await response.json();
 
        // Jika data negara kosong atau tidak ada, lempar error
        if (!data.meals || data.meals.length === 0) {
            throw new Error("Data negara tidak ditemukan.");
        }
 
        // Mengurutkan data negara berdasarkan abjad nama negara (strArea)
        allCountries = data.meals.sort(function(a, b) {
            return a.strArea.localeCompare(b.strArea);
        });
 
        /* HIDE COUNTRIES AT FIRST */
        // Mengosongkan container negara agar tidak menampilkan apapun di awal
        if (countryContainer) {
            countryContainer.textContent = "";
        }
 
        // Menampilkan pesan instruksi awal kepada pengguna
        if (resultInfo) {
            resultInfo.textContent = "Select a letter to explore countries.";
        }
    } catch (error) {
        // Menampilkan error ke console untuk keperluan debugging
        console.error("Countries:", error);
        // Menampilkan pesan error ke tampilan (UI)
        showCountryError();
    }
}
 
/* SELECT COUNTRY LETTER */ 
// Fungsi untuk memfilter dan menampilkan negara berdasarkan huruf yang dipilih
function selectCountryLetter(letter) {
    // Jika container negara tidak ada, hentikan fungsi
    if (!countryContainer) return;
 
    // Mengosongkan isi container negara sebelum diisi ulang
    countryContainer.textContent = "";
 
    // Variabel untuk menampung hasil negara yang sudah difilter
    let filteredCountries = [];
 
    // Jika huruf yang dipilih adalah "all", tampilkan semua negara
    if (letter === "all") {
        filteredCountries = allCountries;
    } else {
        // Jika tidak, filter negara yang namanya diawali huruf tersebut
        filteredCountries = allCountries.filter(function(country) {
            return country.strArea
                .toUpperCase()
                .startsWith(letter);
        });
    }
 
    // Menampilkan hasil negara yang sudah difilter ke halaman
    showCountries(filteredCountries);
 
    // Jika filter yang dipilih "all", ubah teks info hasil
    if (resultInfo && letter === "all") {
        resultInfo.textContent = "All available countries.";
    }
}
 
/* SHOW COUNTRIES */
// Fungsi untuk menampilkan daftar tombol negara ke dalam container
function showCountries(countries) {
    // Jika container tidak ditemukan, hentikan fungsi
    if (!countryContainer) return;
 
    // Mengosongkan container sebelum diisi
    countryContainer.textContent = "";
 
    // Jika tidak ada negara yang ditemukan
    if (countries.length === 0) {
        // Membuat elemen paragraf untuk pesan kosong
        const message = document.createElement("p");
        // Menambahkan class styling untuk pesan kosong dan menampilkannya
        message.classList.add("empty-message", "show");
        // Mengisi teks pesan
        message.textContent = "No countries found.";
        // Memasukkan pesan ke dalam container
        countryContainer.appendChild(message);
        // Menghentikan fungsi karena tidak ada data untuk ditampilkan
        return;
    }
 
    // Melakukan perulangan untuk setiap negara, lalu membuat tombolnya
    countries.forEach(function(country) {
        createCountryItem(country);
    });
}
 
/* CREATE COUNTRY ITEM */
// Fungsi untuk membuat satu tombol negara
function createCountryItem(country) {
    // Membuat elemen <button>
    const button = document.createElement("button");
 
    // Mengatur tipe tombol menjadi "button" (bukan submit)
    button.type = "button";
    // Menambahkan class CSS untuk styling tombol negara
    button.classList.add("country-item");
    // Menyimpan nama negara sebagai atribut data (untuk referensi)
    button.setAttribute("data-country", country.strArea);
    // Mengisi teks tombol dengan nama negara
    button.textContent = country.strArea;
 
    // Memasang event klik pada tombol
    button.addEventListener("click", function() {
        // Memanggil fungsi untuk memilih negara ini
        selectCountry(country.strArea, button);
    });
 
    // Menambahkan tombol ke dalam container negara
    countryContainer.appendChild(button);
}
 
/* SCROLL TO RECIPES */
 
// Fungsi untuk melakukan scroll halus ke bagian hasil resep
function scrollToRecipes() {
 
    // querySelector() digunakan untuk mengambil elemen HTML
    // berdasarkan selector CSS.
    const recipeSection = document.querySelector(".recipe-result");
 
    // Jika elemen recipeSection tidak ditemukan,
    // fungsi dihentikan.
    if (!recipeSection) return;
 
    // Mengambil elemen navbar.
    const navbar = document.querySelector(".navbar");
 
    // offsetHeight = tinggi elemen navbar.
    // Jika navbar tidak ditemukan, gunakan nilai 0.
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
 
    // getBoundingClientRect().top = jarak bagian atas
    // recipeSection dari bagian atas layar.
    //
    // pageYOffset = posisi scroll halaman saat ini.
    // Keduanya dijumlahkan untuk mendapatkan posisi
    // recipeSection terhadap seluruh halaman.
    //
    // navbarHeight dikurangi agar section tidak tertutup navbar.
    // 25 adalah jarak tambahan dari navbar.
    const sectionPosition =
        recipeSection.getBoundingClientRect().top +
        window.pageYOffset -
        navbarHeight -
        25;
 
    // scrollTo() memindahkan halaman ke posisi yang ditentukan.
    window.scrollTo({
        // Menentukan posisi vertikal tujuan scroll.
        top: sectionPosition,
 
        // Membuat perpindahan scroll berjalan dengan halus.
        behavior: "smooth"
    });
}
 
/* SELECT COUNTRY */
// Fungsi yang dijalankan saat pengguna memilih sebuah negara
function selectCountry(country, selectedButton) {
    // Menghapus status aktif dari semua tombol negara lain
    removeActiveCountries();
    // Menghapus status aktif dari semua kartu kategori (karena filter negara dipilih)
    removeActiveCategories();
 
    // Jika tombol yang diklik valid, tandai sebagai aktif
    if (selectedButton) {
        selectedButton.classList.add("active");
    }
 
    // Menyimpan bahwa filter yang aktif sekarang adalah "country"
    currentFilterType = "country";
    // Menyimpan nama negara yang dipilih
    currentFilterValue = country;
 
    // Mengambil dan menampilkan resep berdasarkan negara yang dipilih
    loadRecipesByCountry(country);
    // Melakukan scroll otomatis ke bagian hasil resep
    scrollToRecipes();
}
 
/* REMOVE ACTIVE COUNTRY */
// Fungsi untuk menghapus class "active" dari semua tombol negara
function removeActiveCountries() {
    // Jika container tidak ada, hentikan fungsi
    if (!countryContainer) return;
 
    // Mengambil semua elemen tombol negara di dalam container
    const buttons = countryContainer.querySelectorAll(".country-item");
 
    // Menghapus class "active" dari setiap tombol
    buttons.forEach(function(button) {
        button.classList.remove("active");
    });
}
 
/* LOAD CATEGORIES */
// Fungsi asynchronous untuk mengambil daftar kategori dari API
async function loadCategories() {
    try {
        // Melakukan request ke endpoint categories.php
        const response = await fetch(API_URL + "/categories.php");
 
        // Jika response gagal, lempar error
        if (!response.ok) {
            throw new Error("Gagal mengambil data kategori.");
        }
 
        // Mengubah response menjadi JSON
        const data = await response.json();
 
        // Jika data kategori kosong, lempar error
        if (!data.categories || data.categories.length === 0) {
            throw new Error("Data kategori tidak ditemukan.");
        }
 
        // Menampilkan kategori-kategori yang berhasil diambil
        showCategories(data.categories);
    } catch (error) {
        // Mencatat error ke console
        console.error("Categories:", error);
        // Menampilkan pesan error kategori ke UI
        showCategoryError();
    }
}
 
/* SHOW CATEGORIES */
// Fungsi untuk menampilkan kartu-kartu kategori ke halaman
function showCategories(categories) {
    // Jika container kategori tidak ada, hentikan fungsi
    if (!categoryContainer) return;
 
    // Mengosongkan isi container kategori
    categoryContainer.textContent = "";
 
    /* ALL RECIPES */
    // Membuat kartu khusus "All Recipes" (untuk menampilkan semua resep)
    const allCard = document.createElement("button");
    // Mengatur tipe tombol
    allCard.type = "button";
    // Menambahkan class CSS untuk kartu ini
    allCard.classList.add("category-card", "all-recipes");
 
    // Membuat elemen gambar untuk kartu "All Recipes"
    const allImage = document.createElement("img");
    // Menambahkan class CSS pada gambar
    allImage.classList.add("category-image");
    // Mengatur sumber gambar (URL gambar dari server MealDB)
    allImage.src =
        "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg";
    // Mengatur teks alternatif gambar (untuk aksesibilitas)
    allImage.alt = "All Recipes";
 
    // Membuat elemen overlay (lapisan teks di atas gambar)
    const allOverlay = document.createElement("span");
    // Menambahkan class CSS pada overlay
    allOverlay.classList.add("category-overlay");
 
    // Membuat elemen teks nama kategori
    const allName = document.createElement("span");
    // Menambahkan class CSS pada nama
    allName.classList.add("category-name");
    // Mengisi teks dengan "All Recipes"
    allName.textContent = "All Recipes";
 
    // Membuat elemen ikon panah
    const allArrow = document.createElement("span");
    // Menambahkan class untuk ikon material symbols dan class panah
    allArrow.classList.add(
        "material-symbols-outlined",
        "category-arrow"
    );
    // Mengisi teks ikon dengan nama ikon "arrow_forward"
    allArrow.textContent = "arrow_forward";
 
    // Memasukkan nama kategori ke dalam overlay
    allOverlay.appendChild(allName);
    // Memasukkan ikon panah ke dalam overlay
    allOverlay.appendChild(allArrow);
    // Memasukkan gambar ke dalam kartu
    allCard.appendChild(allImage);
    // Memasukkan overlay ke dalam kartu
    allCard.appendChild(allOverlay);
 
    // Memasang event klik pada kartu "All Recipes"
    allCard.addEventListener("click", selectAllRecipes);
    // Menambahkan kartu ke dalam container kategori
    categoryContainer.appendChild(allCard);
 
    /* CATEGORY CARDS */
    // Melakukan perulangan untuk setiap kategori dari API
    categories.forEach(function(category) {
        // Membuat kartu untuk masing-masing kategori
        createCategoryCard(category);
    });
}
 
/* CREATE CATEGORY CARD */
// Fungsi untuk membuat satu kartu kategori
function createCategoryCard(category) {
    // Membuat elemen tombol kartu
    const card = document.createElement("button");
    // Mengatur tipe tombol
    card.type = "button";
    // Menambahkan class CSS kartu kategori
    card.classList.add("category-card");
    // Menyimpan nama kategori sebagai atribut data
    card.setAttribute("data-category", category.strCategory);
 
    // Membuat elemen gambar kategori
    const image = document.createElement("img");
    // Menambahkan class CSS pada gambar
    image.classList.add("category-image");
    // Mengatur sumber gambar sesuai data dari API
    image.src = category.strCategoryThumb;
    // Mengatur teks alternatif gambar sesuai nama kategori
    image.alt = category.strCategory;
 
    // Membuat elemen overlay untuk kartu
    const overlay = document.createElement("span");
    // Menambahkan class CSS pada overlay
    overlay.classList.add("category-overlay");
 
    // Membuat elemen nama kategori
    const name = document.createElement("span");
    // Menambahkan class CSS pada nama
    name.classList.add("category-name");
    // Mengisi teks dengan nama kategori dari API
    name.textContent = category.strCategory;
 
    // Membuat elemen ikon panah
    const arrow = document.createElement("span");
    // Menambahkan class ikon material symbols dan panah kategori
    arrow.classList.add(
        "material-symbols-outlined",
        "category-arrow"
    );
    // Mengisi teks ikon dengan "arrow_forward"
    arrow.textContent = "arrow_forward";
 
    // Memasukkan nama ke dalam overlay
    overlay.appendChild(name);
    // Memasukkan ikon panah ke dalam overlay
    overlay.appendChild(arrow);
    // Memasukkan gambar ke dalam kartu
    card.appendChild(image);
    // Memasukkan overlay ke dalam kartu
    card.appendChild(overlay);
 
    // Memasang event klik pada kartu kategori
    card.addEventListener("click", function() {
        // Memanggil fungsi untuk memilih kategori ini
        selectCategory(category.strCategory);
    });
 
    // Menambahkan kartu ke dalam container kategori
    categoryContainer.appendChild(card);
}
 
/* SELECT CATEGORY */
// Fungsi yang dijalankan saat pengguna memilih sebuah kategori
function selectCategory(category) {
    // Menyimpan bahwa filter aktif sekarang adalah "category"
    currentFilterType = "category";
    // Menyimpan nama kategori yang dipilih
    currentFilterValue = category;
 
    // Menghapus status aktif dari semua tombol negara
    removeActiveCountries();
    // Menghapus status aktif dari semua kartu kategori lain
    removeActiveCategories();
 
    // Mencari kartu kategori yang sesuai dengan kategori yang dipilih
    const selectedCard = categoryContainer.querySelector(
        '[data-category="' + CSS.escape(category) + '"]'
    );
 
    // Jika kartu ditemukan, tandai sebagai aktif
    if (selectedCard) {
        selectedCard.classList.add("active");
    }
 
    // Mengambil dan menampilkan resep berdasarkan kategori yang dipilih
    loadRecipesByCategory(category);
    // Melakukan scroll otomatis ke bagian hasil resep
    scrollToRecipes();
}
 
/* REMOVE ACTIVE CATEGORY */
// Fungsi untuk menghapus class "active" dari semua kartu kategori
function removeActiveCategories() {
    // Jika container tidak ada, hentikan fungsi
    if (!categoryContainer) return;
 
    // Mengambil semua elemen kartu kategori
    const cards = categoryContainer.querySelectorAll(".category-card");
 
    // Menghapus class "active" dari setiap kartu
    cards.forEach(function(card) {
        card.classList.remove("active");
    });
}
 
/* SELECT ALL RECIPES */
// Fungsi asynchronous yang dijalankan saat pengguna memilih "All Recipes"
async function selectAllRecipes() {
    // Menyimpan bahwa filter aktif sekarang adalah "all"
    currentFilterType = "all";
    // Menyimpan label filter sebagai "All Recipes"
    currentFilterValue = "All Recipes";
 
    // Menghapus status aktif dari semua tombol negara
    removeActiveCountries();
    // Menghapus status aktif dari semua kartu kategori
    removeActiveCategories();
 
    // Mencari kartu "All Recipes" di dalam container kategori
    const allCard = categoryContainer?.querySelector(".all-recipes");
 
    // Jika kartu ditemukan, tandai sebagai aktif
    if (allCard) {
        allCard.classList.add("active");
    }
 
    // Menampilkan indikator loading dengan pesan "Loading all recipes..."
    showRecipeLoading("Loading all recipes...");
    // Melakukan scroll otomatis ke bagian hasil resep
    scrollToRecipes();
 
    try {
        // Mengambil semua resep dari API (menunggu proses selesai)
        const recipes = await getAllRecipes();
        // Menampilkan hasil resep yang didapat
        showRecipes(recipes, "All Recipes");
    } catch (error) {
        // Mencatat error ke console
        console.error("All Recipes:", error);
        // Menampilkan pesan error ke UI
        showRecipeError();
    }
}
 
/* GET ALL RECIPES */
// Fungsi asynchronous untuk mengambil seluruh resep dari A-Z lalu digabungkan
async function getAllRecipes() {
    // Membuat array huruf a-z
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    // Membuat daftar request fetch untuk tiap huruf secara bersamaan (tanpa menunggu satu-satu)
    const requests = letters.map(function(letter) {
        return fetch(API_URL + "/search.php?f=" + letter);
    });
 
    // Menunggu semua request selesai secara paralel
    const responses = await Promise.all(requests);
    // Array untuk menampung semua resep yang berhasil diambil
    const recipes = [];
 
    // Melakukan perulangan pada setiap hasil response
    for (let i = 0; i < responses.length; i++) {
        // Jika response gagal, lewati (skip) ke iterasi berikutnya
        if (!responses[i].ok) continue;
 
        // Mengubah response menjadi JSON
        const data = await responses[i].json();
 
        // Jika ada data resep, masukkan ke array recipes
        if (data.meals) {
            recipes.push(...data.meals);
        }
    }
 
    // Array untuk menampung resep yang sudah dipastikan unik (tidak duplikat)
    const uniqueRecipes = [];
    // Set untuk melacak ID resep yang sudah pernah dimasukkan
    const recipeIds = new Set();
 
    // Melakukan perulangan untuk memfilter resep duplikat
    recipes.forEach(function(recipe) {
        // Jika ID resep belum ada di dalam Set
        if (!recipeIds.has(recipe.idMeal)) {
            // Tambahkan ID ke dalam Set (menandai sudah pernah muncul)
            recipeIds.add(recipe.idMeal);
            // Tambahkan resep ke array unik
            uniqueRecipes.push(recipe);
        }
    });
 
    // Mengembalikan array resep yang sudah unik
    return uniqueRecipes;
}
 
/* LOAD RECIPES BY COUNTRY */
// Fungsi asynchronous untuk mengambil resep berdasarkan negara
async function loadRecipesByCountry(country) {
    // Menampilkan indikator loading dengan pesan sesuai nama negara
    showRecipeLoading("Loading recipes from " + country + "...");
 
    try {
        // Melakukan request filter resep berdasarkan area/negara (a = area)
        const response = await fetch(
            API_URL +
            "/filter.php?a=" +
            encodeURIComponent(country)
        );
 
        // Jika response gagal, lempar error
        if (!response.ok) {
            throw new Error("Gagal mengambil data resep.");
        }
 
        // Mengubah response menjadi JSON
        const data = await response.json();
 
        // Jika tidak ada resep ditemukan untuk negara tersebut
        if (!data.meals || data.meals.length === 0) {
            // Tampilkan pesan bahwa resep tidak ditemukan
            showNoRecipes("No recipes found from " + country + ".");
            // Hentikan fungsi
            return;
        }
 
        // Mengambil detail lengkap untuk setiap resep hasil filter (karena filter.php hanya memberi data ringkas)
        const recipes = await getFullRecipeDetails(data.meals);
        // Menampilkan resep yang sudah lengkap datanya
        showRecipes(recipes, country);
    } catch (error) {
        // Mencatat error ke console
        console.error("Country Recipes:", error);
        // Menampilkan pesan error ke UI
        showRecipeError();
    }
}
 
/* LOAD RECIPES BY CATEGORY */
// Fungsi asynchronous untuk mengambil resep berdasarkan kategori
async function loadRecipesByCategory(category) {
    // Menampilkan indikator loading dengan pesan sesuai nama kategori
    showRecipeLoading("Loading " + category + " recipes...");
 
    try {
        // Melakukan request filter resep berdasarkan kategori (c = category)
        const response = await fetch(
            API_URL +
            "/filter.php?c=" +
            encodeURIComponent(category)
        );
 
        // Jika response gagal, lempar error
        if (!response.ok) {
            throw new Error("Gagal mengambil data resep.");
        }
 
        // Mengubah response menjadi JSON
        const data = await response.json();
 
        // Jika tidak ada resep ditemukan untuk kategori tersebut
        if (!data.meals || data.meals.length === 0) {
            // Tampilkan pesan bahwa resep tidak ditemukan
            showNoRecipes("No recipes found for " + category + ".");
            // Hentikan fungsi
            return;
        }
 
        // Mengambil detail lengkap untuk setiap resep hasil filter
        const recipes = await getFullRecipeDetails(data.meals);
        // Menampilkan resep yang sudah lengkap datanya
        showRecipes(recipes, category);
    } catch (error) {
        // Mencatat error ke console
        console.error("Category Recipes:", error);
        // Menampilkan pesan error ke UI
        showRecipeError();
    }
}
 
/* GET FULL RECIPE DETAILS */
 
// Fungsi asynchronous untuk mengambil detail lengkap dari daftar resep ringkas
async function getFullRecipeDetails(
    recipes
) {
    // Array untuk menampung resep yang sudah lengkap datanya
    const detailedRecipes = [];
 
    // Melakukan perulangan satu per satu (sequential) untuk tiap resep
    for (
        let i = 0;
        i < recipes.length;
        i++
    ) {
        try {
            // Mengambil detail resep berdasarkan idMeal (i = id lookup)
            const response =
                await fetch(
                    API_URL +
                    "/lookup.php?i=" +
                    encodeURIComponent(
                        recipes[i].idMeal
                    )
                );
 
            // Jika response gagal, lewati resep ini
            if (!response.ok) {
                continue;
            }
 
            // Mengubah response menjadi JSON
            const data =
                await response.json();
 
            // Jika data resep ditemukan
            if (
                data.meals &&
                data.meals.length > 0
            ) {
                // Tambahkan resep pertama (data lengkap) ke array hasil
                detailedRecipes.push(
                    data.meals[0]
                );
            }
 
        } catch (error) {
            // Mencatat error beserta id resep yang gagal diambil
            console.error(
                "Detail recipe:",
                recipes[i].idMeal,
                error
            );
        }
    }
 
    // Mengembalikan array resep yang sudah lengkap
    return detailedRecipes;
}
 
/* SHOW RECIPES */
// Fungsi untuk menampilkan daftar kartu resep ke halaman
function showRecipes(recipes, selectedValue) {
    // Jika container resep tidak ada, hentikan fungsi
    if (!recipeContainer) return;
 
    // Mengosongkan isi container resep
    recipeContainer.textContent = "";
    // Menyembunyikan indikator loading
    hideRecipeLoading();
    // Menyembunyikan pesan kosong (jika sebelumnya tampil)
    hideEmptyMessage();
 
    // Menampilkan jumlah resep dan sumber filter pada info hasil
    if (resultInfo) {
        resultInfo.textContent =
            recipes.length +
            " recipes available from " +
            selectedValue +
            ".";
    }
 
    // Melakukan perulangan untuk tiap resep, lalu membuat kartunya
    recipes.forEach(function(recipe) {
        createRecipeCard(recipe);
    });
}
 
/* CREATE RECIPE CARD */
// Fungsi untuk membuat satu kartu resep
function createRecipeCard(recipe) {
    // Membuat elemen <article> sebagai pembungkus kartu resep
    const card = document.createElement("article");
 
    // Menambahkan class CSS untuk kartu resep
    card.classList.add("recipe-card");
    // Membuat kartu bisa difokus dengan keyboard (aksesibilitas)
    card.setAttribute("tabindex", "0");
 
    /* IMAGE */
    // Membuat elemen div pembungkus gambar
    const imageContainer = document.createElement("div");
    // Menambahkan class CSS pada pembungkus gambar
    imageContainer.classList.add("recipe-image");
 
    // Membuat elemen gambar resep
    const image = document.createElement("img");
    // Mengatur sumber gambar sesuai data dari API
    image.src = recipe.strMealThumb;
    // Mengatur teks alternatif gambar sesuai nama resep
    image.alt = recipe.strMeal;
 
    // Memasukkan gambar ke dalam pembungkusnya
    imageContainer.appendChild(image);
 
    /* INFORMATION */
    // Membuat elemen div untuk informasi resep (nama, kategori, dll)
    const info = document.createElement("div");
    // Menambahkan class CSS pada info
    info.classList.add("recipe-info");
 
    /* NAME */
    // Membuat elemen heading untuk nama resep
    const name = document.createElement("h3");
    // Menambahkan class CSS pada nama
    name.classList.add("recipe-name");
    // Mengisi teks dengan nama resep dari API
    name.textContent = recipe.strMeal;
 
    /* CATEGORY */
    // Membuat elemen paragraf untuk kategori resep
    const category = document.createElement("p");
    // Menambahkan class CSS pada kategori
    category.classList.add("recipe-category");
    // Mengisi teks kategori, jika tidak ada gunakan "International"
    category.textContent = recipe.strCategory || "International";
 
    /* COUNTRY */
    // Membuat elemen paragraf untuk asal negara resep
    const area = document.createElement("p");
    // Menambahkan class CSS pada area
    area.classList.add("recipe-area");
    // Mengisi teks negara, jika tidak ada gunakan "International"
    area.textContent = recipe.strArea || "International";
 
    /* LINK */
    // Membuat elemen link untuk melihat detail resep
    const link = document.createElement("a");
    // Menambahkan class CSS pada link
    link.classList.add("recipe-link");
    // Mengatur alamat tujuan link ke halaman detail resep beserta id-nya
    link.href =
        "recipe-detail.html?id=" +
        encodeURIComponent(recipe.idMeal);
    // Mengisi teks link
    link.textContent = "View Recipe";
 
    /* ARROW */
    // Membuat elemen ikon panah pada link
    const arrow = document.createElement("span");
    // Menambahkan class ikon material symbols
    arrow.classList.add("material-symbols-outlined");
    // Mengisi teks ikon dengan "arrow_forward"
    arrow.textContent = "arrow_forward";
 
    // Memasukkan ikon panah ke dalam link
    link.appendChild(arrow);
 
    /* BUILD INFO */
    // Memasukkan nama resep ke dalam elemen info
    info.appendChild(name);
    // Memasukkan kategori ke dalam elemen info
    info.appendChild(category);
    // Memasukkan area/negara ke dalam elemen info
    info.appendChild(area);
    // Memasukkan link "View Recipe" ke dalam elemen info
    info.appendChild(link);
 
    /* BUILD CARD */
    // Memasukkan pembungkus gambar ke dalam kartu
    card.appendChild(imageContainer);
    // Memasukkan info ke dalam kartu
    card.appendChild(info);
 
    /* CARD CLICK */
    // Memasang event klik pada seluruh kartu
    card.addEventListener("click", function(event) {
        // Jika yang diklik adalah link "View Recipe", biarkan link bekerja normal (tidak dobel aksi)
        if (event.target.closest(".recipe-link")) return;
 
        // Jika bukan link, buka detail resep dengan klik di area kartu manapun
        openRecipeDetail(recipe.idMeal);
    });
 
    /* CARD KEYBOARD */
    // Memasang event keyboard pada kartu (untuk aksesibilitas)
    card.addEventListener("keydown", function(event) {
        // Jika tombol yang ditekan adalah Enter atau Spasi
        if (event.key === "Enter" || event.key === " ") {
            // Mencegah perilaku default browser (misal scroll saat menekan spasi)
            event.preventDefault();
            // Membuka detail resep
            openRecipeDetail(recipe.idMeal);
        }
    });
 
    // Menambahkan kartu yang sudah lengkap ke dalam container resep
    recipeContainer.appendChild(card);
}
 
/* OPEN RECIPE DETAIL */
// Fungsi untuk berpindah ke halaman detail resep
function openRecipeDetail(recipeId) {
    // Mengarahkan browser ke halaman recipe-detail.html dengan id resep pada URL
    window.location.href =
        "recipe-detail.html?id=" +
        encodeURIComponent(recipeId);
}
 
/* SHOW LOADING */
// Fungsi untuk menampilkan indikator loading dengan pesan tertentu
function showRecipeLoading(message) {
    // Mengosongkan container resep saat loading dimulai
    if (recipeContainer) {
        recipeContainer.textContent = "";
    }
 
    // Menyembunyikan pesan kosong jika sedang tampil
    hideEmptyMessage();
 
    // Jika elemen loading ada
    if (recipeLoading) {
        // Mengisi teks loading sesuai pesan
        recipeLoading.textContent = message;
        // Menampilkan elemen loading dengan menambah class "show"
        recipeLoading.classList.add("show");
    }
 
    // Menampilkan pesan yang sama pada info hasil
    if (resultInfo) {
        resultInfo.textContent = message;
    }
}
 
/* HIDE LOADING */
// Fungsi untuk menyembunyikan indikator loading
function hideRecipeLoading() {
    // Jika elemen loading ada, hapus class "show" agar tersembunyi
    if (recipeLoading) {
        recipeLoading.classList.remove("show");
    }
}
 
/* SHOW NO RECIPES */
// Fungsi untuk menampilkan pesan ketika resep tidak ditemukan
function showNoRecipes(message) {
    // Mengosongkan container resep
    if (recipeContainer) {
        recipeContainer.textContent = "";
    }
 
    // Menyembunyikan indikator loading
    hideRecipeLoading();
 
    // Jika elemen pesan kosong ada
    if (emptyMessage) {
        // Mengisi teks pesan
        emptyMessage.textContent = message;
        // Menampilkan pesan dengan menambah class "show"
        emptyMessage.classList.add("show");
    }
 
    // Menampilkan pesan yang sama pada info hasil
    if (resultInfo) {
        resultInfo.textContent = message;
    }
}
 
/* HIDE EMPTY MESSAGE */
// Fungsi untuk menyembunyikan pesan kosong
function hideEmptyMessage() {
    // Jika elemen pesan kosong ada, hapus class "show"
    if (emptyMessage) {
        emptyMessage.classList.remove("show");
    }
}
 
/* SHOW RECIPE ERROR */
// Fungsi khusus untuk menampilkan pesan error saat gagal memuat resep
function showRecipeError() {
    // Memanggil showNoRecipes dengan pesan error umum
    showNoRecipes(
        "Unable to load recipes. Please try again."
    );
}
 
/* COUNTRY ERROR */
// Fungsi untuk menampilkan pesan error saat gagal memuat negara
function showCountryError() {
    // Jika container negara tidak ada, hentikan fungsi
    if (!countryContainer) return;
 
    // Mengosongkan container negara
    countryContainer.textContent = "";
 
    // Membuat elemen paragraf untuk pesan error
    const message = document.createElement("p");
    // Menambahkan class styling pesan kosong/error dan menampilkannya
    message.classList.add("empty-message", "show");
    // Mengisi teks pesan error
    message.textContent = "Unable to load countries.";
 
    // Memasukkan pesan ke dalam container negara
    countryContainer.appendChild(message);
}
 
/* CATEGORY ERROR */
// Fungsi untuk menampilkan pesan error saat gagal memuat kategori
function showCategoryError() {
    // Jika container kategori tidak ada, hentikan fungsi
    if (!categoryContainer) return;
 
    // Mengosongkan container kategori
    categoryContainer.textContent = "";
 
    // Membuat elemen paragraf untuk pesan error
    const message = document.createElement("p");
    // Menambahkan class styling pesan kosong/error dan menampilkannya
    message.classList.add("empty-message", "show");
    // Mengisi teks pesan error
    message.textContent = "Unable to load categories.";
 
    // Memasukkan pesan ke dalam container kategori
    categoryContainer.appendChild(message);
}
 
/* CHECK SEARCH QUERY */
// Fungsi untuk mengecek apakah ada parameter pencarian di URL saat halaman dimuat
function checkSearchQuery() {
    // Mengambil semua parameter query dari URL saat ini
    const urlParams = new URLSearchParams(
        window.location.search
    );
 
    // Mengambil nilai parameter "search" dari URL
    const keyword = urlParams.get("search");
 
    // Jika tidak ada kata kunci pencarian, hentikan fungsi
    if (!keyword) return;
 
    // Jika elemen input pencarian ada, isi dengan kata kunci dari URL
    if (recipesSearch) {
        recipesSearch.value = keyword;
    }
 
    // Menjalankan pencarian resep berdasarkan kata kunci tersebut
    searchRecipes(keyword);
}
 
/* SEARCH RECIPES */
// Fungsi asynchronous untuk mencari resep berdasarkan kata kunci
async function searchRecipes(keyword) {
    // Menghapus spasi di awal/akhir kata kunci
    const cleanKeyword = keyword.trim();
 
    // Jika kata kunci kosong setelah dibersihkan, hentikan fungsi
    if (cleanKeyword === "") return;
 
    // Menampilkan indikator loading dengan pesan sesuai kata kunci pencarian
    showRecipeLoading(
        'Searching for "' +
        cleanKeyword +
        '"...'
    );
 
    try {
        // Melakukan request pencarian resep berdasarkan nama (s = search by name)
        const response = await fetch(
            API_URL +
            "/search.php?s=" +
            encodeURIComponent(cleanKeyword)
        );
 
        // Jika response gagal, lempar error
        if (!response.ok) {
            throw new Error("Gagal mencari resep.");
        }
 
        // Mengubah response menjadi JSON
        const data = await response.json();
 
        // Jika tidak ada resep yang cocok dengan kata kunci
        if (!data.meals || data.meals.length === 0) {
            // Tampilkan pesan bahwa resep tidak ditemukan
            showNoRecipes(
                'No recipes found for "' +
                cleanKeyword +
                '".'
            );
            // Scroll ke bagian hasil resep
            scrollToRecipes();
            // Hentikan fungsi
            return;
        }
 
        // Menyimpan bahwa filter aktif sekarang adalah "search"
        currentFilterType = "search";
        // Menyimpan kata kunci pencarian sebagai nilai filter aktif
        currentFilterValue = cleanKeyword;
 
        // Menampilkan hasil resep pencarian
        showRecipes(
            data.meals,
            "Search: " + cleanKeyword
        );
 
        // Scroll otomatis ke bagian hasil resep
        scrollToRecipes();
    } catch (error) {
        // Mencatat error ke console
        console.error("Search Recipes:", error);
        // Menampilkan pesan error ke UI
        showRecipeError();
    }
}
 
/* RUN PROGRAM */
// Menjalankan fungsi inisialisasi halaman saat script pertama kali dimuat
initializeRecipesPage();
 
