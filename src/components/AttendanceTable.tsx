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

interface AttendanceRecord {
  name: string;
  rollNumber: string;
  date: string;
  isPresent: boolean;
}

interface AttendanceTableProps {
  data: AttendanceRecord[];
}

export const AttendanceTable = ({ data }: AttendanceTableProps) => {
  if (data.length === 0) {
    return (
      <div className="border border-border rounded-lg bg-card/50 p-8 text-center">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Records Found</h3>
        <p className="text-muted-foreground">
          Search for a student's roll number to view their attendance records.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/70 border-b border-border">
            <TableHead className="font-semibold text-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </div>
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Roll Number
              </div>
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </div>
            </TableHead>
            <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record, index) => (
            <TableRow key={index} className="hover:bg-muted/30 transition-smooth border-b border-border/50">
              <TableCell className="font-medium text-foreground">
                {record.name}
              </TableCell>
              <TableCell className="text-muted-foreground font-mono">
                {record.rollNumber}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(record.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell className="text-center">
                {record.isPresent ? (
                  <Badge variant="default" className="bg-success hover:bg-success/90 text-success-foreground font-medium">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Present
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="font-medium">
                    <XCircle className="w-3 h-3 mr-1" />
                    Absent
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};