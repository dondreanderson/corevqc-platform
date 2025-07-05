<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create NCR - CoreVQC Quality Control</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        .modal-backdrop {
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }
        
        .severity-badge {
            transition: all 0.2s ease;
        }
        
        .severity-badge:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .severity-low { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); }
        .severity-medium { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
        .severity-high { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
        .severity-critical { background: linear-gradient(135deg, #7c2d12 0%, #991b1b 100%); }
        
        .form-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            transition: all 0.2s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .drag-area {
            border: 2px dashed #d1d5db;
            transition: all 0.3s ease;
        }
        
        .drag-area.dragover {
            border-color: #3b82f6;
            background-color: #eff6ff;
        }
        
        .photo-preview {
            position: relative;
            overflow: hidden;
            border-radius: 8px;
        }
        
        .photo-preview img {
            transition: transform 0.2s ease;
        }
        
        .photo-preview:hover img {
            transform: scale(1.05);
        }
        
        .remove-photo {
            position: absolute;
            top: 4px;
            right: 4px;
            background: rgba(239, 68, 68, 0.9);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        
        .photo-preview:hover .remove-photo {
            opacity: 1;
        }
        
        .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-scale-in {
            animation: scaleIn 0.2s ease-out;
        }
        
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
    </style>
</head>
<body class="bg-gray-100 font-sans">
    <!-- Modal Backdrop -->
    <div id="modalBackdrop" class="fixed inset-0 modal-backdrop flex items-center justify-center p-4 z-50">
        <!-- Modal Container -->
        <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-hidden animate-scale-in">
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-exclamation-triangle text-2xl"></i>
                        <div>
                            <h2 class="text-xl font-bold">Create Non-Conformance Report</h2>
                            <p class="text-blue-100 text-sm">Document and track quality issues</p>
                        </div>
                    </div>
                    <button id="closeModal" class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>

            <!-- Modal Body -->
            <div class="max-h-96 overflow-y-auto">
                <form id="ncrForm" class="p-6 space-y-6">
                    <!-- NCR Basic Information -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- NCR Number -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-hashtag mr-2 text-blue-600"></i>NCR Number
                            </label>
                            <input 
                                type="text" 
                                id="ncrNumber" 
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg form-input focus:outline-none"
                                placeholder="Auto-generated (e.g., NCR-2025-001)"
                                readonly
                            >
                        </div>

                        <!-- Project Selection -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-building mr-2 text-blue-600"></i>Project
                            </label>
                            <select id="projectSelect" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg form-input focus:outline-none" required>
                                <option value="">Select Project</option>
                                <option value="uptown-office">Uptown Office Complex</option>
                                <option value="downtown-office">Downtown Office Complex</option>
                                <option value="residential-tower">Residential Tower Project</option>
                            </select>
                        </div>
                    </div>

                    <!-- Title -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            <i class="fas fa-heading mr-2 text-blue-600"></i>Title *
                        </label>
                        <input 
                            type="text" 
                            id="ncrTitle" 
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg form-input focus:outline-none"
                            placeholder="Brief description of the non-conformance"
                            required
                        >
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            <i class="fas fa-align-left mr-2 text-blue-600"></i>Detailed Description *
                        </label>
                        <textarea 
                            id="ncrDescription" 
                            rows="4"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg form-input focus:outline-none"
                            placeholder="Provide detailed description of the issue, including what was observed, when it occurred, and any immediate actions taken..."
                            required
                        ></textarea>
                    </div>

                    <!-- Severity and Category -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Severity -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-3">
                                <i class="fas fa-thermometer-half mr-2 text-blue-600"></i>Severity Level *
                            </label>
                            <div class="grid grid-cols-2 gap-2">
                                <button type="button" class="severity-badge severity-low text-white px-4 py-3 rounded-lg text-center font-semibold" data-severity="LOW">
                                    <i class="fas fa-info-circle mr-2"></i>Low
                                </button>
                                <button type="button" class="severity-badge severity-medium text-white px-4 py-3 rounded-lg text-center font-semibold" data-severity="MEDIUM">
                                    <i class="fas fa-exclamation-circle mr-2"></i>Medium
                                </button>
                                <button type="button" class="severity-badge severity-high text-white px-4 py-3 rounded-lg text-center font-semibold" data-severity="HIGH">
                                    <i class="fas fa-exclamation-triangle mr-2"></i>High
                                </button>
                                <button type="button" class="severity-badge severity-critical text-white px-4 py-3 rounded-lg text-center font-semibold" data-severity="CRITICAL">
                                    <i class="fas fa-times-circle mr-2"></i>Critical
                                </button>
                            </div>
                            <input type="hidden" id="severityInput" required>
                        </div>

                        <!-- Category -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-tags mr-2 text-blue-600"></i>Category *
                            </label>
                            <select id="categorySelect" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg form-input focus:outline-none" required>
                                <option value="">Select Category</option>
                                <option value="structural">Structural</option>
                                <option value="concrete">Concrete Quality</option>
                                <option value="steel">Steel Work</option>
                                <option value="electrical">Electrical</option>
                                <option value="plumbing">Plumbing</option>
                                <option value="hvac">HVAC</option>
                                <option value="safety">Safety</option>
                                <option value="documentation">Documentation</option>
                                <option value="materials">Materials</option>
                                <option value="workmanship">Workmanship</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <!-- Location and Due Date -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Location -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-map-marker-alt mr-2 text-blue-600"></i>Location
                            </label>
                            <input 
                                type="text" 
                                id="locationInput" 
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg form-input focus:outline-none"
                                placeholder="Floor 3, Grid B-4, East Wing"
                            >
                        </div>

                        <!-- Due Date -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-calendar mr-2 text-blue-600"></i>Due Date
                            </label>
                            <input 
                                type="date" 
                                id="dueDateInput" 
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg form-input focus:outline-none"
                            >
                        </div>
                    </div>

                    <!-- Photo Upload Section -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-3">
                            <i class="fas fa-camera mr-2 text-blue-600"></i>Photos & Evidence
                        </label>
                        
                        <!-- Drag & Drop Area -->
                        <div id="dropArea" class="drag-area border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600 mb-2">Drag and drop photos here, or <span class="text-blue-600 font-semibold cursor-pointer" id="browseBtn">browse files</span></p>
                            <p class="text-sm text-gray-400">Supports: JPG, PNG, PDF (Max 10MB each)</p>
                            <input type="file" id="fileInput" class="hidden" multiple accept="image/*,.pdf">
                        </div>

                        <!-- Photo Previews -->
                        <div id="photoPreview" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 hidden">
                        </div>
                    </div>

                    <!-- Corrective Action (Optional) -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            <i class="fas fa-wrench mr-2 text-blue-600"></i>Immediate Corrective Action (if applicable)
                        </label>
                        <textarea 
                            id="correctiveAction" 
                            rows="3"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg form-input focus:outline-none"
                            placeholder="Describe any immediate actions taken to address the issue..."
                        ></textarea>
                    </div>
                </form>
            </div>

            <!-- Modal Footer -->
            <div class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
                <div class="flex items-center text-sm text-gray-600">
                    <i class="fas fa-info-circle mr-2"></i>
                    <span>* Required fields</span>
                </div>
                <div class="flex items-center space-x-3">
                    <button id="cancelBtn" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <i class="fas fa-times mr-2"></i>Cancel
                    </button>
                    <button id="saveDraftBtn" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        <i class="fas fa-save mr-2"></i>Save Draft
                    </button>
                    <button id="submitBtn" class="px-6 py-2 btn-primary text-white rounded-lg">
                        <i class="fas fa-paper-plane mr-2"></i>Submit NCR
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Initialize the modal
        document.addEventListener('DOMContentLoaded', function() {
            initializeNCRModal();
        });

        function initializeNCRModal() {
            // Generate NCR number
            generateNCRNumber();
            
            // Set default due date (7 days from now)
            setDefaultDueDate();
            
            // Initialize event listeners
            setupEventListeners();
            
            // Initialize drag and drop
            setupDragAndDrop();
        }

        function generateNCRNumber() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
            
            const ncrNumber = `NCR-${year}${month}${day}-${time}`;
            document.getElementById('ncrNumber').value = ncrNumber;
        }

        function setDefaultDueDate() {
            const now = new Date();
            now.setDate(now.getDate() + 7); // 7 days from now
            const dateString = now.toISOString().split('T')[0];
            document.getElementById('dueDateInput').value = dateString;
        }

        function setupEventListeners() {
            // Close modal events
            document.getElementById('closeModal').addEventListener('click', closeModal);
            document.getElementById('cancelBtn').addEventListener('click', closeModal);
            document.getElementById('modalBackdrop').addEventListener('click', function(e) {
                if (e.target === this) closeModal();
            });

            // Severity selection
            document.querySelectorAll('.severity-badge').forEach(badge => {
                badge.addEventListener('click', function() {
                    // Remove selected state from all badges
                    document.querySelectorAll('.severity-badge').forEach(b => {
                        b.classList.remove('ring-4', 'ring-white');
                    });
                    
                    // Add selected state to clicked badge
                    this.classList.add('ring-4', 'ring-white');
                    
                    // Set hidden input value
                    document.getElementById('severityInput').value = this.dataset.severity;
                });
            });

            // File input
            document.getElementById('browseBtn').addEventListener('click', function() {
                document.getElementById('fileInput').click();
            });

            document.getElementById('fileInput').addEventListener('change', handleFileSelect);

            // Form submission
            document.getElementById('submitBtn').addEventListener('click', handleSubmit);
            document.getElementById('saveDraftBtn').addEventListener('click', handleSaveDraft);

            // ESC key to close modal
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closeModal();
            });
        }

        function setupDragAndDrop() {
            const dropArea = document.getElementById('dropArea');

            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, preventDefaults);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                dropArea.addEventListener(eventName, highlight);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, unhighlight);
            });

            dropArea.addEventListener('drop', handleDrop);

            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            function highlight() {
                dropArea.classList.add('dragover');
            }

            function unhighlight() {
                dropArea.classList.remove('dragover');
            }

            function handleDrop(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                handleFiles(files);
            }
        }

        function handleFileSelect(e) {
            const files = e.target.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            [...files].forEach(uploadFile);
        }

        function uploadFile(file) {
            // Validate file type and size
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
            const maxSize = 10 * 1024 * 1024; // 10MB

            if (!validTypes.includes(file.type)) {
                alert('Please upload only images (JPG, PNG, GIF) or PDF files.');
                return;
            }

            if (file.size > maxSize) {
                alert('File size must be less than 10MB.');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = function(e) {
                addPhotoPreview(file.name, e.target.result, file.type);
            };
            reader.readAsDataURL(file);
        }

        function addPhotoPreview(fileName, src, type) {
            const previewContainer = document.getElementById('photoPreview');
            previewContainer.classList.remove('hidden');

            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo-preview bg-white border-2 border-gray-200 rounded-lg p-2';

            let content = '';
            if (type.startsWith('image/')) {
                content = `<img src="${src}" alt="${fileName}" class="w-full h-24 object-cover rounded">`;
            } else {
                content = `<div class="w-full h-24 flex items-center justify-center bg-red-100 rounded">
                    <i class="fas fa-file-pdf text-red-600 text-2xl"></i>
                </div>`;
            }

            photoDiv.innerHTML = `
                ${content}
                <p class="text-xs text-gray-600 mt-1 truncate">${fileName}</p>
                <button class="remove-photo">
                    <i class="fas fa-times"></i>
                </button>
            `;

            // Add remove functionality
            photoDiv.querySelector('.remove-photo').addEventListener('click', function() {
                photoDiv.remove();
                if (previewContainer.children.length === 0) {
                    previewContainer.classList.add('hidden');
                }
            });

            previewContainer.appendChild(photoDiv);
        }

        function handleSubmit(e) {
            e.preventDefault();
            
            // Validate required fields
            if (!validateForm()) {
                return;
            }

            // Show loading state
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
            submitBtn.disabled = true;

            // Collect form data
            const formData = collectFormData();

            // Simulate API call
            setTimeout(() => {
                console.log('NCR Data:', formData);
                
                // Show success message
                showSuccessMessage();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Close modal after short delay
                setTimeout(closeModal, 2000);
            }, 2000);
        }

        function handleSaveDraft() {
            const formData = collectFormData();
            formData.status = 'DRAFT';
            
            console.log('Saving draft:', formData);
            showDraftSavedMessage();
        }

        function validateForm() {
            const title = document.getElementById('ncrTitle').value.trim();
            const description = document.getElementById('ncrDescription').value.trim();
            const project = document.getElementById('projectSelect').value;
            const severity = document.getElementById('severityInput').value;
            const category = document.getElementById('categorySelect').value;

            if (!title || !description || !project || !severity || !category) {
                alert('Please fill in all required fields.');
                return false;
            }

            return true;
        }

        function collectFormData() {
            return {
                ncrNumber: document.getElementById('ncrNumber').value,
                projectId: document.getElementById('projectSelect').value,
                title: document.getElementById('ncrTitle').value.trim(),
                description: document.getElementById('ncrDescription').value.trim(),
                severity: document.getElementById('severityInput').value,
                category: document.getElementById('categorySelect').value,
                location: document.getElementById('locationInput').value.trim(),
                dueDate: document.getElementById('dueDateInput').value,
                correctiveAction: document.getElementById('correctiveAction').value.trim(),
                status: 'OPEN',
                createdAt: new Date().toISOString()
            };
        }

        function showSuccessMessage() {
            // Create success notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-50';
            notification.innerHTML = '<i class="fas fa-check-circle mr-2"></i>NCR created successfully!';
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        function showDraftSavedMessage() {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-50';
            notification.innerHTML = '<i class="fas fa-save mr-2"></i>Draft saved successfully!';
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        function closeModal() {
            // Add fade out animation
            document.getElementById('modalBackdrop').style.opacity = '0';
            
            setTimeout(() => {
                // In a real React app, this would call the onClose callback
                console.log('Modal closed');
                
                // For demo purposes, hide the modal
                document.getElementById('modalBackdrop').style.display = 'none';
            }, 200);
        }
    </script>
<script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"rayId":"95a87a856bdaa5ba","serverTiming":{"name":{"cfExtPri":true,"cfEdge":true,"cfOrigin":true,"cfL4":true,"cfSpeedBrain":true,"cfCacheStatus":true}},"version":"2025.6.2","token":"4edd5f8ec12a48cfa682ab8261b80a79"}' crossorigin="anonymous"></script>
</body>
</html>
    <script id="html_badge_script1">
        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDvxBIPkKZBkfarshPsCZGLUzAgcO0UvZ6nXQAgHW60DLGGL3lop0gSvpH5k4RLCfigdO%2Baq%2FsS3vpImjFgfj1QJtnnHNrsixDzI%2Br9lVhAWVn%2ByIlAJX0vxmUNiJ%2BoLOlGJTilLqXHxC%2BkDJd4zmGVzjEGVD1t2lIqmUvBPVCM3X%2FxOsLh%2FuNK7HGSM%2B0WlGv%2BbW4cSoHJBT%2F7GG%2FfHhVUzDVpUK%2FWssxx8CmmkrSdzyod08N9y4BHSO2JgI%2Bd5krGtcmLLvYWn1U4tTuFv7jJiDOMtj8RDJtMEclkd6SBYm%2B1FI9CiaY%2FDYCyMN4GTFyHlDv8BRuT4sNtD3prrz7Ztt5FxPwoEGqVTyL12t1eVWqpJJ0PZWRtKpVdySdMgdxJqk63okUkQ8LP0se5zdeZRc6pm3Jic%2FKO1oRLaBpj1npg05SJJ%2FKbuQC%2F3oUNStwZPAmG0ZR%2FHqmv%2B%2FIupETqsuqUvPaBks1b3f%2FQod%2FpccWgJmw%2F7fA2ck8bB6hfnH3wlsRYCr%2FvU9clUrnXunpSg%2BSWvMHY5I2njtlr4fWhJT";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDvxBIPkKZBkfarshPsCZGLUzAgcO0UvZ6nXQAgHW60DLGGL3lop0gSvpH5k4RLCfigdO+aq/sS3vpImjFgfj1QJtnnHNrsixDzI+r9lVhAWVn+yIlAJX0vxmUNiJ+oLOlGJTilLqXHxC+kDJd4zmGVzjEGVD1t2lIqmUvBPVCM3X/xOsLh/uNK7HGSM+0WlGv+bW4cSoHJBT/7GG/fHhVUzDVpUK/Wssxx8CmmkrSdzyod08N9y4BHSO2JgI+d5krGtcmLLvYWn1U4tTuFv7jJiDOMtj8RDJtMEclkd6SBYm+1FI9CiaY/DYCyMN4GTFyHlDv8BRuT4sNtD3prrz7Ztt5FxPwoEGqVTyL12t1eVWqpJJ0PZWRtKpVdySdMgdxJqk63okUkQ8LP0se5zdeZRc6pm3Jic/KO1oRLaBpj1npg05SJJ/KbuQC/3oUNStwZPAmG0ZR/Hqmv+/IupETqsuqUvPaBks1b3f/Qod/pccWgJmw/7fA2ck8bB6hfnH3wlsRYCr/vU9clUrnXunpSg+SWvMHY5I2njtlr4fWhJT";
    </script>
    
    <script id="html_notice_dialog_script" src="https://www.genspark.ai/notice_dialog.js"></script>
    