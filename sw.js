const CACHE_NAME = 's3ydy-tansik-v1'; 
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './elmy_data.js',
  './adaby_data.js',
  './manifest.json',
  './logo.png' // ضروري جداً عشان الصورة تظهر وأنت أوفلاين
];

// 1. تثبيت الخدمة وتخزين الملفات
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('تم تخزين الملفات بنجاح.. الموقع جاهز للعمل أوفلاين!');
      return cache.addAll(assets);
    })
  );
});

// 2. تحديث الكاش (حذف النسخ القديمة) - حركة احترافية
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

// 3. تشغيل الموقع من المخزن (حتى لو مفيش نت)
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      // بيرجع الملف من الكاش، ولو مش موجود بيروح يجيبه من النت
      return cacheRes || fetch(evt.request);
    })
  );
});