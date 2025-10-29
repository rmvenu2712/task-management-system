import { motion } from 'framer-motion';
import { useTaskStore } from '@/store/taskStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, TrendingUp, ListTodo, Timer, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Analytics() {
  const { tasks, projects, selectedProjectId } = useTaskStore();
  
  const filteredTasks = selectedProjectId
    ? tasks.filter(t => t.projectId === selectedProjectId)
    : tasks;

  const completedTasks = filteredTasks.filter(t => t.isCompleted).length;
  const totalTasks = filteredTasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const totalTimeSpent = filteredTasks.reduce((acc, task) => acc + task.timeSpent, 0);
  const avgTimePerTask = totalTasks > 0 ? totalTimeSpent / totalTasks : 0;
  
  const overdueTasks = filteredTasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && !t.isCompleted
  ).length;

  const highPriorityTasks = filteredTasks.filter(t => t.priority === 'high' && !t.isCompleted).length;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: ListTodo,
      description: `${completedTasks} completed`,
      color: 'text-primary',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate.toFixed(0)}%`,
      icon: TrendingUp,
      description: 'Overall progress',
      color: 'text-green-500',
    },
    {
      title: 'Time Tracked',
      value: formatTime(totalTimeSpent),
      icon: Timer,
      description: `${formatTime(avgTimePerTask)} avg per task`,
      color: 'text-blue-500',
    },
    {
      title: 'Overdue Tasks',
      value: overdueTasks,
      icon: Calendar,
      description: 'Need attention',
      color: 'text-red-500',
    },
  ];

  const projectStats = projects.map(project => {
    const projectTasks = tasks.filter(t => t.projectId === project.id);
    const completed = projectTasks.filter(t => t.isCompleted).length;
    const total = projectTasks.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;

    return {
      project,
      completed,
      total,
      progress,
    };
  });

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            {selectedProjectId 
              ? `Insights for ${projects.find(p => p.id === selectedProjectId)?.name}`
              : 'Overview of all your projects and tasks'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
              <CardDescription>Track completion across all projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectStats.map((stat) => (
                <div key={stat.project.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: stat.project.color }}
                      />
                      <span className="font-medium">{stat.project.name}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {stat.completed}/{stat.total}
                    </span>
                  </div>
                  <Progress value={stat.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Priority Distribution</CardTitle>
              <CardDescription>Overview of pending high-priority tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg">
                  <div>
                    <p className="font-semibold">High Priority</p>
                    <p className="text-sm text-muted-foreground">Urgent tasks</p>
                  </div>
                  <div className="text-3xl font-bold text-red-500">{highPriorityTasks}</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg">
                  <div>
                    <p className="font-semibold">Medium Priority</p>
                    <p className="text-sm text-muted-foreground">Important tasks</p>
                  </div>
                  <div className="text-3xl font-bold text-yellow-500">
                    {filteredTasks.filter(t => t.priority === 'medium' && !t.isCompleted).length}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
                  <div>
                    <p className="font-semibold">Low Priority</p>
                    <p className="text-sm text-muted-foreground">Can wait</p>
                  </div>
                  <div className="text-3xl font-bold text-green-500">
                    {filteredTasks.filter(t => t.priority === 'low' && !t.isCompleted).length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
