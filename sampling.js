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
            id: "drag-match-game",
            title: "Drag & Match Game",
            sections: [
                {
                    title: "Sampling Properties Matching",
                    type: "drag-match"
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
