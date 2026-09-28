export interface GuideArticle {
  id: string;
  title: string;
  category: 'CV & Portfolio' | 'Literature' | 'Outreach & Verification' | 'Interviews & Offers';
  readTime: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
    bulletPoints?: string[];
  }[];
}

export const PRACTICAL_GUIDES: GuideArticle[] = [
  {
    id: 'guide-one-page-cv',
    title: 'Structuring a Clean 1-Page Academic Research CV',
    category: 'CV & Portfolio',
    readTime: '4 min read',
    summary: 'Indian professors spend ~15 seconds skimming an applicant CV. Here is how to highlight your technical rigor rather than high school trivia.',
    sections: [
      {
        heading: '1. Essential Order of Sections',
        content: 'Keep it strictly to one single page (PDF format, name format: Firstname_Lastname_CV.pdf).',
        bulletPoints: [
          'Header: Full Name, Degree, Institution, University Roll/Branch, Email, GitHub link, Portfolio / Google Scholar (if any).',
          'Education: College name, CGPA (e.g. 8.7/10), relevant coursework (e.g. Data Structures, Linear Algebra, Operating Systems).',
          'Technical Skills: Programming languages (rank by proficiency), frameworks (e.g. PyTorch, ROS2, Verilog), tools (Git, Linux, Docker).',
          'Research / Technical Projects: 2–3 substantive projects. State the problem, your exact individual contribution, tools used, and include a clickable GitHub/report link.',
          'Honors & Scholastic Achievements: Competitive exams (JEE rank, Olympiads, Hackathon finalist, departmental top rank). Keep it brief.'
        ]
      },
      {
        heading: '2. What to Omit (Red Flags)',
        content: 'Avoid fluffy non-academic entries that dilute your technical credibility.',
        bulletPoints: [
          'Never include high school grades unless you were an international Olympiad medalist.',
          'Do not list soft skills as bullet points ("Hard worker", "Good communicator"). Demonstrate them through clear writing.',
          'Avoid tutorial projects (e.g., standard Titanic prediction, basic to-do app, default MNIST tutorial) without a custom twist or benchmark evaluation.'
        ]
      }
    ]
  },
  {
    id: 'guide-github-readme',
    title: 'Writing a Reproducible GitHub README for Researchers',
    category: 'CV & Portfolio',
    readTime: '3 min read',
    summary: 'A researcher clicking your project link will immediately assess whether your code is verifiable or just a broken fork.',
    sections: [
      {
        heading: 'The 4 Crucial Ingredients',
        content: 'Every repository you link in an application should have:',
        bulletPoints: [
          'Overview & Goal: What does this repo implement? E.g., "A PyTorch implementation comparing GCN vs GAT convergence on sparse citation networks."',
          'Exact Setup Commands: Environment requirements (Python version, requirements.txt or environment.yml). Give exact commands to create the virtualenv.',
          'Execution & Demo: A single command to reproduce the main experiment (e.g., `python train.py --dataset cora --epochs 50`).',
          'Results Table & Attribution: A table comparing your reproduced numbers vs the baseline, and explicit credit for external libraries or starter code used.'
        ]
      }
    ]
  },
  {
    id: 'guide-reading-papers',
    title: 'How to Read a Research Paper in 3 Passes',
    category: 'Literature',
    readTime: '5 min read',
    summary: 'Reading research end-to-end is exhausting and unnecessary when surveying literature for winter applications.',
    sections: [
      {
        heading: 'The 3-Pass Methodology (Keshav Method Adapted)',
        content: 'Break down your paper reading into structured sweeps:',
        bulletPoints: [
          'Pass 1 (5–10 min): Read title, abstract, section headings, and conclusion. Inspect key figures. Determine: What is the core problem? Is it relevant to my winter timeline?',
          'Pass 2 (30–45 min): Read introduction and methods. Grasp the main algorithm or experimental setup. Note terms you do not understand. Ignore complex appendices for now.',
          'Pass 3 (1–2 hours): Deep dive into mathematical derivations, proofs, or experimental setups ONLY if you plan to build directly on this paper.'
        ]
      }
    ]
  },
  {
    id: 'guide-finding-faculty',
    title: 'Finding Official Faculty & Lab Pages (Without Getting Lost)',
    category: 'Outreach & Verification',
    readTime: '4 min read',
    summary: 'Directories provide starting names, but the ground truth always lives on official departmental web servers.',
    sections: [
      {
        heading: 'Verification Steps Before Writing',
        content: 'Always perform this 3-step check before composing an email:',
        bulletPoints: [
          'Search for "[Professor Name] [IIT Name] faculty webpage". Check whether the professor is currently on sabbatical, active, or emeritus.',
          'Look for their lab website (e.g. lab.cse.iitb.ac.in). Recent lab news often states: "Looking for 2 undergraduate winter interns with PyTorch skills" or "Please note: No internships available via email".',
          'Look at their Google Scholar profile sorted by Year. If their last 3 papers are on Quantum Computing, do not pitch them a generic Web Development project.'
        ]
      }
    ]
  },
  {
    id: 'guide-interview-prep',
    title: 'Preparing for an Informal Research Screening Call',
    category: 'Interviews & Offers',
    readTime: '5 min read',
    summary: 'If a professor or senior PhD student replies with an invitation to chat on Google Meet or Zoom, here is how to prepare.',
    sections: [
      {
        heading: 'What Faculty Actually Ask',
        content: 'Faculty rarely conduct LeetCode-style quizzes for research interns. Instead, they probe for integrity, curiosity, and independent debugging skills:',
        bulletPoints: [
          '"Tell me about this project you mentioned." -> Prepare a crisp 2-minute explanation: problem, your contribution, tooling, and what worked.',
          '"What was the hardest bug or failure you ran into?" -> Prepare a real failure. Faculty love students who can describe why something broke and how they isolated the cause.',
          '"Why our group?" -> Refer to the specific paper you read and the specific question you drafted in Email Studio.',
          '"What are your exact dates and weekly availability?" -> State your exact dates (e.g. Dec 5 to Jan 12) without hedging.'
        ]
      }
    ]
  },
  {
    id: 'guide-before-accepting',
    title: 'The "Before You Accept" Checklist',
    category: 'Interviews & Offers',
    readTime: '3 min read',
    summary: 'Do not rush to accept an offer without confirming basic logistics and university administrative requirements.',
    sections: [
      {
        heading: 'Checklist Before Confirming',
        content: 'Clarify these 7 points in writing:',
        bulletPoints: [
          'Supervision: Will you be directly guided by the faculty member, a post-doc, or a senior PhD student? How often are progress check-ins?',
          'Scope & Timeline: Is the project realistic for a 4–6 week winter window?',
          'Mode & Location: Is on-site presence required, or is hybrid/remote permitted?',
          'Accommodation: Is campus hostel accommodation available for winter visitors, or do you need private PG arrangements?',
          'Stipend / Fees: Is it a funded fellowship, unpaid academic training, or does the institute charge a lab bench fee?',
          'Institutional Documents: Does your home college require an official NOC (No Objection Certificate) before you leave campus?',
          'Confidentiality & Publication: For DRDO labs or industrial-funded academic projects, what are the publication and NDA restrictions?'
        ]
      }
    ]
  }
];

export const ACCEPTANCE_CHECKLIST_ITEMS = [
  { id: 'c1', label: 'Primary supervisor identified (faculty or designated senior researcher)', hint: 'Confirm who will review your weekly progress.' },
  { id: 'c2', label: 'Clear project scope feasible for a 4–6 week winter timeline', hint: 'Avoid open-ended or undefined thesis topics.' },
  { id: 'c3', label: 'Exact start date and end date mutually agreed upon in writing', hint: 'Ensure no conflict with university semester start.' },
  { id: 'c4', label: 'Work arrangement confirmed (On-site vs Hybrid vs Remote)', hint: 'Check lab access policies during winter holidays.' },
  { id: 'c5', label: 'Accommodation & travel expenses explicitly verified', hint: 'Most winter programs do not cover hostel unless under a formal fellowship.' },
  { id: 'c6', label: 'Home institution NOC & bonafide certificate obtained (if needed)', hint: 'Check with your HOD or Dean of Academic Affairs.' },
  { id: 'c7', label: 'Confidentiality / publication rights understood', hint: 'Critical for defence, DRDO, or sponsored industry projects.' }
];
