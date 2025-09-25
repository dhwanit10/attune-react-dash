import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AttendanceRecord {
  attendanceID: number;
  rollNo: number;
  attendanceDate: string;
  status: 'present' | 'absent' | 'holiday';
  student: any;
}

interface AttendanceChartProps {
  data: AttendanceRecord[];
}


import { getLastNDates } from '@/lib/dateUtils';

export const AttendanceChart = ({ data }: AttendanceChartProps) => {
  // Only last 7 days
  const last7Dates = useMemo(() => getLastNDates(7), []);
  // Aggregate attendance for each date
  const dateStatus = last7Dates.map(date => {
    const records = data.filter(d => d.attendanceDate.slice(0, 10) === date);
    if (records.length === 0) return { status: 'holiday', count: 1 };
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const holiday = records.filter(r => r.status === 'holiday').length;
    // If all are holiday, treat as holiday
    if (holiday === records.length) return { status: 'holiday', count: 1 };
    // If more present, green; less present, red
    if (present >= absent) return { status: 'present', count: present };
    return { status: 'absent', count: absent };
  });

  const chartData = {
    labels: last7Dates.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Attendance',
        data: dateStatus.map(ds => ds.status === 'holiday' ? 1 : ds.count),
        backgroundColor: dateStatus.map(ds => {
          if (ds.status === 'present') return '#22c55e'; // green
          if (ds.status === 'absent') return '#ef4444'; // red
          return '#a3a3a3'; // grey for holiday
        }),
        borderColor: dateStatus.map(ds => {
          if (ds.status === 'present') return '#22c55e';
          if (ds.status === 'absent') return '#ef4444';
          return '#a3a3a3';
        }),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Attendance (Last 7 Days)',
        color: 'hsl(var(--foreground))',
  font: { size: 18, weight: 'bold' as const, family: 'Inter, sans-serif' },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const idx = context.dataIndex;
            const ds = dateStatus[idx];
            if (ds.status === 'present') return `Present: ${ds.count}`;
            if (ds.status === 'absent') return `Absent: ${ds.count}`;
            return 'Holiday';
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        ticks: {
          stepSize: 1,
          color: 'hsl(var(--muted-foreground))',
          font: { size: 13, family: 'Inter, sans-serif' },
        },
        grid: { color: 'hsl(var(--border))', lineWidth: 1 },
      },
      x: {
        ticks: { color: 'hsl(var(--muted-foreground))', font: { size: 13, family: 'Inter, sans-serif' } },
        grid: { color: 'hsl(var(--border))', lineWidth: 1 },
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground border border-border rounded-xl bg-gradient-to-br from-white/80 to-muted/40 shadow-lg">
        <p>No attendance data to display. Search for a student to view their attendance.</p>
      </div>
    );
  }

  return (
    <div className="h-96 w-full rounded-xl bg-gradient-to-br from-white/80 to-muted/40 shadow-lg p-4">
      <Bar data={chartData} options={options} />
    </div>
  );
};