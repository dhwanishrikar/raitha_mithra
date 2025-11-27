class MapsManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.userLocation = null;
    }

    initMap() {
        // Create a simple map container (in real implementation, this would use Google Maps API)
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div class="maps-container">
                <div style="text-align: center;">
                    <i class="fas fa-map" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <h3>Machinery Locations Map</h3>
                    <p>Google Maps integration ready</p>
                    <small>Add your Google Maps API key to enable live maps</small>
                    <div style="margin-top: 20px;">
                        <button class="btn btn-primary" onclick="maps.showSampleLocations()">
                            <i class="fas fa-eye"></i> View Sample Locations
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showSampleLocations() {
        const machinery = machineryManager.getAllMachineryForMap();
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        let locationsHTML = '';
        machinery.forEach(machine => {
            locationsHTML += `
                <div style="padding: 15px; border-bottom: 1px solid var(--gray);">
                    <h4>${machine.name}</h4>
                    <p><i class="fas fa-map-marker-alt"></i> ${machine.location}</p>
                    <p><i class="fas fa-rupee-sign"></i> ${machine.price}/day</p>
                    <button class="btn btn-outline" onclick="machinery.showMachineryDetail('${machine.id}')">
                        View Details
                    </button>
                </div>
            `;
        });

        modal.innerHTML = `
            <div class="modal" style="max-width: 500px;">
                <div class="modal-header">
                    <h3><i class="fas fa-map-marked-alt"></i> Machinery Locations</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <div style="max-height: 400px; overflow-y: auto;">
                    ${locationsHTML}
                </div>
                <div style="margin-top: 20px; padding: 15px; background: var(--gray); border-radius: var(--radius);">
                    <p><strong>Note:</strong> Real Google Maps would show these locations on an interactive map</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    showMachineOnMap(machineId) {
        const machine = machinery.machinery.find(m => m.id === machineId);
        if (!machine) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal" style="max-width: 600px;">
                <div class="modal-header">
                    <h3><i class="fas fa-map-marker-alt"></i> ${machine.name} Location</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                
                <div class="maps-container" style="height: 300px;">
                    <div style="text-align: center; padding: 50px;">
                        <i class="fas fa-tractor" style="font-size: 4rem; color: var(--primary);"></i>
                        <h4>${machine.location}</h4>
                        <p>Coordinates: ${machine.coordinates.lat}, ${machine.coordinates.lng}</p>
                        <div style="margin-top: 20px;">
                            <button class="btn btn-primary" onclick="maps.getDirections('${machine.location}')">
                                <i class="fas fa-directions"></i> Get Directions
                            </button>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 20px;">
                    <h4>Location Details</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div>
                            <strong><i class="fas fa-clock"></i> Availability</strong>
                            <p>${machine.availability ? 'Available Now' : 'Not Available'}</p>
                        </div>
                        <div>
                            <strong><i class="fas fa-phone"></i> Contact Owner</strong>
                            <p>+91 XXXXX XXXXX</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    getDirections(location) {
        // In real implementation, this would open Google Maps with directions
        Utils.showNotification(`Directions to ${location} would open in Google Maps`, 'info');
        
        // Simulate opening directions
        setTimeout(() => {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`, '_blank');
        }, 1000);
    }

    findNearbyMachinery() {
        if (navigator.geolocation) {
            Utils.showNotification('Finding machinery near your location...', 'info');
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Show nearby machinery in a modal
                    this.showNearbyMachineryModal();
                },
                (error) => {
                    Utils.showNotification('Unable to get your location. Using sample locations.', 'warning');
                    this.showSampleLocations();
                }
            );
        } else {
            Utils.showNotification('Geolocation is not supported by this browser.', 'error');
        }
    }

    showNearbyMachineryModal() {
        const machinery = machineryManager.getAllMachineryForMap();
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        let nearbyHTML = '';
        machinery.forEach(machine => {
            const distance = Utils.calculateDistance(
                this.userLocation.lat, this.userLocation.lng,
                machine.coordinates.lat, machine.coordinates.lng
            );
            
            nearbyHTML += `
                <div style="padding: 15px; border-bottom: 1px solid var(--gray);">
                    <h4>${machine.name}</h4>
                    <p><i class="fas fa-map-marker-alt"></i> ${machine.location}</p>
                    <p><i class="fas fa-rupee-sign"></i> ${machine.price}/day</p>
                    <p><i class="fas fa-road"></i> ${distance.toFixed(1)} km away</p>
                    <button class="btn btn-outline" onclick="machinery.showMachineryDetail('${machine.id}')">
                        View Details
                    </button>
                </div>
            `;
        });

        modal.innerHTML = `
            <div class="modal" style="max-width: 500px;">
                <div class="modal-header">
                    <h3><i class="fas fa-location-arrow"></i> Machinery Near You</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <div style="max-height: 400px; overflow-y: auto;">
                    ${nearbyHTML}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }
}

const maps = new MapsManager();