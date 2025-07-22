import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Try adjusting your filters or search terms",
  actionLabel = "Reset Filters",
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-6">
        <ApperIcon 
          name="Search" 
          size={64} 
          className="text-gray-400"
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center max-w-md mb-8">
        {description}
      </p>

      {onAction && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <ApperIcon name="RotateCcw" size={16} />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;