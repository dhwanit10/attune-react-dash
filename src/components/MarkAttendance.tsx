
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, CheckCircle, XCircle, Loader2, Hash } from 'lucide-react';

export const MarkAttendance = () => {
  const [rollNo, setRollNo] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);

  const markAttendance = async (status: 'present' | 'absent') => {
    if (!rollNo.trim()) {
      setMessage('Please enter roll number');
      setMessageType('error');
      return;
    }
    setLoading(true);
    setMessage('');
    const now = new Date().toISOString();
    try {
      const response = await fetch(`https://3r8gtt2w-7174.inc1.devtunnels.ms/api/Attendance/${rollNo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendanceDate: now, status }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Success: Roll No ${rollNo} marked ${status}`);
        setMessageType('success');
        setRollNo('');
      } else {
        setMessage(`❌ Failed: ${data.reason || 'Unknown error'}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('❌ Error connecting to API. Please check your connection.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="gradient-card shadow-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Camera className="h-5 w-5 text-primary" />
          Mark Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mark-rollno" className="text-sm font-medium">
              Roll Number
            </Label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="mark-rollno"
                type="text"
                placeholder="Enter student roll number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="pl-10 transition-smooth focus:shadow-glow"
                disabled={loading}
              />
            </div>
          </div>

          {message && (
            <Alert 
              variant={messageType === 'error' ? 'destructive' : 'default'}
              className={
                messageType === 'success'
                  ? 'border-success/20 bg-success/90 text-white'
                  : ''
              }
            >
              <div className="flex items-center gap-2">
                {messageType === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertDescription>{message}</AlertDescription>
              </div>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button 
              type="button"
              disabled={!rollNo.trim() || loading}
              className="w-full gradient-primary hover:opacity-90 transition-smooth shadow-card text-white font-medium py-2.5"
              onClick={() => markAttendance('present')}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Mark Present
                </>
              )}
            </Button>
            <Button 
              type="button"
              disabled={!rollNo.trim() || loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5"
              onClick={() => markAttendance('absent')}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Mark Absent
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};