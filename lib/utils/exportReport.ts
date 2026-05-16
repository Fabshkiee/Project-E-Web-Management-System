import { getAnalyticsSummary, getRevenueTrendData, getMembershipSplit, getPeakHours } from "@/lib/api/dashboard";

export const exportAnalyticsReport = async (
  dateFilter: "last_7" | "last_30" | "last_90" | "custom" = "last_30",
  startDate?: string,
  endDate?: string
) => {
  try {
    // Fetch all required data concurrently
    const [summaryData, revenueData, splitData, peakData] = await Promise.all([
      getAnalyticsSummary(),
      getRevenueTrendData(dateFilter, startDate, endDate),
      getMembershipSplit(),
      getPeakHours()
    ]);

    // Dynamically load heavy PDF libraries
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    // Report Header
    doc.setFontSize(20);
    doc.setTextColor(17, 24, 39);
    doc.text("Project-E: Analytics Report", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(107, 114, 128);
    doc.text(
      `Generated on ${new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      14,
      30,
    );

    const start = new Date(revenueData.period.curr_start).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const end = new Date(revenueData.period.curr_end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const periodLabel = `${start} - ${end}`;


    const formatDelta = (delta: number) => {
      if (delta > 0) return `+${delta} from last month`;
      if (delta < 0) return `${delta} from last month`;
      return "No change";
    };

    // 1. Executive Summary
    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39);
    doc.text(`1. Executive Summary (${periodLabel})`, 14, 45);

    const getChangeLabel = (curr: number, prev: number) => {
      if (prev === 0 && curr > 0) return `+${curr} (New)`;
      const diff = curr - prev;
      if (diff > 0) return `+${diff}`;
      if (diff < 0) return `${diff}`;
      return "No change";
    };

    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Current", "Previous", "Change"]],
      body: [
        [
          "Total Revenue",
          `PHP ${revenueData?.summary.current_total.toLocaleString()}`,
          `PHP ${revenueData?.summary.previous_total.toLocaleString()}`,
          `${revenueData?.summary.trend_pct}% ${revenueData?.summary.trend_type === 'up' ? 'Increase' : 'Decrease'}`
        ],
        [
          "Active Members",
          summaryData?.active_members.value.toString() || "0",
          "-",
          "-"
        ],
        [
          "New Sign-ups",
          revenueData?.summary.current_new.toString() || "0",
          revenueData?.summary.previous_new.toString() || "0",
          getChangeLabel(revenueData?.summary.current_new, revenueData?.summary.previous_new)
        ],
        [
          "Returning Members",
          revenueData?.summary.current_renewals.toString() || "0",
          revenueData?.summary.previous_renewals.toString() || "0",
          getChangeLabel(revenueData?.summary.current_renewals, revenueData?.summary.previous_renewals)
        ]
      ],
      theme: "striped",
      headStyles: { fillColor: [242, 13, 51] }, // Brand primary color
    });

    // 2. Revenue Breakdown
    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39);
    let currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.text("2. Revenue Breakdown", 14, currentY);

    const revenueBody = revenueData?.current_series.filter((s: any) => s.revenue > 0).map((s: any) => [
      s.fullDate || s.date,
      `PHP ${s.revenue.toLocaleString()}`,
      s.new_members.toString(),
      s.renewals.toString()
    ]) || [];

    if (revenueBody.length === 0) {
      revenueBody.push(["No revenue data for this period", "", "", ""]);
    }

    autoTable(doc, {
      startY: currentY + 5,
      head: [["Date", "Revenue", "New", "Renew"]],
      body: revenueBody,
      theme: "striped",
      headStyles: { fillColor: [45, 55, 72] }, 
    });

    // 3. Membership Split
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Check if we need a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39);
    doc.text("3. Membership Distribution", 14, currentY);

    const splitBody = splitData?.map((s: any) => [
      s.name,
      s.value.toString(),
      `${s.percentage.toFixed(1)}%`
    ]) || [];

    autoTable(doc, {
      startY: currentY + 5,
      head: [["Plan Type", "Members", "Percentage"]],
      body: splitBody,
      theme: "striped",
      headStyles: { fillColor: [45, 55, 72] }, 
    });

    // 4. Peak Hours
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Check if we need a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39);
    doc.text("4. Occupancy Insights", 14, currentY);
    
    doc.setFontSize(11);
    doc.text(`Absolute Peak Window: ${peakData?.peak_window || 'N/A'}`, 14, currentY + 8);

    const peakBody = [
      ["Morning (7am - 11am)", peakData?.breakdown.morning.toString() || "0"],
      ["Afternoon (12pm - 4pm)", peakData?.breakdown.afternoon.toString() || "0"],
      ["Evening (5pm - 9pm)", peakData?.breakdown.evening.toString() || "0"],
    ];

    autoTable(doc, {
      startY: currentY + 13,
      head: [["Time of Day", "Total Check-ins"]],
      body: peakBody,
      theme: "striped",
      headStyles: { fillColor: [45, 55, 72] }, 
    });

    // Notes section
    currentY = (doc as any).lastAutoTable.finalY + 20;
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFontSize(12);
    doc.text("Notes:", 14, currentY);
    doc.line(14, currentY + 10, 196, currentY + 10);
    doc.line(14, currentY + 20, 196, currentY + 20);
    doc.line(14, currentY + 30, 196, currentY + 30);

    // Save PDF
    doc.save(`ProjectE_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
  } catch (error) {
    console.error("Failed to generate report:", error);
    throw error;
  }
};
