// ==========================================
// 1. وظائف الواجهة (الإظهار والإخفاء)
// ==========================================

function showInputFields() {
    var inputArea = document.getElementById('input-area');
    var startBtn = document.getElementById('start-design');

    if (inputArea && startBtn) {
        inputArea.style.display = 'block';
        startBtn.style.display = 'none';
        
        window.scrollTo({ 
            top: inputArea.offsetTop - 20, 
            behavior: 'smooth' 
        });
    }
}

function handleBranchChange() {
    var branchSelect = document.getElementById('student-branch');
    var locWrapper = document.getElementById('location-wrapper');
    
    if (!branchSelect || !locWrapper) return;

    var branch = branchSelect.value;
    var validBranches = ['science', 'math', 'adaby']; 
    
    if (branch && validBranches.includes(branch)) {
        locWrapper.classList.remove('hidden');
        locWrapper.style.opacity = "1";
    } else {
        locWrapper.classList.add('hidden');
        document.getElementById('student-location').value = ""; 
    }
}

// ==========================================
// 2. دالة تشغيل الأرشيف
// ==========================================



function viewArchive(type) {
    const resultsArea = document.getElementById('archive-results'); 
    
    // حركة صايعة: لو الأرشيف مفتوح لنفس النوع، اضغطه واقفله (Toggle)
    if (resultsArea.innerHTML !== "" && resultsArea.dataset.currentType === type) {
        resultsArea.innerHTML = "";
        resultsArea.dataset.currentType = "";
        return;
    }

    let archiveData = (type === 'elmy') ? (window.elmyDataJSON || window.elmyData || []) : (window.adabyDataJSON || window.adabyData || []);

    if (archiveData.length === 0) {
        alert("⚠️ تأكد من وجود ملفات البيانات");
        return;
    }

    const themeColor = (type === 'elmy') ? '#1e3a8a' : '#be123c';
    resultsArea.dataset.currentType = type; // تخزين النوع الحالي

    let html = `
        <div class="archive-container" style="border: 2px solid ${themeColor}; margin-top:20px; background:white; border-radius:12px; overflow:hidden; animation: fadeIn 0.5s;">
            <div style="background:${themeColor}; color:white; padding:15px; text-align:center; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
                <span></span> <span>📊 أرشيف 2025 - المجموعة ${type === 'elmy' ? 'العلمية' : 'الأدبية'}</span>
                <button onclick="document.getElementById('archive-results').innerHTML=''" style="background:rgba(255,255,255,0.2); border:none; color:white; cursor:pointer; padding:5px 10px; border-radius:5px;">إغلاق X</button>
            </div>
            
            <div style="max-height: 500px; overflow-y: auto;">
                <table style="width:100%; border-collapse:collapse;" dir="rtl">
                    <thead>
                        <tr style="background:#f8fafc; position: sticky; top: 0; z-index: 10; box-shadow: 0 2px 2px rgba(0,0,0,0.1);">
                            <th style="padding:12px; border:1px solid #ddd;">م</th>
                            <th style="padding:12px; border:1px solid #ddd; text-align:right;">الكلية</th>
                            <th style="padding:12px; border:1px solid #ddd;">الدرجة</th>
                        </tr>
                    </thead>
                    <tbody>
    `;



// استبدل الجزء الخاص بتوليد الصفوف (الـ Rows) بهذا الكود:
archiveData.forEach((item, index) => {
    html += `
        <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding:10px; text-align:center; color: var(--text-secondary);">${index + 1}</td>
            <td style="padding:10px; font-weight:bold; color: var(--text-primary); text-align:right;">${item.name}</td>
            <td style="padding:10px; text-align:center; color: #3b82f6; font-weight:900;">${item.score || item.minScore}</td>
        </tr>
    `;
});



    html += `
                    </tbody>
                </table>
            </div>
            
            <div style="background:#f8fafc; padding:10px; text-align:center; border-top:1px solid #ddd;">
                <button onclick="document.getElementById('archive-results').innerHTML=''; window.scrollTo({top: document.getElementById('archive-results').offsetTop - 100, behavior:'smooth'});" 
                        style="background:${themeColor}; color:white; border:none; padding:8px 25px; border-radius:20px; cursor:pointer; font-weight:bold;">
                    تم التأكد.. إغلاق الأرشيف ↑
                </button>
            </div>
        </div>
    `;

    resultsArea.innerHTML = html;
    resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}







// ==========================================
// 3. المحرك الأساسي (توليد الرغبات)
// ==========================================


// ==========================================
// 3. المحرك الأساسي المعدل (بدون تفاوت)
// ==========================================

function generateWishes() {
    var scoreEl = document.getElementById('student-score');
    var branchEl = document.getElementById('student-branch');
    var resultsArea = document.getElementById('results-area');
    var locationEl = document.getElementById('student-location');
    var excludeEl = document.getElementById('exclude-colleges');
    
    var sortEl = document.querySelector('input[name="sort-type"]:checked');
    var sortType = sortEl ? sortEl.value : 'score';

    if (!scoreEl || !branchEl || !locationEl || !resultsArea) {
        alert("⚠️ عذراً، هناك مشكلة في تحميل عناصر الصفحة.");
        return;
    }

    var score = parseFloat(scoreEl.value);
    var branch = branchEl.value; 
    var userLocation = locationEl.value; 
    var excludeText = excludeEl.value.trim().toLowerCase().replace(/[<>]/g, "");

    if (isNaN(score) || score < 160 || score > 320) {
        alert("يا بطل، المجموع لازم يكون رقم بين 160 و 320! راجع مجموعك تاني.");
        return;
    }

    if (!branch || !userLocation) {
        alert("يا بطل، كمل بيانات الشعبة ومكان سكنك!");
        return;
    }

    resultsArea.innerHTML = `<div style='text-align:center; padding:30px;'><p style='color: #1e3a8a; font-weight:bold;'>⏳ جاري تحليل أفضل 75 رغبة لمجموعك (${score})...</p></div>`;

    // خريطة التوزيع الجغرافي (تظل كما هي في كودك الأصلي)
    var locationMap = {
        'cairo_giza': { 'a': ['القاهرة', 'عين شمس', 'حلوان'], 'b': ['بنها', 'الفيوم', 'المنوفية'] },
        'qalyubia_1': { 'a': ['بنها'], 'b': ['القاهرة', 'عين شمس', 'حلوان', 'الفيوم', 'المنوفية', 'طنطا', 'الزقازيق'] },
        'qalyubia_2': { 'a': ['بنها', 'عين شمس'], 'b': ['القاهرة', 'حلوان', 'الزقازيق', 'طنطا', 'المنوفية'] },
        'sharqia': { 'a': ['الزقازيق'], 'b': ['بنها', 'قناة السويس', 'المنصورة', 'بورسعيد'] },
        'sharqia_salihiya': { 'a': ['الزقازيق', 'قناة السويس'], 'b': ['بنها', 'بورسعيد', 'المنصورة'] },
        'dakahlia': { 'a': ['المنصورة'], 'b': ['دمياط', 'الزقازيق', 'طنطا', 'بورسعيد', 'كفر الشيخ'] },
        'dakahlia_mit_ghamr': { 'a': ['المنصورة', 'الزقازيق'], 'b': ['بنها', 'المنوفية', 'طنطا'] },
        'dakahlia_manzala': { 'a': ['المنصورة', 'بورسعيد'], 'b': ['دمياط', 'الزقازيق', 'طنطا', 'كفر الشيخ'] },
        'damietta': { 'a': ['دمياط'], 'b': ['المنصورة', 'الزقازيق', 'طنطا', 'كفر الشيخ', 'بورسعيد'] },
        'gharbia': { 'a': ['طنطا'], 'b': ['كفر الشيخ', 'المنوفية', 'المنصورة', 'بنها'] },
        'gharbia_zifta': { 'a': ['طنطا', 'الزقازيق'], 'b': ['المنوفية', 'بنها', 'المنصورة'] },
        'menofia': { 'a': ['المنوفية', 'مدينة السادات'], 'b': ['طنطا', 'بنها', 'كفر الشيخ', 'الزقازيق'] },
        'alex': { 'a': ['الإسكندرية'], 'b': ['طنطا', 'دمنهور', 'كفر الشيخ'] },
        'matrouh': { 'a': ['مطروح'], 'b': ['الإسكندرية', 'دمنهور', 'كفر الشيخ'] },
        'beheira': { 'a': ['دمنهور'], 'b': ['طنطا', 'كفر الشيخ', 'الإسكندرية'] },
        'beheira_sadat': { 'a': ['دمنهور', 'مدينة السادات'], 'b': ['الإسكندرية', 'المنوفية', 'طنطا'] },
        'kafr_el_sheikh': { 'a': ['كفر الشيخ'], 'b': ['طنطا', 'المنصورة', 'الإسكندرية', 'دمنهور', 'دمياط'] },
        'ismailia': { 'a': ['قناة السويس', 'السويس', 'بورسعيد'], 'b': ['الزقازيق', 'بنها', 'المنصورة'] },
        'port_said': { 'a': ['بورسعيد', 'قناة السويس'], 'b': ['المنصورة', 'السويس', 'دمياط'] },
        'suez': { 'a': ['السويس', 'قناة السويس'], 'b': ['القاهرة', 'عين شمس', 'المنوفية'] },
        'north_sinai': { 'a': ['العريش', 'بورسعيد', 'قناة السويس'], 'b': ['السويس', 'دمياط', 'الزقازيق'] },
        'south_sinai': { 'a': ['السويس', 'قناة السويس'], 'b': ['الزقازيق', 'بورسعيد', 'العريش'] },
        'fayoum': { 'a': ['الفيوم'], 'b': ['بني سويف', 'حلوان', 'المنيا'] },
        'beni_suef': { 'a': ['بني سويف'], 'b': ['الفيوم', 'حلوان', 'المنيا', 'أسيوط'] },
        'minia': { 'a': ['المنيا'], 'b': ['بني سويف', 'أسيوط', 'الفيوم'] },
        'assiut': { 'a': ['أسيوط'], 'b': ['المنيا', 'سوهاج', 'جنوب الوادي', 'الغردقة', 'بني سويف', 'الأقصر', 'الوادي الجديد'] },
        'sohag': { 'a': ['سوهاج', 'جنوب الوادي', 'الغردقة'], 'b': ['المنيا', 'أسوان', 'أسيوط', 'الأقصر', 'الوادي الجديد'] },
        'qena': { 'a': ['جنوب الوادي', 'الأقصر', 'الغردقة'], 'b': ['سوهاج', 'أسيوط', 'المنيا', 'أسوان', 'الوادي الجديد'] },
        'luxor': { 'a': ['الأقصر', 'جنوب الوادي', 'الغردقة'], 'b': ['سوهاج', 'أسيوط', 'المنيا', 'أسوان', 'الوادي الجديد'] },
        'aswan': { 'a': ['أسوان'], 'b': ['سوهاج', 'أسيوط', 'المنيا', 'جنوب الوادي', 'الغردقة', 'الأقصر', 'الوادي الجديد'] },
        'red_sea': { 'a': ['جنوب الوادي', 'السويس', 'المنيا', 'الغردقة', 'أسوان', 'سوهاج', 'أسيوط', 'حلوان', 'بني سويف'], 'b': ['القاهرة', 'عين شمس'] },
        'new_valley': { 'a': ['الوادي الجديد'], 'b': ['أسيوط', 'سوهاج', 'جنوب الوادي', 'المنيا', 'الغردقة', 'الأقصر', 'أسوان'] }
    };

    try {
        var rawData = (branch === 'adaby') ? (window.adabyDataJSON || window.adabyData || []) : (window.elmyDataJSON || window.elmyData || []);
        if (!Array.isArray(rawData) || rawData.length === 0) throw new Error("بيانات التنسيق غير متوفرة!");

        var colleges = [];
        rawData.forEach(function(item) {
            var name = item.name.trim();
            // دعم الاسمين minScore أو score لضمان عدم التعليق
            var minScore = parseFloat(item.minScore || item.score);
            if (isNaN(minScore)) return;

            // التعديل الجوهري: المجموع لازم يكون أقل من أو يساوي مجموع الطالب بالظبط
            if (score >= minScore) {
                var isMatch = true;
                
                if (excludeText && name.toLowerCase().includes(excludeText)) isMatch = false;

                // فلتر علمي رياضة
                if (isMatch && branch === 'math') {
                    var medTerms = ["طب ", "أسنان", "اسنان", "صيدلة", "صيدله", "علاج طبيعي", "علاج طبيعى", "بيطري", "بيطرى", "تمريض", "معهد فني صحي", "معهد فنى صحى"];
                    if (medTerms.some(key => name.includes(key)) && !name.includes("رياضة") && !name.includes("رياضه")) {
                        isMatch = false;
                    }
                    if (isMatch && (name.endsWith("علوم") || name.includes(" شعبة علوم") || name.includes(" شعبه علوم") || name.includes("(علوم)"))) {
                        isMatch = false;
                    }
                } 
                
                // فلتر علمي علوم
                else if (isMatch && branch === 'science') {
                    var mathTerms = ["هندسة", "هندسه", "عمارة", "عماره", "فنون جميلة عمارة", "فنون جميله عماره", "تكنولوجيا", "التكنولوجي", "المساحة", "تطبيقية", "رياضة", "تخطيط عمراني", "فني صناعي"];
                    if (mathTerms.some(key => name.includes(key))) {
                        isMatch = false;
                    }
                }

                if (isMatch) {
                    // توحيد اسم الخاصية لعرضها في الجدول لاحقاً
                    item.minScore = minScore; 
                    colleges.push(item);
                }
            }
        });

        // الترتيب: دايماً المجموع الأعلى للأقل (عشان أول رغبة هي سقف مجموعه)
        colleges.sort(function(a, b) {
            // لو الطالب اختار ترتيب جغرافي
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
            // الترتيب الأساسي بالمجموع
            return parseFloat(b.minScore) - parseFloat(a.minScore);
        });

        var finalSelection = colleges.slice(0, 75);
        
        // تأخير بسيط لشياكة العرض
        setTimeout(function() {
            if (finalSelection.length === 0) {
                resultsArea.innerHTML = "<div class='card' style='text-align:center; color:#be123c; padding:20px; background:#fff1f2; border-radius:10px;'>عذراً يا بطل، مفيش كليات في الأرشيف تناسب المجموع ده حالياً.</div>";
            } else {
                renderSmartTable(finalSelection, resultsArea, userLocation, sortType, locationMap);
            }
        }, 500);

    } catch (error) {
        resultsArea.innerHTML = "<div class='card' style='text-align:center; color:red;'>⚠️ خطأ في معالجة البيانات: " + error.message + "</div>";
    }
}















function renderSmartTable(data, container, userLocation, sortType, locationMap) {
    let scoreValue = document.getElementById('student-score').value;
    let branchText = document.getElementById('student-branch').options[document.getElementById('student-branch').selectedIndex].text;

    var tableHtml = `
        <div class="print-only" style="text-align:center; margin-bottom:20px; display:none;">
            <h1 style="color:#1e3a8a; margin:0;">قائمة الرغبات المقترحة - بوابة الصعيدي 2026</h1>
            <p>إهداء من: <b>معرض الصعيدي للأدوات الصحية (بشتيل - إمبابة)</b></p>
            <p>المجموع: <b>${scoreValue}</b> | الشعبة: <b>${branchText}</b></p>
            <hr style="border:1px solid #1e3a8a; margin:10px 0;">
        </div>
        <h3 class="no-print" style="margin:20px 0; color:#1e3a8a; text-align:center; font-weight:bold;">🎯 قائمة الرغبات الـ 75 المرتبة لك</h3>
        <div id="my-final-table" class="results-table-container">
        <table style="width:100%; border-collapse:collapse; text-align:right;" dir="rtl">
        <thead><tr style="background:#1e3a8a; color:white;">
        <th style="width:50px; padding:15px; border:1px solid #ddd;">م</th>
        <th style="padding:15px; border:1px solid #ddd;">الكلية والموقع الجغرافي 📍</th>
        <th style="width:100px; padding:15px; border:1px solid #ddd;">تنسيق 2025</th>
        </tr></thead><tbody>`;

    data.forEach(function(c, index) {
        var zoneLabel = "نطاق ج (بعيد)";
        var bgColor = "#fee2e2"; 
        var textColor = "#991b1b"; 
        var borderColor = "#dc2626";

        if (userLocation && locationMap[userLocation]) {
            var zones = locationMap[userLocation];
            if (zones.a.some(city => c.name.includes(city))) {
                zoneLabel = "نطاق أ (محافظتك)";
                bgColor = "#dcfce7"; 
                textColor = "#166534";
                borderColor = "#16a34a";
            } else if (zones.b && zones.b.some(city => c.name.includes(city))) {
                zoneLabel = "نطاق ب (مجاور)";
                bgColor = "#dbeafe"; 
                textColor = "#1e40af";
                borderColor = "#2563eb";
            }
        }
        
var googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name)}`;

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
    tableHtml += `
        <div class="no-print" style="text-align:center; margin:30px 0; padding-bottom:50px;">
            <button onclick="window.print()" style="background:#059669; color:white; padding:18px 40px; border-radius:50px; border:none; cursor:pointer; font-weight:bold; font-size:1.2rem; box-shadow: 0 10px 20px rgba(5, 150, 105, 0.3);">
                🖨️ طباعة أو حفظ الرغبات PDF
            </button>
        </div>`;

    container.innerHTML = tableHtml;
    document.getElementById('my-final-table').scrollIntoView({ behavior: 'smooth' });
}

// حماية الكود من التلاعب
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'C'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0))) || (e.ctrlKey && (e.keyCode == 'U'.charCodeAt(0) || e.keyCode == 'S'.charCodeAt(0)))) {
        return false;
    }
};



// 1. منع كليك يمين تماماً
document.addEventListener('contextmenu', event => event.preventDefault());

// 2. منع اختصارات الكيبورد (F12, Ctrl+Shift+I, Ctrl+U)
document.onkeydown = function(e) {
    // منع F12
    if (e.keyCode == 123) {
        return false;
    }
    // منع Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    // منع Ctrl+Shift+C (الماوس بتاع الـ Inspect)
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    // منع Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    // منع Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
};

// 3. حركة صايعة: لو فتح الـ DevTools بأسلوب تاني، الكود يدخل في "LooP" يعطله
(function() {
    var element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            // هنا ممكن تبعت تنبيه لنفسك أو تقفل الصفحة
            window.location.href = "about:blank"; 
        }
    });
    console.log(element);
})();



function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme); // عشان لما يقفل ويفتح يفضل على وضعه
}

// تشغيل الوضع المختار أول ما الصفحة تفتح
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
});


function shareToPlatform(platform) {
    const url = "https://10neen.github.io/tansik-2026/";
    const text = "يا بطل، الموقع ده بيجيب الخلاصة في ترتيب رغبات التنسيق.. جربه بالمزورة!";
    
    let shareUrl = "";

    if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    } else if (platform === 'whatsapp') {
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function toggleShareMenu() {
    const menu = document.getElementById('share-menu');
    // تبديل الإظهار والإخفاء
    menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
}

// حركة إضافية: لو داس في أي مكان بره القائمة تتقفل لوحدها
window.onclick = function(event) {
    if (!event.target.matches('button')) {
        const menu = document.getElementById('share-menu');
        if (menu && menu.style.display === 'block') {
            menu.style.display = 'none';
        }
    }
}
