import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CheckCheck, Briefcase, FileText, Calendar as CalendarIcon, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Job } from '@/types';
import { mockJobs } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    description: '',
    deadline: '',
    status: 'draft'
  });
  const [date, setDate] = React.useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleJobClick = (jobId: string) => {
    navigate(`/dashboard/jobs/${jobId}`);
  };

  const handleCreateJob = () => {
    if (!newJob.title || !newJob.description || !date) {
      // In a real app, add proper validation and error messages
      return;
    }

    const newJobId = `${jobs.length + 1}`;
    const createdJob: Job = {
      id: newJobId,
      title: newJob.title,
      description: newJob.description,
      deadline: date.toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      applicantCount: 0,
      pendingInterviewsCount: 0,
      completedInterviewsCount: 0
    };

    setJobs([...jobs, createdJob]);
    setNewJob({
      title: '',
      description: '',
      deadline: '',
      status: 'draft'
    });
    setDate(undefined);
    setCsvFile(null);
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Postings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your active job postings and create new ones.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-interviewai-green hover:bg-interviewai-green/90">
              <FileText className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
              <DialogDescription>
                Enter the job details below to create a new job posting.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="job-title">Job Title</Label>
                <Input 
                  id="job-title" 
                  placeholder="e.g. Frontend Developer"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea 
                  id="job-description" 
                  placeholder="Describe the job responsibilities and requirements..."
                  className="min-h-[100px]"
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="csv-upload">Upload CSV with Candidates (Optional)</Label>
                <Input 
                  id="csv-upload" 
                  type="file" 
                  accept=".csv"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-muted-foreground">
                  {csvFile ? `Selected file: ${csvFile.name}` : 'No file selected'}
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Job Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select deadline date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-interviewai-green hover:bg-interviewai-green/90"
                onClick={handleCreateJob}
              >
                Create Job
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card 
            key={job.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleJobClick(job.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <Badge className={cn("ml-2", getStatusColor(job.status))}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {job.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Deadline: {format(new Date(job.deadline), 'MMM d, yyyy')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{job.applicantCount} Applicants</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{job.pendingInterviewsCount} Pending</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCheck className="h-4 w-4 mr-1" />
                    <span>{job.completedInterviewsCount} Completed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
