import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AttendanceRecord {
  attendanceID: number;
  rollNo: number;
  attendanceDate: string;
  status: 'present' | 'absent' | 'holiday' | string;
  student: any;
}

interface AttendanceCalendarProps {
  data: AttendanceRecord[];
  onBack?: () => void;
}

function getMonthDays(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getDayOfWeek(year: number, month: number, day: number) {
  return new Date(year, month, day).getDay();
}

const statusColor = {
  present: 'bg-green-500',
  absent: 'bg-red-500',
  holiday: 'bg-gray-400',
};

export const AttendanceCalendar = ({ data }: AttendanceCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const latest = data.length > 0 ? new Date(data[data.length - 1].attendanceDate) : new Date();
    return new Date(latest.getFullYear(), latest.getMonth(), 1);
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = getMonthDays(year, month);
  const firstDayOfWeek = getDayOfWeek(year, month, 1);

  // Map attendance by date string
  const attendanceMap: Record<string, AttendanceRecord> = {};
  data.forEach(rec => {
    const d = new Date(rec.attendanceDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      attendanceMap[d.getDate()] = rec;
    }
  });

  // Build calendar grid
  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null); // empty cell
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  return (
    <Card className="gradient-card shadow-card border-0 mt-8">
      <CardHeader className="flex justify-end items-center pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="font-semibold">Attendance Calendar</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-end mb-4 gap-2">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 rounded hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-lg">{monthName} {year}</span>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 rounded hover:bg-muted">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 bg-card/50 p-4 rounded-xl shadow">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="text-center font-medium text-muted-foreground">{d}</div>
          ))}
          {calendarCells.map((day, idx) => {
            if (!day) return <div key={idx}></div>;
            const rec = attendanceMap[day];
            let color = '';
            if (rec) {
              color = statusColor[rec.status as keyof typeof statusColor] || 'bg-gray-300';
            }
            return (
              <div key={day} className="flex items-center justify-center h-12">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${color}`}>{day}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span> Present</div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-red-500 inline-block"></span> Absent</div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-gray-400 inline-block"></span> Holiday</div>
        </div>
      </CardContent>
    </Card>
  );
};
