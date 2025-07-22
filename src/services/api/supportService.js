import usersData from "@/services/mockData/users.json";
import appsData from "@/services/mockData/apps.json";
import appAILogsData from "@/services/mockData/appAILogs.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAppsWithUsers = async () => {
  await delay(300);
  
  try {
    // Combine apps with their corresponding user data
    const appsWithUsers = appsData.map(app => ({
      ...app,
      User: usersData.find(user => user.Id === app.UserId) || {
        Id: 0,
        Name: "Unknown User",
        Email: "unknown@example.com",
        UserId: "unknown",
        TotalApps: 0,
        TotalAppWithDB: 0,
        TotalCreditsUsed: 0,
        Plan: "Unknown",
        PlatformSignupDate: new Date().toISOString(),
        ApperSignupDate: new Date().toISOString(),
        CompanyID: "unknown",
        CompanyUserId: "unknown"
      }
    }));

    // Sort by LastMessageAt (most recent first)
    return appsWithUsers.sort((a, b) => new Date(b.LastMessageAt) - new Date(a.LastMessageAt));
  } catch (error) {
    throw new Error("Failed to load apps data");
  }
};

export const getAppAILogs = async () => {
  await delay(250);
  
  try {
    // Sort logs by CreatedAt (most recent first)
    return [...appAILogsData].sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
  } catch (error) {
    throw new Error("Failed to load AI logs data");
  }
};

export const getLogsByAppId = async (appId) => {
  await delay(200);
  
  try {
    const logs = appAILogsData.filter(log => log.AppId === parseInt(appId));
    return logs.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
  } catch (error) {
    throw new Error("Failed to load logs for app");
  }
};

export const getUserById = async (id) => {
  await delay(150);
  
  try {
    const user = usersData.find(user => user.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  } catch (error) {
    throw new Error("Failed to load user data");
  }
};

export const getAppById = async (id) => {
  await delay(200);
  
  try {
    const app = appsData.find(app => app.Id === parseInt(id));
    if (!app) {
      throw new Error("App not found");
    }
    
    const user = usersData.find(user => user.Id === app.UserId);
    return {
      ...app,
      User: user || {
        Id: 0,
        Name: "Unknown User",
        Email: "unknown@example.com",
        UserId: "unknown",
        TotalApps: 0,
        TotalAppWithDB: 0,
        TotalCreditsUsed: 0,
        Plan: "Unknown",
        PlatformSignupDate: new Date().toISOString(),
        ApperSignupDate: new Date().toISOString(),
        CompanyID: "unknown",
        CompanyUserId: "unknown"
      }
    };
  } catch (error) {
    throw new Error("Failed to load app data");
  }
};

export const getStatusSummary = async () => {
  await delay(200);
  
  try {
    const statusCounts = {};
    const totalApps = appsData.length;
    
    appsData.forEach(app => {
      const status = app.LastChatAnalysisStatus;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const criticalStatuses = ["abandonment_risk", "completely_lost", "angry", "giving_up"];
    const criticalCount = criticalStatuses.reduce((sum, status) => sum + (statusCounts[status] || 0), 0);
    
    const struggleStatuses = ["stuck", "confused", "repeating_issues", "frustrated", "going_in_circles"];
    const struggleCount = struggleStatuses.reduce((sum, status) => sum + (statusCounts[status] || 0), 0);

    return {
      totalApps,
      statusCounts,
      criticalCount,
      struggleCount,
      healthyCount: totalApps - criticalCount - struggleCount
    };
  } catch (error) {
throw new Error("Failed to generate status summary");
  }
};

// Trends analysis functions
export const getTrendsData = async (startDate, endDate, statusFilter = []) => {
  await delay(300);
  
  try {
    let filteredLogs = [...appAILogsData];
    
    // Apply date filter
    if (startDate || endDate) {
      filteredLogs = filteredLogs.filter(log => {
        const logDate = new Date(log.CreatedAt);
        if (startDate && logDate < startDate) return false;
        if (endDate && logDate > endDate) return false;
        return true;
      });
    }
    
    // Apply status filter
    if (statusFilter.length > 0) {
      filteredLogs = filteredLogs.filter(log => 
        statusFilter.includes(log.ChatAnalysisStatus)
      );
    }
    
    return filteredLogs.sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt));
  } catch (error) {
    throw new Error("Failed to load trends data");
  }
};

export const getDateRangeOptions = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return {
    "7d": {
      label: "Last 7 days",
      startDate: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
    },
    "30d": {
      label: "Last 30 days", 
      startDate: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
    },
    "90d": {
      label: "Last 90 days",
      startDate: new Date(today.getTime() - 89 * 24 * 60 * 60 * 1000), 
      endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
    }
  };
};

export const aggregateTrendsData = (logs, groupBy = "day") => {
  const groups = {};
  
  logs.forEach(log => {
    const date = new Date(log.CreatedAt);
    let key;
    
    switch (groupBy) {
      case "day":
        key = date.toISOString().split('T')[0];
        break;
      case "week":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case "month":
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }
    
    if (!groups[key]) {
      groups[key] = {
        date: key,
        sentimentScores: [],
        frustrationLevels: [],
        count: 0,
        statuses: {}
      };
    }
    
    groups[key].sentimentScores.push(log.SentimentScore);
    groups[key].frustrationLevels.push(log.FrustrationLevel);
    groups[key].count++;
    
    const status = log.ChatAnalysisStatus;
    groups[key].statuses[status] = (groups[key].statuses[status] || 0) + 1;
  });
  
  // Calculate averages and format data
  return Object.values(groups).map(group => ({
    date: group.date,
    avgSentiment: group.sentimentScores.reduce((a, b) => a + b, 0) / group.sentimentScores.length,
    avgFrustration: group.frustrationLevels.reduce((a, b) => a + b, 0) / group.frustrationLevels.length,
    count: group.count,
    statuses: group.statuses
  })).sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const getUniqueStatuses = () => {
  const statuses = [...new Set(appAILogsData.map(log => log.ChatAnalysisStatus))];
  return statuses.sort();
};

export const getTrendsSummary = async (startDate, endDate, statusFilter = []) => {
  await delay(200);
  
  try {
    const logs = await getTrendsData(startDate, endDate, statusFilter);
    
    if (logs.length === 0) {
      return {
        totalInteractions: 0,
        avgSentiment: 0,
        avgFrustration: 0,
        statusDistribution: {}
      };
    }
    
    const totalSentiment = logs.reduce((sum, log) => sum + log.SentimentScore, 0);
    const totalFrustration = logs.reduce((sum, log) => sum + log.FrustrationLevel, 0);
    
    const statusCounts = {};
    logs.forEach(log => {
      const status = log.ChatAnalysisStatus;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return {
      totalInteractions: logs.length,
      avgSentiment: totalSentiment / logs.length,
      avgFrustration: totalFrustration / logs.length,
      statusDistribution: statusCounts
    };
  } catch (error) {
    throw new Error("Failed to generate trends summary");
  }
};