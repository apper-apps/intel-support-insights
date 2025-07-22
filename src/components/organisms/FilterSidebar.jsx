import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const FilterSidebar = ({ filters, onFiltersChange, statusCounts = {} }) => {
  const statusCategories = {
    "Positive Flow": ["smooth_progress", "learning_effectively", "feature_exploring", "goal_achieved", "highly_engaged"],
    "Neutral/Working": ["building_actively", "iterating", "experimenting", "asking_questions"],
    "Struggle Indicators": ["stuck", "confused", "repeating_issues", "frustrated", "going_in_circles"],
    "Critical States": ["abandonment_risk", "completely_lost", "angry", "giving_up"],
    "Help-Seeking": ["needs_guidance", "requesting_examples", "seeking_alternatives", "documentation_needed"],
    "Technical Issues": ["debugging", "troubleshooting_db", "performance_issues", "integration_problems"],
    "Special States": ["off_topic", "inactive", "testing_limits", "copy_pasting"]
  };

  const handleStatusChange = (status, checked) => {
    const newStatuses = checked
      ? [...filters.statuses, status]
      : filters.statuses.filter(s => s !== status);
    
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleCategoryToggle = (categoryStatuses) => {
    const allSelected = categoryStatuses.every(status => filters.statuses.includes(status));
    const newStatuses = allSelected
      ? filters.statuses.filter(s => !categoryStatuses.includes(s))
      : [...new Set([...filters.statuses, ...categoryStatuses])];
    
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const clearAllFilters = () => {
    onFiltersChange({ statuses: [] });
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-fit"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {filters.statuses.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-secondary transition-colors duration-150"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {Object.entries(statusCategories).map(([categoryName, categoryStatuses]) => {
          const allSelected = categoryStatuses.every(status => filters.statuses.includes(status));
          const someSelected = categoryStatuses.some(status => filters.statuses.includes(status));
          const categoryCount = categoryStatuses.reduce((sum, status) => sum + (statusCounts[status] || 0), 0);

          return (
            <div key={categoryName} className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleCategoryToggle(categoryStatuses)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-150"
                >
                  <ApperIcon 
                    name={allSelected ? "CheckSquare" : someSelected ? "Minus" : "Square"} 
                    size={16} 
                    className={allSelected || someSelected ? "text-primary" : "text-gray-400"}
                  />
                  {categoryName}
                </button>
                {categoryCount > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {categoryCount}
                  </span>
                )}
              </div>
              
              <div className="ml-6 space-y-2">
                {categoryStatuses.map((status) => {
                  const count = statusCounts[status] || 0;
                  const isChecked = filters.statuses.includes(status);
                  
                  return (
                    <label
                      key={status}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleStatusChange(status, e.target.checked)}
                        className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-150 flex-1">
                        {formatStatus(status)}
                      </span>
                      {count > 0 && (
                        <span className="text-xs text-gray-500">
                          {count}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FilterSidebar;