import { format } from 'date-fns';
import { Clock, CheckCircle2, PlayCircle, StopCircle, RotateCcw } from 'lucide-react';
import { ActivityLogEntry } from '@/store/taskStore';
import { ScrollArea } from './ui/scroll-area';

interface TaskHistoryProps {
  activityLog: ActivityLogEntry[];
}

const getActivityIcon = (action: string) => {
  switch (action) {
    case 'created':
      return <Clock className="h-4 w-4 text-primary" />;
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-status-done" />;
    case 'reopened':
      return <RotateCcw className="h-4 w-4 text-status-progress" />;
    case 'timer_started':
      return <PlayCircle className="h-4 w-4 text-status-progress" />;
    case 'timer_stopped':
      return <StopCircle className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getActivityLabel = (action: string) => {
  switch (action) {
    case 'created':
      return 'Task created';
    case 'completed':
      return 'Task completed';
    case 'reopened':
      return 'Task reopened';
    case 'timer_started':
      return 'Timer started';
    case 'timer_stopped':
      return 'Timer stopped';
    default:
      return action;
  }
};

export const TaskHistory = ({ activityLog }: TaskHistoryProps) => {
  const sortedLog = [...activityLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      <div className="space-y-3">
        {sortedLog.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activity yet
          </p>
        ) : (
          sortedLog.map((entry) => (
            <div key={entry.id} className="flex items-start gap-3">
              <div className="mt-0.5">{getActivityIcon(entry.action)}</div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {getActivityLabel(entry.action)}
                </p>
                {entry.details && (
                  <p className="text-xs text-muted-foreground">{entry.details}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};
