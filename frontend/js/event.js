async function initEventsPage() {
    const list = document.querySelector('.events-list');
    const countEl = document.querySelector('.events-count-header span');
    const typeSelect = document.getElementById('filter-type');
    const zoneSelect = document.getElementById('filter-zone');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    if (!list) return;

    const allEvents = await getEvents();

    const getZoneName = (zone) =>
        zone && typeof zone === 'object' ? (zone.name || '') : (zone || '');

    if (typeSelect) {
        const types = [...new Set(allEvents.map(e => e.animalType || e.category || e.animalName))].filter(Boolean);
        types.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t; opt.textContent = t;
            typeSelect.appendChild(opt);
        });
    }
    if (zoneSelect) {
        const zones = [...new Set(allEvents.map(e => getZoneName(e.zone)))].filter(Boolean);
        zones.forEach(z => {
            const opt = document.createElement('option');
            opt.value = z; opt.textContent = z + ' Zone';
            zoneSelect.appendChild(opt);
        });
    }

    let activeToggle = 'all';
    
    function getToday() {
        return new Date().toISOString().split('T')[0];
    }

    function getWeekRange() {
        const today = new Date();
        const end = new Date(today);
        end.setDate(today.getDate() + 6);
        return {
            start: today.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    }

    function applyFilters() {
        const selectedType = typeSelect?.value || '';
        const selectedZone = zoneSelect?.value || '';

        let filtered = allEvents.filter(e => {
            const date = e.showDate || '';
            const zone = getZoneName(e.zone);

            let passDate = false;
            if (activeToggle === 'all') {
                passDate = true;
            } else if (activeToggle === 'today') {
                passDate = date === getToday();
            } else {
                const { start, end } = getWeekRange();
                passDate = date >= start && date <= end;
            }

            const passType = !selectedType ||
                (e.animalType || e.category || e.animalName) === selectedType;

            const passZone = !selectedZone || zone === selectedZone;

            return passDate && passType && passZone;
        });

        if (countEl) countEl.innerHTML = `<strong>${filtered.length}</strong> shows scheduled`;
        list.innerHTML = filtered.length
            ? filtered.map(renderEventCard).join('')
            : '<p style="padding:2rem;color:#888;">No events found for this filter.</p>';
    }

    toggleBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // i=0 → all, i=1 → today, i=2 → week
            activeToggle = ['all', 'today', 'week'][i];
            applyFilters();
        });
    });

    typeSelect?.addEventListener('change', applyFilters);
    zoneSelect?.addEventListener('change', applyFilters);

    applyFilters();
}