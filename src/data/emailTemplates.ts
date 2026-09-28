export interface EmailFormData {
  recipientName: string;
  recipientSurname: string;
  recipientEmail: string;
  recipientInstitution: string;
  templateType: 'A' | 'B' | 'C' | 'D' | 'E';
  studentName: string;
  studentDegree: string;
  studentYear: string;
  studentDiscipline: string;
  studentInstitution: string;
  studentEmail: string;
  portfolioUrl: string;
  researchTopic: string;
  paperOrLabPage: string;
  specificObservation: string;
  relevantProject: string;
  specificContribution: string;
  relevantTools: string;
  projectLink: string;
  realisticTask: string;
  startDate: string;
  endDate: string;
  originalSubject: string;
  originalDateSent: string;
  recentUpdate: string;
  cvAttached: boolean;
}

export const INITIAL_EMAIL_FORM: EmailFormData = {
  recipientName: 'Prof. Narendra S. Chaudhari',
  recipientSurname: 'Chaudhari',
  recipientEmail: 'nsc@iiti.ac.in',
  recipientInstitution: 'IIT Indore',
  templateType: 'A',
  studentName: '',
  studentDegree: 'B.Tech',
  studentYear: '3rd Year',
  studentDiscipline: 'Computer Science and Engineering',
  studentInstitution: '',
  studentEmail: '',
  portfolioUrl: '',
  researchTopic: 'Graph Neural Networks & Theoretical CS',
  paperOrLabPage: 'your recent work on graph representation learning',
  specificObservation: 'the trade-off between expressive power and message-passing overhead in large sparse graphs',
  relevantProject: 'reproducing baseline benchmarks on graph classification',
  specificContribution: 'profiled inference latency across varying sparse connectivity structures',
  relevantTools: 'PyTorch Geometric and NetworkX',
  projectLink: 'https://github.com/your-username/gnn-sparse-benchmark',
  realisticTask: 'benchmarking baseline models or curating clean evaluation datasets',
  startDate: 'Dec 1, 2026',
  endDate: 'Jan 15, 2027',
  originalSubject: 'Winter research inquiry — Graph Neural Networks, Dec 1, 2026–Jan 15, 2027',
  originalDateSent: 'October 14, 2026',
  recentUpdate: 'I recently completed benchmarking an additional baseline and posted the reproducible code and report.',
  cvAttached: true,
};

export interface RenderedEmail {
  subject: string;
  body: string;
  fullEmail: string;
  unresolvedPlaceholders: string[];
  wordCount: number;
}

export function renderEmail(data: EmailFormData): RenderedEmail {
  let subject = '';
  let body = '';

  const surname = data.recipientSurname.trim() || '[Surname]';
  const name = data.studentName.trim() || '[Name]';
  const year = data.studentYear.trim() || '[year]';
  const degree = data.studentDegree.trim() || '[degree]';
  const discipline = data.studentDiscipline.trim() || '[discipline]';
  const inst = data.studentInstitution.trim() || '[institution]';
  const topic = data.researchTopic.trim() || '[topic]';
  const startDate = data.startDate.trim() || '[start date]';
  const endDate = data.endDate.trim() || '[end date]';
  const dates = `${startDate}–${endDate}`;
  const paper = data.paperOrLabPage.trim() || '[paper/project title]';
  const observation = data.specificObservation.trim() || '[one genuine observation or question]';
  const project = data.relevantProject.trim() || '[relevant project]';
  const contribution = data.specificContribution.trim() || '[specific contribution]';
  const tools = data.relevantTools.trim() || '[relevant tools]';
  const link = data.projectLink.trim() || '[link]';
  const realisticTask = data.realisticTask.trim() || '[realistic task]';
  const portfolio = data.portfolioUrl.trim() || '[Portfolio or GitHub]';
  const studentEmail = data.studentEmail.trim() || '[Email]';
  const orgName = data.recipientInstitution.trim() || '[organisation name]';

  switch (data.templateType) {
    case 'A': {
      subject = `Winter research inquiry — ${topic}, ${dates}`;
      body = `Dear Professor ${surname},

I’m ${name}, a ${year} ${degree} student in ${discipline} at ${inst}. I’m writing to ask whether you might consider a student researcher from ${startDate} to ${endDate}.

I read ${paper}, particularly ${observation}, which connects with my work on ${project}.

For that project, I ${contribution} using ${tools}. You can see code and report here: ${link}. I could contribute to ${realisticTask}, while learning more about ${topic}.

Would you be open to discussing whether there is a suitable project in your group? ${data.cvAttached ? "I've attached my CV." : ''}

Best,
${name}
${degree}, ${inst}
${portfolio}`;
      break;
    }

    case 'B': {
      subject = `Winter research inquiry in ${topic} — ${name}`;
      body = `Dear Professor ${surname},

I’m ${name}, a ${year} ${degree} student at ${inst}, developing my foundations in ${topic}. I’m available from ${startDate} to ${endDate} and wanted to ask whether your group considers students at my stage.

I read ${paper} and was particularly interested in ${observation}. To prepare, I’ve been studying core literature and building ${project}, where I ${contribution} using ${tools}.

I’m early in my research journey, but I would be glad to help with a well-defined task such as ${realisticTask}. My work is available here: ${link}.

If there may be a suitable opportunity, I’d appreciate the chance to discuss it. ${data.cvAttached ? "I've attached my CV." : ''}

Best,
${name}
${degree} student, ${inst}`;
      break;
    }

    case 'C': {
      subject = `Winter internship inquiry — ${discipline}, ${dates}`;
      body = `Dear Internship Coordinator / appropriate office,

I’m ${name}, a ${year} ${degree} student in ${discipline} at ${inst}. I would like to ask whether ${orgName} is accepting student internship or project-training applications for ${startDate} to ${endDate}.

My interests are in ${topic}. In a recent project, I ${contribution} using ${tools}. A short description of my work is available at ${link}.

Could you please direct me to the current application process and eligibility requirements? I can provide the documents required by the official notice.

Thank you for your time.

Regards,
${name}
${degree}, ${inst}
${studentEmail}`;
      break;
    }

    case 'D': {
      const origSubject = data.originalSubject.trim() || `Winter research inquiry — ${topic}`;
      const origDate = data.originalDateSent.trim() || '[date]';
      subject = `Re: ${origSubject}`;
      const updateSentence = data.recentUpdate.trim() ? `\n${data.recentUpdate.trim()}\n` : '';
      body = `Dear Professor ${surname},

I’m following up on my email from ${origDate} about a possible winter research opportunity in ${topic}. I remain available from ${startDate} to ${endDate} and interested in your group’s work on ${paper}.${updateSentence}
If you are considering students for this period, I’d appreciate the chance to discuss whether I could contribute.

Best,
${name}`;
      break;
    }

    case 'E': {
      const origSubject = data.originalSubject.trim() || `Winter research inquiry — ${topic}`;
      subject = `Re: ${origSubject}`;
      body = `Dear Professor ${surname},

I wanted to make one final follow-up on my winter research inquiry. I understand you may not have capacity to take on a student this season.

If there is a formal application route I should use, I would appreciate being pointed towards it. Thank you for considering my inquiry.

Best,
${name}`;
      break;
    }
  }

  const fullEmail = `To: ${data.recipientEmail || '[Recipient Email]'}\nSubject: ${subject}\n\n${body}`;

  // Find unresolved bracketed placeholders like [Name], [start date], etc.
  const regex = /\[([A-Za-z0-9\s/–—-]+)\]/g;
  const matches = new Set<string>();
  let m;
  while ((m = regex.exec(subject + ' ' + body)) !== null) {
    matches.add(m[0]);
  }

  const words = body.trim().split(/\s+/).filter(Boolean).length;

  return {
    subject,
    body,
    fullEmail,
    unresolvedPlaceholders: Array.from(matches),
    wordCount: words,
  };
}
