/* SAVORA - HOME JAVASCRIPT */
 
// URL dasar (base URL) untuk mengakses TheMealDB API versi 1
const API_URL =
    "https://www.themealdb.com/api/json/v1/1";
 
/* ELEMENT */
// Mengambil elemen teks jumlah total resep
const recipeCount =
    document.getElementById("recipe-count");
// Mengambil elemen teks jumlah total kategori
const categoryCount =
    document.getElementById("category-count");
// Mengambil elemen teks jumlah total cuisine/negara
const cuisineCount =
    document.getElementById("cuisine-count");
// Mengambil elemen container tempat slide gambar hero ditampilkan
const heroSliderContainer =
    document.getElementById(
        "hero-slider-container"
    );
// Mengambil elemen container tempat titik-titik (dots) navigasi slider
const heroSliderDots =
    document.getElementById(
        "hero-slider-dots"
    );
// Mengambil elemen pembungkus info resep yang tampil di hero (untuk animasi fade)
const heroRecipeInfo =
    document.getElementById(
        "hero-recipe-info"
    );
// Mengambil elemen teks kategori resep pada hero
const heroRecipeCategory =
    document.getElementById(
        "hero-recipe-category"
    );
// Mengambil elemen teks nama resep pada hero
const heroRecipeName =
    document.getElementById(
        "hero-recipe-name"
    );
// Mengambil elemen teks asal negara resep pada hero
const heroRecipeArea =
    document.getElementById(
        "hero-recipe-area"
    );
// Mengambil elemen link "lihat resep" pada hero
const heroRecipeLink =
    document.getElementById(
        "hero-recipe-link"
    );
 
/* HERO SLIDER */
// Array untuk menyimpan resep-resep acak yang ditampilkan di hero slider
let heroRecipes = [];
// Menyimpan index slide yang sedang aktif/ditampilkan
let currentHeroSlide = 0;
// Menyimpan referensi timer interval untuk pergantian slide otomatis
let heroSliderTimer = null;
 
/* LOAD HERO RECIPES */
// Fungsi asynchronous untuk mengambil resep-resep acak sebagai konten hero slider
async function loadHeroRecipes() {
    // Jika container slider tidak ditemukan di halaman, hentikan fungsi
    if (!heroSliderContainer) {
        return;
    }
    try {
        // Array untuk menampung request fetch
        const requests = [];
        // Melakukan perulangan 4 kali untuk membuat 4 request resep acak
        for (let i = 0; i < 4; i++) {
            // Menambahkan request fetch ke endpoint random.php ke dalam array
            requests.push(
                fetch(
                    API_URL +
                    "/random.php"
                )
            );
        }
        // Menjalankan semua request secara bersamaan (paralel) dan menunggu semuanya selesai
        const responses =
            await Promise.all(
                requests
            );
        // Mengosongkan array heroRecipes sebelum diisi ulang
        heroRecipes = [];
        // Melakukan perulangan untuk setiap response yang didapat
        for (
            let i = 0;
            i < responses.length;
            i++
        ) {
            // Jika response gagal, lewati response ini
            if (!responses[i].ok) {
                continue;
            }
            // Mengubah response menjadi JSON
            const data =
                await responses[i].json();
            // Jika tidak ada data resep, lewati response ini
            if (
                !data.meals ||
                data.meals.length === 0
            ) {
                continue;
            }
            // Mengambil resep pertama (dan satu-satunya) dari hasil random
            const recipe =
                data.meals[0];
            // Variabel penanda apakah resep ini duplikat (sudah ada sebelumnya)
            let duplicate = false;
            // Melakukan perulangan untuk mengecek resep yang sudah ada di heroRecipes
            for (
                let j = 0;
                j < heroRecipes.length;
                j++
            ) {
                // Jika ID resep sudah ada di dalam array
                if (
                    heroRecipes[j].idMeal ===
                    recipe.idMeal
                ) {
                    // Tandai sebagai duplikat
                    duplicate = true;
                    // Hentikan perulangan karena sudah ditemukan
                    break;
                }
            }
            // Jika bukan duplikat, tambahkan resep ke array heroRecipes
            if (!duplicate) {
                heroRecipes.push(recipe);
            }
        }
        // Jika tidak ada satupun resep yang berhasil diambil, lempar error
        if (heroRecipes.length === 0) {
            throw new Error(
                "Tidak ada resep yang berhasil diambil."
            );
        }
        // Mengatur slide yang aktif kembali ke slide pertama (index 0)
        currentHeroSlide = 0;
        // Menampilkan resep-resep ke dalam hero slider
        showHeroRecipes();
        // Memulai slider otomatis (auto-play)
        startHeroSlider();
    } catch (error) {
        // Mencatat error ke console untuk debugging
        console.error(
            "Hero Recipes:",
            error
        );
        // Menampilkan pesan error ke UI
        showHeroError();
    }
}
 
/* SHOW HERO ERROR */
// Fungsi untuk menampilkan pesan error ketika hero recipes gagal dimuat
function showHeroError() {
    // Mengosongkan isi container slider
    heroSliderContainer.textContent = "";
    // Membuat elemen paragraf untuk pesan error
    const message =
        document.createElement("p");
    // Menambahkan class CSS untuk styling pesan
    message.classList.add(
        "loading-message"
    );
    // Mengisi teks pesan error
    message.textContent =
        "Unable to load recipes.";
    // Memasukkan pesan ke dalam container slider
    heroSliderContainer.appendChild(
        message
    );
}
 
/* SHOW HERO RECIPES */
// Fungsi untuk menampilkan seluruh slide dan dot berdasarkan data heroRecipes
function showHeroRecipes() {
    // Mengosongkan isi container slider sebelum diisi ulang
    heroSliderContainer.textContent = "";
    // Jika elemen dots ada, kosongkan juga isinya
    if (heroSliderDots) {
        heroSliderDots.textContent = "";
    }
    // Melakukan perulangan untuk setiap resep di heroRecipes
    for (
        let i = 0;
        i < heroRecipes.length;
        i++
    ) {
        // Mengambil resep sesuai index saat ini
        const recipe =
            heroRecipes[i];
        // Membuat elemen slide untuk resep ini
        createHeroSlide(
            recipe,
            i
        );
        // Membuat titik (dot) navigasi untuk slide ini
        createHeroDot(i);
    }
    // Memperbarui tampilan informasi (nama, kategori, dll) sesuai slide yang aktif
    updateHeroRecipeInfo(
        currentHeroSlide
    );
}
 
/* CREATE HERO SLIDE */
// Fungsi untuk membuat satu elemen slide gambar hero
function createHeroSlide(
    recipe,
    index
) {
    // Membuat elemen div sebagai pembungkus slide
    const slide =
        document.createElement("div");
    // Menambahkan class CSS untuk slide
    slide.classList.add(
        "hero-slide"
    );
    // Jika ini adalah slide pertama (index 0), tandai sebagai aktif di awal
    if (index === 0) {
        slide.classList.add(
            "active"
        );
    }
    // Membuat elemen gambar untuk slide
    const image =
        document.createElement("img");
    // Menambahkan class CSS pada gambar
    image.classList.add(
        "hero-slide-image"
    );
    // Mengatur sumber gambar sesuai data resep dari API
    image.src =
        recipe.strMealThumb;
    // Mengatur teks alternatif gambar sesuai nama resep
    image.alt =
        recipe.strMeal;
    // Memasukkan gambar ke dalam elemen slide
    slide.appendChild(image);
    // Menambahkan slide ke dalam container slider
    heroSliderContainer.appendChild(
        slide
    );
}
 
/* CREATE HERO DOT */
// Fungsi untuk membuat satu titik (dot) navigasi slider
function createHeroDot(index) {
    // Jika elemen dots tidak ada di halaman, hentikan fungsi
    if (!heroSliderDots) {
        return;
    }
    // Membuat elemen tombol untuk dot
    const dot =
        document.createElement("button");
    // Mengatur tipe tombol
    dot.type = "button";
    // Menambahkan class CSS untuk dot
    dot.classList.add(
        "hero-slider-dot"
    );
    // Menambahkan label aksesibilitas sesuai nomor slide (dimulai dari 1)
    dot.setAttribute(
        "aria-label",
        "Show recipe " +
        (index + 1)
    );
    // Jika ini adalah dot pertama (index 0), tandai sebagai aktif di awal
    if (index === 0) {
        dot.classList.add(
            "active"
        );
    }
    // Memasang event klik pada dot
    dot.addEventListener(
        "click",
        function () {
            // Menampilkan slide sesuai index dot yang diklik
            showHeroSlide(index);
            // Mereset timer auto-play agar tidak langsung ganti slide setelah diklik manual
            resetHeroSlider();
        }
    );
    // Menambahkan dot ke dalam container dots
    heroSliderDots.appendChild(
        dot
    );
}
 
/* UPDATE HERO INFORMATION */
// Fungsi untuk memperbarui teks informasi resep sesuai slide yang aktif
function updateHeroRecipeInfo(
    slideIndex
) {
    // Jika resep pada index tersebut tidak ada, hentikan fungsi
    if (!heroRecipes[slideIndex]) {
        return;
    }
    // Mengambil data resep sesuai index slide
    const recipe =
        heroRecipes[slideIndex];
    // Jika elemen kategori ada, perbarui teksnya (default "Recipe" jika kosong)
    if (heroRecipeCategory) {
        heroRecipeCategory.textContent =
            recipe.strCategory ||
            "Recipe";
    }
    // Jika elemen nama resep ada, perbarui teksnya
    if (heroRecipeName) {
        heroRecipeName.textContent =
            recipe.strMeal;
    }
 
    // Jika elemen area/negara ada, perbarui teksnya (default "International" jika kosong)
    if (heroRecipeArea) {
        heroRecipeArea.textContent =
            recipe.strArea ||
            "International";
    }
 
    // Jika elemen link ada, perbarui href-nya menuju halaman detail resep
    if (heroRecipeLink) {
        heroRecipeLink.href =
            "html/recipe-detail.html?id=" +
            encodeURIComponent(
                recipe.idMeal
            );
    }
 
    // Jika elemen pembungkus info ada, lakukan animasi fade sederhana
    if (heroRecipeInfo) {
        // Menghapus class "active" terlebih dahulu (memicu ulang animasi)
        heroRecipeInfo.classList.remove(
            "active"
        );
 
        // Menunggu sebentar (100ms) sebelum menambahkan kembali class "active"
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
 
// Fungsi untuk menampilkan slide tertentu berdasarkan index-nya
function showHeroSlide(
    slideIndex
) {
    // Mengambil seluruh elemen anak (slide) di dalam container slider
    const slides =
        heroSliderContainer.children;
 
    // Mengambil seluruh elemen dot, atau array kosong jika elemen dots tidak ada
    const dots =
        heroSliderDots
            ? heroSliderDots.children
            : [];
 
    // Jika index yang diminta di luar batas (kurang dari 0 atau melebihi jumlah slide), hentikan fungsi
    if (
        slideIndex < 0 ||
        slideIndex >= slides.length
    ) {
        return;
    }
 
    // Melakukan perulangan untuk menghapus class "active" dari semua slide
    for (
        let i = 0;
        i < slides.length;
        i++
    ) {
        slides[i].classList.remove(
            "active"
        );
    }
 
    // Melakukan perulangan untuk menghapus class "active" dari semua dot
    for (
        let i = 0;
        i < dots.length;
        i++
    ) {
        dots[i].classList.remove(
            "active"
        );
    }
 
    // Memperbarui variabel slide yang sedang aktif
    currentHeroSlide =
        slideIndex;
 
    // Menambahkan class "active" pada slide yang baru dipilih
    slides[currentHeroSlide]
        .classList.add("active");
 
    // Jika dot untuk slide ini ada, tandai juga sebagai aktif
    if (dots[currentHeroSlide]) {
        dots[currentHeroSlide]
            .classList.add("active");
    }
 
    // Memperbarui teks informasi resep sesuai slide yang baru aktif
    updateHeroRecipeInfo(
        currentHeroSlide
    );
}
 
/* START HERO SLIDER */
 
// Fungsi untuk memulai pergantian slide otomatis (auto-play)
function startHeroSlider() {
    // Menghentikan timer sebelumnya (jika ada) agar tidak dobel jalan
    clearInterval(
        heroSliderTimer
    );
 
    // Jika hanya ada 1 atau tidak ada resep, tidak perlu auto-play (tidak ada yang digilir)
    if (heroRecipes.length <= 1) {
        return;
    }
 
    // Membuat interval baru yang berjalan setiap 5 detik
    heroSliderTimer =
        setInterval(
            function () {
                // Menghitung index slide berikutnya
                let nextSlide =
                    currentHeroSlide + 1;
 
                // Jika sudah melebihi jumlah slide, kembali ke slide pertama (index 0)
                if (
                    nextSlide >=
                    heroRecipes.length
                ) {
                    nextSlide = 0;
                }
 
                // Menampilkan slide berikutnya
                showHeroSlide(
                    nextSlide
                );
            },
            5000
        );
}
 
/* RESET HERO SLIDER */
 
// Fungsi untuk mereset timer auto-play (dipanggil saat user berinteraksi manual, misal klik dot)
function resetHeroSlider() {
    // Menghentikan timer yang sedang berjalan
    clearInterval(
        heroSliderTimer
    );
 
    // Memulai kembali timer auto-play dari awal
    startHeroSlider();
}
 
/* LOAD STATISTICS */
 
// Fungsi asynchronous untuk mengambil dan menampilkan data statistik (jumlah resep, kategori, cuisine)
async function loadStatistics() {
    try {
        // Melakukan request untuk mengambil daftar kategori
        const categoryResponse =
            await fetch(
                API_URL +
                "/categories.php"
            );
 
        // Jika response gagal, lempar error
        if (!categoryResponse.ok) {
            throw new Error(
                "Gagal mengambil kategori."
            );
        }
 
        // Mengubah response kategori menjadi JSON
        const categoryData =
            await categoryResponse.json();
 
        // Menghitung jumlah total kategori, atau 0 jika data tidak ada
        const totalCategories =
            categoryData.categories
                ? categoryData.categories.length
                : 0;
 
 
        // Melakukan request untuk mengambil daftar area/negara
        const areaResponse =
            await fetch(
                API_URL +
                "/list.php?a=list"
            );
 
        // Jika response gagal, lempar error
        if (!areaResponse.ok) {
            throw new Error(
                "Gagal mengambil cuisine."
            );
        }
 
        // Mengubah response area menjadi JSON
        const areaData =
            await areaResponse.json();
 
        // Menghitung jumlah total cuisine/negara, atau 0 jika data tidak ada
        const totalCuisines =
            areaData.meals
                ? areaData.meals.length
                : 0;
 
 
        // Jika elemen jumlah resep ada, isi dengan nilai tetap "100+" (karena API tidak menyediakan total resep pasti)
        if (recipeCount) {
            recipeCount.textContent =
                "100+";
        }
 
        // Jika elemen jumlah kategori ada, isi dengan jumlah kategori yang didapat
        if (categoryCount) {
            categoryCount.textContent =
                totalCategories + "+";
        }
 
        // Jika elemen jumlah cuisine ada, isi dengan jumlah cuisine yang didapat
        if (cuisineCount) {
            cuisineCount.textContent =
                totalCuisines + "+";
        }
 
    } catch (error) {
        // Mencatat error ke console untuk debugging
        console.error(
            "Statistics:",
            error
        );
 
        // Menampilkan tampilan error pada bagian statistik
        showStatisticsError();
    }
}
 
/* SHOW STATISTICS ERROR */
 
// Fungsi untuk menampilkan tanda "--" ketika statistik gagal dimuat
function showStatisticsError() {
    // Jika elemen jumlah resep ada, isi dengan "--" sebagai penanda error
    if (recipeCount) {
        recipeCount.textContent = "--";
    }
 
    // Jika elemen jumlah kategori ada, isi dengan "--"
    if (categoryCount) {
        categoryCount.textContent = "--";
    }
 
    // Jika elemen jumlah cuisine ada, isi dengan "--"
    if (cuisineCount) {
        cuisineCount.textContent = "--";
    }
}
 
/* LOAD HOME */
 
// Fungsi utama yang menjalankan seluruh proses inisialisasi halaman home
function loadHome() {
    // Memuat dan menampilkan hero slider dengan resep acak
    loadHeroRecipes();
    // Memuat dan menampilkan data statistik
    loadStatistics();
}
 
/* RUN PROGRAM */
 
// Menjalankan fungsi loadHome saat script pertama kali dimuat
loadHome();
 
