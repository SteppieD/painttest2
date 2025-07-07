'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Target, 
  Users, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar,
  CheckCircle2,
  Circle,
  ArrowRight,
  Briefcase,
  TrendingUp,
  DollarSign,
  Clock,
  Star
} from 'lucide-react';

export default function ContractorOutreachPage() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const outreachTasks = [
    {
      id: 'research',
      category: 'Research & Preparation',
      tasks: [
        { id: 'r1', task: 'Create list of 50 local painting contractors from Google Maps', priority: 'high' },
        { id: 'r2', task: 'Find contractor emails/phones from websites and Facebook pages', priority: 'high' },
        { id: 'r3', task: 'Join 5 painting contractor Facebook groups', priority: 'medium' },
        { id: 'r4', task: 'Research each contractor\'s business size and pain points', priority: 'medium' },
        { id: 'r5', task: 'Create personalized outreach templates for different contractor types', priority: 'high' }
      ]
    },
    {
      id: 'content',
      category: 'Content Creation',
      tasks: [
        { id: 'c1', task: 'Record 3-minute demo video showing quote creation speed', priority: 'high' },
        { id: 'c2', task: 'Create one-page PDF comparing us vs. manual quotes', priority: 'high' },
        { id: 'c3', task: 'Design "Save 10 Hours Per Week" infographic', priority: 'medium' },
        { id: 'c4', task: 'Write 3 contractor success story case studies', priority: 'medium' },
        { id: 'c5', task: 'Create ROI calculator showing potential revenue increase', priority: 'high' }
      ]
    },
    {
      id: 'outreach',
      category: 'Direct Outreach',
      tasks: [
        { id: 'o1', task: 'Send personalized emails to first 10 contractors', priority: 'high' },
        { id: 'o2', task: 'Follow up with phone calls after 2 days', priority: 'high' },
        { id: 'o3', task: 'Offer exclusive 3-month free beta access', priority: 'high' },
        { id: 'o4', task: 'Schedule demo calls with interested contractors', priority: 'medium' },
        { id: 'o5', task: 'Send LinkedIn connection requests with personal notes', priority: 'medium' }
      ]
    },
    {
      id: 'partnerships',
      category: 'Strategic Partnerships',
      tasks: [
        { id: 'p1', task: 'Contact 5 paint supply stores about partnership', priority: 'medium' },
        { id: 'p2', task: 'Reach out to painting contractor associations', priority: 'medium' },
        { id: 'p3', task: 'Partner with painting business consultants', priority: 'low' },
        { id: 'p4', task: 'Create referral program for contractors (20% commission)', priority: 'high' },
        { id: 'p5', task: 'Offer co-marketing opportunities to paint brands', priority: 'low' }
      ]
    },
    {
      id: 'followup',
      category: 'Follow-up & Conversion',
      tasks: [
        { id: 'f1', task: 'Set up automated email sequence for trial users', priority: 'high' },
        { id: 'f2', task: 'Create onboarding video series (5 videos)', priority: 'high' },
        { id: 'f3', task: 'Schedule weekly check-in calls with beta users', priority: 'medium' },
        { id: 'f4', task: 'Collect testimonials and feedback', priority: 'high' },
        { id: 'f5', task: 'Offer extended trials for active users', priority: 'medium' }
      ]
    }
  ];

  const emailTemplates = {
    initial: `Subject: Save 10 Hours/Week on Painting Quotes (30-Second Demo Inside)

Hi [Name],

I noticed you run [Company Name] in [City]. As a painting contractor, you probably spend hours creating quotes that customers compare with 5 other contractors.

What if you could create professional quotes in 30 seconds instead of 30 minutes?

I built ProPaint Quote specifically for painting contractors. It's helped contractors like Mike's Painting Co. increase revenue by 47% by winning more jobs with faster quotes.

Would you be interested in a quick 3-minute demo? I'm offering 3 months free to the first 20 contractors in [City].

Best regards,
[Your Name]

P.S. Here's a 30-second video showing how fast it works: [Link]`,
    
    followUp: `Subject: Re: Save 10 Hours/Week on Painting Quotes

Hi [Name],

Just following up on my previous email. I know you're busy running [Company Name], so I'll keep this short.

I'm offering an exclusive deal for [City] painters:
✓ 3 months completely free (no credit card required)
✓ Personal onboarding to set up your paint products and pricing
✓ 30-second quote creation (I'll show you live)

Are you free for a quick 10-minute call this week? I have slots open on [Day] at [Time] or [Day] at [Time].

Best regards,
[Your Name]

P.S. Mike from Mike's Painting saved 32 hours last month and won 8 more jobs. Happy to share his story.`,

    facebook: `Hey [City] painters! 👋

Tired of spending hours on quotes that customers shop around with?

I built a tool that creates professional painting quotes in 30 seconds. It's helped local contractors save 10+ hours per week and win more jobs.

Offering 3 months FREE to the first 20 contractors who want to try it.

Check out this 30-second demo: [Link]

Anyone interested? Drop a comment or DM me!`
  };

  const completionRate = (completedTasks.length / 25) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Contractor Outreach Plan</h1>
            <Link href="/dashboard" className="text-orange-600 hover:text-orange-700">
              Back to Dashboard
            </Link>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{completedTasks.length}/25 Tasks Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-orange-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Key Metrics Goals */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-orange-50 p-4 rounded-lg">
              <Target className="text-orange-600 mb-2" size={24} />
              <div className="text-2xl font-bold text-gray-900">20</div>
              <div className="text-sm text-gray-600">Beta Users Goal</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <Users className="text-blue-600 mb-2" size={24} />
              <div className="text-2xl font-bold text-gray-900">50</div>
              <div className="text-sm text-gray-600">Contractors to Contact</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <TrendingUp className="text-green-600 mb-2" size={24} />
              <div className="text-2xl font-bold text-gray-900">25%</div>
              <div className="text-sm text-gray-600">Target Conversion</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <DollarSign className="text-purple-600 mb-2" size={24} />
              <div className="text-2xl font-bold text-gray-900">$1,580</div>
              <div className="text-sm text-gray-600">Potential MRR</div>
            </div>
          </div>
        </div>

        {/* Task Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {outreachTasks.map(category => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.tasks.map(task => (
                  <div 
                    key={task.id}
                    className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => toggleTask(task.id)}
                  >
                    {completedTasks.includes(task.id) ? (
                      <CheckCircle2 className="text-green-600 mt-0.5" size={20} />
                    ) : (
                      <Circle className="text-gray-400 mt-0.5" size={20} />
                    )}
                    <div className="flex-1">
                      <p className={`${completedTasks.includes(task.id) ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {task.task}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.priority} priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Email Templates */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Templates</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Mail size={20} />
                Initial Outreach Email
              </h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap font-sans">
                {emailTemplates.initial}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Mail size={20} />
                Follow-up Email (Day 3)
              </h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap font-sans">
                {emailTemplates.followUp}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare size={20} />
                Facebook Group Post
              </h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap font-sans">
                {emailTemplates.facebook}
              </pre>
            </div>
          </div>
        </div>

        {/* Key Talking Points */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Talking Points</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Pain Points to Address</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Clock className="text-orange-600 mt-0.5" size={16} />
                  <span className="text-gray-700">Spending 2-3 hours per quote</span>
                </li>
                <li className="flex items-start gap-2">
                  <DollarSign className="text-orange-600 mt-0.5" size={16} />
                  <span className="text-gray-700">Losing jobs to faster competitors</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="text-orange-600 mt-0.5" size={16} />
                  <span className="text-gray-700">Customers shopping quotes around</span>
                </li>
                <li className="flex items-start gap-2">
                  <Briefcase className="text-orange-600 mt-0.5" size={16} />
                  <span className="text-gray-700">Looking unprofessional with handwritten quotes</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Value Props to Highlight</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Star className="text-green-600 mt-0.5" size={16} />
                  <span className="text-gray-700">30-second professional quotes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="text-green-600 mt-0.5" size={16} />
                  <span className="text-gray-700">Win more jobs with instant responses</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="text-green-600 mt-0.5" size={16} />
                  <span className="text-gray-700">Close deals on-site before leaving</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="text-green-600 mt-0.5" size={16} />
                  <span className="text-gray-700">Professional quotes that impress</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Week-by-Week Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4-Week Execution Timeline</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-orange-600 pl-4">
              <h3 className="font-semibold text-gray-900">Week 1: Research & Preparation</h3>
              <p className="text-gray-600">Build contractor list, create content, set up systems</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold text-gray-900">Week 2: Initial Outreach</h3>
              <p className="text-gray-600">Contact first 25 contractors via email and phone</p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-semibold text-gray-900">Week 3: Follow-up & Demos</h3>
              <p className="text-gray-600">Schedule demos, onboard beta users, collect feedback</p>
            </div>
            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-semibold text-gray-900">Week 4: Convert & Scale</h3>
              <p className="text-gray-600">Convert trials to paid, get testimonials, expand outreach</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}