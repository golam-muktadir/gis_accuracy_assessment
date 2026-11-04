const calculationData = {
    modules: [
        {
            id: "error-metrics",
            title: "Accuracy Calculation",
            sections: [
                {
                    title: "Errors & Accuracies Explained",
                    type: "text-block",
                    content: "Omission errors occur when reference pixels are missed by the classifier (measured by Producer's Accuracy). Commission errors occur when pixels are falsely included in a class (measured by User's Accuracy). Overall accuracy and Kappa evaluate global map quality."
                }
            ]
        },
        {
            id: "classification-tool",
            title: "Interactive Matrix Tool",
            sections: [
                {
                    title: "Interactive Map Classification & Error Matrix Tool",
                    type: "classification-simulator"
                }
            ]
        }
    ]
};
