// الإصدار 3.0 - بوابة الصعيدي للتنسيق (النسخة الذكية الفائقة)

const CACHE_NAME = 'tansik-saidi-v3.1'; // 🛠️ تم التحديث للإصدار 3

const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './header_bg.jpg',
  './icon-192.jpg', // ✅ ضيفنا الأيقونة الأولى
  './icon-512.jpg', // ✅ ضيفنا الأيقونة الثانية
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
// 3. استراتيجية جلب الملفات الذكية (سرعة فائقة للنت الضعيف)
self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith('http')) return;
  
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // 🚀 السحر هنا: لو الملف موجود في الكاش، هاته فوراً وبدون أي تأخير (سرعة البرق للنت الضعيف)
      if (cachedResponse) {
        
        // في نفس الوقت، بنحدث الكاش في الخلفية من غير ما نعطل الطالب (Stale-While-Revalidate)
        fetch(e.request).then(res => {
          if (res.status === 200 || res.type === 'opaque') {
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, res));
          }
        }).catch(() => console.log("يعمل في وضع الأوفلاين حالياً 📴"));
        
        return cachedResponse;
      }
      // لو الملف مش في الكاش أصلاً، روّح هاته من النت
      return fetch(e.request).then(res => {
        if (res.status === 200 || res.type === 'opaque') {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
