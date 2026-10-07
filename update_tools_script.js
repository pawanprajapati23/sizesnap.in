const fs = require('fs');

const toolsPath = 'data/tools.ts';
let content = fs.readFileSync(toolsPath, 'utf8');

// Ensure 'student-tools' and 'exam-tools' are in ToolCategoryId
if (!content.includes("'student-tools'")) {
    content = content.replace(/type ToolCategoryId\s*=\s*/, "type ToolCategoryId = \n  | 'student-tools'\n  | 'exam-tools'\n  | ");
}

const studentToolsData = `
  // ==========================================
  // PHASE 7: STUDENT & EXAM TOOLS
  // ==========================================
  {
    id: 'cgpa-calculator',
    slug: 'cgpa-calculator',
    name: 'CGPA Calculator',
    category: 'student-tools',
    shortDescription: 'Calculate your Cumulative Grade Point Average (CGPA) quickly and accurately.',
    icon: 'Calculator',
    route: '/tools/cgpa-calculator',
    keywords: ['cgpa calculator', 'calculate cgpa', 'cumulative grade point average'],
    searchIntent: 'Calculate overall CGPA from semester GPAs',
    processingType: 'client',
    status: 'published',
    seoPriority: 'High',
    analyticsIdentifier: 'cgpa_calc'
  },
  {
    id: 'gpa-calculator',
    slug: 'gpa-calculator',
    name: 'GPA Calculator',
    category: 'student-tools',
    shortDescription: 'Calculate your semester GPA with custom credit hours and grade points.',
    icon: 'Calculator',
    route: '/tools/gpa-calculator',
    keywords: ['gpa calculator', 'college gpa calculator', 'semester gpa'],
    searchIntent: 'Calculate semester GPA based on subject grades',
    processingType: 'client',
    status: 'published',
    seoPriority: 'High',
    analyticsIdentifier: 'gpa_calc'
  },
  {
    id: 'sgpa-calculator',
    slug: 'sgpa-calculator',
    name: 'SGPA Calculator',
    category: 'student-tools',
    shortDescription: 'Calculate your Semester Grade Point Average (SGPA).',
    icon: 'Calculator',
    route: '/tools/sgpa-calculator',
    keywords: ['sgpa calculator', 'sgpa to percentage', 'semester gpa'],
    searchIntent: 'Calculate SGPA based on subject credits and grades',
    processingType: 'client',
    status: 'published',
    seoPriority: 'High',
    analyticsIdentifier: 'sgpa_calc'
  },
  {
    id: 'marks-percentage-calculator',
    slug: 'marks-percentage-calculator',
    name: 'Marks to Percentage Calculator',
    category: 'student-tools',
    shortDescription: 'Convert academic marks into percentages easily.',
    icon: 'Percent',
    route: '/tools/marks-percentage-calculator',
    keywords: ['marks to percentage', 'percentage of marks', 'exam percentage calculator'],
    searchIntent: 'Find out the percentage score from obtained and total marks',
    processingType: 'client',
    status: 'published',
    seoPriority: 'High',
    analyticsIdentifier: 'marks_pct_calc'
  },
  {
    id: 'attendance-calculator',
    slug: 'attendance-calculator',
    name: 'Attendance Calculator',
    category: 'student-tools',
    shortDescription: 'Track your attendance and see how many more classes you need to attend.',
    icon: 'CheckSquare',
    route: '/tools/attendance-calculator',
    keywords: ['attendance calculator', 'calculate attendance', 'college attendance'],
    searchIntent: 'Check current attendance percentage and predict future requirements',
    processingType: 'client',
    status: 'published',
    seoPriority: 'High',
    analyticsIdentifier: 'attendance_calc'
  },
  {
    id: 'required-attendance-calculator',
    slug: 'required-attendance-calculator',
    name: 'Required Attendance Calculator',
    category: 'student-tools',
    shortDescription: 'Calculate exactly how many classes you can afford to miss or must attend.',
    icon: 'Calendar',
    route: '/tools/required-attendance-calculator',
    keywords: ['required attendance', 'how many classes can I skip', 'bunk calculator'],
    searchIntent: 'Calculate classes needed to reach a target attendance percentage',
    processingType: 'client',
    status: 'published',
    seoPriority: 'Medium',
    analyticsIdentifier: 'req_attendance_calc'
  },
  {
    id: 'study-hours-calculator',
    slug: 'study-hours-calculator',
    name: 'Study Hours Calculator',
    category: 'student-tools',
    shortDescription: 'Plan your weekly study schedule based on your course credits.',
    icon: 'Clock',
    route: '/tools/study-hours-calculator',
    keywords: ['study hours calculator', 'how much to study', 'study time calculator'],
    searchIntent: 'Calculate recommended weekly study hours based on credits',
    processingType: 'client',
    status: 'published',
    seoPriority: 'Medium',
    analyticsIdentifier: 'study_hours_calc'
  },
  {
    id: 'pomodoro-timer',
    slug: 'pomodoro-timer',
    name: 'Pomodoro Study Timer',
    category: 'student-tools',
    shortDescription: 'Boost focus with a 25-minute Pomodoro study timer.',
    icon: 'Timer',
    route: '/tools/pomodoro-timer',
    keywords: ['pomodoro timer', 'study timer', 'focus timer', 'tomato timer'],
    searchIntent: 'Use a simple online timer for the Pomodoro technique',
    processingType: 'client',
    status: 'published',
    seoPriority: 'High',
    analyticsIdentifier: 'pomodoro_timer'
  },
  {
    id: 'exam-countdown',
    slug: 'exam-countdown',
    name: 'Exam Countdown Timer',
    category: 'exam-tools',
    shortDescription: 'Create a custom countdown timer for your upcoming exams.',
    icon: 'CalendarClock',
    route: '/tools/exam-countdown',
    keywords: ['exam countdown', 'test countdown', 'days until exam'],
    searchIntent: 'Track time remaining until a specific exam date',
    processingType: 'client',
    status: 'published',
    seoPriority: 'Medium',
    analyticsIdentifier: 'exam_countdown'
  },
  {
    id: 'study-session-timer',
    slug: 'study-session-timer',
    name: 'Study Session Stopwatch',
    category: 'student-tools',
    shortDescription: 'Track how long you have been studying in your current session.',
    icon: 'Timer',
    route: '/tools/study-session-timer',
    keywords: ['study stopwatch', 'time tracker', 'study session timer'],
    searchIntent: 'Stopwatch to track total continuous study time',
    processingType: 'client',
    status: 'published',
    seoPriority: 'Medium',
    analyticsIdentifier: 'study_stopwatch'
  },
  {
    id: 'grade-calculator',
    slug: 'grade-calculator',
    name: 'Grade Calculator',
    category: 'student-tools',
    shortDescription: 'Calculate your current class grade based on assignment weights.',
    icon: 'Calculator',
    route: '/tools/grade-calculator',
    keywords: ['grade calculator', 'class grade calculator', 'overall grade'],
    searchIntent: 'Calculate current class grade from weighted assignments',
    processingType: 'client',
    status: 'published',
    seoPriority: 'High',
    analyticsIdentifier: 'grade_calc'
  },
  {
    id: 'marks-required-calculator',
    slug: 'marks-required-calculator',
    name: 'Final Exam Grade Calculator',
    category: 'exam-tools',
    shortDescription: 'Find out what you need on the final to get your desired grade.',
    icon: 'Target',
    route: '/tools/marks-required-calculator',
    keywords: ['final grade calculator', 'what do I need on my final', 'target grade'],
    searchIntent: 'Calculate the exam score needed to achieve a specific overall class grade',
    processingType: 'client',
    status: 'published',
    seoPriority: 'High',
    analyticsIdentifier: 'marks_req_calc'
  },
  {
    id: 'weighted-grade-calculator',
    slug: 'weighted-grade-calculator',
    name: 'Weighted Grade Calculator',
    category: 'student-tools',
    shortDescription: 'Easily calculate your weighted average grade.',
    icon: 'Calculator',
    route: '/tools/weighted-grade-calculator',
    keywords: ['weighted grade calculator', 'weighted average calculator', 'calculate weighted grade'],
    searchIntent: 'Calculate a weighted average for grades or scores',
    processingType: 'client',
    status: 'published',
    seoPriority: 'Medium',
    analyticsIdentifier: 'weighted_grade_calc'
  },
  {
    id: 'pdf-page-counter',
    slug: 'pdf-page-counter',
    name: 'PDF Page Counter',
    category: 'exam-tools',
    shortDescription: 'Quickly count the number of pages in any PDF file right in your browser.',
    icon: 'FileText',
    route: '/tools/pdf-page-counter',
    keywords: ['pdf page counter', 'count pages in pdf', 'how many pages in pdf'],
    searchIntent: 'Count the total number of pages in a PDF document',
    processingType: 'client',
    status: 'published',
    seoPriority: 'Medium',
    analyticsIdentifier: 'pdf_page_counter'
  },
`;

// Inject into ALL_TOOLS array
const insertionPoint = content.lastIndexOf('];');
if (insertionPoint !== -1) {
  content = content.slice(0, insertionPoint) + studentToolsData + content.slice(insertionPoint);
  fs.writeFileSync(toolsPath, content, 'utf8');
  console.log('Successfully added student tools to data/tools.ts');
} else {
  console.error('Could not find ALL_TOOLS end array');
}
