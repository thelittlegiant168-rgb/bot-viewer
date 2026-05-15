# 🤖 Bot Viewer

Aplikasi web untuk melihat bagaimana bot crawler (Googlebot, Facebook bot, dll) melihat website Anda. Berguna untuk debugging SEO dan Open Graph tags.

## Fitur

- ✅ Mimic 10+ bot user agents populer (Googlebot, Facebook, Twitter, LinkedIn, dll)
- 🔍 Preview halaman seperti yang dilihat bot
- 📄 Lihat HTML source code
- 🏷️ Ekstraksi meta tags (Open Graph, Twitter Cards, dll)
- 🎨 UI modern dengan dark mode
- ⚡ Dibangun dengan Next.js 15 dan TypeScript

## Bot yang Didukung

- Googlebot (Desktop & Smartphone)
- Facebook Bot
- Twitter Bot
- LinkedIn Bot
- Bing Bot
- Slack Bot
- WhatsApp
- Telegram Bot
- Discord Bot

## Teknologi

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Cara Menggunakan

1. Masukkan URL website yang ingin Anda periksa
2. Pilih bot yang ingin Anda gunakan
3. Klik "Fetch as Bot"
4. Lihat hasilnya di tab Preview, HTML Source, atau Meta Tags

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## Deploy ke Vercel

### Cara 1: Deploy via Vercel Dashboard

1. Push kode ini ke GitHub repository Anda
2. Buka [Vercel Dashboard](https://vercel.com/new)
3. Import repository Anda
4. Vercel akan otomatis mendeteksi Next.js dan melakukan deploy

### Cara 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

Tidak ada environment variables yang diperlukan untuk aplikasi ini.

## Cara Kerja

1. User memasukkan URL dan memilih bot
2. API route `/api/fetch` melakukan HTTP request dengan User-Agent sesuai bot yang dipilih
3. Response HTML dikembalikan ke frontend
4. Meta tags diekstraksi menggunakan regex
5. User dapat melihat preview, source code, atau meta tags

## Catatan Penting

- Aplikasi ini hanya mengirim HTTP request dengan User-Agent bot, tidak melakukan rendering JavaScript penuh
- Beberapa website mungkin memblokir request dari Vercel edge functions
- Untuk hasil terbaik, gunakan pada website yang sudah mengimplementasikan server-side rendering atau static generation

## Use Cases

- **SEO Debugging**: Pastikan Googlebot dapat melihat konten Anda
- **Social Media Preview**: Cek Open Graph tags untuk Facebook, Twitter, LinkedIn
- **Bot Detection Testing**: Test apakah website Anda memberikan konten yang berbeda untuk bot
- **Meta Tags Validation**: Validasi meta tags sebelum deployment

## Lisensi

MIT

## Kontribusi

Pull requests are welcome! Untuk perubahan besar, silakan buka issue terlebih dahulu.
