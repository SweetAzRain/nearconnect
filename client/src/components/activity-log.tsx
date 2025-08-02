import { useNearWallet } from "@/hooks/use-near-wallet";
import { List, Info, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

export function ActivityLog() {
  const { activityLog } = useNearWallet();

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      default:
        return <Info className="text-blue-500" size={16} />;
    }
  };

  const getLogColorClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800';
      case 'error':
        return 'bg-red-50 text-red-800';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800';
      default:
        return 'bg-blue-50 text-blue-800';
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <List className="text-green-600" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Activity Log</h3>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {activityLog.length === 0 ? (
          <div className="text-slate-500 text-sm italic">
            No activity yet. Connect your wallet to start.
          </div>
        ) : (
          activityLog.map((log, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 text-sm py-2 px-3 rounded-lg ${getLogColorClass(
                log.type
              )}`}
            >
              {getLogIcon(log.type)}
              <span className="font-mono text-xs text-slate-500">{log.timestamp}</span>
              <span>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}
