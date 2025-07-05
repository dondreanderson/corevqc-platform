<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quality Control Dashboard - CoreVQC</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .card-hover {
            transition: all 0.3s ease;
        }
        
        .card-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .status-open {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        .status-in-progress {
            background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }
        
        .status-resolved {
            background-color: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .status-closed {
            background-color: rgba(156, 163, 175, 0.1);
            color: #6b7280;
            border: 1px solid rgba(156, 163, 175, 0.3);
        }
        
        .severity-critical {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }
        
        .severity-high {
            background-color: rgba(251, 191, 36, 0.1);
            color: #f59e0b;
        }
        
        .severity-medium {
            background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }
        
        .severity-low {
            background-color: rgba(156, 163, 175, 0.1);
            color: #6b7280;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
        }
        
        .modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .chart-container {
            position: relative;
            height: 300px;
            width: 100%;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s ease;
            border: none;
            cursor: pointer;
        }
        
        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s ease;
            border: 1px solid #d1d5db;
            cursor: pointer;
        }
        
        .btn-secondary:hover {
            background: #e5e7eb;
            transform: translateY(-1px);
        }
        
        .input-group {
            margin-bottom: 1rem;
        }
        
        .input-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #374151;
        }
        
        .input-group input,
        .input-group select,
        .input-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 0.875rem;
        }
        
        .input-group input:focus,
        .input-group select:focus,
        .input-group textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <div class="gradient-bg text-white py-8">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex items-center justify-between">
                <div>
                    <nav class="flex items-center space-x-2 text-sm mb-4 opacity-90">
                        <a href="#" class="hover:underline">Dashboard</a>
                        <span>/</span>
                        <span>Quality Control</span>
                    </nav>
                    <h1 class="text-4xl font-bold mb-2">Quality Control Dashboard</h1>
                    <p class="text-lg opacity-90">Non-Conformance Reports & Quality Metrics</p>
                </div>
                <button onclick="openCreateNCRModal()" class="btn-primary flex items-center space-x-2">
                    <i class="fas fa-plus"></i>
                    <span>Create NCR</span>
                </button>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Quality Metrics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg p-6 shadow-sm card-hover">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Total NCRs</p>
                        <p class="text-3xl font-bold text-gray-900" id="totalNCRs">24</p>
                    </div>
                    <div class="p-3 bg-blue-100 rounded-lg">
                        <i class="fas fa-exclamation-triangle text-blue-600 text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg p-6 shadow-sm card-hover">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Open NCRs</p>
                        <p class="text-3xl font-bold text-red-600" id="openNCRs">8</p>
                    </div>
                    <div class="p-3 bg-red-100 rounded-lg">
                        <i class="fas fa-clock text-red-600 text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg p-6 shadow-sm card-hover">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Resolved NCRs</p>
                        <p class="text-3xl font-bold text-green-600" id="resolvedNCRs">14</p>
                    </div>
                    <div class="p-3 bg-green-100 rounded-lg">
                        <i class="fas fa-check-circle text-green-600 text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg p-6 shadow-sm card-hover">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Quality Score</p>
                        <p class="text-3xl font-bold text-purple-600" id="qualityScore">87%</p>
                    </div>
                    <div class="p-3 bg-purple-100 rounded-lg">
                        <i class="fas fa-award text-purple-600 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">NCR Status Distribution</h3>
                <div class="chart-container">
                    <canvas id="statusChart"></canvas>
                </div>
            </div>

            <div class="bg-white rounded-lg p-6 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">NCR Severity Breakdown</h3>
                <div class="chart-container">
                    <canvas id="severityChart"></canvas>
                </div>
            </div>
        </div>

        <!-- NCR Management Section -->
        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-900">Non-Conformance Reports</h2>
                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <input type="text" id="searchNCR" placeholder="Search NCRs..." 
                                   class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        </div>
                        <select id="statusFilter" class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">All Status</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                        <select id="severityFilter" class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">All Severity</option>
                            <option value="CRITICAL">Critical</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div id="ncrList" class="divide-y divide-gray-200">
                <!-- NCR items will be dynamically inserted here -->
            </div>
        </div>
    </div>

    <!-- Create NCR Modal -->
    <div id="createNCRModal" class="modal">
        <div class="modal-content">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Create New NCR</h2>
                <button onclick="closeCreateNCRModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <form id="createNCRForm">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="input-group">
                        <label for="ncrTitle">NCR Title *</label>
                        <input type="text" id="ncrTitle" name="title" required>
                    </div>

                    <div class="input-group">
                        <label for="ncrCategory">Category *</label>
                        <select id="ncrCategory" name="category" required>
                            <option value="">Select Category</option>
                            <option value="Material">Material</option>
                            <option value="Workmanship">Workmanship</option>
                            <option value="Design">Design</option>
                            <option value="Safety">Safety</option>
                            <option value="Environmental">Environmental</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label for="ncrSeverity">Severity *</label>
                        <select id="ncrSeverity" name="severity" required>
                            <option value="">Select Severity</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label for="ncrLocation">Location</label>
                        <input type="text" id="ncrLocation" name="location" placeholder="e.g., Building A, Floor 3">
                    </div>
                </div>

                <div class="input-group">
                    <label for="ncrDescription">Description *</label>
                    <textarea id="ncrDescription" name="description" rows="4" required placeholder="Detailed description of the non-conformance..."></textarea>
                </div>

                <div class="input-group">
                    <label for="ncrDueDate">Due Date</label>
                    <input type="date" id="ncrDueDate" name="dueDate">
                </div>

                <div class="flex items-center justify-end space-x-4 pt-4">
                    <button type="button" onclick="closeCreateNCRModal()" class="btn-secondary">Cancel</button>
                    <button type="submit" class="btn-primary">Create NCR</button>
                </div>
            </form>
        </div>
    </div>

    <!-- NCR Details Modal -->
    <div id="ncrDetailsModal" class="modal">
        <div class="modal-content max-w-4xl">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900" id="ncrDetailsTitle">NCR Details</h2>
                <button onclick="closeNCRDetailsModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div id="ncrDetailsContent">
                <!-- NCR details will be loaded here -->
            </div>
        </div>
    </div>

    <script>
        // Sample NCR data
        let ncrData = [
            {
                id: 'NCR-001',
                ncrNumber: 'NCR-001',
                title: 'Concrete strength test failure',
                description: 'Concrete strength test results below specification requirements for foundation section A-3.',
                severity: 'HIGH',
                status: 'OPEN',
                category: 'Material',
                location: 'Building A, Foundation Section A-3',
                reportedBy: 'John Smith',
                dueDate: '2025-01-15',
                createdAt: '2025-01-05T10:30:00Z',
                correctiveAction: '',
                rootCause: ''
            },
            {
                id: 'NCR-002',
                ncrNumber: 'NCR-002',
                title: 'Welding defect in structural beam',
                description: 'Incomplete penetration welding detected in structural beam connection at grid line B-5.',
                severity: 'CRITICAL',
                status: 'IN_PROGRESS',
                category: 'Workmanship',
                location: 'Building B, Level 2, Grid B-5',
                reportedBy: 'Sarah Johnson',
                dueDate: '2025-01-10',
                createdAt: '2025-01-03T14:15:00Z',
                correctiveAction: 'Re-welding scheduled with certified welder',
                rootCause: 'Insufficient welder qualification verification'
            },
            {
                id: 'NCR-003',
                ncrNumber: 'NCR-003',
                title: 'Improper rebar spacing',
                description: 'Rebar spacing does not meet design specifications in slab area C-2.',
                severity: 'MEDIUM',
                status: 'RESOLVED',
                category: 'Design',
                location: 'Building C, Slab Area C-2',
                reportedBy: 'Mike Davis',
                dueDate: '2025-01-12',
                createdAt: '2025-01-02T09:20:00Z',
                correctiveAction: 'Rebar repositioned to meet specifications',
                rootCause: 'Misinterpretation of drawing dimensions'
            },
            {
                id: 'NCR-004',
                ncrNumber: 'NCR-004',
                title: 'Missing safety barriers',
                description: 'Safety barriers not installed at edge protection points on level 5.',
                severity: 'HIGH',
                status: 'CLOSED',
                category: 'Safety',
                location: 'All Buildings, Level 5',
                reportedBy: 'Lisa Chen',
                dueDate: '2025-01-08',
                createdAt: '2025-01-01T16:45:00Z',
                correctiveAction: 'Safety barriers installed as per safety protocol',
                rootCause: 'Delayed material delivery'
            }
        ];

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            updateMetrics();
            renderCharts();
            renderNCRList();
            setupEventListeners();
        });

        function updateMetrics() {
            const totalNCRs = ncrData.length;
            const openNCRs = ncrData.filter(ncr => ncr.status === 'OPEN' || ncr.status === 'IN_PROGRESS').length;
            const resolvedNCRs = ncrData.filter(ncr => ncr.status === 'RESOLVED' || ncr.status === 'CLOSED').length;
            const qualityScore = Math.round((resolvedNCRs / totalNCRs) * 100);

            document.getElementById('totalNCRs').textContent = totalNCRs;
            document.getElementById('openNCRs').textContent = openNCRs;
            document.getElementById('resolvedNCRs').textContent = resolvedNCRs;
            document.getElementById('qualityScore').textContent = qualityScore + '%';
        }

        function renderCharts() {
            // Status Distribution Chart
            const statusCtx = document.getElementById('statusChart').getContext('2d');
            const statusData = {
                'OPEN': ncrData.filter(ncr => ncr.status === 'OPEN').length,
                'IN_PROGRESS': ncrData.filter(ncr => ncr.status === 'IN_PROGRESS').length,
                'RESOLVED': ncrData.filter(ncr => ncr.status === 'RESOLVED').length,
                'CLOSED': ncrData.filter(ncr => ncr.status === 'CLOSED').length
            };

            new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
                    datasets: [{
                        data: Object.values(statusData),
                        backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#6b7280'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });

            // Severity Distribution Chart
            const severityCtx = document.getElementById('severityChart').getContext('2d');
            const severityData = {
                'CRITICAL': ncrData.filter(ncr => ncr.severity === 'CRITICAL').length,
                'HIGH': ncrData.filter(ncr => ncr.severity === 'HIGH').length,
                'MEDIUM': ncrData.filter(ncr => ncr.severity === 'MEDIUM').length,
                'LOW': ncrData.filter(ncr => ncr.severity === 'LOW').length
            };

            new Chart(severityCtx, {
                type: 'bar',
                data: {
                    labels: ['Critical', 'High', 'Medium', 'Low'],
                    datasets: [{
                        label: 'NCR Count',
                        data: Object.values(severityData),
                        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#6b7280'],
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }

        function renderNCRList(filteredData = ncrData) {
            const ncrList = document.getElementById('ncrList');
            ncrList.innerHTML = '';

            if (filteredData.length === 0) {
                ncrList.innerHTML = `
                    <div class="p-8 text-center text-gray-500">
                        <i class="fas fa-search text-4xl mb-4"></i>
                        <p class="text-lg">No NCRs found matching your criteria</p>
                    </div>
                `;
                return;
            }

            filteredData.forEach(ncr => {
                const ncrCard = document.createElement('div');
                ncrCard.className = 'p-6 hover:bg-gray-50 cursor-pointer';
                ncrCard.onclick = () => showNCRDetails(ncr);
                
                ncrCard.innerHTML = `
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-2">
                                <h3 class="text-lg font-semibold text-gray-900">${ncr.ncrNumber}</h3>
                                <span class="status-badge status-${ncr.status.toLowerCase().replace('_', '-')}">${ncr.status.replace('_', ' ')}</span>
                                <span class="status-badge severity-${ncr.severity.toLowerCase()}">${ncr.severity}</span>
                            </div>
                            <h4 class="text-md font-medium text-gray-800 mb-2">${ncr.title}</h4>
                            <p class="text-gray-600 mb-3 line-clamp-2">${ncr.description}</p>
                            <div class="flex items-center space-x-6 text-sm text-gray-500">
                                <span><i class="fas fa-map-marker-alt mr-1"></i> ${ncr.location}</span>
                                <span><i class="fas fa-user mr-1"></i> ${ncr.reportedBy}</span>
                                <span><i class="fas fa-calendar mr-1"></i> ${formatDate(ncr.createdAt)}</span>
                                ${ncr.dueDate ? `<span class="text-orange-600"><i class="fas fa-clock mr-1"></i> Due: ${formatDate(ncr.dueDate)}</span>` : ''}
                            </div>
                        </div>
                        <div class="flex items-center space-x-2 ml-4">
                            <button onclick="editNCR('${ncr.id}'); event.stopPropagation();" class="text-blue-600 hover:text-blue-800">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteNCR('${ncr.id}'); event.stopPropagation();" class="text-red-600 hover:text-red-800">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                ncrList.appendChild(ncrCard);
            });
        }

        function setupEventListeners() {
            // Search functionality
            document.getElementById('searchNCR').addEventListener('input', filterNCRs);
            
            // Filter functionality
            document.getElementById('statusFilter').addEventListener('change', filterNCRs);
            document.getElementById('severityFilter').addEventListener('change', filterNCRs);
            
            // Create NCR form
            document.getElementById('createNCRForm').addEventListener('submit', function(e) {
                e.preventDefault();
                createNCR();
            });
        }

        function filterNCRs() {
            const searchTerm = document.getElementById('searchNCR').value.toLowerCase();
            const statusFilter = document.getElementById('statusFilter').value;
            const severityFilter = document.getElementById('severityFilter').value;

            let filteredData = ncrData.filter(ncr => {
                const matchesSearch = ncr.title.toLowerCase().includes(searchTerm) ||
                                    ncr.description.toLowerCase().includes(searchTerm) ||
                                    ncr.ncrNumber.toLowerCase().includes(searchTerm) ||
                                    ncr.location.toLowerCase().includes(searchTerm);
                
                const matchesStatus = !statusFilter || ncr.status === statusFilter;
                const matchesSeverity = !severityFilter || ncr.severity === severityFilter;

                return matchesSearch && matchesStatus && matchesSeverity;
            });

            renderNCRList(filteredData);
        }

        function openCreateNCRModal() {
            document.getElementById('createNCRModal').classList.add('show');
        }

        function closeCreateNCRModal() {
            document.getElementById('createNCRModal').classList.remove('show');
            document.getElementById('createNCRForm').reset();
        }

        function createNCR() {
            const formData = new FormData(document.getElementById('createNCRForm'));
            const newNCR = {
                id: 'NCR-' + String(ncrData.length + 1).padStart(3, '0'),
                ncrNumber: 'NCR-' + String(ncrData.length + 1).padStart(3, '0'),
                title: formData.get('title'),
                description: formData.get('description'),
                severity: formData.get('severity'),
                status: 'OPEN',
                category: formData.get('category'),
                location: formData.get('location') || 'Not specified',
                reportedBy: 'Current User',
                dueDate: formData.get('dueDate'),
                createdAt: new Date().toISOString(),
                correctiveAction: '',
                rootCause: ''
            };

            ncrData.unshift(newNCR);
            updateMetrics();
            renderCharts();
            renderNCRList();
            closeCreateNCRModal();
            
            // Show success message
            alert('NCR created successfully!');
        }

        function showNCRDetails(ncr) {
            const modal = document.getElementById('ncrDetailsModal');
            const content = document.getElementById('ncrDetailsContent');
            
            content.innerHTML = `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-4">NCR Information</h3>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">NCR Number</label>
                                <p class="text-gray-900">${ncr.ncrNumber}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Title</label>
                                <p class="text-gray-900">${ncr.title}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Description</label>
                                <p class="text-gray-900">${ncr.description}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Category</label>
                                <p class="text-gray-900">${ncr.category}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Location</label>
                                <p class="text-gray-900">${ncr.location}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Reported By</label>
                                <p class="text-gray-900">${ncr.reportedBy}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Status & Actions</h3>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Status</label>
                                <span class="status-badge status-${ncr.status.toLowerCase().replace('_', '-')}">${ncr.status.replace('_', ' ')}</span>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Severity</label>
                                <span class="status-badge severity-${ncr.severity.toLowerCase()}">${ncr.severity}</span>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Created Date</label>
                                <p class="text-gray-900">${formatDate(ncr.createdAt)}</p>
                            </div>
                            ${ncr.dueDate ? `
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Due Date</label>
                                <p class="text-gray-900">${formatDate(ncr.dueDate)}</p>
                            </div>
                            ` : ''}
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Root Cause</label>
                                <p class="text-gray-900">${ncr.rootCause || 'Not determined'}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Corrective Action</label>
                                <p class="text-gray-900">${ncr.correctiveAction || 'No action taken'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                    <button onclick="closeNCRDetailsModal()" class="btn-secondary">Close</button>
                    <button onclick="editNCR('${ncr.id}')" class="btn-primary">Edit NCR</button>
                </div>
            `;
            
            modal.classList.add('show');
        }

        function closeNCRDetailsModal() {
            document.getElementById('ncrDetailsModal').classList.remove('show');
        }

        function editNCR(id) {
            alert('Edit functionality would open an edit modal for NCR: ' + id);
            closeNCRDetailsModal();
        }

        function deleteNCR(id) {
            if (confirm('Are you sure you want to delete this NCR?')) {
                ncrData = ncrData.filter(ncr => ncr.id !== id);
                updateMetrics();
                renderCharts();
                renderNCRList();
            }
        }

        function formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            const createModal = document.getElementById('createNCRModal');
            const detailsModal = document.getElementById('ncrDetailsModal');
            
            if (event.target === createModal) {
                closeCreateNCRModal();
            }
            if (event.target === detailsModal) {
                closeNCRDetailsModal();
            }
        });
    </script>
<script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"rayId":"95a8782a1e0fa5ba","serverTiming":{"name":{"cfExtPri":true,"cfEdge":true,"cfOrigin":true,"cfL4":true,"cfSpeedBrain":true,"cfCacheStatus":true}},"version":"2025.6.2","token":"4edd5f8ec12a48cfa682ab8261b80a79"}' crossorigin="anonymous"></script>
</body>
</html>
    <script id="html_badge_script1">
        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDvxBIPkKZBkfarshPsCZGLUzAgcO0UvZ6nXQAgHW60DLGGL3lop0gSvpH5k4RLCfigdO%2Baq%2FsS3vpImjFgfj1QJtnnHNrsixDzI%2Br9lVhAWVn%2ByIlAJX0vxmUNiJ%2BoLOlGJTilLqXHxC%2BkDJd4zmGVzjEGVD1t2lIqmUvBPVCM3X%2FxOsLh%2FuNK7HGSM%2B0WlGv%2BbW4cSoHJBT%2F7GG%2FfHhVUyMQo66Sq%2F%2BoTWzZL8u5wv6%2BdjqX8lY1axnGhUervBty2d%2F3RGGfaBldjJAwL0PAXk0MiicSTxxxlN1q9IYF4jvRUHyvGSrNybASVtYFNRLnA1jPiEI%2BkjN3xRmy3OIiC2%2BvBEbCPGcTCDs30pz3bD18utbQP5L16qDhNGxeaPyJ8SBupsxjhKf3pw5y1Y9cftMnWLuqS%2BbrI4U2tQL41OCodyJmPKbeMHw5u4Vx5PKLKukmIggn41dJTs1Q%2FmwS0xWBrl6HaBfeEBwdGztUJvvbqfMOG9Oc0K1yv61GMqPV4puFdgLPlzPT0PsiTuveKCPbOFaI4AXpmMmvItIvQ%2BS";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDvxBIPkKZBkfarshPsCZGLUzAgcO0UvZ6nXQAgHW60DLGGL3lop0gSvpH5k4RLCfigdO+aq/sS3vpImjFgfj1QJtnnHNrsixDzI+r9lVhAWVn+yIlAJX0vxmUNiJ+oLOlGJTilLqXHxC+kDJd4zmGVzjEGVD1t2lIqmUvBPVCM3X/xOsLh/uNK7HGSM+0WlGv+bW4cSoHJBT/7GG/fHhVUyMQo66Sq/+oTWzZL8u5wv6+djqX8lY1axnGhUervBty2d/3RGGfaBldjJAwL0PAXk0MiicSTxxxlN1q9IYF4jvRUHyvGSrNybASVtYFNRLnA1jPiEI+kjN3xRmy3OIiC2+vBEbCPGcTCDs30pz3bD18utbQP5L16qDhNGxeaPyJ8SBupsxjhKf3pw5y1Y9cftMnWLuqS+brI4U2tQL41OCodyJmPKbeMHw5u4Vx5PKLKukmIggn41dJTs1Q/mwS0xWBrl6HaBfeEBwdGztUJvvbqfMOG9Oc0K1yv61GMqPV4puFdgLPlzPT0PsiTuveKCPbOFaI4AXpmMmvItIvQ+S";
    </script>
    
    <script id="html_notice_dialog_script" src="https://www.genspark.ai/notice_dialog.js"></script>
    