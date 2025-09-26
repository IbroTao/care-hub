import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Upload,
  Calendar,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { dummyPatients, Patient } from '@/data/dummyData';
import { toast } from '@/hooks/use-toast';

export default function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>(dummyPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '', 
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: '',
    emergencyContact: '',
    medicalHistory: ''
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patient: Patient = {
      id: `p${patients.length + 1}`,
      ...newPatient,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    setPatients([...patients, patient]);
    resetForm();
    
    toast({
      title: "Patient Added Successfully",
      description: `${patient.name} has been registered.`,
    });
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setNewPatient({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      medicalHistory: patient.medicalHistory
    });
    setShowAddForm(true);
  };

  const handleUpdatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPatient) {
      const updatedPatients = patients.map(p => 
        p.id === editingPatient.id 
          ? { ...editingPatient, ...newPatient }
          : p
      );
      setPatients(updatedPatients);
      resetForm();
      
      toast({
        title: "Patient Updated Successfully",
        description: `${newPatient.name}'s information has been updated.`,
      });
    }
  };

  const handleDeletePatient = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setPatients(patients.filter(p => p.id !== patientId));
    
    toast({
      title: "Patient Deleted",
      description: `${patient?.name} has been removed from the system.`,
      variant: "destructive",
    });
  };

  const resetForm = () => {
    setNewPatient({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'male',
      address: '',
      emergencyContact: '',
      medicalHistory: ''
    });
    setShowAddForm(false);
    setEditingPatient(null);
  };

  const handleImageUpload = (patientId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server
      const imageUrl = URL.createObjectURL(file);
      const updatedPatients = patients.map(p => 
        p.id === patientId ? { ...p, imageUrl } : p
      );
      setPatients(updatedPatients);
      
      toast({
        title: "Image Uploaded",
        description: "Patient image has been updated.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage patient records and information
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {patients.length} Patients
        </Badge>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="medical-gradient medical-shadow"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Add/Edit Patient Form */}
      {showAddForm && (
        <Card className="medical-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {editingPatient ? 'Edit Patient' : 'Add New Patient'}
            </h3>
            <Button variant="ghost" onClick={resetForm}>×</Button>
          </div>
          
          <form onSubmit={editingPatient ? handleUpdatePatient : handleAddPatient} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.doe@email.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1-555-0000"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={newPatient.dateOfBirth}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={newPatient.gender} onValueChange={(value: 'male' | 'female' | 'other') => setNewPatient(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={newPatient.emergencyContact}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  placeholder="Jane Doe - +1-555-0001"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newPatient.address}
                onChange={(e) => setNewPatient(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main St, City, State, ZIP"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                value={newPatient.medicalHistory}
                onChange={(e) => setNewPatient(prev => ({ ...prev, medicalHistory: e.target.value }))}
                placeholder="Known allergies, previous surgeries, medications..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1 medical-gradient">
                {editingPatient ? 'Update Patient' : 'Add Patient'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Patient List */}
      <Card className="medical-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Patient Records</h3>
          <Badge variant="secondary">{filteredPatients.length} Found</Badge>
        </div>
        
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 smooth-transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    {patient.imageUrl ? (
                      <img 
                        src={patient.imageUrl} 
                        alt={patient.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80">
                      <Upload className="w-3 h-3 text-primary-foreground" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(patient.id, e)}
                      />
                    </label>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{patient.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{patient.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{patient.dateOfBirth}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{patient.address}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Emergency:</strong> {patient.emergencyContact}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Medical History:</strong> {patient.medicalHistory || 'No history recorded'}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPatient(patient)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePatient(patient.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No patients found matching your search.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}