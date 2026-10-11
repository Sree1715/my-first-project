let confidence = 0;
let history = [];
let sortedResults = [];
let users = [];
let password = "admin";
let currentTabId = 'calcTab';

// Set User (Unlock Calculator)
function setUser() {
    let name = document.getElementById("username").value;

    if (name === "") {
        alert("Enter your name!");
        return;
    }

    document.getElementById("calculatorSection").style.display = "block";
    document.getElementById("loginSection").style.display = "none";

    document.getElementById("message").innerText = "🤝Welcome " + name + "! Ready to calculate?";

    users.push(name);
    if (users.length > 3) users.shift();

    showTab('calcTab');
    addSubjectRow();
    updateCutoffInputs();
}

// Append values
function append(value) {
    document.getElementById("expression").value += value;
}

// Clear
function clearDisplay() {
    document.getElementById("expression").value = "";
}

// Delete last
function deleteLast() {
    let exp = document.getElementById("expression");
    exp.value = exp.value.slice(0, -1);
}

// Calculate
function calculateExpression() {
    let exp = document.getElementById("expression").value;

    try {
        let result = eval(exp);

        document.getElementById("expression").value = result;

        confidence++;
        addHistory("✅" + exp + " = " + result);
        addSorted(result);

    } catch {
        alert("❌Invalid Expression");
        confidence--;
    }

    updateFeedback();
}

// Feedback
function updateFeedback() {
    document.getElementById("confidence").innerText = "Confidence: " + confidence;

    let msg = document.getElementById("message");

    if (confidence >= 10) {
        msg.innerText = "🚀 Genius Mode Activated! Keep going!";
    } else if (confidence >= 7) {
        msg.innerText = "🔥 Excellent work! You're on fire!";
    } else if (confidence >= 4) {
        msg.innerText = "😊 Nice! You're doing great!";
    } else if (confidence >= 1) {
        msg.innerText = "👍 Good start! Keep practicing!";
    } else if (confidence === 0) {
        msg.innerText = "😐 Neutral... try something!";
    } else if (confidence >= -3) {
        msg.innerText = "⚠ Oops! Small mistake, try again!";
    } else {
        msg.innerText = "😢 Don't worry! Practice makes perfect!";
    }
}

// History
function addHistory(item) {
    history.push(item);

    let list = document.getElementById("historyList");
    list.innerHTML = "";

    history.forEach(i => {
        let li = document.createElement("li");
        li.innerText = i;
        list.appendChild(li);
    });
}

// Sorted
function addSorted(num) {
    sortedResults.push(num);
    sortedResults.sort((a, b) => a - b);

    let list = document.getElementById("sortedList");
    list.innerHTML = "";

    sortedResults.forEach(i => {
        let li = document.createElement("li");
        li.innerText = i;
        list.appendChild(li);
    });
}

// Show Users
function showUsers() {
    let pass = prompt("Enter password");

    if (pass === password) {
        let list = document.getElementById("userList");
        list.innerHTML = "";

        users.forEach(u => {
            let li = document.createElement("li");
            li.innerText = u;
            list.appendChild(li);
        });
    } else {
        alert("Wrong password");
    }
}

// Change Password
function changePassword() {
    let oldPass = prompt("Enter old password:");

    if (oldPass === password) {
        let newPass = prompt("Enter new password:");
        password = newPass;
        alert("Password changed!");
    } else {
        alert("❌Wrong password!");
    }
}

function showTab(tabId, button) {
    const panes = document.querySelectorAll('.tab-pane');
    panes.forEach(pane => pane.style.display = 'none');

    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).style.display = 'block';

    if (!button) {
        button = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    }
    if (button) {
        button.classList.add('active');
    }

    currentTabId = tabId;
}

function handleArrowKeys(event) {
    if (document.getElementById('calculatorSection').style.display !== 'block') return;

    const tabOrder = ['calcTab', 'cgpaTab', 'cutoffTab'];
    const index = tabOrder.indexOf(currentTabId);
    if (index === -1) return;

    if (event.key === 'ArrowRight' && index < tabOrder.length - 1) {
        showTab(tabOrder[index + 1]);
    }
    if (event.key === 'ArrowLeft' && index > 0) {
        showTab(tabOrder[index - 1]);
    }
}

function addSubjectRow() {
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.innerHTML = `
        <input type="text" class="subject-name" placeholder="Subject Code">
        <input type="number" class="credit" placeholder="Credit" min="0" step="0.5">
        <select class="grade">
            <option value="">Grade point</option>
            <option value="10">O (10)</option>
            <option value="9">A+ (9)</option>
            <option value="8">A (8)</option>
            <option value="7">B+ (7)</option>
            <option value="6">B (6)</option>
            <option value="5">C (5)</option>
            <option value="4">P (4)</option>
            <option value="0">F (0)</option>
        </select>
        <button type="button" onclick="removeSubjectRow(this)">×</button>
    `;
    document.getElementById('subjectRows').appendChild(row);
}

function removeSubjectRow(button) {
    const row = button.closest('.subject-row');
    if (row) row.remove();
}

function calculateCgpa() {
    const rows = document.querySelectorAll('#subjectRows .subject-row');
    let totalQuality = 0;
    let totalCredits = 0;

    rows.forEach(row => {
        const credit = parseFloat(row.querySelector('.credit').value);
        const gradeSelect = row.querySelector('.grade');
        const gradeValue = gradeSelect ? parseFloat(gradeSelect.value) : NaN;

        if (!isNaN(credit) && !isNaN(gradeValue) && credit > 0) {
            totalQuality += credit * gradeValue;
            totalCredits += credit;
        }
    });

    if (totalCredits === 0) {
        alert('Enter valid subject credit and grade point to compute CGPA.');
        return;
    }

    const cgpa = totalQuality / totalCredits;
    document.getElementById('cgpaResult').innerText = `CGPA: ${cgpa.toFixed(2)}`;
}

// Enter key support for the username field
document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById("username");

    if (usernameInput) {
        usernameInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                setUser();
            }
        });
    }

    document.addEventListener('keydown', handleArrowKeys);
});

function updateCutoffInputs() {
    const category = document.getElementById("cutoffCategory").value;
    const inputsDiv = document.getElementById("cutoffInputs");
    inputsDiv.innerHTML = "";

    let html = "";
    if (category === "Engineering") {
        html = `
            <input type="number" id="maths" placeholder="Maths marks" min="0" max="100" step="0.01">
            <input type="number" id="physics" placeholder="Physics marks" min="0" max="100" step="0.01">
            <input type="number" id="chemistry" placeholder="Chemistry marks" min="0" max="100" step="0.01">
        `;
    } else if (category === "Agriculture") {
        html = `
            <input type="number" id="zoology" placeholder="Zoology marks" min="0" max="100" step="0.01">
            <input type="number" id="botany" placeholder="Botany marks" min="0" max="100" step="0.01">
            <input type="number" id="physics2" placeholder="Physics marks" min="0" max="100" step="0.01">
            <input type="number" id="chemistry2" placeholder="Chemistry marks" min="0" max="100" step="0.01">
        `;
    } else if (category === "Paramedical") {
        html = `
            <input type="number" id="biology" placeholder="Biology marks" min="0" max="100" step="0.01">
            <input type="number" id="physics3" placeholder="Physics marks" min="0" max="100" step="0.01">
            <input type="number" id="chemistry3" placeholder="Chemistry marks" min="0" max="100" step="0.01">
        `;
    }
    inputsDiv.innerHTML = html;
}

function calculateCutoff() {
    const category = document.getElementById("cutoffCategory").value;
    const resultLabel = document.getElementById("cutoffResult");
    let cutoff = 0;

    try {
        if (category === "Engineering") {
            const maths = parseFloat(document.getElementById("maths").value) || 0;
            const physics = parseFloat(document.getElementById("physics").value) || 0;
            const chemistry = parseFloat(document.getElementById("chemistry").value) || 0;

            cutoff = maths + (physics / 2) + (chemistry / 2);
            resultLabel.innerText = `Engineering Cutoff: ${cutoff.toFixed(2)}`;

        } else if (category === "Agriculture") {
            const zoology = parseFloat(document.getElementById("zoology").value) || 0;
            const botany = parseFloat(document.getElementById("botany").value) || 0;
            const physics = parseFloat(document.getElementById("physics2").value) || 0;
            const chemistry = parseFloat(document.getElementById("chemistry2").value) || 0;

            cutoff = (zoology / 2) + (botany / 2) + (physics / 2) + (chemistry / 2);
            resultLabel.innerText = `Pure Science (Agri) Cutoff: ${cutoff.toFixed(2)}`;

        } else if (category === "Paramedical") {
            const biology = parseFloat(document.getElementById("biology").value) || 0;
            const physics = parseFloat(document.getElementById("physics3").value) || 0;
            const chemistry = parseFloat(document.getElementById("chemistry3").value) || 0;

            const cutoffScore = (biology / 2) + ((physics + chemistry) / 4);
            const finalMark = cutoffScore * 2;
            resultLabel.innerText = `Paramedical Cutoff: ${cutoffScore.toFixed(2)} | Final Mark: ${finalMark.toFixed(2)}`;
        }
    } catch (error) {
        alert("Please enter valid marks for all subjects.");
    }
}
