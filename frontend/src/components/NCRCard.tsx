<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCR Card Component - CoreVQC</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        .ncr-card {
            transition: all 0.3s ease;
            border-left: 4px solid #e5e7eb;
        }
        .ncr-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .ncr-card.critical {
            border-left-color: #dc2626;
        }
        .ncr-card.high {
            border-left-color: #ea580c;
        }
        .ncr-card.medium {
            border-left-color: #d97706;
        }
        .ncr-card.low {
            border-left-color: #65a30d;
        }
        .status-badge {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
        }
        .status-open {
            background-color: rgba(239, 68, 68, 0.1);
            color: #dc2626;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .status-in-progress {
            background-color: rgba(59, 130, 246, 0.1);
            color: #2563eb;
            border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .status-resolved {
            background-color: rgba(251, 191, 36, 0.1);
            color: #d97706;
            border: 1px solid rgba(251, 191, 36, 0.2);
        }
        .status-closed {
            background-color: rgba(16, 185, 129, 0.1);
            color: #059669;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .severity-critical {
            color: #dc2626;
            background-color: rgba(239, 68, 68, 0.1);
        }
        .severity-high {
            color: #ea580c;
            background-color: rgba(234, 88, 12, 0.1);
        }
        .severity-medium {
            color: #d97706;
            background-color: rgba(217, 119, 6, 0.1);
        }
        .severity-low {
            color: #65a30d;
            background-color: rgba(101, 163, 13, 0.1);
        }
        .action-btn {
            transition: all 0.2s ease;
        }
        .action-btn:hover {
            transform: translateY(-1px);
        }
    </style>
</head>
<body class="bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">NCR Card Component Examples</h1>
        
        <!-- Sample NCR Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Critical NCR Card -->
            <div class="ncr-card critical bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-exclamation-triangle text-red-600"></i>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">NCR-2025-001</h3>
                            <p class="text-sm text-gray-500">Created 2 hours ago</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <span class="status-badge status-open">Open</span>
                        <span class="status-badge severity-critical">Critical</span>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Structural Steel Alignment Issue</h4>
                    <p class="text-gray-600 text-sm">Critical misalignment in structural steel beam installation on Level 15. Immediate correction required to prevent safety hazard and project delays.</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                        <span class="text-gray-500">Location:</span>
                        <span class="text-gray-900 ml-1">Tower A - Level 15</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Category:</span>
                        <span class="text-gray-900 ml-1">Structural</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Reported by:</span>
                        <span class="text-gray-900 ml-1">John Smith</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Due Date:</span>
                        <span class="text-red-600 ml-1 font-medium">Today</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div class="flex items-center space-x-2">
                        <img src="https://via.placeholder.com/24x24/3b82f6/ffffff?text=JS" alt="Assignee" class="w-6 h-6 rounded-full">
                        <span class="text-sm text-gray-600">Assigned to Sarah Johnson</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="action-btn px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                            <i class="fas fa-eye mr-1"></i>View
                        </button>
                        <button class="action-btn px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded">
                            <i class="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button class="action-btn px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded">
                            <i class="fas fa-check mr-1"></i>Resolve
                        </button>
                    </div>
                </div>
            </div>

            <!-- High Priority NCR Card -->
            <div class="ncr-card high bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-tools text-orange-600"></i>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">NCR-2025-002</h3>
                            <p class="text-sm text-gray-500">Created 1 day ago</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <span class="status-badge status-in-progress">In Progress</span>
                        <span class="status-badge severity-high">High</span>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Concrete Quality Below Specification</h4>
                    <p class="text-gray-600 text-sm">Concrete strength test results show values below required specification. Investigation and corrective measures in progress.</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                        <span class="text-gray-500">Location:</span>
                        <span class="text-gray-900 ml-1">Foundation - Zone B</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Category:</span>
                        <span class="text-gray-900 ml-1">Material Testing</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Reported by:</span>
                        <span class="text-gray-900 ml-1">Mike Davis</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Due Date:</span>
                        <span class="text-orange-600 ml-1 font-medium">Jan 8, 2025</span>
                    </div>
                </div>
                
                <div class="mb-4">
                    <div class="flex items-center mb-2">
                        <span class="text-sm text-gray-500 mr-2">Progress:</span>
                        <div class="flex-1 bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: 60%"></div>
                        </div>
                        <span class="text-sm text-gray-600 ml-2">60%</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div class="flex items-center space-x-2">
                        <img src="https://via.placeholder.com/24x24/10b981/ffffff?text=LD" alt="Assignee" class="w-6 h-6 rounded-full">
                        <span class="text-sm text-gray-600">Assigned to Lisa Chen</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="action-btn px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                            <i class="fas fa-eye mr-1"></i>View
                        </button>
                        <button class="action-btn px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded">
                            <i class="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button class="action-btn px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                            <i class="fas fa-comment mr-1"></i>Update
                        </button>
                    </div>
                </div>
            </div>

            <!-- Medium Priority NCR Card -->
            <div class="ncr-card medium bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-clipboard-check text-yellow-600"></i>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">NCR-2025-003</h3>
                            <p class="text-sm text-gray-500">Created 3 days ago</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <span class="status-badge status-resolved">Resolved</span>
                        <span class="status-badge severity-medium">Medium</span>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Documentation Incomplete</h4>
                    <p class="text-gray-600 text-sm">Missing safety inspection certificates for electrical installations. Documentation has been completed and submitted for review.</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                        <span class="text-gray-500">Location:</span>
                        <span class="text-gray-900 ml-1">Electrical Room - B1</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Category:</span>
                        <span class="text-gray-900 ml-1">Documentation</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Reported by:</span>
                        <span class="text-gray-900 ml-1">Anna Wilson</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Resolved:</span>
                        <span class="text-green-600 ml-1 font-medium">Yesterday</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div class="flex items-center space-x-2">
                        <img src="https://via.placeholder.com/24x24/8b5cf6/ffffff?text=RT" alt="Assignee" class="w-6 h-6 rounded-full">
                        <span class="text-sm text-gray-600">Resolved by Robert Taylor</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="action-btn px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                            <i class="fas fa-eye mr-1"></i>View
                        </button>
                        <button class="action-btn px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded">
                            <i class="fas fa-check-double mr-1"></i>Close
                        </button>
                    </div>
                </div>
            </div>

            <!-- Low Priority NCR Card -->
            <div class="ncr-card low bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-paint-brush text-green-600"></i>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">NCR-2025-004</h3>
                            <p class="text-sm text-gray-500">Created 1 week ago</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <span class="status-badge status-closed">Closed</span>
                        <span class="status-badge severity-low">Low</span>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Paint Finish Quality</h4>
                    <p class="text-gray-600 text-sm">Minor paint inconsistencies in lobby area. Touch-up work completed and approved by quality inspector.</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                        <span class="text-gray-500">Location:</span>
                        <span class="text-gray-900 ml-1">Main Lobby</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Category:</span>
                        <span class="text-gray-900 ml-1">Finishing</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Reported by:</span>
                        <span class="text-gray-900 ml-1">David Lee</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Closed:</span>
                        <span class="text-green-600 ml-1 font-medium">Jan 2, 2025</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div class="flex items-center space-x-2">
                        <img src="https://via.placeholder.com/24x24/ef4444/ffffff?text=MW" alt="Assignee" class="w-6 h-6 rounded-full">
                        <span class="text-sm text-gray-600">Completed by Maria White</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="action-btn px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                            <i class="fas fa-eye mr-1"></i>View
                        </button>
                        <button class="action-btn px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded">
                            <i class="fas fa-archive mr-1"></i>Archive
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Component Usage Instructions -->
        <div class="mt-12 bg-blue-50 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-blue-900 mb-4">NCR Card Component Features</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                    <h3 class="font-medium text-blue-800 mb-2">Visual Elements:</h3>
                    <ul class="space-y-1 text-blue-700">
                        <li>• Color-coded severity indicators (left border)</li>
                        <li>• Status badges with distinct colors</li>
                        <li>• Category icons for visual identification</li>
                        <li>• Progress bars for in-progress NCRs</li>
                        <li>• Assignee avatars with initials</li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-medium text-blue-800 mb-2">Interactive Features:</h3>
                    <ul class="space-y-1 text-blue-700">
                        <li>• Hover effects with elevation</li>
                        <li>• Action buttons (View, Edit, Resolve, Close)</li>
                        <li>• Responsive design for mobile/desktop</li>
                        <li>• Status-specific action sets</li>
                        <li>• Click handlers for all interactive elements</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
<script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"rayId":"95a87aeaca0ba5ba","serverTiming":{"name":{"cfExtPri":true,"cfEdge":true,"cfOrigin":true,"cfL4":true,"cfSpeedBrain":true,"cfCacheStatus":true}},"version":"2025.6.2","token":"4edd5f8ec12a48cfa682ab8261b80a79"}' crossorigin="anonymous"></script>
</body>
</html>
    <script id="html_badge_script1">
        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDvxBIPkKZBkfarshPsCZGLUzAgcO0UvZ6nXQAgHW60DLGGL3lop0gSvpH5k4RLCfigdO%2Baq%2FsS3vpImjFgfj1QJtnnHNrsixDzI%2Br9lVhAWVn%2ByIlAJX0vxmUNiJ%2BoLOlGJTilLqXHxC%2BkDJd4zmGVzjEGVD1t2lIqmUvBPVCM3X%2FxOsLh%2FuNK7HGSM%2B0WlGv%2BbW4cSoHJBT%2F7GG%2FfHhVUykfVD%2BI4E7bOI0FdpkaYEvMW5DATzh2VoBb%2B5D6787QREBxMARVM51BnEC9wIOAVk2NkznXHgrDTRMK42Dt33OVbRRUuirCha7yfzHvMqpGiKPLx8nUp97vABS%2Bvg35udILYNmJs7iJymLiL%2FYH7gyQSSkQsEh3etdmwqaPeazxAd4dM9NNqj51ZUBePucLK5KaIDbSJbMBNR4KODzghK4swXR%2Fe4zNC0HoDo3gYJh0qRigqVgeF1v37GZXzFjisi0tVritpZqmtsgknOWn5SmPzkZZjsRFilttF3vHCj6DQ%3D%3D";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDvxBIPkKZBkfarshPsCZGLUzAgcO0UvZ6nXQAgHW60DLGGL3lop0gSvpH5k4RLCfigdO+aq/sS3vpImjFgfj1QJtnnHNrsixDzI+r9lVhAWVn+yIlAJX0vxmUNiJ+oLOlGJTilLqXHxC+kDJd4zmGVzjEGVD1t2lIqmUvBPVCM3X/xOsLh/uNK7HGSM+0WlGv+bW4cSoHJBT/7GG/fHhVUykfVD+I4E7bOI0FdpkaYEvMW5DATzh2VoBb+5D6787QREBxMARVM51BnEC9wIOAVk2NkznXHgrDTRMK42Dt33OVbRRUuirCha7yfzHvMqpGiKPLx8nUp97vABS+vg35udILYNmJs7iJymLiL/YH7gyQSSkQsEh3etdmwqaPeazxAd4dM9NNqj51ZUBePucLK5KaIDbSJbMBNR4KODzghK4swXR/e4zNC0HoDo3gYJh0qRigqVgeF1v37GZXzFjisi0tVritpZqmtsgknOWn5SmPzkZZjsRFilttF3vHCj6DQ==";
    </script>
    
    <script id="html_notice_dialog_script" src="https://www.genspark.ai/notice_dialog.js"></script>
    