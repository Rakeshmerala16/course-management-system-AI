// AI-Enhanced Course Management System with Complete Fixes
class CourseManagementSystem {
    constructor() {
        this.data = {
            courses: [],
            students: [],
            instructors: [],
            categories: [],
            enrollments: [],
            aiSettings: {
                enabled: true,
                autoRecommendations: true,
                autoDescriptions: true,
                smartSuggestions: true,
                predictiveAnalytics: true,
                confidenceThreshold: 0.7
            }
        };
        
        this.currentSection = 'dashboard';
        this.autoSaveInterval = null;
        this.lastSaveTime = null;
        this.aiEnabled = true;
        this.charts = {};
        
        this.storageKeys = {
            primary: 'edumanage_ai_data',
            backup: 'edumanage_ai_backup',
            temp: 'edumanage_ai_temp'
        };
        
        // AI simulation responses
        this.aiResponses = {
            descriptions: {
                'Programming': [
                    'Master the fundamentals of modern programming with hands-on projects and real-world applications.',
                    'Develop advanced programming skills through comprehensive theory and practical implementation.',
                    'Build robust applications using industry-standard practices and cutting-edge technologies.'
                ],
                'Data Science': [
                    'Transform raw data into actionable insights using advanced analytics and machine learning.',
                    'Master statistical analysis and predictive modeling for data-driven decision making.',
                    'Develop expertise in data visualization and interpretation for business intelligence.'
                ],
                'Marketing': [
                    'Create compelling marketing strategies that drive engagement and business growth.',
                    'Master digital marketing channels and analytics to optimize campaign performance.',
                    'Develop brand awareness and customer acquisition through proven marketing methodologies.'
                ],
                'Design': [
                    'Create stunning visual experiences that engage users and communicate effectively.',
                    'Master design principles and tools to build professional-grade creative solutions.',
                    'Develop aesthetic sensibility and technical skills for impactful design work.'
                ]
            },
            recommendations: {
                courses: [
                    { reason: 'Based on enrollment patterns', confidence: 0.89 },
                    { reason: 'Complementary skill development', confidence: 0.85 },
                    { reason: 'Career advancement pathway', confidence: 0.78 },
                    { reason: 'Industry demand trends', confidence: 0.92 }
                ]
            }
        };
        
        // Initialize immediately if DOM is ready, otherwise wait
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            // Use setTimeout to ensure DOM is fully rendered
            setTimeout(() => this.init(), 0);
        }
    }

    // Initialize the application
    init() {
        console.log('🚀 Initializing EduManage Pro AI...');
        this.setupDataPersistence();
        this.loadData();
        this.renderDashboard();
        this.showSection('dashboard');
        this.initializeAI();
        this.updateDataStatus('🤖 AI-Powered • Data Synced');
        this.updateAllDropdowns();
        
        // Bind events after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.bindEvents();
            this.startAutoSave();
        }, 100);
    }

    // Enhanced Data Persistence System
    setupDataPersistence() {
        this.storageAvailable = this.testStorageAvailability();
        console.log('📦 Storage Available:', this.storageAvailable);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveData(true);
        });
        
        // Save when page becomes hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveData(true);
            }
        });

        // Save on form changes with debouncing
        this.setupAutoSaveOnChanges();
    }

    setupAutoSaveOnChanges() {
        let saveTimeout;
        const debouncedSave = () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => this.saveData(), 2000);
        };

        // Monitor form inputs
        document.addEventListener('input', debouncedSave);
        document.addEventListener('change', debouncedSave);
    }

    testStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('⚠️ localStorage not available:', e);
            return false;
        }
    }

    loadData() {
        try {
            let data = this.loadFromStorage(this.storageKeys.primary);
            
            if (!data) {
                console.log('📥 Loading from backup...');
                data = this.loadFromStorage(this.storageKeys.backup);
            }
            
            if (!data) {
                console.log('📥 Loading initial data...');
                data = this.getInitialData();
                this.saveData();
            }
            
            this.data = { ...this.data, ...data };
            this.validateAndRepairData();
            this.updateEnrollmentCounts();
            this.lastSaveTime = Date.now();
            
            console.log('✅ Data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.showToast('Error loading data. Using default dataset.', 'error');
            this.data = { ...this.data, ...this.getInitialData() };
            this.saveData();
        }
    }

    loadFromStorage(key) {
        if (!this.storageAvailable) return null;
        
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && typeof parsed === 'object' && 
                    parsed.courses && parsed.students && parsed.instructors) {
                    return parsed;
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to load from ${key}:`, error);
        }
        
        return null;
    }

    saveData(force = false) {
        if (!this.storageAvailable) {
            console.warn('⚠️ Storage not available, data not saved');
            return false;
        }

        try {
            this.updateDataStatus('💾 Saving...', 'saving');
            
            const dataString = JSON.stringify(this.data);
            const now = Date.now();
            
            // Primary save
            localStorage.setItem(this.storageKeys.primary, dataString);
            
            // Backup save (every 5 minutes or on force)
            if (force || !this.lastSaveTime || (now - this.lastSaveTime > 300000)) {
                localStorage.setItem(this.storageKeys.backup, dataString);
                console.log('💾 Backup created');
            }
            
            this.lastSaveTime = now;
            this.updateDataStatus('🤖 AI-Powered • Data Synced');
            
            console.log('💾 Data saved successfully');
            return true;
        } catch (error) {
            console.error('❌ Error saving data:', error);
            this.updateDataStatus('❌ Save Error', 'error');
            this.showToast('Error saving data. Please try again.', 'error');
            return false;
        }
    }

    startAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setInterval(() => {
            this.saveData();
        }, 30000); // Save every 30 seconds
        
        console.log('⏰ Auto-save started (30s intervals)');
    }

    validateAndRepairData() {
        console.log('🔧 Validating data integrity...');
        
        // Ensure all arrays exist
        if (!Array.isArray(this.data.courses)) this.data.courses = [];
        if (!Array.isArray(this.data.students)) this.data.students = [];
        if (!Array.isArray(this.data.instructors)) this.data.instructors = [];
        if (!Array.isArray(this.data.categories)) this.data.categories = [];
        if (!Array.isArray(this.data.enrollments)) this.data.enrollments = [];
        
        // Ensure AI settings exist
        if (!this.data.aiSettings) {
            this.data.aiSettings = {
                enabled: true,
                autoRecommendations: true,
                autoDescriptions: true,
                smartSuggestions: true,
                predictiveAnalytics: true,
                confidenceThreshold: 0.7
            };
        }
        
        // Repair course data
        this.data.courses.forEach((course, index) => {
            if (!course.id) course.id = index + 1;
            if (course.aiGenerated === undefined) course.aiGenerated = false;
            if (course.popularity === undefined) course.popularity = Math.floor(Math.random() * 40) + 60;
            if (!course.tags) course.tags = [];
        });
        
        // Repair student data
        this.data.students.forEach((student, index) => {
            if (!student.id) student.id = index + 1;
            if (!Array.isArray(student.courses)) student.courses = [];
            if (!student.level) student.level = 'Beginner';
            if (!student.interests) student.interests = [];
            if (!student.aiRecommendations) student.aiRecommendations = [];
            if (!student.learningPath) student.learningPath = [];
        });
        
        // Repair instructor data
        this.data.instructors.forEach((instructor, index) => {
            if (!instructor.id) instructor.id = index + 1;
            if (!Array.isArray(instructor.courses)) instructor.courses = [];
            if (!Array.isArray(instructor.expertise)) {
                instructor.expertise = typeof instructor.expertise === 'string' 
                    ? instructor.expertise.split(',').map(s => s.trim())
                    : [];
            }
            if (instructor.aiOptimized === undefined) instructor.aiOptimized = false;
            if (!instructor.availability) instructor.availability = [];
            if (instructor.rating === undefined) instructor.rating = Math.round((Math.random() * 1 + 4) * 10) / 10;
        });
        
        // Repair enrollment data
        this.data.enrollments = this.data.enrollments.filter(enrollment => {
            const hasValidStudent = this.data.students.some(s => s.id === enrollment.studentId);
            const hasValidCourse = this.data.courses.some(c => c.id === enrollment.courseId);
            
            // Add missing properties
            if (enrollment.aiSuggested === undefined) enrollment.aiSuggested = Math.random() > 0.7;
            if (enrollment.progress === undefined) enrollment.progress = Math.floor(Math.random() * 100);
            
            return hasValidStudent && hasValidCourse;
        });
        
        console.log('✅ Data integrity validated and repaired');
    }

    updateEnrollmentCounts() {
        this.data.courses.forEach(course => {
            course.enrolled = this.data.enrollments.filter(
                enrollment => enrollment.courseId === course.id && enrollment.status === 'Active'
            ).length;
        });
    }

    updateDataStatus(message, type = 'success') {
        const statusElement = document.getElementById('data-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = type === 'error' ? 'error' : type === 'saving' ? 'saving' : '';
        }
    }

    // AI SYSTEM INITIALIZATION
    initializeAI() {
        console.log('🤖 Initializing AI system...');
        this.aiEnabled = this.data.aiSettings.enabled;
        this.updateAIStatus();
        this.generateDashboardInsights();
        
        setTimeout(() => {
            this.addRecentActivity('🤖 AI System', 'AI-powered recommendations activated', 'Just now');
        }, 1000);
    }

    updateAIStatus() {
        const statusElement = document.getElementById('ai-status');
        if (statusElement) {
            statusElement.textContent = this.aiEnabled ? '🤖 AI: ON' : '🤖 AI: OFF';
        }
        
        const toggleButton = document.querySelector('.ai-toggle');
        if (toggleButton) {
            toggleButton.className = this.aiEnabled ? 'btn btn--sm btn--outline ai-toggle' : 'btn btn--sm btn--outline ai-toggle disabled';
        }
    }

    toggleAI() {
        this.aiEnabled = !this.aiEnabled;
        this.data.aiSettings.enabled = this.aiEnabled;
        this.updateAIStatus();
        this.saveData();
        
        const message = this.aiEnabled ? 'AI system activated' : 'AI system deactivated';
        this.showToast(message, this.aiEnabled ? 'success' : 'warning');
        
        if (this.aiEnabled) {
            this.generateDashboardInsights();
        }
    }

    // AI DESCRIPTION GENERATION
    async generateAIDescription() {
        if (!this.aiEnabled) {
            this.showToast('AI system is disabled', 'warning');
            return;
        }

        const courseName = document.getElementById('courseName').value.trim();
        const courseCategory = document.getElementById('courseCategory').value;
        const courseLevel = document.getElementById('courseLevel').value;

        if (!courseName || !courseCategory || !courseLevel) {
            this.showToast('Please fill in course name, category, and level first', 'warning');
            return;
        }

        this.showAIProcessing('Generating course description...');

        try {
            // Simulate AI processing delay
            await this.delay(2000);

            const descriptions = this.aiResponses.descriptions[courseCategory] || this.aiResponses.descriptions['Programming'];
            const baseDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
            
            const levelModifiers = {
                'Beginner': 'Perfect for those new to the field, this course provides a solid foundation and step-by-step guidance.',
                'Intermediate': 'Building on fundamental knowledge, this course dives deeper into advanced concepts and practical applications.',
                'Advanced': 'Designed for experienced practitioners, this course covers cutting-edge techniques and industry best practices.'
            };

            const aiDescription = `${baseDescription} ${levelModifiers[courseLevel]} Through interactive lessons, real-world projects, and expert instruction, you'll develop the skills needed to excel in ${courseCategory.toLowerCase()}.`;

            document.getElementById('courseDescription').value = aiDescription;
            
            // Show AI indicator
            const indicator = document.getElementById('description-ai-indicator');
            const confidence = document.getElementById('description-confidence');
            if (indicator && confidence) {
                confidence.textContent = `${Math.floor(Math.random() * 15 + 85)}%`;
                indicator.classList.remove('hidden');
            }

            this.hideAIProcessing();
            this.showToast('AI description generated successfully!', 'success');

        } catch (error) {
            this.hideAIProcessing();
            this.showToast('Error generating AI description', 'error');
            console.error('AI Description Error:', error);
        }
    }

    async generateInstructorBio() {
        if (!this.aiEnabled) {
            this.showToast('AI system is disabled', 'warning');
            return;
        }

        const instructorName = document.getElementById('instructorName').value.trim();
        const department = document.getElementById('instructorDepartment').value;
        const experience = document.getElementById('instructorExperience').value;
        const expertise = document.getElementById('instructorExpertise').value.trim();

        if (!instructorName || !department || !experience) {
            this.showToast('Please fill in basic instructor information first', 'warning');
            return;
        }

        this.showAIProcessing('Generating instructor bio...');

        try {
            await this.delay(1500);

            const templates = [
                `${instructorName} is a dedicated ${department.toLowerCase()} professional with ${experience} years of industry experience. Specializing in ${expertise || 'various technologies'}, they bring real-world expertise and passion for education to create engaging learning experiences.`,
                `With ${experience} years in ${department.toLowerCase()}, ${instructorName} combines deep technical knowledge with exceptional teaching skills. Their expertise in ${expertise || 'industry practices'} helps students bridge the gap between theory and practical application.`,
                `${instructorName} is an experienced educator and ${department.toLowerCase()} expert with ${experience} years of professional experience. Known for their innovative teaching methods and expertise in ${expertise || 'emerging technologies'}, they inspire students to achieve their full potential.`
            ];

            const aiBio = templates[Math.floor(Math.random() * templates.length)];
            document.getElementById('instructorBio').value = aiBio;

            this.hideAIProcessing();
            this.showToast('AI bio generated successfully!', 'success');

        } catch (error) {
            this.hideAIProcessing();
            this.showToast('Error generating AI bio', 'error');
            console.error('AI Bio Error:', error);
        }
    }

    // AI RECOMMENDATIONS
    generateCourseRecommendations(studentId) {
        if (!this.aiEnabled) return [];

        const student = this.data.students.find(s => s.id === studentId);
        if (!student) return [];

        const enrolledCourseIds = student.courses || [];
        const availableCourses = this.data.courses.filter(course => 
            !enrolledCourseIds.includes(course.id) && 
            course.status === 'Active' &&
            course.enrolled < course.capacity
        );

        const recommendations = availableCourses
            .map(course => {
                const reasons = this.aiResponses.recommendations.courses;
                const reason = reasons[Math.floor(Math.random() * reasons.length)];
                
                return {
                    course,
                    reason: reason.reason,
                    confidence: reason.confidence + (Math.random() * 0.1 - 0.05)
                };
            })
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 3);

        return recommendations;
    }

    updateEnrollmentRecommendations() {
        if (!this.aiEnabled) return;

        const studentId = parseInt(document.getElementById('enrollmentStudent').value);
        if (!studentId) return;

        const recommendations = this.generateCourseRecommendations(studentId);
        const container = document.getElementById('enrollment-ai-suggestions');

        if (container && recommendations.length > 0) {
            container.innerHTML = `
                <h4>🤖 AI Recommendations</h4>
                ${recommendations.map(rec => `
                    <div class="ai-recommendation-item">
                        <div class="ai-recommendation-content">
                            <div class="ai-recommendation-title">${rec.course.name}</div>
                            <div class="ai-recommendation-reason">${rec.reason}</div>
                        </div>
                        <div class="ai-confidence-score">${Math.round(rec.confidence * 100)}%</div>
                    </div>
                `).join('')}
            `;
        }
    }

    generateDashboardInsights() {
        if (!this.aiEnabled) return;

        setTimeout(() => {
            // Course insights
            const coursesInsight = document.getElementById('courses-insight');
            if (coursesInsight) {
                const insights = [
                    '📈 +12% enrollment growth',
                    '🔥 High demand detected',
                    '💡 3 new courses recommended',
                    '⭐ 95% satisfaction rate'
                ];
                coursesInsight.textContent = insights[Math.floor(Math.random() * insights.length)];
            }

            // Student insights
            const studentsInsight = document.getElementById('students-insight');
            if (studentsInsight) {
                const insights = [
                    '🎯 85% completion rate',
                    '📚 Avg 2.3 courses/student',
                    '🏆 78% skill improvement',
                    '💪 Active learner base'
                ];
                studentsInsight.textContent = insights[Math.floor(Math.random() * insights.length)];
            }

            // Instructor insights
            const instructorsInsight = document.getElementById('instructors-insight');
            if (instructorsInsight) {
                const insights = [
                    '⭐ 4.8 avg rating',
                    '👥 Optimal class sizes',
                    '🚀 High performance team',
                    '📊 Great feedback scores'
                ];
                instructorsInsight.textContent = insights[Math.floor(Math.random() * insights.length)];
            }

            // Enrollment insights
            const enrollmentsInsight = document.getElementById('enrollments-insight');
            if (enrollmentsInsight) {
                const insights = [
                    '🎯 92% retention rate',
                    '📈 Steady growth trend',
                    '💼 Career-focused paths',
                    '🔄 High re-enrollment'
                ];
                enrollmentsInsight.textContent = insights[Math.floor(Math.random() * insights.length)];
            }

            // Dashboard recommendations
            this.generateDashboardRecommendations();
        }, 500);
    }

    generateDashboardRecommendations() {
        const container = document.getElementById('ai-dashboard-recommendations');
        if (!container) return;

        const recommendations = [
            {
                title: 'Optimize Course Scheduling',
                description: 'AI detected optimal time slots for higher engagement',
                confidence: 89
            },
            {
                title: 'Expand Programming Courses',
                description: 'High demand detected in web development category',
                confidence: 94
            },
            {
                title: 'Instructor Workload Balance',
                description: 'Redistribute courses for better teaching quality',
                confidence: 76
            }
        ];

        container.innerHTML = `
            <h4>🤖 AI Strategic Recommendations</h4>
            ${recommendations.map(rec => `
                <div class="ai-recommendation-item">
                    <div class="ai-recommendation-content">
                        <div class="ai-recommendation-title">${rec.title}</div>
                        <div class="ai-recommendation-reason">${rec.description}</div>
                    </div>
                    <div class="ai-confidence-score">${rec.confidence}%</div>
                </div>
            `).join('')}
        `;
    }

    // ANALYTICS DASHBOARD
    initializeCharts() {
        this.createPopularityChart();
    }

    createPopularityChart() {
        const ctx = document.getElementById('popularityChart');
        if (!ctx) return;

        const courseNames = this.data.courses.map(course => course.name.length > 20 ? 
            course.name.substring(0, 20) + '...' : course.name);
        const popularityData = this.data.courses.map(course => course.popularity || Math.floor(Math.random() * 40) + 60);

        if (this.charts.popularity) {
            this.charts.popularity.destroy();
        }

        this.charts.popularity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: courseNames,
                datasets: [{
                    label: 'Course Popularity',
                    data: popularityData,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                    borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: '🤖 AI-Powered Course Analytics'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // CRITICAL FIX: CENTRALIZED DROPDOWN UPDATE SYSTEM
    updateAllDropdowns() {
        console.log('🔄 Updating all dropdowns...');
        
        // Update course instructor dropdown
        this.updateCourseInstructorDropdown();
        
        // Update enrollment student dropdown
        this.updateEnrollmentStudentDropdown();
        
        // Update enrollment course dropdown
        this.updateEnrollmentCourseDropdown();
        
        // Update filter dropdowns
        this.updateFilterDropdowns();
        
        console.log('✅ All dropdowns updated');
    }

    updateCourseInstructorDropdown() {
        const select = document.getElementById('courseInstructor');
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select Instructor</option>' +
                this.data.instructors.filter(i => i.status === 'Active').map(instructor => 
                    `<option value="${instructor.id}">${instructor.name}</option>`
                ).join('');
            
            // Restore selection if still valid
            if (currentValue && this.data.instructors.some(i => i.id === parseInt(currentValue))) {
                select.value = currentValue;
            }
        }
    }

    updateEnrollmentStudentDropdown() {
        const select = document.getElementById('enrollmentStudent');
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select Student</option>' +
                this.data.students.filter(s => s.status === 'Active').map(student => 
                    `<option value="${student.id}">${student.name}</option>`
                ).join('');
            
            if (currentValue && this.data.students.some(s => s.id === parseInt(currentValue))) {
                select.value = currentValue;
            }
        }
    }

    updateEnrollmentCourseDropdown() {
        const select = document.getElementById('enrollmentCourse');
        if (select) {
            const currentValue = select.value;
            const activeCourses = this.data.courses.filter(c => c.status === 'Active' && c.enrolled < c.capacity);
            select.innerHTML = '<option value="">Select Course</option>' +
                activeCourses.map(course => 
                    `<option value="${course.id}">${course.name} (${course.capacity - course.enrolled} spots left)</option>`
                ).join('');
            
            if (currentValue && activeCourses.some(c => c.id === parseInt(currentValue))) {
                select.value = currentValue;
            }
        }
    }

    updateFilterDropdowns() {
        const courseFilter = document.getElementById('enrollment-course-filter');
        if (courseFilter) {
            const currentValue = courseFilter.value;
            courseFilter.innerHTML = '<option value="">All Courses</option>' + 
                this.data.courses.map(course => `<option value="${course.id}">${course.name}</option>`).join('');
            
            if (currentValue && this.data.courses.some(c => c.id === parseInt(currentValue))) {
                courseFilter.value = currentValue;
            }
        }
    }

    // EVENT BINDING - FIXED
    bindEvents() {
        console.log('🔗 Binding events...');
        
        try {
            // Navigation events - FIXED
            const navBtns = document.querySelectorAll('.nav-btn');
            console.log('Found nav buttons:', navBtns.length);
            
            navBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = e.target.dataset.section;
                    console.log('Navigation clicked:', section);
                    this.showSection(section);
                });
            });

            // Form events - FIXED
            const courseForm = document.getElementById('courseForm');
            if (courseForm) {
                courseForm.addEventListener('submit', (e) => this.handleCourseForm(e));
            }
            
            const studentForm = document.getElementById('studentForm');
            if (studentForm) {
                studentForm.addEventListener('submit', (e) => this.handleStudentForm(e));
            }
            
            const instructorForm = document.getElementById('instructorForm');
            if (instructorForm) {
                instructorForm.addEventListener('submit', (e) => this.handleInstructorForm(e));
            }
            
            const enrollmentForm = document.getElementById('enrollmentForm');
            if (enrollmentForm) {
                enrollmentForm.addEventListener('submit', (e) => this.handleEnrollmentForm(e));
            }

            // Search and filter events
            this.bindSearchFilters();

            console.log('✅ Events bound successfully');
        } catch (error) {
            console.error('❌ Error binding events:', error);
        }
    }

    bindSearchFilters() {
        const elements = [
            'course-search', 'course-category-filter', 'course-status-filter',
            'student-search', 'student-status-filter',
            'instructor-search', 'instructor-department-filter',
            'enrollment-search', 'enrollment-course-filter'
        ];

        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const eventType = element.tagName === 'INPUT' ? 'input' : 'change';
                element.addEventListener(eventType, () => {
                    if (id.includes('course')) this.filterCourses();
                    else if (id.includes('student')) this.filterStudents();
                    else if (id.includes('instructor')) this.filterInstructors();
                    else if (id.includes('enrollment')) this.filterEnrollments();
                });
            }
        });
    }

    // SECTION NAVIGATION - FIXED
    showSection(sectionName) {
        console.log('📍 Showing section:', sectionName);
        
        try {
            // Update navigation
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            const activeBtn = document.querySelector(`[data-section="${sectionName}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }

            // Update sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            this.currentSection = sectionName;

            // Render section content
            switch (sectionName) {
                case 'dashboard':
                    this.renderDashboard();
                    break;
                case 'courses':
                    this.renderCourses();
                    break;
                case 'students':
                    this.renderStudents();
                    break;
                case 'instructors':
                    this.renderInstructors();
                    break;
                case 'enrollments':
                    this.renderEnrollments();
                    break;
            }
            
            console.log('✅ Section switched successfully');
        } catch (error) {
            console.error('❌ Error switching section:', error);
        }
    }

    // RENDER METHODS
    renderDashboard() {
        document.getElementById('total-courses').textContent = this.data.courses.length;
        document.getElementById('total-students').textContent = this.data.students.length;
        document.getElementById('total-instructors').textContent = this.data.instructors.length;
        document.getElementById('total-enrollments').textContent = 
            this.data.enrollments.filter(e => e.status === 'Active').length;

        this.generateDashboardInsights();
        setTimeout(() => this.initializeCharts(), 100);
    }

    renderCourses() {
        this.updateAllDropdowns();
        this.displayCourses(this.data.courses);
    }

    displayCourses(courses) {
        const grid = document.getElementById('courses-grid');
        
        if (courses.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <h3>No courses found</h3>
                    <p>Start by adding your first course</p>
                    <button class="btn btn--primary" onclick="cms.addCourse()">Add Course</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = courses.map(course => {
            const aiClass = course.aiGenerated ? 'ai-generated' : '';
            const aiIcon = course.aiGenerated ? '<span class="ai-badge">AI-GENERATED</span>' : '';
            
            return `
                <div class="course-card ${aiClass}">
                    <div class="course-header">
                        <h3 class="course-title">${course.name}</h3>
                        <p class="course-instructor">by ${course.instructor}</p>
                        ${aiIcon}
                    </div>
                    <div class="course-body">
                        <p class="course-description">${course.description}</p>
                        <div class="course-meta">
                            <div class="course-meta-item">
                                <div class="course-meta-label">Category</div>
                                <div class="course-meta-value">${course.category}</div>
                            </div>
                            <div class="course-meta-item">
                                <div class="course-meta-label">Level</div>
                                <div class="course-meta-value">${course.level}</div>
                            </div>
                            <div class="course-meta-item">
                                <div class="course-meta-label">Duration</div>
                                <div class="course-meta-value">${course.duration}</div>
                            </div>
                            <div class="course-meta-item">
                                <div class="course-meta-label">Enrolled</div>
                                <div class="course-meta-value">${course.enrolled}/${course.capacity}</div>
                            </div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${Math.min((course.enrolled / course.capacity) * 100, 100)}%"></div>
                        </div>
                        <div class="progress-text">${Math.round((course.enrolled / course.capacity) * 100)}% capacity</div>
                        <div style="margin-top: 12px;">
                            <span class="status status--${course.status.toLowerCase()}">${course.status}</span>
                            ${course.popularity ? `<span class="ai-confidence" style="margin-left: 8px;">🔥 ${course.popularity}% popular</span>` : ''}
                        </div>
                    </div>
                    <div class="course-footer">
                        <div class="course-price">$${course.price}</div>
                        <div class="course-actions">
                            <button class="btn-icon btn-edit" onclick="cms.editCourse(${course.id})" title="Edit Course">✏️</button>
                            <button class="btn-icon btn-delete" onclick="cms.deleteCourse(${course.id})" title="Delete Course">🗑️</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderStudents() {
        this.displayStudents(this.data.students);
    }

    displayStudents(students) {
        const grid = document.getElementById('students-grid');
        
        if (students.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <h3>No students found</h3>
                    <p>Start by adding your first student</p>
                    <button class="btn btn--primary" onclick="cms.addStudent()">Add Student</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = students.map(student => {
            const enrolledCourses = student.courses.map(courseId => {
                const course = this.data.courses.find(c => c.id === courseId);
                return course ? course.name : 'Unknown Course';
            }).filter(name => name !== 'Unknown Course');

            const aiRecommendations = this.generateCourseRecommendations(student.id);

            return `
                <div class="student-card">
                    <div class="student-header">
                        <div class="student-avatar">${student.name.charAt(0).toUpperCase()}</div>
                        <div class="student-info">
                            <h3>${student.name}</h3>
                            <p class="student-email">${student.email}</p>
                        </div>
                    </div>
                    <div class="student-details">
                        <div class="student-detail">
                            <span class="student-detail-label">Phone:</span>
                            <span class="student-detail-value">${student.phone}</span>
                        </div>
                        <div class="student-detail">
                            <span class="student-detail-label">Level:</span>
                            <span class="student-detail-value">${student.level || 'Beginner'}</span>
                        </div>
                        <div class="student-detail">
                            <span class="student-detail-label">Status:</span>
                            <span class="status status--${student.status.toLowerCase()}">${student.status}</span>
                        </div>
                    </div>
                    <div class="student-courses">
                        <h4>Enrolled Courses (${enrolledCourses.length})</h4>
                        <div class="course-tags">
                            ${enrolledCourses.length > 0 
                                ? enrolledCourses.map(course => `<span class="course-tag">${course}</span>`).join('')
                                : '<span class="course-tag" style="opacity: 0.6;">No courses enrolled</span>'
                            }
                        </div>
                    </div>
                    ${this.aiEnabled && aiRecommendations.length > 0 ? `
                        <div class="ai-recommendations">
                            <h4>🤖 AI Recommendations</h4>
                            ${aiRecommendations.slice(0, 2).map(rec => `
                                <div class="recommended-course" onclick="cms.quickEnroll(${student.id}, ${rec.course.id})">
                                    ${rec.course.name} (${Math.round(rec.confidence * 100)}% match)
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="student-actions">
                        <button class="btn-icon btn-edit" onclick="cms.editStudent(${student.id})" title="Edit Student">✏️</button>
                        <button class="btn-icon btn-delete" onclick="cms.deleteStudent(${student.id})" title="Delete Student">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderInstructors() {
        this.displayInstructors(this.data.instructors);
    }

    displayInstructors(instructors) {
        const grid = document.getElementById('instructors-grid');
        
        if (instructors.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">👨‍🏫</div>
                    <h3>No instructors found</h3>
                    <p>Start by adding your first instructor</p>
                    <button class="btn btn--primary" onclick="cms.addInstructor()">Add Instructor</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = instructors.map(instructor => {
            const assignedCourses = instructor.courses ? 
                instructor.courses.map(courseId => {
                    const course = this.data.courses.find(c => c.id === courseId);
                    return course ? course.name : null;
                }).filter(name => name !== null) : [];

            const avatarContent = instructor.profileImage ? 
                `<img src="${instructor.profileImage}" alt="${instructor.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                 <span style="display: none;">${instructor.name.charAt(0).toUpperCase()}</span>` :
                instructor.name.charAt(0).toUpperCase();

            return `
                <div class="instructor-card">
                    <div class="instructor-header">
                        <div class="instructor-avatar">${avatarContent}</div>
                        <div class="instructor-info">
                            <h3>${instructor.name}</h3>
                            <p class="instructor-department">${instructor.department}</p>
                            <p class="instructor-experience">${instructor.experience} years experience</p>
                            ${instructor.rating ? `<div style="margin-top: 4px;">⭐ ${instructor.rating}/5.0</div>` : ''}
                        </div>
                    </div>
                    <div class="instructor-body">
                        ${instructor.bio ? `<p class="instructor-bio">${instructor.bio}</p>` : ''}
                        
                        <div class="instructor-expertise">
                            <h4>Expertise</h4>
                            <div class="expertise-tags">
                                ${instructor.expertise.map(skill => 
                                    `<span class="expertise-tag">${skill}</span>`
                                ).join('')}
                            </div>
                        </div>
                        
                        <div class="instructor-courses">
                            <h4>Assigned Courses (${assignedCourses.length})</h4>
                            <div class="course-tags">
                                ${assignedCourses.length > 0 
                                    ? assignedCourses.map(course => `<span class="course-tag">${course}</span>`).join('')
                                    : '<span class="course-tag" style="opacity: 0.6;">No courses assigned</span>'
                                }
                            </div>
                        </div>
                        
                        <div class="instructor-contact">
                            <div class="instructor-contact-item">
                                <span>📧</span> ${instructor.email}
                            </div>
                            ${instructor.phone ? `
                                <div class="instructor-contact-item">
                                    <span>📞</span> ${instructor.phone}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="instructor-footer">
                        <div class="instructor-status">
                            <span class="status status--${instructor.status.toLowerCase()}">${instructor.status}</span>
                            ${instructor.aiOptimized ? '<span class="ai-badge">AI-OPTIMIZED</span>' : ''}
                        </div>
                        <div class="instructor-actions">
                            <button class="btn-icon btn-edit" onclick="cms.editInstructor(${instructor.id})" title="Edit Instructor">✏️</button>
                            <button class="btn-icon btn-delete" onclick="cms.deleteInstructor(${instructor.id})" title="Delete Instructor">🗑️</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderEnrollments() {
        this.updateAllDropdowns();
        this.displayEnrollments(this.data.enrollments);
    }

    displayEnrollments(enrollments) {
        const tbody = document.querySelector('#enrollments-table tbody');
        
        if (enrollments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <div class="empty-state-icon">✅</div>
                        <h3>No enrollments found</h3>
                        <p>Start by creating your first enrollment</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = enrollments.map(enrollment => {
            const student = this.data.students.find(s => s.id === enrollment.studentId);
            const course = this.data.courses.find(c => c.id === enrollment.courseId);
            const instructor = course ? this.data.instructors.find(i => i.id === course.instructorId) : null;
            
            const progress = enrollment.progress || 0;
            const aiIcon = enrollment.aiSuggested ? '🤖' : '';
            
            return `
                <tr>
                    <td>${student ? student.name : 'Unknown Student'}</td>
                    <td>${course ? course.name : 'Unknown Course'} ${aiIcon}</td>
                    <td>${instructor ? instructor.name : 'Unassigned'}</td>
                    <td>${enrollment.enrollmentDate}</td>
                    <td>
                        <div class="progress" style="width: 100px;">
                            <div class="progress-bar" style="width: ${progress}%"></div>
                        </div>
                        <small>${progress}%</small>
                    </td>
                    <td><span class="status status--${enrollment.status.toLowerCase()}">${enrollment.status}</span></td>
                    <td>
                        <button class="btn-icon btn-delete" onclick="cms.unenrollStudent(${enrollment.studentId}, ${enrollment.courseId})" title="Unenroll">❌</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // CRUD OPERATIONS - FIXED
    addCourse() {
        this.resetCourseForm();
        document.getElementById('courseModalTitle').textContent = 'Add New Course';
        document.getElementById('courseSubmitBtn').textContent = 'Add Course';
        this.updateAllDropdowns();
        showModal('courseModal');
    }

    addStudent() {
        this.resetStudentForm();
        document.getElementById('studentModalTitle').textContent = 'Add New Student';
        document.getElementById('studentSubmitBtn').textContent = 'Add Student';
        showModal('studentModal');
    }

    addInstructor() {
        this.resetInstructorForm();
        document.getElementById('instructorModalTitle').textContent = 'Add New Instructor';
        document.getElementById('instructorSubmitBtn').textContent = 'Add Instructor';
        showModal('instructorModal');
    }

    editCourse(id) {
        const course = this.data.courses.find(c => c.id === id);
        if (!course) return;

        this.updateAllDropdowns();

        document.getElementById('courseId').value = course.id;
        document.getElementById('courseName').value = course.name;
        document.getElementById('courseDescription').value = course.description;
        document.getElementById('courseInstructor').value = course.instructorId || '';
        document.getElementById('courseCategory').value = course.category;
        document.getElementById('courseCapacity').value = course.capacity;
        document.getElementById('coursePrice').value = course.price;
        document.getElementById('courseStartDate').value = course.startDate;
        document.getElementById('courseEndDate').value = course.endDate;
        document.getElementById('courseDuration').value = course.duration;
        document.getElementById('courseLevel').value = course.level;
        document.getElementById('courseStatus').value = course.status;

        // Show AI indicator if applicable
        const indicator = document.getElementById('description-ai-indicator');
        if (indicator && course.aiGenerated) {
            indicator.classList.remove('hidden');
        }

        document.getElementById('courseModalTitle').textContent = 'Edit Course';
        document.getElementById('courseSubmitBtn').textContent = 'Update Course';
        showModal('courseModal');
    }

    editStudent(id) {
        const student = this.data.students.find(s => s.id === id);
        if (!student) return;

        document.getElementById('studentId').value = student.id;
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentEmail').value = student.email;
        document.getElementById('studentPhone').value = student.phone;
        document.getElementById('studentAddress').value = student.address || '';
        document.getElementById('studentLevel').value = student.level || 'Beginner';
        document.getElementById('studentStatus').value = student.status;
        document.getElementById('studentInterests').value = (student.interests || []).join(', ');

        document.getElementById('studentModalTitle').textContent = 'Edit Student';
        document.getElementById('studentSubmitBtn').textContent = 'Update Student';
        showModal('studentModal');
    }

    editInstructor(id) {
        const instructor = this.data.instructors.find(i => i.id === id);
        if (!instructor) return;

        document.getElementById('instructorId').value = instructor.id;
        document.getElementById('instructorName').value = instructor.name;
        document.getElementById('instructorEmail').value = instructor.email;
        document.getElementById('instructorPhone').value = instructor.phone || '';
        document.getElementById('instructorDepartment').value = instructor.department;
        document.getElementById('instructorExpertise').value = instructor.expertise.join(', ');
        document.getElementById('instructorExperience').value = instructor.experience;
        document.getElementById('instructorStatus').value = instructor.status;
        document.getElementById('instructorBio').value = instructor.bio || '';

        document.getElementById('instructorModalTitle').textContent = 'Edit Instructor';
        document.getElementById('instructorSubmitBtn').textContent = 'Update Instructor';
        showModal('instructorModal');
    }

    deleteCourse(id) {
        const course = this.data.courses.find(c => c.id === id);
        if (!course) return;

        this.showConfirmModal(
            `Are you sure you want to delete "${course.name}"? This will also remove all related enrollments.`,
            () => {
                this.data.courses = this.data.courses.filter(c => c.id !== id);
                this.data.enrollments = this.data.enrollments.filter(e => e.courseId !== id);
                this.data.students.forEach(student => {
                    student.courses = student.courses.filter(courseId => courseId !== id);
                });
                
                this.updateAllDropdowns();
                this.saveData();
                this.renderCourses();
                this.showToast('Course deleted successfully', 'error');
                this.addRecentActivity('🗑️ Course Deleted', `"${course.name}" removed from system`, 'Just now');
                hideModal('confirmModal');
            }
        );
    }

    deleteStudent(id) {
        const student = this.data.students.find(s => s.id === id);
        if (!student) return;

        this.showConfirmModal(
            `Are you sure you want to delete "${student.name}"? This will also remove all their enrollments.`,
            () => {
                this.data.students = this.data.students.filter(s => s.id !== id);
                this.data.enrollments = this.data.enrollments.filter(e => e.studentId !== id);
                this.updateEnrollmentCounts();
                
                this.updateAllDropdowns();
                this.saveData();
                this.renderStudents();
                this.showToast('Student deleted successfully', 'error');
                this.addRecentActivity('🗑️ Student Removed', `"${student.name}" removed from system`, 'Just now');
                hideModal('confirmModal');
            }
        );
    }

    deleteInstructor(id) {
        const instructor = this.data.instructors.find(i => i.id === id);
        if (!instructor) return;

        const assignedCourses = this.data.courses.filter(c => c.instructorId === id);
        
        const message = assignedCourses.length > 0 
            ? `"${instructor.name}" is assigned to ${assignedCourses.length} course(s). Deleting this instructor will unassign them from all courses. Are you sure?`
            : `Are you sure you want to delete instructor "${instructor.name}"?`;

        this.showConfirmModal(message, () => {
            this.data.instructors = this.data.instructors.filter(i => i.id !== id);
            
            this.data.courses.forEach(course => {
                if (course.instructorId === id) {
                    course.instructorId = null;
                    course.instructor = 'Unassigned';
                }
            });
            
            this.updateAllDropdowns();
            this.saveData();
            this.renderInstructors();
            this.showToast(`Instructor "${instructor.name}" deleted successfully`, 'error');
            this.addRecentActivity('🗑️ Instructor Removed', `"${instructor.name}" removed from system`, 'Just now');
            hideModal('confirmModal');
        });
    }

    // FORM HANDLERS
    handleCourseForm(e) {
        e.preventDefault();
        
        const instructorId = parseInt(document.getElementById('courseInstructor').value);
        const instructor = this.data.instructors.find(i => i.id === instructorId);
        
        const courseData = {
            name: document.getElementById('courseName').value.trim(),
            description: document.getElementById('courseDescription').value.trim(),
            instructorId: instructorId,
            instructor: instructor ? instructor.name : 'Unknown Instructor',
            category: document.getElementById('courseCategory').value,
            capacity: parseInt(document.getElementById('courseCapacity').value),
            price: parseFloat(document.getElementById('coursePrice').value),
            startDate: document.getElementById('courseStartDate').value,
            endDate: document.getElementById('courseEndDate').value,
            duration: document.getElementById('courseDuration').value.trim(),
            level: document.getElementById('courseLevel').value,
            status: document.getElementById('courseStatus').value,
            enrolled: 0,
            aiGenerated: !document.getElementById('description-ai-indicator').classList.contains('hidden'),
            popularity: Math.floor(Math.random() * 40) + 60,
            tags: []
        };

        const courseId = document.getElementById('courseId').value;
        
        if (courseId) {
            const index = this.data.courses.findIndex(c => c.id === parseInt(courseId));
            if (index !== -1) {
                courseData.id = parseInt(courseId);
                courseData.enrolled = this.data.courses[index].enrolled;
                this.data.courses[index] = courseData;
                this.showToast('Course updated successfully');
                this.addRecentActivity('✏️ Course Updated', `"${courseData.name}" modified`, 'Just now');
            }
        } else {
            courseData.id = this.getNextId(this.data.courses);
            this.data.courses.push(courseData);
            
            if (instructor) {
                if (!instructor.courses.includes(courseData.id)) {
                    instructor.courses.push(courseData.id);
                }
            }
            
            this.showToast('Course added successfully');
            this.addRecentActivity('➕ New Course', `"${courseData.name}" added to catalog`, 'Just now');
        }

        this.updateAllDropdowns();
        this.saveData();
        this.renderCourses();
        hideModal('courseModal');
    }

    handleStudentForm(e) {
        e.preventDefault();
        
        const interests = document.getElementById('studentInterests').value.trim();
        const interestsArray = interests ? interests.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
        
        const studentData = {
            name: document.getElementById('studentName').value.trim(),
            email: document.getElementById('studentEmail').value.trim(),
            phone: document.getElementById('studentPhone').value.trim(),
            address: document.getElementById('studentAddress').value.trim(),
            level: document.getElementById('studentLevel').value,
            status: document.getElementById('studentStatus').value,
            interests: interestsArray,
            courses: [],
            enrollmentDate: new Date().toISOString().split('T')[0]
        };

        const studentId = document.getElementById('studentId').value;
        
        if (studentId) {
            const index = this.data.students.findIndex(s => s.id === parseInt(studentId));
            if (index !== -1) {
                studentData.id = parseInt(studentId);
                studentData.courses = this.data.students[index].courses;
                studentData.enrollmentDate = this.data.students[index].enrollmentDate;
                this.data.students[index] = studentData;
                this.showToast('Student updated successfully');
                this.addRecentActivity('✏️ Student Updated', `"${studentData.name}" profile modified`, 'Just now');
            }
        } else {
            studentData.id = this.getNextId(this.data.students);
            this.data.students.push(studentData);
            this.showToast('Student added successfully');
            this.addRecentActivity('👤 New Student', `"${studentData.name}" enrolled in system`, 'Just now');
        }

        this.updateAllDropdowns();
        this.saveData();
        this.renderStudents();
        hideModal('studentModal');
    }

    handleInstructorForm(e) {
        e.preventDefault();
        
        const expertiseString = document.getElementById('instructorExpertise').value.trim();
        const expertiseArray = expertiseString ? 
            expertiseString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0) : [];

        const instructorData = {
            name: document.getElementById('instructorName').value.trim(),
            email: document.getElementById('instructorEmail').value.trim(),
            phone: document.getElementById('instructorPhone').value.trim(),
            department: document.getElementById('instructorDepartment').value,
            expertise: expertiseArray,
            experience: parseInt(document.getElementById('instructorExperience').value),
            status: document.getElementById('instructorStatus').value,
            bio: document.getElementById('instructorBio').value.trim(),
            courses: [],
            joinDate: new Date().toISOString().split('T')[0],
            rating: Math.round((Math.random() * 1 + 4) * 10) / 10,
            aiOptimized: false
        };

        const instructorId = document.getElementById('instructorId').value;
        
        if (instructorId) {
            const index = this.data.instructors.findIndex(i => i.id === parseInt(instructorId));
            if (index !== -1) {
                instructorData.id = parseInt(instructorId);
                instructorData.courses = this.data.instructors[index].courses || [];
                instructorData.joinDate = this.data.instructors[index].joinDate;
                instructorData.rating = this.data.instructors[index].rating;
                this.data.instructors[index] = instructorData;
                
                this.data.courses.forEach(course => {
                    if (course.instructorId === instructorData.id) {
                        course.instructor = instructorData.name;
                    }
                });
                
                this.showToast('Instructor updated successfully');
                this.addRecentActivity('✏️ Instructor Updated', `"${instructorData.name}" profile modified`, 'Just now');
            }
        } else {
            instructorData.id = this.getNextId(this.data.instructors);
            this.data.instructors.push(instructorData);
            this.showToast('Instructor added successfully');
            this.addRecentActivity('👨‍🏫 New Instructor', `"${instructorData.name}" joined faculty`, 'Just now');
        }

        this.updateAllDropdowns();
        this.saveData();
        this.renderInstructors();
        hideModal('instructorModal');
    }

    handleEnrollmentForm(e) {
        e.preventDefault();
        
        const studentId = parseInt(document.getElementById('enrollmentStudent').value);
        const courseId = parseInt(document.getElementById('enrollmentCourse').value);

        const existingEnrollment = this.data.enrollments.find(
            e => e.studentId === studentId && e.courseId === courseId && e.status === 'Active'
        );

        if (existingEnrollment) {
            this.showToast('Student is already enrolled in this course', 'error');
            return;
        }

        const course = this.data.courses.find(c => c.id === courseId);
        if (course && course.enrolled >= course.capacity) {
            this.showToast('Course is at full capacity', 'error');
            return;
        }

        this.data.enrollments.push({
            studentId,
            courseId,
            enrollmentDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            progress: 0,
            aiSuggested: false
        });

        const student = this.data.students.find(s => s.id === studentId);
        if (student && !student.courses.includes(courseId)) {
            student.courses.push(courseId);
        }

        this.updateEnrollmentCounts();
        this.updateAllDropdowns();
        this.saveData();
        this.renderEnrollments();
        
        const studentName = student ? student.name : 'Student';
        const courseName = course ? course.name : 'Course';
        this.showToast('Student enrolled successfully');
        this.addRecentActivity('✅ New Enrollment', `${studentName} enrolled in ${courseName}`, 'Just now');
        hideModal('enrollmentModal');
    }

    quickEnroll(studentId, courseId) {
        const student = this.data.students.find(s => s.id === studentId);
        const course = this.data.courses.find(c => c.id === courseId);
        
        if (!student || !course) return;

        const existingEnrollment = this.data.enrollments.find(
            e => e.studentId === studentId && e.courseId === courseId && e.status === 'Active'
        );

        if (existingEnrollment) {
            this.showToast('Student is already enrolled in this course', 'warning');
            return;
        }

        if (course.enrolled >= course.capacity) {
            this.showToast('Course is at full capacity', 'error');
            return;
        }

        this.data.enrollments.push({
            studentId,
            courseId,
            enrollmentDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            progress: 0,
            aiSuggested: true
        });

        if (!student.courses.includes(courseId)) {
            student.courses.push(courseId);
        }

        this.updateEnrollmentCounts();
        this.saveData();
        this.renderStudents();
        
        this.showToast(`${student.name} enrolled in ${course.name} via AI recommendation!`, 'success');
        this.addRecentActivity('🤖 AI Enrollment', `${student.name} enrolled in ${course.name} (AI-suggested)`, 'Just now');
    }

    unenrollStudent(studentId, courseId) {
        const student = this.data.students.find(s => s.id === studentId);
        const course = this.data.courses.find(c => c.id === courseId);

        this.showConfirmModal(
            `Are you sure you want to unenroll ${student?.name} from ${course?.name}?`,
            () => {
                this.data.enrollments = this.data.enrollments.filter(
                    e => !(e.studentId === studentId && e.courseId === courseId)
                );

                if (student) {
                    student.courses = student.courses.filter(id => id !== courseId);
                }

                this.updateEnrollmentCounts();
                this.saveData();
                this.renderEnrollments();
                this.showToast('Student unenrolled successfully', 'warning');
                this.addRecentActivity('❌ Unenrollment', `${student?.name} unenrolled from ${course?.name}`, 'Just now');
                hideModal('confirmModal');
            }
        );
    }

    // FILTER METHODS
    filterCourses() {
        const searchTerm = document.getElementById('course-search').value.toLowerCase();
        const categoryFilter = document.getElementById('course-category-filter').value;
        const statusFilter = document.getElementById('course-status-filter').value;

        const filteredCourses = this.data.courses.filter(course => {
            const matchesSearch = course.name.toLowerCase().includes(searchTerm) ||
                                course.instructor.toLowerCase().includes(searchTerm) ||
                                course.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || course.category === categoryFilter;
            const matchesStatus = !statusFilter || course.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        this.displayCourses(filteredCourses);
    }

    filterStudents() {
        const searchTerm = document.getElementById('student-search').value.toLowerCase();
        const statusFilter = document.getElementById('student-status-filter').value;

        const filteredStudents = this.data.students.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm) ||
                                student.email.toLowerCase().includes(searchTerm) ||
                                student.phone.includes(searchTerm);
            const matchesStatus = !statusFilter || student.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        this.displayStudents(filteredStudents);
    }

    filterInstructors() {
        const searchTerm = document.getElementById('instructor-search').value.toLowerCase();
        const departmentFilter = document.getElementById('instructor-department-filter').value;

        const filteredInstructors = this.data.instructors.filter(instructor => {
            const matchesSearch = instructor.name.toLowerCase().includes(searchTerm) ||
                                instructor.email.toLowerCase().includes(searchTerm) ||
                                instructor.department.toLowerCase().includes(searchTerm) ||
                                instructor.expertise.some(skill => skill.toLowerCase().includes(searchTerm));
            const matchesDepartment = !departmentFilter || instructor.department === departmentFilter;

            return matchesSearch && matchesDepartment;
        });

        this.displayInstructors(filteredInstructors);
    }

    filterEnrollments() {
        const searchTerm = document.getElementById('enrollment-search').value.toLowerCase();
        const courseFilter = document.getElementById('enrollment-course-filter').value;

        const filteredEnrollments = this.data.enrollments.filter(enrollment => {
            const student = this.data.students.find(s => s.id === enrollment.studentId);
            const course = this.data.courses.find(c => c.id === enrollment.courseId);
            
            const matchesSearch = (student && student.name.toLowerCase().includes(searchTerm)) ||
                                (course && course.name.toLowerCase().includes(searchTerm));
            const matchesCourse = !courseFilter || enrollment.courseId === parseInt(courseFilter);

            return matchesSearch && matchesCourse;
        });

        this.displayEnrollments(filteredEnrollments);
    }

    // UTILITY METHODS
    resetCourseForm() {
        const form = document.getElementById('courseForm');
        if (form) form.reset();
        document.getElementById('courseId').value = '';
        
        // Hide AI indicator
        const indicator = document.getElementById('description-ai-indicator');
        if (indicator) indicator.classList.add('hidden');
    }

    resetStudentForm() {
        const form = document.getElementById('studentForm');
        if (form) form.reset();
        document.getElementById('studentId').value = '';
        document.getElementById('studentLevel').value = 'Beginner';
    }

    resetInstructorForm() {
        const form = document.getElementById('instructorForm');
        if (form) form.reset();
        document.getElementById('instructorId').value = '';
    }

    getNextId(array) {
        return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
    }

    showConfirmModal(message, onConfirm) {
        const messageEl = document.getElementById('confirmMessage');
        const confirmBtn = document.getElementById('confirmBtn');
        
        if (messageEl) messageEl.textContent = message;
        if (confirmBtn) confirmBtn.onclick = onConfirm;
        
        showModal('confirmModal');
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toast.className = `toast ${type}`;
            toastMessage.textContent = message;
            toast.classList.remove('hidden');

            setTimeout(() => {
                toast.classList.add('hidden');
            }, 4000);
        }
    }

    showAIProcessing(message) {
        const overlay = document.getElementById('ai-overlay');
        const messageEl = document.getElementById('ai-process-message');
        
        if (overlay && messageEl) {
            messageEl.textContent = message;
            overlay.classList.remove('hidden');
        }
    }

    hideAIProcessing() {
        const overlay = document.getElementById('ai-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    addRecentActivity(icon, text, time) {
        const container = document.getElementById('recent-activity');
        if (!container) return;

        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <span class="activity-icon">${icon}</span>
            <div class="activity-content">
                <p>${text}</p>
                <small>${time}</small>
            </div>
        `;

        container.insertBefore(activityItem, container.firstChild);

        // Keep only last 5 activities
        while (container.children.length > 5) {
            container.removeChild(container.lastChild);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // EXPORT/IMPORT
    exportData() {
        try {
            const dataToExport = {
                ...this.data,
                exportDate: new Date().toISOString(),
                version: '2.0-ai'
            };
            
            const dataStr = JSON.stringify(dataToExport, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `edumanage_ai_export_${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            this.showToast('Data exported successfully');
            this.addRecentActivity('📤 Export', 'Data exported to file', 'Just now');
        } catch (error) {
            console.error('Export error:', error);
            this.showToast('Error exporting data', 'error');
        }
    }

    importData() {
        showModal('importModal');
    }

    processImport() {
        const fileInput = document.getElementById('importFile');
        const textInput = document.getElementById('importData');
        
        let jsonData = textInput.value.trim();
        
        if (!jsonData && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    this.processImportedData(importedData);
                } catch (error) {
                    this.showToast('Invalid JSON file', 'error');
                }
            };
            reader.readAsText(file);
            return;
        }
        
        if (jsonData) {
            try {
                const importedData = JSON.parse(jsonData);
                this.processImportedData(importedData);
            } catch (error) {
                this.showToast('Invalid JSON data', 'error');
            }
        } else {
            this.showToast('Please select a file or paste JSON data', 'warning');
        }
    }

    processImportedData(importedData) {
        try {
            if (importedData.courses && importedData.students && importedData.instructors) {
                this.data = { ...this.data, ...importedData };
                this.validateAndRepairData();
                this.updateEnrollmentCounts();
                this.updateAllDropdowns();
                this.saveData();
                
                this.renderDashboard();
                this.showSection(this.currentSection);
                
                this.showToast('Data imported successfully');
                this.addRecentActivity('📥 Import', 'Data imported from file', 'Just now');
                hideModal('importModal');
            } else {
                this.showToast('Invalid data format', 'error');
            }
        } catch (error) {
            console.error('Import error:', error);
            this.showToast('Error importing data', 'error');
        }
    }

    getInitialData() {
        return {
            "courses": [
                {
                    "id": 1,
                    "name": "Web Development Fundamentals",
                    "description": "Master the foundations of modern web development with hands-on projects. Learn to build responsive, interactive websites using HTML5, CSS3, and JavaScript. This comprehensive course covers industry best practices, modern frameworks, and real-world development workflows that employers demand.",
                    "instructor": "Sarah Johnson",
                    "instructorId": 1,
                    "category": "Programming",
                    "capacity": 30,
                    "enrolled": 25,
                    "startDate": "2025-01-15",
                    "endDate": "2025-03-15",
                    "status": "Active",
                    "duration": "8 weeks",
                    "level": "Beginner",
                    "price": 299,
                    "aiGenerated": false,
                    "popularity": 85,
                    "tags": ["HTML", "CSS", "JavaScript", "Responsive Design"]
                },
                {
                    "id": 2,
                    "name": "Advanced React Development",
                    "description": "Transform your frontend development skills with this comprehensive React masterclass. Build production-ready applications using modern React patterns, hooks, context, and state management. Gain expertise in component architecture, performance optimization, and testing strategies that top companies use.",
                    "instructor": "Michael Chen",
                    "instructorId": 2,
                    "category": "Programming",
                    "capacity": 20,
                    "enrolled": 18,
                    "startDate": "2025-02-01",
                    "endDate": "2025-04-01",
                    "status": "Active",
                    "duration": "10 weeks",
                    "level": "Advanced",
                    "price": 449,
                    "aiGenerated": true,
                    "popularity": 92,
                    "tags": ["React", "JavaScript", "Hooks", "State Management"]
                },
                {
                    "id": 3,
                    "name": "Data Science with Python",
                    "description": "Dive deep into the world of data science with Python. Transform raw data into actionable insights using pandas, numpy, and machine learning algorithms. Build predictive models, create stunning visualizations, and develop the analytical skills needed for data-driven decision making in today's economy.",
                    "instructor": "Dr. Emily Rodriguez",
                    "instructorId": 3,
                    "category": "Data Science",
                    "capacity": 25,
                    "enrolled": 22,
                    "startDate": "2025-01-20",
                    "endDate": "2025-04-20",
                    "status": "Active",
                    "duration": "12 weeks",
                    "level": "Intermediate",
                    "price": 599,
                    "aiGenerated": true,
                    "popularity": 88,
                    "tags": ["Python", "Machine Learning", "Data Analysis", "Statistics"]
                },
                {
                    "id": 4,
                    "name": "Digital Marketing Strategy",
                    "description": "Master digital marketing with this comprehensive strategy course. Learn SEO, social media marketing, content strategy, and analytics to build campaigns that drive real business results. Gain hands-on experience with industry-standard tools and proven methodologies used by top marketing professionals.",
                    "instructor": "Alex Thompson",
                    "instructorId": 4,
                    "category": "Marketing",
                    "capacity": 35,
                    "enrolled": 31,
                    "startDate": "2025-01-10",
                    "endDate": "2025-03-10",
                    "status": "Active",
                    "duration": "8 weeks",
                    "level": "Beginner",
                    "price": 199,
                    "aiGenerated": true,
                    "popularity": 76,
                    "tags": ["SEO", "Social Media", "Content Strategy", "Analytics"]
                },
                {
                    "id": 5,
                    "name": "Mobile App Development",
                    "description": "Build native mobile apps for iOS and Android using React Native. Create cross-platform applications with native performance and user experience. Learn app architecture, navigation, state management, and deployment strategies for successful mobile applications.",
                    "instructor": "James Wilson",
                    "instructorId": 5,
                    "category": "Programming",
                    "capacity": 15,
                    "enrolled": 12,
                    "startDate": "2025-02-15",
                    "endDate": "2025-05-15",
                    "status": "Upcoming",
                    "duration": "14 weeks",
                    "level": "Intermediate",
                    "price": 699,
                    "aiGenerated": false,
                    "popularity": 94,
                    "tags": ["React Native", "Mobile Development", "iOS", "Android"]
                }
            ],
            "students": [
                {
                    "id": 1,
                    "name": "John Smith",
                    "email": "john.smith@email.com",
                    "phone": "+1-555-0101",
                    "enrollmentDate": "2025-01-05",
                    "status": "Active",
                    "courses": [1, 3],
                    "address": "123 Main St, New York, NY",
                    "level": "Intermediate",
                    "interests": ["Programming", "Data Science"],
                    "aiRecommendations": [2, 5],
                    "learningPath": ["Web Development", "Data Science", "Advanced Programming"]
                },
                {
                    "id": 2,
                    "name": "Emma Wilson",
                    "email": "emma.wilson@email.com",
                    "phone": "+1-555-0102",
                    "enrollmentDate": "2025-01-08",
                    "status": "Active",
                    "courses": [1, 2],
                    "address": "456 Oak Ave, Los Angeles, CA",
                    "level": "Beginner",
                    "interests": ["Programming", "Design"],
                    "aiRecommendations": [4, 5],
                    "learningPath": ["Web Development", "Frontend", "Full Stack"]
                },
                {
                    "id": 3,
                    "name": "David Brown",
                    "email": "david.brown@email.com",
                    "phone": "+1-555-0103",
                    "enrollmentDate": "2025-01-12",
                    "status": "Active",
                    "courses": [3, 4],
                    "address": "789 Pine St, Chicago, IL",
                    "level": "Advanced",
                    "interests": ["Data Science", "Marketing"],
                    "aiRecommendations": [2],
                    "learningPath": ["Data Science", "Analytics", "Business Intelligence"]
                },
                {
                    "id": 4,
                    "name": "Sophie Davis",
                    "email": "sophie.davis@email.com",
                    "phone": "+1-555-0104",
                    "enrollmentDate": "2025-01-15",
                    "status": "Active",
                    "courses": [2, 4],
                    "address": "321 Elm St, Houston, TX",
                    "level": "Intermediate",
                    "interests": ["Programming", "Marketing"],
                    "aiRecommendations": [1, 3],
                    "learningPath": ["Frontend Development", "Marketing Tech", "Full Stack"]
                },
                {
                    "id": 5,
                    "name": "Ryan Garcia",
                    "email": "ryan.garcia@email.com",
                    "phone": "+1-555-0105",
                    "enrollmentDate": "2025-01-18",
                    "status": "Active",
                    "courses": [1, 5],
                    "address": "654 Maple Dr, Phoenix, AZ",
                    "level": "Beginner",
                    "interests": ["Programming", "Mobile Development"],
                    "aiRecommendations": [2],
                    "learningPath": ["Web Development", "Mobile Development", "Cross-platform"]
                }
            ],
            "instructors": [
                {
                    "id": 1,
                    "name": "Sarah Johnson",
                    "email": "sarah.johnson@university.edu",
                    "phone": "+1-555-1001",
                    "department": "Computer Science",
                    "expertise": ["HTML", "CSS", "JavaScript", "Web Design", "Frontend Development"],
                    "experience": 8,
                    "bio": "Passionate web developer with 8 years of experience in frontend technologies. Specializes in modern web development practices and responsive design. Former lead developer at top tech companies.",
                    "courses": [1],
                    "status": "Active",
                    "joinDate": "2020-01-15",
                    "profileImage": "https://via.placeholder.com/150/4F46E5/FFFFFF?text=SJ",
                    "rating": 4.8,
                    "aiOptimized": false,
                    "availability": ["Monday", "Wednesday", "Friday"]
                },
                {
                    "id": 2,
                    "name": "Michael Chen",
                    "email": "michael.chen@university.edu",
                    "phone": "+1-555-1002",
                    "department": "Computer Science",
                    "expertise": ["React", "JavaScript", "Node.js", "Frontend Development", "State Management"],
                    "experience": 6,
                    "bio": "React specialist with deep knowledge of modern JavaScript frameworks. Expert in building scalable web applications with cutting-edge technologies. Contributes to open-source React projects.",
                    "courses": [2],
                    "status": "Active",
                    "joinDate": "2021-03-10",
                    "profileImage": "https://via.placeholder.com/150/10B981/FFFFFF?text=MC",
                    "rating": 4.9,
                    "aiOptimized": true,
                    "availability": ["Tuesday", "Thursday", "Saturday"]
                },
                {
                    "id": 3,
                    "name": "Dr. Emily Rodriguez",
                    "email": "emily.rodriguez@university.edu",
                    "phone": "+1-555-1003",
                    "department": "Data Science",
                    "expertise": ["Python", "Machine Learning", "Statistics", "Data Analysis", "AI"],
                    "experience": 12,
                    "bio": "PhD in Data Science with 12 years of research and teaching experience. Expert in machine learning algorithms and statistical analysis with industry experience at Fortune 500 companies.",
                    "courses": [3],
                    "status": "Active",
                    "joinDate": "2018-08-20",
                    "profileImage": "https://via.placeholder.com/150/F59E0B/FFFFFF?text=ER",
                    "rating": 5.0,
                    "aiOptimized": true,
                    "availability": ["Monday", "Tuesday", "Wednesday"]
                },
                {
                    "id": 4,
                    "name": "Alex Thompson",
                    "email": "alex.thompson@university.edu",
                    "phone": "+1-555-1004",
                    "department": "Business",
                    "expertise": ["Digital Marketing", "SEO", "Social Media", "Analytics", "Content Strategy"],
                    "experience": 5,
                    "bio": "Digital marketing expert with 5 years of experience helping businesses grow online. Certified in Google Analytics and Ads with proven track record of successful campaigns.",
                    "courses": [4],
                    "status": "Active",
                    "joinDate": "2022-01-12",
                    "profileImage": "https://via.placeholder.com/150/EF4444/FFFFFF?text=AT",
                    "rating": 4.7,
                    "aiOptimized": false,
                    "availability": ["Thursday", "Friday", "Saturday"]
                },
                {
                    "id": 5,
                    "name": "James Wilson",
                    "email": "james.wilson@university.edu",
                    "phone": "+1-555-1005",
                    "department": "Computer Science",
                    "expertise": ["React Native", "Mobile Development", "iOS", "Android", "Cross-platform"],
                    "experience": 7,
                    "bio": "Mobile development specialist with 7 years of experience building native and cross-platform applications for Fortune 500 companies. Expert in React Native and native mobile technologies.",
                    "courses": [5],
                    "status": "Active",
                    "joinDate": "2020-11-05",
                    "profileImage": "https://via.placeholder.com/150/8B5CF6/FFFFFF?text=JW",
                    "rating": 4.8,
                    "aiOptimized": false,
                    "availability": ["Monday", "Wednesday", "Friday"]
                }
            ],
            "categories": [
                {
                    "id": 1,
                    "name": "Programming",
                    "description": "Software development and programming languages",
                    "color": "#3B82F6",
                    "popularity": 90,
                    "courseCount": 3
                },
                {
                    "id": 2,
                    "name": "Data Science",
                    "description": "Data analysis, machine learning, and statistics",
                    "color": "#10B981",
                    "popularity": 85,
                    "courseCount": 1
                },
                {
                    "id": 3,
                    "name": "Marketing",
                    "description": "Digital marketing, SEO, and business strategy",
                    "color": "#F59E0B",
                    "popularity": 75,
                    "courseCount": 1
                },
                {
                    "id": 4,
                    "name": "Design",
                    "description": "UI/UX design, graphic design, and creative tools",
                    "color": "#EF4444",
                    "popularity": 70,
                    "courseCount": 0
                }
            ],
            "enrollments": [
                {"studentId": 1, "courseId": 1, "enrollmentDate": "2025-01-05", "status": "Active", "aiSuggested": false, "progress": 60},
                {"studentId": 1, "courseId": 3, "enrollmentDate": "2025-01-10", "status": "Active", "aiSuggested": true, "progress": 45},
                {"studentId": 2, "courseId": 1, "enrollmentDate": "2025-01-08", "status": "Active", "aiSuggested": false, "progress": 70},
                {"studentId": 2, "courseId": 2, "enrollmentDate": "2025-01-12", "status": "Active", "aiSuggested": true, "progress": 30},
                {"studentId": 3, "courseId": 3, "enrollmentDate": "2025-01-12", "status": "Active", "aiSuggested": false, "progress": 80},
                {"studentId": 3, "courseId": 4, "enrollmentDate": "2025-01-15", "status": "Active", "aiSuggested": false, "progress": 55},
                {"studentId": 4, "courseId": 2, "enrollmentDate": "2025-01-15", "status": "Active", "aiSuggested": true, "progress": 40},
                {"studentId": 4, "courseId": 4, "enrollmentDate": "2025-01-18", "status": "Active", "aiSuggested": false, "progress": 25},
                {"studentId": 5, "courseId": 1, "enrollmentDate": "2025-01-18", "status": "Active", "aiSuggested": false, "progress": 35},
                {"studentId": 5, "courseId": 5, "enrollmentDate": "2025-01-20", "status": "Active", "aiSuggested": true, "progress": 20}
            ],
            "aiSettings": {
                "enabled": true,
                "autoRecommendations": true,
                "autoDescriptions": true,
                "smartSuggestions": true,
                "predictiveAnalytics": true,
                "confidenceThreshold": 0.7
            }
        };
    }
}

// Global functions for modal management - FIXED
function showModal(modalId) {
    console.log('Showing modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        
        // Focus management
        const firstInput = modal.querySelector('input, select, textarea, button');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    } else {
        console.error('Modal not found:', modalId);
    }
}

function hideModal(modalId) {
    console.log('Hiding modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.add('hidden');
    }
}

// Global CMS instance
let cms;

// Initialize the application - FIXED
console.log('🚀 Script loading...');

function initializeApp() {
    console.log('🚀 Initializing EduManage Pro AI...');
    try {
        cms = new CourseManagementSystem();
        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already ready, initialize immediately
    setTimeout(initializeApp, 0);
}