// frontend/js/map.js  —  Zoo Map interactive logic

// ── Pin key → API animal name (ใช้ match ข้อมูลจาก API) ─────────────────────
const KEY_TO_NAME = {
    lion:        'African Lion',
    flamingo:    'Flamingo',
    penguin:     'Emperor Penguin',
    crocodile:   'Crocodile',
    komodo:      'Komodo Dragon',
    dolphin:     'Dolphin',
    turtle:      'Green Sea Turtle',
    macaw:       'Scarlet Macaw',
    snowleopard: 'Snow Leopard',
    unicorn:     'Unicorn',
};

// ── API cache ───────────────────────────────────────────────────────────────
let _apiAnimals = [];
let _loadPromise = null;

function _loadAnimals() {
    if (!_loadPromise) {
        _loadPromise = getAnimals()
            .then(list => { _apiAnimals = list; })
            .catch(e => console.error('[map] API error:', e));
    }
    return _loadPromise;
}

function _findAnimal(key) {
    const name = KEY_TO_NAME[key];
    return name ? _apiAnimals.find(a => a.name === name) : null;
}

// ── Card builder ────────────────────────────────────────────────────────────
function _buildCard(a) {
    const imgFile = (a.image || '').split('/').pop();
    const img     = `../images/${imgFile}`;

    const sciHtml = a.sciName
        ? `<p class="map-sci-name">${a.sciName}</p>`
        : '';

    const lvl  = Math.min(a.dangerLevel || 0, 5);
    const dots = '<span class="map-dot filled">●</span>'.repeat(lvl)
               + '<span class="map-dot empty">○</span>'.repeat(5 - lvl);

    const rows = [
        { label: 'Zone',   value: a.zone },
        a.diet        ? { label: 'Diet',   value: a.diet } : null,
        a.dangerLevel ? { label: 'Danger', value: dots, raw: true } : null,
        a.quantity    ? { label: 'Count',  value: `${a.quantity} animals` } : null,
    ].filter(Boolean);

    const detailHtml = `
        <div class="map-detail-grid">
            ${rows.map(r => `
            <div class="map-detail-row">
                <span class="map-detail-label">${r.label}</span>
                <span class="map-detail-value">${r.value}</span>
            </div>`).join('')}
        </div>`;

    const chevron = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;

    return `
        <div class="map-animal-card">
            <div class="card-image-wrapper">
                <img src="${img}" alt="${a.name}" onerror="this.src='../images/Unicorn.png'">
            </div>
            <div class="card-content">
                <h4>${a.name}</h4>
                ${sciHtml}
                <div class="tags">
                    <span class="tag green">${a.category}</span>
                    <span class="tag brown">${a.zone}</span>
                </div>
                <p>${a.description}</p>
                ${detailHtml}
                <button class="btn-full-width"
                    onclick="window.location.href='animal-detail.html?id=${a.id}'">
                    View Details ${chevron}
                </button>
            </div>
        </div>`;
}

// ── Public: called from onclick in map.html ─────────────────────────────────
async function showAnimalPin(key) {
    document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
    const pin = document.getElementById('pin-' + key);
    if (pin) pin.classList.add('active');

    document.getElementById('sidebar-empty').classList.add('hidden');
    const container = document.getElementById('sidebar-card');
    container.classList.remove('hidden');
    container.innerHTML = `<div class="map-card-loading"><div class="map-spinner"></div></div>`;

    await _loadAnimals();

    const animal = _findAnimal(key);

    if (!animal) {
        container.innerHTML = `
            <div class="map-card-loading" style="flex-direction:column;gap:0.5rem">
                <p style="color:#aaa;font-size:0.9rem">ไม่พบข้อมูลจาก API</p>
            </div>`;
        return;
    }

    container.innerHTML = _buildCard(animal);
}

function switchZone(zoneId) {
    document.querySelectorAll('.zone-map').forEach(m => m.classList.remove('zone-active'));
    document.getElementById('zone-' + zoneId).classList.add('zone-active');

    document.querySelectorAll('.pill-btn[data-zone]').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.pill-btn[data-zone="${zoneId}"]`);
    if (btn) btn.classList.add('active');

    document.getElementById('sidebar-empty').classList.remove('hidden');
    const card = document.getElementById('sidebar-card');
    card.classList.add('hidden');
    card.innerHTML = '';
    document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
}

// ── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.zone-overview-tile').forEach(tile => {
        tile.addEventListener('click', () => switchZone(tile.dataset.zone));
    });
    document.querySelectorAll('.pill-btn[data-zone]').forEach(b => {
        b.addEventListener('click', () => switchZone(b.dataset.zone));
    });

    _loadAnimals();
});
