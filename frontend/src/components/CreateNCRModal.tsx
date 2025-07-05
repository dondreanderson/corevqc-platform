<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create NCR Modal - CoreVQC</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        .modal-overlay {
            backdrop-filter: blur(4px);
        }
        .form-field-error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        .slide-in {
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .fade-in {
            animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">

    <!-- Demo Button -->
    <button onclick="openCreateNCRModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
        <i class="fas fa-plus mr-2"></i>
        Create NCR
    </button>

    <!-- Modal Overlay -->
    <div id="createNCRModal" class="fixed inset-0 bg-black bg-opacity-50 modal-overlay hidden flex items-center justify-center p-4 z-50">
        
        <!-- Modal Content -->
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto slide-in">
            
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
                <div>
                    <h2 class="text-2xl font-bold">Create New NCR</h2>
                    <p class="text-blue-100 mt-1">Non-Conformance Report</p>
                </div>
                <button onclick="closeCreateNCRModal()" class="text-white hover:text-gray-200 transition-colors">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>

            <!-- Form Content -->
            <form id="createNCRForm" class="p-6">
                
                <!-- Auto-generated NCR Number -->
                <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <label class="block text-sm font-medium text-blue-800 mb-2">
                        <i class="fas fa-hashtag mr-2"></i>NCR Number
                    </label>
                    <div class="text-lg font-bold text-blue-900" id="ncrNumber">NCR-001</div>
                    <p class="text-sm text-blue-600 mt-1">Auto-generated unique identifier</p>
                </div>

                <!-- Form Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <!-- Title -->
                    <div class="md:col-span-2">
                        <label for="ncrTitle" class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-heading mr-2 text-blue-600"></i>Title *
                        </label>
                        <input type="text" id="ncrTitle" name="title" required 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                               placeholder="Brief description of the non-conformance">
                        <div class="error-message text-red-600 text-sm mt-1 hidden" id="titleError"></div>
                    </div>

                    <!-- Category -->
                    <div>
                        <label for="ncrCategory" class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-tags mr-2 text-blue-600"></i>Category *
                        </label>
                        <select id="ncrCategory" name="category" required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                            <option value="">Select Category</option>
                            <option value="Quality">Quality</option>
                            <option value="Safety">Safety</option>
                            <option value="Process">Process</option>
                            <option value="Material">Material</option>
                            <option value="Environmental">Environmental</option>
                            <option value="Documentation">Documentation</option>
                            <option value="Equipment">Equipment</option>
                        </select>
                        <div class="error-message text-red-600 text-sm mt-1 hidden" id="categoryError"></div>
                    </div>

                    <!-- Severity -->
                    <div>
                        <label for="ncrSeverity" class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-exclamation-triangle mr-2 text-blue-600"></i>Severity *
                        </label>
                        <select id="ncrSeverity" name="severity" required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                            <option value="">Select Severity</option>
                            <option value="LOW" class="text-green-600">Low</option>
                            <option value="MEDIUM" class="text-yellow-600">Medium</option>
                            <option value="HIGH" class="text-orange-600">High</option>
                            <option value="CRITICAL" class="text-red-600">Critical</option>
                        </select>
                        <div class="error-message text-red-600 text-sm mt-1 hidden" id="severityError"></div>
                    </div>

                    <!-- Location -->
                    <div>
                        <label for="ncrLocation" class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-map-marker-alt mr-2 text-blue-600"></i>Location
                        </label>
                        <input type="text" id="ncrLocation" name="location" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                               placeholder="e.g., Building A, Floor 3, Room 305">
                    </div>

                    <!-- Due Date -->
                    <div>
                        <label for="ncrDueDate" class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-calendar mr-2 text-blue-600"></i>Due Date
                        </label>
                        <input type="date" id="ncrDueDate" name="dueDate" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    </div>
                </div>

                <!-- Description -->
                <div class="mt-6">
                    <label for="ncrDescription" class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-align-left mr-2 text-blue-600"></i>Description *
                    </label>
                    <textarea id="ncrDescription" name="description" rows="4" required 
                              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              placeholder="Detailed description of the non-conformance, including what was observed, when it occurred, and any immediate actions taken..."></textarea>
                    <div class="error-message text-red-600 text-sm mt-1 hidden" id="descriptionError"></div>
                </div>

                <!-- Photo Upload -->
                <div class="mt-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-camera mr-2 text-blue-600"></i>Evidence Photos
                    </label>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <input type="file" id="ncrPhotos" name="photos" multiple accept="image/*" class="hidden">
                        <label for="ncrPhotos" class="cursor-pointer">
                            <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                            <p class="text-gray-600">Click to upload photos or drag and drop</p>
                            <p class="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                        </label>
                        <div id="photoPreview" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 hidden"></div>
                    </div>
                </div>

                <!-- Reported By -->
                <div class="mt-6">
                    <label for="ncrReportedBy" class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-user mr-2 text-blue-600"></i>Reported By *
                    </label>
                    <input type="text" id="ncrReportedBy" name="reportedBy" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                           placeholder="Your name" value="John Smith">
                    <div class="error-message text-red-600 text-sm mt-1 hidden" id="reportedByError"></div>
                </div>

                <!-- Form Actions -->
                <div class="flex items-center justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
                    <button type="button" onclick="closeCreateNCRModal()" 
                            class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                        <i class="fas fa-times mr-2"></i>Cancel
                    </button>
                    <button type="submit" 
                            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <i class="fas fa-save mr-2"></i>Create NCR
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Success Toast -->
    <div id="successToast" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50">
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-3"></i>
            <span>NCR created successfully!</span>
        </div>
    </div>

    <script>
        // Generate NCR Number
        function generateNCRNumber() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `NCR-${year}${month}${day}-${random}`;
        }

        // Set minimum date to today
        function setMinimumDate() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('ncrDueDate').min = today;
        }

        // Open Modal
        function openCreateNCRModal() {
            document.getElementById('createNCRModal').classList.remove('hidden');
            document.getElementById('ncrNumber').textContent = generateNCRNumber();
            setMinimumDate();
            document.body.style.overflow = 'hidden';
        }

        // Close Modal
        function closeCreateNCRModal() {
            document.getElementById('createNCRModal').classList.add('hidden');
            document.getElementById('createNCRForm').reset();
            clearErrors();
            clearPhotoPreview();
            document.body.style.overflow = 'auto';
        }

        // Form Validation
        function validateForm() {
            let isValid = true;
            clearErrors();

            // Title validation
            const title = document.getElementById('ncrTitle').value.trim();
            if (title.length < 5) {
                showError('titleError', 'Title must be at least 5 characters long');
                isValid = false;
            }

            // Category validation
            const category = document.getElementById('ncrCategory').value;
            if (!category) {
                showError('categoryError', 'Please select a category');
                isValid = false;
            }

            // Severity validation
            const severity = document.getElementById('ncrSeverity').value;
            if (!severity) {
                showError('severityError', 'Please select a severity level');
                isValid = false;
            }

            // Description validation
            const description = document.getElementById('ncrDescription').value.trim();
            if (description.length < 20) {
                showError('descriptionError', 'Description must be at least 20 characters long');
                isValid = false;
            }

            // Reported By validation
            const reportedBy = document.getElementById('ncrReportedBy').value.trim();
            if (!reportedBy) {
                showError('reportedByError', 'Please enter who is reporting this NCR');
                isValid = false;
            }

            return isValid;
        }

        // Show validation error
        function showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            const inputElement = errorElement.previousElementSibling;
            
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
            inputElement.classList.add('form-field-error');
        }

        // Clear all errors
        function clearErrors() {
            const errorElements = document.querySelectorAll('.error-message');
            const inputElements = document.querySelectorAll('input, select, textarea');
            
            errorElements.forEach(element => {
                element.classList.add('hidden');
                element.textContent = '';
            });
            
            inputElements.forEach(element => {
                element.classList.remove('form-field-error');
            });
        }

        // Photo upload handling
        document.getElementById('ncrPhotos').addEventListener('change', function(e) {
            const files = e.target.files;
            const preview = document.getElementById('photoPreview');
            
            if (files.length > 0) {
                preview.classList.remove('hidden');
                preview.innerHTML = '';
                
                Array.from(files).forEach((file, index) => {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            img.className = 'w-full h-20 object-cover rounded border';
                            img.alt = `Preview ${index + 1}`;
                            preview.appendChild(img);
                        };
                        reader.readAsDataURL(file);
                    }
                });
            } else {
                preview.classList.add('hidden');
            }
        });

        // Clear photo preview
        function clearPhotoPreview() {
            document.getElementById('photoPreview').classList.add('hidden');
            document.getElementById('photoPreview').innerHTML = '';
        }

        // Show success toast
        function showSuccessToast() {
            const toast = document.getElementById('successToast');
            toast.classList.remove('translate-x-full');
            
            setTimeout(() => {
                toast.classList.add('translate-x-full');
            }, 3000);
        }

        // Form submission
        document.getElementById('createNCRForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Simulate API call
                const formData = new FormData(this);
                const ncrData = {
                    ncrNumber: document.getElementById('ncrNumber').textContent,
                    title: formData.get('title'),
                    category: formData.get('category'),
                    severity: formData.get('severity'),
                    location: formData.get('location'),
                    dueDate: formData.get('dueDate'),
                    description: formData.get('description'),
                    reportedBy: formData.get('reportedBy'),
                    createdAt: new Date().toISOString(),
                    status: 'OPEN'
                };

                console.log('NCR Data:', ncrData);
                
                // Close modal and show success
                closeCreateNCRModal();
                showSuccessToast();
                
                // Here you would normally send the data to your backend
                // fetch('/api/ncrs', { method: 'POST', body: JSON.stringify(ncrData) })
            }
        });

        // Close modal when clicking outside
        document.getElementById('createNCRModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeCreateNCRModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeCreateNCRModal();
            }
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            setMinimumDate();
        });
    </script>
<script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"rayId":"95a95385ebdca3ba","serverTiming":{"name":{"cfExtPri":true,"cfEdge":true,"cfOrigin":true,"cfL4":true,"cfSpeedBrain":true,"cfCacheStatus":true}},"version":"2025.6.2","token":"4edd5f8ec12a48cfa682ab8261b80a79"}' crossorigin="anonymous"></script>
</body>
</html>
    <script id="html_badge_script1">
        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDtFrrvLF08orYqcKP79qEuap3kAZsbBNMeQrstaPQjQW1MJhUy14JAKyNchv%2Bq%2F2LYCLJjJQJ0hFrzA7K2P%2FMOos5MuMXNLhuyw%2FQGA%2F7buOL3J4G84zopeSoH0fhTIZUAEUFCrTzHm9FHaflDFdcLDjzH64Ahzrmx%2Fv1flc3PGv%2FqXJwUnDQTAnsAhd1%2FGOqhDFj0%2BCrYE5%2F0w6dfBd%2Fn8xFtOwGsv10KsSsD88rMOtOeTT863y%2FPZsI5CpDXHYOv7CC%2FkyCRtLwCTblOvW4MwqNSVt4LnIBKR5Gk251maHtx8Iv9zaGfuTBWxuA%2BwIJEd3kBkrxWURRLBXDvBoT2hn3N659PaVcMDmvM5jZJSPXWGt7pv4BRt7RfBWJFf7sR65FOIS12Eix4rvTOwMInTDm0f%2FrY%2F%2BIIH3elY%2FKUk8IXHcaRWLr6sCqqcdsSO%2FfhLBKqAfWqY08LJcg%2FLO0FlPRYPlSPomIQFyhx1Mg9K1wWwTa%2BUgog%2FK%2BbXnM2mwVFqSJrJFPm7ycbl2TPw8D6c%3D";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDtFrrvLF08orYqcKP79qEuap3kAZsbBNMeQrstaPQjQW1MJhUy14JAKyNchv+q/2LYCLJjJQJ0hFrzA7K2P/MOos5MuMXNLhuyw/QGA/7buOL3J4G84zopeSoH0fhTIZUAEUFCrTzHm9FHaflDFdcLDjzH64Ahzrmx/v1flc3PGv/qXJwUnDQTAnsAhd1/GOqhDFj0+CrYE5/0w6dfBd/n8xFtOwGsv10KsSsD88rMOtOeTT863y/PZsI5CpDXHYOv7CC/kyCRtLwCTblOvW4MwqNSVt4LnIBKR5Gk251maHtx8Iv9zaGfuTBWxuA+wIJEd3kBkrxWURRLBXDvBoT2hn3N659PaVcMDmvM5jZJSPXWGt7pv4BRt7RfBWJFf7sR65FOIS12Eix4rvTOwMInTDm0f/rY/+IIH3elY/KUk8IXHcaRWLr6sCqqcdsSO/fhLBKqAfWqY08LJcg/LO0FlPRYPlSPomIQFyhx1Mg9K1wWwTa+Ugog/K+bXnM2mwVFqSJrJFPm7ycbl2TPw8D6c=";
    </script>
    
    <script id="html_notice_dialog_script" src="https://www.genspark.ai/notice_dialog.js"></script>
    