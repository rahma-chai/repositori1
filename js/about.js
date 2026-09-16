/* ========================================
   SAVORA - SHARE YOUR TASTE
   TheMealDB REST API
   ======================================== */
 
/* API */
 
// URL dasar (base URL) untuk mengakses TheMealDB API versi 1
const API_URL = "https://www.themealdb.com/api/json/v1/1";
 
/* ELEMENT */
 
// Mengambil elemen track/wadah yang berisi kartu-kartu kategori (bisa di-scroll horizontal)
const categoryTrack = document.getElementById("category-track");
// Mengambil elemen tombol panah untuk scroll ke kategori sebelumnya
const categoryPrev = document.getElementById("category-prev");
// Mengambil elemen tombol panah untuk scroll ke kategori berikutnya
const categoryNext = document.getElementById("category-next");
// Mengambil elemen bar/indikator progress scroll
const scrollProgress = document.getElementById("scroll-progress");
// Mengambil elemen gambar besar yang menampilkan kategori terpilih
const selectedCategoryImage = document.getElementById("selected-category-image");
// Mengambil elemen textarea tempat pengguna menulis ide resep
const recipeIdea = document.getElementById("recipe-idea");
// Mengambil elemen teks penghitung jumlah karakter yang diketik
const charCount = document.getElementById("char-count");
// Mengambil elemen dropdown pilihan cuisine/negara
const cuisine = document.getElementById("cuisine");
// Mengambil elemen input nama pengguna
const userName = document.getElementById("user-name");
// Mengambil elemen input email pengguna
const userEmail = document.getElementById("user-email");
// Mengambil elemen dropdown pilihan tingkat kesulitan resep
const difficulty = document.getElementById("difficulty");
// Mengambil elemen tombol untuk mengirim/share form
const shareButton = document.getElementById("share-button");
 
/* DATA */
 
// Array untuk menyimpan seluruh data kategori yang diambil dari API
let categories = [];
// Menyimpan nama kategori yang sedang dipilih pengguna (string kosong = belum ada yang dipilih)
let selectedCategory = "";
 
/* LOAD CATEGORIES */
 
// Fungsi asynchronous untuk mengambil daftar kategori dari API
async function loadCategories() {
    try {
        // Melakukan request ke endpoint categories.php
        const response = await fetch(`${API_URL}/categories.php`);
 
        // Jika response gagal, lempar error
        if (!response.ok) {
            throw new Error("Gagal mengambil kategori.");
        }
 
        // Mengubah response menjadi JSON
        const data = await response.json();
        // Menyimpan data kategori ke variabel global, atau array kosong jika tidak ada
        categories = data.categories || [];
 
        // Menampilkan kartu-kartu kategori ke halaman
        displayCategories();
 
        // Jika ada minimal satu kategori, otomatis pilih kategori pertama sebagai default
        if (categories.length > 0) {
            selectCategory(categories[0]);
        }
    } catch (error) {
        // Mencatat error ke console untuk debugging
        console.error("Category Error:", error);
        // Menampilkan pesan error ke UI
        showCategoryError();
    }
}
 
/* SHOW CATEGORY ERROR */
 
// Fungsi untuk menampilkan pesan error saat kategori gagal dimuat
function showCategoryError() {
    // Mengosongkan isi track kategori (menghapus semua elemen anak sekaligus)
    categoryTrack.replaceChildren();
 
    // Membuat elemen paragraf untuk pesan error
    const errorMessage = document.createElement("p");
    // Menambahkan class CSS untuk styling pesan error
    errorMessage.classList.add("api-error");
    // Mengisi teks pesan error
    errorMessage.textContent = "Unable to load categories.";
 
    // Memasukkan pesan error ke dalam track kategori
    categoryTrack.appendChild(errorMessage);
}
 
/* DISPLAY CATEGORY CARDS */
 
// Fungsi untuk menampilkan seluruh kartu kategori ke dalam track
function displayCategories() {
    // Mengosongkan isi track sebelum diisi ulang
    categoryTrack.replaceChildren();
 
    // Melakukan perulangan untuk setiap kategori dalam array
    for (let i = 0; i < categories.length; i++) {
        // Mengambil data kategori sesuai index
        const category = categories[i];
 
        // Membuat elemen tombol sebagai kartu kategori
        const card = document.createElement("button");
        // Mengatur tipe tombol menjadi "button" (bukan submit)
        card.type = "button";
        // Menambahkan class CSS untuk kartu kategori
        card.classList.add("category-card");
        // Menyimpan nama kategori sebagai dataset (atribut data-category) untuk referensi nanti
        card.dataset.category = category.strCategory;
 
        // Membuat elemen div sebagai pembungkus gambar
        const imageWrapper = document.createElement("div");
        // Menambahkan class CSS pada pembungkus gambar
        imageWrapper.classList.add("category-image");
 
        // Membuat elemen gambar kategori
        const image = document.createElement("img");
        // Mengatur sumber gambar sesuai data dari API
        image.src = category.strCategoryThumb;
        // Mengatur teks alternatif gambar sesuai nama kategori
        image.alt = category.strCategory;
        // Mengaktifkan lazy loading agar gambar dimuat saat diperlukan (menghemat performa)
        image.loading = "lazy";
 
        // Membuat elemen heading untuk nama kategori
        const name = document.createElement("h3");
        // Menambahkan class CSS pada nama
        name.classList.add("category-name");
        // Mengisi teks dengan nama kategori
        name.textContent = category.strCategory;
 
        // Membuat elemen span untuk ikon centang (penanda kategori terpilih)
        const check = document.createElement("span");
        // Menambahkan class CSS pada ikon centang
        check.classList.add("category-check");
        // Mengisi karakter centang sebagai teks
        check.textContent = "✓";
 
        // Memasukkan gambar ke dalam pembungkusnya
        imageWrapper.appendChild(image);
        // Memasukkan pembungkus gambar ke dalam kartu
        card.appendChild(imageWrapper);
        // Memasukkan nama kategori ke dalam kartu
        card.appendChild(name);
        // Memasukkan ikon centang ke dalam kartu
        card.appendChild(check);
 
        // Memasang event klik pada kartu
        card.addEventListener("click", function() {
            // Memanggil fungsi untuk memilih kategori ini
            selectCategory(category);
        });
 
        // Menambahkan kartu ke dalam track kategori
        categoryTrack.appendChild(card);
    }
 
    // Memperbarui tampilan progress bar scroll setelah kartu-kartu dirender
    updateScrollProgress();
    // Memperbarui status tombol panah (tampil/sembunyi) setelah kartu-kartu dirender
    updateArrowState();
}
 
/* SELECT CATEGORY */
 
// Fungsi yang dijalankan saat pengguna memilih sebuah kategori
function selectCategory(category) {
    // Menyimpan nama kategori yang dipilih ke variabel global
    selectedCategory = category.strCategory;
 
    // Mengambil semua elemen kartu kategori yang ada di halaman
    const cards = document.querySelectorAll(".category-card");
 
    // Melakukan perulangan pada setiap kartu
    for (let i = 0; i < cards.length; i++) {
        // Mengambil kartu sesuai index
        const card = cards[i];
 
        // Menghapus class "active" dari kartu ini (reset dulu)
        card.classList.remove("active");
 
        // Jika nama kategori pada kartu ini sama dengan kategori yang dipilih
        if (card.dataset.category === selectedCategory) {
            // Tandai kartu ini sebagai aktif
            card.classList.add("active");
        }
    }
 
    // Mengubah gambar besar sesuai gambar kategori yang dipilih
    selectedCategoryImage.src = category.strCategoryThumb;
    // Mengubah teks alternatif gambar besar sesuai nama kategori yang dipilih
    selectedCategoryImage.alt = `${selectedCategory} category`;
 
    // Memperbarui teks placeholder pada textarea sesuai kategori yang dipilih
    updatePlaceholder();
}
 
/* UPDATE PLACEHOLDER */
 
// Fungsi untuk mengganti teks placeholder pada textarea sesuai kategori yang dipilih
function updatePlaceholder() {
    // Objek berisi contoh teks placeholder untuk masing-masing kategori
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
 
    // Mengatur placeholder sesuai kategori yang dipilih,
    // atau teks default jika kategori tidak ada di daftar examples
    recipeIdea.placeholder =
        examples[selectedCategory] ||
        "Tell us what you'd love to discover...";
}
 
/* LOAD CUISINES */
 
// Fungsi asynchronous untuk mengambil daftar cuisine/negara dan mengisi dropdown
async function loadCuisines() {
    try {
        // Melakukan request ke endpoint list negara (a=list)
        const response = await fetch(`${API_URL}/list.php?a=list`);
 
        // Jika response gagal, lempar error
        if (!response.ok) {
            throw new Error("Gagal mengambil daftar cuisine.");
        }
 
        // Mengubah response menjadi JSON
        const data = await response.json();
        // Mengambil data area/negara, atau array kosong jika tidak ada
        const areas = data.meals || [];
 
        // Melakukan perulangan untuk setiap negara
        for (let i = 0; i < areas.length; i++) {
            // Membuat elemen <option> baru untuk dropdown
            const option = document.createElement("option");
 
            // Mengatur value option sesuai nama negara
            option.value = areas[i].strArea;
            // Mengatur teks yang ditampilkan sesuai nama negara
            option.textContent = areas[i].strArea;
 
            // Menambahkan option ke dalam dropdown cuisine
            cuisine.appendChild(option);
        }
    } catch (error) {
        // Mencatat error ke console (tidak menampilkan pesan error ke UI untuk fitur ini)
        console.error("Cuisine Error:", error);
    }
}
 
/* CATEGORY SCROLL - NEXT */
 
// Memasang event klik pada tombol panah kanan (next)
categoryNext.addEventListener("click", function() {
    // Melakukan scroll horizontal ke kanan sejauh 600px dengan animasi halus
    categoryTrack.scrollBy({
        left: 600,
        behavior: "smooth"
    });
});
 
/* CATEGORY SCROLL - PREVIOUS */
 
// Memasang event klik pada tombol panah kiri (previous)
categoryPrev.addEventListener("click", function() {
    // Melakukan scroll horizontal ke kiri sejauh 600px dengan animasi halus
    categoryTrack.scrollBy({
        left: -600,
        behavior: "smooth"
    });
});
 
/* UPDATE SCROLL PROGRESS */
 
// Fungsi untuk memperbarui lebar bar progress sesuai posisi scroll saat ini
function updateScrollProgress() {
    // Mengambil total lebar konten yang bisa di-scroll (termasuk yang tersembunyi)
    const scrollWidth = categoryTrack.scrollWidth;
    // Mengambil lebar area yang terlihat (viewport track)
    const clientWidth = categoryTrack.clientWidth;
    // Menghitung jarak maksimum yang bisa di-scroll
    const maxScroll = scrollWidth - clientWidth;
 
    // Jika tidak ada yang bisa di-scroll (konten muat semua), set progress penuh 100%
    if (maxScroll <= 0) {
        scrollProgress.style.width = "100%";
        return;
    }
 
    // Menghitung persentase posisi scroll saat ini terhadap maksimum scroll
    const percentage =
        (categoryTrack.scrollLeft / maxScroll) * 100;
 
    // Nilai lebar minimum bar progress (agar tidak terlalu kecil/tidak terlihat)
    const minimum = 18;
    // Nilai lebar maksimum bar progress
    const maximum = 100;
 
    // Menghitung lebar bar progress dengan skala antara minimum dan maximum
    // berdasarkan persentase posisi scroll
    const width =
        minimum +
        ((maximum - minimum) * (percentage / 100));
 
    // Menerapkan lebar yang dihitung ke elemen bar progress
    scrollProgress.style.width = `${width}%`;
}
 
/* UPDATE ARROW STATE */
 
// Fungsi untuk menampilkan/menyembunyikan tombol panah sesuai posisi scroll
function updateArrowState() {
    // Menghitung jarak maksimum yang bisa di-scroll
    const maxScroll =
        categoryTrack.scrollWidth -
        categoryTrack.clientWidth;
 
    // Jika konten tidak bisa di-scroll sama sekali, sembunyikan kedua tombol panah
    if (maxScroll <= 2) {
        categoryPrev.classList.add("hidden");
        categoryNext.classList.add("hidden");
        return;
    }
 
    // Jika posisi scroll sudah di paling kiri (awal), sembunyikan tombol "previous"
    if (categoryTrack.scrollLeft <= 2) {
        categoryPrev.classList.add("hidden");
    } else {
        // Jika tidak, tampilkan kembali tombol "previous"
        categoryPrev.classList.remove("hidden");
    }
 
    // Jika posisi scroll sudah mendekati/mencapai ujung kanan, sembunyikan tombol "next"
    if (categoryTrack.scrollLeft >= maxScroll - 2) {
        categoryNext.classList.add("hidden");
    } else {
        // Jika tidak, tampilkan kembali tombol "next"
        categoryNext.classList.remove("hidden");
    }
}
 
/* TRACK CATEGORY SCROLL*/
 
// Memasang event scroll pada track kategori, dijalankan setiap kali pengguna men-scroll
categoryTrack.addEventListener("scroll", function() {
    // Memperbarui status tombol panah sesuai posisi scroll terbaru
    updateArrowState();
    // Memperbarui lebar bar progress sesuai posisi scroll terbaru
    updateScrollProgress();
});
 
/* WINDOW RESIZE */
 
// Memasang event resize pada window, dijalankan setiap kali ukuran jendela berubah
window.addEventListener("resize", function() {
    // Memperbarui status tombol panah (karena lebar area bisa berubah)
    updateArrowState();
    // Memperbarui lebar bar progress (karena perhitungan scroll bisa berubah)
    updateScrollProgress();
});
 
/* CHARACTER COUNTER */
 
// Memasang event input pada textarea ide resep, dijalankan setiap kali teks berubah
recipeIdea.addEventListener("input", function() {
    // Memperbarui teks penghitung karakter sesuai panjang teks yang diketik
    charCount.textContent = recipeIdea.value.length;
});
 
/* EMAIL VALIDATION */
 
// Fungsi untuk memvalidasi format email menggunakan regular expression
function isValidEmail(email) {
    // Mengembalikan true jika format email valid (ada karakter sebelum @, setelah @, dan ada titik domain)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
 
/* SHARE BUTTON */
 
// Memasang event klik pada tombol share/submit
shareButton.addEventListener("click", function() {
    // Mengambil nilai input nama, lalu menghapus spasi di awal/akhir
    const name = userName.value.trim();
    // Mengambil nilai input email, lalu menghapus spasi di awal/akhir
    const email = userEmail.value.trim();
    // Mengambil nilai textarea ide resep, lalu menghapus spasi di awal/akhir
    const idea = recipeIdea.value.trim();
 
    /* NAME */
 
    // Jika nama kosong
    if (!name) {
        // Tampilkan peringatan
        alert("Please enter your name.");
        // Fokuskan kursor ke input nama agar pengguna langsung bisa mengisi
        userName.focus();
        // Hentikan fungsi (tidak lanjut submit)
        return;
    }
 
    /* EMAIL */
 
    // Jika email kosong
    if (!email) {
        // Tampilkan peringatan
        alert("Please enter your email.");
        // Fokuskan kursor ke input emailm
        userEmail.focus();
        // Hentikan fungsi
        return;
    } 
 
    /* EMAIL FORMAT */
 
    // Jika email diisi tapi formatnya tidak valid
    if (!isValidEmail(email)) {
        // Tampilkan peringatan format email
        alert("Please enter a valid email address.");
        // Fokuskan kursor ke input email
        userEmail.focus();
        // Hentikan fungsi
        return;
    }
 
    /* RECIPE IDEA */
 
    // Jika ide resep kosong
    if (!idea) {
        // Tampilkan peringatan
        alert(
            "Please tell us what kind of recipe you're looking for."
        );
        // Fokuskan kursor ke textarea ide resep
        recipeIdea.focus();
        // Hentikan fungsi
        return;
    }
 
    /* SUCCESS */
 
    // Jika semua validasi lolos, tampilkan pesan sukses berisi ringkasan data yang diisi
    alert(
        `Thank you, ${name}! ♡\n\n` +
        `Category: ${selectedCategory || "Not specified"}\n` +
        `Cuisine: ${cuisine.value || "Not specified"}\n` +
        `Difficulty: ${difficulty.value || "Not specified"}\n\n` +
        `Your taste has been shared with SAVORA.`
    );
});
 
/* START */
 
// Memuat data kategori saat script pertama kali dijalankan
loadCategories();
// Memuat data cuisine saat script pertama kali dijalankan
loadCuisines();
 
