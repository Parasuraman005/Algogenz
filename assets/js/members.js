(function() {
  'use strict';

  // DOM elements
  const joinToggle = document.getElementById('join-toggle');
  const joinForm = document.getElementById('join-form');
  const joinedList = document.getElementById('joined-list');
  const successMessage = document.getElementById('success-message');

  // Storage key
  const STORAGE_KEY = 'algogenz_joined_members';

  // Initialize Firebase (optional - for cloud storage)
  let firebaseInitialized = false;
  let db = null;

  // Try to initialize Firebase if available
  function initFirebase() {
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
      try {
        db = firebase.firestore();
        firebaseInitialized = true;
        console.log('Firebase initialized successfully');
      } catch (error) {
        console.warn('Firebase initialization failed:', error);
      }
    }
  }

  // Load Firebase SDK dynamically (optional)
  function loadFirebase() {
    if (typeof firebase === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
      script.onload = () => {
        const authScript = document.createElement('script');
        authScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
        authScript.onload = initFirebase;
        document.head.appendChild(authScript);
      };
      document.head.appendChild(script);
    } else {
      initFirebase();
    }
  }

  // Local storage functions
  function saveToLocalStorage(members) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  function loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return [];
    }
  }

  // Cloud storage functions (Firebase)
  async function saveToCloud(member) {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not available, using localStorage only');
      return false;
    }

    try {
      await db.collection('joined_members').add({
        ...member,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Failed to save to cloud:', error);
      return false;
    }
  }

  async function loadFromCloud() {
    if (!firebaseInitialized || !db) {
      return [];
    }

    try {
      const snapshot = await db.collection('joined_members')
        .orderBy('timestamp', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Failed to load from cloud:', error);
      return [];
    }
  }

  // Form toggle functionality
  function toggleForm() {
    const isVisible = joinForm.style.display !== 'none';
    joinForm.style.display = isVisible ? 'none' : 'block';
    joinToggle.textContent = isVisible ? 'Join the Club' : 'Cancel';
  }

  // Create member table row HTML
  function createMemberRow(member, index) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="text-align: center; font-weight: 600; color: var(--primary);">${index + 1}</td>
      <td style="font-weight: 500;">${member.name}</td>
      <td>${member.dept}</td>
      <td style="text-align: center;">${member.year}</td>
      <td style="text-align: center; color: var(--accent); font-weight: 500;">Member</td>
    `;
    return row;
  }

  // Render members table
  function renderMembers(members) {
    joinedList.innerHTML = '';
    
    if (members.length === 0) {
      joinedList.innerHTML = '<p style="text-align: center; color: #888; padding: 40px; font-style: italic;">No members have joined yet. Be the first!</p>';
      return;
    }

    // Create table structure
    const table = document.createElement('table');
    table.className = 'members-table';
    
    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>S.No</th>
        <th>Name</th>
        <th>Dept</th>
        <th>Year</th>
        <th>Posting</th>
      </tr>
    `;
    
    // Create table body
    const tbody = document.createElement('tbody');
    members.forEach((member, index) => {
      const row = createMemberRow(member, index);
      tbody.appendChild(row);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    joinedList.appendChild(table);
  }

  // Load and display members
  async function loadMembers() {
    let members = loadFromLocalStorage();
    
    // Try to sync with cloud if available
    if (firebaseInitialized) {
      try {
        const cloudMembers = await loadFromCloud();
        // Merge cloud data with local data, avoiding duplicates
        const localIds = new Set(members.map(m => m.regNo));
        const newCloudMembers = cloudMembers.filter(m => !localIds.has(m.regNo));
        members = [...newCloudMembers, ...members];
        
        // Update local storage with merged data
        saveToLocalStorage(members);
      } catch (error) {
        console.warn('Cloud sync failed, using local data only:', error);
      }
    }

    renderMembers(members);
  }

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(joinForm);
    const member = {
      name: formData.get('name').trim(),
      dept: formData.get('dept').trim(),
      regNo: formData.get('regNo').trim(),
      year: formData.get('year'),
      joinedAt: new Date().toISOString()
    };

    // Validate data
    if (!member.name || !member.dept || !member.regNo || !member.year) {
      alert('Please fill in all fields');
      return;
    }

    // Check for duplicate registration number
    const existingMembers = loadFromLocalStorage();
    if (existingMembers.some(m => m.regNo === member.regNo)) {
      alert('A member with this registration number already exists');
      return;
    }

    // Save to local storage
    existingMembers.unshift(member); // Add to beginning
    saveToLocalStorage(existingMembers);

    // Try to save to cloud
    let cloudSaved = false;
    if (firebaseInitialized) {
      cloudSaved = await saveToCloud(member);
    }

    // Show success message
    successMessage.style.display = 'block';
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 3000); // Hide after 3 seconds

    // Reset form and hide it
    joinForm.reset();
    toggleForm();

    // Reload and display members
    loadMembers();
  }

  // Initialize everything
  function init() {
    // Set up event listeners
    if (joinToggle) {
      joinToggle.addEventListener('click', toggleForm);
    }

    if (joinForm) {
      joinForm.addEventListener('submit', handleSubmit);
    }

    // Load existing members
    loadMembers();

    // Try to initialize Firebase (optional)
    loadFirebase();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
