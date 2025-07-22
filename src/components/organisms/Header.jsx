import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ onSearch, searchPlaceholder, currentView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActiveTab = (path) => {
    if (path === "/" && (location.pathname === "/" || location.pathname === "/dashboard")) {
      return true;
    }
    return location.pathname === path;
  };

  const handleTabClick = (path) => {
    navigate(path);
  };
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
            <ApperIcon name="BarChart3" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">
              Support Insights
            </h1>
            <p className="text-sm text-gray-600">
              Monitor user behavior and app health
            </p>
          </div>
</div>

        <div className="flex items-center gap-6">
          <nav className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleTabClick("/")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                isActiveTab("/")
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="LayoutDashboard" size={16} />
                Apps Dashboard
              </div>
            </button>
            <button
              onClick={() => handleTabClick("/trends")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                isActiveTab("/trends")
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="TrendingUp" size={16} />
                Trends Analysis
              </div>
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-80">
            <SearchBar
              onSearch={onSearch}
              placeholder={searchPlaceholder || "Search apps or users..."}
            />
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg">
            <ApperIcon name="Clock" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;