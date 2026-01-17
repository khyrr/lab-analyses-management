import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  Users, 
  ChevronDown, 
  Home, 
  UserCircle, 
  Calendar as CalendarIcon, 
  Eye, 
  EyeOff, 
  Hospital,
  Activity,
  LogOut,
  Settings,
  Bell,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  Plus,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 shadow-sm hover:shadow-md',
    secondary: 'bg-teal-50 text-teal-700 hover:bg-teal-100 focus:ring-teal-500',
    outline: 'border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-teal-500',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-teal-500',
    success: 'bg-green-50 text-green-700 hover:bg-green-100 focus:ring-green-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, icon: Icon, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-100 flex items-center justify-between ${className}`}>
    {children}
    {Icon && (
      <div className="p-2 bg-teal-50 rounded-lg">
        <Icon className="h-5 w-5 text-teal-600" />
      </div>
    )}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-semibold text-gray-900 ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-gray-50/50 border-t border-gray-100 rounded-b-2xl ${className}`}>{children}</div>
);

const Input = ({ className = '', ...props }) => (
  <div className="relative">
    <input
      className={`w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-sm placeholder:text-gray-400 ${className}`}
      {...props}
    />
  </div>
);

const Label = ({ children, htmlFor, required = false }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1.5 ml-0.5">
    {children}
    {required && <span className="text-red-500 ml-1 font-bold">*</span>}
  </label>
);

const Select = ({ children, className = '', ...props }) => (
  <select
    className={`w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-sm appearance-none cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </select>
);

const Badge = ({ children, variant = 'neutral' }) => {
  const styles = {
    neutral: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    teal: 'bg-teal-100 text-teal-700'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default function PatientDashboard() {
  const [showAppointments, setShowAppointments] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [careTeam, setCareTeam] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatientProfile();
    fetchDoctors();
    fetchAppointments();
    fetchCareTeam();
    fetchPrescriptions();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/patient/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPatientInfo(data);
        setEditedInfo(data);
      }
    } catch (error) {
      console.error('Error fetching patient profile:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/doctor/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/patient/available-slots?doctorId=${doctorId}&date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const slots = await response.json();
        setAvailableSlots(slots);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/patient/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchCareTeam = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/patient/care-team`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCareTeam(data);
      }
    } catch (error) {
      console.error('Error fetching care team:', error);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/patient/prescriptions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'teal' }) => {
    const colorClasses = {
      teal: 'bg-teal-50 text-teal-600',
      blue: 'bg-blue-50 text-blue-600',
      purple: 'bg-indigo-50 text-indigo-600',
      orange: 'bg-orange-50 text-orange-600'
    };

    return (
      <Card hover>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const NavItem = ({ tab, icon: Icon, label }) => (
    <li>
      <button
        onClick={() => setActiveTab(tab)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
          activeTab === tab
            ? 'bg-teal-50 text-teal-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Icon className={`h-5 w-5 ${activeTab === tab ? 'text-teal-600' : 'text-gray-400'}`} />
        <span>{label}</span>
        {activeTab === tab && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600" />}
      </button>
    </li>
  );

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Rendez-vous" 
          value={appointments.length} 
          icon={Calendar} 
          color="teal" 
        />
        <StatCard 
          title="Prescriptions" 
          value={prescriptions.length} 
          icon={FileText} 
          color="blue" 
        />
        <StatCard 
          title="Équipe de soins" 
          value={careTeam.length} 
          icon={Users} 
          color="purple" 
        />
        <StatCard 
          title="Analyses" 
          value="4" 
          icon={Activity} 
          color="orange" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader icon={Calendar}>
              <CardTitle>Prochains Rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((apt, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-teal-100 hover:bg-teal-50/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold">
                          {apt.doctorId?.firstName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Dr. {apt.doctorId?.firstName} {apt.doctorId?.lastName}</p>
                          <p className="text-sm text-gray-500">{apt.reason || 'Consultation générale'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{apt.time}</p>
                        <p className="text-xs text-gray-500">{apt.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500">Aucun rendez-vous prévu</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-teal-600 hover:bg-teal-50" onClick={() => setActiveTab('Appointment Booking')}>
                Réserver un rendez-vous <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader icon={FileText}>
              <CardTitle>Prescriptions Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptions.length > 0 ? prescriptions.map((px, idx) => (
                  <div key={idx} className="flex items-start justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all">
                    <div>
                      <p className="font-semibold text-gray-900">{px.medication}</p>
                      <p className="text-sm text-gray-500">{px.dosage} • {px.frequency}</p>
                      <p className="text-xs text-teal-600 mt-1">Prescrit par Dr. {px.doctorId?.firstName} {px.doctorId?.lastName}</p>
                    </div>
                    <Button size="sm" variant="outline"><Download className="h-4 w-4" /></Button>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-4">Aucune prescription trouvée</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader icon={Users}>
              <CardTitle>Votre Équipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {careTeam.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=f0fdfa&color=0d9488`} 
                      className="h-10 w-10 rounded-full" 
                      alt="Doctor"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Dr. {member.firstName} {member.lastName}</p>
                      <p className="text-xs text-gray-500">{member.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-600 to-teal-700 text-white border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Hospital className="h-24 w-24" />
            </div>
            <CardContent className="p-6 relative z-10">
              <h4 className="font-bold text-lg mb-2">Centre de Support</h4>
              <p className="text-teal-50 text-sm mb-4">Besoin d'aide ? Notre équipe est disponible 24/7 pour vos questions médicales.</p>
              <Button size="sm" className="bg-white text-teal-700 hover:bg-teal-50 border-none font-bold">
                Nous Contacter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/patient/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editedInfo)
        });
        if (response.ok) {
          const updatedProfile = await response.json();
          setPatientInfo(updatedProfile);
          setIsEditing(false);
          // Potential toast notification here
        }
      } catch (error) {
        console.error('Error updating patient profile:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Paramètres du Profil</h2>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Modifier le Profil
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1">
            <CardContent className="pt-8 text-center">
              <div className="relative inline-block mb-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${patientInfo?.firstName}+${patientInfo?.lastName}&size=128&background=f0fdfa&color=0d9488`} 
                  className="h-32 w-32 rounded-full border-4 border-teal-50 shadow-sm" 
                  alt="Profile" 
                />
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border hover:bg-gray-50">
                  <UserCircle className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{patientInfo?.firstName} {patientInfo?.lastName}</h3>
              <p className="text-sm text-gray-500 mb-6">{patientInfo?.email}</p>
              
              <div className="space-y-2 pt-6 border-t border-gray-100 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{patientInfo?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{patientInfo?.phone || '+212 600-000000'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{patientInfo?.address || 'Casablanca, Maroc'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader icon={User}>
              <CardTitle>Informations Personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" required>Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={isEditing ? editedInfo.firstName : patientInfo?.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" required>Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={isEditing ? editedInfo.lastName : patientInfo?.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email" required>Email Professionnel</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={isEditing ? editedInfo.email : patientInfo?.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={isEditing ? editedInfo.phone : (patientInfo?.phone || '')}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="+212 600-000000"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Ville</Label>
                  <Input
                    id="address"
                    name="address"
                    value={isEditing ? editedInfo.address : (patientInfo?.address || '')}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Ex: Casablanca"
                  />
                </div>
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    );
  };

  const renderAppointmentBooking = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setAppointmentData(prev => ({ ...prev, [name]: value }));

      if (name === 'date' || name === 'doctorId') {
        const docId = name === 'doctorId' ? value : appointmentData.doctorId;
        const dateVal = name === 'date' ? value : appointmentData.date;
        fetchAvailableSlots(docId, dateVal);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/patient/book-appointment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(appointmentData)
        });
        if (response.ok) {
          alert('Rendez-vous réservé avec succès');
          setAppointmentData({
            doctorId: '',
            date: '',
            time: '',
            reason: ''
          });
          setAvailableSlots([]);
          setActiveTab('Dashboard');
          fetchAppointments();
        }
      } catch (error) {
        console.error('Error booking appointment:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4">
        <Card className="shadow-lg border-teal-100/50">
          <CardHeader icon={CalendarIcon}>
            <CardTitle className="text-xl">Prendre un Rendez-vous</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="doctorId" required>Médecin Spécialiste</Label>
                  <div className="relative">
                    <Select id="doctorId" name="doctorId" value={appointmentData.doctorId} onChange={handleInputChange} required>
                      <option value="">Sélectionner un médecin</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id || doctor._id} value={doctor.id || doctor._id}>
                          Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                        </option>
                      ))}
                    </Select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" required>Date Souhaitée</Label>
                  <Input id="date" name="date" type="date" value={appointmentData.date} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" required>Créneau Horaire</Label>
                  <div className="relative">
                    <Select 
                      id="time" 
                      name="time" 
                      value={appointmentData.time} 
                      onChange={handleInputChange} 
                      disabled={availableSlots.length === 0}
                      required
                    >
                      <option value="">{availableSlots.length > 0 ? 'Choisir une heure' : 'Sélectionnez une date d\'abord'}</option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </Select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="reason">Motif de Consultation</Label>
                  <Input 
                    id="reason" 
                    name="reason" 
                    value={appointmentData.reason} 
                    onChange={handleInputChange} 
                    placeholder="Bref descriptif (e.g. Suivi annuel, fatigue, etc.)"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setActiveTab('Dashboard')}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading} className="px-8 shadow-teal-500/20 shadow-lg">
                  {loading ? 'Réservation...' : 'Confirmer le Rendez-vous'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'} hidden lg:flex flex-col`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="bg-teal-600 p-2 rounded-xl">
                <Hospital className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">LabSys</span>
            </div>
          ) : (
            <div className="bg-teal-600 p-2 rounded-xl mx-auto">
              <Hospital className="h-6 w-6 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-2">
            <NavItem tab="Dashboard" icon={Home} label="Tableau de bord" />
            <NavItem tab="Profile" icon={UserCircle} label="Mon Profil" />
            <NavItem tab="Appointment Booking" icon={CalendarIcon} label="Rendez-vous" />
            <NavItem tab="History" icon={Activity} label="Historique Médical" />
          </ul>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:flex hidden"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 lg:hidden flex gap-2">
              <Hospital className="text-teal-600" /> LabSys
            </h1>
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Système En Ligne
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-gray-900">{patientInfo?.firstName} {patientInfo?.lastName}</span>
              <span className="text-xs text-teal-600 font-medium capitalize">Patient</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-teal-50 border-2 border-white shadow-sm flex items-center justify-center text-teal-700 font-bold overflow-hidden cursor-pointer hover:ring-2 hover:ring-teal-100 transition-all">
              <img src={`https://ui-avatars.com/api/?name=${patientInfo?.firstName}+${patientInfo?.lastName}&background=f0fdfa&color=0d9488`} alt="User" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bonjour, {patientInfo?.firstName}! 👋</h2>
                <p className="text-gray-500 mt-1">Gérez votre santé et vos rendez-vous en toute simplicité.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="hidden sm:flex">
                  <Bell className="h-4 w-4 mr-2" /> Notifications
                </Button>
                <Button onClick={() => setActiveTab('Appointment Booking')}>
                  <Plus className="h-4 w-4 mr-2" /> Nouveau Rendez-vous
                </Button>
              </div>
            </div>

            {loading && (
              <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-teal-700 font-medium">Chargement...</p>
                </div>
              </div>
            )}

            <div className="animate-in fade-in duration-700">
              {activeTab === 'Dashboard' && renderDashboard()}
              {activeTab === 'Profile' && renderProfile()}
              {activeTab === 'Appointment Booking' && renderAppointmentBooking()}
              {activeTab === 'History' && (
                <div className="text-center py-20">
                  <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Historique Médical</h3>
                  <p className="text-gray-500">Bientôt disponible dans votre espace.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
