import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Calendar, Building, Link as LinkIcon, DollarSign } from 'lucide-react';
import { applicationSchema } from '../../utils/validation';
import { APPLICATION_STATUSES, SALARY_TYPES } from '../../utils/constants';
import type { Application, ApplicationFormData } from '../../types/application';
import LoadingSpinner from '../common/LoadingSpinner';

interface ApplicationFormProps {
  application?: Application;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  loading?: boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  application,
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<any>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      salaryType: 'Seek Estimate'
    }
  });

  // Reset form when application changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (application) {
        // Ensure dateApplied is in YYYY-MM-DD format for the date input
        const dateApplied = application.dateApplied.includes('T') 
          ? application.dateApplied.split('T')[0] 
          : application.dateApplied;
        
        reset({
          title: application.title,
          company: application.company,
          jobLink: application.jobLink || '',
          dateApplied: dateApplied,
          status: application.status,
          salary: application.salary || '',
          salaryType: application.salaryType,
          benefits: application.benefits || '',
          notes: application.notes || '',
          selectionCriteria: application.selectionCriteria || ''
        });
      } else {
        reset({
          title: '',
          company: '',
          jobLink: '',
          dateApplied: new Date().toISOString().split('T')[0],
          status: 'Applied',
          salary: '',
          salaryType: 'Seek Estimate',
          benefits: '',
          notes: '',
          selectionCriteria: ''
        });
      }
    }
  }, [application, isOpen, reset]);

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error handling is done by parent component
      console.error('Form submission error:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {application ? 'Edit Application' : 'Add New Application'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting || loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Job Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <Building className="w-4 h-4 inline mr-2" />
                Job Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="input"
                placeholder="e.g., Software Engineer"
              />
              {errors.title && (
                <p className="form-error">{errors.title.message as string}</p>
              )}
            </div>

            <div>
              <label className="label">
                <Building className="w-4 h-4 inline mr-2" />
                Company *
              </label>
              <input
                {...register('company')}
                type="text"
                className="input"
                placeholder="e.g., Tech Corp"
              />
              {errors.company && (
                <p className="form-error">{errors.company.message as string}</p>
              )}
            </div>
          </div>

          {/* Job Link */}
          <div>
            <label className="label">
              <LinkIcon className="w-4 h-4 inline mr-2" />
              Job Posting URL
            </label>
            <input
              {...register('jobLink')}
              type="url"
              className="input"
              placeholder="https://company.com/jobs/123"
            />
            {errors.jobLink && (
              <p className="form-error">{errors.jobLink.message as string}</p>
            )}
          </div>

          {/* Date Applied & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date Applied *
              </label>
              <input
                {...register('dateApplied')}
                type="date"
                className="input"
              />
              {errors.dateApplied && (
                <p className="form-error">{errors.dateApplied.message as string}</p>
              )}
            </div>

            <div>
              <label className="label">Status</label>
              <select
                {...register('status')}
                className="input"
              >
                {APPLICATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="form-error">{errors.status.message as string}</p>
              )}
            </div>
          </div>

          {/* Salary Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Salary
              </label>
              <input
                {...register('salary')}
                type="text"
                className="input"
                placeholder="e.g., 80000"
              />
              {errors.salary && (
                <p className="form-error">{errors.salary.message as string}</p>
              )}
            </div>

            <div>
              <label className="label">Salary Type</label>
              <select
                {...register('salaryType')}
                className="input"
              >
                {SALARY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.salaryType && (
                <p className="form-error">{errors.salaryType.message as string}</p>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="label">Benefits</label>
            <textarea
              {...register('benefits')}
              className="input min-h-[80px] resize-y"
              placeholder="Health insurance, 401k, remote work..."
              rows={3}
            />
            {errors.benefits && (
              <p className="form-error">{errors.benefits.message as string}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes</label>
            <textarea
              {...register('notes')}
              className="input min-h-[100px] resize-y"
              placeholder="Additional notes about this application..."
              rows={4}
            />
            {errors.notes && (
              <p className="form-error">{errors.notes.message as string}</p>
            )}
          </div>

          {/* Selection Criteria */}
          <div>
            <label className="label">Selection Criteria</label>
            <textarea
              {...register('selectionCriteria')}
              className="input min-h-[120px] resize-y"
              placeholder="Key requirements and how you meet them..."
              rows={5}
            />
            {errors.selectionCriteria && (
              <p className="form-error">{errors.selectionCriteria.message as string}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting || loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {application ? 'Update' : 'Save'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;