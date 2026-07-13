# Log Kartu Saham

Aplikasi satu-file (HTML+CSS+JS vanilla, tanpa build tool) untuk mencatat
kartu analisis bandarmology harian (support/resistance, skenario, risk
reward, fresh buy, avgdown) dan melihatnya sebagai grid kartu yang bisa
di-expand.

## Cara pakai

Buka `index.html` langsung di browser (dobel-klik, atau `python -m http.server`
lalu buka `http://localhost:8000`). Tidak butuh instalasi apa pun.

- **+ Tambah kartu** → tempel teks analisis mentah → **Baca otomatis** →
  field terisi sendiri → **Simpan kartu**.
- Klik kartu di grid untuk buka detail lengkap (sparkline riwayat harga,
  semua section, tombol Edit/Hapus).
- Toolbar: sort (terbaru/terlama/ticker/risk/reward) + filter chip (hari
  ini, minggu ini, punya RR, fresh buy).
- Tema: Gelap / Siang / Auto (ikut jam — 06.00–17.59 = siang).
- Shortcut keyboard: `N` tambah kartu, `/` fokus pencarian, `Ctrl/Cmd+K`
  command palette, `Esc` tutup modal.

## Upgrade Market Aurora

Antarmuka terbaru tetap berjalan sebagai satu file vanilla, dengan:

- Background Market Aurora dan partikel data reaktif berbasis canvas.
- Market Pulse dashboard untuk total kartu, fresh buy, aktivitas harian,
  rata-rata RR, top opportunity, dan sinyal risiko.
- Lima mode eksplorasi: Kartu, Timeline, Tabel, Heatmap, dan Fokus.
- Kartu dengan status peluang/risiko, pointer glow, tilt ringan, dan
  mini visual risk/reward.
- Detail saham dengan price-zone support/resistance, sparkline, dan
  visual risk/reward proporsional.
- Analysis workspace dengan tahapan input, parsing animation, field
  highlight, dan live card preview.
- Tema Aurora, Midnight, Champagne, serta Siang.
- Tingkat animasi Off, Subtle, dan Dynamic; termasuk dukungan
  `prefers-reduced-motion`.
- Animated candlestick icon untuk brand header dan favicon SVG.
- Layout responsif untuk desktop dan mobile.

## Penyimpanan data

Data utama tersimpan di **localStorage browser** (`kartuSahamLog.v1`) —
lokal per-browser, tidak otomatis sinkron ke device lain.

Tiga cara backup/sinkron, expand panel di bagian bawah halaman:

1. **Export/Import file JSON** — manual, selalu jalan di mana pun file
   ini dibuka.
2. **Simpan ke repo GitHub** — pakai personal access token (scope
   `repo`), menulis file JSON ke path yang ditentukan lewat GitHub
   Contents API.
3. **Simpan ke Gist** — pakai token (scope `gist`), bikin/update secret
   atau public gist.

Token disimpan di localStorage (`kartuSahamGh.v1`) **hanya di browser
ini** dan dikirim langsung dari browser ke `api.github.com` — tidak lewat
server pihak ketiga mana pun. Tetap disarankan pakai *fine-grained
token* yang scope-nya dibatasi ke satu repo, bukan token akses penuh.

> **Catatan penting:** fitur sinkron GitHub/Gist butuh `fetch()` ke
> `api.github.com`, yang hanya berjalan kalau `index.html` dibuka sebagai
> file lokal atau di-hosting sendiri (mis. GitHub Pages). Kalau file ini
> di-embed sebagai artefak di claude.ai, sandbox-nya memblokir semua
> request keluar sehingga tombol sinkron tidak akan berfungsi di sana.

## Struktur

- `index.html` — seluruh aplikasi (HTML, CSS, JS) dalam satu file.
- `stockpick-icon.svg` — ikon candlestick-orbit beranimasi untuk brand dan favicon.
