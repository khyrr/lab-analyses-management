import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FileText, Users, Home, UserCircle, Hospital, Activity, LogOut, Trash2, Edit, Search, CheckCircle, Clock, Stethoscope, Download, Loader2, Save, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../services/api';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    danger: 'border-2 border-red-200 text-red-600 hover:bg-red-50 focus:ring-red-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
    warning: 'bg-orange-50 text-orange-700 hover:bg-orange-100 focus:ring-orange-500'
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
    className={`w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor, required = false }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const StatCard = ({ title, value, icon: Icon, color = 'teal' }) => {
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <Card hover>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    error: <XCircle className="h-5 w-5 text-red-600" />,
    info: <Activity className="h-5 w-5 text-blue-600" />
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
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const VoidModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Annuler le résultat</h3>
        </div>
        <p className="text-gray-600 mb-4">Veuillez indiquer la raison de l'annulation de ce résultat. Cette action est irréversible.</p>
        <div className="mb-6">
          <Label htmlFor="voidReason" required>Raison d'annulation</Label>
          <Input 
            id="voidReason"
            placeholder="Ex: Erreur de saisie, Échantillon compromis..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button onClick={onClose} variant="secondary" disabled={isLoading}>
            Fermer
          </Button>
          <Button 
            onClick={() => onConfirm(reason)} 
            variant="danger" 
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Annuler Résultat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function TechnicianDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [technicianInfo, setTechnicianInfo] = useState(null);
  const [editedProfile, setEditedProfile] = useState({});
  
  const [patients, setPatients] = useState(null);
  const [analyses, setAnalyses] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [voidModal, setVoidModal] = useState({ isOpen: false, resultId: null, isLoading: false });
  const [editingResults, setEditingResults] = useState({}); 

  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadEssentialData = async () => {
      setIsLoading(true);
      try {
        await fetchProfile();
        // If we start on dashboard, we need analyses (for stats) and results (for recent activity)
        if (activeTab === 'dashboard') {
          await Promise.all([
            fetchAnalyses(),
            fetchResults()
          ]);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        if (error.status === 401) navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    loadEssentialData();
  }, [navigate]);

  // Lazy load tab data
  useEffect(() => {
    if (isLoading) return;

    const loadTabData = async () => {
      try {
        switch (activeTab) {
          case 'dashboard':
            // Need both for stats and recent activity
            if (analyses === null) await fetchAnalyses();
            if (results === null) await fetchResults();
            break;
          case 'results':
            if (results === null) await fetchResults();
            break;
          case 'profile':
            // Profile info is fetched on mount
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error loading data for tab ${activeTab}:`, error);
      }
    };
    loadTabData();
  }, [activeTab, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      switch (activeTab) {
        case 'dashboard':
          await Promise.all([fetchAnalyses(), fetchResults()]);
          break;
        case 'results':
          await fetchResults();
          break;
        case 'profile':
          await fetchProfile();
          break;
        default:
          break;
      }
    } catch (error) {
      showToast('Échec de l\'actualisation', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await apiGet('/auth/profile');
      setTechnicianInfo(data);
      setEditedProfile(data || {});
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await apiGet('/patients');
      setPatients(Array.isArray(data) ? data : (data?.patients || []));
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const fetchAnalyses = async () => {
    try {
      const data = await apiGet('/analyses');
      setAnalyses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching analyses:', err);
    }
  };

  const fetchResults = async () => {
    try {
      const data = await apiGet('/analyses/results', { isVoided: false, limit: 100 });
      const resultsList = Array.isArray(data.results) ? data.results : (data.results || []);
      setResults(resultsList);
    } catch (err) {
      console.error('Error fetching results:', err);
    }
  };

  const handleSaveResult = async (result) => {
    const value = editingResults[result.id];
    if (value === undefined || value === null || value === '') {
      showToast('Veuillez entrer une valeur valide', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiPut(`/analyses/${result.requestId}/results`, {
        results: [
          {
            resultId: result.id,
            value: parseFloat(value)
          }
        ]
      });
      showToast('Résultat enregistré avec succès');
      const newEditing = { ...editingResults };
      delete newEditing[result.id];
      setEditingResults(newEditing);
      await fetchResults();
      await fetchAnalyses();
    } catch (err) {
      showToast(err.message || 'Erreur lors de l\'enregistrement', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoidResult = async (reason) => {
    if (!voidModal.resultId) return;
    setVoidModal(prev => ({ ...prev, isLoading: true }));
    try {
      await apiPatch(`/analyses/results/${voidModal.resultId}/void`, { reason });
      showToast('Résultat annulé');
      setVoidModal({ isOpen: false, resultId: null, isLoading: false });
      await fetchResults();
    } catch (err) {
      showToast(err.message || 'Erreur lors de l\'annulation', 'error');
      setVoidModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const stats = useMemo(() => {
    const allResultsFromAnalyses = (analyses || []).flatMap(a => a.results || []);
    const pending = allResultsFromAnalyses.filter(r => r.value == null && !r.isVoided).length;
    const completed = allResultsFromAnalyses.filter(r => r.value != null && !r.isVoided).length;
    const abnormal = allResultsFromAnalyses.filter(r => r.isAbnormal && !r.isVoided).length;
    return { pending, completed, abnormal };
  }, [analyses]);

  const priorityResults = useMemo(() => {
    return (analyses || [])
      .flatMap(a => (a.results || []).map(r => ({ ...r, request: a })))
      .filter(r => r.value == null && !r.isVoided)
      .slice(0, 5);
  }, [analyses]);

  const filteredResults = useMemo(() => {
    return (results || []).filter(r => {
      const patientName = r.request?.patient?.fullName || '';
      const analysisName = r.analysisType?.name || '';
      const search = searchTerm.toLowerCase();
      return patientName.toLowerCase().includes(search) || 
             analysisName.toLowerCase().includes(search) ||
             String(r.requestId).includes(search);
    });
  }, [results, searchTerm]);

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Vue d'ensemble</h2>
          <p className="text-sm text-gray-500">Aperçu rapide de l'activité du laboratoire</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Résultats en Attente" value={stats.pending} icon={Clock} color="orange" />
        <StatCard title="Résultats Mesurés" value={stats.completed} icon={Activity} color="green" />
        <StatCard title="Alertes (Anormal)" value={stats.abnormal} icon={AlertCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(results || []).length > 0 ? (
                results.slice(0, 5).map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${r.value != null ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        <FileText className={`h-4 w-4 ${r.value != null ? 'text-green-600' : 'text-yellow-600'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{r.analysisType?.name}</p>
                        <p className="text-xs text-gray-500">{r.request?.patient?.fullName}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {r.measuredAt ? new Date(r.measuredAt).toLocaleTimeString() : 'En attente'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm">
                  Aucune activité récente
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyses Prioritaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityResults.length > 0 ? (
                priorityResults.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-orange-100 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{r.analysisType?.name}</p>
                        <p className="text-xs text-gray-600">Patient: {r.request?.patient?.fullName}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="warning" onClick={() => { setActiveTab('results'); setSearchTerm(String(r.requestId)); }}>
                      Saisir
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm">
                  <CheckCircle className="h-8 w-8 text-green-200 mx-auto mb-2" />
                  Toutes les analyses sont complétées !
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderResults = () => {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
            <div className="flex items-center gap-4">
              <CardTitle>Gestion des Résultats ({filteredResults.length})</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-gray-500"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par patient, analyse ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID / Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Analyse</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Référence</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">Valeur</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.map((row) => {
                  const currentValue = editingResults[row.id] !== undefined ? editingResults[row.id] : (row.value ?? '');
                  const hasChanges = editingResults[row.id] !== undefined;

                  return (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">#{row.requestId}</div>
                        <div className="text-xs text-gray-500">{row.request?.patient?.fullName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{row.analysisType?.name}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {row.analysisType?.reference_min} - {row.analysisType?.reference_max} {row.analysisType?.unit}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number"
                            step="0.01"
                            placeholder="Valeur"
                            value={currentValue}
                            onChange={(e) => setEditingResults({...editingResults, [row.id]: e.target.value})}
                            className={`h-9 ${row.isAbnormal ? 'border-red-300 bg-red-50 text-red-900' : ''}`}
                          />
                          <span className="text-xs font-medium text-gray-400">{row.analysisType?.unit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {row.value != null ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" /> Mesuré
                            </span>
                            {row.isAbnormal && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                <AlertCircle className="h-3 w-3 mr-1" /> Anormal
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" /> En attente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant={hasChanges ? "success" : "ghost"}
                            disabled={!hasChanges || isSubmitting}
                            onClick={() => handleSaveResult(row)}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            {hasChanges ? 'Sauvegarder' : ''}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setVoidModal({ isOpen: true, resultId: row.id, isLoading: false })}
                            className="text-red-600 hover:bg-red-50 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredResults.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Aucun résultat trouvé</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderProfile = () => {
    if (!technicianInfo) return null;

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
      try {
        await apiPut('/auth/profile', editedProfile);
        showToast('Profil mis à jour');
        setIsEditingProfile(false);
        await fetchProfile();
      } catch (err) {
        showToast(err.message || 'Erreur lors de la mise à jour', 'error');
      }
    };

    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-teal-100 rounded-full">
                  <UserCircle className="h-10 w-10 text-teal-600" />
                </div>
                <div>
                  <CardTitle>Mon Profil</CardTitle>
                  <p className="text-xs text-gray-500">Informations du compte Technicien</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-gray-500"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={editedProfile.firstName || ''}
                  onChange={handleInputChange}
                  readOnly={!isEditingProfile}
                  className={!isEditingProfile ? 'bg-gray-50' : ''}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={editedProfile.lastName || ''}
                  onChange={handleInputChange}
                  readOnly={!isEditingProfile}
                  className={!isEditingProfile ? 'bg-gray-50' : ''}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editedProfile.email || ''}
                onChange={handleInputChange}
                readOnly={!isEditingProfile}
                className={!isEditingProfile ? 'bg-gray-50' : ''}
              />
            </div>
            <div>
              <Label>Rôle</Label>
              <Input value={technicianInfo.role} readOnly className="bg-gray-50" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            {isEditingProfile ? (
              <>
                <Button variant="secondary" onClick={() => setIsEditingProfile(false)}>Annuler</Button>
                <Button variant="primary" onClick={handleSaveProfile}>Enregistrer</Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setIsEditingProfile(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier Profil
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  };

  const navItems = [
    { id: 'dashboard', label: 'Vue d\'ensemble', icon: Home },
    { id: 'results', label: 'Gestion Résultats', icon: Activity },
    { id: 'profile', label: 'Profil', icon: UserCircle }
  ];



  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <VoidModal 
        isOpen={voidModal.isOpen} 
        onClose={() => setVoidModal({ ...voidModal, isOpen: false })}
        onConfirm={handleVoidResult}
        isLoading={voidModal.isLoading}
      />

      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600 rounded-xl shadow-lg shadow-teal-100">
              <Hospital className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Portail Technique</h1>
              <p className="text-xs text-gray-500 font-medium">Connecté : {technicianInfo?.firstName} {technicianInfo?.lastName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900 font-mono">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              <span className="text-xs text-teal-600 font-bold uppercase tracking-wider">Session Active</span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>
            <Button variant="ghost" className="text-red-500 hover:bg-red-50 px-3" onClick={() => {
              localStorage.clear();
              navigate('/');
            }}>
              <LogOut className="h-4 w-4 mr-2" />
              Quitter
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-100 mb-8 overflow-x-auto">
        <div className="max-w-[1600px] mx-auto px-6 flex gap-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-all font-medium text-sm whitespace-nowrap ${
                  isActive 
                    ? 'border-teal-600 text-teal-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-teal-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-6">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">Chargement des données...</p>
              <p className="text-gray-500 text-sm mt-2">Veuillez patienter</p>
            </div>
          </div>
        ) : (
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'results' && renderResults()}
          {activeTab === 'profile' && renderProfile()}
        </div>
        )}
      </main>
    </div>
  );
}
