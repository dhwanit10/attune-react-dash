import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, User, Loader2 } from 'lucide-react';

interface SearchStudentProps {
  onSearch: (rollNo: string) => Promise<void>;
  loading: boolean;
}

export const SearchStudent = ({ onSearch, loading }: SearchStudentProps) => {
  const [rollNo, setRollNo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNo.trim()) return;
    await onSearch(rollNo.trim());
  };

  return (
    <Card className="gradient-card shadow-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-primary" />
          Student Search
        </CardTitle>
        <CardDescription>
          Enter a roll number to view attendance records and statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter roll number (e.g., 2021001)"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="pl-10 transition-smooth focus:shadow-glow"
              disabled={loading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={!rollNo.trim() || loading}
            className="gradient-primary hover:opacity-90 transition-smooth shadow-card text-white font-medium px-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};