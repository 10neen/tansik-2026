const CACHE_NAME = 's3ydy-tansik-v2';
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './elmy_data.js',
  './adaby_data.js',
  './manifest.json',
  './header_bg.png', // لا تنسى إضافة الصورة الجديدة للكاش
  './icon.png'        // وأيقونة الموقع
];

// 1. تثبيت الخدمة وتخزين الملفات (Install)
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('تم تخزين ملفات بوابة الصعيدي بنجاح');
      return cache.addAll(assets);
    })
  );
});

// 2. تفعيل الخدمة وتنظيف الكاش القديم (Activate)
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// 3. تشغيل الموقع من المخزن (Fetch)
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      // لو الملف موجود في الكاش رجعه، لو مش موجود هاته من النت
      return cacheRes || fetch(evt.request);
    })
  );
});
