export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  estimatedEffort: string;
  tip?: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  subtitle: string;
  estimatedHours: string;
  deliverable: string;
  tasks: RoadmapTask[];
  disciplineGuidance?: {
    discipline: string;
    focus: string;
    recommendedTools: string[];
  }[];
}

export const ROADMAP_WEEKS: RoadmapWeek[] = [
  {
    weekNumber: 1,
    title: 'Choose a Direction & Assess Foundations',
    subtitle: 'Narrow your scope from vague curiosity to two tangible domains.',
    estimatedHours: '8–12 hours',
    deliverable: 'A one-paragraph research-interest statement and a concrete skills-gap checklist.',
    tasks: [
      {
        id: 'w1-t1',
        title: 'Pick one primary research area and one adjacent interest',
        description: 'Focus is better than generalist claims. Instead of "AI", choose e.g. "Graph Representation Learning" or "Edge Computer Vision".',
        estimatedEffort: '2 hours',
        tip: 'Indian faculty receive hundreds of generic "I love AI" emails. Specificity immediately stands out.'
      },
      {
        id: 'w1-t2',
        title: 'Review relevant coursework and prerequisites',
        description: 'Check math prerequisites (Linear Algebra, Multivariable Calc, Probability) or physics/circuit fundamentals for your selected domain.',
        estimatedEffort: '3 hours'
      },
      {
        id: 'w1-t3',
        title: 'Identify gaps in your current skills',
        description: 'Be honest about what you do not know yet. If you have only taken intro Python, plan your technical ramp-up now.',
        estimatedEffort: '2 hours'
      },
      {
        id: 'w1-t4',
        title: 'Set realistic internship dates and weekly prep time',
        description: 'Confirm university winter break dates (typically Dec 1 – Jan 10) and college exam calendar to avoid overcommitting.',
        estimatedEffort: '1 hour'
      },
      {
        id: 'w1-t5',
        title: 'Start checking institutional opportunity notices',
        description: 'Check official institute portals (e.g. IIT Bombay SURP, IIT Madras Winter Fellowships, DRDO official training notices).',
        estimatedEffort: '2 hours'
      }
    ]
  },
  {
    weekNumber: 2,
    title: 'Build the Tools You Need',
    subtitle: 'Gain hands-on tooling fluency before touching faculty papers.',
    estimatedHours: '12–16 hours',
    deliverable: 'A small working exercise, simulation, or notebook with a clear README.',
    disciplineGuidance: [
      {
        discipline: 'AI & Data Science',
        focus: 'Vectorized computing, training loop implementation from scratch, evaluation metrics, and random seed reproducibility.',
        recommendedTools: ['PyTorch / JAX', 'NumPy', 'Weights & Biases', 'Git']
      },
      {
        discipline: 'Systems & Networking',
        focus: 'Linux environments, system calls, network sockets, profiling tools, memory sanitizers, and latency measurement.',
        recommendedTools: ['C/C++ or Rust', 'perf / valgrind', 'Wireshark', 'Docker']
      },
      {
        discipline: 'Electronics & Robotics',
        focus: 'Signal processing, state space control, embedded microcontrollers, and circuit/physics simulation engines.',
        recommendedTools: ['MATLAB / Simulink', 'ROS2', 'KiCAD', 'Gazebo']
      },
      {
        discipline: 'Experimental & Natural Sciences',
        focus: 'Data hygiene, standard error propagation, molecular modeling or spectroscopy baselines, and reproducible data plots.',
        recommendedTools: ['Pandas / SciPy', 'R', 'Origin / Matplotlib', 'LaTeX']
      }
    ],
    tasks: [
      {
        id: 'w2-t1',
        title: 'Set up an isolated, reproducible development environment',
        description: 'Use Docker, conda/venv, or nix. Ensure code runs on clean machines without undocumented local paths.',
        estimatedEffort: '3 hours'
      },
      {
        id: 'w2-t2',
        title: 'Implement a small baseline model, simulation, or script',
        description: 'Avoid tutorial copy-pasting. Write the pipeline yourself and understand each hyperparameter or setting.',
        estimatedEffort: '6 hours'
      },
      {
        id: 'w2-t3',
        title: 'Write a concise README explaining how to run the code',
        description: 'Include dependencies, exact commands to execute, sample output, and known limitations.',
        estimatedEffort: '3 hours'
      }
    ]
  },
  {
    weekNumber: 3,
    title: 'Read Research Actively',
    subtitle: 'Learn to extract critical insights from papers without getting stuck in the weeds.',
    estimatedHours: '10–14 hours',
    deliverable: 'Structured notes on 3 relevant papers and an initial faculty shortlist.',
    tasks: [
      {
        id: 'w3-t1',
        title: 'Apply the 3-Pass Reading Workflow',
        description: 'Pass 1: Title, abstract, figures, conclusion (10 mins). Pass 2: Main argument and structure (45 mins). Pass 3: Detailed math & proofs (if directly relevant).',
        estimatedEffort: '4 hours'
      },
      {
        id: 'w3-t2',
        title: 'Complete the structured Paper-Notes Template for 3 papers',
        description: 'Document question, method, dataset, main quantitative result, limitation, and one unanswered technical question.',
        estimatedEffort: '5 hours',
        tip: 'Use the interactive Paper Notes tool inside Research Internship Desk to store your notes.'
      },
      {
        id: 'w3-t3',
        title: 'Create an initial shortlist of 10–15 relevant professors/labs',
        description: 'Match the specific papers you read with the authoring faculty members in our Faculty, DRDO, or ISRO Directory.',
        estimatedEffort: '3 hours'
      }
    ]
  },
  {
    weekNumber: 4,
    title: 'Build Evidence of Your Ability',
    subtitle: 'Replace generic CV buzzwords with reproducible proof of competence.',
    estimatedHours: '15–20 hours',
    deliverable: 'One reproducible mini-project or baseline benchmark with public repository.',
    tasks: [
      {
        id: 'w4-t1',
        title: 'Reproduce a manageable public baseline or benchmark',
        description: 'Pick an open-source paper baseline, run it with published settings, and compare your numbers to reported metrics.',
        estimatedEffort: '8 hours'
      },
      {
        id: 'w4-t2',
        title: 'Clearly distinguish your own work from imported code',
        description: 'Explicitly credit forks and libraries in your code. Faculty value intellectual integrity over superficial volume.',
        estimatedEffort: '2 hours'
      },
      {
        id: 'w4-t3',
        title: 'Document failed experiments and lessons learned',
        description: 'Write 2 paragraphs in your README on what crashed, what didn\'t converge, and how you debugged it.',
        estimatedEffort: '3 hours'
      },
      {
        id: 'w4-t4',
        title: 'Verify all repository links and demo access',
        description: 'Test cloning into a fresh directory on a friend\'s laptop or Google Colab to ensure dependencies aren\'t missing.',
        estimatedEffort: '2 hours'
      }
    ]
  },
  {
    weekNumber: 5,
    title: 'Prepare and Approach',
    subtitle: 'Execute targeted, individualized applications with zero mass-spam.',
    estimatedHours: '10–12 hours',
    deliverable: 'A focused batch of 8–12 individualized emails recorded in your Application Tracker.',
    tasks: [
      {
        id: 'w5-t1',
        title: 'Format a clean, 1-page Academic Research CV',
        description: 'Highlight coursework, GPA, technical tools, repository links, and relevant project contributions. Remove high school filler.',
        estimatedEffort: '3 hours'
      },
      {
        id: 'w5-t2',
        title: 'Verify official institutional routes before cold emailing',
        description: 'Check if the lab requires a departmental portal submission or college sponsorship letter.',
        estimatedEffort: '2 hours'
      },
      {
        id: 'w5-t3',
        title: 'Personalize each email in Email Studio',
        description: 'Connect your project to their specific paper. Check that zero placeholder brackets [Name] remain.',
        estimatedEffort: '4 hours'
      },
      {
        id: 'w5-t4',
        title: 'Log each outreach in My Applications Tracker',
        description: 'Record application date, recipient email, and auto-schedule your 7–10 day follow-up reminder.',
        estimatedEffort: '1 hour'
      }
    ]
  },
  {
    weekNumber: 6,
    title: 'Follow Up & Prepare for Conversations',
    subtitle: 'Manage responses gracefully and prepare for technical screening calls.',
    estimatedHours: '8–10 hours',
    deliverable: 'Interview preparation notes, failure debriefs, and logged follow-ups.',
    tasks: [
      {
        id: 'w6-t1',
        title: 'Review due follow-ups in My Applications',
        description: 'Send gentle, professional follow-ups (Template D or E) only after 7–10 days have elapsed without response.',
        estimatedEffort: '2 hours'
      },
      {
        id: 'w6-t2',
        title: 'Prepare your 2-minute elevator pitch for an informal meeting',
        description: 'Structure: Background (30s) -> Project problem & tooling (45s) -> What you want to investigate in their lab (45s).',
        estimatedEffort: '2 hours'
      },
      {
        id: 'w6-t3',
        title: 'Prepare answers for: a technical bug, a design trade-off, and project limitations',
        description: 'Faculty frequently probe where your project breaks or why you chose one algorithm over another.',
        estimatedEffort: '2 hours'
      },
      {
        id: 'w6-t4',
        title: 'Review the "Before You Accept" checklist',
        description: 'Verify supervision, accommodation, college NOC requirements, and intellectual property terms before signing.',
        estimatedEffort: '1 hour'
      }
    ]
  }
];
