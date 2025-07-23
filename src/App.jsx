import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Dashboard from "@/components/organisms/Dashboard";
import TrendsDashboard from "@/components/organisms/TrendsDashboard";
import Sidebar from "@/components/organisms/Sidebar";

function App() {
  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/trends" element={<TrendsDashboard />} />
              <Route path="/users" element={<div className="p-6"><h1 className="text-2xl font-bold">Users Page</h1><p className="text-gray-600 mt-2">User management interface coming soon...</p></div>} />
              <Route path="/ai-logs" element={<div className="p-6"><h1 className="text-2xl font-bold">AI Logs Page</h1><p className="text-gray-600 mt-2">AI interaction logs interface coming soon...</p></div>} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;