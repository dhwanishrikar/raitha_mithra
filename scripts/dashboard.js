class DashboardManager {
    constructor() {
        this.currentView = 'catalog';
    }

    show() {
        const user = auth.currentUser;
        if (!user) {
            auth.showLogin();
            return;
        }

        document.getElementById('app').innerHTML = `
            <header class="header">
                <div class="container">
                    <div class="header-container">
                        <div class="logo">
                            <i class="fas fa-tractor logo-icon"></i>
                            <div class="logo-text">RAITHA <span>MITHRA</span></div>
                        </div>
                        
                        <nav>
                            <ul class="nav-menu">
                                <li><a href="#" class="nav-link active" onclick="event.preventDefault(); dashboard.showView('catalog', event)"><i class="fas fa-tractor"></i> Machinery</a></li>
                                <li><a href="#" class="nav-link" onclick="event.preventDefault(); dashboard.showView('bookings', event)"><i class="fas fa-calendar-check"></i> My Bookings</a></li>
                                <li><a href="#" class="nav-link" onclick="event.preventDefault(); dashboard.showView('profile', event)"><i class="fas fa-user"></i> Profile</a></li>
                                ${user.type === 'owner' ? `
                                    <li><a href="#" class="nav-link" onclick="event.preventDefault(); dashboard.showView('mymachinery', event)"><i class="fas fa-tools"></i> My Machinery</a></li>
                                ` : ''}
                            </ul>
                        </nav>

                        <div class="user-actions">
                            <span style="margin-right: 15px;">Welcome, ${user.name}</span>
                            <button class="btn btn-outline" onclick="auth.logout()">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div id="dashboard-content">
                ${this.renderCatalogView()}
            </div>
        `;

        machinery.renderCatalog();
    }

    showView(view, event) {
        this.currentView = view;

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        if (event && event.target) {
            event.target.classList.add('active');
        }

        const content = document.getElementById('dashboard-content');

        switch(view) {
            case 'catalog':
                content.innerHTML = this.renderCatalogView();
                machinery.renderCatalog();
                break;
            case 'bookings':
                content.innerHTML = this.renderBookingsView();
                this.renderUserBookings();
                break;
            case 'profile':
                content.innerHTML = this.renderProfileView();
                break;
            case 'mymachinery':
                content.innerHTML = this.renderMyMachineryView();
                break;
        }
    }

    renderCatalogView() {
        return `
            <div class="dashboard">
                <div class="container">
                    <div class="dashboard-header">
                        <div class="welcome-message">
                            <h1>Find Perfect Machinery</h1>
                            <p>Rent from trusted owners across India</p>
                        </div>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <i class="fas fa-tractor"></i>
                                <span class="stat-number">${machinery.machinery.length}+</span>
                                <span>Machinery Available</span>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-users"></i>
                                <span class="stat-number">500+</span>
                                <span>Happy Farmers</span>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-map-marker-alt"></i>
                                <span class="stat-number">25+</span>
                                <span>Cities Covered</span>
                            </div>
                        </div>
                    </div>

                    <!-- Maps Integration -->
                    <div class="card">
                        <div class="catalog-header">
                            <h3><i class="fas fa-map-marked-alt"></i> Find Machinery Near You</h3>
                            <button class="btn btn-primary" onclick="maps.findNearbyMachinery()">
                                <i class="fas fa-location-arrow"></i> Locate Nearby
                            </button>
                        </div>
                        <div id="map-container">
                            ${maps.initMap()}
                        </div>
                    </div>

                    <!-- ML Recommendations -->
                    <div id="ml-recommendations">
                        ${recommendations.renderRecommendations()}
                    </div>

                    <!-- Machinery Catalog -->
                    <div id="machinery-catalog"></div>
                </div>
            </div>
        `;
    }

    renderBookingsView() {
        return `
            <div class="dashboard">
                <div class="container">
                    <div class="dashboard-header">
                        <h1>My Bookings</h1>
                        <p>Manage your machinery rentals</p>
                    </div>
                    <div id="bookings-list"></div>
                </div>
            </div>
        `;
    }

    renderUserBookings() {
        const userBookings = booking.getUserBookings();
        const container = document.getElementById('bookings-list');
        
        if (userBookings.length === 0) {
            container.innerHTML = `
                <div class="card" style="text-align: center; padding: 40px;">
                    <i class="fas fa-calendar-times" style="font-size: 3rem; color: var(--gray-dark); margin-bottom: 20px;"></i>
                    <h3>No Bookings Yet</h3>
                    <p>Start renting machinery for your farm needs</p>
                            <button class="btn btn-primary" onclick="event.preventDefault(); dashboard.showView('catalog', event)">
                                <i class="fas fa-tractor"></i> Browse Machinery
                            </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div style="display: grid; gap: 20px;">
                ${userBookings.map(booking => `
                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                            <div>
                                <h4>${booking.machineName}</h4>
                                <p style="color: var(--text-light);">${Utils.formatDate(booking.startDate)} - ${Utils.formatDate(booking.endDate)}</p>
                                <p style="color: var(--text-light);">${booking.duration} days • ${booking.deliveryOption}</p>
                            </div>
                            <span class="badge ${booking.status === 'confirmed' ? 'badge-success' : booking.status === 'pending' ? 'badge-secondary' : 'badge-primary'}">
                                ${booking.status}
                            </span>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div>
                                <strong>Total Amount:</strong> ${Utils.formatCurrency(booking.totalAmount)}
                            </div>
                            <div>
                                <strong>Booking ID:</strong> ${booking.id}
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn btn-outline" style="flex: 1;" onclick="dashboard.viewBookingDetails('${booking.id}')">
                                <i class="fas fa-eye"></i> Details
                            </button>
                            ${booking.status === 'pending' ? `
                                <button class="btn btn-primary" style="flex: 1;" onclick="payment.showPaymentPage('${booking.id}')">
                                    <i class="fas fa-credit-card"></i> Pay Now
                                </button>
                            ` : ''}
                            ${booking.status === 'confirmed' ? `
                                <button class="btn btn-outline" style="flex: 1;" onclick="maps.getDirections('${booking.machineName} Location')">
                                    <i class="fas fa-directions"></i> Get Directions
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    viewBookingDetails(bookingId) {
        const bookingItem = booking.bookings.find(b => b.id === bookingId);
        if (!bookingItem) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Booking Details</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <div style="margin-bottom: 20px;">
                    <h4>${bookingItem.machineName}</h4>
                    <p><strong>Status:</strong> <span class="badge ${bookingItem.status === 'confirmed' ? 'badge-success' : 'badge-secondary'}">${bookingItem.status}</span></p>
                </div>
                <div style="display: grid; gap: 15px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Booking Period:</span>
                        <span>${Utils.formatDate(bookingItem.startDate)} to ${Utils.formatDate(bookingItem.endDate)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Duration:</span>
                        <span>${bookingItem.duration} days</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Delivery Option:</span>
                        <span>${bookingItem.deliveryOption}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Total Amount:</span>
                        <span>${Utils.formatCurrency(bookingItem.totalAmount)}</span>
                    </div>
                    ${bookingItem.specialRequests ? `
                        <div>
                            <strong>Special Requests:</strong>
                            <p>${bookingItem.specialRequests}</p>
                        </div>
                    ` : ''}
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--gray);">
                    <button class="btn btn-primary" style="width: 100%;" onclick="this.closest('.modal-overlay').remove()">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    renderProfileView() {
        const user = auth.currentUser;
        return `
            <div class="dashboard">
                <div class="container">
                    <div class="dashboard-header">
                        <h1>My Profile</h1>
                        <p>Manage your account information</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px;">
                        <div class="card" style="text-align: center;">
                            <div style="width: 100px; height: 100px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; font-size: 2rem;">
                                ${user.name.charAt(0).toUpperCase()}
                            </div>
                            <h3>${user.name}</h3>
                            <p>${user.type === 'farmer' ? 'Farmer' : 'Machinery Owner'}</p>
                            <div class="badge ${user.isVerified ? 'badge-success' : 'badge-secondary'}" style="margin: 10px 0;">
                                ${user.isVerified ? 'Verified' : 'Not Verified'}
                            </div>
                            <p style="color: var(--text-light); font-size: 0.9rem;">
                                Member since ${Utils.formatDate(user.joinedDate)}
                            </p>
                        </div>

                        <div class="card">
                            <h3 style="margin-bottom: 20px;">Profile Information</h3>
                            <form onsubmit="dashboard.updateProfile(event)">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                    <div class="form-group">
                                        <label>Full Name</label>
                                        <input type="text" class="form-control" value="${user.name}" id="profile-name">
                                    </div>
                                    <div class="form-group">
                                        <label>Email</label>
                                        <input type="email" class="form-control" value="${user.email}" readonly>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" class="form-control" value="${user.phone}" id="profile-phone">
                                </div>
                                <div class="form-group">
                                    <label>Address</label>
                                    <textarea class="form-control" rows="3" placeholder="Enter your address" id="profile-address"></textarea>
                                </div>
                                ${user.type === 'farmer' ? `
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                        <div class="form-group">
                                            <label>Farm Size (acres)</label>
                                            <input type="number" class="form-control" placeholder="e.g., 10" id="farm-size">
                                        </div>
                                        <div class="form-group">
                                            <label>Main Crops</label>
                                            <input type="text" class="form-control" placeholder="e.g., Rice, Wheat" id="main-crops">
                                        </div>
                                    </div>
                                ` : `
                                    <div class="form-group">
                                        <label>Machinery Owner Since</label>
                                        <input type="text" class="form-control" value="${Utils.formatDate(user.joinedDate)}" readonly>
                                    </div>
                                `}
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save"></i> Update Profile
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updateProfile(event) {
        event.preventDefault();
        Utils.showNotification('Profile updated successfully!', 'success');
        // In real implementation, this would update the user data
    }

    renderMyMachineryView() {
        const userMachinery = machinery.machinery.filter(m => m.ownerId === auth.currentUser.id);
        
        return `
            <div class="dashboard">
                <div class="container">
                    <div class="dashboard-header">
                        <div>
                            <h1>My Machinery</h1>
                            <p>Manage your equipment listings</p>
                        </div>
                        <button class="btn btn-primary" onclick="dashboard.addNewMachinery()">
                            <i class="fas fa-plus"></i> Add New Machinery
                        </button>
                    </div>
                    
                    ${userMachinery.length === 0 ? `
                        <div class="card" style="text-align: center; padding: 40px;">
                            <i class="fas fa-tractor" style="font-size: 3rem; color: var(--gray-dark); margin-bottom: 20px;"></i>
                            <h3>No Machinery Listed</h3>
                            <p>Start renting out your equipment to farmers</p>
                            <button class="btn btn-primary" onclick="dashboard.addNewMachinery()">
                                <i class="fas fa-plus"></i> Add Your First Machine
                            </button>
                        </div>
                    ` : `
                        <div class="machinery-grid">
                            ${userMachinery.map(machine => `
                                <div class="machinery-card">
                                    <div class="machinery-img">
                                        <i class="fas fa-tractor" style="font-size: 3rem; color: var(--text-light);"></i>
                                    </div>
                                    <div class="machinery-info">
                                        <div class="machinery-title">${machine.name}</div>
                                        <div class="machinery-price">${Utils.formatCurrency(machine.price)}/${machine.priceUnit}</div>
                                        <div class="machinery-features">
                                            <div class="feature">
                                                <i class="fas fa-horse-head"></i>
                                                ${machine.horsepower}
                                            </div>
                                            <div class="feature">
                                                <i class="fas fa-map-marker-alt"></i>
                                                ${machine.location.split(',')[0]}
                                            </div>
                                        </div>
                                        <div class="rating">
                                            ${machinery.renderStars(machine.rating)}
                                            <span>(${machine.reviewCount})</span>
                                        </div>
                                        <div style="display: flex; gap: 10px; margin-top: 15px;">
                                            <button class="btn btn-outline" style="flex: 1;">
                                                <i class="fas fa-edit"></i> Edit
                                            </button>
                                            <button class="btn btn-outline" style="flex: 1;">
                                                <i class="fas fa-chart-line"></i> Stats
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    addNewMachinery() {
        // Show modal with form to add new machinery
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal" style="max-width:800px;">
                <div class="modal-header">
                    <h3>Add New Machinery</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <form id="add-machinery-form" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div style="grid-column: 1 / -1; display:flex; gap:12px;">
                        <input name="name" placeholder="Machine name" class="form-control" required />
                        <select name="category" class="form-control" required>
                            <option value="tractor">Tractor</option>
                            <option value="tillage">Tillage</option>
                            <option value="harvesting">Harvesting</option>
                            <option value="planting">Planting</option>
                            <option value="spraying">Spraying</option>
                            <option value="transport">Transport</option>
                            <option value="tools">Tools</option>
                        </select>
                    </div>
                    <input name="type" placeholder="Type (e.g., 4-wheel Tractor)" class="form-control" />
                    <input name="price" placeholder="Price (number)" type="number" class="form-control" required />
                    <input name="priceUnit" placeholder="Price unit (day/hour)" class="form-control" value="day" />
                    <input name="horsepower" placeholder="Horsepower (e.g., 50 HP)" class="form-control" />
                    <input name="fuelType" placeholder="Fuel type" class="form-control" />
                    <input name="location" placeholder="Location (City, State)" class="form-control" required />
                    <input name="image" placeholder="Image path (images/...)" class="form-control" />
                    <input name="lat" placeholder="Latitude (optional)" type="number" step="any" class="form-control" />
                    <input name="lng" placeholder="Longitude (optional)" type="number" step="any" class="form-control" />
                    <textarea name="description" placeholder="Short description" class="form-control" style="grid-column:1 / -1; height:100px"></textarea>
                    <input name="features" placeholder="Features (comma separated)" class="form-control" style="grid-column:1 / -1;" />
                    <div style="grid-column:1 / -1; display:flex; gap:12px; justify-content:flex-end;">
                        <button type="button" class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add Machine</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        const form = modal.querySelector('#add-machinery-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(form);
            const name = fd.get('name').trim();
            const category = fd.get('category').trim();
            const type = fd.get('type').trim();
            const price = parseFloat(fd.get('price')) || 0;
            const priceUnit = fd.get('priceUnit').trim() || 'day';
            const horsepower = fd.get('horsepower').trim();
            const fuelType = fd.get('fuelType').trim();
            const location = fd.get('location').trim();
            const image = fd.get('image').trim() || 'images/machinery/tractor-photo.jpg';
            const lat = parseFloat(fd.get('lat')) || 0;
            const lng = parseFloat(fd.get('lng')) || 0;
            const description = fd.get('description').trim();
            const features = (fd.get('features') || '').split(',').map(s => s.trim()).filter(Boolean);

            // Basic validation
            if (!name || !location || price <= 0) {
                Utils.showNotification('Please fill required fields (name, location, valid price).', 'error');
                return;
            }

            const newMachine = {
                id: 'm' + Date.now(),
                name,
                category,
                type,
                price,
                priceUnit,
                horsepower,
                fuelType,
                location,
                coordinates: { lat: lat || 0, lng: lng || 0 },
                ownerId: auth.currentUser ? auth.currentUser.id : 'owner-local',
                image,
                description,
                features,
                availability: true,
                rating: 0,
                reviewCount: 0
            };

            // Save to machinery list and persist
            try {
                machinery.machinery.unshift(newMachine);
                machinery.filteredMachinery = [...machinery.machinery];
                localStorage.setItem('raithaMithraMachinery', JSON.stringify(machinery.machinery));

                // Rebuild recommendation index (and persist)
                if (typeof machinery.buildRecommendationIndex === 'function') {
                    machinery.buildRecommendationIndex();
                }

                Utils.showNotification('New machinery added successfully!', 'success');
                modal.remove();

                // Refresh the dashboard view to show new item
                this.showView('mymachinery');
            } catch (err) {
                console.error('Error saving machinery', err);
                Utils.showNotification('Failed to save machinery.', 'error');
            }
        });
    }
}

const dashboard = new DashboardManager();