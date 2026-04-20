// // const updateClock = () => {
     
// //     const now = new Date (); 

// //     let hours = now.getHours();
// //     let minutes = now.getMinutes();
// //     let seconds = now.getSeconds();

// //     hours = hours < 10 ? "0" + hours : hours ;
// //     minutes = minutes < 10 ? "0" + minutes : minutes;
// //     seconds = seconds < 10 ? "0" + seconds : seconds ;
// //     const timeString =  hours + ":" + minutes + ":" + seconds ;
// //     document.getElementById('clock').textContent = timeString;

// // };
// // updateClock();
// // setInterval(updateClock ,1000);
// ///

// //
// let alarms = [];
// const alarmSound = document.getElementById('alarmSound');

// // 1. تحديث الساعة والتحقق من المنبهات
// const updateClock = () => {
//     const now = new Date();
//     const h = String(now.getHours()).padStart(2, '0');
//     const m = String(now.getMinutes()).padStart(2, '0');
//     const s = String(now.getSeconds()).padStart(2, '0');
    
//     document.getElementById('clock').textContent = `${h}:${m}:${s}`;

//     // التحقق من المنبهات النشطة فقط
//     alarms.forEach(alarm => {
//         if (alarm.active && alarm.time === `${h}:${m}` && s === "00") {
//             ringAlarm();
//         }
//     });
// };

// // 2. إضافة منبه جديد
// document.getElementById('addAlarmBtn').addEventListener('click', () => {
//     const hr = document.getElementById('alarmHour').value.padStart(2, '0');
//     const min = document.getElementById('alarmMinute').value.padStart(2, '0');

//     if (hr < 0 || hr > 23 || min < 0 || min > 59 || hr === "" || min === "") {
//         alert("Please enter valid time!");
//         return;
//     }

//     const newAlarm = {
//         id: Date.now(),
//         time: `${hr}:${min}`,
//         active: true
//     };

//     alarms.push(newAlarm);
//     renderAlarms();
// });

// // 3. رسم القائمة في الصفحة
// function renderAlarms() {
//     const list = document.getElementById('alarmsList');
//     list.innerHTML = "";

//     alarms.forEach(alarm => {
//         const item = document.createElement('div');
//         item.className = 'alarm-item';
//         item.innerHTML = `
//             <div class="alarm-info">${alarm.time}</div>
//             <div class="alarm-controls">
//                 <label class="switch">
//                     <input type="checkbox" ${alarm.active ? 'checked' : ''} onchange="toggleAlarm(${alarm.id})">
//                     <span class="slider"></span>
//                 </label>
//                 <button class="delete-btn" onclick="deleteAlarm(${alarm.id})">🗑️</button>
//             </div>
//         `;
//         list.appendChild(item);
//     });
// }

// // 4. وظائف التحكم
// window.toggleAlarm = (id) => {
//     const alarm = alarms.find(a => a.id === id);
//     if (alarm) alarm.active = !alarm.active;
// };

// window.deleteAlarm = (id) => {
//     alarms = alarms.filter(a => a.id !== id);
//     renderAlarms();
// };

//   alarmSound.currentTime = 0;
//   alarmSound.play().catch(() => {});
//   setTimeout(() => {
//     if (confirm("Alarm is ringing! Stop it?")) {
//       alarmSound.pause();
//       alarmSound.currentTime = 0;
//     }
//   }, 500);


// setInterval(updateClock, 1000);

let alarms = [];
const alarmSound = document.getElementById('alarmSound');
let currentRingingAlarmId = null; // متغير جديد ضروري للغفوة

const updateClock = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('clock').textContent = `${h}:${m}:${s}`;

    alarms.forEach(alarm => {
        // عدلت هذا السطر ليمرر الـ ID للمنبه عند الرنين
        if (alarm.active && alarm.time === `${h}:${m}` && s === "00") {
            ringAlarm(alarm.id); 
        }
    });
};

document.getElementById('addAlarmBtn').addEventListener('click', () => {
    const hr = document.getElementById('alarmHour').value.padStart(2, '0');
    const min = document.getElementById('alarmMinute').value.padStart(2, '0');

    if (hr < 0 || hr > 23 || min < 0 || min > 59 || hr === "" || min === "") {
        alert("Please enter valid time!");
        return;
    }

    const newAlarm = {
        id: Date.now(),
        time: `${hr}:${min}`,
        active: true
    };

    alarms.push(newAlarm);
    renderAlarms();
});

function renderAlarms() {
    const list = document.getElementById('alarmsList');
    list.innerHTML = "";

    alarms.forEach(alarm => {
        const item = document.createElement('div');
        item.className = 'alarm-item';
        item.innerHTML = `
            <div class="alarm-info">${alarm.time}</div>
            <div class="alarm-controls">
                <label class="switch">
                    <input type="checkbox" ${alarm.active ? 'checked' : ''} onchange="toggleAlarm(${alarm.id})">
                    <span class="slider"></span>
                </label>
                <button class="delete-btn" onclick="deleteAlarm(${alarm.id})">🗑️</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// دالة الرنين المحدثة
function ringAlarm(id) {
    currentRingingAlarmId = id; // نحفظ أي منبه عم يرن هلأ
    alarmSound.currentTime = 0;
    alarmSound.play().catch(() => {});
    
    // إظهار واجهة الرنين (تأكد أن الأيدي ringingInterface موجود بالـ HTML)
    const ringUI = document.getElementById('ringingInterface');
    if(ringUI) ringUI.style.display = 'block';
}

// --- هنا تعديل الغفوة (Snooze) ---
const snoozeButton = document.getElementById('snoozeBtn');
if (snoozeButton) {
    snoozeButton.onclick = () => {
        alarmSound.pause();
        const ringUI = document.getElementById('ringingInterface');
        if(ringUI) ringUI.style.display = 'none';

        // منطق إضافة دقيقتين
        const alarm = alarms.find(a => a.id === currentRingingAlarmId);
        if (alarm) {
            let [h, m] = alarm.time.split(':').map(Number);
            m += 2; 
            if (m >= 60) { m -= 60; h = (h + 1) % 24; }
            alarm.time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            renderAlarms();
            alert("Snoozed for 2 minutes!");
        }
    };
}

// دالة الإيقاف (Stop)
const stopButton = document.getElementById('stopBtn');
if (stopButton) {
    stopButton.onclick = () => {
        alarmSound.pause();
        const ringUI = document.getElementById('ringingInterface');
        if(ringUI) ringUI.style.display = 'none';
        const alarm = alarms.find(a => a.id === currentRingingAlarmId);
        if (alarm) alarm.active = false;
        renderAlarms();
    };
}

window.toggleAlarm = (id) => {
    const alarm = alarms.find(a => a.id === id);
    if (alarm) alarm.active = !alarm.active;
};

window.deleteAlarm = (id) => {
    alarms = alarms.filter(a => a.id !== id);
    renderAlarms();
};

setInterval(updateClock, 1000);
updateClock();