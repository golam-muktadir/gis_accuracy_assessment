const samplingData = {
    modules: [
        {
            id: "sampling-basics",
            title: "Sampling Strategies",
            sections: [
                {
                    title: "Sampling Fundamentals",
                    type: "flip-cards",
                    cards: [
                        { frontTitle: "Understanding Sampling", frontText: "Why can't we check every single pixel?", backTitle: "Population vs Sample", backText: "Checking every pixel is impossible due to cost and time; we must use representative subsets." },
                        { frontTitle: "Stratified vs Random", frontText: "How do strategies differ in rare classes?", backTitle: "Class Representation", backText: "Stratified sampling ensures minority classes get adequate points, preventing them from being missed." }
                    ]
                }
            ]
        },
        {
            id: "pixel-grid-sim",
            title: "Pixel Grid Simulation",
            sections: [
                {
                    title: "Interactive Pixel Grid Sampling Simulator",
                    type: "pixel-grid-simulator"
                }
            ]
        },
        {
            id: "drag-match-game",
            title: "Sampling Drag & Match Game",
            sections: [
                {
                    title: "Sampling Methods Match (10 Statements & 5-Min Timer)",
                    type: "drag-match-game"
                }
            ]
        },
        {
            id: "sample-size-calc",
            title: "Sample Size Calculator",
            sections: [
                {
                    title: "Interactive Sample Size Simulator",
                    type: "calculator"
                }
            ]
        },
        {
            id: "sampling-quiz",
            title: "Quiz: Sampling",
            sections: [
                {
                    title: "Sampling Self-Assessment",
                    type: "timed-quiz",
                    questions: [
                        { q: "Which sampling method guarantees representation of rare classes?", options: ["Simple Random", "Stratified Random", "Systematic Grid", "Cluster"], answer: 1, timer: 30, explanation: "Stratified random sampling divides the area by class strata, guaranteeing representation for rare classes." }
                    ]
                }
            ]
        }
    ]
};

// --- RENDERER 1: Pixel Grid Simulation ---
function renderPixelGridSimulator(container) {
    container.innerHTML += `
        <div class="space-y-6 mt-4">
            <p class="text-slate-700 text-base">Select a sampling strategy below to visualize how sample points are distributed over a simulated landscape grid (Green = Forest, Blue = Water, Red = Urban, Yellow = Agriculture).</p>
            
            <div class="flex flex-wrap gap-3">
                <button onclick="runPixelSim('random')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow">Run Simple Random</button>
                <button onclick="runPixelSim('stratified')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow">Run Stratified Random</button>
                <button onclick="runPixelSim('systematic')" class="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow">Run Systematic Grid</button>
            </div>

            <div class="flex justify-center bg-slate-900 p-6 rounded-2xl shadow-inner">
                <div id="pixel-grid-canvas-container" class="grid grid-cols-12 gap-1 bg-slate-950 p-4 rounded-xl border border-slate-700"></div>
            </div>
            
            <div id="pixel-sim-stats" class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm">
                Click a strategy above to generate sample points on the landscape grid.
            </div>
        </div>
    `;
    setTimeout(initPixelGrid, 50);
}

let simulatedGridData = [];
let activeSamplePoints = new Set();

function initPixelGrid() {
    simulatedGridData = [];
    const gridEl = document.getElementById('pixel-grid-canvas-container');
    if (!gridEl) return;
    gridEl.innerHTML = '';

    const landTypes = ['forest', 'water', 'urban', 'agri'];
    for (let r = 0; r < 12; r++) {
        simulatedGridData[r] = [];
        for (let c = 0; c < 12; c++) {
            let type = landTypes[Math.floor(Math.random() * landTypes.length)];
            simulatedGridData[r][c] = type;
            
            const cell = document.createElement('div');
            cell.id = `px-${r}-${c}`;
            cell.className = `w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all ${
                type === 'forest' ? 'bg-emerald-600 text-white' :
                type === 'water' ? 'bg-blue-600 text-white' :
                type === 'urban' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-slate-900'
            }`;
            cell.textContent = "";
            gridEl.appendChild(cell);
        }
    }
}

function runPixelSim(strategy) {
    activeSamplePoints.clear();
    initPixelGrid();

    if (strategy === 'random') {
        while(activeSamplePoints.size < 15) {
            let r = Math.floor(Math.random() * 12);
            let c = Math.floor(Math.random() * 12);
            activeSamplePoints.add(`${r}-${c}`);
        }
        document.getElementById('pixel-sim-stats').innerHTML = `<strong>Simple Random Sampling:</strong> 15 points dropped completely at random. Notice how some clusters or land classes may have fewer samples.`;
    } else if (strategy === 'stratified') {
        ['forest', 'water', 'urban', 'agri'].forEach(type => {
            let matches = [];
            for (let r = 0; r < 12; r++) {
                for (let c = 0; c < 12; c++) {
                    if (simulatedGridData[r][c] === type) matches.push(`${r}-${c}`);
                }
            }
            matches.sort(() => Math.random() - 0.5);
            for (let i = 0; i < Math.min(4, matches.length); i++) {
                activeSamplePoints.add(matches[i]);
            }
        });
        document.getElementById('pixel-sim-stats').innerHTML = `<strong>Stratified Random Sampling:</strong> Equal representation forced across all land cover strata, ensuring minority classes are sampled adequately.`;
    } else if (strategy === 'systematic') {
        for (let r = 1; r < 12; r += 3) {
            for (let c = 1; c < 12; c += 3) {
                activeSamplePoints.add(`${r}-${c}`);
            }
        }
        document.getElementById('pixel-sim-stats').innerHTML = `<strong>Systematic Grid Sampling:</strong> Points placed at regular uniform spatial intervals across the landscape.`;
    }

    activeSamplePoints.forEach(key => {
        let cell = document.getElementById(`px-${key}`);
        if (cell) {
            cell.style.border = "3px solid #fbbf24";
            cell.innerHTML = "✓";
        }
    });
}


// --- RENDERER 2: Drag & Match Game (10 Statements & 5-Min Timer) ---
let dragGameInterval = null;
let timeLeft = 300; // 5 minutes
let matchedCount = 0;

function renderDragMatchGame(container) {
    timeLeft = 300;
    matchedCount = 0;

    container.innerHTML += `
        <div class="space-y-6 mt-4">
            <div class="flex flex-col md:flex-row justify-between items-center bg-slate-900 text-white p-4 rounded-2xl shadow">
                <div class="text-lg font-bold">⏱️ Time Left: <span id="drag-timer" class="text-yellow-400">05:00</span></div>
                <div class="text-lg font-bold">🎯 Matched: <span id="drag-score" class="text-emerald-400">0</span> / 10</div>
                <button onclick="startDragGameTimer()" class="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-sm font-bold">Start / Restart Game</button>
            </div>

            <p class="text-sm text-slate-600 font-medium">Click a statement below, then click either the <strong>Random Sampling</strong> box or <strong>Stratified Sampling</strong> box to match it!</p>

            <div class="grid md:grid-cols-2 gap-6">
                <!-- Statements Pool -->
                <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 class="font-bold text-slate-800 mb-3">Unmatched Statements</h4>
                    <div id="statement-pool" class="space-y-2 max-h-96 overflow-y-auto pr-2"></div>
                </div>

                <!-- Drop Zones -->
                <div class="space-y-4">
                    <div onclick="dropStatement('random')" class="bg-orange-50 border-2 border-dashed border-orange-400 p-5 rounded-2xl cursor-pointer hover:bg-orange-100 transition min-h-[180px]">
                        <h4 class="font-bold text-orange-900 text-lg mb-1">🎲 Random Sampling Zone</h4>
                        <p class="text-xs text-orange-700 mb-3">Click here to assign selected statement to Random Sampling</p>
                        <div id="zone-random" class="space-y-2"></div>
                    </div>

                    <div onclick="dropStatement('stratified')" class="bg-red-50 border-2 border-dashed border-red-400 p-5 rounded-2xl cursor-pointer hover:bg-red-100 transition min-h-[180px]">
                        <h4 class="font-bold text-red-900 text-lg mb-1">📐 Stratified Sampling Zone</h4>
                        <p class="text-xs text-red-700 mb-3">Click here to assign selected statement to Stratified Sampling</p>
                        <div id="zone-stratified" class="space-y-2"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    initDragGameData();
}

let statementsList = [
    { id: 1, text: "Points are selected anywhere, completely random", category: "random", matched: false },
    { id: 2, text: "Points are selected randomly but within each class/stratum", category: "stratified", matched: false },
    { id: 3, text: "Class representation may be uneven across subsets", category: "random", matched: false },
    { id: 4, text: "Guarantees balanced representation for all classes", category: "stratified", matched: false },
    { id: 5, text: "Accuracy estimate can be biased if minority classes are missed", category: "random", matched: false },
    { id: 6, text: "Produces more accurate and reliable standard error estimates", category: "stratified", matched: false },
    { id: 7, text: "Simple implementation with minimal prior stratification needed", category: "random", matched: false },
    { id: 8, text: "Requires prior map data to define strata boundaries", category: "stratified", matched: false },
    { id: 9, text: "High variance possible when sampling rare land covers", category: "random", matched: false },
    { id: 10, text: "Optimal allocation reduces overall standard error", category: "stratified", matched: false }
];

let selectedCardId = null;

function initDragGameData() {
    statementsList.forEach(s => s.matched = false);
    matchedCount = 0;
    renderStatementPool();
}

function renderStatementPool() {
    const pool = document.getElementById('statement-pool');
    const rZone = document.getElementById('zone-random');
    const sZone = document.getElementById('zone-stratified');
    if (!pool) return;

    pool.innerHTML = '';
    rZone.innerHTML = '';
    sZone.innerHTML = '';

    statementsList.forEach(item => {
        if (!item.matched) {
            const div = document.createElement('div');
            div.className = `p-3 bg-white rounded-xl border cursor-pointer text-sm font-medium shadow-sm transition ${selectedCardId === item.id ? 'border-emerald-500 ring-2 ring-emerald-300' : 'border-slate-200 hover:bg-slate-100'}`;
            div.textContent = item.text;
            div.onclick = () => { selectedCardId = item.id; renderStatementPool(); };
            pool.appendChild(div);
        } else {
            const matchDiv = document.createElement('div');
            matchDiv.className = `p-2.5 rounded-lg text-xs font-semibold ${item.category === 'random' ? 'bg-orange-100 text-orange-900 border border-orange-300' : 'bg-red-100 text-red-900 border border-red-300'}`;
            matchDiv.textContent = `✓ ${item.text}`;
            if (item.category === 'random') rZone.appendChild(matchDiv);
            else sZone.appendChild(matchDiv);
        }
    });

    document.getElementById('drag-score').textContent = matchedCount;
}

function dropStatement(targetCategory) {
    if (selectedCardId === null) {
        alert("Please select a statement from the left panel first!");
        return;
    }
    const item = statementsList.find(s => s.id === selectedCardId);
    if (item && item.category === targetCategory) {
        item.matched = true;
        matchedCount++;
        selectedCardId = null;
        renderStatementPool();
        
        if (matchedCount === 10) {
            clearInterval(dragGameInterval);
            alert("🏆 Congratulations! You successfully matched all 10 statements!");
            // Log score into user profile
            if (!userScores[currentStudent]) userScores[currentStudent] = {};
            userScores[currentStudent]["sampling_drag_game"] = 20;
            localStorage.setItem("gis_user_scores", JSON.stringify(userScores));
            updateScoreDisplay();
        }
    } else {
        alert("❌ Incorrect category for this statement! Try the other zone.");
    }
}

function startDragGameTimer() {
    if (dragGameInterval) clearInterval(dragGameInterval);
    timeLeft = 300;
    initDragGameData();
    
    dragGameInterval = setInterval(() => {
        timeLeft--;
        let m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        let s = (timeLeft % 60).toString().padStart(2, '0');
        const timerEl = document.getElementById('drag-timer');
        if (timerEl) timerEl.textContent = `${m}:${s}`;

        if (timeLeft <= 0) {
            clearInterval(dragGameInterval);
            alert("⏰ Time's up! Try again to complete all matches.");
        }
    }, 1000);
}
