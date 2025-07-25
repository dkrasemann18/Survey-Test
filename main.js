// --- Embedded survey questions ---
const surveyQuestions = [
    {
        label: "What is your name?",
        type: "text",
        name: "name",
        required: true,
    },
    {
        label: "What is your email?",
        type: "email",
        name: "email",
        required: true,
    },
    {
        label: "What are your favorite Gen AI prompts you’d like to share with others?",
        type: "textarea",
        name: "fav_prompts",
        required: false,
    },
    {
        label: "What is your Offering?",
        type: "radio",
        name: "offering",
        required: true,
        options: [
            "Strategy",
            "Valuation & Modeling",
            "Infrastructure & Real Estate",
            "Performance Improvement & Restructuring",
            "Sustainability Strategy",
            "Sustainability, Infrastructure & Real Estate, and Resilience (GPS)"
        ]
    },
    {
        label: "Task category?",
        type: "checkbox",
        name: "task_category",
        required: true,
        options: [
            "Research & Analysis",
            "Brainstorm",
            "Drafting & Writing"
        ]
    }
];

// --- Embedded prompt library (sample; add all your real prompts here) ---
const promptLibrary = [
    {
        offering: "Strategy",
        task_category: "Research & Analysis",
        prompt: "I am researching the electric vehicle market to understand current trends and how competitors are positioning themselves. What are the top 5 emerging trends in the EV industry, and how are key players like Tesla and GM responding to each trend? Please provide a brief explanation for each trend."
    },
    {
        offering: "Strategy",
        task_category: "Research & Analysis",
        prompt: "Our client wants insight on digital transformation in banking. Identify Deloitte thought leadership articles or Points of View on the future of digital banking and summarize 2–3 key insights from each. Focus on how these insights could apply to our mid-sized bank client."
    },
    {
        offering: "Strategy",
        task_category: "Brainstorm",
        prompt: "Our client is a large automotive manufacturer looking for growth beyond its core vehicle sales. Brainstorm innovative growth opportunities – for example, new markets, customer segments, or business lines (like mobility services or electric battery technology). For each idea, provide a one-liner on how it could drive revenue or competitive advantage."
    },
    // ... Paste all rows from your CSV as objects here!
];

// --- Form logic ---
const formContainer = document.getElementById('form-container');
const resultsContainer = document.getElementById('results-container');
const resultsList = document.getElementById('results-list');
let userAnswers = {};
let currentStep = 0;

function renderStep() {
    formContainer.innerHTML = '';
    let q = surveyQuestions[currentStep];
    let div = document.createElement('div');
    div.className = 'question-step';

    let label = document.createElement('label');
    label.textContent = q.label + (q.required ? ' *' : '');
    div.appendChild(label);

    if (q.type === "text" || q.type === "email") {
        let input = document.createElement('input');
        input.type = q.type;
        input.name = q.name;
        input.value = userAnswers[q.name] || '';
        if (q.required) input.required = true;
        div.appendChild(input);
    } else if (q.type === "textarea") {
        let input = document.createElement('textarea');
        input.name = q.name;
        input.rows = 4;
        input.value = userAnswers[q.name] || '';
        div.appendChild(input);
    } else if (q.type === "radio") {
        let optsDiv = document.createElement('div');
        optsDiv.className = 'options-list';
        q.options.forEach(opt => {
            let radioId = `radio_${q.name}_${opt.replace(/[^a-zA-Z0-9]/g, '')}`;
            let optionLabel = document.createElement('label');
            let radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = q.name;
            radio.value = opt;
            radio.id = radioId;
            if (userAnswers[q.name] === opt) radio.checked = true;
            optionLabel.appendChild(radio);
            optionLabel.appendChild(document.createTextNode(opt));
            optsDiv.appendChild(optionLabel);
        });
        div.appendChild(optsDiv);
    } else if (q.type === "checkbox") {
        let optsDiv = document.createElement('div');
        optsDiv.className = 'options-list';
        let selected = userAnswers[q.name] || [];
        q.options.forEach(opt => {
            let checkboxId = `checkbox_${q.name}_${opt.replace(/[^a-zA-Z0-9]/g, '')}`;
            let optionLabel = document.createElement('label');
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = q.name;
            checkbox.value = opt;
            checkbox.id = checkboxId;
            if (selected.includes(opt)) checkbox.checked = true;
            optionLabel.appendChild(checkbox);
            optionLabel.appendChild(document.createTextNode(opt));
            optsDiv.appendChild(optionLabel);
        });
        div.appendChild(optsDiv);
    }

    let nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.textContent = (currentStep === surveyQuestions.length - 1) ? 'See Prompts' : 'Next';
    nextBtn.onclick = () => {
        let q = surveyQuestions[currentStep];
        if (q.type === "radio") {
            let checked = div.querySelector('input[type=radio]:checked');
            if (q.required && !checked) {
                inputError();
                return;
            }
            userAnswers[q.name] = checked ? checked.value : '';
        } else if (q.type === "checkbox") {
            let checked = div.querySelectorAll('input[type=checkbox]:checked');
            if (q.required && checked.length === 0) {
                inputError();
                return;
            }
            userAnswers[q.name] = Array.from(checked).map(cb => cb.value);
        } else {
            let val = div.querySelector(q.type === "textarea" ? 'textarea' : 'input').value.trim();
            if (q.required && !val) {
                inputError();
                return;
            }
            userAnswers[q.name] = val;
        }
        // Next step or results
        if (currentStep < surveyQuestions.length - 1) {
            currentStep++;
            renderStep();
        } else {
            showResults();
        }
    };

    div.appendChild(nextBtn);
    formContainer.appendChild(div);
}

function inputError() {
    let err = document.createElement('div');
    err.style.color = "#d0011b";
    err.style.marginTop = "0.5rem";
    err.textContent = "Please fill out this field!";
    formContainer.appendChild(err);
}

function showResults() {
    formContainer.style.display = 'none';
    // Filter prompts
    let selectedOffer = userAnswers['offering'];
    let selectedTaskCategories = userAnswers['task_category'] || [];
    if (!Array.isArray(selectedTaskCategories)) {
        selectedTaskCategories = [selectedTaskCategories];
    }
    let filtered = promptLibrary.filter(p =>
        p.offering === selectedOffer &&
        selectedTaskCategories.includes(p.task_category)
    );
    let html = '';
    if (filtered.length === 0) {
        html = '<div style="color:#d0011b;font-weight:500;">No prompts found for your selections.</div>';
    } else {
        filtered.forEach(p => {
            html += `<div class="prompt-block">
                <div class="prompt-category">${p.offering}
                    <span class="prompt-task">${p.task_category}</span>
                </div>
                <div class="prompt-text">${p.prompt}</div>
            </div>`;
        });
    }
    resultsList.innerHTML = html;
    resultsContainer.style.display = '';
    // Save for download
    resultsContainer.dataset.prompts = JSON.stringify(filtered);
}

// Download logic
function promptsToCSV(prompts) {
    const header = ["Offering", "Task Category", "Prompt"];
    const rows = prompts.map(p => [p.offering, p.task_category, `"${p.prompt.replace(/"/g, '""')}"`]);
    return [header.join(","), ...rows.map(r => r.join(","))].join("\r\n");
}
function promptsToText(prompts) {
    return prompts.map((p, i) =>
        `Prompt ${i+1}\nOffering: ${p.offering}\nTask Category: ${p.task_category}\nPrompt: ${p.prompt}\n`
    ).join("\n-------------------------\n");
}
document.getElementById('download-csv').onclick = function() {
    const prompts = JSON.parse(resultsContainer.dataset.prompts || '[]');
    const blob = new Blob([promptsToCSV(prompts)], {type: "text/csv"});
    downloadBlob(blob, "filtered_prompts.csv");
};
document.getElementById('download-txt').onclick = function() {
    const prompts = JSON.parse(resultsContainer.dataset.prompts || '[]');
    const blob = new Blob([promptsToText(prompts)], {type: "text/plain"});
    downloadBlob(blob, "filtered_prompts.txt");
};
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
}
// Restart logic
document.getElementById('restart').onclick = function() {
    resultsContainer.style.display = 'none';
    formContainer.style.display = '';
    userAnswers = {};
    currentStep = 0;
    renderStep();
};

// --- On page load ---
renderStep();
