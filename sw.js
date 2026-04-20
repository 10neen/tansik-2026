// الإصدار 2.4 - بوابة الصعيدي للتنسيق (النسخة الذكية)

const CACHE_NAME = 'tansik-saidi-v2.5'; 

const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './header_bg.jpg',
  './elmy_data.js',
  './adaby_data.js',
  './manifest.json',
  // إضافة المكتبة الخارجية عشان الطباعة تشتغل أوفلاين
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

// 1. تثبيت وتخزين الملفات
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('تم حفظ ملفات بوابة الصعيدي بنجاح ✅');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// 2. تنظيف الكاش القديم (مهم جداً عند تحديث التنسيق)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  // إجبار الـ Service Worker على التحكم في الصفحة فوراً
  self.clients.claim();
});

// 3. استراتيجية جلب الملفات (Network First مع Fallback للكاش)
self.addEventListener('fetch', e => {
  if (!(e.request.url.indexOf('http') === 0)) return;
  
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // لو النت موجود، خد نسخة جديدة وحطها في الكاش وطلع النتيجة
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => caches.match(e.request)) // لو مفيش نت، هات من الكاش
  );
});
