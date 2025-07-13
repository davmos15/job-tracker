import React, { useState } from 'react';
import { useApplications } from '../hooks/useApplications';
import ApplicationList from '../components/applications/ApplicationList';
import ApplicationForm from '../components/applications/ApplicationForm';
import type { Application, ApplicationFormData, ApplicationFilters } from '../types/application';

const ApplicationsPage: React.FC = () => {
  const {
    applications,
    filteredApplications,
    loading,
    error,
    create,
    update,
    remove,
    filter
  } = useApplications();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [filters, setFilters] = useState<ApplicationFilters>({});

  const handleCreateNew = () => {
    setEditingApplication(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (application: Application) => {
    setEditingApplication(application);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
    } catch (error) {
      console.error('Error deleting application:', error);
      // TODO: Show error toast
    }
  };

  const handleFormSubmit = async (data: ApplicationFormData) => {
    try {
      setFormLoading(true);
      
      if (editingApplication) {
        await update(editingApplication.id, data);
      } else {
        await create(data);
      }
      
      setIsFormOpen(false);
      setEditingApplication(undefined);
    } catch (error) {
      console.error('Error saving application:', error);
      // TODO: Show error toast
      throw error; // Re-throw to keep form open
    } finally {
      setFormLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: ApplicationFilters) => {
    setFilters(newFilters);
    filter(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ApplicationList
        applications={applications}
        filteredApplications={filteredApplications}
        loading={loading}
        error={error}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <ApplicationForm
        application={editingApplication}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingApplication(undefined);
        }}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
    </div>
  );
};

export default ApplicationsPage;