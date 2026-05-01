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
    animals = await apiGet('/admin_animals');
    return animals
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

async function getAnimalMainMedia(animalId) {
    if (!animalId) {
        console.log("getMainMedia no AID")
        return null;
    }

    return apiGet(`/animal/${animalId}/media/main`);
}

async function getDashboardStats() {
    if (USE_MOCK) return { ...MOCK_DASHBOARD_STATS };
    return apiGet('/dashboard/stats');
}

async function getEvents() {
    return apiGet('/events');
}

async function updateAnimal(id, formData) {
    return apiPut(`/animals/${id}`, formData);
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

    // const classSel = sections[1]?.querySelectorAll('select')[1];
    // if (classSel) {
    //     classSel.innerHTML = `<option value="">Select Class</option>`
    //         + ['Mammalia', 'Aves', 'Reptilia', 'Amphibia', 'Actinopterygii', 'Insecta', 'Arachnida', 'Mythical']
    //             .map(c => `<option value="${c}">${c}</option>`).join('');
    // }

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

async function populateMedicalModalDropdowns(animals, staff) {
    const statusSel = document.getElementById('medical-status');
    if (statusSel) {
        statusSel.innerHTML = `<option value="">Select Status</option>`
            + ['HEALTHY', 'MONITORING', 'INJURED', 'CRITICAL', 'RECOVERING']
                .map(s => `<option value="${s}">${s}</option>`).join('');
    }


    const animalSel = document.getElementById('medical-animal-id');
    if (animalSel) {
        animalSel.innerHTML = `<option value="">Select Animal</option>`
            + animals.map(a => `<option value="${a.id}">${a.name} (ID: ${a.id})</option>`).join('');
    }

    const staffSel = document.getElementById('medical-staff-id');

    staffSel.innerHTML = `<option value="">Select Staff</option>`
        + staff
            .filter(s => s.role !== 'Admin')  
            .map(s => `<option value="${s.id}">${s.firstName} ${s.lastName} — ${s.role}</option>`)
            .join('');
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




function populateEditAnimalModalDropdowns(currentAnimalId, animals, categories, zones, cages, diets) {
    const modal = document.getElementById('edit-animal-modal');
    if (!modal) return;

    const catSel = modal.querySelector('#edit-animal-category');
    if (catSel) {
        catSel.innerHTML = `<option value="">Select Category</option>`
            + categories.map(c => `<option value="${c.cid}">${c.name}</option>`).join('');
    }

    const zoneSel = modal.querySelector('#edit-animal-zone');
    if (zoneSel) {
        zoneSel.innerHTML = `<option value="">Select Zone</option>`
            + zones.map(z => `<option value="${z.zid}">${z.name}</option>`).join('');
    }

    const cageSel = modal.querySelector('#edit-animal-cage');
    if (cageSel) {
        cageSel.innerHTML = `<option value="">Select Cage</option>`
            + cages.map(c => `<option value="${c.caid}">Cage ${c.caid}</option>`).join('');
    }

    const parentSel = modal.querySelector('#edit-animal-parent');
    if (parentSel) {
        parentSel.innerHTML =
            `<option value="">None</option>` +
            animals
                .filter(a => a.id !== currentAnimalId) 
                .map(a => `<option value="${a.id}">${a.name} (ID: ${a.id})</option>`)
                .join('');
    }

    const dietSel = modal.querySelector('#edit-animal-diet');
    if (dietSel) {
        dietSel.innerHTML = `<option value="">Select Diet</option>`
            + diets.map(d => `<option value="${d.did}">${d.dietType}</option>`).join('');
    }

    const dangerSel = modal.querySelector('#edit-animal-danger');
    if (dangerSel) {
        dangerSel.innerHTML = `<option value="">Select Level</option>`
            + [1, 2, 3, 4, 5].map(l => `<option value="${l}">${getDangerLabel(l)} (${l})</option>`).join('');
    }
}

function fillEditAnimalForm(animal) {
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val ?? '';
    };

    const sexVal = animal.sex === 'm' ? 'Male' : animal.sex === 'f' ? 'Female' : '';

    setVal('edit-animal-name',        animal.name);
    setVal('edit-animal-sex',         sexVal);
    setVal('edit-animal-birth-date',  animal.birthDate);
    setVal('edit-animal-quantity',    animal.quantity);
    setVal('edit-animal-category',    animal.categoryId);
    setVal('edit-animal-class',       animal.class);
    setVal('edit-animal-sci-name',    animal.sciName);
    setVal('edit-animal-bio',         animal.bioCharacter);
    setVal('edit-animal-description', animal.description);
    setVal('edit-animal-zone',        animal.zoneId);
    setVal('edit-animal-cage',        animal.cageId);
    setVal('edit-animal-parent',      animal.parentId ?? '');
    setVal('edit-animal-diet',        animal.dietId);
    setVal('edit-animal-danger',      animal.dangerLevel);
}


async function openEditAnimalModal(animalId, data) {
    const modal = document.getElementById('edit-animal-modal');
    if (!modal) return;

    if (!data) {
        [animals, categories, zones, cages, diets] = await Promise.all([
            getAdminAnimals(),
            getCategories(),
            getZones(),
            getCages(),
            getDiets()
        ]);
    } else {
        animals = data.animals;
        categories = data.categories;
        zones = data.zones;
        cages = data.cages;
        diets = data.diets;
    }



    const idSel = document.getElementById('edit-animal-id');
    if (idSel) {
        idSel.innerHTML =
            `<option value="">Select Animal</option>` +
            animals.map(a =>
                `<option value="${a.id}">${a.name} (ID: ${a.id})</option>`
            ).join('');

        idSel.onchange = function () {
            const animal = animals.find(a => a.id === parseInt(this.value));
            if (animal) fillEditAnimalForm(animal);
        };
    }

    populateEditAnimalModalDropdowns(animalId, animals, categories, zones, cages, diets);

    const animalFirst = animals.find(a => a.id === parseInt(animalId));

    if (animalFirst) {
        idSel.value = animalFirst.id;
        fillEditAnimalForm(animalFirst);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Row Renderers
function renderAnimalRow(a) {
    return `
        <tr id="animal-row-${a.id}">
            <td>
                <div class="table-animal-info">
                    <img src="${a.image}" alt="${a.name}"
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
                    <button title="Edit" onclick="openEditAnimalModal(${a.id})">
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
let _allDataCache = {
    animals: [],
    categories: [],
    zones: [],
    cages: [],
    diets: [],
    events: [],
    records: [],
    stats: {},
    staff: []
}

async function fetchAllDataCache() {
    const [
        animals,
        categories,
        zones,
        cages,
        diets,
        events,
        records,
        stats,
        staff
    ] = await Promise.all([
        getAdminAnimals(),
        getCategories(),
        getZones(),
        getCages(),
        getDiets(),
        getEvents(),
        getMedicalRecords(),
        getDashboardStats(),
        getStaff()
    ]);

    return {
        animals,
        categories,
        zones,
        cages,
        diets,
        events,
        records,
        stats,
        staff
    };
}



// Save / Delete Animal

async function saveAnimalToDB() {
    const formData = {
        name:         document.getElementById('animal-name')?.value?.trim()     || '',
        sciName:      document.getElementById('animal-sci-name')?.value?.trim() || '',
        sex:          (document.getElementById('animal-sex')?.value             || '').toLowerCase(),
        birthDate:    document.getElementById('animal-birth-date')?.value       || '',
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
        { key: 'name',       label: 'Animal name' },
        { key: 'sciName',    label: 'Scientific name' },
        { key: 'sex',        label: 'Sex' },
        { key: 'class',      label: 'Class' },
        { key: 'birthDate',  label: 'Birth date' },
        { key: 'categoryId', label: 'Category' },
        { key: 'zoneId',     label: 'Zone' },
        { key: 'cageId',     label: 'Cage' },
        { key: 'dietId',     label: 'Diet' },
    ];

    for (const f of requiredFields) {
        if (!formData[f.key]) { alert(`Please enter ${f.label}.`); return; }
    }

    const sex_map = { male: 'm', female: 'f' };
    formData.sex = sex_map[formData.sex] ?? formData.sex;


    try {
        const result = await addAnimal(formData);
        if (result.success) {
            const imageResult = await uploadAnimalImage(result.aid);
            if (imageResult) console.log('Image uploaded:', imageResult.url);

            resetImageUpload();
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            document.body.style.overflow = '';

            // reload ข้อมูลใหม่ทั้งหมด
            // const [animals, categories, zones, cages, diets] = await Promise.all([
            //     getAdminAnimals(), getCategories(), getZones(), getCages(), getDiets()
            // ]);


            _allDataCache = await fetchAllDataCache();

            _animalPager?.refresh(_allDataCache.animals);
            populateAnimalModalDropdowns(_allDataCache.animals, _allDataCache.categories, _allDataCache.zones, _allDataCache.cages, _allDataCache.diets);
            initCategoriesDiversity(_allDataCache)
            initDashboardStats(_allDataCache)

            const subtitle = document.querySelector('#animals-view .admin-subtitle');
            if (subtitle) {
                const zoneCount = new Set(_allDataCache.animals.map(a => a.zone).filter(Boolean)).size;
                subtitle.textContent = `Overseeing ${_allDataCache.animals.length} animals in ${zoneCount} zones`;
            }

            return true;
        } else {
            alert('Failed to save animal.');
        }
    } catch (err) {
        console.error('Save animal error:', err);
        alert('Something went wrong while saving animal.');
    }
}


async function updateAnimalInDB() {
    const animalId = document.getElementById('edit-animal-id')?.value;
    if (!animalId) { alert('Please select an animal.'); return; }

    const sexRaw = (document.getElementById('edit-animal-sex')?.value || '').toLowerCase();
    const sex_map = { male: 'm', female: 'f' };

    const formData = {
        id:           parseInt(animalId),
        name:         document.getElementById('edit-animal-name')?.value          || '',
        sciName:      document.getElementById('edit-animal-sci-name')?.value?.trim() || '',
        sex:          sex_map[sexRaw] ?? sexRaw,
        birthDate:    document.getElementById('edit-animal-birth-date')?.value       || '',
        quantity:     parseInt(document.getElementById('edit-animal-quantity')?.value)    || 1,
        categoryId:   parseInt(document.getElementById('edit-animal-category')?.value)   || null,
        class:        document.getElementById('edit-animal-class')?.value                || '',
        bioCharacter: document.getElementById('edit-animal-bio')?.value                  || '',
        description:  document.getElementById('edit-animal-description')?.value          || '',
        zoneId:       parseInt(document.getElementById('edit-animal-zone')?.value)       || null,
        cageId:       parseInt(document.getElementById('edit-animal-cage')?.value)       || null,
        parentId:     parseInt(document.getElementById('edit-animal-parent')?.value)     || null,
        dietId:       parseInt(document.getElementById('edit-animal-diet')?.value)       || null,
        dangerLevel:  parseInt(document.getElementById('edit-animal-danger')?.value)     || 1
    };

    const requiredFields = [
        { key: 'sciName',    label: 'Scientific name' },
        { key: 'sex',        label: 'Sex' },
        { key: 'class',      label: 'Class' },
        { key: 'birthDate',  label: 'Birth date' },
        { key: 'categoryId', label: 'Category' },
        { key: 'zoneId',     label: 'Zone' },
        { key: 'cageId',     label: 'Cage' },
        { key: 'dietId',     label: 'Diet' },
    ];

    for (const f of requiredFields) {
        if (!formData[f.key]) { alert(`Please enter ${f.label}.`); return; }
    }

    try {
        const result = await updateAnimal(animalId, formData);
        if (!result.success) { alert('Failed to update animal.'); return; }

        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';

        // const [animals, categories, zones, cages, diets] = await Promise.all([
        //     getAdminAnimals(), getCategories(), getZones(), getCages(), getDiets()
        // ]);

        // const mediaResults = await Promise.allSettled(
        //     animals.map(a => getAnimalMainMedia(a.id))
        // );
        // animals.forEach((a, i) => {
        //     const res = mediaResults[i];
        //     a.mainImage = res.status === 'fulfilled' && res.value?.url
        //         ? res.value.url : '../images/unicorn.png';
        // });

        _allDataCache = await fetchAllDataCache();

        // _allDataCache.animals = animals;
        _animalPager?.refresh(_allDataCache.animals);
        populateAnimalModalDropdowns(_allDataCache.animals, _allDataCache.categories, _allDataCache.zones, _allDataCache.cages, _allDataCache.diets);
        initCategoriesDiversity(_allDataCache)
        initDashboardStats(_allDataCache)

        const subtitle = document.querySelector('#animals-view .admin-subtitle');
        if (subtitle) {
            const zoneCount = new Set(_allDataCache.animals.map(a => a.zone).filter(Boolean)).size;
            subtitle.textContent = `Overseeing ${_allDataCache.animals.length} animals in ${zoneCount} zones`;
        }

        return true;
    } catch (err) {
        console.error('Update animal error:', err);
        alert('Something went wrong while updating animal.');
    }
}

function confirmDeleteAnimal(id, name) {
    if (confirm(`Delete "${name}"?`)) {
        deleteAnimalById(id).then(async () => {
            _allDataCache.animals = _allDataCache.animals.filter(a => a.id !== id);
            _animalPager?.refresh(_allDataCache.animals);
            const subtitle = document.querySelector('#animals-view .admin-subtitle');
            if (subtitle) subtitle.textContent = `Overseeing ${_allDataCache.animals.length} animals`;

            _allDataCache = await fetchAllDataCache();
            
            initMedicalTable(_allDataCache);
        });
    }
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
        _allDataCache = await fetchAllDataCache()
        await initMedicalTable(_allDataCache);
        return true
    } else {
        alert('Failed to save medical record.');
    }
}

// API Endpoint: GET /api/dashboard/stats
// Response: { totalAnimals, activeMedicalRecords, totalStaff, upcomingEvents }
async function initDashboardStats(data) {
    let stats;
    if (!data) {
        const res = await getDashboardStats();
        stats = res;
    } else {
        stats = data.stats;
    }

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

async function initAdminAnimalsTable(data) {
    // Fetch animals and all lookup tables in parallel
    let animals, categories, zones, cages, diets, staff;

    if (!data) {
        [animals, categories, zones, cages, diets, staff] = await Promise.all([
            getAdminAnimals(),
            getCategories(),
            getZones(),
            getCages(),
            getDiets(),
            getStaff(),
        ]);
    } else {
        animals = data.animals;
        categories = data.categories;
        zones = data.zones;
        cages = data.cages;
        diets = data.diets;
        staff = data.staff
    }


    _allDataCache.animals  = animals;
    _animalPager = createPagination({
        tbodyId:           'admin-animals-tbody',
        containerSelector: '#animals-view .admin-table-container'
    });

    populateAnimalModalDropdowns(animals, categories, zones, cages, diets);
    populateMedicalModalDropdowns(animals, staff);

    // Filter state now tracks IDs (null = "show all")
    const state = { categoryId: null, zoneId: null, dietId: null };

    function getFiltered() {
        return _allDataCache.animals.filter(a =>
            (state.categoryId === null || a.categoryId === state.categoryId) &&
            (state.zoneId     === null || a.zoneId     === state.zoneId)     &&
            (state.dietId     === null || a.dietId     === state.dietId)
        );
    }

    function refresh() {
        const filtered = getFiltered();
        _animalPager.load(filtered, renderAnimalRow);
        const subtitle = document.querySelector('#animals-view .admin-subtitle');
        if (subtitle) {
            const zoneCount = new Set(filtered.map(a => a.zone).filter(Boolean)).size;
            subtitle.textContent = `Overseeing ${filtered.length} animals in ${zoneCount} zones`;
        }
    }

    populateAnimalFilterDropdowns(animals, categories, zones, diets, (f) => {
        Object.assign(state, f);
        refresh();
    });

    refresh();
}

// Medical Table
async function initMedicalTable(data) {
    let records;
    if (!data) {
        records = await getMedicalRecords();
    } else {
        records = data.records;
    }
    console.log(data)
    await initMedicalProfileCard(data);
    await initDashboardTreatments(data)
    const pager = createPagination({
        tbodyId:           'admin-medical-tbody',
        containerSelector: '#medical-view .admin-table-container'
    });
    pager.load(records, renderMedicalRow);
}



// Staff Table
async function initStaffTable(data) {
    let staff;
    if (!data) {
        staff = await getStaff();
    } else {
        staff = data.staff;
    }

    updateStaffStatsGrid(staff);

    const subtitle = document.querySelector('#staff-view .admin-subtitle');
    if (subtitle) subtitle.textContent = `Managing ${staff.length} Active conservation and administrative professionals.`;

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


async function initDashboardTreatments(data) {
    let records, animals;

    if (!data) {
        [records, animals] = await Promise.all([
            getMedicalRecords(),
            getAdminAnimals()
        ]);
    } else {
        records = data.records;
        animals = data.animals;
    }

    const list = document.querySelector('.treatments-list');
    if (!list) return;

    // ── ค่า default เมื่อไม่มีข้อมูล ──
    if (!records.length) {
        list.innerHTML = `
        <div class="treatment-item" style="justify-content:center;color:#aaa;padding:1.5rem 0">
            <p>No medical records available.</p>
        </div>`;
        return;
    }

    // ── โหลด mainImage เฉพาะสัตว์ที่ใช้ใน 3 records แรก ──
    const topRecords = records.slice(0, 3);
    const uniqueAIDs = [...new Set(topRecords.map(r => r.animalId))];
    const mediaMap   = {};

    await Promise.allSettled(
        uniqueAIDs.map(async aid => {
            const res = await getAnimalMainMedia(aid);
            mediaMap[aid] = res?.url || '../images/unicorn.png';
        })
    );

    list.innerHTML = topRecords.map(r => {
        const animal = animals.find(a => a.id === r.animalId);
        const img    = mediaMap[r.animalId] || '../images/unicorn.png';
        const name   = animal?.name ?? `Animal #${r.animalId}`;

        const statusClass = r.status === 'HEALTHY'    ? 'completed'
                          : r.status === 'MONITORING' ? 'in-progress'
                          : r.status === 'INJURED'    ? 'in-progress'
                          : r.status === 'CRITICAL'   ? 'in-progress'
                          : 'completed';

        const preview = r.notes?.length > 40
            ? r.notes.substring(0, 40) + '...'
            : (r.notes ?? '—');

        return `
        <div class="treatment-item">
            <img src="${img}" alt="${name}"
                 onerror="this.src='../images/unicorn.png'">
            <div class="treatment-info">
                <h4>${name}</h4>
                <p>${preview}</p>
            </div>
            <div class="treatment-meta">
                <span class="date">${r.checkupDate ?? ''}</span>
                <span class="status ${statusClass}">${r.status ?? ''}</span>
            </div>
        </div>`;
    }).join('');
}

async function initCategoriesDiversity(data) {
    let animals, categories;

    if (!data) {
        [animals, categories] = await Promise.all([
            getAdminAnimals(),
            getCategories()
        ]);
    } else {
        animals = data.animals;
        categories = data.categories;
    }

    const total = animals.length || 1;

    const countMap = {};
    animals.forEach(a => {
        const key = a.category || 'Others';
        countMap[key] = (countMap[key] || 0) + 1;
    });

    const sorted = Object.entries(countMap)
        .map(([name, count]) => ({ name, pct: Math.round(count / total * 100) }))
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 4);

    const barsEl = document.querySelector('.diversity-bars');
    if (!barsEl) return;

    barsEl.innerHTML = sorted.map(({ name, pct }) => `
        <div class="bar-group">
            <div class="bar-label">
                <span>${name}</span>
                <span>${pct}%</span>
            </div>
            <div class="bar-bg">
                <div class="bar-fill" style="width: ${pct}%;"></div>
            </div>
        </div>`).join('');
}


async function initDashboardEvents(data) {
    let events;

    if (!data) {
        events = await getEvents();
    } else {
        events = data.events;
    }

    const grid   = document.querySelector('.admin-events-grid');
    if (!grid) return;

    grid.innerHTML = events.slice(0, 2).map(e => `
        <div class="admin-event-card">
            <img src="../images/macaw.png" alt="${e.showName}"
                 onerror="this.src='../images/macaw.png'">
            <div class="admin-event-info">
                <span class="event-zone">${e.zone ? `ZONE ${e.zone.zid}: ${e.zone.name.toUpperCase()}` : 'UNKNOWN ZONE'}</span>
                <h3>${e.showName}</h3>
                <div class="event-time">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    ${e.showTime ?? 'TBD'} · ${e.showDate ?? ''}
                </div>
            </div>
        </div>`).join('');
}

async function initDashboard(data) {
    // await Promise.all([
    //     initDashboardStats(data),
    //     initDashboardTreatments(data),
    //     initCategoriesDiversity(data),
    //     initDashboardEvents(data)
    // ]);

    initDashboardStats(data),
    initDashboardTreatments(data),
    initCategoriesDiversity(data),
    initDashboardEvents(data)
}

async function initMedicalProfileCard(data) {
    let records;
    if (!data) {
        records = await getMedicalRecords();
        animals = await getAdminAnimals();
    } else {
        records = data.records;
        animals = data.animals;
    }

    const card = document.querySelector('.medical-profile-card');
    if (!card) return;

    // ── ค่า default เมื่อไม่มีข้อมูล ──
    if (!records.length) {
        const img = card.querySelector('.medical-profile-img');
        if (img) { img.src = '../images/unicorn.png'; img.alt = 'No animal'; }

        const h2 = card.querySelector('h2');
        if (h2) h2.textContent = 'No Records';

        const tags = card.querySelector('.tags');
        if (tags) tags.innerHTML = `<span class="tag-healthy">—</span>`;

        const sub = card.querySelector('.medical-profile-sub');
        if (sub) sub.textContent = 'No animal data available';

        const boxes = card.querySelectorAll('.info-box-value');
        if (boxes[0]) boxes[0].textContent = '—';
        if (boxes[1]) boxes[1].textContent = '—';
        if (boxes[2]) boxes[2].textContent = '—';
        return;
    }

    const firstRecord = records[0];
    
    const animal      = animals.find(a => a.id === firstRecord.animalId);

    // ── ค่า default เมื่อไม่เจอ animal ──
    if (!animal) {
        const h2 = card.querySelector('h2');
        if (h2) h2.textContent = `Animal #${firstRecord.animalId}`;

        const sub = card.querySelector('.medical-profile-sub');
        if (sub) sub.textContent = 'Animal data not found';

        const boxes = card.querySelectorAll('.info-box-value');
        if (boxes[0]) boxes[0].textContent = '—';
        if (boxes[1]) boxes[1].textContent = firstRecord.checkupDate ?? '—';
        if (boxes[2]) boxes[2].textContent = firstRecord.staffName   ?? '—';
        return;
    }

    const age = animal.birthDate
        ? Math.floor((new Date() - new Date(animal.birthDate)) / (365.25 * 24 * 60 * 60 * 1000))
        : null;

    const latestStatus = firstRecord.status    ?? 'UNKNOWN';
    const assignedVet  = firstRecord.staffName ?? '—';
    const lastCheckup  = firstRecord.checkupDate ?? '—';

    const statusTagClass = latestStatus === 'HEALTHY'  ? 'tag-healthy'
                         : latestStatus === 'INJURED'  ? 'tag-injured'
                         : latestStatus === 'CRITICAL' ? 'tag-critical'
                         : 'tag-healthy';

    const sexLabel    = animal.sex === 'm' ? 'MALE' : animal.sex === 'f' ? 'FEMALE' : '—';
    const sexTagClass = animal.sex === 'm' ? 'tag-male' : animal.sex === 'f' ? 'tag-female' : 'tag-healthy';

    // ── ดึง mainImage จาก API ──
    const media  = await getAnimalMainMedia(animal.id);
    const imgUrl = media?.url || '../images/unicorn.png';
    console.log(imgUrl)
    const img = card.querySelector('.medical-profile-img');
    if (img) {
        img.src     = imgUrl;
        img.alt     = animal.name;
        img.onerror = () => { img.src = '../images/unicorn.png'; };
    }

    const h2 = card.querySelector('h2');
    if (h2) h2.textContent = animal.name;

    const tags = card.querySelector('.tags');
    if (tags) tags.innerHTML = `
        <span class="${statusTagClass}">${latestStatus}</span>
        <span class="${sexTagClass}">${sexLabel}</span>`;

    const sub = card.querySelector('.medical-profile-sub');
    if (sub) sub.textContent = `${animal.sciName ?? '—'} — ID : ${animal.id}`;

    const boxes = card.querySelectorAll('.info-box-value');
    if (boxes[0]) boxes[0].textContent = age !== null ? `${age} Years` : '—';
    if (boxes[1]) boxes[1].textContent = lastCheckup;
    if (boxes[2]) boxes[2].textContent = assignedVet;
}

function updateStaffStatsGrid(staff) {
    const count = (role) => staff.filter(s =>
        s.role?.toLowerCase() === role.toLowerCase()
    ).length;

    const grid = document.querySelector('.staff-stats-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.staff-stat-value');
    if (cards[0]) cards[0].textContent = count('Zookeeper');
    if (cards[1]) cards[1].textContent = count('Veterinary Staff');
    if (cards[2]) cards[2].textContent = count('Admin');
}



document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = handleLogin;
        document.getElementById('password')?.addEventListener('input', function () {
            document.getElementById('errorMessage')?.classList.add('hidden');
            this.style.borderColor = '';
        });
    }
    
    const adminContent = document.querySelector('.admin-content');

    if (adminContent) {
        adminContent.style.visibility = 'hidden';
    }

    _allDataCache = await fetchAllDataCache()

    adminContent.style.visibility = 'visible';

    if (document.getElementById('dashboard-view')) initDashboard(_allDataCache);
    if (document.getElementById('animals-view'))   initAdminAnimalsTable(_allDataCache);
    if (document.getElementById('medical-view'))   initMedicalTable(_allDataCache);
    if (document.getElementById('staff-view'))     initStaffTable(_allDataCache);
});





