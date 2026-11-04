let currentStudent = localStorage.getItem("gis_student_name") || "";
let currentPartIndex = 0;
let userScores = JSON.parse(localStorage.getItem("gis_user_scores")) || {};

window.addEventListener("DOMContentLoaded", () => {
    if (currentStudent) {
        document.getElementById("login-modal").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
        document.getElementById("display-student-name").textContent = currentStudent;
        initApp();
    }

    document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("student-name").value.trim();
        if (nameInput) {
            currentStudent = nameInput;
            localStorage.setItem("gis_student_name", currentStudent);
            document.getElementById("login-modal").classList.add("hidden");
            document.getElementById("app-container").classList.remove("hidden");
            document.getElementById("display-student-name").textContent = currentStudent;
            initApp();
        }
    });
});

function logout() {
    localStorage.removeItem("gis_student_name");
    location.reload();
}

function initApp() {
    renderNavTabs();
    renderPart(currentPartIndex);
}

function renderNavTabs() {
    const navContainer = document.getElementById("nav-tabs");
    navContainer.innerHTML = "";
    courseData.parts.forEach((part, index) => {
        const btn = document.createElement("button");
        btn.textContent = part.title;
        btn.className = `px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition ${index === currentPartIndex ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`;
        btn.onclick = () => {
            currentPartIndex = index;
            renderNavTabs();
            renderPart(currentPartIndex);
        };
        navContainer.appendChild(btn);
    });
}

function renderPart(index) {
    const main = document.getElementById("main-content");
    const part = courseData.parts[index];
    main.innerHTML = "";

    const titleEl = document.createElement("h2");
    titleEl.className = "text-2xl font-bold text-slate-900 mb-6 border-b pb-2";
    titleEl.textContent = part.title;
    main.appendChild(titleEl);

    if (part.type === "final-section") {
        renderFinalSection(main);
        return;
    }

    part.sections.forEach((sec, sIdx) => {
        const secContainer = document.createElement("div");
        secContainer.className = "bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6";
        
        const secTitle = document.createElement("h3");
        secTitle.className = "text-lg font-bold text-slate-900 mb-3";
        secTitle.textContent = sec.title;
        secContainer.appendChild(secTitle);

        if (sec.type === "text-block") {
            const p = document.createElement("p");
            p.className = "text-slate-600 text-sm leading-relaxed";
            p.textContent = sec.content;
            secContainer.appendChild(p);
        } else if (sec.type === "flip-cards") {
            const grid = document.createElement("div");
            grid.className = "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4";
            sec.cards.forEach(card => {
                const cardEl = document.createElement("div");
                cardEl.className = "card-perspective h-64 cursor-pointer";
                cardEl.innerHTML = `
                    <div class="card-inner" onclick="this.classList.toggle('flipped')">
                        <div class="card-face bg-slate-50 border border-slate-200 p-5 flex flex-col justify-between">
                            <span class="text-xs font-bold text-emerald-600">${card.frontTitle}</span>
                            <p class="text-sm text-slate-700">${card.frontText}</p>
                            <span class="text-xs text-emerald-600 font-semibold text-right">Flip ➔</span>
                        </div>
                        <div class="card-face card-back bg-slate-900 text-white p-5 flex flex-col justify-between">
                            <span class="text-xs font-bold text-emerald-400">${card.backTitle}</span>
                            <p class="text-xs text-slate-300">${card.backText}</p>
                            <span class="text-xs text-slate-400 text-right">Flip back</span>
                        </div>
                    </div>`;
                grid.appendChild(cardEl);
            });
            secContainer.appendChild(grid);
        } else if (sec.type === "media-block") {
            const p = document.createElement("p");
            p.className = "text-slate-600 text-sm mb-4";
            p.textContent = sec.text;
            secContainer.appendChild(p);

            if (sec.image) {
                const img = document.createElement("img");
                img.src = sec.image;
                img.className = "rounded-xl w-full h-48 object-cover mb-4 shadow-sm";
                secContainer.appendChild(img);
            }

            if (sec.downloadFile) {
                const a = document.createElement("a");
                a.href = sec.downloadFile.url;
                a.textContent = sec.downloadFile.label;
                a.className = "inline-block bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-lg mr-3 mb-4 transition";
                secContainer.appendChild(a);
            }

            if (sec.videoUrl) {
                const iframe = document.createElement("iframe");
                iframe.src = sec.videoUrl;
                iframe.className = "w-full h-64 rounded-xl border-0 mb-4";
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                secContainer.appendChild(iframe);
            }
        } else if (sec.type === "quiz") {
            const quizKey = `part_${index}_sec_${sIdx}`;
            const answered = userScores[currentStudent]?.[quizKey] !== undefined;

            sec.questions.forEach((qObj, qIdx) => {
                const qDiv = document.createElement("div");
                qDiv.className = "mt-4";
                qDiv.innerHTML = `<p class="text-sm font-semibold text-slate-800 mb-2">${qIdx + 1}. ${qObj.q}</p>`;
                
                const optDiv = document.createElement("div");
                optDiv.className = "space-y-2";
                qObj.options.forEach((opt, oIdx) => {
                    const btn = document.createElement("button");
                    btn.textContent = opt;
                    btn.className = `w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium border transition ${answered ? (oIdx === qObj.answer ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500') : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`;
                    if (!answered) {
                        btn.onclick = () => submitAnswer(index, sIdx, qIdx, oIdx, qObj.answer);
                    } else {
                        btn.disabled = true;
                    }
                    optDiv.appendChild(btn);
                });
                qDiv.appendChild(optDiv);
                secContainer.appendChild(qDiv);
            });
        }

        main.appendChild(secContainer);
    });
}

function submitAnswer(pIdx, sIdx, qIdx, selected, correct) {
    if (!userScores[currentStudent]) userScores[currentStudent] = {};
    const key = `part_${pIdx}_sec_${sIdx}`;
    const isCorrect = selected === correct;
    userScores[currentStudent][key] = isCorrect ? 1 : 0;
    localStorage.setItem("gis_user_scores", JSON.stringify(userScores));
    renderPart(pIdx);
}

function renderFinalSection(container) {
    const div = document.createElement("div");
    div.className = "bg-white p-8 rounded-2xl shadow-sm border border-slate-200";
    div.innerHTML = `
        <h3 class="text-xl font-bold text-slate-900 mb-3">Overall Understanding & Reflection</h3>
        <p class="text-slate-600 text-sm mb-4">Write your key takeaway from this GIS accuracy assessment class below:</p>
        <textarea id="reflection-text" rows="4" class="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm mb-4" placeholder="Summarize what you learned about sampling, error matrices, and validation..."></textarea>
        <button onclick="saveReflection()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition">Submit Reflection</button>
        
        <h3 class="text-xl font-bold text-slate-900 mt-10 mb-4 border-t pt-6">🏆 Live Student Scoreboard</h3>
        <div id="leaderboard" class="overflow-x-auto"></div>
    `;
    container.appendChild(div);
    renderLeaderboard();
}

function saveReflection() {
    const text = document.getElementById("reflection-text").value;
    if (text) {
        alert("Reflection submitted successfully!");
    }
}

function renderLeaderboard() {
    const lbContainer = document.getElementById("leaderboard");
    let html = `<table class="w-full text-left border-collapse text-sm">
        <thead><tr class="border-b bg-slate-50"><th class="p-3">Rank</th><th class="p-3">Student Name</th><th class="p-3">Score</th></tr></thead><tbody>`;
    
    const scoresArray = Object.keys(userScores).map(student => {
        let total = Object.values(userScores[student]).reduce((a, b) => a + b, 0);
        return { student, total };
    }).sort((a, b) => b.total - a.total);

    if (scoresArray.length === 0) {
        html += `<tr><td colspan="3" class="p-4 text-center text-slate-400">No quiz attempts recorded yet.</td></tr>`;
    } else {
        scoresArray.forEach((s, i) => {
            html += `<tr class="border-b hover:bg-slate-50"><td class="p-3 font-bold">#${i + 1}</td><td class="p-3 font-medium text-slate-800">${s.student}</td><td class="p-3 text-emerald-600 font-bold">${s.total} pts</td></tr>`;
        });
    }
    html += `</tbody></table>`;
    lbContainer.innerHTML = html;
}
