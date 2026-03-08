import { useNavigate } from "react-router-dom";

let navigate = null;

// Initialize navigate function for use outside React components
export const initAssistantEngine = (navigateFunction) => {
  navigate = navigateFunction;
};

// Intent map with keywords, responses, and navigation
const intents = [
  {
    keywords: ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "yo"],
    response: "Hello there! I'm your Waste Management Assistant! I'm here to help you with garbage collection, reporting issues, and navigating the system. What can I assist you with today?",
    actions: [
      { label: "Report Issue", route: "/citizen" },
      { label: "View Dashboard", route: "/login" },
      { label: "Get Help", route: "/login" }
    ]
  },
  {
    keywords: ["how are you", "how you doing", "what's up", "how's it going"],
    response: "I'm doing great, thanks for asking! Ready to help you with any waste management needs. Whether you need to report garbage, check on tasks, or navigate the system - I've got you covered!",
    actions: [
      { label: "Report Garbage", route: "/citizen" },
      { label: "Worker Portal", route: "/worker" },
      { label: "Admin Dashboard", route: "/admin" }
    ]
  },
  {
    keywords: ["thanks", "thank you", "appreciate", "helpful", "great"],
    response: "You're very welcome! I'm always here to help make waste management easier for you. Is there anything else you'd like to know about the system?",
    actions: [
      { label: "Learn More", route: "/citizen" },
      { label: "System Login", route: "/login" }
    ]
  },
  {
    keywords: ["bye", "goodbye", "see you", "exit", "close"],
    response: "Goodbye! Remember, I'm always here if you need help with waste management. Have a great day and keep our community clean!",
    actions: []
  },
  {
    keywords: ["what can you do", "help", "features", "capabilities"],
    response: "I'm your Waste Management Assistant! I can help you:\n• Report garbage issues quickly\n• Navigate to any dashboard\n• Explain system features\n• Track worker assignments\n• View analytics insights\n• Help with login issues\n• Have friendly conversations!\n\nWhat would you like to explore?",
    actions: [
      { label: "Report Garbage", route: "/citizen" },
      { label: "Worker Portal", route: "/worker" },
      { label: "Admin Dashboard", route: "/admin" },
      { label: "System Login", route: "/login" }
    ]
  },
  {
    keywords: ["who are you", "what are you", "name"],
    response: "I'm the Waste Management Assistant - your friendly helper for all things related to garbage collection and waste management! I'm here to make the system easy to use and help you navigate everything smoothly.",
    actions: [
      { label: "Learn System", route: "/citizen" }
    ]
  },
  {
    keywords: ["how to report", "report garbage", "submit report", "how do i report"],
    response: "**Professional Waste Reporting Protocol:**\n\n**Step-by-Step Submission Process:**\n1. **Secure Authentication** - Login with multi-factor authentication\n2. **Intelligent Reporting Interface** - Click 'Submit Professional Report'\n3. **Advanced Location Services** - GPS auto-detection with 3-meter accuracy\n4. **Professional Documentation** - Upload high-resolution photos (max 10MB each)\n5. **Comprehensive Classification** - Industry-standard waste categorization\n6. **Priority Assessment Matrix** - Professional urgency evaluation\n7. **Digital Confirmation** - Instant tracking ID with blockchain verification\n\n**Professional Features:**\n• Real-time validation of submitted data\n• Automatic geofencing for service area verification\n• Professional photo enhancement tools\n• Integration with municipal waste databases\n• Compliance with local environmental regulations\n• Professional audit trail for all submissions",
    actions: [
      { label: "Professional Report", route: "/citizen" },
      { label: "Professional Tracking", route: "/citizen" },
      { label: "Professional Guidelines", route: "/citizen" }
    ]
  },
  {
    keywords: ["what happens after", "after submitting", "report process", "next steps"],
    response: "**Professional Report Processing Workflow:**\n\n**Immediate Response System (0-5 minutes):**\n• **Automated Confirmation** - Digital receipt with cryptographic verification\n• **AI Pre-screening** - Content validation and categorization\n• **Geospatial Analysis** - Location verification and service area confirmation\n• **Priority Scoring** - AI-powered urgency assessment\n\n**Professional Review Phase (5-30 minutes):**\n• **Certified Administrator Review** - Municipal waste management specialists\n• **Resource Allocation Planning** - Optimal worker assignment algorithm\n• **Workload Optimization** - Dynamic scheduling based on real-time data\n• **Stakeholder Notification** - Automated alerts to all relevant parties\n\n**Field Operations Phase (30 mins - 8 hours):**\n• **Precision Assignment** - GPS-optimized worker dispatch\n• **Real-time Communication** - Live updates via secure channels\n• **Route Optimization** - AI-powered navigation with traffic integration\n• **Professional Documentation** - Standardized completion photography\n\n**Quality Assurance & Closure:**\n• **Professional Service Rating** - Industry-standard satisfaction metrics\n• **Performance Analytics** - Real-time KPI tracking\n• **Continuous Improvement** - Machine learning process optimization\n• **Professional Reporting** - Comprehensive audit trail generation",
    actions: [
      { label: "Professional Status Tracking", route: "/citizen" },
      { label: "Professional Analytics", route: "/admin" },
      { label: "Professional Dashboard", route: "/admin" }
    ]
  },
  {
    keywords: ["track status", "track my report", "report status", "where is my report"],
    response: "**Professional Real-Time Tracking System:**\n\n**Secure Access Protocol:**\n• Multi-factor authentication for report access\n• Encrypted tracking links for security\n• Professional dashboard with role-based permissions\n\n**Advanced Status Monitoring:**\n• **Submitted → Under Review** - AI validation in progress\n• **Under Review → Approved** - Professional administrator verification\n• **Approved → Assigned** - Precision worker allocation\n• **Assigned → In Progress** - Real-time field operations\n• **In Progress → Documentation** - Professional completion verification\n• **Documentation → Completed** - Quality assurance approved\n• **Completed → Rated** - Professional service evaluation\n\n**Premium Tracking Features:**\n• **Live GPS Monitoring** - Real-time worker location with 1-meter accuracy\n• **ETA Prediction Engine** - Machine learning arrival time calculations\n• **Professional Communication** - Secure messaging with field teams\n• **Historical Analytics** - Performance trend analysis\n• **Professional Reporting** - Exportable service logs\n• **Stakeholder Portals** - Multi-user access for organizations\n• **Compliance Tracking** - Regulatory requirement monitoring",
    actions: [
      { label: "Professional Tracking Portal", route: "/citizen" },
      { label: "Professional Analytics Dashboard", route: "/admin" },
      { label: "Professional Operations View", route: "/worker" }
    ]
  },
  {
    keywords: ["how long", "collection time", "when will it be collected", "response time"],
    response: " **Professional Service Level Agreement (SLA) Framework:**\n\n** Critical Priority Response:**\n• **Response Time:** 30-60 minutes\n• **Completion Window:** 1-2 hours\n• **Service Level:** 99.5% on-time compliance\n• **Examples:** Public health hazards, blocked emergency routes\n\n** High Priority Service:**\n• **Response Time:** 1-2 hours\n• **Completion Window:** 4-6 hours\n• **Service Level:** 97% on-time compliance\n• **Examples:** Commercial waste, large accumulations\n\n** Standard Priority Operations:**\n• **Response Time:** 2-4 hours\n• **Completion Window:** 8-12 hours\n• **Service Level:** 95% on-time compliance\n• **Examples:** Residential household waste\n\n** Scheduled Service:**\n• **Response Time:** 4-8 hours\n• **Completion Window:** 24 hours\n• **Service Level:** 93% on-time compliance\n• **Examples:** Non-urgent maintenance requests\n\n** Professional Optimization Factors:**\n• **Geospatial Analysis** - Location-based resource allocation\n• **Workforce Management** - Professional staff availability\n• **Weather Intelligence** - Meteorological condition integration\n• **Traffic Analytics** - Real-time route optimization\n• **Volume Assessment** - AI-powered workload prediction\n• **Regulatory Compliance** - Municipal requirement adherence\n\n** Performance Metrics:**\n• Real-time ETA calculations with 95% accuracy\n• Professional dispatch optimization reducing response time by 40%\n• Predictive analytics for resource planning",
    actions: [
      { label: " Professional ETA Tracking", route: "/citizen" },
      { label: " Professional SLA Analytics", route: "/admin" },
      { label: " Professional Service Metrics", route: "/admin" }
    ]
  },
  {
    keywords: ["what information", "report details", "what do i need", "required information"],
    response: " **Professional Report Documentation Requirements:**\n\n** Mandatory Core Data:**\n• ** Geospatial Information** - GPS coordinates (3-meter accuracy)\n• ** Professional Photography** - High-resolution images (1920x1080 minimum)\n• ** Comprehensive Description** - Detailed situational analysis\n• ** Address Verification** - Municipal address validation\n• **� Contact Information** - Secure communication channel\n\n** Professional Classification System:**\n• **Waste Category Matrix** - 12-category classification system\n• **Volume Assessment** - Professional estimation protocols\n• **Hazard Level Evaluation** - OSHA-compliant risk assessment\n• **Environmental Impact Analysis** - Ecological consideration framework\n• **Regulatory Compliance Check** - Local ordinance verification\n\n** Advanced Technical Specifications:**\n• **Image Requirements** - JPEG/PNG, max 10MB, geotagged preferred\n• **Location Accuracy** - Within 3 meters for optimal dispatch\n• **Description Standards** - Minimum 50 characters, professional terminology\n• **Priority Indicators** - Urgency justification with supporting evidence\n• **Accessibility Notes** - Special access requirements or restrictions\n\n** Professional Enhancement Features:**\n• **AI-Powered Validation** - Real-time data quality assessment\n• **Professional Templates** - Industry-standard reporting formats\n• **Bulk Reporting** - Multiple location submission capability\n• **Professional Attachments** - Supporting documentation upload\n• **Compliance Integration** - Municipal database synchronization\n• **Audit Trail Generation** - Professional record keeping",
    actions: [
      { label: " Professional Report Submission", route: "/citizen" },
      { label: " Professional Documentation Guidelines", route: "/citizen" },
      { label: " Professional Standards Manual", route: "/citizen" }
    ]
  },
  {
    keywords: ["anonymous", "anonymous report", "hide identity", "private report"],
    response: " **Professional Anonymous Reporting System:**\n\n** Privacy Protection Framework:**\n• **Identity Protection** - Advanced cryptographic anonymization\n• **Data Minimization** - Only essential information retained\n• **Secure Processing** - GDPR-compliant privacy protocols\n• **Audit Trail Protection** - Immutable privacy logs\n\n** Professional Anonymous Features:**\n• **Zero-Knowledge Reporting** - No personal data stored\n• **Blockchain Verification** - Anonymous tracking IDs\n• **Secure Communication** - Encrypted messaging channels\n• **Professional Service** - Same priority as named reports\n• **Real-Time Updates** - Anonymous status notifications\n• **Quality Assurance** - Professional service standards maintained\n\n** Professional Compliance Standards:**\n• **ISO 27001** - Information security management\n• **GDPR Article 25** - Privacy by design\n• **Local Privacy Laws** - Municipal regulation compliance\n• **Professional Ethics** - Industry best practices\n\n** Professional Service Parity:**\n• **Response Time Equality** - Same SLA as named reports\n• **Quality Assurance** - Identical service standards\n• **Professional Support** - Full access to help resources\n• **Feedback Integration** - Anonymous improvement suggestions\n\n** Professional Enhancement Options:**\n• **Pseudo-Anonymous** - Verified but protected identity\n• **Escalation Protocol** - Emergency contact reveal procedures\n• **Professional Documentation** - Anonymous reporting certificates\n• **Statistical Contribution** - Privacy-preserved data analytics",
    actions: [
      { label: "� Professional Anonymous Report", route: "/citizen" },
      { label: "�️ Professional Privacy Policy", route: "/login" },
      { label: " Professional Compliance Documentation", route: "/login" }
    ]
  },
  {
    keywords: ["upload photos", "add pictures", "how to upload", "photo requirements"],
    response: " **Professional Photo Documentation System:**\n\n** Advanced Technical Specifications:**\n• **Resolution Requirements** - Minimum 1920x1080, Recommended 4K (3840x2160)\n• **Format Support** - JPEG, PNG, HEIC, WebP, RAW formats\n• **File Size Limits** - Maximum 15MB per image, 50MB total per report\n• **Color Accuracy** - sRGB color space, 24-bit minimum\n• **Metadata Requirements** - Geotagging preferred, timestamp mandatory\n\n** Professional Upload Features:**\n• **AI Image Enhancement** - Automatic brightness and contrast optimization\n• **Professional Validation** - Real-time quality assessment\n• **Batch Processing** - Up to 10 images simultaneous upload\n• **Cloud Storage** - Secure CDN with 99.99% uptime\n• **Progress Tracking** - Real-time upload progress indicators\n• **Auto-Backup** - Redundant storage across multiple regions\n\n** Professional Quality Standards:**\n• **Clarity Requirements** - No blur, proper focus, adequate lighting\n• **Composition Guidelines** - Subject matter clearly visible\n• **Scale Reference** - Size comparison objects recommended\n• **Multiple Angles** - 360-degree documentation encouraged\n• **Context Documentation** - Surrounding environment visible\n\n** Advanced Enhancement Tools:**\n• **Professional Filters** - Industry-standard image adjustments\n• **Measurement Tools** - On-screen scale and dimension indicators\n• **Annotation System** - Professional markup capabilities\n• **Before/After Comparison** - Progress documentation features\n• **Professional Watermarking** - Copyright protection options\n• **Integration Ready** - Direct camera app integration\n\n** Professional Security Features:**\n• **End-to-End Encryption** - Military-grade photo protection\n• **Digital Signatures** - Image authenticity verification\n• **Chain of Custody** - Professional audit trail maintenance\n• **Access Control** - Role-based image viewing permissions",
    actions: [
      { label: "� Professional Photo Upload", route: "/citizen" },
      { label: " Professional Photography Guidelines", route: "/citizen" },
      { label: " Professional Quality Standards", route: "/citizen" }
    ]
  },
  {
    keywords: ["urgent report", "emergency", "immediate help", "urgent garbage"],
    response: " **Professional Emergency Response Protocol:**\n\n** Critical Response Framework:**\n• **Immediate Dispatch** - 30-second automated alert system\n• **Priority Resource Allocation** - Elite response team deployment\n• **Real-Time Monitoring** - Live situation assessment\n• **Multi-Agency Coordination** - Emergency services integration\n\n** Emergency Classification System:**\n• **Code Red - Critical** - Life-threatening situations, public health hazards\n• **Code Orange - Urgent** - Infrastructure blockage, environmental contamination\n• **Code Yellow - High** - Significant accumulation, commercial disruption\n• **Code Green - Elevated** - Large-scale residential issues\n\n** Professional Response Teams:**\n• **Elite Rapid Response** - Specialized hazardous materials handling\n• **Heavy Equipment Division** - Industrial-grade cleanup machinery\n• **Environmental Specialists** - Certified contamination experts\n• **Safety Compliance Officers** - OSHA-certified professionals\n\n** Advanced Emergency Features:**\n• **GPS Precision Tracking** - Sub-meter location accuracy\n• **Satellite Imagery** - Real-time aerial assessment\n• **Weather Integration** - Meteorological condition monitoring\n• **Traffic Optimization** - Emergency route priority system\n• **Communication Hub** - Multi-channel emergency coordination\n• **Resource Prediction** - AI-powered requirement forecasting\n\n** Professional Service Guarantees:**\n• **Code Red Response** - 15-30 minutes arrival time\n• **Code Orange Response** - 30-60 minutes arrival time\n• **24/7 Availability** - Round-the-clock emergency operations\n• **Professional Documentation** - Comprehensive incident reporting\n• **Follow-Up Services** - Post-emergency quality assurance\n\n** Emergency Integration Systems:**\n• **Municipal Emergency Services** - Direct 911 coordination\n• **Environmental Protection Agency** - Regulatory compliance reporting\n• **Public Health Department** - Contamination monitoring\n• **Transportation Authorities** - Road closure coordination",
    actions: [
      { label: " Professional Emergency Report", route: "/citizen" },
      { label: " Professional Emergency Hotline", route: "/citizen" },
      { label: " Professional Emergency Protocol", route: "/admin" }
    ]
  },
  {
    keywords: ["cancel report", "delete report", "withdraw report"],
    response: " **Professional Report Management System:**\n\n** Professional Cancellation Protocol:**\n• **Pre-Assignment Cancellation** - Automated self-service available\n• **Post-Assignment Review** - Professional administrator approval required\n• **Emergency Cancellation** - 24/7 professional review team\n• **Audit Trail Maintenance** - Complete cancellation documentation\n\n** Professional Cancellation Tiers:**\n\n**Tier 1: Unassigned Reports (Immediate)**\n• **Self-Service Cancellation** - One-click professional interface\n• **Automated Confirmation** - Instant digital receipt\n• **Resource Impact Analysis** - Real-time system optimization\n• **Professional Documentation** - Cancellation certificate generation\n\n**Tier 2: Assigned Reports (Review Required)**\n• **Administrator Review** - Professional assessment within 30 minutes\n• **Impact Analysis** - Resource reallocation planning\n• **Stakeholder Notification** - Automated team communication\n• **Professional Approval** - Multi-level authorization process\n\n**Tier 3: In-Progress Reports (Emergency Review)**\n• **Supervisor Intervention** - Senior administrator approval\n• **Cost Analysis** - Professional financial impact assessment\n• **Contractual Review** - Service agreement implications\n• **Professional Mediation** - Dispute resolution services\n\n** Professional Cancellation Features:**\n• **Reason Documentation** - Professional improvement analytics\n• **Pattern Recognition** - Cancellation trend analysis\n• **Service Optimization** - Process improvement recommendations\n• **Professional Reporting** - Monthly cancellation analytics\n• **Quality Assurance** - Service level impact assessment\n• **Resource Recovery** - Efficient workforce reallocation\n\n** Professional Compliance Standards:**\n• **Regulatory Adherence** - Municipal code compliance\n• **Contractual Obligations** - Service agreement terms\n• **Professional Ethics** - Industry best practice standards\n• **Audit Requirements** - Complete documentation maintenance",
    actions: [
      { label: " Professional Report Management", route: "/citizen" },
      { label: " Professional Administrator Contact", route: "/admin" },
      { label: " Professional Cancellation Analytics", route: "/admin" }
    ]
  },
  {
    keywords: ["feedback", "rate service", "complaint", "review"],
    response: " **Professional Service Evaluation System:**\n\n** Comprehensive Feedback Framework:**\n• **Multi-Dimensional Rating** - Professional 5-star evaluation system\n• **Qualitative Assessment** - Detailed narrative feedback options\n• **Quantitative Metrics** - Performance indicator measurements\n• **Real-Time Analytics** - Instant service quality monitoring\n\n** Professional Rating Categories:**\n• **Response Time Efficiency** - Dispatch and arrival performance\n• **Service Quality Standards** - Professional execution assessment\n• **Communication Excellence** - Stakeholder interaction evaluation\n• **Problem Resolution** - Issue handling effectiveness\n• **Environmental Impact** - Ecological consideration quality\n• **Safety Compliance** - Professional standard adherence\n\n** Advanced Feedback Features:**\n• **AI-Powered Sentiment Analysis** - Emotional tone assessment\n• **Pattern Recognition** - Service trend identification\n• **Predictive Analytics** - Performance forecasting models\n• **Professional Benchmarking** - Industry standard comparison\n• **Continuous Improvement** - Machine learning optimization\n• **Stakeholder Integration** - Multi-source feedback aggregation\n\n** Professional Response Protocol:**\n• **24-Hour Acknowledgment** - Professional confirmation guarantee\n• **72-Hour Detailed Response** - Comprehensive action plan\n• **Weekly Review Cycle** - Professional quality assessment\n• **Monthly Performance Reports** - Executive summary analytics\n• **Quarterly Strategy Review** - Long-term improvement planning\n\n** Professional Analytics Dashboard:**\n• **Real-Time Monitoring** - Live service quality metrics\n• **Trend Analysis** - Historical performance tracking\n• **Comparative Analytics** - Team and individual benchmarking\n• **Predictive Insights** - AI-powered performance forecasting\n• **Professional Reporting** - Exportable executive summaries\n• **Stakeholder Portals** - Multi-user access interfaces\n\n** Professional Recognition System:**\n• **Performance Excellence Awards** - Monthly recognition programs\n• **Improvement Incentives** - Professional development opportunities\n• **Quality Certifications** - Professional achievement validation\n• **Customer Satisfaction Awards** - Service excellence recognition",
    actions: [
      { label: " Professional Service Rating", route: "/citizen" },
      { label: " Professional Quality Analytics", route: "/admin" },
      { label: " Professional Excellence Portal", route: "/admin" }
    ]
  },
  {
    keywords: ["mobile app", "app download", "android app", "ios app"],
    response: " **Professional Mobile Application Suite:**\n\n** Enterprise-Grade Mobile Platform:**\n• **Cross-Platform Architecture** - Native iOS & Android applications\n• **Progressive Web App** - Browser-based professional interface\n• **Hybrid Technology Stack** - React Native with native performance optimization\n• **Cloud-Native Infrastructure** - AWS-powered backend services\n\n** Professional Technical Specifications:**\n• **iOS Requirements** - iOS 13+ with A12 Bionic chip or higher\n• **Android Requirements** - Android 9.0+ with Snapdragon 845 or equivalent\n• **Memory Requirements** - 4GB RAM minimum, 8GB recommended\n• **Storage Requirements** - 500MB base installation, 2GB with offline cache\n• **Network Requirements** - 4G LTE, 5G compatible, Wi-Fi 6 support\n\n** Professional Feature Suite:**\n• **Real-Time GPS Tracking** - Sub-meter location accuracy\n• **Advanced Camera Integration** - 4K video, 8MP photo capture\n• **Offline Mode Capability** - 72-hour offline operation\n• **Push Notification System** - Enterprise-grade messaging\n• **Biometric Authentication** - Face ID, Touch ID, fingerprint support\n• **Voice Command Integration** - Professional voice-activated controls\n• **Augmented Reality** - AR measurement and visualization tools\n• **Machine Learning Integration** - On-device AI processing\n\n** Professional Performance Features:**\n• **Real-Time Synchronization** - Instant data consistency across devices\n• **Background Processing** - Efficient battery usage optimization\n• **Predictive Caching** - Intelligent offline data preparation\n• **Compression Algorithms** - 70% data reduction for faster loading\n• **Security Framework** - Military-grade encryption standards\n• **Analytics Integration** - Professional usage and performance monitoring\n\n** Professional Deployment Options:**\n• **Public App Stores** - Google Play, Apple App Store, Microsoft Store\n• **Enterprise Distribution** - Private app stores for organizations\n• **Mobile Device Management** - Intune, AirWatch, MobileIron compatibility\n• **Custom White-Labeling** - Branded application solutions\n• **API Integration** - Enterprise system connectivity\n\n** Professional Analytics Dashboard:**\n• **User Engagement Metrics** - Professional usage pattern analysis\n• **Performance Monitoring** - Real-time application health tracking\n• **Crash Reporting** - Automated error detection and reporting\n• **A/B Testing Framework** - Professional feature optimization\n• **Custom Event Tracking** - Business intelligence integration",
    actions: [
      { label: " Professional Mobile Suite", route: "/citizen" },
      { label: "🌐 Professional Web Platform", route: "/citizen" },
      { label: " Professional Technical Specs", route: "/login" }
    ]
  },
  {
    keywords: ["types of waste", "what waste", "categories", "can i report"],
    response: " You can report various waste types: \n•  Household garbage \n•  Construction debris \n•  Garden waste \n•  Abandoned vehicles \n•  Hazardous materials \n•  Liquid waste \n•  Illegal dumping \n\nEach type gets appropriate handling and disposal methods!",
    actions: [
      { label: " Report Waste", route: "/citizen" },
      { label: " Waste Guide", route: "/citizen" }
    ]
  },
  {
    keywords: ["area coverage", "my area", "service area", "location covered"],
    response: " Coverage areas: \n• All urban municipal areas \n• Most suburban regions \n• Select rural locations \n• Check coverage in your profile \n• Expanding to new areas monthly \n\nEnter your address to verify coverage. If not covered, we'll notify you when service starts!",
    actions: [
      { label: " Check Coverage", route: "/citizen" },
      { label: " Service Map", route: "/citizen" }
    ]
  },
  {
    keywords: ["schedule pickup", "regular pickup", "recurring", "subscription"],
    response: " Regular pickup service: \n• Weekly residential collection \n• Commercial daily/weekly options \n• Flexible scheduling \n• Automated reminders \n• Priority support for subscribers \n• Discounted rates for regular service \n\nContact admin to set up custom schedule!",
    actions: [
      { label: " Schedule Pickup", route: "/citizen" },
      { label: " Pricing Plans", route: "/citizen" }
    ]
  },
  {
    keywords: ["contact help", "immediate help", "call support", "human help"],
    response: " Need immediate help? \n• 24/7 Hotline: 1-800-WASTE \n• Live chat in app \n• Email: help@wastemanagement.com \n• Emergency: 911 for hazardous situations \n• Local office: Mon-Fri 8AM-6PM \n\nWe typically respond within 5 minutes during business hours!",
    actions: [
      { label: " Call Support", route: "/citizen" },
      { label: " Live Chat", route: "/citizen" }
    ]
  },
  {
    keywords: ["how system works", "system overview", "process flow", "workflow"],
    response: " System Workflow: \n1️⃣ **Citizens** report issues via app/web \n2️⃣ **AI** moderates content and categorizes \n3️⃣ **Admins** review and assign workers \n4️⃣ **Workers** get optimized routes and tasks \n5️⃣ **GPS** tracks real-time progress \n6️⃣ **Analytics** monitor performance \n7️⃣ **Feedback** loop improves service \n\nAll steps happen in real-time with full transparency!",
    actions: [
      { label: " View Dashboard", route: "/admin" },
      { label: " Learn More", route: "/citizen" }
    ]
  },
  {
    keywords: ["user roles", "different roles", "who can access", "permissions"],
    response: " Three main user roles: \n\n** Citizens:** \n• Submit reports \n• Track status \n• Give feedback \n\n** Workers:** \n• View assigned tasks \n• Update status \n• Upload completion photos \n\n** Administrators:** \n• Manage all reports \n• Assign workers \n• View analytics \n• System settings \n\nEach role has specific permissions for security!",
    actions: [
      { label: " Citizen Portal", route: "/citizen" },
      { label: " Worker Portal", route: "/worker" },
      { label: " Admin Portal", route: "/admin" }
    ]
  },
  {
    keywords: ["worker assignment", "how workers assigned", "assignment process"],
    response: " Smart worker assignment: \n• **Location-based:** Nearest available worker \n• **Skills matching:** Specialized waste types \n• **Workload balance:** Fair distribution \n• **Priority routing:** Urgent reports first \n• **Traffic consideration:** Real-time route optimization \n• **Performance tracking:** Best-rated for priority areas \n\nAI optimizes assignments for maximum efficiency!",
    actions: [
      { label: " Assignment Analytics", route: "/admin" },
      { label: " Worker Dashboard", route: "/worker" }
    ]
  },
  {
    keywords: ["admin capabilities", "what admin can do", "administrator features"],
    response: " Administrator powers: \n•  Real-time analytics dashboard \n•  User management and permissions \n•  Report management and assignment \n•  Service area configuration \n•  Pricing and billing \n•  Performance metrics \n•  System settings \n•  Mobile app management \n•  Workflow automation \n•  Custom reporting",
    actions: [
      { label: " Admin Dashboard", route: "/admin" },
      { label: " Analytics", route: "/admin" }
    ]
  },
  {
    keywords: ["gps tracking", "location tracking", "how gps works"],
    response: "️ GPS Tracking System: \n• **Auto-detection:** Phone GPS when reporting \n• **Worker tracking:** Real-time location updates \n• **Route optimization:** AI calculates best paths \n• **ETA calculation:** Predicts arrival times \n• **Geofencing:** Confirms task completion location \n• **Privacy:** Only during active tasks \n• **Battery optimization:** Efficient tracking algorithms",
    actions: [
      { label: " Live Tracking", route: "/admin" },
      { label: " Route Map", route: "/worker" }
    ]
  },
  {
    keywords: ["24/7", "available time", "working hours", "system uptime"],
    response: " System Availability: \n• **Reporting:** 24/7 - Submit anytime! \n• **Emergency Response:** 24/7 for urgent issues \n• **Normal Collection:** 6AM-10PM daily \n• **Admin Support:** Mon-Fri 8AM-6PM \n• **Weekend Support:** 9AM-5PM \n• **System Uptime:** 99.9% guaranteed \n• **Maintenance:** Sundays 2AM-4AM \n\nEmergency reports always get immediate attention!",
    actions: [
      { label: " Emergency Report", route: "/citizen" },
      { label: " Contact Support", route: "/citizen" }
    ]
  },
  {
    keywords: ["report prioritization", "priority system", "how reports prioritized"],
    response: " Report Priority System: \n• ** Urgent:** Health hazards, blocked roads - 1-2 hours \n• ** High:** Large accumulations, commercial - 4-8 hours \n• **🟠 Medium:** Regular household waste - 24 hours \n• ** Low:** Small amounts, non-urgent - 48 hours \n• **Factors:** Location, volume, type, weather \n• **AI scoring:** Automatic priority calculation \n• **Manual override:** Admin can adjust priorities",
    actions: [
      { label: " Priority Analytics", route: "/admin" },
      { label: " Submit Report", route: "/citizen" }
    ]
  },
  {
    keywords: ["collected waste", "waste disposal", "what happens to waste"],
    response: " **Advanced Waste Processing Journey:** \n\n **Smart Collection Phase** \n• GPS-tracked fleet with real-time monitoring \n• Optimized routing reduces fuel consumption by 30% \n• Automated weight and volume sensing \n• Temperature-controlled transport for sensitive waste \n\n **High-Tech Sorting Facilities** \n• AI-powered optical sorting with 99.8% accuracy \n• Magnetic separation for metals \n• Eddy current systems for aluminum \n• Advanced NIR spectroscopy for plastic types \n\n **Premium Recycling Operations** \n• **78% recycling rate** (industry leading) \n• Closed-loop partnerships with manufacturers \n• Advanced material recovery systems \n• Quality-controlled secondary raw materials \n\n **Sustainable Composting** \n• Industrial-scale aerobic composting \n• 14-day rapid composting cycle \n• Premium organic fertilizer production \n• Carbon-negative process with methane capture \n\n **Energy Recovery Systems** \n• Waste-to-energy conversion at 95% efficiency \n• Powers 12,000+ homes annually \n• Advanced emission controls (below EU standards) \n• Steam turbine electricity generation \n\n🏞️ **Minimal Landfill Strategy** \n• **<5% landfill rate** (vs 65% industry average) \n• Only non-recyclable, non-combustible materials \n• Advanced landfill gas capture systems \n• Future-ready for resource recovery technologies \n\n **Full Transparency & Tracking** \n• Blockchain-based chain of custody \n• Real-time environmental impact monitoring \n• QR code tracking for each waste batch \n• Public sustainability dashboard \n\n **Environmental Excellence** \n• **85% overall diversion from landfill** \n• 2.4M tons CO2 emissions prevented annually \n• 100% renewable energy in processing facilities \n• ISO 14001 & ISO 50001 certified operations \n\nThis is how we're transforming waste management into environmental leadership! 🌟",
    actions: [
      { label: " Environmental Impact", route: "/admin" },
      { label: " Recycling Guide", route: "/citizen" },
      { label: " Sustainability Report", route: "/admin" }
    ]
  },
  {
    keywords: ["ai moderation", "content moderation", "ai filtering"],
    response: " AI Content Moderation: \n• **Image analysis:** Detects inappropriate content \n• **Text filtering:** Blocks spam and harmful language \n• **Duplicate detection:** Prevents repeat reports \n• **Quality check:** Ensures photo clarity \n• **Urgency assessment:** AI evaluates severity \n• **Auto-categorization:** Routes to correct department \n• **Human review:** Edge cases handled by staff \n\n99.5% accuracy with human oversight!",
    actions: [
      { label: " AI Analytics", route: "/admin" },
      { label: " Guidelines", route: "/citizen" }
    ]
  },
  {
    keywords: ["statistics", "analytics", "data insights", "performance metrics"],
    response: " Available Analytics: \n• **Collection efficiency:** Time and completion rates \n• **Service coverage:** Areas and population served \n• **Environmental impact:** Recycling and diversion rates \n• **Customer satisfaction:** Ratings and feedback \n• **Worker performance:** Productivity and quality \n• **Cost analysis:** Per-collection expenses \n• **Trend analysis:** Seasonal and geographic patterns \n• **Custom reports:** Exportable data and insights",
    actions: [
      { label: " Analytics Dashboard", route: "/admin" },
      { label: " Performance Reports", route: "/admin" }
    ]
  },
  {
    keywords: ["become worker", "worker registration", "join as worker"],
    response: " Become a Collection Worker: \n• **Requirements:** Valid driver's license, physical fitness \n• **Training:** 2-week certification program \n• **Equipment:** Vehicle and safety gear provided \n• **Schedule:** Flexible shifts available \n• **Pay:** Competitive rates + performance bonuses \n• **Benefits:** Health insurance, retirement plan \n• **Apply:** Online or at local office \n• **Background check:** Required for safety",
    actions: [
      { label: " Apply Now", route: "/login" },
      { label: " Job Details", route: "/login" }
    ]
  },
  {
    keywords: ["system requirements", "technical requirements", "what needed"],
    response: "💻 System Requirements: \n\n**Mobile App:** \n• iOS 12+ or Android 8+ \n• 2GB RAM minimum \n• 500MB storage space \n• Internet connection (3G+) \n\n**Web Browser:** \n• Chrome 90+, Firefox 88+, Safari 14+ \n• JavaScript enabled \n• 1GB RAM recommended \n\n**Features:** \n• GPS/location services \n• Camera access \n• Push notifications \n• Offline mode available",
    actions: [
      { label: " Download App", route: "/citizen" },
      { label: "🌐 Web Version", route: "/citizen" }
    ]
  },
  {
    keywords: ["data security", "privacy", "is my data safe", "data protection"],
    response: " Data Security & Privacy: \n• **Encryption:** 256-bit SSL/TLS encryption \n• **GDPR compliant:** Full data protection compliance \n• **Data anonymization:** Personal data protected \n• **Access control:** Role-based permissions \n• **Regular audits:** Security checks monthly \n• **Data retention:** Automatic cleanup after 2 years \n• **Backup systems:** Daily encrypted backups \n• **No data selling:** Your data stays with us",
    actions: [
      { label: " Privacy Policy", route: "/login" },
      { label: " Security Details", route: "/login" }
    ]
  },
  {
    keywords: ["routing algorithm", "route optimization", "how routing works"],
    response: " Smart Routing Algorithm: \n• **Machine learning:** Improves with each assignment \n• **Real-time traffic:** Adjusts for congestion \n• **Capacity planning:** Vehicle load optimization \n• **Time windows:** Considers business hours \n• **Fuel efficiency:** Minimizes travel distance \n• **Weather factors:** Adjusts for conditions \n• **Priority weighting:** Urgent tasks first \n• **Multi-stop optimization:** Efficient batch processing \n\nReduces fuel consumption by 30% and time by 25%!",
    actions: [
      { label: " Route Analytics", route: "/admin" },
      { label: " Live Routes", route: "/worker" }
    ]
  },
  {
    keywords: ["export data", "download reports", "data export", "csv export"],
    response: " Data Export Options: \n• **CSV format:** For Excel/analysis \n• **PDF reports:** Printable summaries \n• **API access:** Real-time data integration \n• **Scheduled exports:** Automated delivery \n• **Custom date ranges:** Flexible time periods \n• **Filter options:** By location, type, status \n• **Analytics dashboards:** Interactive visualizations \n• **Compliance reports:** Regulatory requirements \n\nAdmins can export up to 1M records per request!",
    actions: [
      { label: " Export Data", route: "/admin" },
      { label: " Analytics", route: "/admin" }
    ]
  },
  {
    keywords: ["admin", "manage", "assign", "supervisor", "control", "dashboard", "analytics"],
    response: " Opening Admin Dashboard - Your command center for waste management! Monitor reports, assign workers, track performance, and view comprehensive analytics.",
    navigate: "/admin"
  },
  {
    keywords: ["worker", "tasks", "collect", "cleanup", "assigned", "field", "collection"],
    response: " Opening Worker Dashboard - Your field operations hub! View assigned cleanup tasks, update status in real-time, and upload completion photos.",
    navigate: "/worker"
  },
  {
    keywords: ["citizen", "my reports", "feedback", "resident", "public", "community"],
    response: " Opening Citizen Dashboard - Your community engagement portal! Submit garbage reports, track collection status, and provide feedback on services.",
    navigate: "/citizen"
  },
  {
    keywords: ["analytics", "statistics", "metrics", "data", "insights", "performance", "reports"],
    response: " Accessing Analytics Dashboard - Real-time insights on waste management operations! Track collection efficiency, response times, and environmental impact.",
    navigate: "/admin"
  },
  {
    keywords: ["login", "sign in", "access", "authenticate", "portal", "enter"],
    response: " Taking you to the login portal - Choose your role (Citizen, Worker, or Admin) to access your personalized waste management dashboard.",
    navigate: "/login"
  },
  {
    keywords: ["help", "what can you do", "assist", "guide", "instructions", "features"],
    response: " I'm your Waste Management Assistant! I can help you:\n•  Report garbage issues quickly\n•  Navigate to any dashboard\n•  Explain system features\n•  Track worker assignments\n•  View analytics insights\n•  Help with login issues\n\nWhat would you like to explore?",
    actions: [
      { label: "Report Garbage", route: "/citizen" },
      { label: "Worker Portal", route: "/worker" },
      { label: "Admin Dashboard", route: "/admin" },
      { label: "System Login", route: "/login" }
    ]
  },
  {
    keywords: ["how it works", "system overview", "process", "workflow", "guide"],
    response: " Waste Management System Flow:\n\n1️⃣ **Citizens** report garbage with photos & GPS\n2️⃣ **Admins** review & assign optimal workers\n3️⃣ **Workers** complete tasks & upload proof\n4️⃣ **System** tracks everything in real-time\n\nEach role has specialized tools for maximum efficiency!",
    actions: [
      { label: "Start Reporting", route: "/citizen" },
      { label: "View Dashboard", route: "/login" }
    ]
  },
  {
    keywords: ["status", "track", "progress", "update", "monitor"],
    response: " Track your garbage reports in real-time! Citizens get instant updates when workers are assigned and when collection is completed. Full transparency from report to resolution!",
    actions: [
      { label: "My Reports", route: "/citizen" }
    ]
  },
  {
    keywords: ["collection", "schedule", "timing", "when", "pickup"],
    response: " Smart collection scheduling! The system optimizes routes based on report locations and worker availability. Workers get real-time notifications for new assignments.",
    actions: [
      { label: "Worker Tasks", route: "/worker" }
    ]
  }
];

// Function to detect user intent based on keywords
function detectIntent(message) {
  const msg = message.toLowerCase();
  
  for (const intent of intents) {
    for (const keyword of intent.keywords) {
      if (msg.includes(keyword)) {
        return intent;
      }
    }
  }
  
  return null; // No intent detected
}

export function processCommand(text) {
  const intent = detectIntent(text);
  
  if (intent) {
    // Trigger navigation if needed
    if (intent.navigate && navigate) {
      navigate(intent.navigate);
    }
    
    return {
      role: "assistant",
      text: intent.response,
      actions: intent.actions || null
    };
  }
  
  // Enhanced fallback response with suggested actions
  return {
    role: "assistant",
    text: "🤔 That's interesting! While I'm specifically designed to help with waste management, I'm always happy to chat! You can ask me about:\n•  Reporting garbage issues\n•  Worker tasks and assignments\n•  Admin management features\n•  System analytics\n•  Login help\n\nOr just say hi and we can chat! What would you like to know?",
    actions: [
      { label: " Report Issue", route: "/citizen" },
      { label: " Worker Portal", route: "/worker" },
      { label: " Admin Dashboard", route: "/admin" },
      { label: "� Just Chat", route: "/login" }
    ]
  };
}
