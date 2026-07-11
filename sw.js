

// الإصدار 2.7 - بوابة الصعيدي للتنسيق (النسخة6الذكية)

const CACHE_NAME = 'tansik-saidi-v2.7'; 
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './header_bg.jpg',
  './elmy_data.js',
  './adaby_data.js',
  './manifest.json'
];

// رابط مكتبة الطباعة الخارجية
const PDF_LIBRARY_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';

// 1. تثبيت وتخزين الملفات
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('تم حفظ ملفات بوابة الصعيدي بنجاح ✅');
      
      // أولاً: حفظ الملفات المحلية الخاصة بك
      cache.addAll(assets);
      
      // ثانياً: حفظ ملف الطباعة الخارجي بشكل آمن وبدون مشاكل CORS
      return cache.add(new Request(PDF_LIBRARY_URL, { mode: 'no-cors' }));
    })
  );
  self.skipWaiting();
});

// 2. تنظيف الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 3. استراتيجية جلب الملفات (Network First مع Fallback للكاش)
self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith('http')) return;
  
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // لو النت شغال، بنحدث الكاش بالنسخة الجديدة
        if (res.status === 200 || res.type === 'opaque') {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, resClone);
          });
        }
        return res;
      })
      .catch(() => {
        // لو مفيش نت، هات الملف من الكاش فوراً
        return caches.match(e.request).then(cachedResponse => {
          return cachedResponse || caches.match('./index.html');
        });
      })
  );
});
