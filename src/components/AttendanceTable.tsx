
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Calendar, User, Hash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getLastNDates } from '@/lib/dateUtils';

interface AttendanceRecord {
  attendanceID: number;
  rollNo: number;
  attendanceDate: string;
  status: 'present' | 'absent' | 'holiday';
  student: any;
}

interface Student {
  rollNo: number;
  name: string;
  sem: number;
  class: string;
  dob: string;
}

interface AttendanceTableProps {
  data: AttendanceRecord[];
}

export const AttendanceTable = ({ data }: AttendanceTableProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const last7Dates = getLastNDates(7);

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      try {
        const res = await fetch('https://3r8gtt2w-7174.inc1.devtunnels.ms/api/Students');
        const students = await res.json();
        setStudents(students);
      } catch (err) {
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  // Map attendance data for quick lookup: { rollNo: { date: status } }
  const attendanceMap: Record<number, Record<string, AttendanceRecord>> = {};
  data.forEach(record => {
    if (!attendanceMap[record.rollNo]) attendanceMap[record.rollNo] = {};
    attendanceMap[record.rollNo][record.attendanceDate.slice(0, 10)] = record;
  });

  if (loading) {
    return <div className="border border-border rounded-lg bg-card/50 p-8 text-center">Loading...</div>;
  }

  if (students.length === 0) {
    return <div className="border border-border rounded-lg bg-card/50 p-8 text-center">No student data found.</div>;
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-card overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/70 border-b border-border">
            <TableHead className="font-semibold text-foreground text-center">Roll No</TableHead>
            <TableHead className="font-semibold text-foreground text-center">Name</TableHead>
            {last7Dates.map(date => (
              <TableHead key={date} className="font-semibold text-foreground text-center">
                {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.filter(s => s.rollNo >= 1 && s.rollNo <= 6).map(student => (
            <TableRow key={student.rollNo} className="hover:bg-muted/30 transition-smooth border-b border-border/50">
              <TableCell className="text-center font-mono">{student.rollNo}</TableCell>
              <TableCell className="font-medium text-foreground">{student.name}</TableCell>
              {last7Dates.map(date => {
                const record = attendanceMap[student.rollNo]?.[date];
                if (!record) return <TableCell key={date} className="text-center"> </TableCell>;
                if (record.status === 'present') {
                  return (
                    <TableCell key={date} className="text-center">
                      <Badge variant="default" className="bg-success hover:bg-success/90 text-success-foreground font-medium">
                        <CheckCircle className="w-3 h-3 mr-1" /> Present
                      </Badge>
                    </TableCell>
                  );
                } else if (record.status === 'absent') {
                  return (
                    <TableCell key={date} className="text-center">
                      <Badge variant="destructive" className="font-medium">
                        <XCircle className="w-3 h-3 mr-1" /> Absent
                      </Badge>
                    </TableCell>
                  );
                } else if (record.status === 'holiday') {
                  return (
                    <TableCell key={date} className="text-center">
                      <Badge variant="secondary" className="font-medium">
                        <Calendar className="w-3 h-3 mr-1" /> Holiday
                      </Badge>
                    </TableCell>
                  );
                }
                return <TableCell key={date} className="text-center"> </TableCell>;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};