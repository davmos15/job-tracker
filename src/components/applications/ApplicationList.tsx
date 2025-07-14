import React, { useState, useMemo } from 'react';
import { Plus, Grid, List, ArrowUpDown, ChevronDown } from 'lucide-react';
import ApplicationCard from './ApplicationCard';
import FilterPanel from './FilterPanel';
import LoadingSpinner from '../common/LoadingSpinner';
import type { Application, ApplicationFilters } from '../../types/application';

interface ApplicationListProps {
  applications: Application[];
  loading: boolean;
  error: string | null;
  onCreateNew: () => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  filters: ApplicationFilters;
  onFiltersChange: (filters: ApplicationFilters) => void;
  filteredApplications: Application[];
}

type ViewMode = 'grid' | 'list';
type SortField = 'dateApplied' | 'company' | 'title' | 'status' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  loading,
  error,
  onCreateNew,
  onEdit,
  onDelete,
  filters,
  onFiltersChange,
  filteredApplications
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Get unique companies for filter
  const companies = useMemo(() => {
    const uniqueCompanies = [...new Set(applications.map(app => app.company))];
    return uniqueCompanies.sort();
  }, [applications]);

  // Sort applications
  const sortedApplications = useMemo(() => {
    return [...filteredApplications].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle date sorting
      if (sortField === 'dateApplied' || sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredApplications, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setIsSortOpen(false);
  };

  // Removed unused getSortLabel function

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <p className="text-lg font-medium">Error loading applications</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Job Applications
          </h1>
          <p className="text-muted-foreground">
            {applications.length} total • {filteredApplications.length} filtered
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="btn btn-secondary flex items-center"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sort: </span>
              <span className="sm:hidden">Sort</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>

            {isSortOpen && (
              <div className="absolute top-full right-0 mt-2 bg-card rounded-lg shadow-lg border border-border py-2 w-48 z-50">
                {[
                  { field: 'updatedAt', label: 'Last Updated' },
                  { field: 'dateApplied', label: 'Date Applied' },
                  { field: 'company', label: 'Company' },
                  { field: 'title', label: 'Job Title' },
                  { field: 'status', label: 'Status' }
                ].map(({ field, label }) => (
                  <button
                    key={field}
                    onClick={() => handleSort(field as SortField)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-accent ${
                      sortField === field ? 'bg-accent text-primary' : 'text-foreground'
                    }`}
                  >
                    {label}
                    {sortField === field && (
                      <span className="ml-2">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-input rounded">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-accent'
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-accent'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFiltersChange={onFiltersChange}
            companies={companies}
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
          />

          {/* Add New Button */}
          <button
            onClick={onCreateNew}
            className="btn btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Applications Grid/List */}
      {sortedApplications.length === 0 ? (
        <div className="text-center py-12">
          {applications.length === 0 ? (
            <div>
              <p className="text-xl font-medium text-foreground mb-2">
                No applications yet
              </p>
              <p className="text-muted-foreground mb-6">
                Start tracking your job applications by adding your first one.
              </p>
              <button
                onClick={onCreateNew}
                className="btn btn-primary flex items-center mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Application
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xl font-medium text-foreground mb-2">
                No applications match your filters
              </p>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or clearing the filters.
              </p>
              <button
                onClick={() => onFiltersChange({})}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {sortedApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Loading overlay */}
      {loading && applications.length > 0 && (
        <div className="fixed top-4 right-4 bg-card rounded-lg shadow-lg p-3 flex items-center space-x-2">
          <LoadingSpinner size="sm" />
          <span className="text-sm text-muted-foreground">Syncing...</span>
        </div>
      )}

      {/* Backdrop for dropdowns */}
      {(isSortOpen || isFilterOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsSortOpen(false);
            setIsFilterOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ApplicationList;