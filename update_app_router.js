const fs = require('fs');

const pagePath = 'app/tools/[slug]/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

// The dynamic imports to inject
const newImports = `
const CgpaCalculatorTool = dynamic(() => import('@/components/tool-ui/student/CgpaCalculatorTool').then(mod => mod.CgpaCalculatorTool));
const GpaCalculatorTool = dynamic(() => import('@/components/tool-ui/student/GpaCalculatorTool').then(mod => mod.GpaCalculatorTool));
const SgpaCalculatorTool = dynamic(() => import('@/components/tool-ui/student/SgpaCalculatorTool').then(mod => mod.SgpaCalculatorTool));
const MarksPercentageCalculatorTool = dynamic(() => import('@/components/tool-ui/student/MarksPercentageCalculatorTool').then(mod => mod.MarksPercentageCalculatorTool));
const AttendanceCalculatorTool = dynamic(() => import('@/components/tool-ui/student/AttendanceCalculatorTool').then(mod => mod.AttendanceCalculatorTool));
const RequiredAttendanceCalculatorTool = dynamic(() => import('@/components/tool-ui/student/RequiredAttendanceCalculatorTool').then(mod => mod.RequiredAttendanceCalculatorTool));
const StudyHoursCalculatorTool = dynamic(() => import('@/components/tool-ui/student/StudyHoursCalculatorTool').then(mod => mod.StudyHoursCalculatorTool));
const PomodoroTimerTool = dynamic(() => import('@/components/tool-ui/student/PomodoroTimerTool').then(mod => mod.PomodoroTimerTool));
const ExamCountdownTool = dynamic(() => import('@/components/tool-ui/student/ExamCountdownTool').then(mod => mod.ExamCountdownTool));
const StudySessionTimerTool = dynamic(() => import('@/components/tool-ui/student/StudySessionTimerTool').then(mod => mod.StudySessionTimerTool));
const GradeCalculatorTool = dynamic(() => import('@/components/tool-ui/student/GradeCalculatorTool').then(mod => mod.GradeCalculatorTool));
const MarksRequiredCalculatorTool = dynamic(() => import('@/components/tool-ui/student/MarksRequiredCalculatorTool').then(mod => mod.MarksRequiredCalculatorTool));
const WeightedGradeCalculatorTool = dynamic(() => import('@/components/tool-ui/student/WeightedGradeCalculatorTool').then(mod => mod.WeightedGradeCalculatorTool));
const PdfPageCounterTool = dynamic(() => import('@/components/tool-ui/exam/PdfPageCounterTool').then(mod => mod.PdfPageCounterTool));
`;

// Insert the imports right before 'export default async function ToolPage'
content = content.replace(
  'export default async function ToolPage',
  newImports + '\nexport default async function ToolPage'
);

// The switch cases to inject
const newCases = `
    // Phase 7: Student & Exam Tools
    case 'cgpa-calculator':
      return <CgpaCalculatorTool />;
    case 'gpa-calculator':
      return <GpaCalculatorTool />;
    case 'sgpa-calculator':
      return <SgpaCalculatorTool />;
    case 'marks-percentage-calculator':
      return <MarksPercentageCalculatorTool />;
    case 'attendance-calculator':
      return <AttendanceCalculatorTool />;
    case 'required-attendance-calculator':
      return <RequiredAttendanceCalculatorTool />;
    case 'study-hours-calculator':
      return <StudyHoursCalculatorTool />;
    case 'pomodoro-timer':
      return <PomodoroTimerTool />;
    case 'exam-countdown':
      return <ExamCountdownTool />;
    case 'study-session-timer':
      return <StudySessionTimerTool />;
    case 'grade-calculator':
      return <GradeCalculatorTool />;
    case 'marks-required-calculator':
      return <MarksRequiredCalculatorTool />;
    case 'weighted-grade-calculator':
      return <WeightedGradeCalculatorTool />;
    case 'pdf-page-counter':
      return <PdfPageCounterTool />;
`;

// Insert the cases inside the renderToolComponent function switch statement
content = content.replace(
  /default:\n\s*return/g,
  newCases + '\n    default:\n      return'
);

fs.writeFileSync(pagePath, content, 'utf8');
console.log('Successfully added dynamic routes for student/exam tools to page.tsx');
