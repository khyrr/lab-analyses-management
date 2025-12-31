import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Microscope, ShieldCheck, Phone, MapPin, Calendar, UserPlus } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Le nom d'utilisateur est requis";
    else if (formData.username.length < 3) newErrors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères";

    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    else if (formData.password.length < 8) newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) newErrors.password = "Doit contenir une majuscule et un chiffre";

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    if (!formData.role) newErrors.role = "Veuillez sélectionner un rôle";

    if (!acceptTerms) newErrors.terms = "Vous devez accepter les conditions d'utilisation";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: formData.role,
        }),
      });
      
      if (response.ok) {
        // Show success message
        const successMessage = "Inscription réussie ! Redirection vers la page de connexion...";
        setErrors({ submit: { type: 'success', message: successMessage } });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, submit: { type: 'error', message: errorData.error || 'Erreur lors de l\'inscription' } }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: { type: 'error', message: 'Une erreur est survenue. Veuillez réessayer.' } }));
    } finally {
      setIsLoading(false);
    }
  };

  // No phone formatting needed for username-based registration

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Décoration d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Section gauche - Formulaire */}
          <div className="p-8 md:p-10 lg:p-12">
            <div className="mb-8">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Retour à l'accueil
              </button>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-400 rounded-xl flex items-center justify-center shadow-lg">
                  <UserPlus className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">LAB<span className="text-teal-600">TUN</span></h1>
                  <p className="text-gray-600 text-sm">Laboratoire d'Analyses Médicales</p>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Créez votre <span className="text-teal-600">compte patient</span>
              </h2>
              <p className="text-gray-600">
                Inscrivez-vous pour accéder à vos résultats en ligne, prendre rendez-vous et gérer votre santé
              </p>
            </div>

            {/* Messages d'erreur/succès globaux */}
            {errors.submit && (
              <div className={`p-4 rounded-xl mb-6 ${
                errors.submit.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <p className="font-medium">{errors.submit.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username and Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4" />
                    Nom d'utilisateur *
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choisissez un nom d'utilisateur"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 ${
                      errors.username ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <UserPlus className="w-4 h-4" />
                    Rôle *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 ${
                      errors.role ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <option value="">Sélectionnez un rôle</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="TECHNICIAN">TECHNICIAN</option>
                    <option value="SECRETARY">SECRETARY</option>
                    <option value="MEDECIN">MEDECIN</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                </div>
              </div>

              {/* Adresse et Date de naissance */}
              {/* (Removed address and birthDate fields - using username/role/password only) */}

              {/* Mot de passe et Confirmation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Lock className="w-4 h-4" />
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Au moins 8 caractères"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 pr-12 ${
                        errors.password ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
                      }`}
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
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  <p className="text-xs text-gray-500 mt-1">Doit contenir une majuscule et un chiffre</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Lock className="w-4 h-4" />
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Retapez votre mot de passe"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 pr-12 ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Conditions d'utilisation */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  J'accepte les{' '}
                  <button type="button" className="text-teal-600 hover:underline font-medium">
                    conditions d'utilisation
                  </button>{' '}
                  et la{' '}
                  <button type="button" className="text-teal-600 hover:underline font-medium">
                    politique de confidentialité
                  </button>{' '}
                  du laboratoire LABTUN. Mes données seront traitées conformément à la loi tunisienne sur la protection des données personnelles.
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}

              {/* Bouton d'inscription */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Inscription en cours...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Créer mon compte patient</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Vous avez déjà un compte ?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                >
                  Connectez-vous
                </button>
              </p>
            </div>
          </div>

          {/* Section droite - Informations */}
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
                  Rejoignez <span className="text-teal-200">LABTUN</span>
                </h3>
                <p className="text-xl text-teal-100 opacity-90">
                  Votre partenaire santé en Tunisie
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  
                  <h4 className="text-2xl font-bold text-center mb-4">
                    Avantages de votre compte
                  </h4>
                  
                  <ul className="space-y-4 text-teal-100">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">✓</span>
                      </div>
                      <span>Accès sécurisé à vos résultats d'analyses 24h/24</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">✓</span>
                      </div>
                      <span>Prise de rendez-vous en ligne en quelques clics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">✓</span>
                      </div>
                      <span>Historique médical complet et sécurisé</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">✓</span>
                      </div>
                      <span>Notifications pour vos rendez-vous et résultats</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold">✓</span>
                      </div>
                      <span>Échange sécurisé avec le personnel médical</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-teal-200 mb-6">Vos données sont protégées</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <Microscope className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Certifié ISO 15189</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Données cryptées</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <User className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Confidentialité</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;