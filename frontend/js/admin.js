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

async function getStaff() {
    if (USE_MOCK) return [...MOCK_STAFF];
    return apiGet('/staff');
}

async function getCategories() {
    return apiGet('/categories');
}

async function getCages() {
    return apiGet('/cages');
}

async function getZones() {
    return apiGet('/zones');
}

async function getDiets() {
    return apiGet('/diets');
}

async function getConsumes() {
    return apiGet('/consumes');
}

async function getHasMedia() {
    return apiGet('/has-media');
}

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
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorEl  = document.getElementById('errorMessage');
    const pwInput  = document.getElementById('password');

    errorEl.classList.add('hidden');
    pwInput.style.borderColor = '';

    try {
        const res = await fetch(`${API_BASE_URL}/login`, {  // ✅ ใช้ API_BASE_URL, ตัด /api ออก
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
});

        if (res.ok) {
            window.location.href = 'admin-dashboard.html';
            return;
        }

        // แสดง error ตาม status
        const data = await res.json();
        errorEl.textContent =
            res.status === 403 ? "This account does not have admin access." :
            res.status === 401 ? "Invalid username or password." :
            data.error || "Login failed.";
        errorEl.classList.remove('hidden');
        pwInput.style.borderColor = '#d32f2f';

    } catch (err) {
        errorEl.textContent = "Could not reach the server.";
        errorEl.classList.remove('hidden');
    }
}

// API Endpoint: GET /api/dashboard/stats
// Response: { totalAnimals, activeMedicalRecords, totalStaff, upcomingEvents }
async function initDashboardStats() {
    const stats = await getDashboardStats();
    const els = {
        'stat-total-animals': stats.totalAnimals,
        'stat-medical':       stats.activeMedicalRecords,
        'stat-staff':         stats.totalStaff,
        'stat-events':        stats.upcomingEvents
    };
    Object.entries(els).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val.toLocaleString();
    });
}


// Pagination
const ADMIN_PAGE_SIZE = 5;

function createPagination({ tbodyId, containerSelector, pageSize = ADMIN_PAGE_SIZE }) {
    let currentPage = 1;
    let currentData = [];
    let rowFn       = () => '';

    const container  = document.querySelector(containerSelector);
    const labelEl    = container?.querySelector('.table-pagination > span');
    const controlsEl = container?.querySelector('.pagination-controls');
    const tbody      = document.getElementById(tbodyId);

    function buildControls(totalPages) {
        if (!controlsEl) return;

        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('…');
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('…');
            pages.push(totalPages);
        }

        controlsEl.innerHTML = `
            <button class="page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            </button>
            ${pages.map(p => p === '…'
                ? `<span style="padding:0 4px">…</span>`
                : `<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`
            ).join('')}
            <button class="page-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button>`;

        controlsEl.querySelector('.prev-btn')?.addEventListener('click', () => {
            if (currentPage > 1) { currentPage--; render(); }
        });
        controlsEl.querySelector('.next-btn')?.addEventListener('click', () => {
            if (currentPage < totalPages) { currentPage++; render(); }
        });
        controlsEl.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', () => { currentPage = parseInt(btn.dataset.page); render(); });
        });
    }

    function render() {
        const total      = currentData.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (currentPage > totalPages) currentPage = 1;

        const start    = (currentPage - 1) * pageSize;
        const pageData = currentData.slice(start, start + pageSize);

        if (tbody) tbody.innerHTML = pageData.length
            ? pageData.map(rowFn).join('')
            : `<tr><td colspan="6" style="text-align:center;padding:2rem;color:#888">No data found.</td></tr>`;

        if (labelEl) labelEl.textContent = `SHOWING ${Math.min(start + pageSize, total)} OF ${total}`;
        buildControls(totalPages);
    }

    return {
        load(data, renderFn) { currentData = data; rowFn = renderFn; currentPage = 1; render(); },
        refresh(data)        { currentData = data; currentPage = 1; render(); }
    };
}


// Dropdown Helpers
function populateAnimalFilterDropdowns(animals, categories, zones, diets, onChange) {
    const selects = document.querySelectorAll('#animals-view .admin-filters select');
    const [catSel, zoneSel, dietSel] = selects;

    if (catSel) {
        catSel.innerHTML = `<option value="">All Categories</option>`
            + categories.map(c => `<option value="${c.cid}">${c.name}</option>`).join('');
    }
    if (zoneSel) {
        zoneSel.innerHTML = `<option value="">All Zones</option>`
            + zones.map(z => `<option value="${z.zid}">${z.name}</option>`).join('');
    }

    if (dietSel) {
        dietSel.innerHTML = `<option value="">All Diets</option>`
            + diets.map(d => `<option value="${d.did}">${d.dietType}</option>`).join('');
    }

    const getState = () => ({
        categoryId: catSel?.value  ? parseInt(catSel.value)  : null,
        zoneId:     zoneSel?.value ? parseInt(zoneSel.value) : null,
        dietId:     dietSel?.value ? parseInt(dietSel.value) : null
    });

    [catSel, zoneSel, dietSel].forEach(sel => sel?.addEventListener('change', () => onChange(getState())));

    document.querySelector('#animals-view .btn-reset')?.addEventListener('click', () => {
        if (catSel)  catSel.value  = '';
        if (zoneSel) zoneSel.value = '';
        if (dietSel) dietSel.value = '';
        onChange(getState());
    });
}

// Modal dropdowns for Add Animal — values are IDs sent to the API
function populateAnimalModalDropdowns(animals, categories, zones, cages, diets) {
    const modal = document.getElementById('new-animal-modal');
    if (!modal) return;

    const sections = modal.querySelectorAll('.modal-section');

    // Section 1: Category + Class
    const catSel = sections[1]?.querySelectorAll('select')[0];
    if (catSel) {
        catSel.innerHTML = `<option value="">Select Category</option>`
            + categories.map(c => `<option value="${c.cid}">${c.name}</option>`).join('');
    }

    const classSel = sections[1]?.querySelectorAll('select')[1];
    if (classSel) {
        classSel.innerHTML = `<option value="">Select Class</option>`
            + ['Mammalia', 'Aves', 'Reptilia', 'Amphibia', 'Actinopterygii', 'Insecta', 'Arachnida', 'Mythical']
                .map(c => `<option value="${c}">${c}</option>`).join('');
    }

    // Section 2: Zone, Cage, Parent, Diet, Danger
    const mgmt = sections[2]?.querySelectorAll('select');

    if (mgmt?.[0]) {
        mgmt[0].innerHTML = `<option value="">Select Zone</option>`
            + zones.map(z => `<option value="${z.zid}">${z.name}</option>`).join('');
    }

    if (mgmt?.[1]) {
        mgmt[1].innerHTML = `<option value="">Select Cage</option>`
            + cages.map(c => `<option value="${c.caid}">Cage ${c.caid}</option>`).join('');
    }

    if (mgmt?.[2]) {
        mgmt[2].innerHTML = `<option value="">None</option>`
            + animals.map(a => `<option value="${a.id}">${a.name} (ID: ${a.id})</option>`).join('');
    }

    if (mgmt?.[3]) {
        mgmt[3].innerHTML = `<option value="">Select Diet</option>`
            + diets.map(d => `<option value="${d.did}">${d.dietType}</option>`).join('');
    }

    if (mgmt?.[4]) {
        mgmt[4].innerHTML = `<option value="">Select Level</option>`
            + [1, 2, 3, 4, 5].map(l => `<option value="${l}">${getDangerLabel(l)} (${l})</option>`).join('');
    }
}

async function populateMedicalModalDropdowns() {
    const statusSel = document.getElementById('medical-status');
    if (statusSel) {
        statusSel.innerHTML = `<option value="">Select Status</option>`
            + ['HEALTHY', 'MONITORING', 'INJURED', 'CRITICAL', 'RECOVERING']
                .map(s => `<option value="${s}">${s}</option>`).join('');
    }

    // Animal + Staff ดึงจาก API พร้อมกัน
    const [animals, staff] = await Promise.all([
        getAdminAnimals(),
        getStaff()
    ]);

    const animalSel = document.getElementById('medical-animal-id');
    if (animalSel) {
        animalSel.innerHTML = `<option value="">Select Animal</option>`
            + animals.map(a => `<option value="${a.id}">${a.name} (ID: ${a.id})</option>`).join('');
    }

    const staffSel = document.getElementById('medical-staff-id');

    if (staffSel) {
        staffSel.innerHTML = `<option value="">Select Staff</option>`
            + staff.map(s => `<option value="${s.id}">${s.firstName} ${s.lastName} — ${s.role}</option>`).join('');
    }
}

function populateStaffFilterDropdowns(staff, onChange) {
    const [deptSel, sortSel] = document.querySelectorAll('#staff-view .staff-filters select');

    const roles = [...new Set(staff.map(s => s.role).filter(Boolean))].sort();
    if (deptSel) {
        deptSel.innerHTML = `<option value="">All Departments</option>`
            + roles.map(r => `<option value="${r}">${r.toUpperCase()}</option>`).join('');
    }

    if (sortSel) {
        sortSel.innerHTML = `
            <option value="name-az">Sort by Name (A–Z)</option>
            <option value="name-za">Sort by Name (Z–A)</option>
            <option value="salary-high">Salary (High–Low)</option>
            <option value="salary-low">Salary (Low–High)</option>`;
    }

    const getState = () => ({ dept: deptSel?.value || '', sort: sortSel?.value || 'name-az' });
    [deptSel, sortSel].forEach(sel => sel?.addEventListener('change', () => onChange(getState())));
}


// Row Renderers
function renderAnimalRow(a) {
    return `
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
            <td>${a.zone}</td>
            <td>${a.diet}</td>
            <td>
                <div class="danger-level">
                    <span class="dot ${getDangerDotClass(a.dangerLevel)}"></span>
                    ${getDangerLabel(a.dangerLevel)}
                </div>
            </td>
            <td>
                <div class="table-actions">
                    <button title="Edit">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button title="Delete" onclick="confirmDeleteAnimal(${a.id}, '${a.name}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>`;
}

function renderMedicalRow(r) {
    return `
        <tr>
            <td style="font-weight:600;color:#222">${r.checkupDate}</td>
            <td>${r.notes}</td>
            <td>${r.staffName}</td>
            <td>${r.status}</td>
        </tr>`;
}

function renderStaffRow(s) {
    const initials = (s.firstName[0] + s.lastName[0]).toUpperCase();
    const cssClass = (s.firstName[0] + s.lastName[0]).toLowerCase();
    return `
        <tr>
            <td>
                <div class="table-animal-info">
                    <div class="staff-avatar ${cssClass}">${initials}</div>
                    <div><strong style="color:#222;font-size:.95rem">${s.firstName} ${s.lastName}</strong></div>
                </div>
            </td>
            <td>${s.role.toUpperCase()}</td>
            <td>${s.phone}</td>
            <td>${s.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        </tr>`;
}

// Animal Table (fetch + pagination + filter)

let _animalPager = null;
let _allAnimals  = [];

async function initAdminAnimalsTable() {
    // Fetch animals and all lookup tables in parallel
    const [animals, categories, zones, cages, diets] = await Promise.all([
        getAdminAnimals(),
        getCategories(),
        getZones(),
        getCages(),
        getDiets()
    ]);

    _allAnimals  = animals;
    _animalPager = createPagination({
        tbodyId:           'admin-animals-tbody',
        containerSelector: '#animals-view .admin-table-container'
    });

    populateAnimalModalDropdowns(animals, categories, zones, cages, diets);
    populateMedicalModalDropdowns();

    // Filter state now tracks IDs (null = "show all")
    const state = { categoryId: null, zoneId: null, dietId: null };

    function getFiltered() {
        return _allAnimals.filter(a =>
            (state.categoryId === null || a.categoryId === state.categoryId) &&
            (state.zoneId     === null || a.zoneId     === state.zoneId)     &&
            (state.dietId     === null || a.dietId     === state.dietId)
        );
    }

    function refresh() {
        const filtered = getFiltered();
        _animalPager.load(filtered, renderAnimalRow);
        const subtitle = document.querySelector('#animals-view .admin-subtitle');
        if (subtitle) subtitle.textContent = `Overseeing ${filtered.length} animals`;
    }

    populateAnimalFilterDropdowns(animals, categories, zones, diets, (f) => {
        Object.assign(state, f);
        refresh();
    });

    refresh();
}

// Save / Delete Animal

async function saveAnimalToDB() {
    const formData = {
        name:         document.getElementById('animal-name')?.value?.trim()  || '',
        sciName:      document.getElementById('animal-sci-name')?.value?.trim() || '',
        sex:          (document.getElementById('animal-sex')?.value            || '').toLowerCase(),
        birthDate:    document.getElementById('animal-birth-date')?.value     || '',
        quantity:     parseInt(document.getElementById('animal-quantity')?.value)    || 1,


        categoryId:   parseInt(document.getElementById('animal-category')?.value)   || null,
        class:        document.getElementById('animal-class')?.value                || '',
        bioCharacter: document.getElementById('animal-bio')?.value                  || '',
        description:  document.getElementById('animal-description')?.value          || '',

        zoneId:       parseInt(document.getElementById('animal-zone')?.value)       || null,
        cageId:       parseInt(document.getElementById('animal-cage')?.value)       || null,
        parentId:     parseInt(document.getElementById('animal-parent')?.value)     || null,
        dietId:       parseInt(document.getElementById('animal-diet')?.value)       || null,

        dangerLevel:  parseInt(document.getElementById('animal-danger')?.value)     || 1
    };

    const requiredFields = [
        { key: 'name', label: 'Animal name' },
        { key: 'sciName', label: 'Scientific name' },
        { key: 'sex', label: 'Sex' },
        { key: 'class', label: 'Class' },
        { key: 'birthDate', label: 'Birth date' },
        { key: 'categoryId', label: 'Category' },
        { key: 'zoneId', label: 'Zone' },
        { key: 'cageId', label: 'Cage' },
        { key: 'dietId', label: 'Diet' }
    ];

    for (const field of requiredFields) {
        if (!formData[field.key]) {
            alert(`Please enter ${field.label}.`);
            return;
        }
    }

    const sex_map = {
        male: "m",
        female: "f"
    };

    formData.sex = sex_map[formData.sex];

    try {
        const result = await addAnimal(formData);

        if (result.success) {
            document.querySelectorAll('.modal-overlay')
                .forEach(m => m.classList.remove('active'));

            document.body.style.overflow = '';

            // Re-fetch so local array stays in sync with DB
            const [animals, categories, zones, cages, diets] = await Promise.all([
                getAdminAnimals(),
                getCategories(),
                getZones(),
                getCages(),
                getDiets()
            ]);

            _allAnimals = animals;
            _animalPager?.refresh(_allAnimals);

            populateAnimalModalDropdowns(_allAnimals, categories, zones, cages, diets);

            const subtitle = document.querySelector('#animals-view .admin-subtitle');
            if (subtitle) subtitle.textContent = `Overseeing ${_allAnimals.length} animals`;

            return true;
        } else {
            alert('Failed to save animal.');
        }

    } catch (err) {
        console.error('Save animal error:', err);
        alert('Something went wrong while saving animal.');
    }
}

function confirmDeleteAnimal(id, name) {
    if (confirm(`Delete "${name}"?`)) {
        deleteAnimalById(id).then(() => {
            _allAnimals = _allAnimals.filter(a => a.id !== id);
            _animalPager?.refresh(_allAnimals);
            const subtitle = document.querySelector('#animals-view .admin-subtitle');
            if (subtitle) subtitle.textContent = `Overseeing ${_allAnimals.length} animals`;
        });
    }
}


// Medical Table
async function initMedicalTable() {
    const records = await getMedicalRecords();
    const pager = createPagination({
        tbodyId:           'admin-medical-tbody',
        containerSelector: '#medical-view .admin-table-container'
    });
    pager.load(records, renderMedicalRow);
}

async function saveMedicalToDB() {
    const formData = {
        animalId:    document.getElementById('medical-animal-id')?.value    || '',
        staffId:     document.getElementById('medical-staff-id')?.value     || '',
        checkupDate: document.getElementById('medical-checkup-date')?.value || '',
        status:      document.getElementById('medical-status')?.value       || '',
        notes:       document.getElementById('medical-notes')?.value        || ''
    };
    
    if (!formData.animalId || !formData.checkupDate) {
        alert('Please fill in Animal ID or Checkup Date.');
        return;
    }

    const result = await addMedicalRecord(formData);
    if (result.success) {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
        initMedicalTable();
        return true
    } else {
        alert('Failed to save medical record.');
    }
}


// Staff Table
async function initStaffTable() {
    const staff = await getStaff();
    const pager = createPagination({
        tbodyId:           'admin-staff-tbody',
        containerSelector: '#staff-view .admin-table-container'
    });

    function applySort(data, sort) {
        return [...data].sort((a, b) => {
            if (sort === 'name-az')     return a.firstName.localeCompare(b.firstName);
            if (sort === 'name-za')     return b.firstName.localeCompare(a.firstName);
            if (sort === 'salary-high') return b.salary - a.salary;
            if (sort === 'salary-low')  return a.salary - b.salary;
            return 0;
        });
    }

    const state = { dept: '', sort: 'name-az' };

    function refresh() {
        let result = state.dept ? staff.filter(s => s.role === state.dept) : [...staff];
        result = applySort(result, state.sort);
        pager.load(result, renderStaffRow);
    }

    populateStaffFilterDropdowns(staff, (f) => {
        Object.assign(state, f);
        refresh();
    });

    refresh();
}





document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = handleLogin;
        document.getElementById('password')?.addEventListener('input', function () {
            document.getElementById('errorMessage')?.classList.add('hidden');
            this.style.borderColor = '';
        });
    }

    if (document.getElementById('dashboard-view')) initDashboardStats();
    if (document.getElementById('animals-view'))   initAdminAnimalsTable();
    if (document.getElementById('medical-view'))   initMedicalTable();
    if (document.getElementById('staff-view'))     initStaffTable();
});

/*
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
*/