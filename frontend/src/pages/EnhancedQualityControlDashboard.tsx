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
        
        .ncr-card:hover {
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
        
        .chart-container {
            position: relative;
            height: 300px;
            width: 100%;
        }
        
        .fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex items-center justify-between">
                <div>
                    <nav class="flex items-center space-x-2 text-sm mb-4 opacity-90">
                        <a href="#" class="hover:underline">Dashboard</a>
                        <span>/</span>
                        <span>Quality Control</span>
                    </nav>
                    <h1 class="text-4xl font-bold mb-2">Quality Control Dashboard</h1>
                    <p class="text-lg opacity-90">Monitor and manage Non-Conformance Reports (NCRs)</p>
                </div>
                <button onclick="openCreateNCRModal()" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
                    <i class="fas fa-plus"></i>
                    <span>Create NCR</span>
                </button>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Quality Metrics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
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

            <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
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

            <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Critical NCRs</p>
                        <p class="text-3xl font-bold text-orange-600" id="criticalNCRs">3</p>
                    </div>
                    <div class="p-3 bg-orange-100 rounded-lg">
                        <i class="fas fa-exclamation text-orange-600 text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Quality Score</p>
                        <p class="text-3xl font-bold text-green-600" id="qualityScore">87%</p>
                    </div>
                    <div class="p-3 bg-green-100 rounded-lg">
                        <i class="fas fa-award text-green-600 text-xl"></i>
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
                                   class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                   oninput="filterNCRs()">
                            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        </div>
                        <select id="statusFilter" class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" onchange="filterNCRs()">
                            <option value="">All Status</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                        <select id="severityFilter" class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" onchange="filterNCRs()">
                            <option value="">All Severity</option>
                            <option value="CRITICAL">Critical</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                        <button onclick="openCreateNCRModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fas fa-plus mr-2"></i>Add NCR
                        </button>
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
        <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-90vh overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Create New NCR</h2>
                <button onclick="closeCreateNCRModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <form id="createNCRForm" onsubmit="handleCreateNCR(event)">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="mb-4">
                        <label for="ncrTitle" class="block text-sm font-medium text-gray-700 mb-2">NCR Title *</label>
                        <input type="text" id="ncrTitle" name="title" required 
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                               placeholder="Brief description of the issue">
                    </div>

                    <div class="mb-4">
                        <label for="ncrCategory" class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select id="ncrCategory" name="category" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select Category</option>
                            <option value="Quality">Quality</option>
                            <option value="Safety">Safety</option>
                            <option value="Process">Process</option>
                            <option value="Material">Material</option>
                            <option value="Environmental">Environmental</option>
                            <option value="Documentation">Documentation</option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label for="ncrSeverity" class="block text-sm font-medium text-gray-700 mb-2">Severity *</label>
                        <select id="ncrSeverity" name="severity" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select Severity</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label for="ncrLocation" class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input type="text" id="ncrLocation" name="location" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                               placeholder="e.g., Building A, Floor 3">
                    </div>
                </div>

                <div class="mb-4">
                    <label for="ncrDescription" class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea id="ncrDescription" name="description" rows="4" required 
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Detailed description of the non-conformance..."></textarea>
                </div>

                <div class="mb-6">
                    <label for="ncrDueDate" class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input type="date" id="ncrDueDate" name="dueDate" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>

                <div class="flex items-center justify-end space-x-4">
                    <button type="button" onclick="closeCreateNCRModal()" 
                            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button type="submit" 
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Create NCR
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- NCR Details Modal -->
    <div id="ncrDetailsModal" class="modal">
        <div class="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-90vh overflow-y-auto">
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
                category: 'Quality',
                location: 'Foundation Block A-3',
                reportedBy: 'John Smith',
                createdAt: '2025-01-05T10:30:00Z',
                dueDate: '2025-01-10T00:00:00Z',
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
                category: 'Quality',
                location: 'Grid Line B-5, Level 3',
                reportedBy: 'Sarah Johnson',
                createdAt: '2025-01-04T14:15:00Z',
                dueDate: '2025-01-08T00:00:00Z',
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
                category: 'Quality',
                location: 'Slab Area C-2',
                reportedBy: 'Mike Davis',
                createdAt: '2025-01-03T09:45:00Z',
                dueDate: '2025-01-07T00:00:00Z',
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
                location: 'Level 5 Perimeter',
                reportedBy: 'Lisa Chen',
                createdAt: '2025-01-02T16:20:00Z',
                dueDate: '2025-01-06T00:00:00Z',
                correctiveAction: 'Safety barriers installed as per safety protocol',
                rootCause: 'Delayed material delivery'
            }
        ];

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            updateMetrics();
            renderCharts();
            renderNCRList();
        });

        function updateMetrics() {
            const totalNCRs = ncrData.length;
            const openNCRs = ncrData.filter(ncr => ncr.status === 'OPEN' || ncr.status === 'IN_PROGRESS').length;
            const criticalNCRs = ncrData.filter(ncr => ncr.severity === 'CRITICAL').length;
            const resolvedNCRs = ncrData.filter(ncr => ncr.status === 'RESOLVED' || ncr.status === 'CLOSED').length;
            const qualityScore = totalNCRs > 0 ? Math.round((resolvedNCRs / totalNCRs) * 100) : 100;

            document.getElementById('totalNCRs').textContent = totalNCRs;
            document.getElementById('openNCRs').textContent = openNCRs;
            document.getElementById('criticalNCRs').textContent = criticalNCRs;
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
                ncrCard.className = 'p-6 hover:bg-gray-50 cursor-pointer transition-colors ncr-card';
                ncrCard.onclick = () => showNCRDetails(ncr);
                
                const isOverdue = ncr.dueDate && new Date(ncr.dueDate) < new Date() && ncr.status !== 'CLOSED';
                
                ncrCard.innerHTML = `
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-2">
                                <h3 class="text-lg font-semibold text-gray-900">${ncr.ncrNumber}</h3>
                                <span class="status-badge status-${ncr.status.toLowerCase().replace('_', '-')}">${ncr.status.replace('_', ' ')}</span>
                                <span class="status-badge severity-${ncr.severity.toLowerCase()}">${ncr.severity}</span>
                                ${isOverdue ? '<span class="status-badge" style="background-color: rgba(239, 68, 68, 0.1); color: #ef4444;">OVERDUE</span>' : ''}
                            </div>
                            <h4 class="text-md font-medium text-gray-800 mb-2">${ncr.title}</h4>
                            <p class="text-gray-600 mb-3 line-clamp-2">${ncr.description}</p>
                            <div class="flex items-center space-x-6 text-sm text-gray-500">
                                <span><i class="fas fa-map-marker-alt mr-1"></i> ${ncr.location}</span>
                                <span><i class="fas fa-user mr-1"></i> ${ncr.reportedBy}</span>
                                <span><i class="fas fa-calendar mr-1"></i> ${formatDate(ncr.createdAt)}</span>
                                ${ncr.dueDate ? `<span class="${isOverdue ? 'text-red-600' : 'text-orange-600'}"><i class="fas fa-clock mr-1"></i> Due: ${formatDate(ncr.dueDate)}</span>` : ''}
                            </div>
                        </div>
                        <div class="flex items-center space-x-2 ml-4">
                            <button onclick="editNCR('${ncr.id}'); event.stopPropagation();" class="text-blue-600 hover:text-blue-800 p-2">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteNCR('${ncr.id}'); event.stopPropagation();" class="text-red-600 hover:text-red-800 p-2">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                ncrList.appendChild(ncrCard);
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

        function handleCreateNCR(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const newNCR = {
                id: 'NCR-' + String(ncrData.length + 1).padStart(3, '0'),
                ncrNumber: 'NCR-' + String(ncrData.length + 1).padStart(3, '0'),
                title: formData.get('title'),
                description: formData.get('description'),
                severity: formData.get('severity'),
                status: 'OPEN',
                category: formData.get('category'),
                location: formData.get('location') || '',
                reportedBy: 'Current User',
                createdAt: new Date().toISOString(),
                dueDate: formData.get('dueDate') || null,
                correctiveAction: '',
                rootCause: ''
            };

            ncrData.unshift(newNCR);
            updateMetrics();
            renderCharts();
            renderNCRList();
            closeCreateNCRModal();
            
            // Show success message
            showToast('NCR created successfully!', 'success');
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
                    <button onclick="closeNCRDetailsModal()" class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Close</button>
                    <button onclick="editNCR('${ncr.id}')" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Edit NCR</button>
                </div>
            `;
            
            modal.classList.add('show');
        }

        function closeNCRDetailsModal() {
            document.getElementById('ncrDetailsModal').classList.remove('show');
        }

        function editNCR(id) {
            showToast('Edit functionality would open an edit modal for NCR: ' + id, 'info');
            closeNCRDetailsModal();
        }

        function deleteNCR(id) {
            if (confirm('Are you sure you want to delete this NCR?')) {
                ncrData = ncrData.filter(ncr => ncr.id !== id);
                updateMetrics();
                renderCharts();
                renderNCRList();
                showToast('NCR deleted successfully!', 'success');
            }
        }

        function formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 fade-in ${
                type === 'success' ? 'bg-green-500' : 
                type === 'error' ? 'bg-red-500' : 
                'bg-blue-500'
            }`;
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
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
<script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"rayId":"95a955b7bc97a3ba","serverTiming":{"name":{"cfExtPri":true,"cfEdge":true,"cfOrigin":true,"cfL4":true,"cfSpeedBrain":true,"cfCacheStatus":true}},"version":"2025.6.2","token":"4edd5f8ec12a48cfa682ab8261b80a79"}' crossorigin="anonymous"></script>
</body>
</html>
    <script id="html_badge_script1">
        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDtFrrvLF08orYqcKP79qEuap3kAZsbBNMeQrstaPQjQW1MJhUy14JAKyNchv%2Bq%2F2LYCLJjJQJ0hFrzA7K2P%2FMOos5MuMXNLhuyw%2FQGA%2F7buOL3J4G84zopeSoH0fhTIZUAEUFCrTzHm9FHaflDFdcLDjzH64Ahzrmx%2Fv1flc3PGv%2FqXJwUnDQTAnsAhd1%2FGOqhDFj0%2BCrYE5%2F0w6dfBd%2Fn9nz3iUDwdWp2p0f%2BHjeIfSMe%2B0nS1AvHghr8M2GbAXEBWudvJDDGCfe6BwkZCTKSV7TqrH%2BPvYBvS%2FCW276%2F6Y0fstwPymvGJTxotXYEeM0jVGI%2Fxy27%2FYPl4nZOpjFroomHQlxz5tLgF7w3xJ2bFiW5ENdF4q69dJ9jDn65Je8Wgw1bgqlQrH2jmLvGqhUwlaK2PadyKoeMZDXmkUMN9Kb%2FIrJDHJsrkKP47KkC%2BYuU120%2FaehUnMUq8i15M%2FeoRfoZ62U5PvGVvdU%2F%2FtsobOJWaqF1M0ZJKo4t3ZhpLQX%2Fc8yC5gk1tiEmI3OdDDviRdqCXo1RajrMniFDe5wHQ0XQxhY90g3VKyONFn%2BYuKpg%3D%3D";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDtFrrvLF08orYqcKP79qEuap3kAZsbBNMeQrstaPQjQW1MJhUy14JAKyNchv+q/2LYCLJjJQJ0hFrzA7K2P/MOos5MuMXNLhuyw/QGA/7buOL3J4G84zopeSoH0fhTIZUAEUFCrTzHm9FHaflDFdcLDjzH64Ahzrmx/v1flc3PGv/qXJwUnDQTAnsAhd1/GOqhDFj0+CrYE5/0w6dfBd/n9nz3iUDwdWp2p0f+HjeIfSMe+0nS1AvHghr8M2GbAXEBWudvJDDGCfe6BwkZCTKSV7TqrH+PvYBvS/CW276/6Y0fstwPymvGJTxotXYEeM0jVGI/xy27/YPl4nZOpjFroomHQlxz5tLgF7w3xJ2bFiW5ENdF4q69dJ9jDn65Je8Wgw1bgqlQrH2jmLvGqhUwlaK2PadyKoeMZDXmkUMN9Kb/IrJDHJsrkKP47KkC+YuU120/aehUnMUq8i15M/eoRfoZ62U5PvGVvdU//tsobOJWaqF1M0ZJKo4t3ZhpLQX/c8yC5gk1tiEmI3OdDDviRdqCXo1RajrMniFDe5wHQ0XQxhY90g3VKyONFn+YuKpg==";
    </script>
    
    <script id="html_notice_dialog_script" src="https://www.genspark.ai/notice_dialog.js"></script>
    