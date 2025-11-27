class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('raithaMithraUsers')) || [];
        this.initializeAuth();
    }

    initializeAuth() {
        // Check if user is already logged in
        const savedUser = Utils.getCurrentUser();
        if (savedUser) {
            this.currentUser = savedUser;
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('app').innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <div class="auth-header">
                        <div class="logo">
                            <i class="fas fa-tractor logo-icon"></i>
                            <div class="logo-text">RAITHA <span>MITHRA</span></div>
                        </div>
                        <p>Your Trusted Agricultural Machinery Rental Partner</p>
                    </div>
                    
                    <div class="auth-tabs">
                        <div class="auth-tab active" onclick="auth.switchTab('login')">Login</div>
                        <div class="auth-tab" onclick="auth.switchTab('signup')">Sign Up</div>
                    </div>

                    <div id="login-form">
                        <form onsubmit="auth.handleLogin(event)">
                            <div class="form-group">
                                <label for="login-email">Email</label>
                                <input type="email" id="login-email" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="login-password">Password</label>
                                <input type="password" id="login-password" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%;">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </button>
                        </form>
                    </div>

                    <div id="signup-form" style="display: none;">
                        <form onsubmit="auth.handleSignup(event)">
                            <div class="form-group">
                                <label for="signup-name">Full Name</label>
                                <input type="text" id="signup-name" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="signup-email">Email</label>
                                <input type="email" id="signup-email" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="signup-phone">Phone Number</label>
                                <input type="tel" id="signup-phone" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="signup-password">Password</label>
                                <input type="password" id="signup-password" class="form-control" required>
                            </div>
                            
                            <div class="user-type-selector">
                                <div class="user-type-card" onclick="auth.selectUserType('farmer')">
                                    <i class="fas fa-user"></i>
                                    <h4>Farmer</h4>
                                    <p>Rent machinery for your farm</p>
                                </div>
                                <div class="user-type-card" onclick="auth.selectUserType('owner')">
                                    <i class="fas fa-tractor"></i>
                                    <h4>Machinery Owner</h4>
                                    <p>Rent out your equipment</p>
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary" style="width: 100%;">
                                <i class="fas fa-user-plus"></i> Create Account
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    switchTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        
        if (tab === 'login') {
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('signup-form').style.display = 'none';
        } else {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('signup-form').style.display = 'block';
        }
    }

    selectUserType(type) {
        document.querySelectorAll('.user-type-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.target.closest('.user-type-card').classList.add('selected');
        this.selectedUserType = type;
    }

    handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            Utils.setCurrentUser(user);
            Utils.showNotification('Login successful!', 'success');
            this.showDashboard();
        } else {
            Utils.showNotification('Invalid email or password', 'error');
        }
    }

    handleSignup(event) {
        event.preventDefault();
        
        if (!this.selectedUserType) {
            Utils.showNotification('Please select user type', 'error');
            return;
        }

        const user = {
            id: Utils.generateId(),
            name: document.getElementById('signup-name').value,
            email: document.getElementById('signup-email').value,
            phone: document.getElementById('signup-phone').value,
            password: document.getElementById('signup-password').value,
            type: this.selectedUserType,
            joinedDate: new Date().toISOString(),
            isVerified: false
        };

        // Check if user already exists
        if (this.users.find(u => u.email === user.email)) {
            Utils.showNotification('User with this email already exists', 'error');
            return;
        }

        this.users.push(user);
        localStorage.setItem('raithaMithraUsers', JSON.stringify(this.users));
        
        this.currentUser = user;
        Utils.setCurrentUser(user);
        Utils.showNotification('Account created successfully!', 'success');
        this.showDashboard();
    }

    logout() {
        this.currentUser = null;
        Utils.removeCurrentUser();
        Utils.showNotification('Logged out successfully', 'success');
        this.showLogin();
    }

    showDashboard() {
        // This will be implemented in dashboard.js
        if (typeof dashboard !== 'undefined') {
            dashboard.show();
        }
    }
}

// Initialize auth manager
const auth = new AuthManager();