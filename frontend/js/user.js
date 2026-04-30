//  user.js  —  Public pages (animals list, animal detail, events)
//  backend: ดู comment "API Endpoint:" ในแต่ละ function
//  เพื่อรู้ว่าต้องทำ endpoint อะไรใน back
//  เมื่อพร้อมแล้วเปลี่ยน USE_MOCK = false ใน api-config.js

// Mock Data 

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

// API Functions
// API Endpoint: GET /api/animals?category=X
async function getAnimals(category = null) {
    if (USE_MOCK) {
        if (!category || category === 'All') return [...MOCK_ANIMALS];
        return MOCK_ANIMALS.filter(a => a.category === category);
    }
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return apiGet('/animals' + query);
}

// API Endpoint: GET /api/animals/{id}
async function getAnimalById(id) {
    if (USE_MOCK) {
        return MOCK_ANIMALS.find(a => a.id === parseInt(id)) || null;
    }
    return apiGet(`/animals/${id}`);
}

// API Endpoint: GET /api/animals/search?keyword=X
async function searchAnimals(keyword) {
    if (USE_MOCK) {
        const kw = keyword.toLowerCase();
        return MOCK_ANIMALS.filter(a =>
            a.name.toLowerCase().includes(kw) ||
            a.sciName.toLowerCase().includes(kw) ||
            a.category.toLowerCase().includes(kw) ||
            a.zone.toLowerCase().includes(kw)
        );
    }
    return apiGet(`/animals/search?keyword=${encodeURIComponent(keyword)}`);
}

// API Endpoint: GET /api/events
async function getEvents() {
    if (USE_MOCK) return [...MOCK_EVENTS];
    return apiGet('/events');
}

// Render Helpers
function renderAnimalCard(animal) {
    return `
        <div class="animal-card list-card">
            <div class="card-image-wrapper">
                <img src="../images/${(animal.image || '').split('/').pop()}" alt="${animal.name}"
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

// Page Initializers 
// เรียกใน animals.html
async function initAnimalsPage() {
    const grid = document.getElementById('animals-grid');
    const countEl = document.getElementById('results-count');
    const searchInput = document.querySelector('.search-bar input');

    async function renderList(animals) {
        grid.innerHTML = animals.length
            ? animals.map(renderAnimalCard).join('')
            : '<p style="padding:2rem;color:#888;">No animals found.</p>';
        if (countEl) {
            countEl.textContent = `${animals.length} animal${animals.length !== 1 ? 's' : ''} found`;
        }
    }

    let allAnimals = await getAnimals();
    console.log("GET all animals: ", allAnimals)
    renderList(allAnimals);

    // Quick filter pill buttons
    document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const label = btn.textContent.trim();
            const filtered = label === 'All' ? allAnimals : allAnimals.filter(a => a.category === label);
            renderList(filtered);
        });
    });

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', async () => {
            const kw = searchInput.value.trim();
            const result = kw ? await searchAnimals(kw) : allAnimals;
            renderList(result);
        });
    }

    initDropdownFilters(allAnimals)
}

// เรียกใน animal-detail.html
async function initAnimalDetailPage() {
    const id = new URLSearchParams(window.location.search).get('id') || 1;
    const animal = await getAnimalById(id);

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

    // Breadcrumb
    set('#detail-breadcrumb', animal.name);

    // Hero
    set('#detail-hero-img', `../images/${(animal.image || '').split('/').pop()}`, 'src');
    set('#detail-hero-img', animal.name, 'alt');
    set('#detail-name', animal.name);
    set('#detail-sci-name', animal.sciName);
    set('#detail-hero-desc', animal.description);
    set('#detail-category-tag', animal.category);
    set('#detail-zone-tag', animal.zone + ' Zone');

    // Info cards
    set('#detail-long-desc', animal.longDescription);
    set('#detail-diet-type', animal.diet);
    set('#detail-zone-info', animal.zone + ' Zone');

    // Gallery (set all gallery images to this animal)
    document.querySelectorAll('.gallery-img').forEach(img => {
        img.src = `../images/${(animal.image || '').split('/').pop()}`;
        img.alt = animal.name;
    });
}





function populateDropdowns(animals) {
    const categorySelect = document.querySelector('.filter-dropdowns .dropdown-group:nth-child(1) select');
    const zoneSelect     = document.querySelector('.filter-dropdowns .dropdown-group:nth-child(2) select');
    const sortSelect     = document.querySelector('.filter-dropdowns .dropdown-group:nth-child(4) select');

    if (!categorySelect || !zoneSelect || !sortSelect) return;

    const categories = ['All', ...new Set(animals.map(a => a.category).filter(Boolean))].sort();
    const zones      = ['All', ...new Set(animals.map(a => a.zone).filter(Boolean))].sort();

    categorySelect.innerHTML = categories.map(c =>
        `<option value="${c}">${c === 'All' ? 'All Categories' : c}</option>`
    ).join('');

    zoneSelect.innerHTML = zones.map(z =>
        `<option value="${z}">${z === 'All' ? 'All Zones' : z}</option>`
    ).join('');

    sortSelect.innerHTML = `
        <option value="name-az">Name (A–Z)</option>
        <option value="name-za">Name (Z–A)</option>
        <option value="danger-high">Danger (High–Low)</option>
        <option value="danger-low">Danger (Low–High)</option>
    `;
}

function applyFilters(animals, { category = 'All', zone = 'All', keyword = '', sort = 'name-az' } = {}) {
    let result = [...animals];

    if (category !== 'All') result = result.filter(a => a.category === category);
    if (zone !== 'All')     result = result.filter(a => a.zone === zone);

    if (keyword) {
        const kw = keyword.toLowerCase();
        result = result.filter(a =>
            a.name.toLowerCase().includes(kw)           ||
            (a.sciName  || '').toLowerCase().includes(kw) ||
            (a.category || '').toLowerCase().includes(kw) ||
            (a.zone     || '').toLowerCase().includes(kw)
        );
    }

    result.sort((a, b) => {
        if (sort === 'name-az')     return a.name.localeCompare(b.name);
        if (sort === 'name-za')     return b.name.localeCompare(a.name);
        if (sort === 'danger-high') return b.dangerLevel - a.dangerLevel;
        if (sort === 'danger-low')  return a.dangerLevel - b.dangerLevel;
        return 0;
    });

    return result;
}

function initDropdownFilters(allAnimals) {
    const grid           = document.getElementById('animals-grid');
    const countEl        = document.getElementById('results-count');
    const searchInput    = document.querySelector('.search-bar input');
    const categorySelect = document.querySelector('.filter-dropdowns .dropdown-group:nth-child(1) select');
    const zoneSelect     = document.querySelector('.filter-dropdowns .dropdown-group:nth-child(2) select');
    const sortSelect     = document.querySelector('.filter-dropdowns .dropdown-group:nth-child(4) select');


    const state = { category: 'All', zone: 'All', keyword: '', sort: 'name-az' };


    function render() {
        const result = applyFilters(allAnimals, state);
        grid.innerHTML = result.length
            ? result.map(renderAnimalCard).join('')
            : '<p style="padding:2rem;color:#888;">No animals found.</p>';
        if (countEl) {
            countEl.textContent = `${result.length} animal${result.length !== 1 ? 's' : ''} found`;
        }
    }


    populateDropdowns(allAnimals);

    categorySelect?.addEventListener('change', () => {
        state.category = categorySelect.value;
   
        document.querySelectorAll('.pill-btn').forEach(b => {
            b.classList.toggle('active', b.textContent.trim() === state.category);
        });
        render();
    });

    zoneSelect?.addEventListener('change', () => {
        state.zone = zoneSelect.value;
        render();
    });

    sortSelect?.addEventListener('change', () => {
        state.sort = sortSelect.value;
        render();
    });


    if (searchInput) {
        const newInput = searchInput.cloneNode(true);
        searchInput.replaceWith(newInput);
        newInput.addEventListener('input', () => {
            state.keyword = newInput.value.trim();
            render();
        });
    }

    document.querySelectorAll('.pill-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.replaceWith(newBtn);
        newBtn.addEventListener('click', () => {
            document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
            newBtn.classList.add('active');
            state.category = newBtn.textContent.trim();
            if (categorySelect) categorySelect.value = state.category;
            render();
        });
    });

    render();
}


// Auto-init: detect page and run the right function
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('animals-grid')) {
        initAnimalsPage();
    } else if (document.getElementById('detail-name')) {
        initAnimalDetailPage();
    }

});