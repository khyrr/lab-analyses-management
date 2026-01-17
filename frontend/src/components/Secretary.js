import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FileText, Users, Home, UserCircle, Hospital, Activity, UserPlus, LogOut, Menu, X, Trash2, Edit, Search, Plus, TrendingUp, Clock, Stethoscope, Download, Loader2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../services/api';

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
        {data.map((row, idx) => (
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
    {data.length === 0 && (
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

export default function SecretaryDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [secretaryInfo, setSecretaryInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState(null);
  
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [patients, setPatients] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [analysisTypes, setAnalysisTypes] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newPatient, setNewPatient] = useState({ fullName: '', dateOfBirth: '', gender: 'M', address: '', phone: '', email: '', cin: '' });
  const [newAnalysis, setNewAnalysis] = useState({ patientId: '', doctorName: '', analysisTypeIds: [] });
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [editingAnalysisId, setEditingAnalysisId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingPdfId, setDownloadingPdfId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [results, setResults] = useState([]);
  const [isSubmittingPatient, setIsSubmittingPatient] = useState(false);
  const [isSubmittingAnalysis, setIsSubmittingAnalysis] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, id: null, isLoading: false });
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const pendingAnalyses = useMemo(() => 
    analyses.filter(a => a.status === 'PENDING' || a.status === 'EN_ATTENTE').length,
    [analyses]
  );

  const completedAnalyses = useMemo(() => 
    analyses.filter(a => a.status === 'COMPLETE' || a.status === 'COMPLÉTÉ').length,
    [analyses]
  );

  const filteredPatients = useMemo(() => 
    patients.filter(p => 
      p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm)
    ),
    [patients, searchTerm]
  );

  const handleNewPatientChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCreatePatient = useCallback(async (e) => {
    e.preventDefault();
    if (!newPatient.fullName || !newPatient.cin || !newPatient.dateOfBirth) {
      showToast("Nom complet, CIN et date de naissance requis", 'error');
      return;
    }
    setIsSubmittingPatient(true);
    try {
      if (editingPatientId) {
        await updatePatient(editingPatientId, newPatient);
        setEditingPatientId(null);
      } else {
        await createPatient(newPatient);
      }
      setNewPatient({ fullName: '', dateOfBirth: '', gender: 'M', address: '', phone: '', email: '', cin: '' });
    } catch (err) {
      console.error('handleCreatePatient error', err);
    } finally {
      setIsSubmittingPatient(false);
    }
  }, [newPatient, editingPatientId]);

  const handleNewAnalysisChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewAnalysis(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCreateAnalysis = useCallback(async (e) => {
    e.preventDefault();
    if (!newAnalysis.patientId || !newAnalysis.doctorName) {
      showToast('ID patient et nom du médecin requis', 'error');
      return;
    }
    const typeIds = Array.isArray(newAnalysis.analysisTypeIds) ? newAnalysis.analysisTypeIds.map(Number) : [];
    setIsSubmittingAnalysis(true);
    try {
      if (editingAnalysisId) {
        await updateAnalysis(editingAnalysisId, {
          patientId: Number(newAnalysis.patientId),
          doctorName: newAnalysis.doctorName,
          analysisTypeIds: typeIds
        });
        setEditingAnalysisId(null);
      } else {
        await createAnalysis({
          patientId: Number(newAnalysis.patientId),
          doctorName: newAnalysis.doctorName,
          analysisTypeIds: typeIds
        });
      }
      setNewAnalysis({ patientId: '', doctorName: '', analysisTypeIds: [] });
    } catch (err) {
      console.error('handleCreateAnalysis error', err);
    } finally {
      setIsSubmittingAnalysis(false);
    }
  }, [newAnalysis, editingAnalysisId]);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchSecretaryProfile(),
          fetchPatients(),
          fetchAnalyses(),
          fetchAnalysisTypes(),
          fetchDoctors(),
          fetchResults()
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const fetchSecretaryProfile = async () => {
    try {
      const users = await apiGet('/users');
      const username = localStorage.getItem('username');
      const me = Array.isArray(users) ? users.find(u => u.username === username) : null;
      setSecretaryInfo(me);
      setEditedInfo(me || {});
    } catch (error) {
      console.error('Error fetching secretary profile:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await apiGet('/patients');
      const patientsList = data?.patients || data || [];
      setPatients(Array.isArray(patientsList) ? patientsList : []);
      setTotalPatients(Array.isArray(patientsList) ? patientsList.length : 0);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setPatients([]);
      setTotalPatients(0);
    }
  };

  const fetchAnalyses = async () => {
    try {
      const data = await apiGet('/analyses');
      setAnalyses(Array.isArray(data) ? data : []);
      setTotalAnalyses(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error('Error fetching analyses:', err);
    }
  };

  const fetchAnalysisTypes = async () => {
    try {
      const data = await apiGet('/analyses/types');
      console.log('Analysis types fetched:', data);
      setAnalysisTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching analysis types:', err);
      setAnalysisTypes([]);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await apiGet('/users/doctors');
      console.log('Doctors fetched:', data);
      const doctorsList = data?.doctors || data || [];
      setDoctors(Array.isArray(doctorsList) ? doctorsList : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    }
  };

  const createPatient = async (payload) => {
    try {
      await apiPost('/patients', payload);
      showToast('Patient créé avec succès');
      await fetchPatients();
    } catch (err) {
      console.error('createPatient error', err);
      showToast(err?.message || 'Erreur création patient', 'error');
    }
  };

  const updatePatient = async (id, payload) => {
    try {
      await apiPut(`/patients/${id}`, payload);
      showToast('Patient mis à jour');
      await fetchPatients();
    } catch (err) {
      console.error('updatePatient error', err);
      showToast(err?.message || 'Erreur mise à jour patient', 'error');
    }
  };

  const deletePatient = async (id) => {
    setConfirmModal({ isOpen: true, type: 'patient', id, isLoading: false });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = confirmModal;
    setConfirmModal(prev => ({ ...prev, isLoading: true }));

    try {
      if (type === 'patient') {
        await apiDelete(`/patients/${id}`);
        showToast('Patient supprimé');
        await fetchPatients();
      } else if (type === 'analysis') {
        await apiDelete(`/analyses/${id}`);
        showToast('Analyse supprimée');
        await fetchAnalyses();
      }
      setConfirmModal({ isOpen: false, type: null, id: null, isLoading: false });
    } catch (err) {
      console.error('Delete error', err);
      showToast(err?.message || 'Erreur suppression', 'error');
      setConfirmModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const createAnalysis = async (payload) => {
    try {
      await apiPost('/analyses', payload);
      showToast("Demande d'analyse créée");
      await fetchAnalyses();
    } catch (err) {
      console.error('createAnalysis error', err);
      showToast(err?.message || 'Erreur création analyse', 'error');
    }
  };

  const updateAnalysis = async (id, payload) => {
    try {
      await apiPut(`/analyses/${id}`, payload);
      showToast('Analyse mise à jour');
      await fetchAnalyses();
    } catch (err) {
      console.error('updateAnalysis error', err);
      showToast(err?.message || 'Erreur mise à jour analyse', 'error');
    }
  };

  const deleteAnalysis = async (id) => {
    setConfirmModal({ isOpen: true, type: 'analysis', id, isLoading: false });
  };

  const updateAnalysisStatus = async (analysisId, newStatus) => {
    try {
      setUpdatingStatusId(analysisId);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await apiPatch(`/analyses/${analysisId}/status`, { status: newStatus });
      if (response) {
        const statusLabel = newStatus === 'EN_ATTENTE' ? 'En Attente' : newStatus === 'COMPLETE' ? 'Complété' : 'Validé';
        showToast(`Statut mis à jour vers: ${statusLabel}`);
        await fetchAnalyses();
      }
    } catch (error) {
      console.error('Error updating analysis status:', error);
      showToast('Erreur lors de la mise à jour du statut', 'error');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Patients"
            value={totalPatients}
            icon={Users}
            color="teal"
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
            title="Analyses Complétées"
            value={completedAnalyses}
            icon={Activity}
            color="green"
          />
          <StatCard
            title="Total Analyses"
            value={totalAnalyses}
            icon={FileText}
            color="purple"
            trend
            trendValue="+15%"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="primary" 
                className="w-full justify-center"
                onClick={() => setActiveTab('patients')}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Ajouter Patient
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-center"
                onClick={() => setActiveTab('analyses')}
              >
                <FileText className="h-5 w-5 mr-2" />
                Créer Analyse
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <Activity className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Complétées</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{completedAnalyses}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations Système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-teal-600" />
                    <span className="font-medium text-gray-900">Patients Enregistrés</span>
                  </div>
                  <span className="text-2xl font-bold text-teal-600">{totalPatients}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Types d'Analyses</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{analysisTypes.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    if (!secretaryInfo) {
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
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        let userId = secretaryInfo?.id;
        if (!userId) {
          const usersResp = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (usersResp.ok) {
            const users = await usersResp.json();
            const username = localStorage.getItem('username');
            const me = Array.isArray(users) ? users.find(u => u.username === username) : null;
            userId = me?.id;
          }
        }
        if (!userId) {
          alert('Impossible de déterminer l\'ID utilisateur');
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
          setSecretaryInfo(updated);
          setIsEditing(false);
          showToast('Profil mis à jour avec succès!');
        } else {
          const errorData = await response.json();
          showToast(`Erreur: ${errorData.error}`, 'error');
        }
      } catch (error) {
        showToast('Une erreur est survenue. Veuillez réessayer.', 'error');
      }
    };

    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-teal-100 rounded-full">
                <UserCircle className="h-12 w-12 text-teal-600" />
              </div>
              <div>
                <CardTitle>Profil Secrétaire</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Gérer les informations de votre compte</p>
              </div>
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
                    value={isEditing ? (editedInfo?.firstName || '') : (secretaryInfo.firstName || '')}
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
                    value={isEditing ? (editedInfo?.lastName || '') : (secretaryInfo.lastName || '')}
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
                  value={secretaryInfo.username || ''}
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
                  value={isEditing ? (editedInfo?.email || '') : (secretaryInfo.email || '')}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Input
                  id="role"
                  value={secretaryInfo.role || ''}
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
            {row.gender === 'M' ? 'Masculin' : 'Féminin'}
          </span>
        )
      },
      {
        header: 'Téléphone',
        accessor: 'phone'
      },
      {
        header: 'Email',
        accessor: 'email',
        render: (row) => row.email || '-'
      }
    ];

    return (
      <div className="space-y-6">
        {/* Create/Edit Patient Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingPatientId ? 'Modifier Patient' : 'Créer Nouveau Patient'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" required>Nom Complet</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Entrer le nom complet"
                    value={newPatient.fullName}
                    onChange={handleNewPatientChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cin" required>CIN</Label>
                  <Input
                    id="cin"
                    name="cin"
                    placeholder="Entrer le numéro CIN"
                    value={newPatient.cin}
                    onChange={handleNewPatientChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth" required>Date de Naissance</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={newPatient.dateOfBirth}
                    onChange={handleNewPatientChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender" required>Genre</Label>
                  <Select
                    id="gender"
                    name="gender"
                    value={newPatient.gender}
                    onChange={handleNewPatientChange}
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Entrer le numéro de téléphone"
                    value={newPatient.phone}
                    onChange={handleNewPatientChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Entrer l'email"
                    value={newPatient.email}
                    onChange={handleNewPatientChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Entrer l'adresse"
                  value={newPatient.address}
                  onChange={handleNewPatientChange}
                />
              </div>
              <div className="flex justify-end gap-3">
                {editingPatientId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingPatientId(null);
                      setNewPatient({ fullName: '', dateOfBirth: '', gender: 'M', address: '', phone: '', email: '', cin: '' });
                    }}
                  >
                    Annuler
                  </Button>
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

        {/* Patients List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle>Liste des Patients ({filteredPatients.length})</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher des patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table
              columns={patientColumns}
              data={filteredPatients}
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
          const patient = patients.find(p => p.id === row.patientId);
          return (
            <div>
              <p className="font-medium text-gray-900">{patient?.fullName || `Patient #${row.patientId}`}</p>
              <p className="text-xs text-gray-500">CIN: {patient?.cin || '-'}</p>
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
        header: 'Types d\'Analyses',
        accessor: 'results',
        render: (row) => {
          const types = Array.isArray(row.results)
            ? row.results.map(r => r.analysisType?.name).filter(Boolean)
            : [];
          return (
            <div className="flex flex-wrap gap-1">
              {types.length > 0 ? types.map((type, idx) => (
                <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                  {type}
                </span>
              )) : <span className="text-gray-400">-</span>}
            </div>
          );
        }
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
          const isUpdating = updatingStatusId === row.id;
          
          return (
            <div className="relative inline-block">
              <select
                value={row.status}
                onChange={(e) => updateAnalysisStatus(row.id, e.target.value)}
                disabled={isUpdating}
                className={`appearance-none pr-8 pl-3 py-1 rounded-full text-xs font-medium cursor-pointer border-0 ${config.bg} ${config.text} hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="EN_ATTENTE" className="bg-white text-gray-900">En Attente</option>
                <option value="COMPLETE" className="bg-white text-gray-900">Complété</option>
                <option value="VALIDE" className="bg-white text-gray-900">Validé</option>
              </select>
              {isUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              ) : (
                <ChevronDown className="h-3 w-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
            </div>
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
                    {patients.map(p => (
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
                    {doctors.map(doctor => {
                      const displayName = doctor.firstName && doctor.lastName 
                        ? `Dr. ${doctor.firstName} ${doctor.lastName}` 
                        : doctor.username;
                      return (
                        <option key={doctor.id} value={displayName}>
                          {displayName}
                        </option>
                      );
                    })}
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
                  {analysisTypes.map(t => (
                    <option key={t.id || t.name} value={t.id || t.name}>
                      {t.name} {t.price ? `- ${t.price} DT` : ''}
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-gray-500 mt-1">Maintenir Ctrl/Cmd pour sélectionner plusieurs</p>
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
            <CardTitle>Demandes d'Analyses ({analyses.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table
              columns={analysisColumns}
              data={analyses}
              onEdit={(row) => {
                setEditingAnalysisId(row.id);
                // Extract analysis type IDs from results array
                const typeIds = Array.isArray(row.results)
                  ? row.results.map(r => r.analysisTypeId || r.analysisType?.id).filter(Boolean).map(id => id.toString())
                  : Array.isArray(row.analysisTypeIds)
                  ? row.analysisTypeIds.map(id => id.toString())
                  : [];
                // Find doctor and get display name
                const doctor = doctors.find(d => d.username === row.doctorName);
                const doctorDisplayName = doctor && doctor.firstName && doctor.lastName
                  ? `Dr. ${doctor.firstName} ${doctor.lastName}`
                  : row.doctorName ?? '';
                setNewAnalysis({
                  patientId: row.patientId?.toString() ?? '',
                  doctorName: doctorDisplayName,
                  analysisTypeIds: typeIds
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

  const handleDownloadPDF = async (analysisId) => {
    try {
      setDownloadingPdfId(analysisId);
      const token = localStorage.getItem('token');
      const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/analyses/${analysisId}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Échec du téléchargement du PDF: ${response.status} - ${errorText}`);
      }
      
      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Le PDF généré est vide');
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analyse_${analysisId}_resultat.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
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
      {
        header: 'ID Analyse',
        accessor: 'requestId',
        render: (row) => <div className="font-mono text-sm font-medium text-gray-900">#{row.requestId}</div>
      },
      {
        header: 'Patient',
        accessor: 'patient',
        render: (row) => {
          const patient = row.request?.patient;
          return (
            <div>
              <p className="font-medium text-gray-900">{patient?.fullName || `Patient #${row.requestId}`}</p>
              <p className="text-xs text-gray-500">CIN: {patient?.cin || '-'}</p>
            </div>
          );
        }
      },
      {
        header: "Type d'Analyse",
        accessor: 'analysisType',
        render: (row) => <span className="text-sm text-gray-900">{row.analysisType?.name || '-'}</span>
      },
      {
        header: 'Résultat',
        accessor: 'value',
        render: (row) => (
          row.value !== null && row.value !== undefined ? (
            <div>
              <div className="font-medium text-gray-900">{Number(row.value).toFixed(2)} {row.analysisType?.unit || ''}</div>
            </div>
          ) : (
            <div className="text-gray-500">-</div>
          )
        )
      },
      {
        header: 'Référence',
        render: (row) => row.analysisType ? `${row.analysisType.reference_min} - ${row.analysisType.reference_max} ${row.analysisType.unit || ''}` : '-'
      },
      {
        header: 'Mesuré par',
        render: (row) => row.measuredBy ? `#${row.measuredBy}` : '-'
      },
      {
        header: 'Mesuré le',
        render: (row) => row.measuredAt ? new Date(row.measuredAt).toLocaleString() : '-'
      },
      {
        header: 'Anormal',
        render: (row) => row.isAbnormal ? <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">Anormal</span> : <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Normal</span>
      },
      {
        header: 'Statut',
        accessor: 'status',
        render: (row) => {
          const status = (row.request?.status || '').toUpperCase();
          const statusConfig = {
            'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En Attente', icon: Clock },
            'EN_ATTENTE': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En Attente', icon: Clock },
            'COMPLETE': { bg: 'bg-green-100', text: 'text-green-700', label: 'Complété', icon: Activity },
            'COMPLÉTÉ': { bg: 'bg-green-100', text: 'text-green-700', label: 'Complété', icon: Activity },
            'VALIDE': { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Validé', icon: Activity }
          };
          const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status, icon: Activity };
          const StatusIcon = config.icon;
          return (
            <div className="flex items-center gap-2">
              <StatusIcon className="h-4 w-4" />
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>
            </div>
          );
        }
      },
      {
        header: 'Date',
        accessor: 'createdAt',
        render: (row) => row.request?.createdAt ? new Date(row.request.createdAt).toLocaleDateString() : (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-')
      },
      {
        header: 'Actions',
        accessor: 'actions',
        render: (row) => {
          const isDownloading = downloadingPdfId === row.requestId;
          return (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="primary" onClick={() => handleDownloadPDF(row.requestId)} disabled={isDownloading} className="whitespace-nowrap">
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-1" />
                )}
                {isDownloading ? 'Génération...' : 'PDF'}
              </Button>
            </div>
          );
        }
      }
    ];

    const completedAnalysesData = results.filter(r => {
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
                  <p className="text-3xl font-bold text-gray-900">{completedAnalysesData.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-teal-50">
                  <FileText className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Résultats d'Analyses ({completedAnalysesData.length})</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Affichage des analyses complétées et validées</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {resultsColumns.map((col, idx) => (
                      <th key={idx} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {completedAnalysesData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      {resultsColumns.map((col, colIdx) => (
                        <td key={colIdx} className="px-6 py-4 text-sm text-gray-900">
                          {col.render ? col.render(row) : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {completedAnalysesData.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucune donnée disponible</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </div>

        {completedAnalysesData.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat disponible</h3>
              <p className="text-gray-600">
                Les résultats d'analyses apparaîtront ici une fois qu'ils seront complétés par le technicien.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'profile', label: 'Profil', icon: UserCircle },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'analyses', label: 'Analyses', icon: FileText },
    { id: 'results', label: 'Résultats', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, id: null, isLoading: false })}
        onConfirm={handleConfirmDelete}
        title={confirmModal.type === 'patient' ? 'Supprimer le patient' : 'Supprimer l\'analyse'}
        message={confirmModal.type === 'patient' 
          ? 'Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.' 
          : 'Êtes-vous sûr de vouloir supprimer cette demande d\'analyse ? Cette action est irréversible.'}
        isLoading={confirmModal.isLoading}
      />
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-600 rounded-xl">
                  <Hospital className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Gestion Laboratoire</h1>
                  <p className="text-xs text-gray-500">Tableau de bord Secrétaire</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <UserCircle className="h-5 w-5 text-gray-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {secretaryInfo ? `${secretaryInfo.firstName || secretaryInfo.username || 'Secrétaire'}` : 'Secrétaire'}
                  </p>
                  <p className="text-xs text-gray-500">Secrétaire</p>
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
            {activeTab === 'patients' && renderPatients()}
            {activeTab === 'analyses' && renderAnalyses()}
            {activeTab === 'results' && renderResults()}
          </>
        )}
      </main>
    </div>
  );
}