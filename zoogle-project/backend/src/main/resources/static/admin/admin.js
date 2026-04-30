//  admin.js  —  Admin pages (dashboard, animal management, staff, medical)
//
//  เพื่อน backend: ดู comment "API Endpoint:" ในแต่ละ function
//  เมื่อพร้อมแล้วเปลี่ยน USE_MOCK = false ใน api-config.js

// Mock Data 
const MOCK_ADMIN_ANIMALS = [
    {
        id: 1, name: 'Moodeng', sciName: 'Choeropsis liberiensis',
        zone: 'Rainforest', diet: 'Herbivore', dangerLevel: 1,
        image: 'turtle.png', category: 'Mammals', quantity: 1,
        sex: 'f', birthDate: '2024-07-10', cageId: 3
    },
    {
        id: 2, name: 'Koko', sciName: 'Pan troglodytes',
        zone: 'Tropical Forest', diet: 'Omnivore', dangerLevel: 2,
        image: 'red_panda.png', category: 'Mammals', quantity: 1,
        sex: 'm', birthDate: '2020-03-15', cageId: 5
    },
    {
        id: 3, name: 'Apollo', sciName: 'Gryps aurum',
        zone: 'Savanna', diet: 'Carnivore', dangerLevel: 4,
        image: 'griffin.png', category: 'Fantasy Animals', quantity: 1,
        sex: 'm', birthDate: '2018-06-01', cageId: 7
    },
    {
        id: 4, name: 'Ignis', sciName: 'Draco ignis',
        zone: 'Tropical Forest', diet: 'Carnivore', dangerLevel: 5,
        image: 'phoenix.png', category: 'Fantasy Animals', quantity: 1,
        sex: 'm', birthDate: '2015-01-20', cageId: 8
    },
    {
        id: 5, name: 'Luna', sciName: 'Equus monoceros',
        zone: 'Bamboo Forest', diet: 'Herbivore', dangerLevel: 1,
        image: 'unicorn.png', category: 'Fantasy Animals', quantity: 1,
        sex: 'f', birthDate: '2022-11-05', cageId: 2
    }
];

const MOCK_STAFF = [
    { id: 1, firstName: 'Marcus', lastName: 'Thorne', role: 'Admin', phone: '0889886666', salary: 89000, cageId: null },
    { id: 2, firstName: 'David', lastName: 'Chen', role: 'Zookeeper', phone: '0889884444', salary: 59000, cageId: 5 },
    { id: 3, firstName: 'Elena', lastName: 'Rodriguez', role: 'Veterinary Staff', phone: '0889881111', salary: 109000, cageId: null },
    { id: 4, firstName: 'Robert', lastName: 'King', role: 'Zookeeper', phone: '0889889999', salary: 69000, cageId: 3 }
];

const MOCK_MEDICAL = [
    { id: 1, animalId: 1, checkupDate: '2026-04-03', notes: 'Dental sensitivity noted during training', staffId: 3, staffName: 'Dr. Sarah Kendrick', status: 'MONITORING' },
    { id: 2, animalId: 1, checkupDate: '2026-03-28', notes: 'Annual physical examination and rabies booster administered. Body condition normal.', staffId: 3, staffName: 'Dr. Marcus Webb', status: 'HEALTHY' },
    { id: 3, animalId: 1, checkupDate: '2026-02-16', notes: 'Mild lameness in right front paw. X-ray showed no fracture. Prescribed anti-inflammatory for 5 days.', staffId: 2, staffName: 'Dr. James Lee', status: 'INJURED' },
    { id: 4, animalId: 1, checkupDate: '2026-01-09', notes: 'Routine fecal test for parasites. Results negative. Preventative dewormer applied.', staffId: 1, staffName: 'Dr. Alan Grant', status: 'HEALTHY' }
];

const MOCK_DASHBOARD_STATS = {
    totalAnimals: 1248,
    activeMedicalRecords: 12,
    totalStaff: 142,
    upcomingEvents: 8
};

// API Functions 

// API Endpoint: POST /api/auth/login
// Body: { username, password }
// Response: { token, staffId, role }
async function adminLogin(username, password) {
    if (USE_MOCK) {
        if (username === 'admin' && password === 'password') {
            const mockToken = 'mock-jwt-token-12345';
            sessionStorage.setItem('authToken', mockToken);
            sessionStorage.setItem('adminUser', username);
            return { success: true, token: mockToken };
        }
        return { success: false, message: 'Invalid username or password' };
    }
    const data = await apiPost('/auth/login', { username, password });
    if (data.token) {
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('adminUser', username);
    }
    return data;
}

// API Endpoint: GET /api/animals  (admin version — returns all fields)
async function getAdminAnimals() {
    if (USE_MOCK) return [...MOCK_ADMIN_ANIMALS];
    return apiGet('/animals');
}

// API Endpoint: POST /api/animals
// Body: { name, sciName, sex, birthDate, quantity, categoryId, class, bioCharacter, description, zoneId, cageId, parentId, dietId, dangerLevel }
async function addAnimal(formData) {
    if (USE_MOCK) {
        const newAnimal = {
            id: MOCK_ADMIN_ANIMALS.length + 1,
            ...formData,
            image: 'unicorn.png'
        };
        MOCK_ADMIN_ANIMALS.push(newAnimal);
        return { success: true, animal: newAnimal };
    }
    return apiPost('/animals', formData);
}

// API Endpoint: DELETE /api/animals/{id}
async function deleteAnimalById(id) {
    if (USE_MOCK) {
        const idx = MOCK_ADMIN_ANIMALS.findIndex(a => a.id === id);
        if (idx !== -1) MOCK_ADMIN_ANIMALS.splice(idx, 1);
        return { success: true };
    }
    return apiDelete(`/animals/${id}`);
}

// API Endpoint: GET /api/health-records?animalId=X
async function getMedicalRecords(animalId = null) {
    if (USE_MOCK) {
        if (animalId) return MOCK_MEDICAL.filter(r => r.animalId === parseInt(animalId));
        return [...MOCK_MEDICAL];
    }
    const query = animalId ? `?animalId=${animalId}` : '';
    return apiGet('/health-records' + query);
}

// API Endpoint: POST /api/health-records
// Body: { animalId, staffId, checkupDate, status, notes }
async function addMedicalRecord(formData) {
    if (USE_MOCK) {
        const newRecord = { id: MOCK_MEDICAL.length + 1, ...formData };
        MOCK_MEDICAL.push(newRecord);
        return { success: true, record: newRecord };
    }
    return apiPost('/health-records', formData);
}

// API Endpoint: GET /api/staff
async function getStaff() {
    if (USE_MOCK) return [...MOCK_STAFF];
    return apiGet('/staff');
}

// API Endpoint: GET /api/dashboard/stats
// Response: { totalAnimals, activeMedicalRecords, totalStaff, upcomingEvents }
async function getDashboardStats() {
    if (USE_MOCK) return { ...MOCK_DASHBOARD_STATS };
    return apiGet('/dashboard/stats');
}

// Danger Level Helpers 

function getDangerLabel(level) {
    const map = { 1: 'Low', 2: 'Low', 3: 'Moderate', 4: 'High', 5: 'Extreme' };
    return map[level] || 'Unknown';
}

function getDangerDotClass(level) {
    if (level <= 2) return 'green';
    if (level === 3) return 'yellow';
    if (level === 4) return 'red';
    return 'black';
}

// Login Page

// เรียกใน admin-login.html  (แทน inline handleLogin)
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await adminLogin(username, password);
    if (result.success) {
        window.location.href = 'admin-dashboard.html';
    } else {
        document.getElementById('errorMessage').classList.remove('hidden');
        document.getElementById('password').style.borderColor = '#d32f2f';
    }
}

// Admin Dashboard 
// เรียกตอน dashboard-view โหลด — อัปเดต stat numbers จาก API
async function initDashboardStats() {
    const stats = await getDashboardStats();
    const els = {
        'stat-total-animals': stats.totalAnimals,
        'stat-medical': stats.activeMedicalRecords,
        'stat-staff': stats.totalStaff,
        'stat-events': stats.upcomingEvents
    };
    Object.entries(els).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val.toLocaleString();
    });
}

// Animal Management Table 

// เรียกตอน animals-view โหลด
async function initAdminAnimalsTable() {
    const tbody = document.getElementById('admin-animals-tbody');
    if (!tbody) return;

    const animals = await getAdminAnimals();
    tbody.innerHTML = animals.map(a => `
        <tr id="animal-row-${a.id}">
            <td>
                <div class="table-animal-info">
                    <img src="../images/${(a.image || '').split('/').pop()}" alt="${a.name}"
                         onerror="this.src='../images/unicorn.png'">
                    <div>
                        <strong>${a.name}</strong>
                        <span>ID : ${a.id}</span>
                    </div>
                </div>
            </td>
            <td>${a.sciName}</td>
            <td>Zone ${a.zone}</td>
            <td>${a.diet}</td>
            <td>
                <div class="danger-level">
                    <span class="dot ${getDangerDotClass(a.dangerLevel)}"></span>
                    ${getDangerLabel(a.dangerLevel)}
                </div>
            </td>
            <td>
                <div class="table-actions">
                    <button title="Edit"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                    <button title="Delete" onclick="confirmDeleteAnimal(${a.id}, '${a.name}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>`).join('');

    // อัปเดต subtitle count
    const subtitle = document.querySelector('#animals-view .admin-subtitle');
    if (subtitle) subtitle.textContent = `Overseeing ${animals.length} animals`;
}

// Save / Delete Animal 
// เรียกตอนกด SAVE ใน modal (แทน inline saveAnimal)
async function saveAnimal() {
    const formData = {
        name: document.querySelector('#new-animal-modal input[placeholder=""], #new-animal-modal .form-control:nth-of-type(2)')?.value || '',
        quantity: parseInt(document.querySelector('#new-animal-modal input[type="number"]')?.value) || 0
    };

    const result = await addAnimal(formData);
    if (result.success) {
        alert('Animal saved successfully!');
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
        initAdminAnimalsTable();
    } else {
        alert('Failed to save animal.');
    }
}

// confirm แล้วค่อยลบ
function confirmDeleteAnimal(id, name) {
    if (confirm(`Delete "${name}"?`)) {
        deleteAnimalById(id).then(() => {
            document.getElementById(`animal-row-${id}`)?.remove();
        });
    }
}

// Medical Records Table 
async function initMedicalTable() {
    const tbody = document.getElementById('admin-medical-tbody');
    if (!tbody) return;

    const records = await getMedicalRecords();
    tbody.innerHTML = records.map(r => `
        <tr>
            <td style="font-weight:600;color:#222;">${r.checkupDate}</td>
            <td>${r.notes}</td>
            <td>${r.staffName}</td>
            <td>${r.status}</td>
        </tr>`).join('');
}

// เรียกตอนกด SAVE ใน medical modal
async function saveMedical() {
    const formData = {
        animalId: document.querySelector('#new-medical-modal input[type="text"]')?.value,
        staffId: document.querySelectorAll('#new-medical-modal input[type="text"]')[1]?.value,
        checkupDate: document.querySelector('#new-medical-modal input[type="date"]')?.value,
        status: document.querySelector('#new-medical-modal select')?.value,
        notes: document.querySelector('#new-medical-modal textarea')?.value
    };

    const result = await addMedicalRecord(formData);
    if (result.success) {
        alert('Medical record saved successfully!');
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
        initMedicalTable();
    } else {
        alert('Failed to save medical record.');
    }
}

// Staff Table 

async function initStaffTable() {
    const tbody = document.getElementById('admin-staff-tbody');
    if (!tbody) return;

    const staff = await getStaff();
    tbody.innerHTML = staff.map(s => {
        const initials = (s.firstName[0] + s.lastName[0]).toLowerCase();
        const fullName = `${s.firstName} ${s.lastName}`;
        return `
        <tr>
            <td>
                <div class="table-animal-info">
                    <div class="staff-avatar ${initials}">${initials.toUpperCase()}</div>
                    <div><strong style="color:#222;font-size:.95rem;">${fullName}</strong></div>
                </div>
            </td>
            <td>${s.role.toUpperCase()}</td>
            <td>${s.phone}</td>
            <td>${s.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        </tr>`;
    }).join('');
}

// Auto-init: detect page and run the right functions 
document.addEventListener('DOMContentLoaded', () => {
    // admin-login.html
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = handleLogin;
        document.getElementById('password')?.addEventListener('input', function () {
            document.getElementById('errorMessage')?.classList.add('hidden');
            this.style.borderColor = '';
        });
    }

    // admin-dashboard.html
    if (document.getElementById('dashboard-view')) {
        initDashboardStats();
    }
});
