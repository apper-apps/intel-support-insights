import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import AppList from "@/components/organisms/AppList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { getAppsWithUsers, getAppAILogs } from "@/services/api/supportService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [apps, setApps] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
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

  useEffect(() => {
    let filtered = [...apps];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.AppName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.User.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.User.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(app => 
        filters.statuses.includes(app.LastChatAnalysisStatus)
      );
    }

    setFilteredApps(filtered);
  }, [apps, searchTerm, filters]);

  const getStatusCounts = () => {
    const counts = {};
    apps.forEach(app => {
      const status = app.LastChatAnalysisStatus;
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={setSearchTerm}
        searchPlaceholder="Search apps by name or user email..."
      />
      
      <div className="p-6">
        <div className="flex gap-6">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            statusCounts={getStatusCounts()}
          />
          
          <div className="flex-1">
            {filteredApps.length === 0 && !loading ? (
              <Empty
                title="No apps found"
                description="Try adjusting your search terms or filter selections to find matching apps."
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