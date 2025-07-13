import React from 'react';
import { useApplications } from '../hooks/useApplications';
import StatsCards from '../components/stats/StatsCards';
import StatusChart from '../components/stats/StatusChart';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StatsPage: React.FC = () => {
  const { applications, loading, error } = useApplications();

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-destructive mb-4">
            <p className="text-lg font-medium">Error loading analytics</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          View your application statistics and insights
        </p>
      </div>

      <div className="space-y-8">
        {/* Stats Cards */}
        <StatsCards applications={applications} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StatusChart applications={applications} />
          
          {/* Placeholder for timeline chart */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Application Timeline</h3>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>Timeline chart coming soon</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Recent Activity</h3>
          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 5)
                .map((app) => (
                  <div key={app.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{app.title}</p>
                      <p className="text-sm text-muted-foreground">{app.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foreground">{app.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(app.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;