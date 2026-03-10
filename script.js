// Sample data stored locally (in a real app, this would be in a database)
let allProblems = [];

// Load problems from localStorage when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProblems();
    displayProblems();
    setupEventListeners();
});

function setupEventListeners() {
    // Form submission
    document.getElementById('problemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitProblem();
    });

    // Filter problems
    document.getElementById('filterCategory').addEventListener('change', function() {
        displayProblems();
    });
}

function submitProblem() {
    const category = document.getElementById('category').value;
    const problem = document.getElementById('problem').value;
    const email = document.getElementById('anonymous').value;

    if (!category || !problem.trim()) {
        alert('Please select a category and describe your problem');
        return;
    }

    // Create problem object
    const newProblem = {
        id: Date.now(),
        category: category,
        text: problem,
        email: email ? '***' : 'Anonymous', // Hide email
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        replies: 0,
        anonymous: 'Student_' + Math.floor(Math.random() * 10000)
    };

    // Add to list
    allProblems.unshift(newProblem);
    
    // Save to localStorage
    saveProblems();

    // Clear form
    document.getElementById('problemForm').reset();

    // Show success message
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 5000);

    // Refresh display
    displayProblems();
}

function displayProblems() {
    const filterCategory = document.getElementById('filterCategory').value;
    const problemsList = document.getElementById('problemsList');

    // Filter problems
    let filtered = allProblems;
    if (filterCategory) {
        filtered = allProblems.filter(p => p.category === filterCategory);
    }

    // Clear list
    problemsList.innerHTML = '';

    if (filtered.length === 0) {
        problemsList.innerHTML = '<p class="no-problems">No problems in this category yet. Be the first to share!</p>';
        return;
    }

    // Display each problem
    filtered.forEach(problem => {
        const categoryEmoji = getCategoryEmoji(problem.category);
        const categoryName = getCategoryName(problem.category);

        const problemHTML = `
            <div class="problem">
                <div class="problem-header">
                    <h3>${categoryEmoji} ${categoryName}</h3>
                    <span class="problem-category">${problem.anonymous}</span>
                </div>
                <p class="problem-text">${problem.text}</p>
                <div class="problem-meta">
                    <span>📅 ${problem.date}</span>
                    <span>⏰ ${problem.time}</span>
                    <span>💬 ${problem.replies} replies</span>
                </div>
            </div>
        `;

        problemsList.innerHTML += problemHTML;
    });
}

function getCategoryEmoji(category) {
    const emojis = {
        'subject': '📚',
        'scam': '⚠️',
        'academic': '🎯',
        'administrative': '📋',
        'hostel': '🏠',
        'facilities': '🏢',
        'other': '❓'
    };
    return emojis[category] || '❓';
}

function getCategoryName(category) {
    const names = {
        'subject': 'Subject-Related Problem',
        'scam': 'Scam/Harassment',
        'academic': 'Academic Issue',
        'administrative': 'Administrative Issue',
        'hostel': 'Hostel & Accommodation',
        'facilities': 'Campus Facilities',
        'other': 'Other'
    };
    return names[category] || 'Other';
}

function saveProblems() {
    localStorage.setItem('studentProblems', JSON.stringify(allProblems));
}

function loadProblems() {
    const saved = localStorage.getItem('studentProblems');
    if (saved) {
        allProblems = JSON.parse(saved);
    }
}