'use client';

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getProjects, updateProject } from "@/actions/project_actions"; 
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Header } from "./Header";
import { Plus, Minus } from 'lucide-react';
import { useParams } from 'next/navigation'; 
import CreateTaskDialog from "./CreateTaskModel";
import { getTasksByProjectId, updateTask } from '@/actions/task_action';
import TaskCard from './TaskCard';
import { Task, IUser } from "@/types";
import { getUsersByProjectId, getAllUsers, assignUserToProject } from '@/actions/user_actions';

interface Job {
  id: string;
  status: string;
  job: Job[]
}


interface Tasks {
  [key: string]: Task[];
}

// Define Project type based on previous context
interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  tasks: string[]; // Assuming tasks are string IDs
  analytics: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };
  statuses: { label: string; value: number }[]; // Add statuses property
  updatedAt: string;
  createdAt: string;
}

export default function TrackerBoard() {
  const { projectId }: {projectId: string} = useParams() ; // Use useParams hook to get projectId
  console.log(projectId)
  const user = useAppSelector(state => state.user.user);
  const dispatch = useAppDispatch();

  const [project, setProject] = useState<Project | null>(null); // State for project
  const [tasks, setTasks] = useState<Tasks>({});
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [columnInputValues, setColumnInputValues] = useState<string[]>([]);
  const [jobsCache, setJobsCache] = useState<Job[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true); // Add loading state for tasks
  const [loadingProject, setLoadingProject] = useState(true); // Add loading state for project
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [projectUsers, setProjectUsers] = useState<IUser[]>([]); // For users already in the project
  const [allUsers, setAllUsers] = useState<IUser[]>([]); // For all users in the system
  console.log(project)

  const [newJob, setNewJob] = useState({
    title: "",
    job_link: "",
    job_type: "",
    apply_link: "",
    job_location: "",
    job_salary: "",
    job_description: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumnName, setCurrentColumnName] = useState<string>("");

  // Modify initializeTasks to use project statuses
  const initializeTasks = (projectStatuses: { label: string; value: number }[]) => {
    const initialTasks = projectStatuses.reduce((acc: Tasks, statusObj: { label: string; value: number }) => {
      // Preserve existing jobs if column already exists
      acc[statusObj.label] = tasks[statusObj.label] || [];
      return acc;
    }, {});
    setTasks(initialTasks || {});
    setColumnNames(projectStatuses.map(status => status.label) || []);
    setColumnInputValues(projectStatuses.map(status => status.label) || []);
  };

const fetchTasks = async () => {
  try {
    setLoadingTasks(true); // Set loading to true before fetching tasks
    const data = await getTasksByProjectId(projectId);
    if (data?.success && Array.isArray(data.tasks)) {
      const organizedTasks = columnNames.reduce((acc: Tasks, label) => {
        acc[label] = data.tasks.filter((task: { status: string }) => task.status === label);
        return acc;
      }, {});
      setTasks(prev => ({ ...prev, ...organizedTasks }));
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  } finally {
    setLoadingTasks(false); // Set loading to false after fetching tasks
  }

};

useEffect(() => {
  const loadProjectAndTasks = async () => {
    try {
      setLoadingProject(true);
      const projectRes = await getProjects(projectId);
      if (projectRes.success && projectRes.project) {
        setProject(projectRes.project);
        initializeTasks(projectRes.project.statuses || []);
        
        // Fetch project users
        const projectUsersRes = await getUsersByProjectId(projectId);
        if (projectUsersRes.success) {
          setProjectUsers(projectUsersRes.users);
        }
        
        // Fetch all users
        const allUsersRes = await getAllUsers();
        if (allUsersRes.success) {
          setAllUsers(allUsersRes.users);
        }
        
        setLoadingTasks(true); // Set loading to true before fetching tasks
        const tasksData = await getTasksByProjectId(projectId);
        if (tasksData?.success && Array.isArray(tasksData.tasks)) {
          const organizedTasks = (projectRes.project.statuses || []).reduce((acc: Tasks, statusObj: { label: string; value: number }) => {
            acc[statusObj.label] = tasksData.tasks.filter((task: { status: string }) => task.status === statusObj.label);
            return acc;
          }, {});
          setTasks(organizedTasks);
        }
      } else {
        setProject(null);
      }
    } catch (error) {
      console.error("Error loading project, tasks, or users:", error);
    } finally {
      setLoadingProject(false);
      setLoadingTasks(false);
    }
  };
  loadProjectAndTasks();
}, [projectId]);

  useEffect(() => {
    // Only refresh jobs when modal closes (new job added)
    if (!isModalOpen && project) { 
      fetchTasks(); 
    }
  }, [isModalOpen, project]); 

  const handleAssignUserToProject = async (userId: string) => {
    try {
      const result = await assignUserToProject(projectId, userId);
      if (result.success) {
        // Refresh project users after successful assignment
        const projectUsersRes = await getUsersByProjectId(projectId);
        if (projectUsersRes.success) {
          setProjectUsers(projectUsersRes.users);
        }
        toast.success("User added to project successfully");
      } else {
        toast.error(result.message || "Failed to add user to project");
      }
    } catch (error) {
      console.error("Error assigning user to project:", error);
      toast.error("Failed to add user to project");
    }
  };

useEffect(() => {
  const handleTaskUpdate = () => {
    console.log("Task updated event received");
    fetchTasks();
    if (project) {
      getProjects(projectId).then(res => {
        if (res.success) setProject(res.project);
      });
    }
  };
  
  window.addEventListener('task-updated', handleTaskUpdate);
  return () => {
    window.removeEventListener('task-updated', handleTaskUpdate);
  };
}, [projectId, project]); // Add project as a dependency

  const handleAddColumn = async () => {
    if (!project) return;
    
    const newColumnName = `new-column-${columnNames.length + 1}`;
    const updatedColumnNames = [...columnNames, newColumnName];

    // Update local state
    setTasks({ ...tasks, [newColumnName]: [] });
    setColumnNames(updatedColumnNames);
    setColumnInputValues([...columnInputValues, newColumnName]);

    // Create updated statuses array for the project
    const updatedStatuses = [...(project.statuses || []), { label: newColumnName, value: 0 }];
    
    // Call updateProject API to persist changes
    try {
      const result = await updateProject(projectId, { statuses: updatedStatuses });
      if (result.success) {
        setProject({ ...project, statuses: updatedStatuses });
        toast.success("Column added successfully");
      } else {
        toast.error(result.error || "Failed to add column");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to add column");
    }
  };

  const handleColumnNameChange = async (index: number, newName: string) => {
    if (!project) return;
    
    const updatedColumnNames = [...columnNames];
    const oldName = updatedColumnNames[index];
    updatedColumnNames[index] = newName;
    setColumnNames(updatedColumnNames);

    const updatedTasks = { ...tasks, [newName]: tasks[oldName] };
    delete updatedTasks[oldName];
    setTasks(updatedTasks);

    // Create updated statuses array for the project
    const updatedStatuses = project.statuses.map((status, i) => 
      i === index ? { ...status, label: newName } : status
    );
    
    // Call updateProject API to persist changes
    try {
      const result = await updateProject(projectId, { statuses: updatedStatuses });
      if (result.success) {
        setProject({ ...project, statuses: updatedStatuses });
        toast.success("Column renamed successfully");
      } else {
        toast.error(result.error || "Failed to rename column");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to rename column");
    }
  };

  const handleRemoveColumn = async (index: number, name: string) => {
    if (!project) return;
    
    if (tasks[name]?.length > 0) {
      toast.error("Cannot remove a column that is not empty");
      return;
    }

    const updatedTasks = { ...tasks };
    delete updatedTasks[name];
    setTasks(updatedTasks);

    const updatedColumnNames = columnNames.filter((_, i) => i !== index);
    const updatedColumnInputValues = columnInputValues.filter((_, i) => i !== index);
    setColumnNames(updatedColumnNames);
    setColumnInputValues(updatedColumnInputValues);

    // Create updated statuses array for the project
    const updatedStatuses = project.statuses.filter((_, i) => i !== index);
    
    // Call updateProject API to persist changes
    try {
      const result = await updateProject(projectId, { statuses: updatedStatuses });
      if (result.success) {
        setProject({ ...project, statuses: updatedStatuses });
        toast.success("Column removed successfully");
      } else {
        toast.error(result.error || "Failed to remove column");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to remove column");
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedInputValues = [...columnInputValues];
    updatedInputValues[index] = value;
    setColumnInputValues(updatedInputValues);
  };

  // const handleRemoveColumn = (index: number, name: string) => {
  //   if (tasks[name]?.length > 0) { // Use optional chaining
  //     toast.error("Cannot remove a column that is not empty");
  //     return;
  //   }

  //   // TODO: Implement backend action to delete status from project
  //   const updatedTasks = { ...tasks };
  //   delete updatedTasks[name];
  //   setTasks(updatedTasks);

  //   const updatedColumnNames = columnNames.filter((_, i) => i !== index);
  //   const updatedColumnInputValues = columnInputValues.filter((_, i) => i !== index);
  //   setColumnNames(updatedColumnNames);
  //   setColumnInputValues(updatedColumnInputValues);

  //   toast("Column removed locally. Backend update needed.");
  // };

  // console.log(tasks, "here outside tasks");


  const onDragEnd = async (result: any) => {
    const { source, destination } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const sourceList = [...tasks[source.droppableId]];
    const destinationList = [...tasks[destination.droppableId]];

    const [removed] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, removed);

    const updatedTasks = {
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    } as Tasks;

    setTasks(updatedTasks);

    // TODO: Implement backend action to update task/job status within the project
    // The current updateJobStatus is user-specific.
    // toast("Task status updated locally. Backend update needed.");

    // The following lines related to updating user job_statuses should be removed or adapted for project statuses
    const data = await updateTask(removed._id, { status: destination.droppableId });
    // await fetchJobs();
    // const updatedStatuses = columnNames.map(label => ({ label, value: updatedTasks[label]?.length || 0 }));
    // updateUser({ job_statuses: updatedStatuses })
    if (data.success) {
      toast.success(data.message || "Status updated");
    } else {
      toast.error(data.error);
      setTasks(tasks);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePriorityFilter = (priority: string) => {
    setPriorityFilter(priority);
  };

  const handleUserFilter = (userId: string) => {
    setUserFilter(userId);
  };

  const filterTasks = (tasksToFilter: Task[]) => {
    return tasksToFilter.filter(task => {
      const matchesSearch = searchQuery === '' || task.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === '' || task.priority.toLowerCase() === priorityFilter.toLowerCase();
      const matchesUser = userFilter === '' || (task.assignedTo && task.assignedTo._id === userFilter);
      return matchesSearch && matchesPriority && matchesUser;
    });
  };

  return (
    <div className="flex flex-col w-full h-[91vh] overflow-hidden pl-8">
      <Header 
        project={project} 
        onSearch={handleSearch}
        onPriorityFilter={handlePriorityFilter}
        onUserFilter={handleUserFilter}
        users={projectUsers} 
        allUsers={allUsers}
        onAssignUser={handleAssignUserToProject} 
      />
      <div className="flex-1 overflow-hidden mt-3">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 w-full h-full overflow-x-auto">
            {loadingProject ? (
              // Skeleton Loader for columns
              <div className="flex gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="min-w-[300px] max-w-[350px] bg-[#17161c] rounded-3xl p-4 h-full animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-12 bg-gray-700 rounded"></div>
                      <div className="h-12 bg-gray-700 rounded"></div>
                      <div className="h-12 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              columnNames.map((listName, index) => (
                <Droppable droppableId={listName} key={listName}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-w-[250px] max-w-[300px] bg-[#17161c] rounded-3xl p-4 h-full overflow-auto relative group flex-shrink-0 
                        w-full 
                        xs:w-[calc(100%-16px)]
                        sm:w-[calc(50%-16px)]
                        md:w-[calc(33.33%-20px)]
                        lg:w-[calc(25%-24px)]
                        xl:w-[calc(20%-20px)]"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={columnInputValues[index]}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleColumnNameChange(index, e.currentTarget.value);
                              }
                            }}
                            className="text-sm font-semibold text-gray-300 bg-transparent focus:bg-[#353345] focus:p-1 rounded focus:outline-none"
                          />
                          <span className="text-sm text-gray-500">
                            {tasks[listName]?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1 hover:bg-[#353345] rounded transition-colors"
                            onClick={() => {
                              setCurrentColumnName(listName);
                              setIsModalOpen(true);
                            }}
                          >
                            <Plus className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleRemoveColumn(index, listName)}
                            className="p-1 hover:bg-[#353345] rounded transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {loadingTasks ? (
                          // Skeleton Loader for tasks
                          <div className="animate-pulse space-y-3">
                            <div className="h-12 bg-gray-700 rounded"></div>
                            <div className="h-12 bg-gray-700 rounded"></div>
                            <div className="h-12 bg-gray-700 rounded"></div>
                          </div>
                        ) : tasks[listName]?.length > 0 ? (
                          // Render Task Cards
                          tasks[listName]?.map((task: Task, index: number) => (
                            <Draggable 
                              key={task._id} 
                              draggableId={task._id} 
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? 0.8 : 1,
                                  }}
                                >
                                  <TaskCard 
                                    task={task}
                                    boardId={projectId}
                                    columnId={listName}
                                    taskIndex={index}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          // Show Create Task Button if no tasks
                          <button
                            className="w-full p-2 mt-4 text-center text-gray-400 border border-dashed border-gray-600 rounded-lg hover:border-gray-400 transition-colors"
                            onClick={() => {
                              setCurrentColumnName(listName);
                              setIsModalOpen(true);
                            }}
                          >
                            + Create Task
                          </button>
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))
            )}
            {!loadingProject && (
              <button
                onClick={handleAddColumn}
                className="p-2 h-10 bg-[#2F2D3B] text-gray-400 hover:bg-[#353345] rounded-lg transition-colors flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </DragDropContext>
      </div>
      {isModalOpen && (
        <CreateTaskDialog
          open={isModalOpen}
          onOpenChange={() => setIsModalOpen(false)}
          boardId={projectId}
          columnId={currentColumnName}
        />
      )}
    </div>
  );
}


