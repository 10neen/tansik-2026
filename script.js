// ==========================================
// 1. وظائف الواجهة (الإظهار والإخفاء)
// ==========================================

function showInputFields() {
    document.getElementById('input-area').style.display = 'block';
    document.getElementById('start-design').style.display = 'none';
    window.scrollTo({ top: document.getElementById('input-area').offsetTop - 20, behavior: 'smooth' });
}

function showLocation() {
    document.getElementById('student-location').style.display = 'block';
}

function hideLocation() {
    document.getElementById('student-location').style.display = 'none';
}

// ==========================================
// 2. بنك نصائح الصعيدي الذكية
// ==========================================

function getS3ydyAdvice(branch, score) {
    const positiveVibe = "كل كليات مصر فيها خير، والنجاح ملوش كلية محددة...";
    const mainAdvice = "النجاح الحقيقي إنك تكون قمة في المكان اللي ربنا اختارهولك.";
    
    let extra = "";
    if (branch === 'math' || branch === 'science' || score > 350) {
        extra = "<br>💡تنبيه هام التوقعات مبنيه  علي الحد الادني للقبول للكليات والمعاهد لسنة 2025وهيا لمحاولة المساعده لتقريب الصورة للطالب";
    }

    return `${positiveVibe}${extra}<br><strong style="color: #1e3a8a;">${mainAdvice}</strong>`;
}

// ==========================================
// 3. المحرك الذكي لتوليد الـ 75 رغبة
// ==========================================

function generateWishes() {
    // 1. جلب المدخلات من الواجهة
    const score = parseFloat(document.getElementById('student-score').value);
    const branch = document.getElementById('student-branch').value; 
    const resultsArea = document.getElementById('results-area');
    const userLocation = document.getElementById('student-location').value; 
    const sortType = document.querySelector('input[name="sort-type"]:checked').value;
    const excludeText = document.getElementById('exclude-colleges').value.trim().toLowerCase();

    // 2. التحقق من البيانات الأساسية
    if (!score || !branch || !userLocation) {
        alert("يا بطل، كمل بيانات المجموع والشعبة ومكان سكنك عشان نرتلك رغباتك صح!");
        return;
    }

    // إظهار رسالة انتظار احترافية
    resultsArea.innerHTML = `
        <div style="text-align:center; padding: 40px;">
            <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #1e3a8a; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
            <p style="color: #1e3a8a;">⏳ جاري تحليل البيانات وتطبيق التوزيع الجغرافي الذكي...</p>
        </div>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;

    // 3. خريطة التوزيع الجغرافي المحدثة (إصدار 2026)
    const locationMap = {
        'cairo_giza': { 'a': ['القاهرة', 'عين شمس', 'حلوان'], 'b': ['بنها', 'الفيوم', 'المنوفية'] },
        'qalyubia_1': { 'a': ['بنها'], 'b': ['القاهرة', 'عين شمس', 'حلوان'] },
        'qalyubia_2': { 'a': ['بنها', 'عين شمس'], 'b': ['القاهرة', 'حلوان', 'الزقازيق', 'طنطا', 'المنوفية'] },
        'sharqia': { 'a': ['الزقازيق'], 'b': ['بنها', 'قناة السويس', 'المنصورة', 'بورسعيد'] },
        'sharqia_10th': { 'a': ['الزقازيق', 'عين شمس'], 'b': ['بنها', 'قناة السويس', 'بورسعيد', 'السويس'] },
        'sharqia_salhia': { 'a': ['الزقازيق', 'قناة السويس'], 'b': ['بنها', 'بورسعيد', 'المنصورة'] },
        'dakahlia': { 'a': ['المنصورة'], 'b': ['دمياط', 'الزقازيق', 'طنطا', 'بورسعيد', 'كفر الشيخ'] },
        'dakahlia_mit_ghamr': { 'a': ['المنصورة', 'الزقازيق'], 'b': ['بنها', 'المنوفية', 'طنطا'] },
        'dakahlia_manzala': { 'a': ['المنصورة', 'بورسعيد'], 'b': ['دمياط', 'الزقازيق', 'طنطا', 'كفر الشيخ'] },
        'damietta': { 'a': ['دمياط'], 'b': ['المنصورة', 'الزقازيق', 'طنطا', 'كفر الشيخ', 'بورسعيد'] },
        'gharbia': { 'a': ['طنطا'], 'b': ['كفر الشيخ', 'المنوفية', 'المنصورة', 'بنها'] },
        'gharbia_zifta': { 'a': ['طنطا', 'الزقازيق'], 'b': ['المنوفية', 'بنها', 'المنصورة'] },
        'menofia': { 'a': ['المنوفية', 'مدينة السادات'], 'b': ['طنطا', 'بنها', 'كفر الشيخ', 'الزقازيق'] },
        'alex': { 'a': ['الإسكندرية'], 'b': ['طنطا', 'دمنهور', 'كفر الشيخ'] },
        // تقسيم البحيرة الجديد
        'beheira_1': { 'a': ['دمنهور'], 'b': ['طنطا', 'كفر الشيخ', 'الإسكندرية'] },
        'beheira_2': { 'a': ['الإسكندرية'], 'b': ['دمنهور', 'طنطا', 'كفر الشيخ'] },
        'kafr_el_sheikh': { 'a': ['كفر الشيخ'], 'b': ['طنطا', 'المنصورة', 'الإسكندرية', 'دمنهور', 'دمياط'] },
        'ismailia': { 'a': ['قناة السويس'], 'b': ['الزقازيق', 'بنها', 'المنصورة'] },
        'port_said': { 'a': ['بورسعيد'], 'b': ['المنصورة', 'السويس', 'دمياط', 'عين شمس'] },
        'suez': { 'a': ['السويس'], 'b': ['بورسعيد', 'قناة السويس', 'بنها', 'الزقازيق'] },
        'fayoum': { 'a': ['الفيوم'], 'b': ['بني سويف', 'حلوان', 'المنيا'] },
        'beni_suef': { 'a': ['بني سويف'], 'b': ['الفيوم', 'حلوان', 'المنيا', 'أسيوط'] },
        'minia': { 'a': ['المنيا'], 'b': ['بني سويف', 'أسيوط', 'الفيوم'] },
        'assiut': { 'a': ['أسيوط'], 'b': ['المنيا', 'سوهاج', 'جنوب الوادي', 'الغردقة', 'بني سويف'] },
        'sohag': { 'a': ['سوهاج'], 'b': ['المنيا', 'أسوان', 'أسيوط', 'الأقصر'] },
        'qena_luxor': { 'a': ['جنوب الوادي', 'الأقصر'], 'b': ['سوهاج', 'أسيوط', 'المنيا', 'أسوان'] },
        'aswan': { 'a': ['أسوان'], 'b': ['سوهاج', 'أسيوط', 'المنيا'] },
        'red_sea': { 'a': ['جنوب الوادي', 'السويس', 'المنيا', 'الغردقة', 'أسوان'], 'b': ['القاهرة', 'عين شمس'] },
        'new_valley': { 'a': ['الوادي الجديد'], 'b': ['أسيوط', 'سوهاج', 'المنيا'] },
        'sinai': { 'a': ['العريش', 'بورسعيد', 'قناة السويس', 'السويس'], 'b': ['الزقازيق', 'دمياط'] },
        'matrouh': { 'a': ['مطروح'], 'b': ['دمنهور', 'كفر الشيخ', 'الإسكندرية'] }
    };

    try {
        let htmlData = (branch === 'adaby') ? adabyRawData : elmyRawData;
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<table>${htmlData}</table>`, 'text/html');
        const rows = doc.querySelectorAll('tr');

        let colleges = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const name = cells[0].innerText.trim();
                const minScore = parseFloat(cells[1].innerText.trim());

                // فلترة المجموع (سماح بنزول التنسيق درجتين)
                if (!isNaN(minScore) && score >= (minScore - 2)) {
                    let isMatch = true;

                    // فلترة الكلمات المستبعدة (تدعم الفواصل)
                    if (excludeText) {
                        const filters = excludeText.split(/[,،]+/).map(f => f.trim()).filter(f => f !== "");
                        if (filters.some(f => name.includes(f))) {
                            isMatch = false;
                        }
                    }

                    // فلترة التخصصات (علوم vs رياضة)
                    if (isMatch && branch === 'science') {
                        const mathStrict = ["هندسة", "هندسه", "تخطيط", "عمارة", "تطبيقية", "فنون جميلة عمارة"];
                        if (mathStrict.some(key => name.includes(key)) || name.includes("رياضة") || name.includes("رياضه")) {
                            isMatch = false;
                        }
                    } else if (isMatch && branch === 'math') {
                        const bioStrict = ["طب ", "صيدلة", "صيدله", "أسنان", "اسنان", "علاج طبيعي", "بيطري", "تمريض"];
                        if (bioStrict.some(key => name.includes(key)) && !name.includes("رياضة")) {
                            isMatch = false;
                        }
                    }

                    if (isMatch) colleges.push({ name, minScore });
                }
            }
        });

        // 4. الترتيب الذكي
        colleges.sort((a, b) => {
            if (sortType === 'location' && userLocation && locationMap[userLocation]) {
                const zones = locationMap[userLocation];
                const getWeight = (cName) => {
                    if (zones.a.some(city => cName.includes(city))) return 1;
                    if (zones.b && zones.b.some(city => cName.includes(city))) return 2;
                    return 3;
                };
                const weightA = getWeight(a.name);
                const weightB = getWeight(b.name);
                if (weightA !== weightB) return weightA - weightB;
            }
            // ترتيب تنازلي حسب المجموع داخل نفس النطاق
            return b.minScore - a.minScore;
        });

        // 5. عرض النتائج النهائية
        const finalSelection = colleges.slice(0, 75);

        setTimeout(() => { // تأخير بسيط لإعطاء إحساس بالتحليل
            if (finalSelection.length === 0) {
                resultsArea.innerHTML = "<p style='color:red; padding:20px; text-align:center;'>عذراً، لم نجد كليات تناسب مجموعك حالياً. جرب تقليل الكلمات المستبعدة.</p>";
            } else {
                resultsArea.innerHTML = ""; 
                renderSmartTable(finalSelection, resultsArea, userLocation, sortType, locationMap);
                
                // إضافة نصيحة الصعيدي بعد الجدول مباشرة
                const adviceDiv = document.createElement('div');
                adviceDiv.innerHTML = getS3ydyAdvice(branch, score);
                resultsArea.appendChild(adviceDiv);
            }
        }, 500);

    } catch (error) {
        console.error("Error generating wishes:", error);
        resultsArea.innerHTML = "<p style='color:red; text-align:center;'>حدث خطأ فني أثناء معالجة البيانات. تأكد من ملفات البيانات.</p>";
    }
}



// ==========================================
// 4. دالة عرض الجدول والطباعة
// ==========================================

function renderSmartTable(data, container, userLocation, sortType, locationMap) {
    let scoreValue = document.getElementById('student-score').value;
    let branchText = document.getElementById('student-branch').options[document.getElementById('student-branch').selectedIndex].text;

    let tableHtml = `
        <div class="print-only" style="text-align:center; margin-bottom:20px;">
            <h2 style="color:#1e3a8a;">قائمة الرغبات المقترحة - بوابة 2026</h2>
            <p>المجموع: <b>${scoreValue}</b> | الشعبة: <b>${branchText}</b></p>
        </div>
        <h3 class="no-print" style="margin:15px 0; color:#1e3a8a; display: flex; align-items: center; gap: 10px;">
            ✅ تم ترتيب أفضل 75 رغبة لك:
        </h3>
        
        <div class="results-table-container" style="max-height: 450px; overflow-y: auto; border: 2px solid #1e3a8a; border-radius: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); background: white;">
            <table id="wishes-table" style="width:100%; border-collapse: collapse; text-align: right;">
                <thead style="position: sticky; top: 0; background: #1e3a8a; color: white; z-index: 10;">
                    <tr>
                        <th style="padding:12px; border: 1px solid #1e40af;">م</th>
                        <th style="padding:12px; border: 1px solid #1e40af;">الكلية</th>
                        <th style="padding:12px; border: 1px solid #1e40af;">تنسيق 2025</th>
                    </tr>
                </thead>
                <tbody>`;
    
	
	data.forEach((c, index) => {
    let zoneHTML = '<span style="background:#f3f4f6; color:#374151; padding:2px 6px; border-radius:10px; font-size:10px; margin-right:5px;">نطاق ج</span>';
    let rowBg = "transparent";

    if (sortType === 'location' && userLocation !== "" && locationMap[userLocation]) {
        const zones = locationMap[userLocation];
        if (zones.a.some(city => c.name.includes(city))) {
            zoneHTML = '<span style="background:#dcfce7; color:#166534; padding:2px 6px; border-radius:10px; font-size:10px; margin-right:5px; font-weight:bold;">نطاق أ</span>';
            rowBg = "#f0fdf4";
        } else if (zones.b && zones.b.some(city => c.name.includes(city))) {
            zoneHTML = '<span style="background:#fef9c3; color:#854d0e; padding:2px 6px; border-radius:10px; font-size:10px; margin-right:5px;">نطاق ب</span>';
            rowBg = "#fffbeb";
        }
    }

    tableHtml += `
        <tr style="border-bottom: 1px solid #eee; background-color: ${rowBg};">
            <td style="padding:10px; text-align:center; border: 1px solid #eee;">${index + 1}</td>
            <td style="padding:10px; border: 1px solid #eee;">
                ${c.name} <div class="no-print" style="display:inline-block;">${zoneHTML}</div>
            </td>
            <td style="padding:10px; font-weight:bold; color:#059669; text-align:center; border: 1px solid #eee;">${c.minScore}</td>
        </tr>`;
});
	
	

    tableHtml += `</tbody></table></div>
        <div class="no-print" style="margin-top: 15px; text-align: center;">
            <button onclick="saveAsPDF()" class="btn btn-primary" style="width: auto; padding: 10px 30px; display: inline-flex;">
                💾 حفظ الرغبات PDF
            </button>
        </div>`;

    container.innerHTML = tableHtml;
}

// ==========================================
// 5. وظائف إضافية (أرشيف وحفظ)
// ==========================================

function viewArchive(branch) {
    const archiveResults = document.getElementById('archive-results');
    archiveResults.style.display = 'block'; 
    let rawData = (branch === 'elmy') ? elmyRawData : adabyRawData;
    let title = (branch === 'elmy') ? 'أرشيف علمي 2025' : 'أرشيف أدبي 2025';

    archiveResults.innerHTML = `
        <div style="max-height: 400px; overflow-y: auto; margin-top:15px; border: 1px solid #1e3a8a; border-radius: 8px;">
            <table style="width:100%; border-collapse: collapse; background:white;">
                <thead style="position: sticky; top: 0; background: #1e3a8a; color: white;">
                    <tr><th colspan="2" style="padding:10px;">${title}</th></tr>
                </thead>
                <tbody>${rawData}</tbody>
            </table>
        </div>`;
}

function saveAsPDF() {
    const resultsArea = document.getElementById('results-area');
    if (!resultsArea || resultsArea.innerText.includes("جاري تحليل")) {
        alert("يرجى إظهار الرغبات أولاً!");
        return;
    }
    window.print(); 
}


// تسجيل الـ Service Worker للعمل بدون إنترنت
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('الموقع جاهز للعمل بدون إنترنت!', reg))
      .catch(err => console.log('فشل تسجيل نظام الأوفلاين', err));
  });
}

// منع القائمة المنسدلة (كليك يمين)
document.addEventListener('contextmenu', event => event.preventDefault());

// منع اختصارات لوحة المفاتيح الخاصة بالمبرمجين (F12, Ctrl+Shift+I)
document.onkeydown = function(e) {
    if(e.keyCode == 123) return false; // F12
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false; // Ctrl+U (رؤية السورس كود)
};