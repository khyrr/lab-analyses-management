import React, { useState } from 'react';
import { ShieldCheck, User, Microscope, Eye, EyeOff, Mail, Lock, ArrowRight, HeartPulse, Phone, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { id: 'ADMIN', label: 'Administrateur', icon: ShieldCheck, color: 'from-purple-500 to-purple-700' },
    { id: 'TECHNICIAN', label: 'Technicien', icon: Microscope, color: 'from-blue-500 to-blue-700' },
    { id: 'SECRETARY', label: 'Secrétaire', icon: Phone, color: 'from-yellow-500 to-yellow-700' },
    { id: 'MEDECIN', label: 'Médecin', icon: HeartPulse, color: 'from-green-500 to-green-700' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!selectedRole) {
      setError('Veuillez sélectionner un type d\'utilisateur');
      return;
    }
    if (!username.trim() || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Le serveur renvoie { token, user: { id, username, role } }
        const roleFromServer = data.user?.role || data.role || selectedRole;
        
        // Vérification de cohérence entre rôle sélectionné et rôle réel (Optionnel mais recommandé)
        if (selectedRole !== roleFromServer) {
          setError(`Accès refusé: Votre compte est associé au rôle ${roleFromServer}`);
          setIsLoading(false);
          return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', roleFromServer);
        localStorage.setItem('username', data.user?.username || username);

        // Redirection basée sur le rôle
        const roleKey = (roleFromServer || '').toString().toUpperCase();
        if (roleKey === 'ADMIN') {
          navigate('/admin');
        } else if (roleKey === 'TECHNICIAN') {
          navigate('/technician');
        } else if (roleKey === 'MEDECIN') {
          navigate('/doctor');
        } else if (roleKey === 'SECRETARY') {
          navigate('/secretary');
        } else {
          navigate('/patient');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Identifiants incorrects');
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRoleData = roles.find(role => role.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Décoration d'arrière-plan avec animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Section gauche - Formulaire */}
          <div className="p-8 md:p-12 lg:p-16">
            <div className="mb-8">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Retour à l'accueil
              </button>
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Microscope className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">LAB<span className="text-teal-600">TUN</span></h1>
                  <p className="text-gray-600 text-sm">Laboratoire d'Analyses Médicales</p>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Accédez à votre <span className="text-teal-600">espace</span>
              </h2>
              <p className="text-gray-600">
                Connectez-vous pour consulter vos résultats, prendre rendez-vous ou gérer votre laboratoire
              </p>
            </div>

            {/* Sélecteur de rôle */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Je me connecte en tant que :
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedRole === role.id 
                          ? `border-teal-500 bg-gradient-to-br ${role.color} text-white shadow-lg scale-105`
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4" />
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  placeholder="Entrez votre nom d'utilisateur"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Lock className="w-4 h-4" />
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 pr-12"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
                  <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 bg-gradient-to-r ${selectedRoleData?.color || 'from-teal-600 to-teal-800'} text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <span>{selectedRoleData ? `Se connecter en tant que ${selectedRoleData.label}` : 'Se connecter'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Vous n'avez pas de compte ?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                >
                  Créer un compte
                </button>
              </p>
            </div>

            <div className="mt-8">
              <p className="text-xs text-gray-500 text-center">
                En vous connectant, vous acceptez nos{' '}
                <button className="text-teal-600 hover:underline">conditions d'utilisation</button>{' '}
                et notre{' '}
                <button className="text-teal-600 hover:underline">politique de confidentialité</button>
              </p>
            </div>
          </div>

          {/* Section droite - Illustration */}
          <div className="hidden lg:block relative bg-gradient-to-br from-teal-600 to-teal-800">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}></div>
            </div>
            
            <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
              <div className="mb-8 text-center">
                <h3 className="text-4xl font-bold mb-4">
                  Bienvenue au <span className="text-teal-200">LABTUN</span>
                </h3>
                <p className="text-xl text-teal-100 opacity-90">
                  Votre santé, notre expertise
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mx-auto mb-6">
                        {selectedRoleData && (() => {
                          const Icon = selectedRoleData.icon;
                          return <Icon className="w-10 h-10" />;
                        })()}
                      </div>
                  
                  <h4 className="text-2xl font-bold text-center mb-4">
                    Accès {selectedRoleData?.label.toLowerCase()}
                  </h4>
                  
                  <ul className="space-y-3 text-teal-100">
                    {selectedRole === 'SECRETARY' && (
                      <>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                          <span>Gérez les rendez-vous et l'agenda</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                          <span>Gérez l'accueil et les dossiers administratifs</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                          <span>Communiquez avec patients et personnel</span>
                        </li>
                      </>
                    )}

                    {selectedRole === 'TECHNICIAN' && (
                      <>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                          <span>Gérez les analyses en laboratoire</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                          <span>Saisissez les résultats d'examens</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                          <span>Contrôlez la qualité des analyses</span>
                        </li>
                      </>
                    )}
                    
                    {selectedRole === 'MEDECIN' && (
                      <>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                          <span>Consultez les résultats de vos patients</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                          <span>Prescrivez de nouvelles analyses</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                          <span>Échangez avec le laboratoire</span>
                        </li>
                      </>
                    )}
                    
                    {selectedRole === 'ADMIN' && (
                      <>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                          <span>Gérez les comptes utilisateurs</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                          <span>Consultez les statistiques</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                          <span>Administrez le système</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-teal-200 mb-4">Besoin d'aide ?</p>
                <div className="flex items-center justify-center gap-6">
                  <button className="flex items-center gap-2 text-teal-100 hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>+216 70 000 000</span>
                  </button>
                  <button className="flex items-center gap-2 text-teal-100 hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                    <span>support@labtun.tn</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;