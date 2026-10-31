const API_BASE = '/api';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fallbackRoles = [
  {
    id: 'frontend-engineer',
    name: 'Frontend Engineer',
    category: 'Engineering',
    description: 'Build modern user interfaces, design systems, and performance-sensitive web experiences.',
    icon: 'Code2',
    topics: ['React', 'JavaScript', 'Accessibility', 'Browser Rendering', 'State Management'],
  },
  {
    id: 'backend-engineer',
    name: 'Backend Engineer',
    category: 'Core Tech',
    description: 'Design APIs, database interactions, and distributed platform reliability for production systems.',
    icon: 'Server',
    topics: ['REST APIs', 'System Design', 'Databases', 'Concurrency', 'Scaling'],
  },
  {
    id: 'data-engineer',
    name: 'Data Engineer',
    category: 'Data & Analytics',
    description: 'Create reliable pipelines, ETL flows, and analytics foundations that support business decisions.',
    icon: 'BarChart3',
    topics: ['ETL', 'SQL', 'Data Modeling', 'Pipeline Design', 'Performance Tuning'],
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    category: 'Behavioral',
    description: 'Balance customer problems, business outcomes, and roadmap trade-offs with strong prioritization.',
    icon: 'Layers',
    topics: ['Product Strategy', 'Prioritization', 'Metrics', 'Stakeholder Management', 'Execution'],
  },
];

const fallbackCompanies = [
  { id: 'google', name: 'Google', tagline: 'Search and AI', level: 'High bar' },
  { id: 'meta', name: 'Meta', tagline: 'Scale systems', level: 'High speed' },
  { id: 'amazon', name: 'Amazon', tagline: 'Customer obsession', level: 'Execution' },
  { id: 'microsoft', name: 'Microsoft', tagline: 'Platform impact', level: 'Strong breadth' },
];

const fallbackStats = {
  total_interviews: 4,
  average_score: 86,
  technical_score: 89,
  communication_score: 84,
  recent_history: [
    { id: 'r1', job_role: 'Frontend Engineer', score: 92, created_at: '2026-10-20' },
    { id: 'r2', job_role: 'Backend Engineer', score: 83, created_at: '2026-10-22' },
    { id: 'r3', job_role: 'Product Manager', score: 89, created_at: '2026-10-25' },
  ],
  strongest_topics: ['System Design', 'Problem Solving', 'Communication'],
  weakest_topics: ['Concurrency', 'Data Structures', 'Leadership Storytelling'],
  recommendations: ['Review distributed systems patterns', 'Practice STAR examples for leadership'],
  score_trends: [
    { name: 'Week 1', score: 78 },
    { name: 'Week 2', score: 81 },
    { name: 'Week 3', score: 89 },
    { name: 'Week 4', score: 86 },
  ],
};

async function requestJson(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(response.statusText || 'Request failed');
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function checkApiHealth() {
  return { ok: true, message: 'API mock mode is active' };
}

export async function verifyGeminiKey(apiKey) {
  return { valid: Boolean(apiKey && apiKey.length > 10) };
}

export async function fetchJobRoles() {
  const data = await requestJson(`${API_BASE}/roles`);
  return data || fallbackRoles;
}

export async function fetchCompanyTracks() {
  const data = await requestJson(`${API_BASE}/companies`);
  return data || fallbackCompanies;
}

export async function fetchCompensationEstimate(payload) {
  await sleep(200);
  return {
    salary: 185000,
    range: { min: 185000, max: 260000 },
    payload,
  };
}

export async function startInterview(payload) {
  await sleep(250);
  return {
    session: {
      id: 'demo-session-1',
      job_role: payload.job_role || 'Frontend Engineer',
      experience_level: payload.experience_level || 'Intermediate',
      interview_type: payload.interview_type || 'Technical',
      questions: [
        { id: 'q1', question: 'Describe a time you improved application performance.' },
        { id: 'q2', question: 'Walk through your approach to debugging a flaky production bug.' },
      ],
    },
  };
}

export async function setupInterview(payload) {
  return startInterview(payload);
}

export async function evaluateSingleAnswer(payload) {
  await sleep(250);
  return {
    score: 88,
    summary: 'Strong answer with clear structure and relevant examples.',
    strengths: ['Good ownership', 'Technical depth', 'Clear communication'],
    improvements: ['Add more metrics', 'Discuss trade-offs explicitly'],
    user_answer: payload.user_answer,
  };
}

export async function retryQuestionEvaluation(payload) {
  await sleep(250);
  return {
    score: 90,
    summary: 'Improved structure and detail.',
    payload,
  };
}

export async function submitFullInterview(payload) {
  await sleep(400);
  return {
    data: {
      job_role: 'Frontend Engineer',
      experience_level: 'Intermediate',
      interview_type: 'Technical',
      report: {
        overall_score: 88,
        technical_score: 89,
        communication_score: 84,
        strengths: ['System thinking', 'Clear trade-offs'],
        weaknesses: ['Could deepen architecture examples'],
        recommendations: ['Practice more coding interviews'],
      },
      answers: payload.answers,
    },
  };
}

export async function fetchDashboardStats(userId = 'guest_user') {
  await sleep(150);
  return {
    ...fallbackStats,
    user_id: userId,
  };
}

export async function deleteInterview(id) {
  await sleep(150);
  return { deleted: true, id };
}

export async function seedDemoData(userId = 'guest_user') {
  await sleep(200);
  return { seeded: true, userId };
}

export async function fetchInterviewSession(id) {
  await sleep(150);
  return {
    id,
    job_role: 'Frontend Engineer',
    experience_level: 'Intermediate',
    interview_type: 'Technical',
    evaluation_report: {
      overall_score: 88,
      technical_score: 89,
      communication_score: 84,
      strengths: ['System thinking', 'Clear communication'],
      weaknesses: ['Deeper data structures examples'],
      recommendations: ['Practice behavioral stories'],
    },
  };
}

export async function triggerDeepProbe(payload) {
  await sleep(200);
  return { ok: true, payload };
}

export async function parseJobFitDescription(payload) {
  await sleep(200);
  return { ok: true, summary: 'Strong fit for the role.', payload };
}

export async function fetchScenario(scenarioId = null) {
  await sleep(200);
  return {
    id: scenarioId || 'demo-scenario',
    title: 'Product trade-off scenario',
    prompt: 'You are designing a new dashboard feature for a growing user base.',
  };
}

export async function evaluateScenarioPhase(payload) {
  await sleep(250);
  return { ok: true, evaluation: payload };
}

export async function fetchRecoveryPlan(topic, jobRole = 'Software Developer') {
  await sleep(200);
  return {
    topic,
    jobRole,
    steps: ['Review fundamentals', 'Practice examples', 'Refine communication'],
  };
}

export async function fetchReadinessGate(userId = 'guest_user') {
  await sleep(200);
  return { userId, readiness: 84, message: 'Ready to interview' };
}

export async function fetchBlindSpotRadar(userId = 'guest_user') {
  await sleep(200);
  return { userId, blindSpots: ['Data Structures'], topSignals: ['Communication'] };
}

export async function submitDisputeFlag(payload) {
  await sleep(200);
  return { ok: true, payload };
}

export async function fetchDisputes(userId = 'guest_user') {
  await sleep(200);
  return { userId, disputes: [] };
}
