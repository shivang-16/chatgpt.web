
import React, { useState } from 'react';
import { Calendar, User, Edit, Trash, Move } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Task } from '@/types';
import toast from 'react-hot-toast';
import { assignUserToTask, getUsersByProjectId } from '@/actions/user_actions';
import { IUser } from '@/types';
import { deleteTask } from '@/actions/task_action';
import CreateTaskDialog from './CreateTaskModel';

// Function to generate a color based on user's ID
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

interface TaskCardProps {
  task: Task;
  boardId: string;
  columnId: string;
  taskIndex: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, boardId, columnId, taskIndex }) => {
  const [showUserList, setShowUserList] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);

  const handleAvatarClick = async () => {
    try {
      const res = await getUsersByProjectId(boardId);
      console.log("===", users);
      setUsers(res.users);
      setShowUserList(true);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };
  const [showEditTask, setShowEditTask] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  console.log(task, "here is the task")

  const handleDeleteTask = async() => {
    try {
      const res = await deleteTask(task._id);
      window.dispatchEvent(new CustomEvent('task-updated', {
        detail: { taskId: task._id }
      }));
      if(res.success) {
        toast.success(res.message || 'Task deleted successfully');
      } else {
        toast.error(res.message || 'Failed to delete task');
      }
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };



  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    const dragData = {
      taskId: task._id,
      fromColumnId: columnId,
      taskIndex: taskIndex,
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return '';
    }
  };

  const handleAssignUser = async (userId: string) => {
    try {
      await assignUserToTask(task._id, userId);
      setShowUserList(false);
      window.dispatchEvent(new CustomEvent('task-updated', {
        detail: { taskId: task._id }
      }));
      toast.success('User assigned successfully');
    } catch (error) {
      toast.error('Failed to assign user');
    }
  };
  

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const createdByUser = task.createdBy;
  const assignedToUser = task.assignedTo ? task.assignedTo : null;
  const assignedUserId = assignedToUser ? assignedToUser._id : '';

  return (
    <>
      <Card 
        className={`cursor-move hover:shadow-md transition-all duration-200 bg-[#1c1a21] border-l-4 ${
          task.priority === 'high' ? 'border-l-red-500' :
          task.priority === 'medium' ? 'border-l-yellow-500' :
          'border-l-green-500'
        } ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <CardContent className="p-4">
          {/* Task Header */}
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-medium text-gray-400 line-clamp-2 flex-1">
              {task.name}
            </h4>
            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditTask(true);
                }}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask();
                }}
                className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <Trash className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Task Description */}
          {task.description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-3">
              {task.description}
            </p>
          )}

          {/* Task Meta */}
          <div className="space-y-2">
            {/* Priority */}
            <div className="flex items-center justify-between">
              <Badge 
                variant={getPriorityColor(task.priority)}
                className={`text-xs ${getPriorityBgColor(task.priority)}`}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <div className="relative">
                <Avatar 
                  className={`w-5 h-5 cursor-pointer ${assignedUserId ? getAvatarColor(assignedUserId) : 'bg-gray-300'}`}
                  onClick={handleAvatarClick}
                >
                  <AvatarFallback className="text-xs text-white font-medium">
                    {task.assignedTo ? task.assignedTo.firstname.charAt(0).toUpperCase() : '+'}
                  </AvatarFallback>
                </Avatar>
                
                {showUserList && (
                  <div className="absolute right-0 mt-1 w-40 bg-slate-950 rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                   
                      {users.map(user => (
                        <div 
                          key={user._id}
                          className="px-3 py-1 text-sm hover:bg-slate-700 cursor-pointer flex items-center gap-2"
                          onClick={() => handleAssignUser(user._id)}
                        >
                          <Avatar className={`w-4 h-4 ${getAvatarColor(user._id)}`}>
                            <AvatarFallback className="text-xs text-white font-medium">
                              {user.firstname.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.firstname}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>

            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center my-2 text-xs ${
                isOverdue ? 'text-red-600' : 'text-gray-600'
              }`}>
                <Calendar className="w-3 h-3 mr-1" />
                <span className={isOverdue ? 'font-medium' : ''}>
                  Due {formatDate(task.dueDate)}
                  {isOverdue && ' (Overdue)'}
                </span>
              </div>
            )}

            {/* Assigned To */}
            {assignedToUser && (
              <div className="flex items-center my-2 text-xs text-gray-600">
                <Avatar className={`w-5 h-5 mr-2 ${getAvatarColor(assignedToUser._id)}`}>
                  <AvatarFallback className="text-xs text-white font-medium">
                    {assignedToUser.firstname.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>Assigned to {assignedToUser.firstname}</span>
              </div>
            )}

            {/* Created By */}
            <div className="flex items-center text-xs text-gray-500 pt-1 border-t">
              <User className="w-3 h-3 mr-1" />
              <span>Created by {createdByUser?.firstname || 'Unknown'}</span>
            </div>
        </CardContent>
      </Card>

      {showEditTask && (
        <CreateTaskDialog
          initialData={task}
          open={showEditTask}
          onOpenChange={() => setShowEditTask(false)}
          boardId={boardId}
          columnId={columnId}
        />
      )}
    </>
  );
};

export default TaskCard;
