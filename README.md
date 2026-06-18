# 🎮 لعبة السباق التفاعلية - TikTok Racing Game

لعبة سباق تفاعلية تعمل على الويب، حيث يمكن للمشاهدين التحكم بكل صف (دولة) عبر إرسال هدايا.

## 🚀 البدء السريع

### 1. تثبيت البرامج المطلوبة
تأكد من تثبيت **Node.js** على جهازك:
- اذهب إلى: https://nodejs.org
- حمّل النسخة LTS
- ثبّتها

### 2. إعداد المشروع
```bash
# افتح Terminal/Command Prompt في مجلد المشروع
cd tiktok-racing-game

# ثبّت المكتبات
npm install

# شغّل السيرفر
npm start
```

### 3. افتح اللعبة
اذهب إلى المتصفح واكتب:
```
http://localhost:3000
```

---

## 📁 هيكل المشروع

```
tiktok-racing-game/
├── server.js           # سيرفر Node.js
├── package.json        # معلومات المشروع
├── public/
│   ├── index.html      # واجهة اللعبة
│   ├── style.css       # التصميم
│   └── game.js         # منطق اللعبة
└── README.md           # هذا الملف
```

---

## 🎮 كيفية اللعب

1. **اختر دولة** من القائمة المنسدلة
2. **أرسل هدية** لتحريك لاعب الدولة:
   - 🌹 **وردة** = 10 نقاط
   - ❤️ **قلب** = 25 نقطة
   - 💎 **الماس** = 50 نقطة
   - 🎆 **الألعاب النارية** = 100 نقطة

3. **الهدف**: اجعل الدولة تصل إلى 1000 نقطة لتفوز! 🏆

---

## ⚙️ الميزات

✅ لعبة سباق بسيطة وسهلة الاستخدام
✅ 6 دول (السعودية، الإمارات، قطر، الكويت، البحرين، عمان)
✅ نظام نقاط ديناميكي
✅ جدول نتائج فوري
✅ تصميم جميل ومتجاوب
✅ تأثيرات بصرية متقدمة

---

## 🔄 إضافة المزيد من الدول

لإضافة دول جديدة، عدّل الملفات التالية:

### في `index.html`:
```html
<div class="race-row">
    <div class="country-flag">🇪🇬</div>
    <div class="country-name">مصر</div>
    <div class="race-track">
        <div class="player egypt-player">🏃</div>
    </div>
    <div class="score-box">
        <span class="score" id="egypt-score">0</span>
    </div>
</div>
```

### في `game.js`:
```javascript
const gameState = {
    ...
    egypt: { score: 0, position: 0 }
};

const countryNames = {
    ...
    egypt: 'مصر'
};
```

### في `index.html` (في الـ selector):
```html
<option value="egypt">🇪🇬 مصر</option>
```

---

## 🎁 إضافة هدايا جديدة

اضف في `index.html`:
```html
<button class="gift-btn custom-btn" onclick="addGift('saudi', 'custom', 200)">
    🎯 هدية جديدة
    <span class="gift-value">+200</span>
</button>
```

---

## 🔗 ربط TikTok (لاحقاً)

لربط اللعبة بـ TikTok Live:
1. احصل على TikTok Developer Account
2. استخدم TikTok API للتعرف على الهدايا المُرسلة
3. عدّل `server.js` لاستقبال بيانات الهدايا من TikTok

---

## 📱 تشغيل على أجهزة أخرى

لتشغيل اللعبة على جهاز آخر في نفس الشبكة:

1. اعرف عنوان IP جهازك:
   - **Windows**: اكتب `ipconfig` في Command Prompt
   - **Mac**: اكتب `ifconfig` في Terminal

2. على الجهاز الآخر، اذهب إلى:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

---

## 🐛 حل المشاكل

### المشكلة: "Port 3000 is already in use"
الحل: غيّن الـ PORT في `server.js`:
```javascript
const PORT = 3001; // أو أي رقم آخر
```

### المشكلة: لم يعمل npm install
الحل: احذف مجلد `node_modules` و جرّب مجدداً:
```bash
rm -rf node_modules
npm install
```

---

## 📝 الملاحظات

- اللعبة الحالية **لا تحتاج اتصال بالإنترنت** للتشغيل المحلي
- لربطها بـ TikTok ستحتاج إلى معالجة API و Webhooks

---

## 📧 الدعم

لأي أسئلة أو مشاكل، تأكد من:
1. تثبيت Node.js صحيحاً
2. فتح الملفات في VS Code
3. تشغيل `npm install` قبل `npm start`

---

**استمتع باللعبة! 🎮🚀**