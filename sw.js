
// الإصدار 2.1 - بوابة الصعيدي للتنسيق
const CACHE_NAME = 'tansik-saidi-v2.1'; 

// القائمة دي مطابقة لأسماء ملفاتك في الصورة بالظبط
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './header_bg.jpg', // تم تعديلها من png إلى jpg لتطابق صورتك
  './elmy_data.js',
  './adaby_data.js',
  './manifest.json',
  './sw.js'
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
});

// 3. تشغيل الموقع أوفلاين
self.addEventListener('fetch', e => {
  if (!(e.request.url.indexOf('http') === 0)) return;
  
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
