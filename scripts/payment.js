class PaymentManager {
    constructor() {
        this.payments = JSON.parse(localStorage.getItem('raithaMithraPayments')) || [];
    }

    showPaymentPage(booking) {
        // Store booking data
        this.currentBooking = booking;

        // Update payment section with booking details
        document.getElementById('payment-machine-name').textContent = `${booking.machineName} (${booking.duration} days):`;
        document.getElementById('payment-machine-cost').textContent = Utils.formatCurrency(booking.totalAmount - (booking.deliveryOption === 'delivery' ? 200 : 0));
        document.getElementById('payment-delivery-cost').textContent = booking.deliveryOption === 'delivery' ? '₹200' : '₹0';
        document.getElementById('payment-total-amount').textContent = Utils.formatCurrency(booking.totalAmount);
        document.getElementById('payment-btn').innerHTML = `<i class="fas fa-lock"></i> Pay Securely - ${Utils.formatCurrency(booking.totalAmount)}`;
        document.getElementById('payment-btn').setAttribute('onclick', `payment.processPayment('${booking.id}')`);

        // Show payment section
        if (window.app) {
            window.app.showSection('payment-section');
        }
    }

    selectPaymentMethod(method) {
        // Update active method
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
        event.target.closest('.payment-method').classList.add('active');

        // Show corresponding form
        document.querySelectorAll('.payment-form').forEach(form => form.style.display = 'none');
        document.getElementById(`${method}-payment`).style.display = 'block';
    }

    processPayment(bookingId) {
        // Show loading state
        const btn = document.getElementById('payment-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
        btn.disabled = true;

        // Simulate payment processing
        setTimeout(() => {
            const paymentRecord = {
                id: Utils.generateId(),
                bookingId: bookingId,
                userId: auth.currentUser.id,
                amount: this.currentBooking.totalAmount,
                method: 'Credit/Debit Card', // Default method
                status: 'completed',
                transactionId: 'TXN' + Date.now(),
                paidAt: new Date().toISOString()
            };

            this.payments.push(paymentRecord);
            localStorage.setItem('raithaMithraPayments', JSON.stringify(this.payments));

            // Update booking status
            const bookingItem = booking.bookings.find(b => b.id === bookingId);
            if (bookingItem) {
                bookingItem.status = 'confirmed';
                localStorage.setItem('raithaMithraBookings', JSON.stringify(booking.bookings));
            }

            // Show success message
            this.showSuccessMessage();

            // Reset button
            btn.innerHTML = originalText;
            btn.disabled = false;

        }, 2000);
    }

    showSuccessMessage() {
        const bookingId = 'RM' + Date.now();
        document.getElementById('bookingId').textContent = bookingId;
        document.getElementById('successMessage').style.display = 'block';

        // Scroll to success message
        document.getElementById('successMessage').scrollIntoView({
            behavior: 'smooth'
        });

        // Auto redirect to dashboard after success
        setTimeout(() => {
            if (window.app) {
                window.app.hideSection();
            }
            if (typeof dashboard !== 'undefined') {
                dashboard.show();
            }
        }, 3000);
    }
}

const payment = new PaymentManager();