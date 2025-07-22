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