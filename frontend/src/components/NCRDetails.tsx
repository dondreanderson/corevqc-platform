<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCR Details - CoreVQC</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .status-badge {
            @apply px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide;
        }
        
        .status-open {
            @apply bg-red-100 text-red-800 border border-red-200;
        }
        
        .status-in-progress {
            @apply bg-blue-100 text-blue-800 border border-blue-200;
        }
        
        .status-resolved {
            @apply bg-green-100 text-green-800 border border-green-200;
        }
        
        .status-closed {
            @apply bg-gray-100 text-gray-800 border border-gray-200;
        }
        
        .severity-critical {
            @apply bg-red-100 text-red-800 border border-red-200;
        }
        
        .severity-high {
            @apply bg-orange-100 text-orange-800 border border-orange-200;
        }
        
        .severity-medium {
            @apply bg-yellow-100 text-yellow-800 border border-yellow-200;
        }
        
        .severity-low {
            @apply bg-gray-100 text-gray-800 border border-gray-200;
        }

        .card-hover {
            transition: all 0.3s ease;
        }
        
        .card-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .form-input {
            @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
        }

        .btn-primary {
            @apply bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2;
        }

        .btn-secondary {
            @apply bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2;
        }

        .btn-danger {
            @apply bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2;
        }

        .edit-mode .view-only {
            display: none;
        }

        .edit-mode .edit-only {
            display: block;
        }

        .view-only {
            display: block;
        }

        .edit-only {
            display: none;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="gradient-bg text-white py-6">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <button onclick="goBack()" class="text-white hover:text-gray-200 transition-colors">
                        <i class="fas fa-arrow-left text-xl"></i>
                    </button>
                    <div>
                        <nav class="flex items-center space-x-2 text-sm mb-2 opacity-90">
                            <a href="#" class="hover:underline">Dashboard</a>
                            <span>/</span>
                            <a href="#" class="hover:underline">Quality Control</a>
                            <span>/</span>
                            <span id="breadcrumbNCR">NCR Details</span>
                        </nav>
                        <h1 class="text-3xl font-bold" id="headerTitle">NCR-001 Details</h1>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="toggleEditMode()" id="editBtn" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2">
                        <i class="fas fa-edit"></i>
                        <span>Edit NCR</span>
                    </button>
                    <button onclick="deleteNCR()" class="bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2">
                        <i class="fas fa-trash"></i>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main NCR Information -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Basic Information -->
                <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                            <i class="fas fa-exclamation-triangle text-blue-600 mr-3"></i>
                            NCR Information
                        </h2>
                        <div class="flex items-center space-x-3">
                            <span id="statusBadge" class="status-badge status-open">Open</span>
                            <span id="severityBadge" class="status-badge severity-high">High</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">NCR Number</label>
                            <div class="view-only">
                                <p id="ncrNumber" class="text-lg font-semibold text-gray-900">NCR-001</p>
                            </div>
                            <div class="edit-only">
                                <input type="text" id="editNcrNumber" class="form-input" readonly value="NCR-001">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <div class="view-only">
                                <p id="category" class="text-gray-900">Quality</p>
                            </div>
                            <div class="edit-only">
                                <select id="editCategory" class="form-input">
                                    <option value="Quality">Quality</option>
                                    <option value="Safety">Safety</option>
                                    <option value="Process">Process</option>
                                    <option value="Material">Material</option>
                                    <option value="Environmental">Environmental</option>
                                    <option value="Documentation">Documentation</option>
                                </select>
                            </div>
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <div class="view-only">
                                <h3 id="title" class="text-xl font-semibold text-gray-900">Concrete strength test failure</h3>
                            </div>
                            <div class="edit-only">
                                <input type="text" id="editTitle" class="form-input" value="Concrete strength test failure">
                            </div>
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <div class="view-only">
                                <p id="description" class="text-gray-700 leading-relaxed">Concrete strength test results below specification requirements for foundation section A-3. Test results show 28-day compressive strength of 18 MPa against required 25 MPa minimum.</p>
                            </div>
                            <div class="edit-only">
                                <textarea id="editDescription" rows="4" class="form-input">Concrete strength test results below specification requirements for foundation section A-3. Test results show 28-day compressive strength of 18 MPa against required 25 MPa minimum.</textarea>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <div class="view-only">
                                <p id="location" class="text-gray-900 flex items-center">
                                    <i class="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                                    Foundation Block A-3
                                </p>
                            </div>
                            <div class="edit-only">
                                <input type="text" id="editLocation" class="form-input" value="Foundation Block A-3">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Reported By</label>
                            <div class="view-only">
                                <p id="reportedBy" class="text-gray-900 flex items-center">
                                    <i class="fas fa-user text-gray-400 mr-2"></i>
                                    John Smith
                                </p>
                            </div>
                            <div class="edit-only">
                                <input type="text" id="editReportedBy" class="form-input" value="John Smith" readonly>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Status & Resolution -->
                <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <i class="fas fa-cogs text-blue-600 mr-3"></i>
                        Status & Resolution
                    </h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <div class="view-only">
                                <span class="status-badge status-open">Open</span>
                            </div>
                            <div class="edit-only">
                                <select id="editStatus" class="form-input">
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                            <div class="view-only">
                                <span class="status-badge severity-high">High</span>
                            </div>
                            <div class="edit-only">
                                <select id="editSeverity" class="form-input">
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="CRITICAL">Critical</option>
                                </select>
                            </div>
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Root Cause</label>
                            <div class="view-only">
                                <p id="rootCause" class="text-gray-700">Improper concrete mix ratio during batching process</p>
                            </div>
                            <div class="edit-only">
                                <textarea id="editRootCause" rows="3" class="form-input">Improper concrete mix ratio during batching process</textarea>
                            </div>
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Corrective Action</label>
                            <div class="view-only">
                                <p id="correctiveAction" class="text-gray-700">Remove and replace affected concrete sections. Implement additional quality control measures for concrete batching.</p>
                            </div>
                            <div class="edit-only">
                                <textarea id="editCorrectiveAction" rows="3" class="form-input">Remove and replace affected concrete sections. Implement additional quality control measures for concrete batching.</textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Photos & Documents -->
                <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <i class="fas fa-camera text-blue-600 mr-3"></i>
                        Photos & Documents
                    </h2>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-gray-100 rounded-lg p-4 text-center">
                            <i class="fas fa-image text-4xl text-gray-400 mb-2"></i>
                            <p class="text-sm text-gray-600">Test Results.pdf</p>
                        </div>
                        <div class="bg-gray-100 rounded-lg p-4 text-center">
                            <i class="fas fa-image text-4xl text-gray-400 mb-2"></i>
                            <p class="text-sm text-gray-600">Site Photo 1.jpg</p>
                        </div>
                        <div class="bg-gray-100 rounded-lg p-4 text-center">
                            <i class="fas fa-image text-4xl text-gray-400 mb-2"></i>
                            <p class="text-sm text-gray-600">Site Photo 2.jpg</p>
                        </div>
                        <div class="edit-only border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                            <i class="fas fa-plus text-2xl text-gray-400 mb-2"></i>
                            <p class="text-sm text-gray-600">Add Photo</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Timeline -->
                <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <i class="fas fa-clock text-blue-600 mr-2"></i>
                        Timeline
                    </h3>
                    
                    <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <div class="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                            <div>
                                <p class="text-sm font-medium text-gray-900">NCR Created</p>
                                <p class="text-xs text-gray-500">Jan 5, 2025 at 10:30 AM</p>
                                <p class="text-xs text-gray-600">by John Smith</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start space-x-3">
                            <div class="w-3 h-3 bg-yellow-500 rounded-full mt-2"></div>
                            <div>
                                <p class="text-sm font-medium text-gray-900">Under Investigation</p>
                                <p class="text-xs text-gray-500">Jan 5, 2025 at 2:15 PM</p>
                                <p class="text-xs text-gray-600">by Sarah Johnson</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start space-x-3">
                            <div class="w-3 h-3 bg-gray-300 rounded-full mt-2"></div>
                            <div>
                                <p class="text-sm font-medium text-gray-400">Pending Resolution</p>
                                <p class="text-xs text-gray-400">Awaiting action</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Key Dates -->
                <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <i class="fas fa-calendar text-blue-600 mr-2"></i>
                        Key Dates
                    </h3>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Created Date</label>
                            <p class="text-sm text-gray-900">January 5, 2025</p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                            <div class="view-only">
                                <p id="dueDate" class="text-sm text-orange-600 font-medium">January 12, 2025</p>
                            </div>
                            <div class="edit-only">
                                <input type="date" id="editDueDate" class="form-input text-sm" value="2025-01-12">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Days Open</label>
                            <p class="text-sm text-red-600 font-medium">3 days</p>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    
                    <div class="space-y-3">
                        <div class="view-only space-y-3">
                            <button class="w-full btn-primary justify-center">
                                <i class="fas fa-check"></i>
                                <span>Mark Resolved</span>
                            </button>
                            <button class="w-full btn-secondary justify-center">
                                <i class="fas fa-user-plus"></i>
                                <span>Assign User</span>
                            </button>
                            <button class="w-full btn-secondary justify-center">
                                <i class="fas fa-download"></i>
                                <span>Export PDF</span>
                            </button>
                        </div>
                        
                        <div class="edit-only space-y-3">
                            <button onclick="saveNCR()" class="w-full btn-primary justify-center">
                                <i class="fas fa-save"></i>
                                <span>Save Changes</span>
                            </button>
                            <button onclick="cancelEdit()" class="w-full btn-secondary justify-center">
                                <i class="fas fa-times"></i>
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let editMode = false;
        
        // Sample NCR data
        const ncrData = {
            id: 'NCR-001',
            ncrNumber: 'NCR-001',
            title: 'Concrete strength test failure',
            description: 'Concrete strength test results below specification requirements for foundation section A-3. Test results show 28-day compressive strength of 18 MPa against required 25 MPa minimum.',
            status: 'OPEN',
            severity: 'HIGH',
            category: 'Quality',
            location: 'Foundation Block A-3',
            reportedBy: 'John Smith',
            rootCause: 'Improper concrete mix ratio during batching process',
            correctiveAction: 'Remove and replace affected concrete sections. Implement additional quality control measures for concrete batching.',
            dueDate: '2025-01-12',
            createdAt: '2025-01-05'
        };

        function toggleEditMode() {
            editMode = !editMode;
            const container = document.querySelector('.max-w-7xl');
            const editBtn = document.getElementById('editBtn');
            
            if (editMode) {
                container.classList.add('edit-mode');
                editBtn.innerHTML = '<i class="fas fa-eye"></i><span>View Mode</span>';
                editBtn.classList.remove('bg-white', 'bg-opacity-20', 'hover:bg-opacity-30');
                editBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
                
                // Populate edit fields
                populateEditFields();
            } else {
                container.classList.remove('edit-mode');
                editBtn.innerHTML = '<i class="fas fa-edit"></i><span>Edit NCR</span>';
                editBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
                editBtn.classList.add('bg-white', 'bg-opacity-20', 'hover:bg-opacity-30');
            }
        }

        function populateEditFields() {
            document.getElementById('editNcrNumber').value = ncrData.ncrNumber;
            document.getElementById('editTitle').value = ncrData.title;
            document.getElementById('editDescription').value = ncrData.description;
            document.getElementById('editCategory').value = ncrData.category;
            document.getElementById('editLocation').value = ncrData.location;
            document.getElementById('editReportedBy').value = ncrData.reportedBy;
            document.getElementById('editStatus').value = ncrData.status;
            document.getElementById('editSeverity').value = ncrData.severity;
            document.getElementById('editRootCause').value = ncrData.rootCause;
            document.getElementById('editCorrectiveAction').value = ncrData.correctiveAction;
            document.getElementById('editDueDate').value = ncrData.dueDate;
        }

        function saveNCR() {
            // Collect form data
            const updatedData = {
                ...ncrData,
                title: document.getElementById('editTitle').value,
                description: document.getElementById('editDescription').value,
                category: document.getElementById('editCategory').value,
                location: document.getElementById('editLocation').value,
                status: document.getElementById('editStatus').value,
                severity: document.getElementById('editSeverity').value,
                rootCause: document.getElementById('editRootCause').value,
                correctiveAction: document.getElementById('editCorrectiveAction').value,
                dueDate: document.getElementById('editDueDate').value
            };

            // Update display data
            Object.assign(ncrData, updatedData);
            updateDisplayData();
            
            // Exit edit mode
            toggleEditMode();
            
            // Show success message
            showNotification('NCR updated successfully!', 'success');
        }

        function cancelEdit() {
            toggleEditMode();
        }

        function updateDisplayData() {
            document.getElementById('title').textContent = ncrData.title;
            document.getElementById('description').textContent = ncrData.description;
            document.getElementById('category').textContent = ncrData.category;
            document.getElementById('location').innerHTML = `<i class="fas fa-map-marker-alt text-gray-400 mr-2"></i>${ncrData.location}`;
            document.getElementById('rootCause').textContent = ncrData.rootCause;
            document.getElementById('correctiveAction').textContent = ncrData.correctiveAction;
            document.getElementById('dueDate').textContent = formatDate(ncrData.dueDate);
            
            // Update badges
            updateStatusBadge();
            updateSeverityBadge();
        }

        function updateStatusBadge() {
            const badge = document.getElementById('statusBadge');
            badge.className = `status-badge status-${ncrData.status.toLowerCase().replace('_', '-')}`;
            badge.textContent = ncrData.status.replace('_', ' ');
        }

        function updateSeverityBadge() {
            const badge = document.getElementById('severityBadge');
            badge.className = `status-badge severity-${ncrData.severity.toLowerCase()}`;
            badge.textContent = ncrData.severity;
        }

        function deleteNCR() {
            if (confirm('Are you sure you want to delete this NCR? This action cannot be undone.')) {
                showNotification('NCR deleted successfully!', 'success');
                setTimeout(() => {
                    goBack();
                }, 1500);
            }
        }

        function goBack() {
            // In a real app, this would navigate back
            window.history.back();
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-semibold z-50 ${
                type === 'success' ? 'bg-green-600' : 
                type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            updateDisplayData();
        });
    </script>
<script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"rayId":"95a952c2f876a3ba","serverTiming":{"name":{"cfExtPri":true,"cfEdge":true,"cfOrigin":true,"cfL4":true,"cfSpeedBrain":true,"cfCacheStatus":true}},"version":"2025.6.2","token":"4edd5f8ec12a48cfa682ab8261b80a79"}' crossorigin="anonymous"></script>
</body>
</html>
    <script id="html_badge_script1">
        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDtFrrvLF08orYqcKP79qEuap3kAZsbBNMeQrstaPQjQW1MJhUy14JAKyNchv%2Bq%2F2LYCLJjJQJ0hFrzA7K2P%2FMOos5MuMXNLhuyw%2FQGA%2F7buOL3J4G84zopeSoH0fhTIZUAEUFCrTzHm9FHaflDFdcLDjzH64Ahzrmx%2Fv1flc3PGv%2FqXJwUnDQTAnsAhd1%2FGOqhDFj0%2BCrYE5%2F0w6dfBd%2Fn%2FLnJfGv3Tcs%2FdmmDD089Cx9%2FuIJUhdE20PLTu9P18K94boZS%2FrGxNRQ25cWljnesPvAicbNtMplKh7D2HjcXP4mXTDm8XTp1AtEnOm9Q7p7DaqYFbggPzBxBINCg1qLWjSuc7M62g8pas0gxxuIIaxlgerXqwgj3XlQskay2HYCIi51zIAfklTW2f5lfEyTf4y72ULJvN7Fjxncvw3I6oz51VKZLDo%2FpaVSBSGxf8AEXIZ95JicdoW1LiVNP82D6NIW6LMpJViHZT%2FKx8Wot6RHPMrAzrWgHcwAmkRxnRaU%2BTgdTTkqpvaUJHBhhD5vgLC3RbznYdTMhfR2xVrVajC";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDtFrrvLF08orYqcKP79qEuap3kAZsbBNMeQrstaPQjQW1MJhUy14JAKyNchv+q/2LYCLJjJQJ0hFrzA7K2P/MOos5MuMXNLhuyw/QGA/7buOL3J4G84zopeSoH0fhTIZUAEUFCrTzHm9FHaflDFdcLDjzH64Ahzrmx/v1flc3PGv/qXJwUnDQTAnsAhd1/GOqhDFj0+CrYE5/0w6dfBd/n/LnJfGv3Tcs/dmmDD089Cx9/uIJUhdE20PLTu9P18K94boZS/rGxNRQ25cWljnesPvAicbNtMplKh7D2HjcXP4mXTDm8XTp1AtEnOm9Q7p7DaqYFbggPzBxBINCg1qLWjSuc7M62g8pas0gxxuIIaxlgerXqwgj3XlQskay2HYCIi51zIAfklTW2f5lfEyTf4y72ULJvN7Fjxncvw3I6oz51VKZLDo/paVSBSGxf8AEXIZ95JicdoW1LiVNP82D6NIW6LMpJViHZT/Kx8Wot6RHPMrAzrWgHcwAmkRxnRaU+TgdTTkqpvaUJHBhhD5vgLC3RbznYdTMhfR2xVrVajC";
    </script>
    
    <script id="html_notice_dialog_script" src="https://www.genspark.ai/notice_dialog.js"></script>
    