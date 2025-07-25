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
      className="bg-white border-b border-gray-200 px-6 py-4 lg:ml-0"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
            <ApperIcon name="BarChart3" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">
              Support Insights
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="w-80 max-w-sm">
            <SearchBar
              onSearch={onSearch}
              placeholder={searchPlaceholder || "Search apps or users..."}
            />
          </div>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-surface rounded-lg">
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