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
import { Job } from '@/types/job';
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
        return 'bg-primary/10 text-primary border-primary/20';
      case 'closed':
        return 'bg-muted text-muted-foreground border-muted/50';
      case 'draft':
        return 'bg-accent/20 text-accent-foreground border-accent/30';
      default:
        return 'bg-secondary text-secondary-foreground border-secondary/50';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Postings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your active job postings and create new ones.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Job Posting</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter the job details below to create a new job posting.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="job-title" className="text-foreground">Job Title</Label>
                <Input 
                  id="job-title" 
                  placeholder="e.g. Frontend Developer"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  className="border-border focus-visible:ring-primary"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="job-description" className="text-foreground">Job Description</Label>
                <Textarea 
                  id="job-description" 
                  placeholder="Describe the job responsibilities and requirements..."
                  className="min-h-[100px] border-border focus-visible:ring-primary"
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="csv-upload" className="text-foreground">Upload CSV with Candidates (Optional)</Label>
                <Input 
                  id="csv-upload" 
                  type="file" 
                  accept=".csv"
                  onChange={handleFileChange}
                  className="border-border"
                />
                <p className="text-sm text-muted-foreground">
                  {csvFile ? `Selected file: ${csvFile.name}` : 'No file selected'}
                </p>
              </div>
              <div className="grid gap-2">
                <Label className="text-foreground">Job Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal border-border hover:bg-primary/5",
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
                      className="p-3 pointer-events-auto border-border"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="hover:bg-primary/5">
                Cancel
              </Button>
              <Button onClick={handleCreateJob}>
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
            className="cursor-pointer hover:shadow-md transition-all duration-300 border-border"
            onClick={() => handleJobClick(job.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-foreground">{job.title}</CardTitle>
                <Badge className={cn("ml-2 border", getStatusColor(job.status))}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 text-muted-foreground">
                {job.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-1 text-primary" />
                  <span>Deadline: {format(new Date(job.deadline), 'MMM d, yyyy')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1 text-primary" />
                    <span>{job.applicantCount} Applicants</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-1 text-primary" />
                    <span>{job.pendingInterviewsCount} Pending</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCheck className="h-4 w-4 mr-1 text-primary" />
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
