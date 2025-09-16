import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Plus, 
  Clock, 
  User, 
  Stethoscope,
  DollarSign,
  CheckCircle,
  XCircle,
  CreditCard
} from 'lucide-react';
import { dummyAppointments, dummyDoctors, dummyPatients, Appointment } from '@/data/dummyData';
import { toast } from '@/hooks/use-toast';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(dummyAppointments);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    fee: 150
  });

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const doctor = dummyDoctors.find(d => d.id === newAppointment.doctorId);
    if (!doctor) return;

    const appointment: Appointment = {
      id: `a${appointments.length + 1}`,
      patientId: 'p-new',
      patientName: newAppointment.patientName,
      doctorId: newAppointment.doctorId,
      doctorName: doctor.name,
      date: newAppointment.date,
      time: newAppointment.time,
      status: 'scheduled',
      reason: newAppointment.reason,
      fee: newAppointment.fee,
      paid: false
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({
      patientName: '',
      doctorId: '',
      date: '',
      time: '',
      reason: '',
      fee: 150
    });
    setShowBookingForm(false);
    
    toast({
      title: "Appointment Scheduled",
      description: `Appointment with ${doctor.name} has been scheduled.`,
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.map(app =>
      app.id === appointmentId
        ? { ...app, status: 'cancelled' as const }
        : app
    );
    setAppointments(updatedAppointments);
    
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled.",
      variant: "destructive"
    });
  };

  const handlePayment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowPaymentModal(true);
  };

  const processPayment = (method: 'card' | 'cash' | 'insurance') => {
    if (selectedAppointment) {
      const updatedAppointments = appointments.map(app =>
        app.id === selectedAppointment.id
          ? { ...app, paid: true }
          : app
      );
      setAppointments(updatedAppointments);
      setShowPaymentModal(false);
      setSelectedAppointment(null);
      
      toast({
        title: "Payment Successful",
        description: `Payment of $${selectedAppointment.fee} processed successfully.`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: { variant: 'default' as const, icon: Clock },
      completed: { variant: 'secondary' as const, icon: CheckCircle },
      cancelled: { variant: 'destructive' as const, icon: XCircle }
    };
    const config = variants[status as keyof typeof variants];
    return config || { variant: 'default' as const, icon: Clock };
  };

  const upcomingAppointments = appointments.filter(app => 
    app.status === 'scheduled' && new Date(app.date) >= new Date()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage patient appointments
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {upcomingAppointments.length} Upcoming
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Appointments</p>
              <p className="text-2xl font-bold text-foreground">
                {appointments.filter(app => app.date === '2024-09-16').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        </Card>
        
        <Card className="medical-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Payments</p>
              <p className="text-2xl font-bold text-foreground">
                {appointments.filter(app => !app.paid && app.status === 'scheduled').length}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-warning" />
          </div>
        </Card>
        
        <Card className="medical-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold text-foreground">12</p>
            </div>
            <Clock className="w-8 h-8 text-accent" />
          </div>
        </Card>
        
        <Card className="medical-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground">
                {appointments.filter(app => app.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button 
          onClick={() => setShowBookingForm(true)}
          className="medical-gradient medical-shadow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Book Appointment
        </Button>
      </div>

      {/* Booking Form */}
      {showBookingForm && (
        <Card className="medical-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Book New Appointment</h3>
            <Button variant="ghost" onClick={() => setShowBookingForm(false)}>×</Button>
          </div>
          
          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={newAppointment.patientName}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, patientName: e.target.value }))}
                  placeholder="Enter patient name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="doctor">Doctor</Label>
                <Select value={newAppointment.doctorId} onValueChange={(value) => setNewAppointment(prev => ({ ...prev, doctorId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyDoctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="time">Time</Label>
                <Select value={newAppointment.time} onValueChange={(value) => setNewAppointment(prev => ({ ...prev, time: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">02:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                    <SelectItem value="16:00">04:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="fee">Consultation Fee</Label>
                <Input
                  id="fee"
                  type="number"
                  value={newAppointment.fee}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, fee: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                value={newAppointment.reason}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Describe the reason for this appointment..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1 medical-gradient">
                Book Appointment
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowBookingForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md medical-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Process Payment</h3>
              <Button variant="ghost" onClick={() => setShowPaymentModal(false)}>×</Button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Amount Due</p>
                <p className="text-3xl font-bold text-foreground">${selectedAppointment.fee}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedAppointment.patientName} - {selectedAppointment.doctorName}
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => processPayment('card')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay by Card (Demo)
                </Button>
                <Button 
                  onClick={() => processPayment('cash')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Cash Payment
                </Button>
                <Button 
                  onClick={() => processPayment('insurance')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Insurance Claim
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Appointments List */}
      <Card className="medical-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">All Appointments</h3>
          <Badge variant="secondary">{appointments.length} Total</Badge>
        </div>
        
        <div className="space-y-3">
          {appointments.map((appointment) => {
            const status = getStatusBadge(appointment.status);
            const StatusIcon = status.icon;
            
            return (
              <div key={appointment.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 smooth-transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground">{appointment.patientName}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Stethoscope className="w-4 h-4" />
                          <span>{appointment.doctorName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{appointment.date} at {appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>${appointment.fee}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{appointment.reason}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={status.variant} className="flex items-center space-x-1">
                      <StatusIcon className="w-3 h-3" />
                      <span>{appointment.status}</span>
                    </Badge>
                    
                    {!appointment.paid && appointment.status === 'scheduled' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePayment(appointment)}
                        className="text-success hover:text-success"
                      >
                        Pay ${appointment.fee}
                      </Button>
                    )}
                    
                    {appointment.paid && (
                      <Badge variant="secondary" className="text-success">
                        Paid
                      </Badge>
                    )}
                    
                    {appointment.status === 'scheduled' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}