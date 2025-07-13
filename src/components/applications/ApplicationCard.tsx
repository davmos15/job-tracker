import React, { useState } from 'react';
import { Calendar, ExternalLink, DollarSign, ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import type { Application } from '../../types/application';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/helpers';

interface ApplicationCardProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  onClick?: (application: Application) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onDelete,
  onClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't expand if clicking on action buttons
    if ((e.target as HTMLElement).closest('.action-button')) {
      return;
    }
    
    setIsExpanded(!isExpanded);
    onClick?.(application);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(application);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this application?')) {
      onDelete(application.id);
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    const statusClassMap: Record<string, string> = {
      'Applied': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      'Phone Call': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      '1st Interview': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      '2nd Interview': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      'Offer': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      'Rejected after Applying': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      'Rejected after Phone Call': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      'Rejected after 1st Interview': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      'Rejected after 2nd Interview': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      'Ghosted': 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300'
    };
    return statusClassMap[status] || 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300';
  };
  
  return (
    <div 
      className={`card p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isExpanded ? 'ring-2 ring-primary/20' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate">
            {application.title}
          </h3>
          <p className="text-muted-foreground font-medium">
            {application.company}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <span 
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(application.status)}`}
          >
            {application.status}
          </span>
          
          <button
            onClick={handleEdit}
            className="action-button p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            title="Edit application"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleDelete}
            className="action-button p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            title="Delete application"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Info */}
      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(application.dateApplied)}</span>
        </div>
        
        {application.salary && (
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>{formatCurrency(application.salary)}</span>
            <span className="ml-1 text-xs">({application.salaryType})</span>
          </div>
        )}
        
        {application.jobLink && (
          <a
            href={application.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="action-button flex items-center text-blue-600 hover:text-blue-800"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            <span>View Job</span>
          </a>
        )}
      </div>

      {/* Expand/Collapse Button */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {formatRelativeTime(application.updatedAt)}
        </span>
        
        <button
          className="flex items-center text-xs text-gray-500 hover:text-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? (
            <>
              <span className="mr-1">Less</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span className="mr-1">More</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          {application.notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Notes</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {application.notes}
              </p>
            </div>
          )}
          
          {application.benefits && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Benefits</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {application.benefits}
              </p>
            </div>
          )}
          
          {application.selectionCriteria && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Selection Criteria</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {application.selectionCriteria}
              </p>
            </div>
          )}
          
          {application.interviewNotes && application.interviewNotes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Interview Notes ({application.interviewNotes.length})
              </h4>
              <div className="space-y-2">
                {application.interviewNotes.slice(0, 2).map((note) => (
                  <div key={note.id} className="bg-gray-50 rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700 capitalize">
                        {note.type} - {formatDate(note.date)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {note.notes}
                    </p>
                  </div>
                ))}
                {application.interviewNotes.length > 2 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{application.interviewNotes.length - 2} more interview notes
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;