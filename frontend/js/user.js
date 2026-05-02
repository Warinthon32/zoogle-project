//  user.js  —  Public pages (animals list, animal detail, events)
//  backend: ดู comment "API Endpoint:" ในแต่ละ function
//  เมื่อพร้อมแล้วเปลี่ยน USE_MOCK = false ใน api-config.js

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ANIMALS = [
    {
        id: 1, name: 'African Lion', sciName: 'Panthera leo',
        category: 'Mammals', zone: 'Savanna', dangerLevel: 4,
        diet: 'Carnivore', quantity: 6, image: 'lion.png',
        description: 'Majestic predator known as the king of the jungle with powerful roars and social pride behavior.',
        longDescription: 'The African lion is a large carnivorous mammal native to sub-Saharan Africa. Adult males are easily recognized by their thick manes. Lions are unique among big cats because they live in social groups known as prides, usually consisting of related females, their cubs, and a few dominant males.'
    },
    {
        id: 2, name: 'Emperor Penguin', sciName: 'Aptenodytes forsteri',
        category: 'Birds', zone: 'Polar', dangerLevel: 1,
        diet: 'Carnivore', quantity: 12, image: 'penguin.png',
        description: 'A flightless bird adapted to icy climates, admired for its elegant posture and strong survival instincts.',
        longDescription: 'Emperor penguins are the largest of all penguin species, found only in Antarctica. They huddle together for warmth and are known for their remarkable breeding behavior in extreme cold, with males incubating eggs through the Antarctic winter.'
    },
    {
        id: 3, name: 'Red Panda', sciName: 'Ailurus fulgens',
        category: 'Mammals', zone: 'Forest', dangerLevel: 1,
        diet: 'Herbivore', quantity: 4, image: 'red_panda.png',
        description: 'A shy tree-dwelling animal with reddish fur, a striped tail, and a playful yet gentle nature.',
        longDescription: 'Red pandas are small mammals native to the eastern Himalayas and southwestern China. Despite the name, they are not closely related to giant pandas. They are excellent climbers and spend most of their time in trees, feeding primarily on bamboo.'
    },
    {
        id: 4, name: 'Scarlet Macaw', sciName: 'Ara macao',
        category: 'Birds', zone: 'Rainforest', dangerLevel: 1,
        diet: 'Herbivore', quantity: 8, image: 'macaw.png',
        description: 'A colorful tropical parrot known for its intelligence, vibrant feathers, and loud distinctive calls.',
        longDescription: 'Scarlet macaws are large, brightly colored parrots native to humid evergreen forests of tropical America. They are highly intelligent and can mimic human speech. Their vibrant red, yellow, and blue plumage makes them one of the most recognizable birds in the world.'
    },
    {
        id: 5, name: 'Green Sea Turtle', sciName: 'Chelonia mydas',
        category: 'Aquatic', zone: 'Ocean', dangerLevel: 1,
        diet: 'Herbivore', quantity: 3, image: 'turtle.png',
        description: 'A graceful marine reptile that spends most of its life in the sea and helps maintain ocean ecosystems.',
        longDescription: 'Green sea turtles are large, air-breathing reptiles that inhabit tropical and subtropical seas. They are the only sea turtle that is a strict herbivore as an adult, feeding primarily on seagrasses and algae, which helps maintain healthy sea floor ecosystems.'
    },
    {
        id: 6, name: 'Komodo Dragon', sciName: 'Varanus komodoensis',
        category: 'Reptiles', zone: 'Island', dangerLevel: 3,
        diet: 'Carnivore', quantity: 2, image: 'komodo.png',
        description: 'A giant lizard with powerful claws and a strong hunting instinct, native to dry tropical islands.',
        longDescription: 'The Komodo dragon is the largest living species of lizard, found on the Indonesian islands of Komodo, Rinca, and Flores. They are apex predators with powerful venom that prevents blood clotting in their prey. They can detect carrion from up to 9.5 km away.'
    },
    {
        id: 7, name: 'Snow Leopard', sciName: 'Panthera uncia',
        category: 'Mammals', zone: 'Mountain', dangerLevel: 3,
        diet: 'Carnivore', quantity: 3, image: 'snow_leopard.png',
        description: 'A rare and elusive big cat with thick fur, powerful limbs, and excellent climbing ability.',
        longDescription: 'Snow leopards are large wild cats native to the mountain ranges of Central and South Asia. Their thick smoky-gray coats with dark rosettes provide camouflage against rocky terrain. They use their long tails for balance and as a wrap against the cold.'
    },
    {
        id: 8, name: 'Flamingo', sciName: 'Phoenicopterus roseus',
        category: 'Birds', zone: 'Wetland', dangerLevel: 1,
        diet: 'Omnivore', quantity: 30, image: 'flamingo.png',
        description: 'A striking bird recognized for its pink feathers, long legs, and elegant standing posture.',
        longDescription: 'Flamingos are wading birds known for their pink plumage, stilt-like legs, and distinctive downward-bent bills. Their pink color comes from carotenoid pigments in the algae and crustaceans they eat. They live in large colonies in shallow lakes and lagoons.'
    },
    {
        id: 9, name: 'Crocodile', sciName: 'Crocodylus niloticus',
        category: 'Reptiles', zone: 'River', dangerLevel: 4,
        diet: 'Carnivore', quantity: 5, image: 'crocodile.png',
        description: 'An ancient reptile with strong jaws and excellent camouflage, often found in rivers and swamps.',
        longDescription: 'Nile crocodiles are the largest freshwater predators in Africa. They are powerful ambush hunters and can stay submerged for up to two hours. Despite their fearsome reputation, they are attentive parents who carefully guard their nests and carry hatchlings to water.'
    },
    {
        id: 10, name: 'Dolphin', sciName: 'Tursiops truncatus',
        category: 'Aquatic', zone: 'Marine', dangerLevel: 1,
        diet: 'Carnivore', quantity: 10, image: 'dolphin.png',
        description: 'An intelligent and social sea animal known for its agility, playful behavior, and communication skills.',
        longDescription: 'Bottlenose dolphins are highly intelligent marine mammals known for their complex social structures and sophisticated communication. They use echolocation to navigate and hunt, and have been observed displaying empathy, problem-solving, and even tool use.'
    },
    {
        id: 11, name: 'Unicorn', sciName: 'Equus monoceros',
        category: 'Fantasy Animals', zone: 'Mythical', dangerLevel: 1,
        diet: 'Herbivore', quantity: 1, image: 'unicorn.png',
        description: 'A legendary horned creature symbolizing purity, grace, and magical beauty within enchanted lands.',
        longDescription: 'The unicorn is a legendary creature described since antiquity as a beast with a single large, spiraling horn projecting from its forehead. It symbolizes purity, grace, and untameable freedom. In medieval lore, only a maiden of pure heart could approach one.'
    }
];

const MOCK_EVENTS = [
    {
        id: 1, showName: 'Lion Feeding Time', showTime: '11:00', showDate: '2026-05-10',
        zone: 'Savanna', animalName: 'African Lion', image: 'lion.png', duration: '25 min'
    },
    {
        id: 2, showName: 'Bird of Paradise Feed', showTime: '13:00', showDate: '2026-05-10',
        zone: 'Rainforest', animalName: 'Scarlet Macaw', image: 'macaw.png', duration: '30 min'
    },
    {
        id: 3, showName: 'Seal Presentation', showTime: '14:30', showDate: '2026-05-11',
        zone: 'Marine', animalName: 'Dolphin', image: 'dolphin.png', duration: '30 min'
    },
    {
        id: 4, showName: 'Reptile Discovery Walk', showTime: '10:00', showDate: '2026-05-12',
        zone: 'River', animalName: 'Crocodile', image: 'crocodile.png', duration: '45 min'
    }
];

// ─── API Functions ─────────────────────────────────────────────────────────────

async function getAnimals(category = null) {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return apiGet('/animals' + query);
}

async function getAnimalById(id) {
    return apiGet(`/animals/${id}`);
}

async function getEvents() {
    return apiGet('/events');
}

// ─── Render Helpers ────────────────────────────────────────────────────────────

function renderHomeCard(animal) {
    const img = (animal.image || '').split('/').pop();
    return `
        <div class="animal-card">
            <div class="card-image-wrapper">
                <img src="../images/${img}" alt="${animal.name}"
                     onerror="this.src='../images/unicorn.png'">
            </div>
            <div class="card-content">
                <h4>${animal.name}</h4>
                <span class="category-tag">${animal.category}</span>
                <p>${animal.description}</p>
                <a href="animal-detail.html?id=${animal.id}" class="learn-more">
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </a>
            </div>
        </div>`;
}

function renderAnimalCard(animal) {
    const img = (animal.image || '').split('/').pop();
    return `
        <div class="animal-card list-card">
            <div class="card-image-wrapper">
                <img src="../images/${img}" alt="${animal.name}"
                     onerror="this.src='../images/unicorn.png'">
            </div>
            <div class="card-content">
                <h4>${animal.name}</h4>
                <div class="tags">
                    <span class="tag green">${animal.category}</span>
                    <span class="tag brown">${animal.zone}</span>
                </div>
                <p>${animal.description}</p>
                <button class="btn-full-width"
                    onclick="window.location.href='animal-detail.html?id=${animal.id}'">
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            </div>
        </div>`;
}

function renderRelatedCard(animal) {
    const img = (animal.image || '').split('/').pop();
    return `
        <div class="animal-card list-card">
            <div class="card-image-wrapper">
                <img src="../images/${img}" alt="${animal.name}"
                     onerror="this.src='../images/unicorn.png'">
            </div>
            <div class="card-content">
                <h4>${animal.name}</h4>
                <span class="category-tag">${animal.category}</span>
                <button class="btn-full-width"
                    onclick="window.location.href='animal-detail.html?id=${animal.id}'">
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            </div>
        </div>`;
}

function renderEventCard(event) {
    const time = (event.showTime || '').substring(0, 5);
    return `
        <div class="event-card">
            <img src="../images/unicorn.png" alt="${event.showName}" onerror="this.src='../images/unicorn.png'">
            <div class="event-info">
                <h2>${event.showName}</h2>
                <p class="subtitle">${event.zone || ''} Zone</p>
                <div class="event-meta">
                    <div class="meta-item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <div><strong>${event.showDate}</strong></div>
                    </div>
                    <div class="meta-item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <div><strong>${time}</strong></div>
                    </div>
                    <div class="meta-item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <div><strong>${event.zone || ''}</strong><br><span>Zone</span></div>
                    </div>
                </div>
            </div>
            <button class="btn-primary" onclick="window.location.href='map.html'">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg> View on Map
            </button>
        </div>`;
}

// ─── Page Initializers ─────────────────────────────────────────────────────────

async function initHomePage() {
    const grid = document.getElementById('home-animals-grid');
    if (!grid) return;

    grid.innerHTML = Array(8).fill(`
        <div class="animal-card skeleton">
            <div class="card-image-wrapper" style="background:#e8f0e9;min-height:180px;"></div>
            <div class="card-content" style="padding:1rem;">
                <div style="height:1rem;background:#e8f0e9;border-radius:4px;margin-bottom:.5rem;"></div>
                <div style="height:.75rem;background:#e8f0e9;border-radius:4px;width:60%;"></div>
            </div>
        </div>`).join('');

    let allAnimals = await getAnimals();

    function renderGrid(animals) {
        const display = animals.slice(0, 8);
        grid.innerHTML = display.length
            ? display.map(renderHomeCard).join('')
            : '<p style="padding:2rem;color:#888;grid-column:1/-1;">No animals found.</p>';
    }

    renderGrid(allAnimals);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.category;
            const filtered = cat === 'All'
                ? allAnimals
                : allAnimals.filter(a => a.category === cat);
            renderGrid(filtered);
        });
    });
}

async function initAnimalsPage() {
    const grid = document.getElementById('animals-grid');
    const countEl = document.getElementById('results-count');
    const searchInput = document.querySelector('.search-bar input');

    function renderList(animals) {
        grid.innerHTML = animals.length
            ? animals.map(renderAnimalCard).join('')
            : '<p style="padding:2rem;color:#888;">No animals found.</p>';
        if (countEl) {
            countEl.textContent = `${animals.length} animal${animals.length !== 1 ? 's' : ''} found`;
        }
    }

    let allAnimals = await getAnimals();
    let currentAnimals = allAnimals;

    renderList(currentAnimals);

    document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const label = btn.textContent.trim();
            currentAnimals = label === 'All'
                ? allAnimals
                : allAnimals.filter(a => a.category === label);
            renderList(currentAnimals);
            if (searchInput) searchInput.value = '';
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const kw = searchInput.value.trim().toLowerCase();
            const result = kw
                ? currentAnimals.filter(a => a.name.toLowerCase().startsWith(kw))
                : currentAnimals;
            renderList(result);
        });
    }
}

async function initAnimalDetailPage() {
    const id = parseInt(new URLSearchParams(window.location.search).get('id')) || 1;

    let animal, sameCategory, allEvents;
    try {
        [animal, sameCategory, allEvents] = await Promise.all([
            getAnimalById(id),
            getAnimals(),
            getEvents()
        ]);
    } catch (e) {
        console.error('[detail] โหลดข้อมูลล้มเหลว:', e);
        return;
    }

    if (!animal) {
        document.body.innerHTML = '<p style="padding:2rem;text-align:center;">Animal not found.</p>';
        return;
    }

    document.title = `${animal.name} - Zoogle`;

    const set = (selector, value, attr = null) => {
        const el = document.querySelector(selector);
        if (!el) return;
        if (attr) el[attr] = value;
        else el.textContent = value;
    };

    set('#detail-breadcrumb', animal.name);
    set('#detail-hero-img', `../images/${(animal.image || '').split('/').pop()}`, 'src');
    set('#detail-hero-img', animal.name, 'alt');
    set('#detail-name', animal.name);
    set('#detail-sci-name', animal.sciName);
    set('#detail-hero-desc', animal.description);
    set('#detail-category-tag', animal.category);
    set('#detail-zone-tag', animal.zone + ' Zone');
    set('#detail-long-desc', animal.longDescription);
    set('#detail-diet-type', animal.diet);
    set('#detail-zone-info', animal.zone + ' Zone');

    document.querySelectorAll('.gallery-img').forEach(img => {
        img.src = `../images/${(animal.image || '').split('/').pop()}`;
        img.alt = animal.name;
    });

    // ── Show Schedule ──
    const scheduleCard = document.querySelector('.schedule-card');
    if (scheduleCard && allEvents && allEvents.length > 0) {
        const event = allEvents[0];
        const time = (event.showTime || '').substring(0, 5);
        scheduleCard.innerHTML = `
            <img src="../images/unicorn.png" alt="${event.showName}" onerror="this.src='../images/unicorn.png'">
            <div class="schedule-info">
                <h3>${event.showName}</h3>
                <p class="subtitle">${event.zone || ''} Zone</p>
                <div class="schedule-meta">
                    <div class="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <div><strong>${event.showDate}</strong></div>
                    </div>
                    <div class="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <div><strong>${time}</strong></div>
                    </div>
                    <div class="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <div><strong>${event.zone || ''}</strong><br><span>Zone</span></div>
                    </div>
                </div>
            </div>
            <button class="btn-primary small-btn" onclick="window.location.href='map.html'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg> View on Map
            </button>`;
    }

    // ── Related Animals ──
    const relatedGrid = document.querySelector('.related-animals .animals-grid');
    if (relatedGrid) {
        const related = sameCategory
            .filter(a => a.category === animal.category && a.id !== id)
            .slice(0, 4);

        relatedGrid.innerHTML = related.length
            ? related.map(renderRelatedCard).join('')
            : '<p style="padding:1rem;color:#888;">No related animals found.</p>';
    }
}

async function initEventsPage() {
    const list = document.querySelector('.events-list');
    const countEl = document.querySelector('.events-count-header span');
    if (!list) return;

    const events = await getEvents();

    if (countEl) countEl.innerHTML = `<strong>${events.length}</strong> shows scheduled`;

    list.innerHTML = events.length
        ? events.map(renderEventCard).join('')
        : '<p style="padding:2rem;color:#888;">No events found.</p>';
}

// ─── Auto-init ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('home-animals-grid')) {
        initHomePage();
    } else if (document.getElementById('animals-grid')) {
        initAnimalsPage();
    } else if (document.getElementById('detail-name')) {
        initAnimalDetailPage();
    } else if (document.querySelector('.events-list')) {
        initEventsPage();
    }
});