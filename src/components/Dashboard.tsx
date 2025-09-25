import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AttendanceChart } from './AttendanceChart';
import { AttendanceTable } from './AttendanceTable';
import { SearchStudent } from './SearchStudent';
import { MarkAttendance } from './MarkAttendance';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, LogOut, Users, Camera, TrendingUp } from 'lucide-react';

interface AttendanceRecord {
  name: string;
  rollNumber: string;
  date: string;
  isPresent: boolean;
}

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [allAttendanceData, setAllAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAllAttendance();
  }, []);

  const loadAllAttendance = async () => {
    setLoading(true);
    
    try {
      const apiUrl = 'https://3r8gtt2w-7174.inc1.devtunnels.ms/api/Attendance';
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Process the API response data
      setAttendanceData(data);
      setAllAttendanceData(data);
      
      toast({
        title: "Data Loaded",
        description: `Loaded ${data.length} attendance records`,
      });

    } catch (error) {
      console.error('Error fetching attendance:', error);
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
      // If search is empty, show all data
      setAttendanceData(allAttendanceData);
      return;
    }
    
    // Filter existing data by roll number
    const filteredData = allAttendanceData.filter(record => 
      record.rollNumber.toLowerCase().includes(rollNo.toLowerCase())
    );
    
    setAttendanceData(filteredData);
    
    if (filteredData.length > 0) {
      toast({
        title: "Search Complete",
        description: `Found ${filteredData.length} attendance records for roll number ${rollNo}`,
      });
    } else {
      toast({
        title: "No Results",
        description: "No attendance records found for this roll number.",
        variant: "destructive",
      });
    }
  };

  const presentCount = attendanceData.filter(record => record.isPresent).length;
  const absentCount = attendanceData.length - presentCount;
  const attendancePercentage = attendanceData.length > 0 ? Math.round((presentCount / attendanceData.length) * 100) : 0;

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
          <Button
            onClick={onLogout}
            variant="outline"
            className="flex items-center gap-2 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-smooth"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Load Data and Search Section */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <SearchStudent onSearch={handleSearch} loading={loading} />
          </div>
          <Button 
            onClick={loadAllAttendance}
            disabled={loading}
            className="gradient-primary hover:opacity-90 transition-smooth shadow-card text-white font-medium px-6"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>

        {/* Statistics Cards */}
        {attendanceData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                    <p className="text-2xl font-bold text-primary">{attendancePercentage}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chart Section */}
        <Card className="gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Attendance Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceChart data={attendanceData} />
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Table */}
          <div className="lg:col-span-2">
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

          {/* Mark Attendance */}
          <div className="lg:col-span-1">
            <MarkAttendance />
          </div>
        </div>
      </div>
    </div>
  );
};