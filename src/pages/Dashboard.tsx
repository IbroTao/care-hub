import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { dummyPatients, dummyAppointments, dummyResources, dummyDoctors } from '@/data/dummyData';

export default function Dashboard() {
  const { user } = useAuth();

  // Calculate statistics
  const totalPatients = dummyPatients.length;
  const totalDoctors = dummyDoctors.length;
  const todayAppointments = dummyAppointments.filter(
    app => app.date === '2024-09-16' && app.status === 'scheduled'
  ).length;
  const lowStockResources = dummyResources.filter(r => r.status === 'low-stock').length;
  const expiredResources = dummyResources.filter(r => r.status === 'expired').length;
  const revenueToday = dummyAppointments
    .filter(app => app.date === '2024-09-16' && app.paid)
    .reduce((sum, app) => sum + app.fee, 0);

  const stats = [
    {
      title: 'Total Patients',
      value: totalPatients,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Today\'s Appointments',
      value: todayAppointments,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Low Stock Items',
      value: lowStockResources,
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Revenue Today',
      value: `$${revenueToday}`,
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  const recentAppointments = dummyAppointments
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'default',
      completed: 'secondary',
      cancelled: 'destructive'
    } as const;
    return variants[status as keyof typeof variants] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening at your healthcare facility today.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 capitalize">
          {user?.role}
        </Badge>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="medical-card smooth-transition hover:elevated-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <Card className="medical-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Appointments</h3>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">
                    {appointment.patientName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.doctorName} • {appointment.date} at {appointment.time}
                  </p>
                </div>
                <Badge variant={getStatusBadge(appointment.status)} className="text-xs">
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* System Alerts */}
        <Card className="medical-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">System Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div className="space-y-3">
            {lowStockResources > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Low Stock Alert</p>
                  <p className="text-xs text-muted-foreground">
                    {lowStockResources} items need restocking
                  </p>
                </div>
              </div>
            )}
            
            {expiredResources > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <Clock className="w-4 h-4 text-destructive" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Expired Items</p>
                  <p className="text-xs text-muted-foreground">
                    {expiredResources} items have expired
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg border border-success/20">
              <CheckCircle className="w-4 h-4 text-success" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">System Status</p>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      {user?.role === 'admin' && (
        <Card className="medical-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 text-left rounded-lg border border-border hover:bg-muted/50 smooth-transition">
              <Users className="w-6 h-6 text-primary mb-2" />
              <p className="font-medium text-sm">Add New Patient</p>
              <p className="text-xs text-muted-foreground">Register a new patient</p>
            </button>
            <button className="p-4 text-left rounded-lg border border-border hover:bg-muted/50 smooth-transition">
              <Calendar className="w-6 h-6 text-accent mb-2" />
              <p className="font-medium text-sm">Schedule Appointment</p>
              <p className="text-xs text-muted-foreground">Book new appointment</p>
            </button>
            <button className="p-4 text-left rounded-lg border border-border hover:bg-muted/50 smooth-transition">
              <Package className="w-6 h-6 text-success mb-2" />
              <p className="font-medium text-sm">Manage Resources</p>
              <p className="text-xs text-muted-foreground">Update inventory</p>
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}