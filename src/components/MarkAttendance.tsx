import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, CheckCircle, XCircle, Loader2, Hash } from 'lucide-react';

export const MarkAttendance = () => {
  const [rollNo, setRollNo] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rollNo.trim() || !selectedFile) {
      setMessage('Please enter roll number and select an image');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`http://127.0.0.1:5000/attendance/${rollNo}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Success: ${data.name} (${data.rollno}) marked present`);
        setMessageType('success');
        setRollNo('');
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('attendance-image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setMessage(`❌ Failed: ${data.reason || 'Unknown error'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
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
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="attendance-image" className="text-sm font-medium">
              Student Photo
            </Label>
            <div className="relative">
              <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="attendance-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="pl-10 transition-smooth focus:shadow-glow file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-muted file:text-muted-foreground"
                disabled={loading}
              />
            </div>
            {selectedFile && (
              <p className="text-xs text-muted-foreground mt-1">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          {message && (
            <Alert variant={messageType === 'error' ? 'destructive' : 'default'} 
                   className={messageType === 'success' ? 'border-success/20 bg-success/10 text-success-foreground' : ''}>
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

          <Button 
            type="submit" 
            disabled={!rollNo.trim() || !selectedFile || loading}
            className="w-full gradient-primary hover:opacity-90 transition-smooth shadow-card text-white font-medium py-2.5"
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
        </form>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            📸 Upload a clear photo of the student for facial recognition attendance marking.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};