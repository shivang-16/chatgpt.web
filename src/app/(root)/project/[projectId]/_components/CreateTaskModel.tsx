
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createTask, getTasksByProjectId, updateTask } from '@/actions/task_action';
import toast from 'react-hot-toast';
import { IUser } from '@/types';
import { getUsersByProjectId } from '@/actions/user_actions'; // Import the action

export type Priority = 'high' | 'medium' | 'low';

interface CreateTaskDialogProps {
  initialData?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
  columnId: string;
  // users?: Array<{ id: string; name: string }>; // Remove this prop
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  initialData, // Add this prop
  open,
  onOpenChange,
  boardId,
  columnId,
  // users // Remove this prop
}) => {
  const [title, setTitle] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');
  const [assignedTo, setAssignedTo] = useState(initialData?.assignedTo?._id || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate?.split('T')[0] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectUsers, setProjectUsers] = useState<IUser[]>([]); // New state for project users

  // Fetch users for the project
  React.useEffect(() => {
    const fetchProjectUsers = async () => {
      if (boardId) {
        const res = await getUsersByProjectId(boardId);
        if (res.success) {
          setProjectUsers(res.users);
        } else {
          console.error('Failed to fetch project users:', res.message);
        }
      }
    };
    fetchProjectUsers();
  }, [boardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const taskData = {
        name: title.trim(),
        description: description.trim(),
        assignedTo: assignedTo || undefined,
        priority,
        dueDate: dueDate || undefined,
        status: columnId,
        projectId: boardId
      };

      const res = initialData 
        ? await updateTask(initialData._id, taskData)
        : await createTask(taskData);

      if(res.success) {
        toast.success(res.message);
        // Replace simple event with CustomEvent to match TaskCard.tsx
        window.dispatchEvent(new CustomEvent('task-updated', {
          detail: { taskId: initialData?._id || res.task?._id }
        }));
      } else {
        toast.error(res.message);
      }

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setAssignedTo('');
      setDueDate('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setAssignedTo('');
        setDueDate('');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              Add a new task to organize your work and collaborate with your team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description..."
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectUsers.length > 0 ? (
                      projectUsers.map(user => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.firstname}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-users" disabled>
                        No users available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !title.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting 
                ? (initialData ? 'Updating...' : 'Creating...') 
                : (initialData ? 'Update Task' : 'Create Task')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
