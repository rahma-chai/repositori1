/* SAVORA GLOBAL JAVASCRIPT */

/* NAVBAR */
// Mengambil elemen navbar dari halaman
const navbar =
    document.querySelector(".navbar");
// Jika elemen navbar ditemukan, pasang event listener scroll
if (navbar) {
    // Memasang event yang dijalankan setiap kali halaman di-scroll
    window.addEventListener(
        "scroll",
        function () {
            // Jika posisi scroll vertikal sudah melewati 20px dari atas
            if (window.scrollY > 20) {
                // Tambahkan class "scrolled" (biasanya untuk mengubah tampilan navbar, misal beri bayangan/background)
                navbar.classList.add(
                    "scrolled"
                );
            } else {
                // Jika belum melewati 20px (masih di paling atas), hapus class "scrolled"
                navbar.classList.remove(
                    "scrolled"
                );
            }
        }
    );
}

/* GLOBAL SEARCH */

// Mengambil elemen form pencarian pada navbar
const searchForm =
    document.querySelector(
        ".navbar-search-form"
    );
// Mengambil elemen input pencarian pada navbar
const globalSearch =
    document.querySelector(
        ".navbar-search"
    );
// Jika kedua elemen (form dan input) ditemukan, pasang event submit
if (searchForm && globalSearch) {
    // Memasang event yang dijalankan saat form pencarian di-submit
    searchForm.addEventListener(
        "submit",
        function (event) {
            // Mencegah perilaku default form (reload halaman)
            event.preventDefault();
            // Mengambil nilai input pencarian, lalu menghapus spasi di awal/akhir
            const keyword =
                globalSearch.value.trim();
            // Jika kata kunci kosong, hentikan fungsi (tidak lanjut pindah halaman)
            if (keyword === "") {
                return;
            }
            // Mengarahkan browser ke halaman recipes dengan menyertakan kata kunci di parameter URL "search"
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

// Fungsi untuk menentukan path/alamat halaman recipes yang benar,
// tergantung dari halaman mana script ini sedang dijalankan
function getRecipesPagePath() {
    // Mengambil path URL halaman saat ini
    const currentPath =
        window.location.pathname;
    // Jika path saat ini sudah berada di dalam folder "/html/"
    if (
        currentPath.includes(
            "/html/"
        )
    ) {
        // Gunakan path relatif langsung ke "recipes.html" (karena sudah satu folder)
        return "recipes.html";
    }
    // Jika halaman saat ini berada di luar folder "/html/" (misal di root),
    // gunakan path menuju folder "html/" terlebih dahulu
    return "html/recipes.html";
}