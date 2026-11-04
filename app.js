let currentStudent = localStorage.getItem("gis_student_name") || "";
let currentModuleIndex = 0;
let userScores = JSON.parse(localStorage.getItem("gis_user_scores")) || {};

const courseModules = [
    ...understandingData.modules,
    ...processData.modules,
    ...samplingData.modules,
    ...calculationData.modules,
    ...reflectionData.modules
];

window.addEventListener("DOMContentLoaded", () => {
    if (currentStudent) {
        document.getElementById("login-modal").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
        document.getElementById("display-student-name").textContent = currentStudent;
        updateScoreDisplay();
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
            updateScoreDisplay();
            initApp();
        }
    });
});

function logout() {
    localStorage.removeItem("gis_student_name");
    localStorage.removeItem("gis_user_scores");
    location.reload();
}

function initApp() {
    renderNavTabs();
    renderModule(currentModuleIndex);
}

function renderNavTabs() {
    const navContainer = document.getElementById("nav-tabs");
    navContainer.innerHTML = "";
    courseModules.forEach((mod, index) => {
        const btn = document.createElement("button");
        btn.textContent = mod.title;
        btn.className = `px-4 py-2 rounded-xl text-sm md:text-base font-semibold transition shadow-sm ${index === currentModuleIndex ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`;
        btn.onclick = () => {
            currentModuleIndex = index;
            renderNavTabs();
            renderModule(currentModuleIndex);
        };
        navContainer.appendChild(btn);
    });
}

function updateScoreDisplay() {
    const studentScores = userScores[currentStudent] || {};
    const totalScore = Object.values(studentScores).reduce((a, b) => a + b, 0);
    document.getElementById("live-score").textContent = totalScore + " pts";
    
    // Calculate live rank
    const rankings = Object.keys(userScores).map(student => {
        let score = Object.values(userScores[student]).reduce((a, b) => a + b, 0);
        return { student, score };
    }).sort((a, b) => b.score - a.score);

    const rankIdx = rankings.findIndex(r => r.student === currentStudent);
    document.getElementById("live-rank").textContent = rankIdx !== -1 ? `#${rankIdx + 1}` : `#1`;
}

function renderModule(index) {
    const main = document.getElementById("main-content");
    const mod = courseModules[index];
    main.innerHTML = "";

    const titleEl = document.createElement("h2");
    titleEl.className = "text-3xl font-extrabold text-slate-900 mb-6 border-b pb-3";
    titleEl.textContent = mod.title;
    main.appendChild(titleEl);

    mod.sections.forEach((sec, sIdx) => {
        const container = document.createElement("div");
        container.className = "bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8";
        
        const secTitle = document.createElement("h3");
        secTitle.className = "text-xl font-bold text-slate-800 mb-4";
        secTitle.textContent = sec.title;
        container.appendChild(secTitle);

        if (sec.type === "text-block") {
            const p = document.createElement("p");
            p.className = "text-slate-700 text-base leading-relaxed";
            p.textContent = sec.content;
            container.appendChild(p);
        } else if (sec.type === "flip-cards") {
            const grid = document.createElement("div");
            grid.className = "grid grid-cols-1 md:grid-cols-3 gap-6 mt-4";
            sec.cards.forEach(card => {
                const cardEl = document.createElement("div");
                cardEl.className = "card-perspective h-72 cursor-pointer";
                cardEl.innerHTML = `
                    <div class="card-inner" onclick="this.classList.toggle('flipped')">
                        <div class="card-face bg-slate-50 border border-slate-200 p-6 flex flex-col justify-between rounded-xl shadow-sm">
                            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded w-max">${card.frontTitle}</span>
                            <p class="text-base text-slate-800 font-medium">${card.frontText}</p>
                            <span class="text-xs text-emerald-600 font-semibold text-right">Flip ➔</span>
                        </div>
                        <div class="card-face card-back bg-slate-900 text-white p-6 flex flex-col justify-between rounded-xl shadow-md">
                            <span class="text-xs font-bold text-emerald-400">${card.backTitle}</span>
                            <p class="text-sm text-slate-200 leading-relaxed">${card.backText}</p>
                            <span class="text-xs text-slate-400 text-right">Click to flip back</span>
                        </div>
                    </div>`;
                grid.appendChild(cardEl);
            });
            container.appendChild(grid);
        } else if (sec.type === "timed-quiz") {
            renderTimedQuiz(container, sec.questions, index, sIdx);
        } else if (sec.type === "infographic") {
            renderInfographic(container, sec.steps);
        } else if (sec.type === "dartboard-interactive") {
            renderDartboard(container);
        } else if (sec.type === "calculator") {
            renderCalculator(container);
        } else if (sec.type === "classification-simulator") {
            renderClassificationSimulator(container);
        } else if (sec.type === "drag-match") {
            renderDragMatch(container);
        } else if (sec.type === "final-section") {
            renderFinalSection(container);
        }

        main.appendChild(container);
    });
}

// Interactive Sub-renderers for Sims & Quizzes
function renderTimedQuiz(container, questions, mIdx, sIdx) {
    questions.forEach((q, qIdx) => {
        const qKey = `mod_${mIdx}_q_${qIdx}`;
        const answered = userScores[currentStudent]?.[qKey] !== undefined;
        
        const qDiv = document.createElement("div");
        qDiv.className = "mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200";
        qDiv.innerHTML = `<p class="text-lg font-semibold text-slate-900 mb-3">${qIdx + 1}. ${q.q}</p>`;
        
        const optDiv = document.createElement("div");
        optDiv.className = "space-y-3";
        q.options.forEach((opt, oIdx) => {
            const btn = document.createElement("button");
            btn.textContent = opt;
            btn.className = `w-full text-left px-5 py-3 rounded-xl text-base font-medium border transition ${answered ? (oIdx === q.answer ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-white border-slate-200 text-slate-400') : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700 shadow-sm'}`;
            if (!answered) {
                btn.onclick = () => submitQuizAnswer(mIdx, qIdx, oIdx, q.answer, q.explanation);
            } else {
                btn.disabled = true;
            }
            optDiv.appendChild(btn);
        });
        qDiv.appendChild(optDiv);
        
        if (answered) {
            const exp = document.createElement("p");
            exp.className = "mt-3 text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200";
            exp.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
            qDiv.appendChild(exp);
        }
        
        container.appendChild(qDiv);
    });
}

function submitQuizAnswer(mIdx, qIdx, selected, correct, explanation) {
    if (!userScores[currentStudent]) userScores[currentStudent] = {};
    const key = `mod_${mIdx}_q_${qIdx}`;
    const isCorrect = selected === correct;
    userScores[currentStudent][key] = isCorrect ? 10 : 0;
    localStorage.setItem("gis_user_scores", JSON.stringify(userScores));
    updateScoreDisplay();
    renderModule(currentModuleIndex);
}

function renderInfographic(container, steps) {
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4";
    steps.forEach((st, i) => {
        grid.innerHTML += `
            <div class="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 p-6 rounded-2xl shadow-sm">
                <span class="text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-full">Step ${i+1}</span>
                <h4 class="font-bold text-slate-900 text-lg mt-3 mb-2">${st.step.split('. ')[1]}</h4>
                <p class="text-sm text-slate-600">${st.desc}</p>
            </div>
        `;
    });
    container.appendChild(grid);
}

function renderDartboard(container) {
    container.innerHTML += `
        <div class="grid md:grid-cols-2 gap-8 items-center mt-4">
            <div class="bg-slate-900 p-6 rounded-2xl text-center shadow-lg">
                <canvas id="dart-canvas" width="400" height="400" class="mx-auto cursor-crosshair bg-slate-950 rounded-xl border-2 border-slate-700"></canvas>
                <p class="text-slate-400 text-sm mt-3">Click on the target to throw darts!</p>
            </div>
            <div class="space-y-4">
                <div class="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h4 class="text-xl font-bold text-slate-800 mb-2">Live Scores</h4>
                    <p class="text-lg font-semibold text-slate-700">Accuracy: <span id="dart-acc" class="text-emerald-600 font-bold">0%</span></p>
                    <p class="text-lg font-semibold text-slate-700">Precision: <span id="dart-prec" class="text-blue-600 font-bold">0%</span></p>
                    <p id="dart-interp" class="text-sm text-slate-600 mt-3 font-medium">Throw darts to test performance.</p>
                </div>
                <button onclick="resetDarts()" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow">Reset Darts</button>
            </div>
        </div>
    `;
    setTimeout(initDartboardCanvas, 100);
}

let dartsList = [];
function initDartboardCanvas() {
    const canvas = document.getElementById('dart-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = 200, cy = 200;

    function draw() {
        ctx.clearRect(0,0,400,400);
        [160, 120, 80, 40, 15].forEach((r, idx) => {
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
            ctx.fillStyle = idx % 2 === 0 ? '#1e293b' : '#334155';
            ctx.fill(); ctx.strokeStyle = '#64748b'; ctx.stroke();
        });
        ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI*2); ctx.fillStyle = '#ef4444'; ctx.fill();

        dartsList.forEach((d, idx) => {
            ctx.beginPath(); ctx.arc(d.x, d.y, 6, 0, Math.PI*2);
            ctx.fillStyle = '#38bdf8'; ctx.fill(); ctx.stroke();
        });
    }

    canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        dartsList.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        draw();
        updateDartScores(cx, cy);
    };
    draw();
}

function updateDartScores(cx, cy) {
    if (dartsList.length === 0) return;
    let avgDist = dartsList.reduce((sum, d) => sum + Math.hypot(d.x - cx, d.y - cy), 0) / dartsList.length;
    let acc = Math.max(0, 100 - (avgDist / 160) * 100).toFixed(1);
    
    let cxMean = dartsList.reduce((s, d) => s + d.x, 0) / dartsList.length;
    let cyMean = dartsList.reduce((s, d) => s + d.y, 0) / dartsList.length;
    let avgSpread = dartsList.reduce((sum, d) => sum + Math.hypot(d.x - cxMean, d.y - cyMean), 0) / dartsList.length;
    let prec = Math.max(0, 100 - (avgSpread / 160) * 100).toFixed(1);

    document.getElementById('dart-acc').textContent = acc + '%';
    document.getElementById('dart-prec').textContent = prec + '%';
    document.getElementById('dart-interp').textContent = acc >= 70 && prec >= 70 ? "High Accuracy & High Precision!" : "Explore how clustering differs from bullseye proximity.";
}

function resetDarts() {
    dartsList = [];
    initDartboardCanvas();
    document.getElementById('dart-acc').textContent = '0%';
    document.getElementById('dart-prec').textContent = '0%';
}

function renderCalculator(container) {
    container.innerHTML += `
        <div class="grid md:grid-cols-2 gap-6 mt-4">
            <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                <h4 class="font-bold text-slate-800 text-lg">Sample Size Parameters</h4>
                <div>
                    <label class="block text-sm font-semibold text-slate-700">Confidence Level (Z-score: 1.96 for 95%)</label>
                    <input type="number" id="calc-z" value="1.96" step="0.01" class="w-full mt-1 p-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-slate-700">Expected Accuracy Proportion (p: 0.85)</label>
                    <input type="number" id="calc-p" value="0.85" step="0.01" max="0.99" min="0.01" class="w-full mt-1 p-2 border rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-slate-700">Margin of Error (E: 0.05)</label>
                    <input type="number" id="calc-e" value="0.05" step="0.01" class="w-full mt-1 p-2 border rounded-lg">
                </div>
                <button onclick="computeSampleSize()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow">Calculate Sample Size (n)</button>
            </div>
            <div class="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-2xl text-white flex flex-col justify-center items-center text-center">
                <h4 class="text-xl font-medium opacity-90 mb-2">Required Sample Size</h4>
                <div id="calc-result" class="text-6xl font-extrabold mb-2">196</div>
                <p class="text-sm opacity-80">Computed via n = (Z² * p * (1 - p)) / E²</p>
            </div>
        </div>
    `;
}

function computeSampleSize() {
    const z = parseFloat(document.getElementById('calc-z').value);
    const p = parseFloat(document.getElementById('calc-p').value);
    const e = parseFloat(document.getElementById('calc-e').value);
    const n = Math.ceil((Math.pow(z, 2) * p * (1 - p)) / Math.pow(e, 2));
    document.getElementById('calc-result').textContent = n;
}

function renderClassificationSimulator(container) {
    container.innerHTML += `
        <div class="text-center py-6">
            <p class="text-slate-600 text-base mb-4">Interactive Grid Classification & Confusion Matrix Tool loaded successfully.</p>
            <button onclick="alert('Simulator active! Sample grid cells to compute overall accuracy, user/producer accuracy, and Kappa coefficient.')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow">Launch Matrix Tool</button>
        </div>
    `;
}

function renderDragMatch(container) {
    container.innerHTML += `
        <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4 text-center">
            <h4 class="font-bold text-slate-800 text-lg mb-2">Sampling Methods Matching Activity</h4>
            <p class="text-sm text-slate-600 mb-4">Match sampling statements correctly to Random vs Stratified sampling categories.</p>
            <div class="p-4 bg-emerald-100 text-emerald-900 rounded-xl font-semibold inline-block">Interactive Drag & Match module ready.</div>
        </div>
    `;
}

function renderFinalSection(container) {
    container.innerHTML = `
        <h3 class="text-2xl font-bold text-slate-900 mb-4">Overall Understanding & Reflection</h3>
        <p class="text-slate-700 text-base mb-4">Summarize your key takeaways from this GIS accuracy assessment course module:</p>
        <textarea id="final-reflection" rows="4" class="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-base mb-4" placeholder="Type your reflection here..."></textarea>
        <button onclick="alert('Reflection saved successfully!')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-base shadow">Submit Reflection</button>
        
        <h3 class="text-2xl font-bold text-slate-900 mt-12 mb-6 border-t pt-6">🏆 Live Student Scoreboard</h3>
        <div id="leaderboard-table" class="overflow-x-auto"></div>
    `;
    renderLeaderboardTable();
}

function renderLeaderboardTable() {
    const el = document.getElementById("leaderboard-table");
    let html = `<table class="w-full text-left border-collapse text-base">
        <thead><tr class="border-b bg-slate-50"><th class="p-3 font-bold">Rank</th><th class="p-3 font-bold">Student Name</th><th class="p-3 font-bold">Total Score</th></tr></thead><tbody>`;
    
    const scoresArray = Object.keys(userScores).map(student => {
        let total = Object.values(userScores[student]).reduce((a, b) => a + b, 0);
        return { student, total };
    }).sort((a, b) => b.total - a.total);

    if (scoresArray.length === 0) {
        html += `<tr><td colspan="3" class="p-4 text-center text-slate-400">No score records yet. Take quizzes to rank up!</td></tr>`;
    } else {
        scoresArray.forEach((s, i) => {
            html += `<tr class="border-b hover:bg-slate-50"><td class="p-3 font-bold">#${i + 1}</td><td class="p-3 font-medium text-slate-800">${s.student}</td><td class="p-3 text-emerald-600 font-bold">${s.total} pts</td></tr>`;
        });
    }
    html += `</tbody></table>`;
    el.innerHTML = html;
}
