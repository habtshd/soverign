const API_BASE = '/api/v1';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; [key: string]: any }> {
  const token = localStorage.getItem('sovereign_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `Request failed with status ${response.status}`,
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error communicating with Sovereign API',
    };
  }
}

function buildQuery(params?: Record<string, any>) {
  if (!params) return '';
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      clean[k] = String(v);
    }
  }
  const qs = new URLSearchParams(clean).toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  // Auth
  auth: {
    login: (credentials: { identifier?: string; email?: string; password: string }) =>
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          identifier: credentials.identifier || credentials.email,
          password: credentials.password,
        }),
      }),
    register: (data: any) =>
      apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => apiRequest('/auth/me'),
  },

  // Members
  members: {
    getAll: (params?: Record<string, any>) =>
      apiRequest(`/members${buildQuery(params)}`),
    getById: (id: string) => apiRequest(`/members/${id}`),
    updateProfile: (id: string, data: any) =>
      apiRequest(`/members/${id}/profile`, { method: 'PATCH', body: JSON.stringify(data) }),
    verifyDigitalId: (code: string) => apiRequest(`/members/digital-id/${code}`),
    getApplications: (params?: Record<string, any>) =>
      apiRequest(`/members/applications${buildQuery(params)}`),
    submitApplication: (data: any) =>
      apiRequest('/members/apply', { method: 'POST', body: JSON.stringify(data) }),
    reviewApplication: (id: string, status: 'APPROVED' | 'REJECTED', notes: string) =>
      apiRequest(`/members/applications/${id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      }),
    verifyMember: (id: string, data: { verificationType: string; notes?: string }) =>
      apiRequest(`/members/${id}/verify`, { method: 'POST', body: JSON.stringify(data) }),
    getTypes: () => apiRequest('/members/types'),
  },

  // Events
  events: {
    getAll: (params?: Record<string, any>) =>
      apiRequest(`/events${buildQuery(params)}`),
    getById: (id: string) => apiRequest(`/events/${id}`),
    create: (data: any) =>
      apiRequest('/events', { method: 'POST', body: JSON.stringify(data) }),
    register: (id: string) =>
      apiRequest(`/events/${id}/register`, { method: 'POST' }),
    cancel: (id: string) =>
      apiRequest(`/events/${id}/cancel`, { method: 'POST' }),
    checkIn: (id: string, memberCode: string, method = 'QR_SCAN') =>
      apiRequest(`/events/${id}/checkin`, {
        method: 'POST',
        body: JSON.stringify({ memberCode, method }),
      }),
    feedback: (id: string, rating: number, comments?: string) =>
      apiRequest(`/events/${id}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ rating, comments }),
      }),
    getCategories: () => apiRequest('/events/categories'),
    getLocations: () => apiRequest('/events/locations'),
  },

  // Learning
  learning: {
    getCourses: () => apiRequest('/learning/courses'),
    getCourseBySlug: (slug: string) => apiRequest(`/learning/courses/${slug}`),
    enroll: (id: string) => apiRequest(`/learning/courses/${id}/enroll`, { method: 'POST' }),
    toggleLesson: (lessonId: string) =>
      apiRequest(`/learning/lessons/${lessonId}/toggle`, { method: 'POST' }),
    getBooks: () => apiRequest('/learning/books'),
    getPodcasts: () => apiRequest('/learning/podcasts'),
  },

  // Mentorship
  mentorship: {
    getMentors: () => apiRequest('/mentorship/mentors'),
    getMyMentorship: () => apiRequest('/mentorship/my-mentorship'),
    scheduleSession: (data: any) =>
      apiRequest('/mentorship/sessions', { method: 'POST', body: JSON.stringify(data) }),
    updateSession: (id: string, data: any) =>
      apiRequest(`/mentorship/sessions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    createGoal: (data: any) =>
      apiRequest('/mentorship/goals', { method: 'POST', body: JSON.stringify(data) }),
    updateGoal: (id: string, status: string) =>
      apiRequest(`/mentorship/goals/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    addNote: (data: any) =>
      apiRequest('/mentorship/notes', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Fitness
  fitness: {
    getPrograms: () => apiRequest('/fitness/programs'),
    getChallenges: () => apiRequest('/fitness/challenges'),
    joinChallenge: (id: string) =>
      apiRequest(`/fitness/challenges/${id}/join`, { method: 'POST' }),
    logChallengeProgress: (id: string, addedValue: number) =>
      apiRequest(`/fitness/challenges/${id}/progress`, {
        method: 'POST',
        body: JSON.stringify({ addedValue }),
      }),
    logWorkout: (data: any) =>
      apiRequest('/fitness/workout', { method: 'POST', body: JSON.stringify(data) }),
    logProgress: (data: any) =>
      apiRequest('/fitness/progress', { method: 'POST', body: JSON.stringify(data) }),
    getHistory: () => apiRequest('/fitness/history'),
  },

  // Business & Career
  business: {
    getOpportunities: () => apiRequest('/business/opportunities'),
    createOpportunity: (data: any) =>
      apiRequest('/business/opportunities', { method: 'POST', body: JSON.stringify(data) }),
    getNetwork: () => apiRequest('/business/network'),
    upsertProfile: (data: any) =>
      apiRequest('/business/profile', { method: 'POST', body: JSON.stringify(data) }),
    getJobs: () => apiRequest('/business/jobs'),
    createJob: (data: any) =>
      apiRequest('/business/jobs', { method: 'POST', body: JSON.stringify(data) }),
    applyJob: (id: string, data: any) =>
      apiRequest(`/business/jobs/${id}/apply`, { method: 'POST', body: JSON.stringify(data) }),
  },

  // Community Service
  service: {
    getProjects: () => apiRequest('/service/projects'),
    volunteer: (id: string, role?: string) =>
      apiRequest(`/service/projects/${id}/volunteer`, {
        method: 'POST',
        body: JSON.stringify({ role }),
      }),
    logHours: (id: string, hours: number, notes?: string) =>
      apiRequest(`/service/projects/${id}/hours`, {
        method: 'POST',
        body: JSON.stringify({ hours, notes }),
      }),
  },

  // Community
  community: {
    getAnnouncements: () => apiRequest('/community/announcements'),
    createAnnouncement: (data: any) =>
      apiRequest('/community/announcements', { method: 'POST', body: JSON.stringify(data) }),
    getPosts: () => apiRequest('/community/posts'),
    createPost: (data: { content: string; mediaUrl?: string }) =>
      apiRequest('/community/posts', { method: 'POST', body: JSON.stringify(data) }),
    toggleLike: (id: string) =>
      apiRequest(`/community/posts/${id}/like`, { method: 'POST' }),
    addComment: (id: string, content: string) =>
      apiRequest(`/community/posts/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
  },

  // Finance
  finance: {
    getOverview: () => apiRequest('/finance/overview'),
    getCategories: () => apiRequest('/finance/categories'),
    recordExpense: (data: any) =>
      apiRequest('/finance/expenses', { method: 'POST', body: JSON.stringify(data) }),
    recordIncome: (data: any) =>
      apiRequest('/finance/income', { method: 'POST', body: JSON.stringify(data) }),
    createInvoice: (data: any) =>
      apiRequest('/finance/invoices', { method: 'POST', body: JSON.stringify(data) }),
    recordPayment: (data: any) =>
      apiRequest('/finance/payments', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Notifications
  notifications: {
    getMine: () => apiRequest('/notifications'),
    markRead: (id: string) => apiRequest(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => apiRequest('/notifications/read-all', { method: 'POST' }),
  },

  // Integrations
  integrations: {
    getAll: () => apiRequest('/integrations'),
    syncGoogleSheets: () => apiRequest('/integrations/google/sync', { method: 'POST' }),
    linkTelegram: (telegramUsername: string) =>
      apiRequest('/integrations/telegram/link', {
        method: 'POST',
        body: JSON.stringify({ telegramUsername }),
      }),
    broadcastTelegram: (announcementId: string) =>
      apiRequest('/integrations/telegram/broadcast', {
        method: 'POST',
        body: JSON.stringify({ announcementId }),
      }),
  },

  // Admin
  admin: {
    getDashboard: () => apiRequest('/admin/dashboard'),
    getAuditLogs: (params?: Record<string, any>) =>
      apiRequest(`/admin/audit-logs${buildQuery(params)}`),
    getSettings: () => apiRequest('/admin/settings'),
    updateSetting: (key: string, value: string, description?: string) =>
      apiRequest('/admin/settings', {
        method: 'POST',
        body: JSON.stringify({ key, value, description }),
      }),
    search: (query: string) => apiRequest(`/admin/search?q=${encodeURIComponent(query)}`),
  },
};
