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
  name: string;
  rollNumber: string;
  date: string;
  isPresent: boolean;
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
            return context.raw === 1 ? 'Present' : 'Absent';
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
            return value === 1 ? 'Present' : value === 0 ? 'Absent' : '';
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
    labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })),
    datasets: [
      {
        label: 'Attendance Status',
        data: data.map(d => d.isPresent ? 1 : 0),
        backgroundColor: data.map(d => 
          d.isPresent 
            ? 'hsl(var(--success))' 
            : 'hsl(var(--destructive))'
        ),
        borderColor: data.map(d => 
          d.isPresent 
            ? 'hsl(var(--success))' 
            : 'hsl(var(--destructive))'
        ),
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