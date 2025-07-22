import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
        <div className="h-10 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-4">
        <div className="w-64 space-y-4">
          <div className="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              <div className="space-y-2 ml-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="border-b bg-gray-50 p-4">
              <div className="flex gap-4">
                <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Table rows */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="border-b p-4 space-y-3"
              >
                <div className="flex items-center gap-4">
                  <div className="h-5 w-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  <div className="h-5 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                  <div className="h-5 w-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  <div className="h-5 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="h-4 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;