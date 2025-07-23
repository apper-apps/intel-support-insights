import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "LayoutDashboard",
      path: "/",
      description: "Apps overview and metrics"
    },
    {
      id: "app-overview",
      label: "App Overview", 
      icon: "BarChart3",
      path: "/trends",
      description: "Trends and analytics"
    },
    {
      id: "users",
      label: "Users",
      icon: "Users",
      path: "/users",
      description: "User management"
    },
    {
      id: "ai-logs",
      label: "AI Logs",
      icon: "MessageSquare",
      path: "/ai-logs",
      description: "AI interaction logs"
    }
  ];

  const isActivePath = (path) => {
    if (path === "/" && (location.pathname === "/" || location.pathname === "/dashboard")) {
      return true;
    }
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
      >
        <ApperIcon name={isMobileOpen ? "X" : "Menu"} size={20} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ 
          x: isMobileOpen ? 0 : -280,
        }}
        className={cn(
          "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 sidebar-mobile",
          "lg:relative lg:translate-x-0 lg:z-auto",
          isCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
                <ApperIcon name="BarChart3" size={20} className="text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h2 className="text-lg font-bold gradient-text">
                    Support Insights
                  </h2>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200",
                      isActivePath(item.path)
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <ApperIcon 
                      name={item.icon} 
                      size={18} 
                      className={isActivePath(item.path) ? "text-white" : "text-gray-500"}
                    />
                    {!isCollapsed && (
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.label}</div>
                        {!isActivePath(item.path) && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            {item.description}
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Collapse Toggle (Desktop Only) */}
          <div className="hidden lg:block p-4 border-t border-gray-200">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon 
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                size={16} 
              />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;