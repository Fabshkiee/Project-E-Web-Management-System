import { CloudIcon, StatusIcon } from "@/components/ui/Icons";
import { StatusTag } from "../ui/StatusTag";

export default function SystemStatus() {
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
            <StatusTag type="Online" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stroke dark:border-white/5">
          <div className="flex flex-col gap-1">
            <span className="text-[#9CA3AF] text-[11px] font-medium font-lexend uppercase tracking-wider">
              Last Synced
            </span>
            <span className="text-[#1F2937] dark:text-white text-sm font-lexend">
              Just now
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#9CA3AF] text-[11px] font-medium font-lexend uppercase tracking-wider">
              Pending Syncs
            </span>
            <span className="text-[#1F2937] dark:text-white text-sm font-lexend">
              0 logs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
