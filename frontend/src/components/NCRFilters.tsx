import React from 'react';

interface NCRFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
  totalNCRs: number;
  filteredCount: number;
  onClearFilters: () => void;
}

const NCRFilters: React.FC<NCRFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  totalNCRs,
  filteredCount,
  onClearFilters
}) => {
  return (
    <div className="ncr-filters">
      <div className="ncr-filters-header">
        <h3 className="ncr-filters-title">
          <svg className="ncr-filters-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
          </svg>
          Filters & Search
        </h3>
        <div className="ncr-filters-count">
          {filteredCount} of {totalNCRs} NCRs
        </div>
      </div>

      <div className="ncr-filters-content">
        {/* Search Input */}
        <div className="ncr-filter-group">
          <label className="ncr-filter-label">Search NCRs</label>
          <div className="ncr-search-input-wrapper">
            <svg className="ncr-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="ncr-search-input"
              placeholder="Search by NCR number, title, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="ncr-search-clear"
                onClick={() => setSearchTerm('')}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="ncr-filter-group">
          <label className="ncr-filter-label">Status</label>
          <select
            className="ncr-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="ncr-filter-group">
          <label className="ncr-filter-label">Priority</label>
          <select
            className="ncr-filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="ncr-filter-group">
          <label className="ncr-filter-label">Category</label>
          <select
            className="ncr-filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Safety">Safety</option>
            <option value="Quality">Quality</option>
            <option value="Process">Process</option>
            <option value="Documentation">Documentation</option>
            <option value="Material">Material</option>
            <option value="Equipment">Equipment</option>
            <option value="Environmental">Environmental</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="ncr-filter-group">
          <label className="ncr-filter-label">Date Range</label>
          <div className="ncr-date-range">
            <input
              type="date"
              className="ncr-date-input"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="From"
            />
            <span className="ncr-date-separator">to</span>
            <input
              type="date"
              className="ncr-date-input"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="To"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="ncr-filter-group">
          <label className="ncr-filter-label">Sort By</label>
          <select
            className="ncr-filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority (High to Low)</option>
            <option value="status">Status</option>
            <option value="dueDate">Due Date</option>
            <option value="ncrNumber">NCR Number</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="ncr-filter-actions">
          <button
            className="ncr-clear-filters-btn"
            onClick={onClearFilters}
          >
            <svg className="ncr-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear All Filters
          </button>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || 
          categoryFilter !== 'all' || dateFrom || dateTo) && (
          <div className="ncr-active-filters">
            <h4 className="ncr-active-filters-title">Active Filters:</h4>
            <div className="ncr-active-filters-list">
              {searchTerm && (
                <span className="ncr-active-filter">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}>×</button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="ncr-active-filter">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter('all')}>×</button>
                </span>
              )}
              {priorityFilter !== 'all' && (
                <span className="ncr-active-filter">
                  Priority: {priorityFilter}
                  <button onClick={() => setPriorityFilter('all')}>×</button>
                </span>
              )}
              {categoryFilter !== 'all' && (
                <span className="ncr-active-filter">
                  Category: {categoryFilter}
                  <button onClick={() => setCategoryFilter('all')}>×</button>
                </span>
              )}
              {dateFrom && (
                <span className="ncr-active-filter">
                  From: {dateFrom}
                  <button onClick={() => setDateFrom('')}>×</button>
                </span>
              )}
              {dateTo && (
                <span className="ncr-active-filter">
                  To: {dateTo}
                  <button onClick={() => setDateTo('')}>×</button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NCRFilters;