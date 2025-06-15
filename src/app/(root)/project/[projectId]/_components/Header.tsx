import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import {IUser} from "@/types"; 

interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  tasks: string[];
  analytics: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };
  statuses: { label: string; value: number }[];
  updatedAt: string;
  createdAt: string;
}

// Update the interface to include new props
interface HeaderProps {
  project: Project | null;
  onSearch: (query: string) => void;
  onPriorityFilter: (priority: string) => void;
  onUserFilter: (userId: string) => void;
  users?: IUser[];
  allUsers?: IUser[];
  onAssignUser: (userId: string) => void;
}

// Function to generate a color based on user's name
const getAvatarColor = (userId: string) => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];
  
  // Use the sum of char codes to determine the color
  const charCodeSum = userId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

export const Header: React.FC<HeaderProps> = ({ 
  project, 
  onSearch, 
  onPriorityFilter, 
  onUserFilter, 
  users, 
  allUsers,
  onAssignUser 
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Filter out users that are already in the project
  const availableUsers = allUsers?.filter(user => 
    !users?.some(projectUser => projectUser._id === user._id)
  ) || [];
  
  return (
    <div className="mb-3">
      {/* Upper section changes */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-t-3xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 mb-1 sm:mb-2">
              {/* Breadcrumb text size adjustment */}
              <span>Tasks</span>
              <span>/</span>
              <span>{project?.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{project?.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-2">
                {users && users.map((user) => (
                  <div
                    key={user._id}
                    className={`w-8 h-8 rounded-full border-2 border-white/10 ${getAvatarColor(user._id)} flex items-center justify-center text-white font-medium`}
                  >
                    {user.firstname ? user.firstname.charAt(0).toUpperCase() : '?'}
                  </div>
                ))}
              </div>
              
              {/* Invite member dropdown */}
              <div className="relative">
                <button 
                  className="px-3 py-1.5 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  Invite member
                </button>
                
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1F1D2B] rounded-lg shadow-lg z-10 py-2 max-h-60 overflow-y-auto">
                    {availableUsers.length > 0 ? (
                      availableUsers.map(user => (
                        <div 
                          key={user._id} 
                          className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            onAssignUser(user._id);
                            setShowUserDropdown(false);
                          }}
                        >
                          <div 
                            className={`w-6 h-6 rounded-full ${getAvatarColor(user._id)} flex items-center justify-center text-white font-medium text-xs`}
                          >
                            {user.firstname ? user.firstname.charAt(0).toUpperCase() : '?'}
                          </div>
                          <span>{user.firstname} {user.lastname}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-white/50">No users available to invite</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower part with glass-like effect */}
      <div className="bg-[#17161c] backdrop-blur-md rounded-b-3xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/80">Priority</span>
              <select 
                onChange={(e) => onPriorityFilter(e.target.value)}
                className="px-2 py-1 text-sm bg-white/10 text-white rounded border-none focus:ring-2 focus:ring-white/30"
              >
                <option value="">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/80">Assigned To</span>
              <select 
                onChange={(e) => onUserFilter(e.target.value)}
                className="px-2 py-1 text-sm bg-white/10 text-white rounded border-none focus:ring-2 focus:ring-white/30"
              >
                <option value="">All</option>
                {users && users.map(user => (
                  <option key={user._id} value={user._id}>{user.firstname}</option> // Use user._id and user.name
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks..."
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-64 text-sm bg-white/10 border-none text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            {/* <button className="flex items-center gap-2 px-3 py-2 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}