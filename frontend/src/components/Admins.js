import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, FileText, Users, ChevronDown, Home, UserCircle, Hospital, Stethoscope, Activity, UserPlus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut, apiDelete, cachedGet } from '../services/api';

const Button = ({ children, variant = 'primary', className = '', ...props }) => (
  <button
    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
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
  <div className={`bg-white rounded-xl shadow-lg ${className}`}>
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
  const [editingAnalysisId, setEditingAnalysisId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [hospitalCapacity] = useState(10000);
  const navigate = useNavigate();

  // Memoized occupancy rate
  const occupancyRate = useMemo(() => {
    if (!hospitalCapacity) return '0.00';
    return ((totalPatients / hospitalCapacity) * 100).toFixed(2);
  }, [totalPatients, hospitalCapacity]);

  // Handlers (useCallback for stable references)
  const handleNewUserChange = useCallback((e) => {
    const { name, value } = e.target; setNewUser(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCreateUser = useCallback(async (e) => {
    e.preventDefault();
    if (!newUser.username || (!editingUserId && !newUser.password)) { alert("Nom d'utilisateur et mot de passe requis"); return; }
    try {
      if (editingUserId) {
        await updateUser(editingUserId, newUser);
        setEditingUserId(null);
      } else {
        await createUser(newUser);
      }
      setNewUser({ username: '', password: '', role: 'TECHNICIAN' });
    } catch (err) { console.error('handleCreateUser error', err); }
  }, [newUser, editingUserId]);

  const handleNewAnalysisChange = useCallback((e) => {
    const { name, value } = e.target; setNewAnalysis(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCreateAnalysis = useCallback(async (e) => {
    e.preventDefault(); if (!newAnalysis.patientId || !newAnalysis.doctorName) { alert('patientId et doctorName requis'); return; }
    const typeIds = Array.isArray(newAnalysis.analysisTypeIds) ? newAnalysis.analysisTypeIds.map(Number) : [];
    try {
      if (editingAnalysisId) {
        await updateAnalysis(editingAnalysisId, { patientId: Number(newAnalysis.patientId), doctorName: newAnalysis.doctorName, analysisTypeIds: typeIds });
        setEditingAnalysisId(null);
      } else {
        await createAnalysis({ patientId: Number(newAnalysis.patientId), doctorName: newAnalysis.doctorName, analysisTypeIds: typeIds });
      }
      setNewAnalysis({ patientId: '', doctorName: '', analysisTypeIds: [] });
    } catch (err) { console.error('handleCreateAnalysis error', err); }
  }, [newAnalysis, editingAnalysisId]);

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
      const data = await apiGet('/analyses');
      setAnalyses(Array.isArray(data) ? data : []);
    } catch (err) { console.error('Error fetching analyses:', err); }
  }; 

  const fetchAnalysisTypes = async () => {
    try {
      const data = await apiGet('/analyses/types');
      setAnalysisTypes(Array.isArray(data) ? data : []);
    } catch (err) { console.error('Error fetching analysis types:', err); }
  }; 

  const createUser = async (payload) => {
    try {
      await apiPost('/auth/register', payload);
      alert('Utilisateur créé');
      await fetchUsers();
    } catch (err) { console.error('createUser error', err); alert(err?.message || 'Erreur création utilisateur'); }
  }; 

  const updateUser = async (id, payload) => {
    try {
      await apiPut(`/users/${id}`, payload);
      alert('Utilisateur mis à jour');
      await fetchUsers();
    } catch (err) { console.error('updateUser error', err); alert(err?.message || 'Erreur update utilisateur'); }
  }; 

  const deleteUser = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await apiDelete(`/users/${id}`);
      alert('Utilisateur supprimé');
      await fetchUsers();
    } catch (err) { console.error('deleteUser error', err); alert(err?.message || 'Erreur suppression utilisateur'); }
  };

  const createAnalysis = async (payload) => {
    try {
      await apiPost('/analyses', payload);
      alert("Demande d'analyse créée");
      await fetchAnalyses();
    } catch (err) { console.error('createAnalysis error', err); alert(err?.message || 'Erreur création analyse'); }
  }; 

  const updateAnalysis = async (id, payload) => {
    try {
      await apiPut(`/analyses/${id}`, payload);
      alert('Analyse mise à jour');
      await fetchAnalyses();
    } catch (err) { console.error('updateAnalysis error', err); alert(err?.message || 'Erreur update analyse'); }
  }; 

  const deleteAnalysis = async (id) => {
    if (!window.confirm("Supprimer cette demande d'analyse ?")) return;
    try {
      await apiDelete(`/analyses/${id}`);
      alert('Analyse supprimée');
      await fetchAnalyses();
    } catch (err) { console.error('deleteAnalysis error', err); alert(err?.message || 'Erreur suppression analyse'); }
  }; 

  const fetchAdminProfile = async () => {
    try {
      const users = await apiGet('/users');
      const username = localStorage.getItem('username');
      const me = Array.isArray(users) ? users.find(u => u.username === username) : null;
      setAdminInfo(me);
      setEditedInfo(me || {});
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  }; 

  const fetchDashboardStats = async () => {
    try {
      const data = await cachedGet('/dashboard/stats');
      setStats(data);
      if (data?.overview?.totalPatients) setTotalPatients(data.overview.totalPatients);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  }; 

  const fetchRecentActivity = async () => {
    try {
      const data = await apiGet('/dashboard/recent-activity', { limit: 10 });
      setRecentActivity(data || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  }; 

  const fetchUsers = async () => {
    try {
      const data = await apiGet('/users');
      const doctors = Array.isArray(data) ? data.filter(u => u.role === 'MEDECIN') : [];
      setDoctorOverview(doctors);
      setTotalDoctors(doctors.length);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }; 

  const fetchPatients = async () => {
    try {
      const data = await apiGet('/patients');
      if (!stats?.overview?.totalPatients) setTotalPatients(Array.isArray(data) ? data.length : 0);
      setPatientOverview(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  }; 

  const renderDashboard = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader icon={Stethoscope}>
              <CardTitle className="text-sm font-medium">Total médecins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDoctors}</div>
              <p className="text-xs text-gray-500">Personnel médical actif</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader icon={Users}>
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-gray-500">Actuellement hospitalisés</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader icon={Activity}>
              <CardTitle className="text-sm font-medium">Hospital Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-gray-500">Taux d'occupation</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader icon={Stethoscope}>
              <CardTitle className="text-sm font-medium">Aperçu des médecins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctorOverview.length}</div>
              <p className="text-xs text-gray-500">Total médecins on staff</p>
            </CardContent>
            <CardFooter className="p-2">
              <Button 
                variant="ghost" 
                className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
                onClick={() => setShowDoctors(!showDoctors)}
              >
                {showDoctors ? "Masquer" : "Voir tous"} Doctors
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
              <CardTitle className="text-sm font-medium">Aperçu des patients</CardTitle>
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
                {showPatients ? "Masquer" : "Voir tous"} Patients
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
              <CardTitle>Activité récente</CardTitle>
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
                      <span>Nouveau médecin recruté</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-teal-200" />
                      <span>Pas d'activité récente</span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tâches à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-teal-200" />
                  <span>Revue de performance du personnel - Semaine prochaine</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-teal-200" />
                  <span>Mettre à jour les politiques - Dans 3 jours</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-teal-200" />
                  <span>Réunion des chefs de service - Demain, 10h00</span>
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
      return <div>Chargement du profil...</div>;
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
              <Button onClick={handleSave} className="mr-2">Enregistrer</Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">Annuler</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="ml-auto">Modifier le profil</Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  const renderUsers = () => {
    // handlers moved to top-level (stable via useCallback)

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
                    <Button type="submit">Mettre à jour</Button>
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
    // handlers moved to top-level (stable via useCallback)

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
                {editingAnalysisId ? (
                  <>
                    <Button type="submit">Mettre à jour</Button>
                    <Button type="button" variant="ghost" onClick={() => { setEditingAnalysisId(null); setNewAnalysis({ patientId: '', doctorName: '', analysisTypeIds: [] }); }} className="ml-2">Annuler</Button>
                  </>
                ) : (
                  <Button type="submit">Créer demande</Button>
                )}
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
                    <Button variant="outline" onClick={() => { setEditingAnalysisId(a.id); setNewAnalysis({ patientId: a.patientId?.toString() ?? '', doctorName: a.doctorName ?? '', analysisTypeIds: Array.isArray(a.analysisTypeIds) ? a.analysisTypeIds.map(id => id.toString()) : [] }); }}>Modifier</Button>
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
          <span className="font-bold text-xl">Laboratoire Médicale</span>
        </div>
        <Button variant="outline" onClick={() => navigate('/')}>Déconnexion</Button>
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
        <h1 className="text-4xl font-bold text-white mb-8"> Bienvenue, {adminInfo ? `${adminInfo.firstName || adminInfo.username || ''} ${adminInfo.lastName || ''}` : 'Admin'}</h1>
        {activeTab === 'Tableau de bord' && renderDashboard()}
        {activeTab === 'Profil' && renderProfile()}
        {activeTab === 'Utilisateurs' && renderUsers()}
        {activeTab === 'Analyses' && renderAnalyses()}
      </main>
    </div>
  );
}