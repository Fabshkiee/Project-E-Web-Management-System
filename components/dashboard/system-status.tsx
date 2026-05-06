import React, { useEffect, useState } from "react";
import { CloudIcon } from "@/components/ui/Icons";
import { db } from "@/lib/powersync/PowerSync";

export default function SystemStatus() {
  const [status, setStatus] = useState<any>(null);
  const [lastSynced, setLastSynced] = useState<string>("Never");
  const [isActivelySyncing, setIsActivelySyncing] = useState(false);
  const lastSyncRef = React.useRef<Date | null>(null);

  useEffect(() => {
    let syncTimer: NodeJS.Timeout;

    // 1. Set initial status & persistent sync time
    const savedSync = localStorage.getItem("powersync_last_synced");
    if (savedSync) {
      lastSyncRef.current = new Date(savedSync);
    }

    setStatus({ ...db.currentStatus });

    // 2. Listen to PowerSync status changes
    const l = db.registerListener({
      statusChanged: (statusObj: any) => {
        const isDownloading = !!statusObj.downloading;
        const isUploading = !!statusObj.uploading;

        // Detect IF data actually arrived by checking the timestamp
        const newSyncTime = statusObj.lastSyncedAt;
        const dataArrived =
          newSyncTime &&
          (!lastSyncRef.current ||
            newSyncTime.getTime() > lastSyncRef.current.getTime());

        if (isDownloading || isUploading || dataArrived) {
          setIsActivelySyncing(true);
          clearTimeout(syncTimer);

          if (dataArrived) {
            lastSyncRef.current = newSyncTime;
            localStorage.setItem(
              "powersync_last_synced",
              newSyncTime.toISOString(),
            );
          }

          if (!isDownloading && !isUploading) {
            syncTimer = setTimeout(() => setIsActivelySyncing(false), 2500);
          }
        } else if (!isDownloading && !isUploading) {
          if (isActivelySyncing) {
            clearTimeout(syncTimer);
            syncTimer = setTimeout(() => setIsActivelySyncing(false), 2500);
          }
        }

        const statusUpdate = {
          connected: !!statusObj.connected,
          connecting: !!statusObj.connecting,
          downloading: isDownloading,
          uploading: isUploading,
          lastSyncedAt: statusObj.lastSyncedAt || lastSyncRef.current,
          hasSynced: !!statusObj.hasSynced,
        };

        setStatus(statusUpdate);
      },
    });

    // 3. Update relative time every minute
    const updateTime = () => {
      // Use the SDK status time, or fall back to our persistent ref
      const effectiveSyncTime = db.currentStatus.lastSyncedAt || lastSyncRef.current;
      
      if (effectiveSyncTime) {
        const diff = Date.now() - effectiveSyncTime.getTime();
        if (diff < 60000) setLastSynced("Just now");
        else {
          const mins = Math.floor(diff / 60000);
          setLastSynced(`${mins}m ago`);
        }
      } else {
        setLastSynced("Never");
      }
    };


    updateTime();
    const interval = setInterval(updateTime, 30000);

    return () => {
      l();
      clearInterval(interval);
    };
  }, []);

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updatePendingCount = async () => {
      const batch = await db.getCrudBatch();
      setPendingCount(batch?.crud.length || 0);
    };

    updatePendingCount();
    // Poll every second when we might be uploading
    const interval = setInterval(updatePendingCount, 1000);
    return () => clearInterval(interval);
  }, []);

  const isConnected = status?.connected || false;
  const isSyncing = isActivelySyncing;

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stroke dark:border-white/5 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-teko font-medium text-[20px] uppercase tracking-wider text-foreground">
          System Status
        </h2>
        <CloudIcon className="w-6 h-5" />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-[#1F2937] dark:text-white text-[15px] font-lexend mb-3">
            PowerSync Connection
          </h3>
          <div className="flex items-center">
            <div
              className={`px-3 py-1 rounded-full border-2 transition-colors inline-flex items-center justify-center ${
                isConnected
                  ? "bg-[#DCFCE7] border-[#8BF7D0] text-[#166534] dark:bg-[#22C55E]/10 dark:border-[#22C55E]/50 dark:text-[#4ADE80]"
                  : "bg-gray-100 border-gray-200 text-gray-500 dark:bg-white/5 dark:border-white/10 dark:text-gray-400"
              }`}
            >
              <span className="text-xs font-semibold tracking-wide leading-none whitespace-nowrap font-lexend">
                {isConnected ? "Online" : "Connecting..."}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stroke dark:border-white/5">
          <div className="flex flex-col gap-1">
            <span className="text-[#9CA3AF] text-[11px] font-medium font-lexend uppercase tracking-wider">
              Last Synced
            </span>
            <span className="text-[#1F2937] dark:text-white text-sm font-bold font-lexend">
              {lastSynced}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#9CA3AF] text-[11px] font-medium font-lexend uppercase tracking-wider">
              Pending Syncs
            </span>
            <span className="text-[#1F2937] dark:text-white text-sm font-bold font-lexend">
              {pendingCount > 0 
                ? `${pendingCount} ${pendingCount === 1 ? 'log' : 'logs'}` 
                : isSyncing ? "Syncing..." : "0 logs"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
