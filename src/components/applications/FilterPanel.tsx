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
        <div className="fixed md:absolute inset-x-4 md:inset-x-auto md:left-0 md:right-auto bottom-4 md:bottom-auto md:top-full md:mt-2 bg-card rounded-lg shadow-lg border border-border p-4 md:p-6 w-auto md:w-96 max-w-[calc(100vw-2rem)] md:max-w-md z-50 max-h-[80vh] md:max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
            <div className="flex items-center space-x-3">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onToggle}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {/* Search */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center">
                <Search className="w-4 h-4 mr-2" />
                Search
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors"
                placeholder="Search jobs or companies..."
                value={localFilters.searchTerm || ''}
                onChange={handleSearchChange}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                {APPLICATION_STATUSES.map((status) => (
                  <label key={status} className="flex items-center p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-input bg-background text-primary focus:ring-primary/20 mr-3"
                      checked={localFilters.status?.includes(status) || false}
                      onChange={(e) => handleStatusChange(status, e.target.checked)}
                    />
                    <span className="text-sm text-foreground">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Company Filter */}
            {companies.length > 0 && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Companies
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto pr-2">
                  {companies.map((company) => (
                    <label key={company} className="flex items-center p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-input bg-background text-primary focus:ring-primary/20 mr-3"
                        checked={localFilters.companies?.includes(company) || false}
                        onChange={(e) => handleCompanyChange(company, e.target.checked)}
                      />
                      <span className="text-sm text-foreground truncate">{company}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Date Range Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'week', label: '7 days' },
                    { key: 'month', label: '30 days' },
                    { key: 'quarter', label: '90 days' },
                    { key: 'year', label: '1 year' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => handleDateRangeChange(key as any)}
                      className="text-xs py-2 px-3 rounded-lg border border-input bg-background text-foreground hover:bg-accent transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
                
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground mb-2">Custom Range</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">From</label>
                      <input
                        type="date"
                        className="w-full px-2 py-1 text-xs border border-input bg-background text-foreground rounded focus:outline-none focus:ring-1 focus:ring-ring/20"
                        value={localFilters.dateRange?.start || ''}
                        onChange={(e) => handleCustomDateChange('start', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">To</label>
                      <input
                        type="date"
                        className="w-full px-2 py-1 text-xs border border-input bg-background text-foreground rounded focus:outline-none focus:ring-1 focus:ring-ring/20"
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