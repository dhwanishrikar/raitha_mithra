class BookingManager {
    constructor() {
        this.bookings = JSON.parse(localStorage.getItem('raithaMithraBookings')) || [];
    }

    showBookingForm(machineId) {
        const machine = machinery.machinery.find(m => m.id === machineId);
        if (!machine) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Book ${machine.name}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                
                <div class="booking-top-grid">
                    <div>
                        <div class="machinery-img">
                            <i class="fas fa-tractor" style="font-size: 3rem; color: var(--text-light);"></i>
                        </div>
                    </div>
                    <div>
                        <h4>${Utils.formatCurrency(machine.price)}/${machine.priceUnit}</h4>
                        <p>${machine.location}</p>
                        ${machinery.renderStars(machine.rating)}
                    </div>
                </div>

                <form onsubmit="booking.handleBooking(event, '${machineId}')">
                    <div class="form-group">
                        <label>Rental Duration</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                            <button type="button" class="btn btn-outline duration-btn active" data-duration="1">1 Day</button>
                            <button type="button" class="btn btn-outline duration-btn" data-duration="3">3 Days</button>
                            <button type="button" class="btn btn-outline duration-btn" data-duration="7">1 Week</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="booking-date">Start Date</label>
                        <input type="date" id="booking-date" class="form-control" required min="${this.getTomorrowDate()}">
                    </div>

                    <div class="form-group">
                        <label for="delivery-option">Delivery Option</label>
                        <select id="delivery-option" class="form-control">
                            <option value="pickup">I will pickup</option>
                            <option value="delivery">Request delivery (+₹200)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="special-requests">Special Requests</label>
                        <textarea id="special-requests" class="form-control" rows="3" placeholder="Any special requirements..."></textarea>
                    </div>

                    <div class="card" style="background: var(--gray);">
                        <h4>Booking Summary</h4>
                        <div id="booking-summary">
                            <div style="display: flex; justify-content: space-between;">
                                <span>Rental (1 day):</span>
                                <span>${Utils.formatCurrency(machine.price)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Delivery:</span>
                                <span>₹0</span>
                            </div>
                            <hr>
                            <div style="display: flex; justify-content: space-between; font-weight: 600;">
                                <span>Total:</span>
                                <span>${Utils.formatCurrency(machine.price)}</span>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px;">
                        <i class="fas fa-lock"></i> Proceed to Payment
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Add duration button listeners
        this.addDurationListeners(machine);
        this.addDeliveryListener(machine);
    }

    addDurationListeners(machine) {
        document.querySelectorAll('.duration-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateBookingSummary(machine);
            });
        });
    }

    addDeliveryListener(machine) {
        document.getElementById('delivery-option').addEventListener('change', () => {
            this.updateBookingSummary(machine);
        });
    }

    updateBookingSummary(machine) {
        const duration = document.querySelector('.duration-btn.active').dataset.duration;
        const deliveryOption = document.getElementById('delivery-option').value;
        const deliveryCost = deliveryOption === 'delivery' ? 200 : 0;
        const total = (machine.price * parseInt(duration)) + deliveryCost;

        document.getElementById('booking-summary').innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <span>Rental (${duration} ${duration === '1' ? 'day' : 'days'}):</span>
                <span>${Utils.formatCurrency(machine.price * parseInt(duration))}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Delivery:</span>
                <span>${Utils.formatCurrency(deliveryCost)}</span>
            </div>
            <hr>
            <div style="display: flex; justify-content: space-between; font-weight: 600;">
                <span>Total:</span>
                <span>${Utils.formatCurrency(total)}</span>
            </div>
        `;
    }

    getTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    handleBooking(event, machineId) {
        event.preventDefault();
        const machine = machinery.machinery.find(m => m.id === machineId);
        if (!machine) return;

        const duration = document.querySelector('.duration-btn.active').dataset.duration;
        const startDate = document.getElementById('booking-date').value;
        const deliveryOption = document.getElementById('delivery-option').value;
        const specialRequests = document.getElementById('special-requests').value;

        const booking = {
            id: Utils.generateId(),
            machineId: machineId,
            machineName: machine.name,
            userId: auth.currentUser.id,
            userName: auth.currentUser.name,
            duration: parseInt(duration),
            startDate: startDate,
            endDate: this.calculateEndDate(startDate, duration),
            deliveryOption: deliveryOption,
            specialRequests: specialRequests,
            status: 'pending',
            totalAmount: this.calculateTotal(machine.price, duration, deliveryOption),
            createdAt: new Date().toISOString()
        };

        this.bookings.push(booking);
        localStorage.setItem('raithaMithraBookings', JSON.stringify(this.bookings));

        // Close modal and show payment
        document.querySelector('.modal-overlay').remove();
        payment.showPaymentPage(booking);
    }

    calculateEndDate(startDate, duration) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + parseInt(duration));
        return endDate.toISOString().split('T')[0];
    }

    calculateTotal(price, duration, deliveryOption) {
        const deliveryCost = deliveryOption === 'delivery' ? 200 : 0;
        return (price * parseInt(duration)) + deliveryCost;
    }

    getUserBookings() {
        return this.bookings.filter(booking => booking.userId === auth.currentUser.id);
    }
}

const booking = new BookingManager();