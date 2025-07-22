import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import { format, parseISO } from "date-fns";
import Header from "@/components/organisms/Header";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { 
  getTrendsData, 
  aggregateTrendsData, 
  getDateRangeOptions, 
  getUniqueStatuses,
  getTrendsSummary 
} from "@/services/api/supportService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const TrendsDashboard = () => {
  const [trendsData, setTrendsData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("30d");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);
  const [groupBy, setGroupBy] = useState("day");
  const [showCustomDate, setShowCustomDate] = useState(false);

  const dateRangeOptions = getDateRangeOptions();
  const allStatuses = getUniqueStatuses();

  const loadTrendsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let startDate, endDate;
      
      if (dateRange === "custom") {
        startDate = customStartDate ? new Date(customStartDate) : null;
        endDate = customEndDate ? new Date(customEndDate) : null;
      } else if (dateRangeOptions[dateRange]) {
        startDate = dateRangeOptions[dateRange].startDate;
        endDate = dateRangeOptions[dateRange].endDate;
      }
      
      const [rawData, summaryData] = await Promise.all([
        getTrendsData(startDate, endDate, statusFilter),
        getTrendsSummary(startDate, endDate, statusFilter)
      ]);
      
      const aggregatedData = aggregateTrendsData(rawData, groupBy);
      setTrendsData(aggregatedData);
      setSummary(summaryData);
      toast.success("Trends data loaded successfully");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load trends data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrendsData();
  }, [dateRange, customStartDate, customEndDate, statusFilter, groupBy]);

  const handleRetry = () => {
    loadTrendsData();
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    if (range !== "custom") {
      setShowCustomDate(false);
    } else {
      setShowCustomDate(true);
    }
  };

  const handleStatusToggle = (status) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearAllFilters = () => {
    setStatusFilter([]);
    setDateRange("30d");
    setCustomStartDate("");
    setCustomEndDate("");
    setShowCustomDate(false);
  };

  // Chart configurations
  const sentimentChartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#10B981'],
    xaxis: {
      categories: trendsData.map(item => {
        try {
          return format(parseISO(item.date), groupBy === 'month' ? 'MMM yyyy' : 'MMM d');
        } catch {
          return item.date;
        }
      }),
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      min: 0,
      max: 1,
      labels: {
        formatter: (val) => val.toFixed(2)
      }
    },
    tooltip: {
      y: {
        formatter: (val) => val.toFixed(3)
      }
    },
    grid: {
      borderColor: '#E5E7EB'
    }
  };

  const frustrationChartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#EF4444'],
    xaxis: {
      categories: trendsData.map(item => {
        try {
          return format(parseISO(item.date), groupBy === 'month' ? 'MMM yyyy' : 'MMM d');
        } catch {
          return item.date;
        }
      }),
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      min: 1,
      max: 5,
      labels: {
        formatter: (val) => val.toFixed(1)
      }
    },
    tooltip: {
      y: {
        formatter: (val) => val.toFixed(2)
      }
    },
    grid: {
      borderColor: '#E5E7EB'
    }
  };

  const sentimentSeries = [{
    name: 'Average Sentiment Score',
    data: trendsData.map(item => item.avgSentiment || 0)
  }];

  const frustrationSeries = [{
    name: 'Average Frustration Level', 
    data: trendsData.map(item => item.avgFrustration || 0)
  }];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentView="trends" />
        <div className="p-6">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentView="trends" />
        <div className="p-6">
          <Error message={error} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView="trends" />
      
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trends Analysis</h1>
          <p className="text-gray-600">
            Track sentiment scores and frustration levels over time across different user interaction categories
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="space-y-6">
            {/* Date Range Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Date Range
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(dateRangeOptions).map(([key, option]) => (
                  <Button
                    key={key}
                    onClick={() => handleDateRangeChange(key)}
                    className={cn(
                      "px-4 py-2 text-sm transition-colors",
                      dateRange === key
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
                <Button
                  onClick={() => handleDateRangeChange("custom")}
                  className={cn(
                    "px-4 py-2 text-sm transition-colors",
                    dateRange === "custom"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  Custom Range
                </Button>
              </div>
              
              {showCustomDate && (
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Group By Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Group By
              </label>
              <div className="flex gap-2">
                {[
                  { key: "day", label: "Day" },
                  { key: "week", label: "Week" },
                  { key: "month", label: "Month" }
                ].map(option => (
                  <Button
                    key={option.key}
                    onClick={() => setGroupBy(option.key)}
                    className={cn(
                      "px-4 py-2 text-sm transition-colors",
                      groupBy === option.key
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Filter by Status ({statusFilter.length} selected)
                </label>
                {statusFilter.length > 0 && (
                  <Button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allStatuses.map(status => (
                  <Badge
                    key={status}
                    onClick={() => handleStatusToggle(status)}
                    className={cn(
                      "cursor-pointer transition-all hover:scale-105",
                      statusFilter.includes(status)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {status.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <MetricCard
              icon="MessageSquare"
              title="Total Interactions"
              value={summary.totalInteractions.toLocaleString()}
              color="blue"
            />
            <MetricCard
              icon="Smile"
              title="Avg Sentiment"
              value={summary.avgSentiment.toFixed(3)}
              color="green"
            />
            <MetricCard
              icon="AlertTriangle"
              title="Avg Frustration"
              value={summary.avgFrustration.toFixed(2)}
              color="orange"
            />
            <MetricCard
              icon="BarChart3"
              title="Status Categories"
              value={Object.keys(summary.statusDistribution).length}
              color="purple"
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <ApperIcon name="Smile" size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Sentiment Score Trends
                </h3>
                <p className="text-sm text-gray-600">
                  Higher scores indicate more positive user interactions
                </p>
              </div>
            </div>
            
            {trendsData.length > 0 ? (
              <Chart
                options={sentimentChartOptions}
                series={sentimentSeries}
                type="line"
                height={300}
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available for selected period
              </div>
            )}
          </motion.div>

          {/* Frustration Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Frustration Level Trends
                </h3>
                <p className="text-sm text-gray-600">
                  Lower scores indicate smoother user experiences
                </p>
              </div>
            </div>
            
            {trendsData.length > 0 ? (
              <Chart
                options={frustrationChartOptions}
                series={frustrationSeries}
                type="line"
                height={300}
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available for selected period
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrendsDashboard;