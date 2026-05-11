"use client";

import React from 'react';

// 1. Imports from your UI and Dashboard component folders
import PageTitle from "@/components/dashboard/page-title";
import { PrimaryButton, SecondaryButton } from "@/components/ui/ActionButton";
import { ExportPNG, PlusIcon, BadgeIcon, CalendarIcon, LockIcon } from "@/components/ui/Icons";
import { StatCard } from "@/components/ui/StatCard";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { DataTable } from "@/components/dashboard/data-table";
import { Pagination } from "@/components/ui/Pagination";
import { StatusTag } from "@/components/ui/StatusTag";
import { UserAvatar } from "@/components/ui/UserAvatar";


// Extracts the first letter of the first and last name (e.g., "Marcus Johnson" -> "MJ")
const getInitials = (name: string) => {
  if (!name) return "";
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

// Assigns a consistent color theme based on the name length
const getAvatarStyle = (name: string) => {
  if (!name) return "bg-gray-100 text-gray-600";
  const colors = [
    "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
  ];
  return colors[name.length % colors.length];
};

export default function AttendanceTracking() {
  // Mock Data for the DataTable
  const mockData = [
    { id: 1, member: "Marcus Johnson", memberId: "#8821", time: "09:45 AM", status: "Active" },
    { id: 2, member: "Jane Smith", memberId: "#7743", time: "08:00 AM", status: "Expired" },
    { id: 3, member: "Jane Smith", memberId: "#7743", time: "08:00 AM", status: "Active" },
    { id: 4, member: "Jane Smith", memberId: "#7743", time: "08:00 AM", status: "Active" },
    { id: 5, member: "Jane Smith", memberId: "#7743", time: "08:00 AM", status: "Active" },
  ];

  // Columns configuration for DataTable 
  const columns = [
    { 
      header: "MEMBER", 
      accessor: (item: any) => (
        <div className="flex items-center gap-4">
          {/* Avatar Bubble */}
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${getAvatarStyle(item.member)}`}>
            {getInitials(item.member)}
          </div>
          {/* Name and ID */}
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{item.member}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">ID: {item.memberId}</p>
          </div>
        </div>
      ) 
    },
    { 
      header: "CHECK-IN TIME", 
      accessor: (item: any) => (
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{item.time}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Today</p>
        </div>
      ) 
    },
    { 
      header: "STATUS", 
      accessor: (item: any) => {
        const isActive = item.status.toLowerCase() === "active";
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
              isActive
                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
            }`}
          >
            {item.status}
          </span>
        );
      }
    },
  ];

  return (
  <div className="p-6 max-w-7xl mx-auto space-y-6 min-h-screen">
      
      {/* 1. Page Header */}
      <header className="flex justify-between items-center">
        <PageTitle 
          title="Attendance Tracking" 
          subtitle="Monitor real-time gym check-ins and history." 
        />
        <div className="flex gap-3">
          <SecondaryButton icon={<ExportPNG />}>Export Logs (CSV)</SecondaryButton>
          <PrimaryButton icon={<PlusIcon />}>Manual Check-in</PrimaryButton>
        </div>
      </header>

      {/* 2. Stats Row (Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Checked in Today" 
          value="124" 
          icon={<BadgeIcon />} 
          color="blue" 
        />
        <StatCard 
          title="Peak Hours (Avg)" 
          value="5pm - 7pm" 
          icon={<CalendarIcon />} 
          color="orange" 
        />
        <StatCard 
          title="Weekly Attendance" 
          value="856" 
          icon={<CalendarIcon />} 
          color="purple" 
        />
      </div>

      {/* 3. Search & Filter Bar */}
      <SearchFilter 
        onSearch={(q) => console.log(q)}
        filters={[
          {
            label: "Date",
            value: "today",
            options: [{ label: "Today", value: "today" }]
          },
          {
            label: "Status",
            value: "all",
            options: [{ label: "Status: All", value: "all" }]
          }
        ]}
      />

      {/* 4. Attendance Table */}
      {/* Wrap DataTable and Pagination in a standard container card */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stroke dark:border-white/5 overflow-hidden shadow-sm">
        <DataTable columns={columns} data={mockData} />
        
        <Pagination 
          currentPage={1}
          totalItems={124}
          itemsPerPage={5}
          onPageChange={(page) => console.log(page)}
        />
      </div>

    </div>
  );
}