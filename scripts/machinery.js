class MachineryManager {
    constructor() {
        this.machinery = JSON.parse(localStorage.getItem('raithaMithraMachinery')) || [];
        this.filteredMachinery = [...this.machinery];
        this.currentFilters = {};
        this.loadMachineryFromCSV();
    }

    async loadMachineryFromCSV() {
        if (this.machinery.length > 0) return; // Already loaded from localStorage

        try {
            const response = await fetch('machinery.csv');
            const csvText = await response.text();
            const lines = csvText.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim());

            this.machinery = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const machine = {};

                headers.forEach((header, index) => {
                    let value = values[index] || '';

                    // Parse specific fields
                    if (header === 'price' || header === 'rating' || header === 'reviewCount') {
                        value = parseFloat(value) || 0;
                    } else if (header === 'availability') {
                        value = value.toLowerCase() === 'true';
                    } else if (header === 'features') {
                        value = value ? value.split(',').map(f => f.trim()) : [];
                    } else if (header === 'specifications') {
                        // Parse specifications as object
                        const specs = {};
                        if (value) {
                            value.split(',').forEach(spec => {
                                const [key, val] = spec.split(':');
                                if (key && val) specs[key.trim()] = val.trim();
                            });
                        }
                        value = specs;
                    } else if (header === 'coordinates') {
                        // Parse coordinates as object
                        const coords = {};
                        if (value) {
                            const [lat, lng] = value.split(',');
                            coords.lat = parseFloat(lat) || 0;
                            coords.lng = parseFloat(lng) || 0;
                        }
                        value = coords;
                    }

                    machine[header] = value;
                });

                // Ensure coordinates object exists
                if (!machine.coordinates) {
                    machine.coordinates = { lat: parseFloat(machine.lat) || 0, lng: parseFloat(machine.lng) || 0 };
                }

                return machine;
            });

            this.filteredMachinery = [...this.machinery];
            localStorage.setItem('raithaMithraMachinery', JSON.stringify(this.machinery));
        } catch (error) {
            console.error('Error loading machinery CSV:', error);
            // Fallback to default machinery if CSV fails to load
            this.machinery = this.getDefaultMachinery();
            this.filteredMachinery = [...this.machinery];
        }
    }

    getDefaultMachinery() {
        return [
            {
                id: '1',
                name: 'John Deere 5050 D Tractor',
                category: 'tractor',
                type: 'Tractor',
                price: 1500,
                priceUnit: 'day',
                horsepower: '50 HP',
                fuelType: 'Diesel',
                location: 'Bangalore, Karnataka',
                coordinates: { lat: 12.9716, lng: 77.5946 },
                ownerId: 'owner1',
                image: 'images/machinery/tractor-photo.jpg',
                description: 'Powerful 50 HP tractor suitable for medium to large farms',
                features: ['Power Steering', '4WD', 'Air Conditioned Cabin'],
                availability: true,
                rating: 4.5,
                reviewCount: 23,
                specifications: {
                    engine: '3-cylinder diesel',
                    fuelCapacity: '60L',
                    transmission: '8F + 2R'
                }
            },
            {
                id: '2',
                name: 'Mahindra Rotavator',
                category: 'tillage',
                type: 'Rotavator',
                price: 800,
                priceUnit: 'day',
                horsepower: '35-50 HP',
                fuelType: 'Tractor PTO',
                location: 'Pune, Maharashtra',
                coordinates: { lat: 18.5204, lng: 73.8567 },
                ownerId: 'owner2',
                image: 'images/machinery/rotavator-photo.jpg',
                description: 'Heavy-duty rotavator for perfect seedbed preparation',
                features: ['Adjustable Depth', 'Heavy Duty Blades', 'Easy Attachment'],
                availability: true,
                rating: 4.2,
                reviewCount: 15
            },
            {
                id: '3',
                name: 'Dasmesh Combine Harvester',
                category: 'harvesting',
                type: 'Combine Harvester',
                price: 5000,
                priceUnit: 'day',
                horsepower: '100 HP',
                fuelType: 'Diesel',
                location: 'Ludhiana, Punjab',
                coordinates: { lat: 30.9010, lng: 75.8573 },
                ownerId: 'owner3',
                image: 'images/machinery/harvester-photo.jpg',
                description: 'Advanced combine harvester for wheat and paddy',
                features: ['GPS Guidance', 'Grain Tank 3000L', 'Auto Leveling'],
                availability: true,
                rating: 4.8,
                reviewCount: 42
            }
        ];
    }

    renderCatalog() {
        const container = document.getElementById('machinery-catalog');
        if (!container) return;

        container.innerHTML = `
            <div class="catalog-header">
                <h2>Available Machinery</h2>
                <div style="display:flex;align-items:center;gap:12px;">
                    <button id="nearby-btn" class="btn btn-outline" title="Find machinery near you">Show Nearby</button>
                    <select id="nearby-radius" class="form-control" style="width:140px;">
                        <option value="10">Within 10 km</option>
                        <option value="25">Within 25 km</option>
                        <option value="50" selected>Within 50 km</option>
                        <option value="100">Within 100 km</option>
                    </select>
                </div>
                <div class="search-filters">
                    <input type="text" id="search-input" placeholder="Search machinery..." class="form-control">
                    <select id="category-filter" class="form-control">
                        <option value="">All Categories</option>
                        <option value="tools">Tools</option>
                        <option value="tillage">Tillage</option>
                        <option value="harvesting">Harvesting</option>
                        <option value="planting">Planting</option>
                        <option value="spraying">Spraying</option>
                        <option value="transport">Transport</option>
                    </select>
                    <select id="price-filter" class="form-control">
                        <option value="">Any Price</option>
                        <option value="0-1000">Under ₹1000</option>
                        <option value="1000-3000">₹1000 - ₹3000</option>
                        <option value="3000+">Over ₹3000</option>
                    </select>
                    <select id="location-filter" class="form-control">
                        <option value="">All Locations</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Pune">Pune</option>
                        <option value="Ludhiana">Ludhiana</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                    </select>
                </div>
            </div>
            <div id="recommendation-section" style="margin-bottom:18px"></div>
            <div class="machinery-grid" id="machinery-grid">
                ${this.filteredMachinery.map(machine => this.renderMachineryCard(machine)).join('')}
            </div>
            <div id="nearby-results" style="margin-top:20px"></div>
        `;

        // Add event listeners for filters
        this.addFilterListeners();

        // Add nearby button handler
        const nearbyBtn = document.getElementById('nearby-btn');
        if (nearbyBtn) {
            nearbyBtn.addEventListener('click', () => {
                const radiusEl = document.getElementById('nearby-radius');
                const radius = radiusEl ? parseFloat(radiusEl.value) : 50;
                this.showNearby(radius);
            });
        }

        // Build recommendation index and render recommendations (if any)
        this.renderRecommendations();
    }

    renderMachineryCard(machine) {
        const stars = this.renderStars(machine.rating);
        const iconClass = this.getMachineryIcon(machine.category);
        const imageUrl = machine.image || 'images/machinery/tractor-photo.jpg';
        return `
            <div class="machinery-card" onclick="machinery.showMachineryDetail('${machine.id}')">
                <div class="machinery-img" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center; height: 220px; position: relative;">
                    <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.15));"></div>
                    <div style="position: relative; z-index: 2; padding: 16px; display: flex; align-items: flex-end; height: 100%; box-sizing: border-box;">
                        <i class="${iconClass}" style="font-size: 2rem; color: var(--white); margin-right: 10px;"></i>
                        <div style="color: var(--white); font-weight:700;">${machine.name}</div>
                    </div>
                </div>
                <div class="machinery-info">
                    <div class="machinery-title">${machine.name}</div>
                    <div class="machinery-price">${Utils.formatCurrency(machine.price)}/${machine.priceUnit}</div>
                    <div class="machinery-features">
                        <div class="feature">
                            <i class="fas fa-horse-head"></i>
                            ${machine.horsepower || ''}
                        </div>
                        <div class="feature">
                            <i class="fas fa-gas-pump"></i>
                            ${machine.fuelType || ''}
                        </div>
                        <div class="feature">
                            <i class="fas fa-map-marker-alt"></i>
                            ${machine.location ? machine.location.split(',')[0] : ''}
                        </div>
                    </div>
                    <div class="rating">
                        ${stars}
                        <span>(${machine.reviewCount || 0})</span>
                    </div>
                    <button class="btn btn-primary" style="width: 100%; margin-top: 15px;">
                        <i class="fas fa-calendar-check"></i> Book Now
                    </button>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star star filled"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt star filled"></i>';
            } else {
                stars += '<i class="far fa-star star"></i>';
            }
        }
        return stars;
    }

    addFilterListeners() {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const locationFilter = document.getElementById('location-filter');

        const applyFilters = Utils.debounce(() => {
            this.applyFilters();
        }, 300);

        searchInput.addEventListener('input', applyFilters);
        categoryFilter.addEventListener('change', applyFilters);
        priceFilter.addEventListener('change', applyFilters);
        locationFilter.addEventListener('change', applyFilters);
    }

    applyFilters() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const category = document.getElementById('category-filter').value;
        const priceRange = document.getElementById('price-filter').value;
        const location = document.getElementById('location-filter').value;

        this.filteredMachinery = this.machinery.filter(machine => {
            // Search filter
            if (searchTerm && !machine.name.toLowerCase().includes(searchTerm) && 
                !machine.type.toLowerCase().includes(searchTerm)) {
                return false;
            }

            // Category filter
            if (category && machine.category !== category) {
                return false;
            }

            // Price filter
            if (priceRange) {
                if (priceRange === '0-1000' && machine.price > 1000) return false;
                if (priceRange === '1000-3000' && (machine.price < 1000 || machine.price > 3000)) return false;
                if (priceRange === '3000+' && machine.price < 3000) return false;
            }

            // Location filter
            if (location && !machine.location.includes(location)) {
                return false;
            }

            return true;
        });

        this.renderCatalog();
    }

    showMachineryDetail(machineId) {
        const machine = this.machinery.find(m => m.id === machineId);
        if (!machine) return;

        // Track last viewed machines for simple personalization
        try {
            const key = 'raithaMithraLastViewed';
            const last = JSON.parse(localStorage.getItem(key) || '[]');
            // keep most recent first, max 12
            const idx = last.indexOf(machineId);
            if (idx !== -1) last.splice(idx, 1);
            last.unshift(machineId);
            if (last.length > 12) last.length = 12;
            localStorage.setItem(key, JSON.stringify(last));
        } catch (e) {
            // ignore storage errors
        }

        const iconClass = this.getMachineryIcon(machine.category);
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${machine.name}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <div class="machinery-img" style="margin-bottom: 20px;">
                    <i class="${iconClass}" style="font-size: 4rem; color: var(--text-light);"></i>
                </div>
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                    <div>
                        <p>${machine.description}</p>
                        <div class="machinery-features" style="margin: 20px 0;">
                            <div class="feature">
                                <i class="fas fa-horse-head"></i>
                                ${machine.horsepower}
                            </div>
                            <div class="feature">
                                <i class="fas fa-gas-pump"></i>
                                ${machine.fuelType}
                            </div>
                            <div class="feature">
                                <i class="fas fa-map-marker-alt"></i>
                                ${machine.location}
                            </div>
                        </div>
                        <h4>Features</h4>
                        <ul style="margin-left: 20px;">
                            ${machine.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <h4 style="margin-top:18px;">Similar Machines</h4>
                        <div id="similar-machines" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-top:8px;"></div>
                    </div>
                    <div>
                        <div class="card" style="text-align: center;">
                            <div class="machinery-price" style="font-size: 2rem;">${Utils.formatCurrency(machine.price)}/${machine.priceUnit}</div>
                            ${this.renderStars(machine.rating)}
                            <span>${machine.rating} (${machine.reviewCount} reviews)</span>
                            <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" onclick="booking.showBookingForm('${machine.id}')">
                                <i class="fas fa-calendar-check"></i> Book Now
                            </button>
                            <button class="btn btn-outline" style="width: 100%; margin-top: 10px;" onclick="maps.showMachineOnMap('${machine.id}')">
                                <i class="fas fa-map-marker-alt"></i> View on Map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Populate similar machines section
        try {
            const sims = this.recommendForMachine(machineId, 4);
            const simContainer = modal.querySelector('#similar-machines');
            if (simContainer) {
                if (!sims || sims.length === 0) {
                    simContainer.innerHTML = '<div style="color:var(--text-light)">No similar machines found.</div>';
                } else {
                    simContainer.innerHTML = sims.map(m => `
                        <div class="machinery-card" style="cursor:pointer;" onclick="machinery.showMachineryDetail('${m.id}')">
                                <div class="machinery-img" style="background-image:url('${m.image || 'images/machinery/tractor-photo.jpg'}'); background-size:cover; background-position:center; height:90px;"></div>
                            <div class="machinery-info">
                                <div class="machinery-title" style="font-size:0.95rem">${m.name}</div>
                                <div style="font-weight:700;color:var(--primary);font-size:0.9rem">${Utils.formatCurrency(m.price)}/${m.priceUnit}</div>
                            </div>
                        </div>
                    `).join('');
                }
            }
        } catch (e) {
            // safe fallback
        }
    }

    getMachineryIcon(category) {
        const iconMap = {
            'tools': 'fas fa-tools',
            'tillage': 'fas fa-tractor',
            'harvesting': 'fas fa-wheat-awn',
            'planting': 'fas fa-seedling',
            'spraying': 'fas fa-spray-can',
            'transport': 'fas fa-truck',
            'tractor': 'fas fa-tractor'
        };
        return iconMap[category] || 'fas fa-cogs';
    }

    getAllMachineryForMap() {
        return this.machinery;
    }

    /* ----------------- Simple TF-IDF recommender (in-browser) ----------------- */
    tokenize(text = '') {
        return String(text || '')
            .toLowerCase()
            .replace(/[\W_]+/g, ' ')
            .split(/\s+/)
            .filter(Boolean);
    }

    buildRecommendationIndex() {
        // Try to load cached TF-IDF index from localStorage for faster startup
        try {
            const cached = localStorage.getItem('raithaMithraTFIDF');
            const vocabCached = localStorage.getItem('raithaMithraVocab');
            if (cached && vocabCached) {
                const parsed = JSON.parse(cached);
                const vocab = JSON.parse(vocabCached);
                // basic sanity: number of vectors should match machinery count
                if (parsed && typeof parsed === 'object' && Object.keys(parsed).length === (this.machinery ? this.machinery.length : 0)) {
                    this.tfidfVectors = parsed;
                    this.vocab = vocab;
                    return;
                }
            }
        } catch (e) {
            // ignore cache errors and rebuild
        }

        // Build TF-IDF vectors for all machines
        if (!this.machinery || this.machinery.length === 0) return;
        const docs = this.machinery.map(m => {
            const parts = [m.name, m.description, (m.features || []).join(' '), m.category, m.type];
            return parts.filter(Boolean).join(' ');
        });

        const N = docs.length;
        const docTokens = docs.map(d => this.tokenize(d));

        // document frequency
        const df = {};
        docTokens.forEach(tokens => {
            const seen = new Set(tokens);
            seen.forEach(t => { df[t] = (df[t] || 0) + 1; });
        });

        // IDF
        const idf = {};
        Object.keys(df).forEach(t => {
            idf[t] = Math.log((N + 1) / (df[t] + 1)) + 1;
        });

        // TF-IDF vectors (normalized)
        this.tfidfVectors = {};
        this.vocab = Object.keys(df);

        docTokens.forEach((tokens, idx) => {
            const tf = {};
            tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
            const len = tokens.length || 1;
            // raw tf-idf
            const vec = {};
            Object.keys(tf).forEach(t => {
                const tfVal = tf[t] / len;
                vec[t] = tfVal * (idf[t] || 0);
            });
            // normalize
            const norm = Math.sqrt(Object.values(vec).reduce((s, v) => s + v * v, 0)) || 1;
            Object.keys(vec).forEach(t => { vec[t] = vec[t] / norm; });
            this.tfidfVectors[this.machinery[idx].id] = vec;
        });

        // persist index for faster reloads
        try {
            localStorage.setItem('raithaMithraTFIDF', JSON.stringify(this.tfidfVectors));
            localStorage.setItem('raithaMithraVocab', JSON.stringify(this.vocab));
        } catch (e) {
            // ignore persistence errors
        }
    }

    cosineSim(vecA, vecB) {
        if (!vecA || !vecB) return 0;
        const keys = Object.keys(vecA.length > Object.keys(vecB).length ? vecA : vecB);
        let s = 0;
        for (const k of keys) {
            if (vecA[k] && vecB[k]) s += vecA[k] * vecB[k];
        }
        return s;
    }

    recommendForMachine(machineId, topN = 5) {
        if (!this.tfidfVectors) this.buildRecommendationIndex();
        const base = this.tfidfVectors[machineId];
        if (!base) return [];
        const scores = this.machinery.map(m => ({ id: m.id, score: this.cosineSim(base, this.tfidfVectors[m.id] || {}) }));
        return scores
            .filter(s => s.id !== machineId)
            .sort((a, b) => b.score - a.score)
            .slice(0, topN)
            .map(s => this.machinery.find(m => m.id === s.id));
    }

    recommendForUser(topN = 6) {
        if (!this.tfidfVectors) this.buildRecommendationIndex();
        const last = JSON.parse(localStorage.getItem('raithaMithraLastViewed') || '[]');
        if (last && last.length > 0) {
            // average vector of last viewed
            const agg = {};
            last.forEach(id => {
                const v = this.tfidfVectors[id];
                if (!v) return;
                Object.keys(v).forEach(k => { agg[k] = (agg[k] || 0) + v[k]; });
            });
            const count = last.length;
            Object.keys(agg).forEach(k => { agg[k] = agg[k] / count; });
            // normalize
            const norm = Math.sqrt(Object.values(agg).reduce((s, v) => s + v * v, 0)) || 1;
            Object.keys(agg).forEach(k => { agg[k] = agg[k] / norm; });

            const scores = this.machinery.map(m => ({ id: m.id, score: this.cosineSim(agg, this.tfidfVectors[m.id] || {}) }));
            const filtered = scores
                .filter(s => !last.includes(s.id))
                .sort((a, b) => b.score - a.score)
                .slice(0, topN)
                .map(s => this.machinery.find(m => m.id === s.id));
            return filtered;
        }

        // fallback: top-rated machines
        return this.machinery.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, topN);
    }

    renderRecommendations() {
        const container = document.getElementById('recommendation-section');
        if (!container) return;
        const recs = this.recommendForUser(6) || [];
        if (!recs || recs.length === 0) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = `<h3 style="margin-bottom:8px">Recommended for you</h3>` +
            `<div class="machinery-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 18px">` +
            recs.map(m => `
                <div class="machinery-card" onclick="machinery.showMachineryDetail('${m.id}')" style="cursor:pointer;">
                    <div class="machinery-img" style="background-image: url('${m.image || 'images/machinery/tractor-photo.jpg'}'); background-size: cover; background-position: center; height:120px;"></div>
                    <div class="machinery-info">
                        <div class="machinery-title" style="font-size:1rem">${m.name}</div>
                        <div style="font-weight:700; color:var(--primary);">${Utils.formatCurrency(m.price)}/${m.priceUnit}</div>
                    </div>
                </div>
            `).join('') + `</div>`;
    }

    /* ----------------- End recommender ----------------- */

    /* Calculate distance (km) between two coordinates using Haversine formula */
    haversineDistance(lat1, lon1, lat2, lon2) {
        const toRad = v => (v * Math.PI) / 180;
        const R = 6371; // Earth radius km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /* Return an array of machinery within radiusKm of (lat,lng), sorted by distance */
    findNearby(radiusKm = 50, lat, lng) {
        if (typeof lat !== 'number' || typeof lng !== 'number') return [];
        const nearby = this.machinery
            .map(m => {
                const mLat = (m.coordinates && m.coordinates.lat) || 0;
                const mLng = (m.coordinates && m.coordinates.lng) || 0;
                const dist = this.haversineDistance(lat, lng, mLat, mLng);
                return Object.assign({}, m, { distanceKm: dist });
            })
            .filter(m => m.distanceKm <= radiusKm)
            .sort((a, b) => a.distanceKm - b.distanceKm);

        return nearby;
    }

    /* Prompt for geolocation and render nearby results */
    showNearby(radiusKm = 50) {
        const resultsContainer = document.getElementById('nearby-results');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `<div style="padding:12px">Detecting location… please allow location access in your browser.</div>`;

        if (!navigator.geolocation) {
            resultsContainer.innerHTML = `<div class="alert alert-warning">Geolocation is not supported by your browser.</div>`;
            return;
        }

        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const nearby = this.findNearby(radiusKm, lat, lng);

            if (nearby.length === 0) {
                resultsContainer.innerHTML = `<div class="alert">No machinery found within ${radiusKm} km of your location.</div>`;
                return;
            }

            resultsContainer.innerHTML = `<h3>Nearby Machinery (within ${radiusKm} km)</h3>` +
                `<div class="machinery-grid">` +
                nearby.map(m => `
                    <div class="machinery-card" style="border:2px solid #f0c36d;" onclick="machinery.showMachineryDetail('${m.id}')">
                        <div class="machinery-img" style="background-image: url('${m.image || 'images/machinery/tractor-photo.jpg'}'); background-size: cover; background-position: center; height:140px; position: relative;">
                            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.35), rgba(0,0,0,0.05));"></div>
                        </div>
                        <div class="machinery-info">
                            <div class="machinery-title">${m.name}</div>
                            <div style="font-weight:700; color:var(--primary);">${Utils.formatCurrency(m.price)}/${m.priceUnit}</div>
                            <div style="margin-top:8px; color:var(--text-light);">${m.location} — <strong>${m.distanceKm.toFixed(1)} km</strong></div>
                        </div>
                    </div>
                `).join('') +
                `</div>`;

            // Optionally, center map on first nearby machine if maps integration exists
            if (nearby[0] && typeof maps !== 'undefined' && maps && maps.showLocation) {
                maps.showLocation(nearby[0].coordinates.lat, nearby[0].coordinates.lng);
            }

        }, error => {
            resultsContainer.innerHTML = `<div class="alert alert-error">Unable to get your location: ${error.message}</div>`;
        }, { enableHighAccuracy: true, timeout: 10000 });
    }
}

const machinery = new MachineryManager();