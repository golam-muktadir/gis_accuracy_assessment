const courseData = {
    parts: [
        {
            id: "part-1",
            title: "1. Understanding Accuracy Assessment",
            sections: [
                {
                    title: "Concept Breakdown (Flip Cards)",
                    type: "flip-cards",
                    cards: [
                        { frontTitle: "Easy Understanding", frontText: "Why can't we just trust a map by looking at it?", backTitle: "The Visual Illusion", backText: "Maps look polished and complete, but computer classification algorithms make mistakes, mislabeling land covers." },
                        { frontTitle: "Literature Definition", frontText: "What do authoritative geospatial guidelines say?", backTitle: "Congalton & Green Standard", backText: "Accuracy assessment is the quantitative comparison of a classified map against reference data assumed to be true." },
                        { frontTitle: "Technical Perspective", frontText: "How is it measured statistically?", backTitle: "Error Matrix & Metrics", backText: "Using omission/commission errors, overall accuracy, and Kappa coefficients to test hypotheses." }
                    ]
                },
                {
                    title: "Why Do We Use Accuracy Assessment?",
                    type: "text-block",
                    content: "Every classified map contains errors from sensor noise, mixed pixels, and algorithm limits. Ground truth reference data provides map users with statistical confidence and validation."
                },
                // Example of embedding an Image & Downloadable File (Excel/Word)
                {
                    title: "Multimedia & Resources",
                    type: "media-block",
                    text: "Review the sample accuracy report and download the template spreadsheet below:",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                    downloadFile: { label: "📥 Download Excel Template (Accuracy Matrix)", url: "#" },
                    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // You can replace with any video link
                },
                {
                    title: "Part 1 Quiz",
                    type: "quiz",
                    questions: [
                        {
                            q: "What is the primary role of reference data in accuracy assessment?",
                            options: ["To train machine learning classifiers", "To act as an independent benchmark to verify map accuracy", "To replace satellite imagery"],
                            answer: 1
                        }
                    ]
                }
            ]
        },
        {
            id: "part-2",
            title: "2. Sampling",
            sections: [
                {
                    title: "Sampling Strategies",
                    type: "text-block",
                    content: "Choosing how to collect reference points is critical. Simple Random Sampling often misses rare classes, whereas Stratified Random Sampling ensures minority classes get adequate representation."
                },
                {
                    title: "Part 2 Quiz",
                    type: "quiz",
                    questions: [
                        {
                            q: "Which sampling method guarantees adequate representation for rare classes like urban centers or wetlands?",
                            options: ["Simple Random Sampling", "Stratified Random Sampling", "Systematic Grid Sampling"],
                            answer: 1
                        }
                    ]
                }
            ]
        },
        {
            id: "part-3",
            title: "3. Accuracy Calculation",
            sections: [
                {
                    title: "The Error Matrix & Metrics",
                    type: "text-block",
                    content: "Learn how to compute Producer's Accuracy (omission errors) and User's Accuracy (commission errors) from confusion matrices."
                },
                {
                    title: "Part 3 Quiz",
                    type: "quiz",
                    questions: [
                        {
                            q: "Producer's accuracy relates to which type of error?",
                            options: ["Errors of Commission", "Errors of Omission", "Random Error"],
                            answer: 1
                        }
                    ]
                }
            ]
        },
        {
            id: "part-4",
            title: "4. Reflection & Leaderboard",
            type: "final-section"
        }
    ]
};
