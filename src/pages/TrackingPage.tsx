import React, { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Save, Trash2 } from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import { addInterviewNote, updateInterviewNote, deleteInterviewNote } from '../services/firestore';
import type { Application, InterviewNote } from '../types/application';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/dateUtils';

const TrackingPage: React.FC = () => {
  const { applications, loading } = useApplications();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [stageTitle, setStageTitle] = useState('');
  const [stageNotes, setStageNotes] = useState('');
  const [stageDate, setStageDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingNote, setEditingNote] = useState<InterviewNote | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter applications to only show those that are not rejected/ghosted
  const activeApplications = applications.filter(app => 
    !app.status.toLowerCase().includes('rejected') && 
    app.status.toLowerCase() !== 'ghosted'
  );

  useEffect(() => {
    if (selectedApplication) {
      // Refresh selected application data when applications update
      const updatedApp = applications.find(app => app.id === selectedApplication.id);
      if (updatedApp) {
        setSelectedApplication(updatedApp);
      }
    }
  }, [applications, selectedApplication]);

  const handleApplicationSelect = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    setSelectedApplication(app || null);
    resetForm();
  };

  const resetForm = () => {
    setStageTitle('');
    setStageNotes('');
    setStageDate(new Date().toISOString().split('T')[0]);
    setEditingNote(null);
  };

  const handleEditNote = (note: InterviewNote) => {
    setEditingNote(note);
    setStageTitle(note.type);
    setStageNotes(note.notes);
    setStageDate(note.date);
  };

  const handleSaveStageNote = async () => {
    if (!selectedApplication || !stageTitle.trim() || !stageNotes.trim()) return;

    setSaving(true);
    try {
      if (editingNote) {
        // Update existing note
        await updateInterviewNote(selectedApplication.id, editingNote.id, {
          type: stageTitle.trim(),
          notes: stageNotes.trim(),
          date: stageDate
        });
      } else {
        // Add new note
        const newNote: Omit<InterviewNote, 'id'> = {
          type: stageTitle.trim() as any, // Allow custom stage types
          notes: stageNotes.trim(),
          date: stageDate
        };
        await addInterviewNote(selectedApplication.id, newNote);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving stage note:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!selectedApplication || !window.confirm('Are you sure you want to delete this stage note?')) return;

    try {
      await deleteInterviewNote(selectedApplication.id, noteId);
      if (editingNote && editingNote.id === noteId) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting stage note:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Tracking</h1>
        <p className="mt-2 text-gray-600">
          Track interview progress and add stage-specific notes
        </p>
      </div>

      {/* Job Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Application</h2>
        
        {activeApplications.length === 0 ? (
          <p className="text-gray-500">No active applications to track. Add some applications first!</p>
        ) : (
          <select
            value={selectedApplication?.id || ''}
            onChange={(e) => handleApplicationSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an application to track...</option>
            {activeApplications.map(app => (
              <option key={app.id} value={app.id}>
                {app.title} at {app.company} ({app.status})
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedApplication && (
        <>
          {/* Selected Application Info */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tracking: {selectedApplication.title} at {selectedApplication.company}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Applied: {formatDate(selectedApplication.dateApplied)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Status: {selectedApplication.status}</span>
              </div>
            </div>
          </div>

          {/* Stage Notes Form */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingNote ? 'Edit Stage Note' : 'Add New Stage Note'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stage-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Stage/Interview Type
                  </label>
                  <input
                    type="text"
                    id="stage-title"
                    value={stageTitle}
                    onChange={(e) => setStageTitle(e.target.value)}
                    placeholder="e.g., Phone Call, Technical Interview, HR Interview"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="stage-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="stage-date"
                    value={stageDate}
                    onChange={(e) => setStageDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="stage-notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes & Details
                </label>
                <textarea
                  id="stage-notes"
                  value={stageNotes}
                  onChange={(e) => setStageNotes(e.target.value)}
                  rows={4}
                  placeholder="Add detailed notes about this stage: questions asked, your responses, feedback received, next steps, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSaveStageNote}
                  disabled={!stageTitle.trim() || !stageNotes.trim() || saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingNote ? 'Update Note' : 'Add Note'}
                </button>
                
                {editingNote && (
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Existing Stage Notes */}
          {selectedApplication.interviewNotes && selectedApplication.interviewNotes.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Stage History ({selectedApplication.interviewNotes.length})
              </h3>
              
              <div className="space-y-4">
                {selectedApplication.interviewNotes
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((note) => (
                    <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">{note.type}</h4>
                          <p className="text-sm text-gray-500">{formatDate(note.date)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit note"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{note.notes}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TrackingPage;