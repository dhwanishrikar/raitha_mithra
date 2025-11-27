class RecommendationEngine {
    constructor() {
        this.userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
        this.userHistory = JSON.parse(localStorage.getItem('userRentalHistory')) || [];
    }

    // Content-based filtering based on machinery attributes
    getSimilarMachinery(machineId, limit = 4) {
        const targetMachine = machinery.machinery.find(m => m.id === machineId);
        if (!targetMachine) return [];

        const similarities = machinery.machinery
            .filter(m => m.id !== machineId && m.availability)
            .map(machine => ({
                machine,
                similarity: this.calculateSimilarity(targetMachine, machine)
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);

        return similarities.map(item => item.machine);
    }

    calculateSimilarity(machineA, machineB) {
        let score = 0;
        
        // Category similarity (40% weight)
        if (machineA.category === machineB.category) score += 0.4;
        
        // Price range similarity (25% weight)
        const priceDiff = Math.abs(machineA.price - machineB.price);
        const maxPrice = Math.max(...machinery.machinery.map(m => m.price));
        score += 0.25 * (1 - priceDiff / maxPrice);
        
        // Rating similarity (15% weight)
        const ratingDiff = Math.abs(machineA.rating - machineB.rating);
        score += 0.15 * (1 - ratingDiff / 5);

        return score;
    }

    // Get popular machinery based on rental history and ratings
    getPopularMachinery(limit = 4) {
        const machineRentalCount = {};
        
        this.userHistory.forEach(history => {
            machineRentalCount[history.machineId] = (machineRentalCount[history.machineId] || 0) + 1;
        });

        return machinery.machinery
            .filter(machine => machine.availability)
            .map(machine => ({
                machine,
                popularity: (machineRentalCount[machine.id] || 0) + machine.rating
            }))
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, limit)
            .map(item => item.machine);
    }

    // Personalized recommendations based on user type and history
    getPersonalizedRecommendations(userId) {
        const user = auth.currentUser;
        if (!user) return this.getPopularMachinery(4);

        let recommendations = [];

        // If user has rental history, show similar items
        const userRentals = this.userHistory.filter(h => h.userId === userId);
        if (userRentals.length > 0) {
            const lastRental = userRentals[userRentals.length - 1];
            recommendations = this.getSimilarMachinery(lastRental.machineId, 4);
        } else {
            // For new users, show popular items
            recommendations = this.getPopularMachinery(4);
        }

        return recommendations.length > 0 ? recommendations : this.getPopularMachinery(4);
    }

    // Record user interaction for ML training
    recordUserInteraction(userId, machineId, interactionType) {
        const interaction = {
            userId,
            machineId,
            interactionType, // 'view', 'rent', 'wishlist'
            timestamp: new Date().toISOString()
        };

        this.userHistory.push(interaction);
        localStorage.setItem('userRentalHistory', JSON.stringify(this.userHistory));
    }

    // Render recommendations section
    renderRecommendations() {
        const user = auth.currentUser;
        if (!user) return '';

        const personalizedRecs = this.getPersonalizedRecommendations(user.id);
        
        if (personalizedRecs.length === 0) return '';

        return `
            <div class="recommendations-section">
                <h3 class="section-title">
                    <i class="fas fa-robot"></i> Recommended For You
                </h3>
                <div class="recommendation-grid">
                    ${personalizedRecs.map(machine => `
                        <div class="machinery-card" onclick="machinery.showMachineryDetail('${machine.id}')">
                            <div class="machinery-img">
                                <i class="fas fa-tractor" style="font-size: 3rem; color: var(--text-light);"></i>
                            </div>
                            <div class="machinery-info">
                                <div class="machinery-title">${machine.name}</div>
                                <div class="machinery-price">${Utils.formatCurrency(machine.price)}/${machine.priceUnit}</div>
                                <div class="rating">
                                    ${machinery.renderStars(machine.rating)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

const recommendations = new RecommendationEngine();