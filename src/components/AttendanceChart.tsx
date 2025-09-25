import { useEffect, useRef } from 'react';
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

export const AttendanceChart = ({ data }: AttendanceChartProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'hsl(var(--foreground))',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      title: {
        display: true,
        text: 'Attendance Overview',
        color: 'hsl(var(--foreground))',
        font: {
          size: 16,
          weight: 'bold' as const,
          family: 'Inter, sans-serif',
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--card-foreground))',
        bodyColor: 'hsl(var(--card-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const statusMap: { [key: number]: string } = { 1: 'Present', 0: 'Absent', 0.5: 'Holiday' };
            return statusMap[context.raw] || '';
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            const statusMap: { [key: number]: string } = { 1: 'Present', 0: 'Absent', 0.5: 'Holiday' };
            return statusMap[value] || '';
          },
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
        },
        grid: {
          color: 'hsl(var(--border))',
          lineWidth: 1,
        },
      },
      x: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
        },
        grid: {
          color: 'hsl(var(--border))',
          lineWidth: 1,
        },
      },
    },
  };

  const chartData = {
    labels: data.map(d => new Date(d.attendanceDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })),
    datasets: [
      {
        label: 'Attendance Status',
        data: data.map(d => {
          if (d.status === 'present') return 1;
          if (d.status === 'absent') return 0;
          return 0.5; // holiday
        }),
        backgroundColor: data.map(d => {
          if (d.status === 'present') return 'hsl(var(--success))';
          if (d.status === 'absent') return 'hsl(var(--destructive))';
          return 'hsl(var(--warning))'; // holiday color
        }),
        borderColor: data.map(d => {
          if (d.status === 'present') return 'hsl(var(--success))';
          if (d.status === 'absent') return 'hsl(var(--destructive))';
          return 'hsl(var(--warning))'; // holiday color
        }),
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground border border-border rounded-lg bg-card/50">
        <p>No attendance data to display. Search for a student to view their attendance.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};