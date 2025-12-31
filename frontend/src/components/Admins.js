import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Users, ChevronDown, Home, UserCircle, Hospital, Stethoscope, Activity, UserPlus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Button = ({ children, variant = 'primary', className = '', ...props }) => (
  <button
    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      variant === 'primary'
        ? 'text-white bg-teal-600 hover:bg-teal-700 focus:ring-teal-500'
        : variant === 'outline'
        ? 'text-teal-600 border-teal-600 hover:bg-teal-50 focus:ring-teal-500'
        : 'text-teal-600 border-teal-600 hover:bg-teal-50 focus:ring-teal-500'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, icon: Icon }) => (
  <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
    {children}
    {Icon && <Icon className="h-5 w-5 text-teal-600 ml-2" />}
  </div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-lg leading-6 font-medium text-gray-900">{children}</h3>
);

const CardContent = ({ children }) => (
  <div className="px-4 py-5 sm:p-6">{children}</div>
);

const CardFooter = ({ children }) => (
  <div className="px-4 py-4 sm:px-6">{children}</div>
);

const Input = ({ ...props }) => (
  <input
    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-1 h-6"
    {...props}
  />
);

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {children}
  </label>
);

const Select = ({ children, ...props }) => (
  <select
    className="mt-1 block w-full pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
    {...props}
  >
    {children}
  </select>
);

export default function AdminDashboard() {
  const [showDoctors, setShowDoctors] = useState(false);
  const [showPatients, setShowPatients] = useState(false);
  const [activeTab, setActiveTab] = useState('Tableau de bord');
  const [isEditing, setIsEditing] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState(null);
  
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [doctorOverview, setDoctorOverview] = useState([]);
  const [patientOverview, setPatientOverview] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [users, setUsers] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [analysisTypes, setAnalysisTypes] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'TECHNICIAN' });
  const [newAnalysis, setNewAnalysis] = useState({ patientId: '', doctorName: '', analysisTypeIds: [] });
  const [editingUserId, setEditingUserId] = useState(null);
  const [hospitalCapacity] = useState(10000);
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchAdminProfile();
    fetchDashboardStats();
    fetchRecentActivity();
    fetchUsers();
    fetchPatients();
    fetchAnalyses();
    fetchAnalysisTypes();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/analyses`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setAnalyses(Array.isArray(data) ? data : []);
      } else console.error('Failed to fetch analyses');
    } catch (err) { console.error('Error fetching analyses:', err); }
  };

  const fetchAnalysisTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/analyses/types`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setAnalysisTypes(Array.isArray(data) ? data : []);
      } else console.error('Failed to fetch analysis types');
    } catch (err) { console.error('Error fetching analysis types:', err); }
  };

  const createUser = async (payload) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { alert('Authentification requise'); return; }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Utilisateur créé');
        await fetchUsers();
      } else {
        const err = await res.json(); alert(err.error || 'Erreur création utilisateur');
      }
    } catch (err) { console.error(err); alert('Erreur création utilisateur'); }
  };

  const updateUser = async (id, payload) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { alert('Authentification requise'); return; }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) { alert('Utilisateur mis à jour'); await fetchUsers(); } else { const e = await res.json(); alert(e.error || 'Erreur update'); }
    } catch (err) { console.error(err); alert('Erreur update utilisateur'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) { alert('Authentification requise'); return; }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/users/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { alert('Utilisateur supprimé'); await fetchUsers(); } else { const e = await res.json(); alert(e.error || 'Erreur suppression'); }
    } catch (err) { console.error(err); alert('Erreur suppression utilisateur'); }
  };

  const createAnalysis = async (payload) => {
    try {
      const token = localStorage.getItem('token'); if (!token) { alert('Authentification requise'); return; }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/analyses`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) { alert('Demande d\'analyse créée'); await fetchAnalyses(); } else { const e = await res.json(); alert(e.error || 'Erreur création analyse'); }
    } catch (err) { console.error(err); alert('Erreur création analyse'); }
  };

  const updateAnalysis = async (id, payload) => {
    try {
      const token = localStorage.getItem('token'); if (!token) { alert('Authentification requise'); return; }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/analyses/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) { alert('Analyse mise à jour'); await fetchAnalyses(); } else { const e = await res.json(); alert(e.error || 'Erreur update analyse'); }
    } catch (err) { console.error(err); alert('Erreur update analyse'); }
  };

  const deleteAnalysis = async (id) => {
    if (!window.confirm('Supprimer cette demande d\'analyse ?')) return;
    try {
      const token = localStorage.getItem('token'); if (!token) { alert('Authentification requise'); return; }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/analyses/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { alert('Analyse supprimée'); await fetchAnalyses(); } else { const e = await res.json(); alert(e.error || 'Erreur suppression'); }
    } catch (err) { console.error(err); alert('Erreur suppression analyse'); }
  };

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Handle not authenticated case
        return;
      }
      // Backend exposes users; fetch all users and find current by username
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const users = await response.json();
        const username = localStorage.getItem('username');
        const me = Array.isArray(users) ? users.find(u => u.username === username) : null;
        setAdminInfo(me);
        setEditedInfo(me || {});
      } else {
        console.error('Failed to fetch admin profile');
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        if (data?.overview?.totalPatients) setTotalPatients(data.overview.totalPatients);
      } else {
        console.error('Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/dashboard/recent-activity?limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data || []);
      } else {
        console.error('Failed to fetch recent activity');
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const doctors = Array.isArray(data) ? data.filter(u => u.role === 'MEDECIN') : [];
        setDoctorOverview(doctors);
        setTotalDoctors(doctors.length);
        setUsers(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/patients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (!stats?.overview?.totalPatients) setTotalPatients(Array.isArray(data) ? data.length : 0);
        setPatientOverview(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const renderDashboard = () => {
    const occupancyRate = ((totalPatients / hospitalCapacity) * 100).toFixed(2);
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader icon={Stethoscope}>
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDoctors}</div>
              <p className="text-xs text-gray-500">Active medical staff</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader icon={Users}>
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-gray-500">Currently admitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader icon={Activity}>
              <CardTitle className="text-sm font-medium">Hospital Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-gray-500">Bed occupancy rate</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader icon={Stethoscope}>
              <CardTitle className="text-sm font-medium">Doctor Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctorOverview.length}</div>
              <p className="text-xs text-gray-500">Total doctors on staff</p>
            </CardContent>
            <CardFooter className="p-2">
              <Button 
                variant="ghost" 
                className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
                onClick={() => setShowDoctors(!showDoctors)}
              >
                {showDoctors ? "Hide" : "View All"} Doctors
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showDoctors ? "rotate-180" : ""}`} />
              </Button>
            </CardFooter>
            {showDoctors && (
              <div className="px-4 pb-4">
                {doctorOverview.map((doctor, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-t">
                    <div>
                      <p className="text-sm font-medium">{doctor.username || doctor.name || `${doctor.firstName || ''} ${doctor.lastName || ''}`}</p>
                      <p className="text-xs text-gray-500">{doctor.specialty || doctor.role || ''}</p>
                    </div>
                    <p className="text-sm">{doctor.patients || doctor.patientCount || ''} patients</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <CardHeader icon={Users}>
              <CardTitle className="text-sm font-medium">Patient Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientOverview.length}</div>
              <p className="text-xs text-gray-500">Total admitted patients</p>
            </CardContent>
            <CardFooter className="p-2">
              <Button 
                variant="ghost" 
                className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
                onClick={() => setShowPatients(!showPatients)}
              >
                {showPatients ? "Hide" : "View All"} Patients
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showPatients ? "rotate-180" : ""}`} />
              </Button>
            </CardFooter>
            {showPatients && (
              <div className="px-4 pb-4">
                {patientOverview.map((patient, index) => (
                  <div key={index} className="py-2 border-t">
                    <p className="text-sm font-medium">{patient.fullName || patient.name || patient.username || ''}</p>
                    <p className="text-xs text-gray-500">
                      Total Appointments: {patient.appointments || patient.appointmentCount || '-'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recentActivity && recentActivity.length > 0 ? (
                  recentActivity.map((item, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-teal-200" />
                      <span>{item.message || item.title || JSON.stringify(item)}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-center space-x-2">
                      <UserPlus className="h-4 w-4 text-teal-200" />
                      <span>New doctor onboarded</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-teal-200" />
                      <span>No recent activity</span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-teal-200" />
                  <span>Staff performance review - Next week</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-teal-200" />
                  <span>Update hospital policies - Due in 3 days</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-teal-200" />
                  <span>Department heads meeting - Tomorrow, 10:00 AM</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  const renderProfile = () => {
    if (!adminInfo) {
      return <div>Loading profile...</div>;
    }

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
          // Update user using /users/{id}; if we don't have id, fetch users to find it
          let userId = adminInfo?.id;
          if (!userId) {
            const usersResp = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/users`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (usersResp.ok) {
              const users = await usersResp.json();
              const username = localStorage.getItem('username');
              const me = Array.isArray(users) ? users.find(u => u.username === username) : null;
              userId = me?.id;
            }
          }
          if (!userId) {
            alert('Unable to determine user id for update');
            return;
          }
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(editedInfo)
          });
          if (response.ok) {
            const updated = await response.json();
            setAdminInfo(updated);
            setIsEditing(false);
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
          }
      } catch (error) {
        alert('An error occurred. Please try again.');
      }
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={isEditing ? editedInfo.firstName : adminInfo.firstName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={isEditing ? editedInfo.lastName : adminInfo.lastName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={isEditing ? editedInfo.email : adminInfo.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="mr-2">Save</Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="ml-auto">Edit Profile</Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  const renderUsers = () => {
    const handleNewUserChange = (e) => {
      const { name, value } = e.target; setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateUser = async (e) => {
      e.preventDefault();
      if (!newUser.username || !newUser.password) { alert('Nom d\'utilisateur et mot de passe requis'); return; }
      if (editingUserId) {
        await updateUser(editingUserId, newUser);
        setEditingUserId(null);
      } else {
        await createUser(newUser);
      }
      setNewUser({ username: '', password: '', role: 'TECHNICIAN' });
    };

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gérer les utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input name="username" placeholder="Nom d'utilisateur" value={newUser.username} onChange={handleNewUserChange} />
              <Input name="password" placeholder="Mot de passe" type="password" value={newUser.password} onChange={handleNewUserChange} />
              <Select name="role" value={newUser.role} onChange={handleNewUserChange}>
                <option value="ADMIN">ADMIN</option>
                <option value="TECHNICIAN">TECHNICIAN</option>
                <option value="MEDECIN">MEDECIN</option>
                <option value="SECRETARY">SECRETARY</option>
              </Select>
              <div className="md:col-span-3 text-right">
                {editingUserId ? (
                  <>
                    <Button type="submit">Enregistrer</Button>
                    <Button type="button" variant="ghost" onClick={() => { setEditingUserId(null); setNewUser({ username: '', password: '', role: 'TECHNICIAN' }); }} className="ml-2">Annuler</Button>
                  </>
                ) : (
                  <Button type="submit">Créer l'utilisateur</Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <div className="font-medium">{u.username}</div>
                    <div className="text-xs text-gray-500">Rôle: {u.role}</div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => { setEditingUserId(u.id); const copy = { username: u.username, role: u.role }; setNewUser(copy); }}>Modifier</Button>
                    <Button variant="ghost" onClick={() => deleteUser(u.id)}>Supprimer</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAnalyses = () => {
    const handleNewAnalysisChange = (e) => {
      const { name, value } = e.target; setNewAnalysis(prev => ({ ...prev, [name]: value }));
    };
    const handleCreateAnalysis = (e) => { e.preventDefault(); if (!newAnalysis.patientId || !newAnalysis.doctorName) { alert('patientId et doctorName requis'); return; } createAnalysis({ patientId: Number(newAnalysis.patientId), doctorName: newAnalysis.doctorName, analysisTypeIds: newAnalysis.analysisTypeIds.map(Number) }); setNewAnalysis({ patientId: '', doctorName: '', analysisTypeIds: [] }); };

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gérer les analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAnalysis} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input name="patientId" placeholder="ID du patient" value={newAnalysis.patientId} onChange={handleNewAnalysisChange} />
              <Input name="doctorName" placeholder="Nom du médecin" value={newAnalysis.doctorName} onChange={handleNewAnalysisChange} />
              <Select name="analysisTypeIds" multiple value={newAnalysis.analysisTypeIds} onChange={(e) => setNewAnalysis(prev => ({ ...prev, analysisTypeIds: Array.from(e.target.selectedOptions).map(o => o.value) }))}>
                {analysisTypes.map(t => (<option key={t.name || t.id} value={t.id || t.name}>{t.name}</option>))}
              </Select>
              <div className="md:col-span-3 text-right">
                <Button type="submit">Créer demande</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des demandes d'analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analyses.map(a => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <div className="font-medium">Demande #{a.id} — Patient: {a.patientId}</div>
                    <div className="text-xs text-gray-500">Statut: {a.status || '-'}</div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => updateAnalysis(a.id, a)}>Modifier</Button>
                    <Button variant="ghost" onClick={() => deleteAnalysis(a.id)}>Supprimer</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Removed legacy add-doctor and add-admin UI; use 'Utilisateurs' tab to manage users.

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-800">
      <header className="bg-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Hospital className="h-6 w-6 text-teal-600" />
          <span className="font-bold text-xl">Hospital Management System</span>
        </div>
        <Button variant="outline" onClick={() => navigate('/')}>Sign Out</Button>
      </header>
      <nav className="bg-teal-800 text-white p-4">
        <ul className="flex space-x-4 justify-center">
          <li>
            <Button
              variant={activeTab === 'Tableau de bord' ? "outline" : "ghost"}
              className={`hover:bg-white hover:text-teal-700 ${activeTab === 'Tableau de bord' ? 'bg-white text-teal-700' : 'text-white'}`}
              onClick={() => setActiveTab('Tableau de bord')}
            >
              <Home className="w-4 h-4 mr-2" />
              Tableau de bord
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'Profil' ? "outline" : "ghost"}
              className={`hover:bg-white hover:text-teal-700 ${activeTab === 'Profil' ? 'bg-white text-teal-700' : 'text-white'}`}
              onClick={() => setActiveTab('Profil')}
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Profil
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'Utilisateurs' ? "outline" : "ghost"}
              className={`hover:bg-white hover:text-teal-700 ${activeTab === 'Utilisateurs' ? 'bg-white text-teal-700' : 'text-white'}`}
              onClick={() => setActiveTab('Utilisateurs')}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Utilisateurs
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'Analyses' ? "outline" : "ghost"}
              className={`hover:bg-white hover:text-teal-700 ${activeTab === 'Analyses' ? 'bg-white text-teal-700' : 'text-white'}`}
              onClick={() => setActiveTab('Analyses')}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Analyses
            </Button>
          </li>
        </ul>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Laboratoire Médicale — Bienvenue, {adminInfo ? `${adminInfo.firstName || adminInfo.username || ''} ${adminInfo.lastName || ''}` : 'Admin'}</h1>
        {activeTab === 'Tableau de bord' && renderDashboard()}
        {activeTab === 'Profil' && renderProfile()}
        {activeTab === 'Utilisateurs' && renderUsers()}
        {activeTab === 'Analyses' && renderAnalyses()}
      </main>
    </div>
  );
}