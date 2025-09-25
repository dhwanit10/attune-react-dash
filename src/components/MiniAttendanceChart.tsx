import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AttendanceRecord {
  attendanceID: number;
  rollNo: number;
  attendanceDate: string;
  status: 'present' | 'absent' | 'holiday';
  student: any;
}

interface MiniAttendanceChartProps {
  data: AttendanceRecord[];
}

export const MiniAttendanceChart = ({ data }: MiniAttendanceChartProps) => {
  // Filter for today
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = data.filter(d => d.attendanceDate.slice(0, 10) === today);
  const present = todayRecords.filter(r => r.status === 'present').length;
  const absent = todayRecords.filter(r => r.status === 'absent').length;

  const chartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        label: 'Today',
        data: [present, absent],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderColor: ['#fff', '#fff'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: 'hsl(var(--foreground))',
          font: { size: 13 },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}`;
          }
        }
      },
    },
  };

  return (
    <Card className="gradient-card shadow-card border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Today's Attendance Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40 w-full flex items-center justify-center rounded-xl bg-gradient-to-br from-white/80 to-muted/40 shadow-lg p-2">
          <Pie data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};
