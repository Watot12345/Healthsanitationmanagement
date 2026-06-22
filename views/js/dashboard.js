// Get user data from localStorage
const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
const token = localStorage.getItem('session_token');

// Redirect if not logged in
if (!userData.username) {
    window.location.href = 'login.html';
}

// Check if admin
const isAdmin = userData.role === 'admin';

// Display user info
document.getElementById('userDisplay').textContent = 
    'Welcome, ' + (userData.full_name || userData.username);

// Show role badge
const roleBadge = document.getElementById('roleBadge');
if (isAdmin) {
    roleBadge.textContent = 'ADMIN';
    roleBadge.className = 'mr-4 px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white';
} else {
    roleBadge.textContent = 'STAFF';
    roleBadge.className = 'mr-4 px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white';
}

// Initialize dashboard
function initDashboard() {
    if (isAdmin) {
        document.getElementById('adminMenu').classList.remove('hidden');
        document.getElementById('adminDashboardHome').classList.remove('hidden');
        document.getElementById('staffMenu').classList.add('hidden');
        document.getElementById('staffDashboardHome').classList.add('hidden');
        
        loadAdminStats();
        loadRecentStaff();
    } else {
        document.getElementById('staffMenu').classList.remove('hidden');
        document.getElementById('staffDashboardHome').classList.remove('hidden');
        document.getElementById('adminMenu').classList.add('hidden');
        document.getElementById('adminDashboardHome').classList.add('hidden');
        
        loadStaffModules();
        loadStaffDashboard();
    }
}

// Show Dashboard Home
function showDashboard() {
    document.getElementById('moduleContent').innerHTML = '';
    if (isAdmin) {
        document.getElementById('adminDashboardHome').classList.remove('hidden');
        document.getElementById('staffDashboardHome').classList.add('hidden');
        loadAdminStats();
        loadRecentStaff();
    } else {
        document.getElementById('staffDashboardHome').classList.remove('hidden');
        document.getElementById('adminDashboardHome').classList.add('hidden');
    }
}

// Load admin stats (UPDATED for new KPI IDs)
async function loadAdminStats() {
    try {
        const response = await fetch('../api/get-stats.php', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalStaffCount').textContent = data.total_staff || 0;
            document.getElementById('deptCount').textContent = data.departments || 0;
            document.getElementById('activeStaffCount').textContent = data.active_staff || 0;
        }
    } catch (error) {
        document.getElementById('totalStaffCount').textContent = '1';
        document.getElementById('deptCount').textContent = '6';
        document.getElementById('activeStaffCount').textContent = '1';
    }
}

// Load recent staff
async function loadRecentStaff() {
    try {
        const response = await fetch('../api/get-recent-staff.php', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await response.json();
        
        if (data.success && data.staff.length > 0) {
            document.getElementById('recentStaffList').innerHTML = data.staff.map(staff => `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                        <div class="font-medium">
                            ${staff.full_name}
                            ${staff.role === 'admin' ? '👑' : ''}
                        </div>
                        <div class="text-sm text-gray-500">${staff.department || 'N/A'}</div>
                    </div>
                    <span class="text-xs text-gray-500">${staff.role}</span>
                </div>
            `).join('');
        } else {
            document.getElementById('recentStaffList').innerHTML = 
                '<p class="text-gray-500 text-center py-4">No staff members yet</p>';
        }
    } catch (error) {
        document.getElementById('recentStaffList').innerHTML = 
            '<p class="text-gray-500 text-center py-4">Unable to load staff</p>';
    }
}

// Show module
function showModule(module) {
    document.getElementById('adminDashboardHome').classList.add('hidden');
    document.getElementById('staffDashboardHome').classList.add('hidden');
    
    const content = document.getElementById('moduleContent');
    
    if (module === 'staff-management') {
        loadStaffManagement();
    } else if (module === 'health-center') {
        content.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-xl font-bold mb-4">🏥 Health Center Services</h3>
                <p class="text-gray-600 mb-4">Manage patient records, appointments, and health services.</p>
                <div class="grid grid-cols-2 gap-4">
                    <div class="border rounded p-4 hover:bg-gray-50 cursor-pointer">
                        <h4 class="font-bold">Patient Records</h4>
                        <p class="text-sm text-gray-500">View and manage patient information</p>
                    </div>
                    <div class="border rounded p-4 hover:bg-gray-50 cursor-pointer">
                        <h4 class="font-bold">Appointments</h4>
                        <p class="text-sm text-gray-500">Schedule and track appointments</p>
                    </div>
                </div>
            </div>
        `;
    } else if (module === 'sanitation') {
        content.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-xl font-bold mb-4">🔍 Sanitation Permit & Inspection</h3>
                <p class="text-gray-600 mb-4">Issue permits and manage sanitation inspections.</p>
                <div class="grid grid-cols-2 gap-4">
                    <div class="border rounded p-4 hover:bg-gray-50 cursor-pointer">
                        <h4 class="font-bold">Permits</h4>
                        <p class="text-sm text-gray-500">Issue and manage permits</p>
                    </div>
                    <div class="border rounded p-4 hover:bg-gray-50 cursor-pointer">
                        <h4 class="font-bold">Inspections</h4>
                        <p class="text-sm text-gray-500">Schedule and record inspections</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Coming soon modules
        const titles = {
            'immunization': '💉 Immunization & Nutrition',
            'wastewater': '🚰 Wastewater & Septic',
            'surveillance': '📈 Health Surveillance'
        };
        content.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow text-center py-12">
                <div class="text-4xl mb-4">🚧</div>
                <h3 class="text-xl font-bold mb-2">${titles[module] || 'Module'}</h3>
                <p class="text-gray-500">This module is under development.</p>
                <p class="text-sm text-gray-400 mt-2">Coming in next update</p>
            </div>
        `;
    }
}

// Check if current admin
function isCurrentAdmin(username) {
    return username === userData.username;
}

// Load staff management
async function loadStaffManagement() {
    const content = document.getElementById('moduleContent');
    content.innerHTML = '<div class="bg-white p-6 rounded-lg shadow"><p>Loading staff list...</p></div>';
    
    try {
        const response = await fetch('../api/get-staff.php', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await response.json();
        
        if (data.success) {
            const rows = data.staff.map(staff => {
                const isCurrentUser = isCurrentAdmin(staff.username);
                return `
                    <tr class="${isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}">
                        <td class="px-4 py-3">
                            <div class="font-medium">
                                ${staff.full_name}
                                ${isCurrentUser ? '<span class="ml-2 text-xs bg-yellow-400 px-2 py-0.5 rounded-full font-bold">YOU</span>' : ''}
                            </div>
                            <div class="text-xs text-gray-500">${staff.email}</div>
                        </td>
                        <td class="px-4 py-3">${staff.department || 'N/A'}</td>
                        <td class="px-4 py-3">
                            <span class="px-2 py-1 text-xs rounded-full ${staff.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}">
                                ${staff.role === 'admin' ? '👑 Admin' : staff.role.replace('_', ' ')}
                            </span>
                        </td>
                        <td class="px-4 py-3">
                            <span class="px-2 py-1 text-xs rounded-full ${staff.is_active == 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                ${staff.is_active == 1 ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td class="px-4 py-3">
                            ${isCurrentUser ? 
                                '<span class="text-xs text-gray-400 italic">🔒 Protected</span>' : 
                                `<button onclick="toggleStaffStatus(${staff.id}, '${staff.username}')" class="text-sm text-red-600 hover:underline">
                                    ${staff.is_active == 1 ? 'Deactivate' : 'Activate'}
                                </button>`
                            }
                        </td>
                    </tr>
                `;
            }).join('');
            
            content.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold">👥 Staff Management</h3>
                        <button onclick="openAddStaffModal()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                            + Add Staff
                        </button>
                    </div>
                    
                    <div class="bg-yellow-50 border border-yellow-200 p-3 rounded mb-4 text-sm text-yellow-800">
                        ⚠️ Your admin account is protected and cannot be modified.
                    </div>
                    
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-2 text-left text-sm">Name</th>
                                <th class="px-4 py-2 text-left text-sm">Department</th>
                                <th class="px-4 py-2 text-left text-sm">Role</th>
                                <th class="px-4 py-2 text-left text-sm">Status</th>
                                <th class="px-4 py-2 text-left text-sm">Action</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
                
                <div id="addStaffModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 class="text-lg font-bold mb-4">Add New Staff</h3>
                        <form id="addStaffForm" class="space-y-3">
                            <input type="text" id="staffName" placeholder="Full Name" class="w-full border rounded px-3 py-2" required>
                            <input type="text" id="staffUsername" placeholder="Username" class="w-full border rounded px-3 py-2" required>
                            <input type="email" id="staffEmail" placeholder="Email" class="w-full border rounded px-3 py-2" required>
                            <select id="staffDept" class="w-full border rounded px-3 py-2" required>
                                <option value="">Department</option>
                                <option value="HCS">Health Center Services</option>
                                <option value="SNI">Sanitation & Inspection</option>
                                <option value="IMN">Immunization & Nutrition</option>
                                <option value="WWM">Wastewater Management</option>
                                <option value="HSV">Health Surveillance</option>
                                <option value="ADM">Administration</option>
                            </select>
                            <select id="staffRoleSelect" class="w-full border rounded px-3 py-2" required>
                                <option value="">Role</option>
                                <option value="health_officer">Health Officer</option>
                                <option value="sanitation_inspector">Sanitation Inspector</option>
                                <option value="nurse">Nurse</option>
                                <option value="staff">Staff</option>
                            </select>
                            <div class="flex justify-end space-x-3 pt-3">
                                <button type="button" onclick="closeAddStaffModal()" class="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            
            document.getElementById('addStaffForm').addEventListener('submit', createStaff);
        }
    } catch (error) {
        content.innerHTML = '<div class="bg-white p-6 rounded-lg shadow"><p class="text-red-600">Error loading staff list</p></div>';
    }
}

// Create staff
async function createStaff(e) {
    e.preventDefault();
    
    const data = {
        full_name: document.getElementById('staffName').value,
        username: document.getElementById('staffUsername').value,
        email: document.getElementById('staffEmail').value,
        department: document.getElementById('staffDept').value,
        role: document.getElementById('staffRoleSelect').value
    };
    
    try {
        const response = await fetch('../api/create-staff.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ Staff created!\nTemp Password: ' + result.temp_password);
            closeAddStaffModal();
            loadStaffManagement();
            loadAdminStats();
            loadRecentStaff();
        } else {
            alert('❌ ' + result.message);
        }
    } catch (error) {
        alert('Error creating staff');
    }
}

// Toggle staff status
async function toggleStaffStatus(userId, username) {
    if (isCurrentAdmin(username)) {
        alert('⚠️ Cannot modify your own account!');
        return;
    }
    
    if (!confirm('Toggle staff status?')) return;
    
    try {
        await fetch('../api/deactivate-staff.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ user_id: userId })
        });
        loadStaffManagement();
        loadAdminStats();
    } catch (error) {
        alert('Error updating staff');
    }
}

// Modal functions
function openAddStaffModal() {
    document.getElementById('addStaffModal').classList.remove('hidden');
}

function closeAddStaffModal() {
    document.getElementById('addStaffModal').classList.add('hidden');
}

// Load staff modules
function loadStaffModules() {
    const moduleMap = {
        'health_officer': [
            { id: 'health-center', name: '🏥 Health Center' },
            { id: 'immunization', name: '💉 Immunization' }
        ],
        'sanitation_inspector': [
            { id: 'sanitation', name: '🔍 Sanitation' },
            { id: 'wastewater', name: '🚰 Wastewater' }
        ],
        'nurse': [
            { id: 'immunization', name: '💉 Immunization' },
            { id: 'health-center', name: '🏥 Health Center' }
        ],
        'staff': [
            { id: 'health-center', name: '🏥 Health Center' }
        ]
    };
    
    const modules = moduleMap[userData.role] || [];
    document.getElementById('staffModuleLinks').innerHTML = modules.map(m => 
        `<a href="#" onclick="showModule('${m.id}')" class="block p-2 hover:bg-blue-50 rounded">${m.name}</a>`
    ).join('');
}

// Load staff dashboard
function loadStaffDashboard() {
    document.getElementById('staffDepartment').textContent = userData.department || 'N/A';
    document.getElementById('staffRole').textContent = userData.role.replace('_', ' ');
    
    const moduleMap = {
        'health_officer': [
            { id: 'health-center', name: '🏥 Health Center' },
            { id: 'immunization', name: '💉 Immunization' }
        ],
        'sanitation_inspector': [
            { id: 'sanitation', name: '🔍 Sanitation' },
            { id: 'wastewater', name: '🚰 Wastewater' }
        ],
        'nurse': [
            { id: 'immunization', name: '💉 Immunization' },
            { id: 'health-center', name: '🏥 Health Center' }
        ],
        'staff': [
            { id: 'health-center', name: '🏥 Health Center' }
        ]
    };
    
    const modules = moduleMap[userData.role] || [];
    document.getElementById('staffQuickLinks').innerHTML = modules.map(m => 
        `<a href="#" onclick="showModule('${m.id}')" class="block p-3 bg-gray-50 rounded hover:bg-blue-50">${m.name}</a>`
    ).join('');
}

// Logout
async function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Start
initDashboard();