import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AttendanceChart } from './AttendanceChart';
import { AttendanceTable } from './AttendanceTable';
import { SearchStudent } from './SearchStudent';
import { MarkAttendance } from './MarkAttendance';
import { MiniAttendanceChart } from './MiniAttendanceChart';
import { AttendanceCalendar } from './AttendanceCalendar';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, LogOut, Users, Camera, TrendingUp } from 'lucide-react';

interface AttendanceRecord {
  attendanceID: number;
  rollNo: number;
  attendanceDate: string;
  status: 'present' | 'absent' | 'holiday';
  student: any;
}

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [allAttendanceData, setAllAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<AttendanceRecord[] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAllAttendance();
  }, []);

  const loadAllAttendance = async () => {
    setLoading(true);
    try {
      const apiUrl = '/api/Attendance';
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      const data = await response.json();
      setAttendanceData(data);
      setAllAttendanceData(data);
      toast({
        title: "Data Loaded",
        description: `Loaded ${data.length} attendance records`,
      });
    } catch (error) {
      setAttendanceData([]);
      toast({
        title: "Load Error",
        description: "Could not fetch attendance data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (rollNo: string) => {
    if (!rollNo.trim()) {
      setAttendanceData(allAttendanceData);
      setCalendarData(null);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://3r8gtt2w-7174.inc1.devtunnels.ms/api/Attendance/${rollNo}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data) && data.length > 0) {
        setCalendarData(data);
        setAttendanceData(data);
      } else {
        setCalendarData(null);
        toast({
          title: "No Results",
          description: "No attendance records found for this roll number.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setCalendarData(null);
      toast({
        title: "Error",
        description: "Could not fetch student attendance.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const presentCount = attendanceData.filter(record => record.status === 'present').length;
  const absentCount = attendanceData.filter(record => record.status === 'absent').length;
  const holidayCount = attendanceData.filter(record => record.status === 'holiday').length;
  const workingDays = attendanceData.length - holidayCount;
  const attendancePercentage = workingDays > 0 ? Math.round((presentCount / workingDays) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              📊 Attendance Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track student attendance with ease
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={loadAllAttendance}
              disabled={loading}
              className="gradient-primary hover:opacity-90 transition-smooth shadow-card text-white font-medium px-6"
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              className="flex items-center gap-2 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-smooth"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Load Data and Search Section */}
        <div className="flex gap-4 items-end">
          <div className="w-full">
            <SearchStudent onSearch={handleSearch} loading={loading} />
          </div>
        </div>


        {/* Statistics Cards */}
        {attendanceData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="gradient-card shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                    <p className="text-2xl font-bold text-foreground">{attendanceData.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Present Days</p>
                    <p className="text-2xl font-bold text-success">{presentCount}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Absent Days</p>
                    <p className="text-2xl font-bold text-destructive">{absentCount}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                    <p className="text-2xl font-bold text-primary">{attendancePercentage}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chart + Mark Attendance Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chart Section - take 7 columns */}
          <div className="lg:col-span-7">
            <Card className="gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Attendance Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl bg-gradient-to-br from-white/80 to-muted/40 p-4 shadow-lg border border-border">
                  <AttendanceChart data={attendanceData} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mark Attendance - take 5 columns, with mini chart below */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <MarkAttendance />
            <MiniAttendanceChart data={attendanceData} />
          </div>
        </div>

        {/* Attendance Table - full width below chart and mark attendance */}
        <div className="w-full mt-6">
          <Card className="gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Attendance Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceTable data={attendanceData} />
            </CardContent>
          </Card>
        </div>
        
          {/* Calendar below table only if user searched for a student */}
          {Array.isArray(calendarData) && calendarData.length > 0 && (
            <AttendanceCalendar data={calendarData} />
          )}
      </div>
    </div>
  );
}