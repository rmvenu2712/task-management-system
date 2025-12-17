import { motion } from 'framer-motion';
import { useTaskStore } from '@/store/taskStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ListTodo, 
  Timer, 
  Calendar,
  AlertCircle,
  Target,
  Zap,
  BarChart3,
  PieChart
} from 'lucide-react';
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
  const mediumPriorityTasks = filteredTasks.filter(t => t.priority === 'medium' && !t.isCompleted).length;
  const lowPriorityTasks = filteredTasks.filter(t => t.priority === 'low' && !t.isCompleted).length;

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
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      iconBg: 'bg-blue-500',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Completion Rate',
      value: `${completionRate.toFixed(0)}%`,
      icon: TrendingUp,
      description: 'Overall progress',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      iconBg: 'bg-green-500',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Time Tracked',
      value: formatTime(totalTimeSpent),
      icon: Timer,
      description: `${formatTime(avgTimePerTask)} avg`,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      iconBg: 'bg-purple-500',
      trend: '24h',
      trendUp: false,
    },
    {
      title: 'Overdue',
      value: overdueTasks,
      icon: AlertCircle,
      description: 'Need attention',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      iconBg: 'bg-red-500',
      trend: '-3',
      trendUp: true,
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold  bg-clip-text text-white"
            >
              Analytics Dashboard
            </motion.h1>
            <p className="text-muted-foreground mt-1">
              {selectedProjectId 
                ? `Insights for ${projects.find(p => p.id === selectedProjectId)?.name}`
                : 'Real-time overview of all your projects and tasks'
              }
            </p>
          </div>
          {/* <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <BarChart3 className="h-8 w-8 text-primary" />
            </motion.div>
          </div> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/50 backdrop-blur">
                {/* Gradient Overlay */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full -mr-16 -mt-16 opacity-20`} />
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className={stat.trendUp ? 'text-green-600' : 'text-gray-500'}>
                          {stat.trend}
                        </span>
                        {stat.description}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Progress - Larger Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800/50 backdrop-blur h-full">
              <CardHeader className="border-b dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Project Progress</CardTitle>
                      <CardDescription>Track completion across all projects</CardDescription>
                    </div>
                  </div>
                  <PieChart className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                {projectStats.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No projects yet. Create your first project to see analytics!</p>
                  </div>
                ) : (
                  projectStats.map((stat, index) => (
                    <motion.div
                      key={stat.project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-4 w-4 rounded-full shadow-lg"
                            style={{ backgroundColor: stat.project.color }}
                          />
                          <span className="font-semibold">{stat.project.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{stat.progress.toFixed(0)}%</span>
                          <span className="text-sm text-muted-foreground">
                            ({stat.completed}/{stat.total})
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={stat.progress} className="h-3" />
                        <div 
                          className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-transparent to-white/20"
                          style={{ width: `${stat.progress}%` }}
                        />
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Priority Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800/50 backdrop-blur h-full">
              <CardHeader className="border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Priority Tasks</CardTitle>
                    <CardDescription>Pending by priority</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* High Priority */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-200 dark:border-red-900/30 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg text-red-700 dark:text-red-400">High Priority</p>
                      <p className="text-sm text-muted-foreground mt-1">Urgent tasks</p>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20" />
                      <div className="relative text-4xl font-black text-red-600 dark:text-red-400">
                        {highPriorityTasks}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Medium Priority */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-200 dark:border-yellow-900/30 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg text-yellow-700 dark:text-yellow-400">Medium Priority</p>
                      <p className="text-sm text-muted-foreground mt-1">Important tasks</p>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-20" />
                      <div className="relative text-4xl font-black text-yellow-600 dark:text-yellow-400">
                        {mediumPriorityTasks}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Low Priority */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-200 dark:border-green-900/30 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg text-green-700 dark:text-green-400">Low Priority</p>
                      <p className="text-sm text-muted-foreground mt-1">Can wait</p>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20" />
                      <div className="relative text-4xl font-black text-green-600 dark:text-green-400">
                        {lowPriorityTasks}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Summary */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <p className="text-3xl font-bold">{completedTasks}</p>
                  <p className="text-sm opacity-90">Completed</p>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <p className="text-3xl font-bold">{totalTasks - completedTasks}</p>
                  <p className="text-sm opacity-90">In Progress</p>
                </div>
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <p className="text-3xl font-bold">{overdueTasks}</p>
                  <p className="text-sm opacity-90">Overdue</p>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <p className="text-3xl font-bold">{projects.length}</p>
                  <p className="text-sm opacity-90">Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div> */}
      </motion.div>
    </div>
  );
}
