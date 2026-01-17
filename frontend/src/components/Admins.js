import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FileText, Users, ChevronDown, Home, UserCircle, Hospital, Stethoscope, Activity, UserPlus, ShieldCheck, LogOut, Menu, X, Trash2, Edit, Search, Plus, TrendingUp, Clock, Download, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete, cachedGet } from '../services/api';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
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
    {Icon && <Icon className="h-5 w-5 text-gray-400" />}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-semibold text-gray-900 ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl ${className}`}>{children}</div>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor, required = false }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const Select = ({ children, className = '', ...props }) => (
  <select
    className={`w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white ${className}`}
    {...props}
  >
    {children}
  </select>
);

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button onClick={onClose} variant="secondary" disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={onConfirm} variant="danger" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'teal' }) => {
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <Card hover>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">{trendValue}</span>
                <span className="text-gray-500">vs le mois dernier</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Table = ({ columns, data, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          {columns.map((col, idx) => (
            <th key={idx} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {col.header}
            </th>
          ))}
          {(onEdit || onDelete) && (
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {(data || []).map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50 transition-colors">
            {columns.map((col, colIdx) => (
              <td key={colIdx} className="px-6 py-4 text-sm text-gray-900">
                {col.render ? col.render(row) : row[col.accessor]}
              </td>
            ))}
            {(onEdit || onDelete) && (
              <td className="px-6 py-4 text-right text-sm">
                <div className="flex items-center justify-end gap-2">
                  {onEdit && (
                    <Button size="sm" variant="ghost" onClick={() => onEdit(row)} className="p-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button size="sm" variant="ghost" onClick={() => onDelete(row)} className="p-2 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
    {(data || []).length === 0 && (
      <div className="text-center py-12 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>Aucune donnée disponible</p>
      </div>
    )}
  </div>
);

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <Activity className="h-5 w-5 text-green-600" />,
    error: <X className="h-5 w-5 text-red-600" />,
    info: <FileText className="h-5 w-5 text-blue-600" />
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 right-4 z-[100] animate-slide-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[type]} min-w-[300px] max-w-md`}>
        {icons[type]}
        <p className="flex-1 font-medium">{message}</p>
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [users, setUsers] = useState(null);
  const [analyses, setAnalyses] = useState(null);
  const [analysisTypes, setAnalysisTypes] = useState(null);
  const [patients, setPatients] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'TECHNICIAN' });
  const [newAnalysis, setNewAnalysis] = useState({ patientId: '', doctorName: '', analysisTypeIds: [] });
  const [newPatient, setNewPatient] = useState({ fullName: '', dateOfBirth: '', gender: 'M', address: '', phone: '', email: '', cin: '' });
  const [newAnalysisType, setNewAnalysisType] = useState({ name: '', unit: '', reference_min: '', reference_max: '', price: '' });
  const [editingAnalysisId, setEditingAnalysisId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [editingAnalysisTypeId, setEditingAnalysisTypeId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, id: null, isLoading: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Submission loading flags (mirrors Secretary UI)
  const [isSubmittingPatient, setIsSubmittingPatient] = useState(false);
  const [isSubmittingAnalysis, setIsSubmittingAnalysis] = useState(false);
  const [isSubmittingAnalysisType, setIsSubmittingAnalysisType] = useState(false);
  const [toast, setToast] = useState(null);
  const [downloadingPdfId, setDownloadingPdfId] = useState(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(false);
  const [isLoadingAnalysisTypes, setIsLoadingAnalysisTypes] = useState(false);
  const [isLoadingDashboardStats, setIsLoadingDashboardStats] = useState(false);
  const [results, setResults] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const navigate = useNavigate();

  // Memoized stats
  const pendingAnalyses = useMemo(() => 
    (analyses || []).filter(a => a.status === 'PENDING' || a.status === 'EN_ATTENTE').length,
    [analyses]
  );

  const completedAnalyses = useMemo(() => 
    (analyses || []).filter(a => a.status === 'COMPLETE' || a.status === 'COMPLÉTÉ').length,
    [analyses]
  );

  const filteredUsers = useMemo(() => 
    (users || []).filter(u => 
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [users, searchTerm]
  );

  // Fetch functions
  const fetchAdminProfile = async () => {
    try {
      const profile = await apiGet('/auth/profile');
      setAdminInfo(profile);
      setEditedInfo(profile || {});
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setIsLoadingDashboardStats(true);
      const data = await cachedGet('/dashboard/stats');
      setStats(data);
      if (data?.overview?.totalPatients) setTotalPatients(data.overview.totalPatients);
      if (data?.overview?.totalAnalysisRequests) setTotalAnalyses(data.overview.totalAnalysisRequests);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoadingDashboardStats(false);
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
      setIsLoadingUsers(true);
      const data = await apiGet('/users');
      const doctors = Array.isArray(data) ? data.filter(u => u.role === 'MEDECIN') : [];
      setTotalDoctors(doctors.length);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchPatients = async () => {
    try {
      setIsLoadingPatients(true);
      const data = await apiGet('/patients');
      const patientsList = data?.patients || data || [];
      setPatients(Array.isArray(patientsList) ? patientsList : []);
      if (!stats?.overview?.totalPatients) setTotalPatients(Array.isArray(patientsList) ? patientsList.length : 0);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
      setTotalPatients(0);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const fetchAnalyses = async () => {
    try {
      setIsLoadingAnalyses(true);
      const data = await apiGet('/analyses');
      setAnalyses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching analyses:', err);
    } finally {
      setIsLoadingAnalyses(false);
    }
  };

  const fetchAnalysisTypes = async () => {
    try {
      setIsLoadingAnalysisTypes(true);
      const data = await apiGet('/analyses/types');
      setAnalysisTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching analysis types:', err);
    } finally {
      setIsLoadingAnalysisTypes(false);
    }
  };

  // Handlers (useCallback for stable references)
  const handleNewUserChange = useCallback((e) => {
    const { name, value } = e.target; setNewUser(prev => ({ ...prev, [name]: value }));
  }, []);

  const createUser = async (payload) => {
    try {
      await apiPost('/auth/register', payload);
      showToast('Utilisateur créé', 'success');
      await fetchUsers();
    } catch (err) { console.error('createUser error', err); showToast(err?.message || 'Erreur création utilisateur', 'error'); }
  };  

  const updateUser = async (id, payload) => {
    try {
      await apiPut(`/users/${id}`, payload);
      showToast('Utilisateur mis à jour', 'success');
      await fetchUsers();
    } catch (err) { console.error('updateUser error', err); showToast(err?.message || 'Erreur update utilisateur', 'error'); }
  };

  const handleCreateUser = useCallback(async (e) => {
    e.preventDefault();
    if (!newUser.username || (!editingUserId && !newUser.password)) { showToast("Nom d'utilisateur et mot de passe requis", 'error'); return; }
    try {
      if (editingUserId) {
        await updateUser(editingUserId, newUser);
        setEditingUserId(null);
      } else {
        await createUser(newUser);
      }
      setNewUser({ username: '', password: '', role: 'TECHNICIAN' });
    } catch (err) { console.error('handleCreateUser error', err); }
  }, [newUser, editingUserId, createUser, updateUser]);

  const handleNewAnalysisChange = useCallback((e) => {
    const { name, value } = e.target; setNewAnalysis(prev => ({ ...prev, [name]: value }));
  }, []);

  const createAnalysis = async (payload) => {
    try {
      await apiPost('/analyses', payload);
      showToast("Demande d'analyse créée", 'success');
      await fetchAnalyses();
    } catch (err) { console.error('createAnalysis error', err); showToast(err?.message || 'Erreur création analyse', 'error'); }
  };  

  const updateAnalysis = async (id, payload) => {
    try {
      await apiPut(`/analyses/${id}`, payload);
      showToast('Analyse mise à jour', 'success');
      await fetchAnalyses();
    } catch (err) { console.error('updateAnalysis error', err); showToast(err?.message || 'Erreur update analyse', 'error'); }
  };  

  const handleCreateAnalysis = useCallback(async (e) => {
    e.preventDefault(); if (!newAnalysis.patientId || !newAnalysis.doctorName) { showToast('ID patient et nom du médecin requis', 'error'); return; }
    const typeIds = Array.isArray(newAnalysis.analysisTypeIds) ? newAnalysis.analysisTypeIds.map(Number) : [];
    setIsSubmittingAnalysis(true);
    try {
      if (editingAnalysisId) {
        await updateAnalysis(editingAnalysisId, { patientId: Number(newAnalysis.patientId), doctorName: newAnalysis.doctorName, analysisTypeIds: typeIds });
        setEditingAnalysisId(null);
      } else {
        await createAnalysis({ patientId: Number(newAnalysis.patientId), doctorName: newAnalysis.doctorName, analysisTypeIds: typeIds });
      }
      setNewAnalysis({ patientId: '', doctorName: '', analysisTypeIds: [] });
    } catch (err) { console.error('handleCreateAnalysis error', err); }
    finally { setIsSubmittingAnalysis(false); }
  }, [newAnalysis, editingAnalysisId, createAnalysis, updateAnalysis]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadEssentialData = async () => {
      try {
        setIsLoading(true);
        // On mount, only load profile and the current tab's data (initially dashboard)
        await fetchAdminProfile();
        
        if (activeTab === 'dashboard') {
          await Promise.all([fetchDashboardStats(), fetchRecentActivity()]);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEssentialData();
  }, []);

  // Lazy load tab data
  useEffect(() => {
    if (isLoading) return;

    const loadTabData = async () => {
      try {
        switch (activeTab) {
          case 'dashboard':
            // Already loaded by initial effect, but refresh anyway if user comes back?
            // User can use refresh button. We'll skip for now to save speed.
            break;
          case 'users':
            if (users === null) await fetchUsers();
            break;
          case 'patients':
            if (patients === null) await fetchPatients();
            break;
          case 'analyses':
            // Needs patients and types for the creation form
            const promises = [fetchAnalyses()];
            if (patients === null) promises.push(fetchPatients());
            if (analysisTypes === null) promises.push(fetchAnalysisTypes());
            await Promise.all(promises);
            break;
          case 'results':
            // Results table needs users for the names
            const resPromises = [fetchResults()];
            if (users === null) resPromises.push(fetchUsers());
            await Promise.all(resPromises);
            break;
          case 'analysis-types':
            if (analysisTypes === null) await fetchAnalysisTypes();
            break;
          default:
            break;
        }
      } catch (error) {
        showToast('Échec de l\'actualisation', 'error');
        console.error(`Error loading data for tab ${activeTab}:`, error);
      }
    };

    loadTabData();
  }, [activeTab, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps



  const deleteUser = async (id) => {
    setConfirmModal({ isOpen: true, type: 'user', id, isLoading: false });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = confirmModal;
    setConfirmModal(prev => ({ ...prev, isLoading: true }));

    try {
      if (type === 'user') {
        await apiDelete(`/users/${id}`);
        showToast('Utilisateur supprimé', 'success');
        await fetchUsers();
      } else if (type === 'patient') {
        await apiDelete(`/patients/${id}`);
        showToast('Patient supprimé', 'success');
        await fetchPatients();
      } else if (type === 'analysis') {
        await apiDelete(`/analyses/${id}`);
        showToast('Analyse supprimée', 'success');
        await fetchAnalyses();
      } else if (type === 'analysisType') {
        await apiDelete(`/analyses/types/${id}`);
        showToast("Type d'analyse supprimé", 'success');
        await fetchAnalysisTypes();
      }
      setConfirmModal({ isOpen: false, type: null, id: null, isLoading: false });
    } catch (err) {
      console.error('Delete error', err);
      showToast(err?.message || 'Erreur suppression', 'error');
      setConfirmModal(prev => ({ ...prev, isLoading: false }));
    }
  };



  const deleteAnalysis = async (id) => {
    setConfirmModal({ isOpen: true, type: 'analysis', id, isLoading: false });
  };

  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tableau de bord</h2>
            <p className="text-sm text-gray-500">Vue d'ensemble de l'activité du laboratoire</p>
          </div>
          <Button 
            variant="outline" 
            size="md" 
            onClick={async () => {
              setIsLoadingDashboardStats(true);
              await Promise.all([fetchDashboardStats(), fetchRecentActivity()]);
              setIsLoadingDashboardStats(false);
            }}
            disabled={isLoadingDashboardStats}
          >
            <RefreshCw className={`h-6 w-6 mr-2 ${isLoadingDashboardStats ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Médecins"
            value={totalDoctors}
            icon={Stethoscope}
            color="teal"
            trend
            trendValue="+12%"
          />
          <StatCard
            title="Total Patients"
            value={totalPatients}
            icon={Users}
            color="green"
            trend
            trendValue="+8%"
          />
          <StatCard
            title="Analyses en Attente"
            value={pendingAnalyses}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Total Analyses"
            value={totalAnalyses}
            icon={Activity}
            color="purple"
            trend
            trendValue="+15%"
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="primary" 
                className="w-full justify-center"
                onClick={() => setActiveTab('users')}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Ajouter Utilisateur
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-center"
                onClick={() => setActiveTab('analyses')}
              >
                <FileText className="h-5 w-5 mr-2" />
                Créer Analyse
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-center"
                onClick={() => navigate('/patients')}
              >
                <Users className="h-5 w-5 mr-2" />
                Voir Patients
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity && recentActivity.length > 0 ? (
                  recentActivity.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.message || item.title || 'Activity'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.time || 'À l\'instant'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Aucune activité récente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Status */}
          <Card>
            <CardHeader>
              <CardTitle>Aperçu Statut Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-gray-900">En Attente</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">{pendingAnalyses}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Terminées</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{completedAnalyses}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-teal-600" />
                    <span className="font-medium text-gray-900">Total</span>
                  </div>
                  <span className="text-2xl font-bold text-teal-600">{(analyses || []).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Aperçu Système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
                <Users className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">{(users || []).length}</p>
                <p className="text-sm text-gray-600 mt-1">Total Utilisateurs</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <Stethoscope className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">{totalDoctors}</p>
                <p className="text-sm text-gray-600 mt-1">Médecins Actifs</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">{(analysisTypes || []).length}</p>
                <p className="text-sm text-gray-600 mt-1">Types d'Analyses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderProfile = () => {
    if (!adminInfo) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      );
    }

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
      try {
        const updated = await apiPut('/auth/profile', editedInfo);
        setAdminInfo(updated);
        setIsEditing(false);
        showToast('Profil mis à jour avec succès!', 'success');
      } catch (error) {
        showToast(error.message || 'Une erreur est survenue. Veuillez réessayer.', 'error');
      }
    };

    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-teal-100 rounded-full">
                  <UserCircle className="h-12 w-12 text-teal-600" />
                </div>
                <div>
                  <CardTitle>Profil Administrateur</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Gérer les informations de votre compte</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="md" 
                onClick={async () => {
                  setIsRefreshing(true);
                  await fetchAdminProfile();
                  setIsRefreshing(false);
                }}
                disabled={isRefreshing}
                className="h-10 p-0"
              >
                <RefreshCw className={`h-6 w-6 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={isEditing ? (editedInfo?.firstName || '') : (adminInfo.firstName || '')}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={isEditing ? (editedInfo?.lastName || '') : (adminInfo.lastName || '')}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  name="username"
                  value={adminInfo.username || ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={isEditing ? (editedInfo?.email || '') : (adminInfo.email || '')}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Input
                  id="role"
                  value={adminInfo.role || ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end gap-3">
              {isEditing ? (
                <>
                  <Button onClick={() => setIsEditing(false)} variant="secondary">
                    Annuler
                  </Button>
                  <Button onClick={handleSave} variant="primary">
                    Enregistrer
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="primary">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le Profil
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  };

  const renderUsers = () => {
    const userColumns = [
      { 
        header: 'Nom d\'utilisateur', 
        accessor: 'username',
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <UserCircle className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{row.username}</p>
              <p className="text-xs text-gray-500">ID: {row.id}</p>
            </div>
          </div>
        )
      },
      { 
        header: 'Role', 
        accessor: 'role',
        render: (row) => {
          const roleColors = {
            ADMIN: 'bg-purple-100 text-purple-700',
            MEDECIN: 'bg-blue-100 text-blue-700',
            TECHNICIAN: 'bg-green-100 text-green-700',
            SECRETARY: 'bg-orange-100 text-orange-700'
          };
          return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[row.role] || 'bg-gray-100 text-gray-700'}`}>
              {row.role}
            </span>
          );
        }
      },
      { 
        header: 'Created At', 
        accessor: 'createdAt',
        render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'
      }
    ];

    return (
      <div className="space-y-6">
        {/* Create/Edit User Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingUserId ? 'Modifier Utilisateur' : 'Créer Nouvel Utilisateur'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username" required>Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Entrer le nom d'utilisateur"
                    value={newUser.username}
                    onChange={handleNewUserChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" required={!editingUserId}>Mot de passe</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={editingUserId ? "Laisser vide pour garder l'actuel" : "Entrer le mot de passe"}
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    required={!editingUserId}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role" required>Rôle</Label>
                <Select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleNewUserChange}
                >
                  <option value="ADMIN">Administrateur</option>
                  <option value="MEDECIN">Médecin</option>
                  <option value="TECHNICIAN">Technicien</option>
                  <option value="SECRETARY">Secrétaire</option>
                </Select>
              </div>
              <div className="flex justify-end gap-3">
                {editingUserId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingUserId(null);
                      setNewUser({ username: '', password: '', role: 'TECHNICIAN' });
                    }}
                  >
                    Annuler
                  </Button>
                )}
                <Button type="submit" variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  {editingUserId ? 'Modifier Utilisateur' : 'Créer Utilisateur'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <CardTitle>Liste des Utilisateurs ({filteredUsers.length})</CardTitle>
                <Button 
                  variant="ghost" 
                  size="md" 
                  onClick={async () => {
                    setIsLoadingUsers(true);
                    await fetchUsers();
                    setIsLoadingUsers(false);
                  }}
                  disabled={isLoadingUsers}
                  className="h-10 p-0"
                >
                  <RefreshCw className={`h-6 w-6 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher des utilisateurs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table
              columns={userColumns}
              data={filteredUsers}
              onEdit={(row) => {
                setEditingUserId(row.id);
                setNewUser({ username: row.username, password: '', role: row.role });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={(row) => deleteUser(row.id)}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAnalyses = () => {
    const analysisColumns = [
      { 
        header: 'ID', 
        accessor: 'id',
        render: (row) => (
          <div className="font-mono text-sm font-medium text-gray-900">
            #{row.id}
          </div>
        )
      },
      { 
        header: 'Patient', 
        accessor: 'patientId',
        render: (row) => {
          const patient = (patients || []).find(p => p.id === row.patientId);
          return (
            <div>
              <p className="font-medium text-gray-900">{patient?.fullName || `Patient #${row.patientId}`}</p>
              <p className="text-xs text-gray-500">ID: {row.patientId}</p>
            </div>
          );
        }
      },
      { 
        header: 'Médecin', 
        accessor: 'doctorName',
        render: (row) => (
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-teal-600" />
            <span className="text-sm text-gray-900">{row.doctorName || '-'}</span>
          </div>
        )
      },
      { 
        header: 'Statut', 
        accessor: 'status',
        render: (row) => {
          const statusConfig = {
            'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En Attente' },
            'EN_ATTENTE': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En Attente' },
            'COMPLETE': { bg: 'bg-green-100', text: 'text-green-700', label: 'Complété' },
            'COMPLÉTÉ': { bg: 'bg-green-100', text: 'text-green-700', label: 'Complété' },
            'VALIDE': { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Validé' }
          };
          const config = statusConfig[row.status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: row.status };

          return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
              {config.label}
            </span>
          );
        }
      },
      {
        header: 'Créé le',
        accessor: 'createdAt',
        render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'
      }
    ];

    return (
      <div className="space-y-6">
        {/* Create/Edit Analysis Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingAnalysisId ? 'Modifier Demande d\'Analyse' : 'Créer Demande d\'Analyse'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAnalysis} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientId" required>Patient</Label>
                  <Select
                    id="patientId"
                    name="patientId"
                    value={newAnalysis.patientId}
                    onChange={handleNewAnalysisChange}
                    required
                  >
                    <option value="">Sélectionner un patient</option>
                    {(patients || []).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.fullName || `Patient #${p.id}`} ({p.cin || p.id})
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="doctorName" required>Nom du Médecin</Label>
                  <Select
                    id="doctorName"
                    name="doctorName"
                    value={newAnalysis.doctorName}
                    onChange={handleNewAnalysisChange}
                    required
                  >
                    <option value="">Sélectionner un médecin</option>
                    {(users || []).filter(u => u.role === 'MEDECIN').map(doctor => (
                      <option key={doctor.id} value={doctor.username}>
                        {doctor.username} {doctor.firstName && doctor.lastName ? `(${doctor.firstName} ${doctor.lastName})` : ''}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="analysisTypeIds">Types d'Analyses</Label>
                <Select
                  id="analysisTypeIds"
                  name="analysisTypeIds"
                  multiple
                  value={newAnalysis.analysisTypeIds}
                  onChange={(e) => setNewAnalysis(prev => ({
                    ...prev,
                    analysisTypeIds: Array.from(e.target.selectedOptions).map(o => o.value)
                  }))}
                  className="h-32"
                >
                  {(analysisTypes || []).map(t => (
                    <option key={t.id || t.name} value={t.id || t.name}>
                      {t.name} {t.price ? `- ${t.price} DH` : ''}
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
              <div className="flex justify-end gap-3">
                {editingAnalysisId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingAnalysisId(null);
                      setNewAnalysis({ patientId: '', doctorName: '', analysisTypeIds: [] });
                    }}
                  >
                    Annuler
                  </Button>
                )}
                <Button type="submit" variant="primary" disabled={isSubmittingAnalysis}>
                  {isSubmittingAnalysis ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {isSubmittingAnalysis ? 'En cours...' : (editingAnalysisId ? 'Modifier Analyse' : 'Créer Analyse')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Analyses List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <CardTitle>Demandes d'Analyses ({(analyses || []).length})</CardTitle>
                <Button 
                  variant="ghost" 
                  size="md" 
                  onClick={async () => {
                    setIsLoadingAnalyses(true);
                    await fetchAnalyses();
                    setIsLoadingAnalyses(false);
                  }}
                  disabled={isLoadingAnalyses}
                  className="h-10 p-0"
                >
                  <RefreshCw className={`h-6 w-6 ${isLoadingAnalyses ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table
              columns={analysisColumns}
              data={analyses}
              onEdit={(row) => {
                setEditingAnalysisId(row.id);
                setNewAnalysis({
                  patientId: row.patientId?.toString() ?? '',
                  doctorName: row.doctorName ?? '',
                  analysisTypeIds: Array.isArray(row.analysisTypeIds) 
                    ? row.analysisTypeIds.map(id => id.toString()) 
                    : []
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={(row) => deleteAnalysis(row.id)}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPatients = () => {
    const patientColumns = [
      {
        header: 'Nom Complet',
        accessor: 'fullName',
        render: (row) => (
          <div>
            <p className="font-medium text-gray-900">{row.fullName}</p>
            <p className="text-xs text-gray-500">CIN: {row.cin}</p>
          </div>
        )
      },
      {
        header: 'Date de Naissance',
        accessor: 'dateOfBirth',
        render: (row) => row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString() : '-'
      },
      {
        header: 'Genre',
        accessor: 'gender',
        render: (row) => (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.gender === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
          }`}>
            {row.gender === 'M' ? 'Masculin' : 'F\u00e9minin'}
          </span>
        )
      },
      { header: 'T\u00e9l\u00e9phone', accessor: 'phone' },
      { header: 'Email', accessor: 'email', render: (row) => row.email || '-' }
    ];

    const handleNewPatientChange = (e) => {
      const { name, value } = e.target;
      setNewPatient(prev => ({ ...prev, [name]: value }));
    };

    const handleCreatePatient = async (e) => {
      e.preventDefault();
      if (!newPatient.fullName || !newPatient.cin || !newPatient.dateOfBirth) {
        showToast('Nom complet, CIN et date de naissance requis', 'error');
        return;
      }
      setIsSubmittingPatient(true);
      try {
        if (editingPatientId) {
          await apiPut(`/patients/${editingPatientId}`, newPatient);
          showToast('Patient mis à jour', 'success');
          setEditingPatientId(null);
        } else {
          await apiPost('/patients', newPatient);
          showToast('Patient créé avec succès', 'success');
        }
        setNewPatient({ fullName: '', dateOfBirth: '', gender: 'M', address: '', phone: '', email: '', cin: '' });
        await fetchPatients();
      } catch (err) {
        console.error('Error creating patient:', err);
        showToast('Erreur lors de la création du patient', 'error');
      } finally {
        setIsSubmittingPatient(false);
      }
    }; 

    const deletePatient = async (id) => {
      setConfirmModal({ isOpen: true, type: 'patient', id, isLoading: false });
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingPatientId ? 'Modifier Patient' : 'Créer Nouveau Patient'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" required>Nom Complet</Label>
                  <Input id="fullName" name="fullName" value={newPatient.fullName} onChange={handleNewPatientChange} required />
                </div>
                <div>
                  <Label htmlFor="cin" required>CIN</Label>
                  <Input id="cin" name="cin" value={newPatient.cin} onChange={handleNewPatientChange} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth" required>Date de Naissance</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" value={newPatient.dateOfBirth} onChange={handleNewPatientChange} required />
                </div>
                <div>
                  <Label htmlFor="gender" required>Genre</Label>
                  <Select id="gender" name="gender" value={newPatient.gender} onChange={handleNewPatientChange}>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" name="phone" value={newPatient.phone} onChange={handleNewPatientChange} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={newPatient.email} onChange={handleNewPatientChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" name="address" value={newPatient.address} onChange={handleNewPatientChange} />
              </div>
              <div className="flex justify-end gap-3">
                {editingPatientId && (
                  <Button type="button" variant="secondary" onClick={() => {
                    setEditingPatientId(null);
                    setNewPatient({ fullName: '', dateOfBirth: '', gender: 'M', address: '', phone: '', email: '', cin: '' });
                  }}>Annuler</Button>
                )}
                <Button type="submit" variant="primary" disabled={isSubmittingPatient}>
                  {isSubmittingPatient ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {isSubmittingPatient ? 'En cours...' : (editingPatientId ? 'Modifier Patient' : 'Créer Patient')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <CardTitle>Liste des Patients ({(patients || []).length})</CardTitle>
                <Button 
                  variant="ghost" 
                  size="md" 
                  onClick={async () => {
                    setIsLoadingPatients(true);
                    await fetchPatients();
                    setIsLoadingPatients(false);
                  }}
                  disabled={isLoadingPatients}
                  className="h-10 p-0"
                >
                  <RefreshCw className={`h-6 w-6 ${isLoadingPatients ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table
              columns={patientColumns}
              data={patients}
              onEdit={(row) => {
                setEditingPatientId(row.id);
                setNewPatient({
                  fullName: row.fullName || '',
                  dateOfBirth: row.dateOfBirth ? row.dateOfBirth.split('T')[0] : '',
                  gender: row.gender || 'M',
                  address: row.address || '',
                  phone: row.phone || '',
                  email: row.email || '',
                  cin: row.cin || ''
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={(row) => deletePatient(row.id)}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  const handleDownloadPDF = async (analysisId) => {
    try {
      setDownloadingPdfId(analysisId);
      const token = localStorage.getItem('token');
      const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${baseUrl}/analyses/${analysisId}/pdf`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Échec du téléchargement du PDF: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) throw new Error('Le PDF généré est vide');

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analyse_${analysisId}_resultat.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (error) {
      console.error('Erreur PDF:', error);
      showToast('Erreur lors du téléchargement du PDF: ' + error.message, 'error');
    } finally {
      setDownloadingPdfId(null);
    }
  };

  const fetchResults = async (params = { page: 1, limit: 100 }) => {
    try {
      setIsLoadingResults(true);
      const data = await apiGet('/analyses/results', params);
      setResults(Array.isArray(data.results) ? data.results : (data.results || []));
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setIsLoadingResults(false);
    }
  };

  const renderResults = () => {
    const resultsColumns = [
      { header: 'ID Analyse', accessor: 'requestId', render: (row) => <div className="font-mono text-sm font-medium text-gray-900">#{row.requestId}</div> },
      { header: 'Patient', accessor: 'patient', render: (row) => {
          const patient = row.request?.patient;
          return (
            <div>
              <p className="font-medium text-gray-900">{patient?.fullName || `Patient #${row.requestId}`}</p>
              <p className="text-xs text-gray-500">CIN: {patient?.cin || '-'}</p>
            </div>
          );
        }
      },
      { header: "Type d'Analyse", accessor: 'analysisType', render: (row) => <span className="text-sm text-gray-900">{row.analysisType?.name || '-'}</span> },
      { header: 'Résultat', accessor: 'value', render: (row) => (
          row.value !== null && row.value !== undefined ? (
            <div className="font-medium text-gray-900">{Number(row.value).toFixed(2)} {row.analysisType?.unit || ''}</div>
          ) : (
            <div className="text-gray-500">-</div>
          )
        )
      },
      { header: 'Référence', render: (row) => row.analysisType ? `${row.analysisType.reference_min} - ${row.analysisType.reference_max} ${row.analysisType.unit || ''}` : '-' },
      { header: 'Mesuré par', render: (row) => {
          const user = (users || []).find(u => u.id === row.measuredBy);
          return user ? `${(user.firstName || '')} ${(user.lastName || '')}`.trim() || user.username : (row.measuredBy ? `#${row.measuredBy}` : '-');
        }
      },
      { header: 'Mesuré le', render: (row) => row.measuredAt ? new Date(row.measuredAt).toLocaleString() : '-' },
      { header: 'Anormal', render: (row) => row.isAbnormal ? <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">Anormal</span> : <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Normal</span> },
      { header: 'Voided', render: (row) => row.isVoided ? <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">Voided</span> : <span className="text-gray-500">-</span> },
      { header: 'Statut', accessor: 'status', render: (row) => {
          const status = (row.request?.status || '').toUpperCase();
          const c = { 'COMPLETE': { bg: 'bg-green-100', text: 'text-green-700', label: 'Complété' }, 'VALIDE': { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Validé' } }[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
          return <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
        }
      },
      { header: 'Date', accessor: 'createdAt', render: (row) => row.request?.createdAt ? new Date(row.request.createdAt).toLocaleDateString() : (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-') },
      { header: 'Actions', accessor: 'actions', render: (row) => {
          const isDownloading = downloadingPdfId === row.requestId;
          return (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="primary" onClick={() => handleDownloadPDF(row.requestId)} disabled={isDownloading} className="whitespace-nowrap">
                {isDownloading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
                {isDownloading ? 'Génération...' : 'PDF'}
              </Button>
            </div>
          );
        }
      }
    ];

    const completedResults = (results || []).filter(r => {
      const s = (r.request?.status || '').toUpperCase();
      return s === 'COMPLETE' || s === 'COMPLÉTÉ' || s === 'VALIDE';
    });

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Résultats</p>
                  <p className="text-3xl font-bold text-gray-900">{completedResults.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-teal-50">
                  <FileText className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <CardTitle>Résultats d'Analyses ({completedResults.length})</CardTitle>
                <Button 
                  variant="ghost" 
                  size="md" 
                  onClick={() => fetchResults()}
                  disabled={isLoadingResults}
                  className="h-10 p-0"
                >
                  <RefreshCw className={`h-6 w-6 ${isLoadingResults ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table columns={resultsColumns} data={completedResults} />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAnalysisTypes = () => {
    const analysisTypeColumns = [
      { header: 'Nom', accessor: 'name' },
      { header: 'Unit\u00e9', accessor: 'unit' },
      { header: 'R\u00e9f\u00e9rence Min', accessor: 'reference_min' },
      { header: 'R\u00e9f\u00e9rence Max', accessor: 'reference_max' },
      { header: 'Prix (DT)', accessor: 'price', render: (row) => `${row.price} DT` }
    ];

    const handleNewAnalysisTypeChange = (e) => {
      const { name, value } = e.target;
      setNewAnalysisType(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateAnalysisType = async (e) => {
      e.preventDefault();
      if (!newAnalysisType.name || !newAnalysisType.unit) {
        showToast('Nom et unité requis', 'error');
        return;
      }
      setIsSubmittingAnalysisType(true);
      try {
        if (editingAnalysisTypeId) {
          await apiPut(`/analyses/types/${editingAnalysisTypeId}`, newAnalysisType);
          showToast("Type d'analyse mis à jour", 'success');
          setEditingAnalysisTypeId(null);
        } else {
          await apiPost('/analyses/types', newAnalysisType);
          showToast("Type d'analyse créé avec succès", 'success');
        }
        setNewAnalysisType({ name: '', unit: '', reference_min: '', reference_max: '', price: '' });
        await fetchAnalysisTypes();
      } catch (err) {
        console.error('Error creating analysis type:', err);
        showToast("Erreur lors de la création du type d'analyse", 'error');
      } finally {
        setIsSubmittingAnalysisType(false);
      }
    }; 

    const deleteAnalysisType = async (id) => {
      setConfirmModal({ isOpen: true, type: 'analysisType', id, isLoading: false });
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingAnalysisTypeId ? "Modifier Type d'Analyse" : "Créer Nouveau Type d'Analyse"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAnalysisType} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" required>Nom de l'analyse</Label>
                  <Input id="name" name="name" value={newAnalysisType.name} onChange={handleNewAnalysisTypeChange} required />
                </div>
                <div>
                  <Label htmlFor="unit" required>Unité</Label>
                  <Input id="unit" name="unit" placeholder="g/L, mg/dL, etc." value={newAnalysisType.unit} onChange={handleNewAnalysisTypeChange} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="reference_min">Référence Min</Label>
                  <Input id="reference_min" name="reference_min" type="number" step="0.01" value={newAnalysisType.reference_min} onChange={handleNewAnalysisTypeChange} />
                </div>
                <div>
                  <Label htmlFor="reference_max">Référence Max</Label>
                  <Input id="reference_max" name="reference_max" type="number" step="0.01" value={newAnalysisType.reference_max} onChange={handleNewAnalysisTypeChange} />
                </div>
                <div>
                  <Label htmlFor="price">Prix (DT)</Label>
                  <Input id="price" name="price" type="number" step="0.01" value={newAnalysisType.price} onChange={handleNewAnalysisTypeChange} />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                {editingAnalysisTypeId && (
                  <Button type="button" variant="secondary" onClick={() => {
                    setEditingAnalysisTypeId(null);
                    setNewAnalysisType({ name: '', unit: '', reference_min: '', reference_max: '', price: '' });
                  }}>Annuler</Button>
                )}
                <Button type="submit" variant="primary" disabled={isSubmittingAnalysisType}>
                  {isSubmittingAnalysisType ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {isSubmittingAnalysisType ? 'En cours...' : (editingAnalysisTypeId ? 'Modifier' : "Créer Type d'Analyse")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <CardTitle>Types d'Analyses ({(analysisTypes || []).length})</CardTitle>
                <Button 
                  variant="ghost" 
                  size="md" 
                  onClick={async () => {
                    setIsLoadingAnalysisTypes(true);
                    await fetchAnalysisTypes();
                    setIsLoadingAnalysisTypes(false);
                  }}
                  disabled={isLoadingAnalysisTypes}
                  className="h-10 p-0"
                >
                  <RefreshCw className={`h-6 w-6 ${isLoadingAnalysisTypes ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table
              columns={analysisTypeColumns}
              data={analysisTypes}
              onEdit={(row) => {
                setEditingAnalysisTypeId(row.id);
                setNewAnalysisType({
                  name: row.name || '',
                  unit: row.unit || '',
                  reference_min: row.reference_min || '',
                  reference_max: row.reference_max || '',
                  price: row.price || ''
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={(row) => deleteAnalysisType(row.id)}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  // Removed legacy add-doctor and add-admin UI; use 'Utilisateurs' tab to manage users.

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'profile', label: 'Profil', icon: UserCircle },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'analyses', label: 'Analyses', icon: FileText },
    { id: 'results', label: 'Résultats', icon: Activity },
    { id: 'analysis-types', label: 'Types d\'Analyses', icon: Stethoscope }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-600 rounded-xl">
                  <Hospital className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Portail Admin</h1>
                  <p className="text-xs text-gray-500">Tableau de bord Admin</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <UserCircle className="h-5 w-5 text-gray-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {adminInfo ? `${adminInfo.firstName || adminInfo.username || 'Admin'}` : 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('username');
                navigate('/');
              }} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex gap-2 overflow-x-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-teal-600 text-teal-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">Chargement des données...</p>
              <p className="text-gray-500 text-sm mt-2">Veuillez patienter</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'patients' && renderPatients()}
            {activeTab === 'analyses' && renderAnalyses()}
            {activeTab === 'results' && renderResults()}
            {activeTab === 'analysis-types' && renderAnalysisTypes()}
          </>
        )}
      </main>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, id: null, isLoading: false })}
        onConfirm={handleConfirmDelete}
        title={
          confirmModal.type === 'user' ? 'Supprimer l\'utilisateur' :
          confirmModal.type === 'patient' ? 'Supprimer le patient' :
          confirmModal.type === 'analysis' ? 'Supprimer l\'analyse' :
          confirmModal.type === 'analysisType' ? 'Supprimer le type d\'analyse' :
          'Supprimer'
        }
        message={
          confirmModal.type === 'user' ? 'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.' :
          confirmModal.type === 'patient' ? 'Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.' :
          confirmModal.type === 'analysis' ? 'Êtes-vous sûr de vouloir supprimer cette analyse ? Cette action est irréversible.' :
          confirmModal.type === 'analysisType' ? 'Êtes-vous sûr de vouloir supprimer ce type d\'analyse ? Cette action est irréversible.' :
          'Êtes-vous sûr ?'
        }
        isLoading={confirmModal.isLoading}
      />
    </div>
  );
}