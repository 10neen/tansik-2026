// ==========================================
// 1. وظائف الواجهة (الإظهار والإخفاء)
// ==========================================




function showInputFields() {
    var inputArea = document.getElementById('input-area');
    var startBtn = document.getElementById('start-design');

    // تأمين: التأكد من وجود العناصر قبل العمل عليها لمنع توقف السكريبت
    if (inputArea && startBtn) {
        inputArea.style.display = 'block';
        startBtn.style.display = 'none';
        
        // تحسين تجربة المستخدم مع حماية الـ scroll
        window.scrollTo({ 
            top: inputArea.offsetTop - 20, 
            behavior: 'smooth' 
        });
    }
}

function handleBranchChange() {
    var branchSelect = document.getElementById('student-branch');
    var locWrapper = document.getElementById('location-wrapper');
    
    if (!branchSelect || !locWrapper) return; // تأمين ضد أخطاء الـ DOM

    var branch = branchSelect.value;
    
    // تأمين: التحقق من أن القيمة المختار هي قيم معتمدة فقط
    var validBranches = ['science', 'math'];
    
    if (branch && validBranches.includes(branch)) {
        locWrapper.classList.remove('hidden');
        locWrapper.style.opacity = "1"; // تحسين بصري بسيط
    } else {
        locWrapper.classList.add('hidden');
        // تأمين إضافي: تصفير المدخلات التالية لو الطالب غير رأيه في الشعبة
        document.getElementById('student-location').value = ""; 
    }
}






// ==========================================
// 2. دالة تشغيل الأرشيف (طلعت بره الخناقة)
// ==========================================
function viewArchive(type) {
    const resultsArea = document.getElementById('archive-results'); 
    if (!resultsArea) {
        alert("خطأ: لم يتم العثور على منطقة عرض الأرشيف في الصفحة");
        return;
    }

    let archiveData = [];
    if (type === 'elmy') {
        archiveData = window.elmyDataJSON || window.elmyData || [];
    } else {
        archiveData = window.adabyDataJSON || window.adabyData || [];
    }

    if (archiveData.length === 0) {
        alert("⚠️ تأكد من وجود ملفات البيانات elmy_data.js و adaby_data.js بجانب الصفحة");
        return;
    }

    const themeColor = (type === 'elmy') ? '#1e3a8a' : '#be123c';
    let html = `
        <div class="results-table-container" style="border: 2px solid ${themeColor}; margin-top:20px; background:white; border-radius:8px; overflow:hidden;">
            <div style="background:${themeColor}; color:white; padding:15px; text-align:center; font-weight:bold;">
                أرشيف 2025 - المجموعة ${type === 'elmy' ? 'العلمية' : 'الأدبية'}
            </div>
            <table style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr style="background:#f8fafc;">
                        <th style="padding:10px; border:1px solid #ddd;">م</th>
                        <th style="padding:10px; border:1px solid #ddd; text-align:right;">الكلية</th>
                        <th style="padding:10px; border:1px solid #ddd;">الدرجة</th>
                    </tr>
                </thead>
                <tbody>
    `;

    archiveData.forEach((item, index) => {
        html += `
            <tr>
                <td style="padding:10px; border:1px solid #eee; text-align:center;">${index + 1}</td>
                <td style="padding:10px; border:1px solid #eee; font-weight:bold;">${item.name}</td>
                <td style="padding:10px; border:1px solid #eee; text-align:center; color:${themeColor}; font-weight:900;">${item.score || item.minScore}</td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;
    resultsArea.innerHTML = html;
    resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function generateWishes() {
    // 1. جلب العناصر مع تأمين وجودها
    var scoreEl = document.getElementById('student-score');
    var branchEl = document.getElementById('student-branch');
    var resultsArea = document.getElementById('results-area');
    var locationEl = document.getElementById('student-location');
    var excludeEl = document.getElementById('exclude-colleges');
    var sortEl = document.querySelector('input[name="sort-type"]:checked');

    if (!scoreEl || !branchEl || !locationEl || !resultsArea || !sortEl) {
        alert("⚠️ عذراً، هناك مشكلة في تحميل عناصر الصفحة.");
        return;
    }

    // 2. تأمين المجموع (نظام 320 درجة) وتطهير النصوص
    var score = parseFloat(scoreEl.value);
    var branch = branchEl.value; 
    var userLocation = locationEl.value; 
    var sortType = sortEl.value;
    
    // منع حقن الأكواد (XSS) في خانة الاستبعاد
    var excludeText = excludeEl.value.trim().toLowerCase().replace(/[<>]/g, "");

    // فحص صحة المجموع (نظام 320)
    if (isNaN(score) || score < 160 || score > 320) {
        alert("يا بطل، المجموع لازم يكون رقم بين 160 و 320!");
        return;
    }

    if (!branch || !userLocation) {
        alert("يا بطل، كمل بيانات الشعبة ومكان سكنك!");
        return;
    }

    // رسالة انتظار مؤمنة
    resultsArea.innerHTML = "<div style='text-align:center; padding:30px;'><p style='color: #1e3a8a; font-weight:bold;'>⏳ جاري تحليل أفضل 75 رغبة لمجموعك (${score})...</p></div>";

    // خريطة التوزيع الجغرافي (تبقى كما هي)
    var locationMap = {
        'cairo_giza': { 'a': ['القاهرة', 'عين شمس', 'حلوان'], 'b': ['بنها', 'الفيوم', 'المنوفية'] },
        'qalyubia_1': { 'a': ['بنها'], 'b': ['القاهرة', 'عين شمس', 'حلوان'] },
        'qalyubia_2': { 'a': ['بنها', 'عين شمس'], 'b': ['القاهرة', 'حلوان', 'الزقازيق', 'طنطا', 'المنوفية'] },
        'sharqia': { 'a': ['الزقازيق'], 'b': ['بنها', 'قناة السويس', 'المنصورة', 'بورسعيد'] },
        'dakahlia': { 'a': ['المنصورة'], 'b': ['دمياط', 'الزقازيق', 'طنطا', 'بورسعيد', 'كفر الشيخ'] },
        'gharbia': { 'a': ['طنطا'], 'b': ['كفر الشيخ', 'المنوفية', 'المنصورة', 'بنها'] },
        'menofia': { 'a': ['المنوفية', 'مدينة السادات'], 'b': ['طنطا', 'بنها', 'كفر الشيخ', 'الزقازيق'] },
        'alex': { 'a': ['الإسكندرية'], 'b': ['طنطا', 'دمنهور', 'كفر الشيخ'] },
        'beheira': { 'a': ['دمنهور'], 'b': ['طنطا', 'كفر الشيخ', 'الإسكندرية'] },
        'kafr_el_sheikh': { 'a': ['كفر الشيخ'], 'b': ['طنطا', 'المنصورة', 'الإسكندرية', 'دمنهور', 'دمياط'] },
        'ismailia': { 'a': ['قناة السويس'], 'b': ['الزقازيق', 'بنها', 'المنصورة'] },
        'port_said': { 'a': ['بورسعيد'], 'b': ['المنصورة', 'السويس', 'دمياط', 'عين شمس'] },
        'suez': { 'a': ['السويس'], 'b': ['بورسعيد', 'قناة السويس', 'بنها', 'الزقازيق'] },
        'fayoum': { 'a': ['الفيوم'], 'b': ['بني سويف', 'حلوان', 'المنيا'] },
        'beni_suef': { 'a': ['بني سويف'], 'b': ['الفيوم', 'حلوان', 'المنيا', 'أسيوط'] },
        'minia': { 'a': ['المنيا'], 'b': ['بني سويف', 'أسيوط', 'الفيوم'] },
        'assiut': { 'a': ['أسيوط'], 'b': ['المنيا', 'سوهاج', 'بني سويف'] },
        'sohag': { 'a': ['سوهاج'], 'b': ['أسوان', 'أسيوط', 'الأقصر'] },
        'qena_luxor': { 'a': ['جنوب الوادي', 'الأقصر'], 'b': ['سوهاج', 'أسيوط', 'أسوان'] },
        'aswan': { 'a': ['أسوان'], 'b': ['سوهاج', 'أسيوط'] },
        'matrouh': { 'a': ['مطروح'], 'b': ['دمنهور', 'كفر الشيخ', 'الإسكندرية'] },
        'sinai': { 'a': ['العريش', 'بورسعيد', 'قناة السويس', 'السويس'], 'b': ['الزقازيق', 'دمياط'] }
    };

    try {
        // تأمين جلب البيانات من الـ Window
        var rawData = (branch === 'adaby') ? (window.adabyDataJSON || []) : (window.elmyDataJSON || []);
        if (!Array.isArray(rawData) || rawData.length === 0) throw new Error("بيانات التنسيق غير متوفرة!");

        var colleges = [];
        
        rawData.forEach(function(item) {
            var name = item.name.trim();
            var minScore = parseFloat(item.minScore);
            
            if (isNaN(minScore)) return; // تجاوز أي سجل تالف في الداتا

            // فرق السماح 3 درجات مناسب لنظام الـ 320
            if (score >= (minScore - 3)) {
                var isMatch = true;

                // تطبيق فلتر الكلمات المستبعدة يدوياً
                if (excludeText && name.toLowerCase().includes(excludeText)) isMatch = false;

                // نظام استبعاد علمي رياضة (الطب والتمريض)
                if (isMatch && branch === 'math') {
                    var medTerms = ["طب ", "أسنان", "اسنان", "صيدلة", "صيدله", "علاج طبيعي", "بيطري", "تمريض", "معهد فني صحي"];
                    if (medTerms.some(key => name.includes(key)) && !name.includes("رياضة") && !name.includes("رياضه")) {
                        isMatch = false;
                    }
                    if (isMatch && (name.endsWith("علوم") || name.includes(" شعبة علوم") || name.includes("(علوم)"))) {
                        isMatch = false;
                    }
                }

                // نظام استبعاد علمي علوم (الهندسة والرياضة)
                else if (isMatch && branch === 'science') {
                    var mathTerms = ["هندسة", "هندسه", "تطبيقية", "تطبيقيه", "رياضة", "رياضه", "تكنولوجيا", "المساحة", "المساحه"];
                    if (mathTerms.some(key => name.includes(key))) {
                        isMatch = false;
                    }
                }

                if (isMatch) colleges.push(item);
            }
        });

        // ترتيب الرغبات
        colleges.sort(function(a, b) {
            if (sortType === 'location' && userLocation && locationMap[userLocation]) {
                var zones = locationMap[userLocation];
                var getWeight = function(c) {
                    var colName = c.name;
                    if (zones.a.some(city => colName.includes(city))) return 1;
                    if (zones.b && zones.b.some(city => colName.includes(city))) return 2;
                    return 3;
                };
                var weightA = getWeight(a);
                var weightB = getWeight(b);
                if (weightA !== weightB) return weightA - weightB;
            }
            return parseFloat(b.minScore) - parseFloat(a.minScore);
        });

        var finalSelection = colleges.slice(0, 75);
        if (finalSelection.length === 0) {
            resultsArea.innerHTML = "<div class='card' style='text-align:center; color:red;'>عذراً، لم نجد كليات تناسب مجموعك في هذه الشعبة.</div>";
        } else {
            renderSmartTable(finalSelection, resultsArea, userLocation, sortType, locationMap);
        }
    } catch (error) {
        resultsArea.innerHTML = "<div class='card' style='text-align:center; color:red;'>⚠️ خطأ أمان: " + error.message + "</div>";
    }
}




function renderSmartTable(data, container, userLocation, sortType, locationMap) {
    let scoreValue = document.getElementById('student-score').value;
    let branchText = document.getElementById('student-branch').options[document.getElementById('student-branch').selectedIndex].text;

    // رأس الصفحة عند الطباعة (يظهر في الـ PDF فقط)
    var tableHtml = `
        <div class="print-only" style="text-align:center; margin-bottom:20px; display:none;">
            <h1 style="color:#1e3a8a; margin:0;">قائمة الرغبات المقترحة - بوابة الصعيدي 2026</h1>
            <p style="font-size:1.1rem; margin:5px 0;">إهداء من: <b>معرض الصعيدي للأدوات الصحية (بشتيل - إمبابة)</b></p>
            <p>المجموع: <b>${scoreValue}</b> | الشعبة: <b>${branchText}</b></p>
            <hr style="border:1px solid #1e3a8a; margin:10px 0;">
        </div>`;

    // عنوان الجدول في الموقع
    tableHtml += '<h3 class="no-print" style="margin:20px 0; color:#1e3a8a; text-align:center; font-weight:bold;">🎯 قائمة الرغبات الـ 75 المرتبة لك</h3>';
    
    // بداية هيكل الجدول
    tableHtml += '<div id="my-final-table" class="results-table-container">';
    tableHtml += '<table style="width:100%; border-collapse:collapse; text-align:right;" dir="rtl">';
    tableHtml += '<thead><tr style="background:#1e3a8a; color:white;">';
    tableHtml += '<th style="width:50px; padding:15px; border:1px solid #ddd;">م</th>';
    tableHtml += '<th style="padding:15px; border:1px solid #ddd;">الكلية والموقع الجغرافي 📍</th>';
    tableHtml += '<th style="width:100px; padding:15px; border:1px solid #ddd;">تنسيق 2025</th>';
    tableHtml += '</tr></thead><tbody>';

    data.forEach(function(c, index) {
        // الإعداد الافتراضي (نطاق ج - بعيد)
        var zoneLabel = "نطاق ج (بعيد)";
        var bgColor = "#fee2e2"; // أحمر خفيف (نفس متغير CSS)
        var textColor = "#991b1b"; 
        var borderColor = "#dc2626";

        // فحص النطاقات الجغرافية (أ ، ب)
        if (userLocation && locationMap[userLocation]) {
            var zones = locationMap[userLocation];
            
            // النطاق أ (المحافظة)
            if (zones.a.some(city => c.name.includes(city))) {
                zoneLabel = "نطاق أ (محافظتك)";
                bgColor = "#dcfce7"; // أخضر خفيف
                textColor = "#166534";
                borderColor = "#16a34a";
            } 
            // النطاق ب (المجاور)
            else if (zones.b && zones.b.some(city => c.name.includes(city))) {
                zoneLabel = "نطاق ب (مجاور)";
                bgColor = "#dbeafe"; // أزرق خفيف
                textColor = "#1e40af";
                borderColor = "#2563eb";
            }
        }
        
        // رابط الخريطة الصحيح
        var googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(c.name)}`;

        // بناء صف الجدول
        tableHtml += `
        <tr style="background-color: ${bgColor}; border-bottom: 2px solid #fff;">
            <td style="text-align:center; font-weight:bold; padding:12px; border-left: 5px solid ${borderColor}; color: ${textColor};">${index + 1}</td>
            <td style="padding:12px;">
                <div style="font-size:1.15rem; font-weight:bold; color: ${textColor};">${c.name}</div>
                <div style="font-size:0.9rem; margin-top:5px; color: #444;">
                    <span style="font-weight:bold;">📍 ${zoneLabel}</span>
                    <a href="${googleMapsUrl}" target="_blank" class="no-print" style="margin-right:15px; color:#2563eb; text-decoration:none; font-weight:bold;">[ 🚩 الخريطة ]</a>
                </div>
            </td>
            <td style="text-align:center; font-weight:900; padding:12px; color: #1e3a8a; font-size:1.2rem; background: rgba(255,255,255,0.3); border-right: 1px solid rgba(0,0,0,0.05);">${c.minScore}</td>
        </tr>`;
    });

    tableHtml += '</tbody></table></div>';
    
    // أزرار التحكم النهائية بعد ظهور الجدول
    tableHtml += `
        <div class="no-print" style="text-align:center; margin:30px 0; padding-bottom:50px;">
            <button onclick="window.print()" style="background:#059669; color:white; padding:18px 40px; border-radius:50px; border:none; cursor:pointer; font-weight:bold; font-size:1.2rem; box-shadow: 0 10px 20px rgba(5, 150, 105, 0.3); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                🖨️ طباعة أو حفظ الرغبات PDF
            </button>
            <p style="color:#64748b; font-size:0.9rem; margin-top:15px; font-weight:bold;">💡 نصيحة: احتفظ بنسخة PDF وراجعها قبل موعد التنسيق الرسمي.</p>
        </div>`;

    container.innerHTML = tableHtml;

    // سكرول ناعم لأول الجدول بعد ما يظهر
    document.getElementById('my-final-table').scrollIntoView({ behavior: 'smooth' });
}



// 1. منع القائمة اليمين (Right Click) تماماً
document.addEventListener('contextmenu', event => event.preventDefault());

// 2. منع اختصارات لوحة التحكم والمفاتيح المشهورة
document.onkeydown = function(e) {
    // منع F12
    if (e.keyCode == 123) {
        return false;
    }
    // منع Ctrl+Shift+I (فتح الـ Inspect)
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    // منع Ctrl+Shift+C (اختيار عنصر)
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    // منع Ctrl+Shift+J (فتح الكونسول)
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    // منع Ctrl+U (عرض سورس الصفحة)
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
    // منع Ctrl+S (حفظ الصفحة)
    if (e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) {
        return false;
    }
};

// 3. حركة "صايعة" - لو فتح الكونسول بالعافية، يطبع له تحذير أو يمسح الكونسول
setInterval(function() {
    console.clear();
    console.log('%cتحذير!', 'color: red; font-size: 30px; font-weight: bold;');
    console.log('%cغير مسموح بالتلاعب في كود بوابة الصعيدي 2026.', 'color: black; font-size: 16px;');
}, 1000);
