import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onSearch, searchPlaceholder }) => {
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