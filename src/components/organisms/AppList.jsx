import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "@/components/molecules/StatusBadge";
import MetricCard from "@/components/molecules/MetricCard";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AppList = ({ apps, logs, loading }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedLog, setSelectedLog] = useState(null);
  const [sortBy, setSortBy] = useState("LastMessageAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const toggleRow = (appId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(appId)) {
      newExpanded.delete(appId);
    } else {
      newExpanded.add(appId);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const sortedApps = [...apps].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === "LastMessageAt" || sortBy === "CreatedAt") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const getAppLogs = (appId) => {
    return logs.filter(log => log.AppId === appId);
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-medium text-gray-700 hover:text-gray-900 transition-colors duration-150"
    >
      {children}
      {sortBy === field && (
        <ApperIcon 
          name={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"} 
          size={16} 
        />
      )}
    </button>
);

  const LogDetailModal = ({ log, onClose }) => {
    if (!log) return null;

    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Analysis Log Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Status and Timestamp */}
            <div className="flex items-center justify-between">
              <StatusBadge status={log.ChatAnalysisStatus} />
              <span className="text-sm text-gray-500">
                {format(new Date(log.CreatedAt), "MMM d, yyyy 'at' HH:mm")}
              </span>
            </div>

            {/* Summary */}
            {log.Summary && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {log.Summary}
                </p>
              </div>
            )}

            {/* Metrics Grid */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Analysis Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                  icon="Heart"
                  title="Sentiment Score"
                  value={log.SentimentScore?.toFixed(2) || "N/A"}
                  color={log.SentimentScore > 0.5 ? "green" : log.SentimentScore > 0 ? "orange" : "red"}
                />
                <MetricCard
                  icon="Zap"
                  title="Frustration Level"
                  value={`${log.FrustrationLevel || 0}/5`}
                  color={log.FrustrationLevel > 3 ? "red" : log.FrustrationLevel > 2 ? "orange" : "green"}
                />
                <MetricCard
                  icon="Brain"
                  title="Technical Complexity"
                  value={`${log.TechnicalComplexity || 0}/5`}
                  color="blue"
                />
                {log.ModelUsed && (
                  <MetricCard
                    icon="Bot"
                    title="AI Model Used"
                    value={log.ModelUsed}
                    color="purple"
                  />
                )}
              </div>
            </div>

            {/* Error Message */}
            {log.ErrorMessage && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Error Details</h4>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <ApperIcon name="AlertCircle" size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-red-700 text-sm leading-relaxed">{log.ErrorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Log ID:</span>
                  <span className="text-gray-600 ml-2">{log.Id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">App ID:</span>
                  <span className="text-gray-600 ml-2">{log.AppId}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 bg-surface p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Apps Overview</h2>
          <div className="text-sm text-gray-500">
            {apps.length} total apps
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-4 text-sm">
          <SortButton field="AppName">App Name</SortButton>
          <div>User</div>
          <div>Category</div>
          <SortButton field="LastChatAnalysisStatus">Status</SortButton>
          <SortButton field="TotalMessages">Messages</SortButton>
          <SortButton field="LastMessageAt">Last Activity</SortButton>
          <div>Actions</div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedApps.map((app) => {
          const appLogs = getAppLogs(app.Id);
          const isExpanded = expandedRows.has(app.Id);
          const latestLog = appLogs[0]; // Assuming logs are sorted by date
          
          return (
            <motion.div
              key={app.Id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="p-4">
                <div className="grid grid-cols-7 gap-4 items-center text-sm">
                  <div className="font-medium text-gray-900">
                    {app.AppName}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                      {app.User.Name}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {app.User.Email}
                    </div>
                  </div>
                  
                  <div className="text-gray-600">
                    {app.AppCategory}
                    {app.IsDbConnected && (
                      <div className="flex items-center gap-1 mt-1">
                        <ApperIcon name="Database" size={12} className="text-green-500" />
                        <span className="text-xs text-green-600">DB Connected</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <StatusBadge status={app.LastChatAnalysisStatus} />
                  </div>
                  
                  <div className="text-gray-900 font-medium">
                    {app.TotalMessages.toLocaleString()}
                  </div>
                  
                  <div className="text-gray-600">
                    {format(new Date(app.LastMessageAt), "MMM d, HH:mm")}
                  </div>
                  
                  <div>
                    <button
                      onClick={() => toggleRow(app.Id)}
                      className="flex items-center gap-1 text-primary hover:text-secondary font-medium transition-colors duration-150"
                    >
                      <ApperIcon 
                        name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                        size={16} 
                      />
                      {appLogs.length} logs
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <div className="space-y-4">
                        {/* Metrics Summary */}
                        {latestLog && (
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <MetricCard
                              icon="Heart"
                              title="Sentiment Score"
                              value={latestLog.SentimentScore?.toFixed(2) || "N/A"}
                              color={latestLog.SentimentScore > 0.5 ? "green" : latestLog.SentimentScore > 0 ? "orange" : "red"}
                            />
                            <MetricCard
                              icon="Zap"
                              title="Frustration Level"
                              value={`${latestLog.FrustrationLevel || 0}/5`}
                              color={latestLog.FrustrationLevel > 3 ? "red" : latestLog.FrustrationLevel > 2 ? "orange" : "green"}
                            />
                            <MetricCard
                              icon="Brain"
                              title="Technical Complexity"
                              value={`${latestLog.TechnicalComplexity || 0}/5`}
                              color="blue"
                            />
                          </div>
                        )}

                        {/* Logs List */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Recent Analysis Logs</h4>
                          {appLogs.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">No analysis logs available</p>
                          ) : (
<div className="space-y-3 max-h-64 overflow-y-auto">
                              {appLogs.map((log) => (
                                <motion.div
                                  key={log.Id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-gray-50 rounded-lg p-3 border cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                                  onClick={() => setSelectedLog(log)}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <StatusBadge status={log.ChatAnalysisStatus} />
                                    <span className="text-xs text-gray-500">
                                      {format(new Date(log.CreatedAt), "MMM d, HH:mm")}
                                    </span>
                                  </div>
                                  
                                  {log.Summary && (
                                    <p className="text-sm text-gray-700 mb-2">
                                      {log.Summary}
                                    </p>
                                  )}
                                  
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>Sentiment: {log.SentimentScore?.toFixed(2) || "N/A"}</span>
                                    <span>Frustration: {log.FrustrationLevel || 0}/5</span>
                                    <span>Complexity: {log.TechnicalComplexity || 0}/5</span>
                                    {log.ModelUsed && <span>Model: {log.ModelUsed}</span>}
                                  </div>
                                  
                                  {log.ErrorMessage && (
                                    <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                                      <strong>Error:</strong> {log.ErrorMessage}
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
</div>

      <AnimatePresence>
        {selectedLog && (
          <LogDetailModal 
            log={selectedLog} 
            onClose={() => setSelectedLog(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppList;