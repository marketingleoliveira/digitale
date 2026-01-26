-- Create job_openings table for managing job positions
CREATE TABLE public.job_openings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  location TEXT,
  type TEXT DEFAULT 'full-time', -- full-time, part-time, internship, etc.
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_applications table for storing applications
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_opening_id UUID REFERENCES public.job_openings(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, reviewed, approved, rejected
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- RLS policies for job_openings
CREATE POLICY "Active job openings are viewable by everyone"
ON public.job_openings
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins and editors can manage job openings"
ON public.job_openings
FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

-- RLS policies for job_applications
CREATE POLICY "Anyone can submit job applications"
ON public.job_applications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can manage job applications"
ON public.job_applications
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all job applications"
ON public.job_applications
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Storage policies for resumes bucket
CREATE POLICY "Anyone can upload resumes"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Admins can view resumes"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resumes' AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor')));

CREATE POLICY "Admins can delete resumes"
ON storage.objects
FOR DELETE
USING (bucket_id = 'resumes' AND has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_job_openings_updated_at
BEFORE UPDATE ON public.job_openings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();