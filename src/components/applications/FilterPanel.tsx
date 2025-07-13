import React, { useState, useEffect } from 'react';
import { Filter, X, Calendar, Building, Search } from 'lucide-react';
import { APPLICATION_STATUSES } from '../../utils/constants';
import type { ApplicationFilters } from '../../types/application';
import { getDefaultDateRange } from '../../utils/dateUtils';

interface FilterPanelProps {
  filters: ApplicationFilters;
  onFiltersChange: (filters: ApplicationFilters) => void;
  companies: string[];
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  companies,
  isOpen,
  onToggle
}) => {
  const [localFilters, setLocalFilters] = useState<ApplicationFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...(localFilters.status || []), status as any]
      : (localFilters.status || []).filter(s => s !== status);
    
    const newFilters = {
      ...localFilters,
      status: newStatuses.length > 0 ? newStatuses as any : undefined
    };
    
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCompanyChange = (company: string, checked: boolean) => {
    const newCompanies = checked
      ? [...(localFilters.companies || []), company]
      : (localFilters.companies || []).filter(c => c !== company);
    
    const newFilters = {
      ...localFilters,
      companies: newCompanies.length > 0 ? newCompanies : undefined
    };
    
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (range: 'week' | 'month' | 'quarter' | 'year' | 'custom') => {
    let dateRange;
    
    if (range === 'custom') {
      // Keep existing custom range or set to current month
      dateRange = localFilters.dateRange || getDefaultDateRange('month');
    } else {
      dateRange = getDefaultDateRange(range);
    }
    
    const newFilters = {
      ...localFilters,
      dateRange
    };
    
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    const newDateRange = {
      start: field === 'start' ? value : localFilters.dateRange?.start || '',
      end: field === 'end' ? value : localFilters.dateRange?.end || ''
    };
    
    const newFilters = {
      ...localFilters,
      dateRange: newDateRange
    };
    
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value || undefined;
    const newFilters = {
      ...localFilters,
      searchTerm
    };
    
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: ApplicationFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Boolean(
    localFilters.status?.length ||
    localFilters.companies?.length ||
    localFilters.dateRange ||
    localFilters.searchTerm
  );

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={onToggle}
        className={`btn ${isOpen ? 'btn-primary' : 'btn-secondary'} flex items-center relative`}
      >
        <Filter className="w-4 h-4 mr-2" />
        Filters
        {hasActiveFilters && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80 z-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onToggle}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Search */}
            <div>
              <label className="label">
                <Search className="w-4 h-4 inline mr-2" />
                Search
              </label>
              <input
                type="text"
                className="input"
                placeholder="Search jobs or companies..."
                value={localFilters.searchTerm || ''}
                onChange={handleSearchChange}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="label">Status</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {APPLICATION_STATUSES.map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 mr-2"
                      checked={localFilters.status?.includes(status) || false}
                      onChange={(e) => handleStatusChange(status, e.target.checked)}
                    />
                    <span className="text-sm text-gray-700">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Company Filter */}
            {companies.length > 0 && (
              <div>
                <label className="label">
                  <Building className="w-4 h-4 inline mr-2" />
                  Companies
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {companies.map((company) => (
                    <label key={company} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 mr-2"
                        checked={localFilters.companies?.includes(company) || false}
                        onChange={(e) => handleCompanyChange(company, e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">{company}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Date Range Filter */}
            <div>
              <label className="label">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date Range
              </label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'week', label: 'Last 7 days' },
                    { key: 'month', label: 'Last 30 days' },
                    { key: 'quarter', label: 'Last 90 days' },
                    { key: 'year', label: 'Last year' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => handleDateRangeChange(key as any)}
                      className="text-sm py-1 px-2 rounded border border-gray-300 hover:bg-gray-50 text-left"
                    >
                      {label}
                    </button>
                  ))}
                </div>
                
                <div className="border-t pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">From</label>
                      <input
                        type="date"
                        className="input text-xs"
                        value={localFilters.dateRange?.start || ''}
                        onChange={(e) => handleCustomDateChange('start', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">To</label>
                      <input
                        type="date"
                        className="input text-xs"
                        value={localFilters.dateRange?.end || ''}
                        onChange={(e) => handleCustomDateChange('end', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={onToggle}
        />
      )}
    </div>
  );
};

export default FilterPanel;