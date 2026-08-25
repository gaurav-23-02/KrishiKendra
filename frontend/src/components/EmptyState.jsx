import React from 'react';
import { Sprout, RefreshCw } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Sprout,
  title = "No records found",
  message = "Try adjusting your search criteria or filter options.",
  onReset
}) => {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-2xl border border-gray-100 shadow-xs max-w-lg mx-auto my-6">
      <div className="w-14 h-14 bg-krishi-50 text-krishi-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-krishi-700 bg-krishi-50 hover:bg-krishi-100 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
