"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, Tag, ChevronDown, Plus } from 'lucide-react';
import EntryModal from '../../components/EntryModal';
import EntryCard from '../../components/EntryCard';

// --- Constants ---
const FOREX_ASSETS = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD"];
const COMMODITIES = ["XAUUSD", "XAGUSD", "WTIUSD (Oil)"];
const CATEGORIES = ["Market Analysis", "Trade Setup", "Trade Review", "Lesson Learned", "Psychology"];

// --- Helper Functions ---
const getFormattedDate = (date = new Date()) => {
  // Returns date in YYYY-MM-DD format
  return date.toISOString().split('T')[0];
};

const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday is the first day
  return new Date(d.setDate(diff));
};

const getStartOfMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// --- Main Component ---
const Journal = () => {
  // --- State ---
  const [isDarkMode, setIsDarkMode] = useState(false); // Keep theme state if needed elsewhere
  const [entries, setEntries] = useState([]); // Holds all journal entries
  const [currentFilter, setCurrentFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'favorites'
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [editingEntry, setEditingEntry] = useState(null); // Holds the entry being edited, or null for new entry
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  // --- Effects ---
  // Load entries from local storage on initial render (optional persistence)
  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem('tradingJournalEntries');
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
    } catch (error) {
      console.error("Failed to load entries from local storage:", error);
      // Handle potential JSON parsing errors or storage issues
    }
  }, []);

  // Save entries to local storage whenever they change (optional persistence)
  useEffect(() => {
    try {
      localStorage.setItem('tradingJournalEntries', JSON.stringify(entries));
    } catch (error) {
      console.error("Failed to save entries to local storage:", error);
      // Handle potential storage quota errors
    }
  }, [entries]);


  // --- Modal and Form Handling ---
  const handleOpenModal = (entryToEdit = null) => {
    setEditingEntry(entryToEdit); // Set null for new, or entry object for edit
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null); // Reset editing state
  };

  const handleSaveEntry = (formData) => {
    if (editingEntry) {
      // Update existing entry
      setEntries(entries.map(entry =>
        entry.id === editingEntry.id ? { ...entry, ...formData } : entry
      ));
    } else {
      // Add new entry
      const newEntry = {
        id: Date.now(), // Simple unique ID using timestamp
        ...formData,
      };
      setEntries([newEntry, ...entries]); // Add to the beginning of the list
    }
    handleCloseModal();
  };

  // --- CRUD Handlers ---
  const handleDeleteEntry = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  // --- Filtering Logic ---
  const filteredEntries = useMemo(() => {
    const today = getFormattedDate();
    const startOfWeek = getFormattedDate(getStartOfWeek());
    const startOfMonth = getFormattedDate(getStartOfMonth());

    return entries.filter(entry => {
      // Date Filtering
      let dateMatch = true;
      if (currentFilter === 'today') {
        dateMatch = entry.date === today;
      } else if (currentFilter === 'week') {
        dateMatch = entry.date >= startOfWeek;
      } else if (currentFilter === 'month') {
        dateMatch = entry.date >= startOfMonth;
      }
      // Favorites filter (requires an 'isFavorite' property on entry)
      // else if (currentFilter === 'favorites') {
      //   dateMatch = entry.isFavorite === true;
      // }

      if (!dateMatch) return false;

      // Search Term Filtering (case-insensitive search in title and content)
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const titleMatch = entry.title?.toLowerCase().includes(lowerSearchTerm);
        const contentMatch = entry.content?.toLowerCase().includes(lowerSearchTerm);
        // Add other fields to search if needed (e.g., asset, category)
        // const assetMatch = entry.asset?.toLowerCase().includes(lowerSearchTerm);
        // const categoryMatch = entry.category?.toLowerCase().includes(lowerSearchTerm);
        if (!(titleMatch || contentMatch)) {
           return false;
        }
      }

      // If all filters pass
      return true;
    });
  }, [entries, currentFilter, searchTerm]);


  // --- Render ---
  return (
    <div className={`flex flex-col w-full min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex-1 p-6">
          {/* Journal Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold mr-2">Journal</h2>
              <ChevronDown size={20} className="opacity-70" />
            </div>
            {/* New Entry Button */}
            <button
              onClick={() => handleOpenModal()}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium shadow-sm ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              <Plus size={18} className="mr-1" /> New Entry
            </button>
          </div>

          {/* Journal Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Date From (For future filtering range) */}
            <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <Calendar size={20} className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input type="date" aria-label="From Date" disabled className={`w-full text-sm focus:outline-none appearance-none cursor-not-allowed ${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-white text-gray-400'}`} />
            </div>
            {/* Date To (For future filtering range) */}
            <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <Calendar size={20} className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input type="date" aria-label="To Date" disabled className={`w-full text-sm focus:outline-none appearance-none cursor-not-allowed ${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-white text-gray-400'}`} />
            </div>
            {/* Category Select (For future filtering) */}
            <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <Tag size={20} className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <select aria-label="Category Filter" disabled className={`w-full text-sm focus:outline-none appearance-none cursor-not-allowed ${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-white text-gray-400'}`}>
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            {/* Search Input */}
            <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <Search size={20} className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full text-sm focus:outline-none ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-700 placeholder-gray-400'}`}
                placeholder="Search title/content..."
              />
            </div>
          </div>

          {/* Journal Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'today', 'week', 'month'].map((filter) => ( // Removed 'favorites' for now
              <button
                key={filter}
                onClick={() => setCurrentFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                  currentFilter === filter
                    ? (isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white')
                    : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1).replace('all', 'All Entries').replace('week', 'This Week').replace('month', 'This Month')}
              </button>
            ))}
             {/* Placeholder for Favorites button */}
             <button
                disabled // Disable until implemented
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 cursor-not-allowed ${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-300 text-gray-500'}`}
             >
               Favorites
             </button>
          </div>

          {/* Journal Content */}
          <div className={`rounded-lg ${isDarkMode ? '' : 'bg-white/50 border border-gray-200/80'}`}>
            {filteredEntries.length > 0 ? (
              <div className="space-y-4 p-4 md:p-6">
                {filteredEntries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    isDarkMode={isDarkMode}
                    onEdit={handleOpenModal}
                    onDelete={handleDeleteEntry}
                  />
                ))}
              </div>
            ) : (
              // No Entries Message
              <div className="py-16 text-center flex flex-col items-center">
                <svg className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {currentFilter === 'all' && !searchTerm ? 'No journal entries yet' : 'No entries match your filter'}
                </p>
                <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                   {currentFilter === 'all' && !searchTerm ? 'Start documenting your trading journey.' : 'Try adjusting your filters or search term.'}
                </p>
                {/* Only show "Create First Entry" if no entries exist AND no filters/search are active */}
                {entries.length === 0 && currentFilter === 'all' && !searchTerm && (
                  <button onClick={() => handleOpenModal()} className={`px-4 py-2 rounded-md text-sm font-medium ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                    Create First Entry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
       {/* Modal for Adding/Editing Entries */}
       <EntryModal
         isOpen={isModalOpen}
         onClose={handleCloseModal}
         onSave={handleSaveEntry}
         initialData={editingEntry}
         isDarkMode={isDarkMode}
       />
    </div>
  );
}

export default Journal;
