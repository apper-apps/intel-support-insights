import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import AppList from "@/components/organisms/AppList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import MetricCard from "@/components/molecules/MetricCard";
import ApperIcon from "@/components/ApperIcon";
import { getAppsWithUsers, getAppAILogs, getUserById } from "@/services/api/supportService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Dashboard = () => {
  const [apps, setApps] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userApps, setUserApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    statuses: []
  });

const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [appsData, logsData] = await Promise.all([
        getAppsWithUsers(),
        getAppAILogs()
      ]);
      
      setApps(appsData);
      setLogs(logsData);
      
      // Auto-select first user if available
      if (appsData.length > 0 && !selectedUser) {
        const firstUser = appsData[0].User;
        setSelectedUser(firstUser);
      }
      
      toast.success("Data loaded successfully");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter apps by selected user
  useEffect(() => {
    if (selectedUser && apps.length > 0) {
      const userSpecificApps = apps.filter(app => app.UserId === selectedUser.Id);
      setUserApps(userSpecificApps);
    } else {
      setUserApps([]);
    }
  }, [selectedUser, apps]);

useEffect(() => {
    let filtered = [...userApps];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.AppName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.AppCategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(app => 
        filters.statuses.includes(app.LastChatAnalysisStatus)
      );
    }

    setFilteredApps(filtered);
  }, [userApps, searchTerm, filters]);

const getStatusCounts = () => {
    const counts = {};
    userApps.forEach(app => {
      const status = app.LastChatAnalysisStatus;
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  };

  const handleUserSelect = async (userId) => {
    try {
      const user = await getUserById(userId);
      setSelectedUser(user);
      // Reset filters when switching users
      setFilters({ statuses: [] });
      setSearchTerm("");
      toast.success(`Switched to ${user.Name}'s dashboard`);
    } catch (err) {
      toast.error("Failed to load user data");
    }
  };

  const getUniqueUsers = () => {
    const users = new Map();
    apps.forEach(app => {
      if (app.User && !users.has(app.User.Id)) {
        users.set(app.User.Id, app.User);
      }
    });
    return Array.from(users.values());
  };

  const getUserStats = () => {
    if (!selectedUser || userApps.length === 0) {
      return { totalApps: 0, connectedApps: 0, totalMessages: 0, avgSentiment: 0 };
    }

    const connectedApps = userApps.filter(app => app.IsDbConnected).length;
    const totalMessages = userApps.reduce((sum, app) => sum + app.TotalMessages, 0);
    
    // Calculate average sentiment from user's app logs
    const userLogs = logs.filter(log => 
      userApps.some(app => app.Id === log.AppId)
    );
    const avgSentiment = userLogs.length > 0 
      ? userLogs.reduce((sum, log) => sum + (log.SentimentScore || 0), 0) / userLogs.length
      : 0;

    return {
      totalApps: userApps.length,
      connectedApps,
      totalMessages,
      avgSentiment: avgSentiment.toFixed(2)
    };
  };

  const handleRetry = () => {
    loadData();
  };

  const handleResetFilters = () => {
    setFilters({ statuses: [] });
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={() => {}} />
        <div className="p-6">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={() => {}} />
        <div className="p-6">
          <Error message={error} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

const UserDetailsCard = () => {
    if (!selectedUser) return null;

    const stats = getUserStats();
    const users = getUniqueUsers();

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">User Dashboard</h2>
          
          {/* User Selector */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">View User:</label>
            <select
              value={selectedUser.Id}
              onChange={(e) => handleUserSelect(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {users.map(user => (
                <option key={user.Id} value={user.Id}>
                  {user.Name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Details */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ApperIcon name="User" size={16} className="text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedUser.Name}</p>
                      <p className="text-sm text-gray-500">Full Name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Mail" size={16} className="text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedUser.Email}</p>
                      <p className="text-sm text-gray-500">Email Address</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Hash" size={16} className="text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedUser.UserId}</p>
                      <p className="text-sm text-gray-500">User ID</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Account Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Crown" size={16} className="text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedUser.Plan}</p>
                      <p className="text-sm text-gray-500">Current Plan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Calendar" size={16} className="text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {format(new Date(selectedUser.ApperSignupDate), "MMM d, yyyy")}
                      </p>
                      <p className="text-sm text-gray-500">Joined Apper</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Coins" size={16} className="text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedUser.TotalCreditsUsed.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Credits Used</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">App Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                icon="Smartphone"
                title="Total Apps"
                value={stats.totalApps}
                color="blue"
              />
              <MetricCard
                icon="Database"
                title="DB Connected"
                value={stats.connectedApps}
                color="green"
              />
              <MetricCard
                icon="MessageCircle"
                title="Total Messages"
                value={stats.totalMessages.toLocaleString()}
                color="purple"
              />
              <MetricCard
                icon="Heart"
                title="Avg Sentiment"
                value={stats.avgSentiment}
                color={stats.avgSentiment > 0.7 ? "green" : stats.avgSentiment > 0.5 ? "orange" : "red"}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={setSearchTerm}
        searchPlaceholder="Search user's apps by name or category..."
        currentView="dashboard"
      />
      <div className="p-6">
        <UserDetailsCard />
        
        <div className="flex gap-6">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            statusCounts={getStatusCounts()}
          />
          
          <div className="flex-1">
            {!selectedUser ? (
              <Empty
                title="No user selected"
                description="Please select a user to view their dashboard and apps."
                actionLabel="Load Data"
                onAction={loadData}
              />
            ) : filteredApps.length === 0 && !loading ? (
              <Empty
                title="No apps found"
                description="This user has no apps matching your current filters."
                actionLabel="Reset Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <AppList 
                  apps={filteredApps} 
                  logs={logs}
                  loading={loading}
                  showPagination={true}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;