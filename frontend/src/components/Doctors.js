import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FileText, Users, Home, UserCircle, Hospital, Activity, 
  LogOut, Edit, Search, CheckCircle, 
  Stethoscope, Download, Loader2, XCircle, 
  AlertCircle, RefreshCw, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPut } from '../services/api';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    success: 'bg-green-50 text-green-700 hover:bg-green-100 focus:ring-green-500',
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
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <Card hover shadow>
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

const Table = ({ columns, data, onAction, actionLabel, actionIcon: ActionIcon }) => {
  if (data === null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-3" />
        <p className="text-gray-500 text-sm font-medium">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
            {onAction && (
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
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
              {onAction && (
                <td className="px-6 py-4 text-right text-sm">
                  <Button size="sm" variant="outline" onClick={() => onAction(row)} className="gap-2">
                    {ActionIcon && <ActionIcon className="h-4 w-4" />}
                    {actionLabel}
                  </Button>
                </td>
              )}
            </tr>
          ))}
          {(data || []).length === 0 && (
            <tr>
              <td colSpan={columns.length + (onAction ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                Aucune donnée disponible
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const Toast = ({ message, type, onClose }) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    error: <XCircle className="h-5 w-5 text-red-600" />
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 right-4 z-[100] animate-slide-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[type]} min-w-[300px]`}>
        {icons[type]}
        <p className="flex-1 font-medium">{message}</p>
        <button onClick={onClose} className="hover:opacity-70">
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  
  const [patients, setPatients] = useState(null);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [downloadingPdfId, setDownloadingPdfId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchProfile = useCallback(async () => {
    try {
      const data = await apiGet('/auth/profile');
      setDoctorInfo(data);
      setEditedProfile(data || {});
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.status === 401) navigate('/login');
    }
  }, [navigate]);

  const fetchPatients = useCallback(async () => {
    try {
      setPatients(null);
      const data = await apiGet('/patients');
      setPatients(Array.isArray(data) ? data : (data?.patients || []));
    } catch (err) {
      console.error('Error fetching patients:', err);
      setPatients([]);
    }
  }, []);

  const fetchResults = useCallback(async () => {
    try {
      setResults(null);
      const data = await apiGet('/analyses/results', { limit: 50 });
      setResults(data.projects || data.results || data || []);
    } catch (err) {
      console.error('Error fetching results:', err);
      setResults([]);
    }
  }, []);

  const fetchPatientHistory = useCallback(async (patientId) => {
    try {
      setHistory(null);
      const data = await apiGet(`/patients/${patientId}/history`);
      setHistory(data);
    } catch (err) {
      console.error('Error fetching patient history:', err);
      setHistory([]);
      showToast('Erreur lors du chargement de l\'historique', 'error');
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchProfile();
      if (activeTab === 'dashboard') {
        await Promise.all([fetchPatients(), fetchResults()]);
      }
      setIsLoading(false);
    };
    init();
  }, [activeTab, fetchProfile, fetchPatients, fetchResults]);

  useEffect(() => {
    if (isLoading) return;
    const loadTab = async () => {
      switch (activeTab) {
        case 'patients': if (!patients) await fetchPatients(); break;
        case 'results': if (!results) await fetchResults(); break;
        default: break;
      }
    };
    loadTab();
  }, [activeTab, isLoading, patients, results, fetchPatients, fetchResults]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchProfile(),
        fetchPatients(),
        fetchResults()
      ]);
      if (selectedPatient) await fetchPatientHistory(selectedPatient.id);
      showToast('Données synchronisées');
    } catch (err) {
      showToast('Échec de la synchronisation', 'error');
    } finally {
      setIsRefreshing(false);
    }
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

  const handleDownloadHistoryPDF = async (patientId) => {
    try {
      showToast('Génération de l\'historique...');
      const token = localStorage.getItem('token');
      const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${baseUrl}/patients/${patientId}/history/pdf`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Échec du téléchargement de l'historique: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) throw new Error('Le PDF généré est vide');

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Historique-${selectedPatient.fullName.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      showToast('Historique téléchargé');
    } catch (err) {
      console.error('History PDF Download error:', err);
      showToast('Erreur lors du téléchargement de l\'historique: ' + err.message, 'error');
    }
  };

  const stats = useMemo(() => {
    const totalP = (patients || []).length;
    const completedR = (results || []).filter(r => r.value != null).length;
    const abnormalR = (results || []).filter(r => r.isAbnormal).length;
    return { totalP, completedR, abnormalR };
  }, [patients, results]);

  const filteredPatients = patients === null ? null : patients.filter(p => 
    p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.cin?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tableau de Bord</h2>
          <p className="text-sm text-gray-500">Aperçu de vos patients et résultats</p>
        </div>
        <Button 
          variant="outline" 
          size="md" 
          onClick={handleRefresh} 
          disabled={isRefreshing}>
          <RefreshCw className={`h-6 w-6 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Patients" value={stats.totalP} icon={Users} color="teal" />
        <StatCard title="Résultats Complétés" value={stats.completedR} icon={CheckCircle} color="green" />
        <StatCard title="Alertes (Anormal)" value={stats.abnormalR} icon={AlertCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover>
          <CardHeader>
            <CardTitle>Derniers Résultats</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {(results || []).slice(0, 5).map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${r.isAbnormal ? 'bg-red-100' : 'bg-green-100'}`}>
                      <Activity className={`h-4 w-4 ${r.isAbnormal ? 'text-red-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.analysisType?.name}</p>
                      <p className="text-xs text-gray-500">{r.request?.patient?.fullName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${r.isAbnormal ? 'text-red-600' : 'text-gray-900'}`}>
                      {r.value} {r.analysisType?.unit}
                    </p>
                    <p className="text-xs text-gray-400">
                      {r.measuredAt ? new Date(r.measuredAt).toLocaleDateString() : 'En attente'}
                    </p>
                  </div>
                </div>
              ))}
              {(results || []).length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">Aucun résultat récent</div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-teal-600" onClick={() => setActiveTab('results')}>
              Voir tous les résultats
            </Button>
          </CardFooter>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>Patients sous surveillance</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {(patients || []).slice(0, 5).map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
                      {p.fullName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.fullName}</p>
                      <p className="text-xs text-gray-500">{p.cin}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => { setSelectedPatient(p); setActiveTab('patients'); fetchPatientHistory(p.id); }}>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              ))}
              {(patients || []).length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">Aucun patient enregistré</div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-teal-600" onClick={() => setActiveTab('patients')}>
              Gérer les patients
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-start gap-4">
        <Button variant="secondary" size="sm" onClick={() => { setSelectedPatient(null); setHistory(null); }}>
          Retour
        </Button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Historique : {selectedPatient.fullName}</h2>
          <p className="text-sm text-gray-500">CIN: {selectedPatient.cin} | Tél: {selectedPatient.phone}</p>
        </div>
        <div className="ml-auto">
          <Button 
            variant="success" 
            size="md" 
            onClick={() => handleDownloadHistoryPDF(selectedPatient.id)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Télécharger Historique Complet
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Analyses effectuées</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table 
            columns={[
              { header: 'ID', accessor: 'id' },
              { header: 'Date', accessor: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
              { header: 'Statut', render: (row) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  row.status === 'COMPLETE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {row.status}
                </span>
              )},
              { header: 'Médecin Prescripteur', accessor: 'doctorName', render: (row) => row.doctor?.fullName || 'Externe' },
              { 
                header: 'Actions', 
                render: (row) => {
                  const isDownloading = downloadingPdfId === row.id;
                  return (
                    <div className="flex items-center justify-end">
                      <Button 
                        size="sm" 
                        variant="primary" 
                        onClick={() => handleDownloadPDF(row.id)} 
                        disabled={isDownloading} 
                        className="whitespace-nowrap"
                      >
                        {isDownloading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
                        {isDownloading ? 'Génération...' : 'PDF'}
                      </Button>
                    </div>
                  );
                }
              }
            ]}
            data={history}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderPatientsView = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <CardTitle className="text-xl">Gestion des Patients ({(patients || []).length})</CardTitle>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Rechercher par nom ou CIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table 
            columns={[
              { header: 'Nom Complet', accessor: 'fullName' },
              { header: 'CIN', accessor: 'cin' },
              { header: 'Téléphone', accessor: 'phone' },
              { header: 'Email', accessor: 'email', render: (row) => row.email || '-' }
            ]}
            data={filteredPatients}
            onAction={(row) => { setSelectedPatient(row); fetchPatientHistory(row.id); }}
            actionLabel="Voir Historique"
            actionIcon={FileText}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderResultsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl">Derniers Résultats d'Analyses</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-6 w-6 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table 
            columns={[
              { header: 'Date', render: (row) => row.measuredAt ? new Date(row.measuredAt).toLocaleDateString() : 'N/A' },
              { header: 'Patient', render: (row) => row.request?.patient?.fullName || 'N/A' },
              { header: 'Analyse', render: (row) => row.analysisType?.name || 'N/A' },
              { header: 'Valeur', render: (row) => (
                <span className={`font-bold ${row.isAbnormal ? 'text-red-600' : 'text-gray-900'}`}>
                  {row.value} {row.analysisType?.unit}
                </span>
              )},
              { header: 'Interprétation', render: (row) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  row.isAbnormal ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {row.isAbnormal ? 'Anormal' : 'Normal'}
                </span>
              )},
              { 
                header: 'Actions', 
                render: (row) => {
                  const id = row.requestId || row.request?.id;
                  const isDownloading = downloadingPdfId === id;
                  return (
                    <div className="flex items-center justify-end">
                      <Button 
                        size="sm" 
                        variant="primary" 
                        onClick={() => handleDownloadPDF(id)} 
                        disabled={isDownloading} 
                        className="whitespace-nowrap"
                      >
                        {isDownloading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
                        {isDownloading ? 'Génération...' : 'PDF'}
                      </Button>
                    </div>
                  );
                }
              }
            ]}
            data={results}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => {
    if (!doctorInfo) return null;
    const handleSave = async () => {
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
            <div className="flex items-center gap-4">
              <div className="p-4 bg-teal-100 rounded-full">
                <UserCircle className="h-10 w-10 text-teal-600" />
              </div>
              <div>
                <CardTitle>Mon Profil</CardTitle>
                <p className="text-xs text-gray-500">Compte Médecin autorisé</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input 
                  name="firstName" 
                  value={editedProfile.firstName || ''} 
                  onChange={(e) => setEditedProfile({...editedProfile, firstName: e.target.value})} 
                  readOnly={!isEditingProfile}
                  className={!isEditingProfile ? 'bg-gray-50' : ''}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input 
                  name="lastName" 
                  value={editedProfile.lastName || ''} 
                  onChange={(e) => setEditedProfile({...editedProfile, lastName: e.target.value})} 
                  readOnly={!isEditingProfile}
                  className={!isEditingProfile ? 'bg-gray-50' : ''}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Nom d'utilisateur</Label>
                <Input value={doctorInfo.username} readOnly className="bg-gray-50" />
              </div>
              <div className="md:col-span-2">
                <Label>Rôle</Label>
                <div className="flex items-center gap-2 p-3 bg-teal-50 text-teal-700 rounded-lg border border-teal-100">
                  <Stethoscope className="h-5 w-5" />
                  <span className="font-semibold text-sm capitalize">{doctorInfo.role}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            {isEditingProfile ? (
              <>
                <Button variant="secondary" onClick={() => setIsEditingProfile(false)}>Annuler</Button>
                <Button variant="primary" onClick={handleSave}>Enregistrer les modifications</Button>
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
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'results', label: 'Résultats', icon: Activity },
    { id: 'profile', label: 'Mon Profil', icon: UserCircle }
  ];



  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans selection:bg-teal-100 selection:text-teal-900">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-600 rounded-xl shadow-lg shadow-teal-200">
              <Hospital className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Portail Médical</h1>
              <p className="text-xs text-gray-500 font-medium">
                Dr. {doctorInfo?.firstName} {doctorInfo?.lastName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors" onClick={() => { localStorage.clear(); navigate('/login'); }}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-100 mb-8 overflow-x-auto">
        <div className="max-w-[1600px] mx-auto px-6 flex gap-8">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSelectedPatient(null); setHistory(null); }}
                className={`flex items-center gap-2.5 px-2 py-5 border-b-2 transition-all font-semibold text-sm whitespace-nowrap ${
                  isActive 
                    ? 'border-teal-600 text-teal-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-teal-600' : 'text-gray-400'}`} />
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
        <div className="animate-in fade-in duration-500">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'patients' && (selectedPatient ? renderHistory() : renderPatientsView())}
          {activeTab === 'results' && renderResultsView()}
          {activeTab === 'profile' && renderProfile()}
        </div>
        )}
      </main>
    </div>
  );
}
