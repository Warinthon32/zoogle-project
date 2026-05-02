// frontend/js/map.js  —  Zoo Map interactive logic (zone + animal based)

// ── Zone name mapping ────────────────────────────────────────────────────────
const ZONE_KEY_TO_NAME = {
    savanna:    'Savanna Zone',
    arctic:     'Arctic Zone',
    tropical:   'Tropical Zone',
    aquatic:    'Aquatic Zone',
    bamboo:     'Bamboo Grove',
    mountain:   'Mountain Zone',
    mythical:   'Mythical Zone',
    ocean:      'Ocean Realm',
};

// Pin positions: สูงสุด 8 ตัว (4x2 grid)
const PIN_POSITIONS = [
    { top: '28%', left: '20%' },
    { top: '28%', left: '38%' },
    { top: '28%', left: '58%' },
    { top: '28%', left: '76%' },
    { top: '62%', left: '20%' },
    { top: '62%', left: '38%' },
    { top: '62%', left: '58%' },
    { top: '62%', left: '76%' },
];

// ── API cache ────────────────────────────────────────────────────────────────
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

// ── Get animals in zone ──────────────────────────────────────────────────────
function _getZoneAnimals(zoneKey) {
    const zoneName = ZONE_KEY_TO_NAME[zoneKey];
    if (!zoneName) return [];
    return _apiAnimals.filter(a => a.zone === zoneName);
}

// ── Active zone tracker ──────────────────────────────────────────────────────
let _activeZone = 'all';

// ── Render pins dynamically into active zone map ─────────────────────────────
function _renderPins(zoneKey) {
    const zoneEl = document.getElementById('zone-' + zoneKey);
    if (!zoneEl) return;

    // ลบ pin เก่าออกก่อน
    zoneEl.querySelectorAll('.map-pin.dynamic').forEach(p => p.remove());

    const animals = _getZoneAnimals(zoneKey);
    const bg = zoneEl.querySelector('.zone-bg');
    if (!bg) return;

    const isPinLight = ['tropical', 'aquatic', 'bamboo', 'mountain', 'mythical', 'ocean'].includes(zoneKey);
    const pinClass = zoneKey === 'mythical' ? 'pi-mythical' : (isPinLight ? 'pi-light' : 'pi-dark');

    animals.forEach((animal, i) => {
        if (i >= PIN_POSITIONS.length) return;
        const pos = PIN_POSITIONS[i];

        const pin = document.createElement('div');
        pin.className = 'map-pin interactive dynamic';
        pin.id = `pin-animal-${animal.id}`;
        pin.style.top = pos.top;
        pin.style.left = pos.left;
        pin.onclick = () => showAnimalCard(animal.id);

        pin.innerHTML = `
            <div class="pin-icon ${pinClass}">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
            </div>
            <span class="cage-pin-label">${animal.name}</span>
        `;

        bg.appendChild(pin);
    });
}

// ── Card builder ─────────────────────────────────────────────────────────────
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
        { label: 'Cage',   value: `#${a.cageId}` },
        { label: 'Zone',   value: a.zone },
        a.diet        ? { label: 'Diet',   value: a.diet } : null,
        a.dangerLevel ? { label: 'Danger', value: dots } : null,
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

function _buildEmptyCard() {
    return `
        <div class="map-animal-card">
            <div class="card-content" style="padding:2rem;text-align:center">
                <p style="font-size:2rem">🔒</p>
                <h4 style="color:#aaa">No Animals</h4>
                <p style="color:#bbb;font-size:0.85rem">No animals in this zone yet.</p>
            </div>
        </div>`;
}

// ── Show card เมื่อกด pin ────────────────────────────────────────────────────
async function showAnimalCard(animalId) {
    document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
    const pin = document.getElementById('pin-animal-' + animalId);
    if (pin) pin.classList.add('active');

    document.getElementById('sidebar-empty').classList.add('hidden');
    const container = document.getElementById('sidebar-card');
    container.classList.remove('hidden');
    container.innerHTML = `<div class="map-card-loading"><div class="map-spinner"></div></div>`;

    await _loadAnimals();

    const animal = _apiAnimals.find(a => a.id === animalId);
    container.innerHTML = animal ? _buildCard(animal) : _buildEmptyCard();
}

// ── Switch zone ──────────────────────────────────────────────────────────────
async function switchZone(zoneId) {
    _activeZone = zoneId;

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

    if (zoneId !== 'all') {
        await _loadAnimals();
        _renderPins(zoneId);
    }
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.zone-overview-tile').forEach(tile => {
        tile.addEventListener('click', () => switchZone(tile.dataset.zone));
    });
    document.querySelectorAll('.pill-btn[data-zone]').forEach(b => {
        b.addEventListener('click', () => switchZone(b.dataset.zone));
    });

    _loadAnimals();
});