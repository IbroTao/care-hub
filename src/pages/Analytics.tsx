import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Calendar, 
  Users, 
  DollarSign,
  Activity,
  FileText,
  BarChart3
} from 'lucide-react';
import { monthlyVisits, resourceAllocation, dummyAppointments, dummyPatients } from '@/data/dummyData';
import { toast } from '@/hooks/use-toast';

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState('patient-visits');

  // Calculate additional metrics
  const totalRevenue = dummyAppointments
    .filter(app => app.paid)
    .reduce((sum, app) => sum + app.fee, 0);
  
  const averageAppointmentFee = totalRevenue / dummyAppointments.filter(app => app.paid).length;
  
  const monthlyGrowth = ((monthlyVisits[8]?.visits || 0) - (monthlyVisits[7]?.visits || 0)) / (monthlyVisits[7]?.visits || 1) * 100;

  // Patient demographics data
  const patientDemographics = [
    { name: 'Male', value: dummyPatients.filter(p => p.gender === 'male').length, color: '#1e40af' },
    { name: 'Female', value: dummyPatients.filter(p => p.gender === 'female').length, color: '#0891b2' },
    { name: 'Other', value: dummyPatients.filter(p => p.gender === 'other').length, color: '#059669' }
  ];

  // Revenue data
  const revenueData = [
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 21750 },
    { month: 'Mar', revenue: 26700 },
    { month: 'Apr', revenue: 23250 },
    { month: 'May', revenue: 28800 },
    { month: 'Jun', revenue: 31500 },
    { month: 'Jul', revenue: 28200 },
    { month: 'Aug', revenue: 24750 },
    { month: 'Sep', revenue: 21750 }
  ];

  // Appointment status data
  const appointmentStatusData = [
    { name: 'Completed', value: dummyAppointments.filter(a => a.status === 'completed').length, color: '#059669' },
    { name: 'Scheduled', value: dummyAppointments.filter(a => a.status === 'scheduled').length, color: '#1e40af' },
    { name: 'Cancelled', value: dummyAppointments.filter(a => a.status === 'cancelled').length, color: '#dc2626' }
  ];

  const generateReport = (type: string) => {
    // Simulate report generation
    const reportData = {
      'patient-visits': {
        title: 'Patient Visits Report',
        data: monthlyVisits,
        filename: 'patient-visits-report.csv'
      },
      'revenue': {
        title: 'Revenue Report',
        data: revenueData,
        filename: 'revenue-report.csv'
      },
      'resources': {
        title: 'Resource Allocation Report',
        data: resourceAllocation,
        filename: 'resource-report.csv'
      }
    };

    const report = reportData[type as keyof typeof reportData];
    
    if (report) {
      toast({
        title: "Report Generated",
        description: `${report.title} has been generated successfully.`,
      });
      
      // In a real app, this would trigger a download
      console.log(`Generating ${report.filename}:`, report.data);
    }
  };

  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-success'
    },
    {
      title: 'Avg. Visit Fee',
      value: `$${Math.round(averageAppointmentFee)}`,
      change: '+5.2%',
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      title: 'Monthly Growth',
      value: `${monthlyGrowth.toFixed(1)}%`,
      change: monthlyGrowth > 0 ? 'positive' : 'negative',
      icon: Activity,
      color: monthlyGrowth > 0 ? 'text-success' : 'text-destructive'
    },
    {
      title: 'Total Patients',
      value: dummyPatients.length.toString(),
      change: '+8.1%',
      icon: Users,
      color: 'text-accent'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">
            Insights and data visualization for healthcare operations
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
          <BarChart3 className="w-4 h-4 mr-1" />
          Analytics
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="medical-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                <p className={`text-xs mt-1 ${metric.color}`}>{metric.change} from last month</p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Visits Chart */}
        <Card className="medical-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Patient Visits</h3>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyVisits}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="visits" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Resource Allocation Chart */}
        <Card className="medical-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Resource Allocation</h3>
            <Badge variant="secondary">By Category</Badge>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resourceAllocation}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  labelLine={false}
                >
                  {resourceAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card className="medical-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Revenue Trend</h3>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm text-success">+15.3% YoY</span>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Demographics */}
        <Card className="medical-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Patient Demographics</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientDemographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {patientDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Appointment Status */}
        <Card className="medical-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Appointment Status</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentStatusData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" className="text-xs" tick={{ fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {appointmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Report Generation */}
      <Card className="medical-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Generate Reports</h3>
            <p className="text-sm text-muted-foreground">Export data for detailed analysis</p>
          </div>
          <FileText className="w-6 h-6 text-primary" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-sm">Patient Visits</h4>
                <p className="text-xs text-muted-foreground">Monthly visit statistics</p>
              </div>
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => generateReport('patient-visits')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </div>
          
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-sm">Revenue Report</h4>
                <p className="text-xs text-muted-foreground">Financial performance data</p>
              </div>
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => generateReport('revenue')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
          
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-sm">Resource Usage</h4>
                <p className="text-xs text-muted-foreground">Inventory and allocation</p>
              </div>
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => generateReport('resources')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}