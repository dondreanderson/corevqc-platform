<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCR Filters Component - CoreVQC</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        .filter-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(229, 231, 235, 0.8);
        }
        
        .filter-input {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            transition: all 0.2s ease;
            width: 100%;
        }
        
        .filter-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .filter-select {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            background: white;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .filter-select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .filter-button {
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s ease;
            border: 1px solid #d1d5db;
            background: white;
            cursor: pointer;
        }
        
        .filter-button:hover {
            background: #f3f4f6;
            transform: translateY(-1px);
        }
        
        .filter-button.active {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
        }
        
        .clear-button {
            background: #ef4444;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .clear-button:hover {
            background: #dc2626;
            transform: translateY(-1px);
        }
        
        .search-container {
            position: relative;
        }
        
        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #6b7280;
        }
        
        .search-input {
            padding-left: 2.5rem;
        }
        
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .badge-open {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .badge-in-progress {
            background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
            border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .badge-resolved {
            background-color: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .badge-closed {
            background-color: rgba(107, 114, 128, 0.1);
            color: #6b7280;
            border: 1px solid rgba(107, 114, 128, 0.2);
        }
        
        .results-summary {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
        }
        
        .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto p-6">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
                <i class="fas fa-clipboard-check text-blue-600 mr-3"></i>
                NCR Filters & Search
            </h1>
            <p class="text-gray-600">Filter and search Non-Conformance Reports for quality control management</p>
        </div>

        <!-- Main Filter Card -->
        <div class="filter-card p-6 mb-6 animate-fade-in">
            <!-- Search Bar -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-search mr-2"></i>Search NCRs
                </label>
                <div class="search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input 
                        type="text" 
                        id="searchInput"
                        class="filter-input search-input" 
                        placeholder="Search by NCR number, title, description, or location..."
                        onkeyup="handleSearch()"
                    >
                </div>
            </div>

            <!-- Filter Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <!-- Status Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-flag mr-2"></i>Status
                    </label>
                    <select id="statusFilter" class="filter-select" onchange="handleFilterChange()">
                        <option value="">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>

                <!-- Severity Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-exclamation-triangle mr-2"></i>Severity
                    </label>
                    <select id="severityFilter" class="filter-select" onchange="handleFilterChange()">
                        <option value="">All Severity</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                    </select>
                </div>

                <!-- Category Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-tags mr-2"></i>Category
                    </label>
                    <select id="categoryFilter" class="filter-select" onchange="handleFilterChange()">
                        <option value="">All Categories</option>
                        <option value="Safety">Safety</option>
                        <option value="Quality">Quality</option>
                        <option value="Environmental">Environmental</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Material">Material</option>
                        <option value="Workmanship">Workmanship</option>
                    </select>
                </div>

                <!-- Project Filter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-building mr-2"></i>Project
                    </label>
                    <select id="projectFilter" class="filter-select" onchange="handleFilterChange()">
                        <option value="">All Projects</option>
                        <option value="downtown-office">Downtown Office Complex</option>
                        <option value="uptown-office">Uptown Office Complex</option>
                        <option value="residential-tower">Residential Tower</option>
                        <option value="warehouse-facility">Warehouse Facility</option>
                    </select>
                </div>
            </div>

            <!-- Date Range Filter -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-calendar-alt mr-2"></i>From Date
                    </label>
                    <input 
                        type="date" 
                        id="fromDate"
                        class="filter-input" 
                        onchange="handleFilterChange()"
                    >
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-calendar-alt mr-2"></i>To Date
                    </label>
                    <input 
                        type="date" 
                        id="toDate"
                        class="filter-input" 
                        onchange="handleFilterChange()"
                    >
                </div>
            </div>

            <!-- Sort Options -->
            <div class="flex flex-wrap items-center justify-between mb-4">
                <div class="flex items-center space-x-4">
                    <label class="text-sm font-medium text-gray-700">
                        <i class="fas fa-sort mr-2"></i>Sort by:
                    </label>
                    <select id="sortBy" class="filter-select w-auto" onchange="handleSortChange()">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="severity">Severity (High to Low)</option>
                        <option value="status">Status</option>
                        <option value="ncrNumber">NCR Number</option>
                    </select>
                </div>

                <!-- View Mode Toggle -->
                <div class="flex items-center space-x-2">
                    <label class="text-sm font-medium text-gray-700">View:</label>
                    <button id="listView" class="filter-button active" onclick="toggleView('list')">
                        <i class="fas fa-list mr-1"></i>List
                    </button>
                    <button id="cardView" class="filter-button" onclick="toggleView('card')">
                        <i class="fas fa-th mr-1"></i>Cards
                    </button>
                </div>
            </div>

            <!-- Quick Filters -->
            <div class="border-t pt-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">
                    <i class="fas fa-bolt mr-2"></i>Quick Filters
                </label>
                <div class="flex flex-wrap gap-2">
                    <button class="filter-button" onclick="applyQuickFilter('critical')">
                        <i class="fas fa-exclamation-circle mr-1"></i>Critical Issues
                    </button>
                    <button class="filter-button" onclick="applyQuickFilter('overdue')">
                        <i class="fas fa-clock mr-1"></i>Overdue
                    </button>
                    <button class="filter-button" onclick="applyQuickFilter('open')">
                        <i class="fas fa-folder-open mr-1"></i>Open NCRs
                    </button>
                    <button class="filter-button" onclick="applyQuickFilter('thisWeek')">
                        <i class="fas fa-calendar-week mr-1"></i>This Week
                    </button>
                    <button class="filter-button" onclick="applyQuickFilter('myNCRs')">
                        <i class="fas fa-user mr-1"></i>My NCRs
                    </button>
                </div>
            </div>

            <!-- Clear Filters Button -->
            <div class="flex justify-end mt-4">
                <button class="clear-button" onclick="clearAllFilters()">
                    <i class="fas fa-times mr-2"></i>Clear All Filters
                </button>
            </div>
        </div>

        <!-- Results Summary -->
        <div id="resultsSummary" class="results-summary animate-fade-in">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <span class="text-sm font-medium text-gray-700">
                        <i class="fas fa-list-ul mr-2"></i>
                        Showing <span id="resultCount" class="font-bold text-blue-600">24</span> NCRs
                    </span>
                    <div class="flex space-x-2">
                        <span class="badge badge-open">8 Open</span>
                        <span class="badge badge-in-progress">6 In Progress</span>
                        <span class="badge badge-resolved">7 Resolved</span>
                        <span class="badge badge-closed">3 Closed</span>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="filter-button" onclick="exportResults()">
                        <i class="fas fa-download mr-1"></i>Export
                    </button>
                    <button class="filter-button" onclick="refreshResults()">
                        <i class="fas fa-sync-alt mr-1"></i>Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Demo: Applied Filters Display -->
        <div id="appliedFilters" class="mt-4" style="display: none;">
            <div class="filter-card p-4">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-sm font-medium text-gray-700">
                        <i class="fas fa-filter mr-2"></i>Applied Filters
                    </h3>
                    <button class="text-sm text-blue-600 hover:text-blue-800" onclick="clearAllFilters()">
                        Clear All
                    </button>
                </div>
                <div id="filterTags" class="flex flex-wrap gap-2"></div>
            </div>
        </div>

        <!-- Demo: Sample Search Results -->
        <div class="mt-6">
            <div class="filter-card p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    <i class="fas fa-search-plus mr-2"></i>Search Results Preview
                </h3>
                <div class="space-y-3">
                    <div class="border-l-4 border-red-500 bg-red-50 p-3 rounded">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-medium text-gray-900">NCR-001: Concrete Quality Issue</h4>
                                <p class="text-sm text-gray-600">Foundation concrete shows surface cracks and inconsistent texture</p>
                                <p class="text-xs text-gray-500 mt-1">Downtown Office Complex • Safety • Critical</p>
                            </div>
                            <span class="badge badge-open">Open</span>
                        </div>
                    </div>
                    <div class="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-medium text-gray-900">NCR-002: Missing Safety Documentation</h4>
                                <p class="text-sm text-gray-600">Required safety certificates not provided by subcontractor</p>
                                <p class="text-xs text-gray-500 mt-1">Uptown Office Complex • Documentation • High</p>
                            </div>
                            <span class="badge badge-in-progress">In Progress</span>
                        </div>
                    </div>
                    <div class="border-l-4 border-green-500 bg-green-50 p-3 rounded">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-medium text-gray-900">NCR-003: Electrical Installation Defect</h4>
                                <p class="text-sm text-gray-600">Improper cable routing in electrical panel room</p>
                                <p class="text-xs text-gray-500 mt-1">Residential Tower • Quality • Medium</p>
                            </div>
                            <span class="badge badge-resolved">Resolved</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Current filter state
        let currentFilters = {
            search: '',
            status: '',
            severity: '',
            category: '',
            project: '',
            fromDate: '',
            toDate: '',
            sortBy: 'newest'
        };

        let currentView = 'list';

        // Handle search input
        function handleSearch() {
            const searchValue = document.getElementById('searchInput').value;
            currentFilters.search = searchValue;
            updateResults();
            updateAppliedFilters();
        }

        // Handle filter changes
        function handleFilterChange() {
            currentFilters.status = document.getElementById('statusFilter').value;
            currentFilters.severity = document.getElementById('severityFilter').value;
            currentFilters.category = document.getElementById('categoryFilter').value;
            currentFilters.project = document.getElementById('projectFilter').value;
            currentFilters.fromDate = document.getElementById('fromDate').value;
            currentFilters.toDate = document.getElementById('toDate').value;
            
            updateResults();
            updateAppliedFilters();
        }

        // Handle sort changes
        function handleSortChange() {
            currentFilters.sortBy = document.getElementById('sortBy').value;
            updateResults();
        }

        // Toggle view mode
        function toggleView(view) {
            currentView = view;
            document.getElementById('listView').classList.toggle('active', view === 'list');
            document.getElementById('cardView').classList.toggle('active', view === 'card');
            updateResults();
        }

        // Apply quick filters
        function applyQuickFilter(filterType) {
            switch(filterType) {
                case 'critical':
                    document.getElementById('severityFilter').value = 'CRITICAL';
                    currentFilters.severity = 'CRITICAL';
                    break;
                case 'overdue':
                    // Set date filter for items older than 7 days
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    document.getElementById('toDate').value = weekAgo.toISOString().split('T')[0];
                    currentFilters.toDate = weekAgo.toISOString().split('T')[0];
                    break;
                case 'open':
                    document.getElementById('statusFilter').value = 'OPEN';
                    currentFilters.status = 'OPEN';
                    break;
                case 'thisWeek':
                    const today = new Date();
                    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                    document.getElementById('fromDate').value = weekStart.toISOString().split('T')[0];
                    currentFilters.fromDate = weekStart.toISOString().split('T')[0];
                    break;
                case 'myNCRs':
                    // This would filter by current user in real implementation
                    alert('This would filter NCRs assigned to current user');
                    return;
            }
            updateResults();
            updateAppliedFilters();
        }

        // Clear all filters
        function clearAllFilters() {
            // Reset all form fields
            document.getElementById('searchInput').value = '';
            document.getElementById('statusFilter').value = '';
            document.getElementById('severityFilter').value = '';
            document.getElementById('categoryFilter').value = '';
            document.getElementById('projectFilter').value = '';
            document.getElementById('fromDate').value = '';
            document.getElementById('toDate').value = '';
            document.getElementById('sortBy').value = 'newest';

            // Reset filter state
            currentFilters = {
                search: '',
                status: '',
                severity: '',
                category: '',
                project: '',
                fromDate: '',
                toDate: '',
                sortBy: 'newest'
            };

            updateResults();
            updateAppliedFilters();
        }

        // Update results display
        function updateResults() {
            // Simulate filtering logic
            let resultCount = 24;
            
            // Reduce count based on filters
            if (currentFilters.search) resultCount -= 5;
            if (currentFilters.status) resultCount -= 8;
            if (currentFilters.severity) resultCount -= 6;
            if (currentFilters.category) resultCount -= 4;
            if (currentFilters.project) resultCount -= 10;
            if (currentFilters.fromDate || currentFilters.toDate) resultCount -= 3;

            // Ensure minimum count
            resultCount = Math.max(resultCount, 3);

            document.getElementById('resultCount').textContent = resultCount;

            // Update badge counts proportionally
            const openCount = Math.ceil(resultCount * 0.33);
            const inProgressCount = Math.ceil(resultCount * 0.25);
            const resolvedCount = Math.ceil(resultCount * 0.29);
            const closedCount = resultCount - openCount - inProgressCount - resolvedCount;

            const badges = document.querySelectorAll('.badge');
            badges[0].textContent = `${openCount} Open`;
            badges[1].textContent = `${inProgressCount} In Progress`;
            badges[2].textContent = `${resolvedCount} Resolved`;
            badges[3].textContent = `${closedCount} Closed`;

            console.log(`Results updated: ${resultCount} NCRs found`);
            console.log(`Sort: ${currentFilters.sortBy}, View: ${currentView}`);
        }

        // Update applied filters display
        function updateAppliedFilters() {
            const filterTags = document.getElementById('filterTags');
            const appliedFiltersDiv = document.getElementById('appliedFilters');
            
            filterTags.innerHTML = '';
            let hasFilters = false;

            // Create filter tags for active filters
            Object.entries(currentFilters).forEach(([key, value]) => {
                if (value && key !== 'sortBy') {
                    hasFilters = true;
                    const tag = document.createElement('span');
                    tag.className = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800';
                    tag.innerHTML = `
                        ${key}: ${value}
                        <button onclick="removeFilter('${key}')" class="ml-1 text-blue-600 hover:text-blue-800">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    filterTags.appendChild(tag);
                }
            });

            appliedFiltersDiv.style.display = hasFilters ? 'block' : 'none';
        }

        // Remove individual filter
        function removeFilter(filterKey) {
            currentFilters[filterKey] = '';
            
            // Reset corresponding form field
            const fieldMap = {
                search: 'searchInput',
                status: 'statusFilter',
                severity: 'severityFilter',
                category: 'categoryFilter',
                project: 'projectFilter',
                fromDate: 'fromDate',
                toDate: 'toDate'
            };
            
            if (fieldMap[filterKey]) {
                document.getElementById(fieldMap[filterKey]).value = '';
            }

            updateResults();
            updateAppliedFilters();
        }

        // Export results
        function exportResults() {
            alert('Export functionality would generate CSV/PDF report of filtered NCRs');
        }

        // Refresh results
        function refreshResults() {
            updateResults();
            
            // Add visual feedback
            const resultsSummary = document.getElementById('resultsSummary');
            resultsSummary.style.opacity = '0.5';
            setTimeout(() => {
                resultsSummary.style.opacity = '1';
            }, 300);
        }

        // Initialize the component
        document.addEventListener('DOMContentLoaded', function() {
            updateResults();
            updateAppliedFilters();
        });
    </script>
<script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"rayId":"95a87bbfce7ea5ba","serverTiming":{"name":{"cfExtPri":true,"cfEdge":true,"cfOrigin":true,"cfL4":true,"cfSpeedBrain":true,"cfCacheStatus":true}},"version":"2025.6.2","token":"4edd5f8ec12a48cfa682ab8261b80a79"}' crossorigin="anonymous"></script>
</body>
</html>
    <script id="html_badge_script1">
        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDvxBIPkKZBkfarshPsCZGLUzAgcO0UvZ6nXQAgHW60DLGGL3lop0gSvpH5k4RLCfigdO%2Baq%2FsS3vpImjFgfj1QJtnnHNrsixDzI%2Br9lVhAWVn%2ByIlAJX0vxmUNiJ%2BoLOlGJTilLqXHxC%2BkDJd4zmGVzjEGVD1t2lIqmUvBPVCM3X%2FxOsLh%2FuNK7HGSM%2B0WlGv%2BbW4cSoHJBT%2F7GG%2FfHhVUwl0vmqx%2Fkd76MG2q5edgC%2Bakn8Cnj27D3eG6a8ikQYs0aL%2Fa4hW7PThoqJP2G3n1Lr2rLoIQV3GTouP9GoNMVmWyjY%2Ba3i9NDtb7jxfJgz4JjjiJY8IqJ5h5mhGct2PvXcidyJowTCPTcGnDauxnJr3eEUdf6WP1a8xMcPdgMExd1hRGx%2BNhLJ0A9LfBFO42iaQmqSLewDczjRQpLNkU9yVI1ogCoSn%2FYai5zE%2FvLFSOHLpDy6iLdBZoVeDJnomV0P303Kylry7wNLqkgkhRE2KW8a77yQLSB6J3ikd9NSBU%2Fbp9zbKNEtGV8Vz0FUi3cmLZAi%2FRlhDKhXhoitFbWr";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDvxBIPkKZBkfarshPsCZGLUzAgcO0UvZ6nXQAgHW60DLGGL3lop0gSvpH5k4RLCfigdO+aq/sS3vpImjFgfj1QJtnnHNrsixDzI+r9lVhAWVn+yIlAJX0vxmUNiJ+oLOlGJTilLqXHxC+kDJd4zmGVzjEGVD1t2lIqmUvBPVCM3X/xOsLh/uNK7HGSM+0WlGv+bW4cSoHJBT/7GG/fHhVUwl0vmqx/kd76MG2q5edgC+akn8Cnj27D3eG6a8ikQYs0aL/a4hW7PThoqJP2G3n1Lr2rLoIQV3GTouP9GoNMVmWyjY+a3i9NDtb7jxfJgz4JjjiJY8IqJ5h5mhGct2PvXcidyJowTCPTcGnDauxnJr3eEUdf6WP1a8xMcPdgMExd1hRGx+NhLJ0A9LfBFO42iaQmqSLewDczjRQpLNkU9yVI1ogCoSn/Yai5zE/vLFSOHLpDy6iLdBZoVeDJnomV0P303Kylry7wNLqkgkhRE2KW8a77yQLSB6J3ikd9NSBU/bp9zbKNEtGV8Vz0FUi3cmLZAi/RlhDKhXhoitFbWr";
    </script>
    
    <script id="html_notice_dialog_script" src="https://www.genspark.ai/notice_dialog.js"></script>
    