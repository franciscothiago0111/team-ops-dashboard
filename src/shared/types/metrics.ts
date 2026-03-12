export interface ITaskMetrics {
  total: number;
  pending: number;
  inProgress: number;
  done: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  overdue: number;
}

export interface IUserMetrics {
  total: number;
  active: number;
  byRole: {
    admin: number;
    manager: number;
    employee: number;
  };
}

export interface ITeamMetrics {
  total: number;
  averageTeamSize: number;
  teamsWithMostTasks: Array<{
    teamId: string;
    teamName: string;
    taskCount: number;
  }>;
}

export interface INotificationMetrics {
  total: number;
  unread: number;
  byType: {
    info: number;
    success: number;
    warning: number;
    error: number;
  };
}

export interface IProductivityMetrics {
  tasksCompletedInPeriod: number;
  averageCompletionTime: number;
  mostProductiveUsers: Array<{
    userId: string;
    userName: string;
    tasksCompleted: number;
  }>;
}

// ADMIN Metrics - Full company overview
export interface IAdminMetricsResponse {
  period: {
    startDate: string;
    endDate: string;
  };
  company: {
    id: string;
    name: string;
  };
  users: IUserMetrics;
  teams: ITeamMetrics;
  tasks: ITaskMetrics;
  notifications: INotificationMetrics;
  productivity: IProductivityMetrics;
  recentActivity: {
    totalActions: number;
    topActions: Array<{
      action: string;
      count: number;
    }>;
  };
}

// MANAGER Metrics - Team and direct reports overview
export interface IManagerMetricsResponse {
  period: {
    startDate: string;
    endDate: string;
  };
  manager: {
    id: string;
    name: string;
  };
  team: {
    id: string;
    name: string;
    memberCount: number;
  };
  directReports: {
    total: number;
    users: Array<{
      userId: string;
      userName: string;
      tasksAssigned: number;
      tasksCompleted: number;
      completionRate: number;
    }>;
  };
  tasks: ITaskMetrics;
  teamProductivity: {
    tasksCompletedInPeriod: number;
    averageTasksPerMember: number;
    topPerformers: Array<{
      userId: string;
      userName: string;
      tasksCompleted: number;
    }>;
  };
  notifications: INotificationMetrics;
}

// EMPLOYEE Metrics - Personal metrics
export interface IEmployeeMetricsResponse {
  period: {
    startDate: string;
    endDate: string;
  };
  employee: {
    id: string;
    name: string;
    role: string;
  };
  myTasks: ITaskMetrics;
  performance: {
    tasksCompletedInPeriod: number;
    completionRate: number;
    averageCompletionTime: number;
    tasksCreated: number;
  };
  team: {
    id: string;
    name: string;
    myRankInTeam: number;
    totalMembers: number;
  };
  notifications: INotificationMetrics;
  upcomingDeadlines: Array<{
    taskId: string;
    title: string;
    dueDate: string;
    priority: string;
  }>;
}

export type MetricsResponse = IAdminMetricsResponse | IManagerMetricsResponse | IEmployeeMetricsResponse;
