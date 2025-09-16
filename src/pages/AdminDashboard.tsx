import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Shield, Users, Stethoscope, Settings } from 'lucide-react';
import { dummyDoctors, Doctor } from '@/data/dummyData';
import { toast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>(dummyDoctors);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    department: ''
  });

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    
    const doctor: Doctor = {
      id: `d${doctors.length + 1}`,
      ...newDoctor,
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    };

    setDoctors([...doctors, doctor]);
    setNewDoctor({
      name: '',
      specialization: '',
      email: '',
      phone: '',
      department: ''
    });
    setShowAddForm(false);
    
    toast({
      title: "Doctor Added Successfully",
      description: `${doctor.name} has been added to the system.`,
    });
  };

  const systemMetrics = [
    {
      title: 'Total Users',
      value: '45',
      change: '+5',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Active Doctors',
      value: doctors.length.toString(),
      change: '+2',
      icon: Stethoscope,
      color: 'text-accent'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      icon: Shield,
      color: 'text-success'
    },
    {
      title: 'Pending Approvals',
      value: '3',
      change: '-2',
      icon: Settings,
      color: 'text-warning'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, doctors, and system settings
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
          Administrator
        </Badge>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => (
          <Card key={index} className="medical-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                <p className="text-xs text-success mt-1">{metric.change} from last month</p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Doctor Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Doctor Form */}
        <Card className="medical-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Add New Doctor</h3>
            <UserPlus className="w-5 h-5 text-primary" />
          </div>

          {!showAddForm ? (
            <Button 
              onClick={() => setShowAddForm(true)}
              className="w-full medical-gradient"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Doctor
            </Button>
          ) : (
            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div>
                <Label htmlFor="doctorName">Full Name</Label>
                <Input
                  id="doctorName"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Dr. John Smith"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={newDoctor.specialization}
                  onChange={(e) => setNewDoctor(prev => ({ ...prev, specialization: e.target.value }))}
                  placeholder="Cardiology"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={newDoctor.department} onValueChange={(value) => setNewDoctor(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="doctor@harms.healthcare"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newDoctor.phone}
                  onChange={(e) => setNewDoctor(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1-555-0000"
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">Add Doctor</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Doctor List */}
        <div className="lg:col-span-2">
          <Card className="medical-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Medical Staff</h3>
              <Badge variant="secondary">{doctors.length} Doctors</Badge>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                      <p className="text-xs text-muted-foreground">{doctor.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      {doctor.availability.length} days/week
                    </Badge>
                    <p className="text-xs text-muted-foreground">{doctor.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* System Settings */}
      <Card className="medical-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">System Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg hover:bg-muted/50 smooth-transition cursor-pointer">
            <Shield className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-medium text-sm">Security Settings</h4>
            <p className="text-xs text-muted-foreground">Manage user permissions and access</p>
          </div>
          
          <div className="p-4 border border-border rounded-lg hover:bg-muted/50 smooth-transition cursor-pointer">
            <Settings className="w-6 h-6 text-accent mb-2" />
            <h4 className="font-medium text-sm">System Configuration</h4>
            <p className="text-xs text-muted-foreground">Update system preferences</p>
          </div>
          
          <div className="p-4 border border-border rounded-lg hover:bg-muted/50 smooth-transition cursor-pointer">
            <Users className="w-6 h-6 text-success mb-2" />
            <h4 className="font-medium text-sm">User Management</h4>
            <p className="text-xs text-muted-foreground">Add, edit, or remove users</p>
          </div>
        </div>
      </Card>
    </div>
  );
}