// HARMS Dummy Data - In-memory storage for the prototype

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergencyContact: string;
  medicalHistory: string;
  imageUrl?: string;
  registrationDate: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  availability: string[];
  department: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
  fee: number;
  paid: boolean;
}

export interface Resource {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  expiryDate: string;
  status: 'in-stock' | 'low-stock' | 'expired' | 'out-of-stock';
  supplier: string;
  cost: number;
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientName: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: 'card' | 'cash' | 'insurance';
  date: string;
}

// Dummy Data
export const dummyPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1-555-0123',
    dateOfBirth: '1995-06-15',
    gender: 'female',
    address: '123 Oak Street, Springfield, IL 62701',
    emergencyContact: 'Maria Rodriguez - +1-555-0124',
    medicalHistory: 'Allergic to penicillin. Previous surgery: Appendectomy (2018)',
    registrationDate: '2024-01-15'
  },
  {
    id: 'p2',
    name: 'James Thompson',
    email: 'james.thompson@email.com',
    phone: '+1-555-0125',
    dateOfBirth: '1988-03-22',
    gender: 'male',
    address: '456 Pine Avenue, Springfield, IL 62702',
    emergencyContact: 'Sarah Thompson - +1-555-0126',
    medicalHistory: 'Diabetes Type 2, Hypertension. Regular medication: Metformin',
    registrationDate: '2024-02-03'
  },
  {
    id: 'p3',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1-555-0127',
    dateOfBirth: '1992-11-08',
    gender: 'female',
    address: '789 Elm Drive, Springfield, IL 62703',
    emergencyContact: 'Carlos Garcia - +1-555-0128',
    medicalHistory: 'No known allergies. Regular checkups for preventive care',
    registrationDate: '2024-01-28'
  }
];

export const dummyDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Michael Chen',
    specialization: 'Internal Medicine',
    email: 'michael.chen@harms.healthcare',
    phone: '+1-555-0201',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    department: 'General Medicine'
  },
  {
    id: 'd2',
    name: 'Dr. Jennifer Walsh',
    specialization: 'Pediatrics',
    email: 'jennifer.walsh@harms.healthcare',
    phone: '+1-555-0202',
    availability: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    department: 'Pediatrics'
  },
  {
    id: 'd3',
    name: 'Dr. Robert Kim',
    specialization: 'Cardiology',
    email: 'robert.kim@harms.healthcare',
    phone: '+1-555-0203',
    availability: ['Tuesday', 'Wednesday', 'Thursday'],
    department: 'Cardiology'
  }
];

export const dummyAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'Emily Rodriguez',
    doctorId: 'd1',
    doctorName: 'Dr. Michael Chen',
    date: '2024-09-20',
    time: '10:00',
    status: 'scheduled',
    reason: 'Annual checkup',
    fee: 150,
    paid: true
  },
  {
    id: 'a2',
    patientId: 'p2',
    patientName: 'James Thompson',
    doctorId: 'd3',
    doctorName: 'Dr. Robert Kim',
    date: '2024-09-22',
    time: '14:30',
    status: 'scheduled',
    reason: 'Cardiology consultation',
    fee: 250,
    paid: false
  },
  {
    id: 'a3',
    patientId: 'p3',
    patientName: 'Maria Garcia',
    doctorId: 'd2',
    doctorName: 'Dr. Jennifer Walsh',
    date: '2024-09-18',
    time: '09:15',
    status: 'completed',
    reason: 'Follow-up consultation',
    fee: 120,
    paid: true
  }
];

export const dummyResources: Resource[] = [
  {
    id: 'r1',
    name: 'Surgical Masks',
    category: 'PPE',
    quantity: 150,
    minStock: 50,
    expiryDate: '2025-12-31',
    status: 'in-stock',
    supplier: 'MedSupply Co.',
    cost: 0.75
  },
  {
    id: 'r2',
    name: 'Disposable Syringes',
    category: 'Medical Equipment',
    quantity: 25,
    minStock: 100,
    expiryDate: '2026-06-30',
    status: 'low-stock',
    supplier: 'HealthTech Industries',
    cost: 0.25
  },
  {
    id: 'r3',
    name: 'Bandages',
    category: 'First Aid',
    quantity: 200,
    minStock: 75,
    expiryDate: '2027-03-15',
    status: 'in-stock',
    supplier: 'MedSupply Co.',
    cost: 1.50
  },
  {
    id: 'r4',
    name: 'Antibiotics (Amoxicillin)',
    category: 'Medication',
    quantity: 0,
    minStock: 30,
    expiryDate: '2024-08-15',
    status: 'expired',
    supplier: 'PharmaCorp',
    cost: 12.50
  }
];

export const dummyPayments: Payment[] = [
  {
    id: 'pay1',
    appointmentId: 'a1',
    patientName: 'Emily Rodriguez',
    amount: 150,
    status: 'completed',
    method: 'card',
    date: '2024-09-15'
  },
  {
    id: 'pay2',
    appointmentId: 'a2',
    patientName: 'James Thompson',
    amount: 250,
    status: 'pending',
    method: 'insurance',
    date: '2024-09-16'
  }
];

// Analytics dummy data
export const monthlyVisits = [
  { month: 'Jan', visits: 120 },
  { month: 'Feb', visits: 145 },
  { month: 'Mar', visits: 178 },
  { month: 'Apr', visits: 155 },
  { month: 'May', visits: 192 },
  { month: 'Jun', visits: 210 },
  { month: 'Jul', visits: 188 },
  { month: 'Aug', visits: 165 },
  { month: 'Sep', visits: 145 }
];

export const resourceAllocation = [
  { name: 'PPE', value: 35, color: '#1e40af' },
  { name: 'Medical Equipment', value: 28, color: '#0891b2' },
  { name: 'Medications', value: 22, color: '#059669' },
  { name: 'First Aid', value: 15, color: '#7c3aed' }
];