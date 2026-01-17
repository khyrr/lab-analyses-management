import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ShieldCheck, 
  Microscope, 
  Users, 
  Clock, 
  FileText, 
  Award, 
  Phone, 
  MapPin, 
  Mail,
  ChevronRight,
  HeartPulse,
  Beaker,
  Stethoscope,
  Leaf,
  LogOut,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Button = ({ children, primary, onClick, ...props }) => (
  <button
    className={`inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      primary
        ? 'text-white bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
        : 'text-teal-700 bg-white border border-teal-200 hover:bg-teal-50 focus:ring-teal-300 shadow-sm hover:shadow-md'
    }`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ icon: Icon, title, description, delay }) => (
  <div 
    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-14 h-14 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-7 h-7 text-teal-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const Section = ({ children, bg, className = "" }) => (
  <section className={`py-16 ${bg} ${className}`}>
    <div className="container mx-auto px-4 md:px-6">
      {children}
    </div>
  </section>
);

const StatCard = ({ number, label, icon: Icon }) => (
  <div className="text-center p-4">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
      <Icon className="w-8 h-8 text-teal-600" />
    </div>
    <div className="text-3xl font-bold text-teal-700 mb-1">{number}</div>
    <div className="text-gray-600 font-medium">{label}</div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole'); // Changed from 'role' to 'userRole'
    const user = localStorage.getItem('username');
    
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
      setUsername(user);
    }
  }, []);

  const handleButtonClick = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    // Clear all auth data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole'); // Changed from 'role' to 'userRole'
    localStorage.removeItem('username');
    
    // Update state
    setIsLoggedIn(false);
    setUserRole(null);
    setUsername(null);
    
    // Redirect to home
    navigate('/');
  };

  const handleEspacePatient = () => {
    if (isLoggedIn && userRole) {
      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'SECRETARY':
          navigate('/secretary');
          break;
        case 'TECHNICIAN':
          navigate('/technician');
          break;
        case 'MEDECIN':
          navigate('/doctor');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  const services = [
    { icon: HeartPulse, title: "Analyses Biochimiques", description: "Bilan rénal, hépatique, lipidique et glycémique avec résultats rapides et précis." },
    { icon: Beaker, title: "Hématologie Complète", description: "Numération formule sanguine, coagulation et groupes sanguins." },
    { icon: Microscope, title: "Microbiologie", description: "Examens bactériologiques, parasitologiques et mycologiques." },
    { icon: Stethoscope, title: "Examens Spécialisés", description: "Hormonologie, toxicologie et marqueurs tumoraux." },
    { icon: ShieldCheck, title: "Analyses Urgences", description: "Résultats express pour les urgences médicales." },
    { icon: Leaf, title: "Biologie Moléculaire", description: "Tests PCR et analyses génétiques avancées." },
  ];

  const features = [
    { icon: Clock, title: "Résultats Rapides", description: "90% des résultats disponibles sous 24h" },
    { icon: ShieldCheck, title: "Qualité Certifiée", description: "Accréditation selon les normes ISO 15189" },
    { icon: Users, title: "Équipe Expert", description: "Biologistes et techniciens diplômés" },
    { icon: Award, title: "Précision Garantie", description: "Contrôles qualité quotidiens" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-400 rounded-xl flex items-center justify-center shadow-md">
                <Microscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">LAB<span className="text-teal-600">TUN</span></div>
                <div className="text-sm text-gray-500 -mt-1">Laboratoire d'Analyses Médicales</div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#accueil" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Accueil</a>
              <a href="#services" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Services</a>
              <a href="#pourquoi" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Pourquoi Nous</a>
              <a href="#contact" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Contact</a>
            </nav>
            
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-lg">
                    <User className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-medium text-teal-700">{username}</span>
                  </div>
                  <Button onClick={handleEspacePatient}>
                    Mon Tableau de Bord
                  </Button>
                  <Button onClick={handleLogout}>
                    <LogOut className="w-5 h-5 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => handleButtonClick('/login')}>Espace Patient</Button>
                  <Button primary onClick={() => handleButtonClick('/appointment')}>
                    <Calendar className="w-5 h-5 mr-2" />
                    Prendre RDV
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Section id="accueil" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-50/80 to-white/80"></div>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeIn">
            <div className="inline-flex items-center px-4 py-2 bg-teal-100 rounded-full text-teal-700 font-medium mb-6">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Laboratoire Accrédité en Tunisie
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Votre Santé,
              <span className="block text-teal-600">Notre Priorité</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Laboratoire médical tunisien d'excellence, offrant des analyses précises et fiables 
              avec des résultats rapides. Votre partenaire santé de confiance.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Button primary onClick={() => handleButtonClick('/appointment')}>
                Prendre un Rendez-vous
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button onClick={() => handleButtonClick('/results')}>
                <FileText className="w-5 h-5 mr-2" />
                Résultats en Ligne
              </Button>
            </div>

            <div className="flex flex-wrap gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mr-3">
                    <feature.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-3xl shadow-2xl overflow-hidden">
              <div className="aspect-[4/3] relative">
                {/* Image du laboratoire */}
                <img 
                  src="/labimg.png" 
                  alt="Laboratoire d'analyses médicales moderne avec équipements de pointe"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback si l'image ne charge pas
                    e.target.style.display = 'none';
                    const container = e.target.parentNode;
                    container.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br from-teal-500 to-teal-300 flex items-center justify-center p-8">
                        <div class="text-center">
                          <svg class="w-24 h-24 mx-auto mb-6 opacity-90 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                          </svg>
                          <h3 class="text-2xl font-bold text-white mb-2">Laboratoire Moderne</h3>
                          <p class="opacity-90 text-white">Équipements de dernière génération pour des résultats précis</p>
                        </div>
                      </div>
                    `;
                  }}
                />
                {/* Overlay pour améliorer la lisibilité du texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/40 via-transparent to-transparent"></div>
                
                {/* Texte superposé */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-4">
                    <Microscope className="w-5 h-5 mr-2" />
                    Technologie de Pointe
                  </div>
                  
                </div>
              </div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 w-64">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-teal-700">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction patients</div>
                </div>
                <Users className="w-10 h-10 text-teal-100" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section bg="bg-gradient-to-r from-teal-600 to-teal-500" className="text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard number="15K+" label="Patients Satisfaits" icon={Users} />
          <StatCard number="24h" label="Délai Moyen Résultats" icon={Clock} />
          <StatCard number="150+" label="Types d'Analyses" icon={Beaker} />
          <StatCard number="10+" label="Années d'Expérience" icon={Award} />
        </div>
      </Section>

      {/* Services Section */}
      <Section id="services">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-teal-50 rounded-full text-teal-700 font-medium mb-4">
            <Beaker className="w-4 h-4 mr-2" />
            Nos Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Analyses Médicales <span className="text-teal-600">Complètes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des analyses biologiques précises et fiables réalisées avec des équipements de pointe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              delay={index * 100}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button primary onClick={() => handleButtonClick('/services')}>
            Voir Tous Nos Services
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section id="pourquoi" bg="bg-gradient-to-b from-white to-teal-50/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-teal-50 rounded-full text-teal-700 font-medium mb-4">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Pourquoi Nous Choisir
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Excellence Médicale à <span className="text-teal-600">Votre Service</span>
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  icon: Award,
                  title: "Accréditation Internationale",
                  description: "Notre laboratoire est accrédité selon les normes internationales les plus strictes."
                },
                {
                  icon: Microscope,
                  title: "Technologie de Pointe",
                  description: "Équipements automatisés dernière génération pour une précision optimale."
                },
                {
                  icon: Users,
                  title: "Équipe Expérimentée",
                  description: "Biologistes médicaux et techniciens spécialisés avec plus de 10 ans d'expérience."
                },
                {
                  icon: Clock,
                  title: "Service Rapide",
                  description: "Résultats disponibles rapidement en ligne ou sur place selon vos préférences."
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-white transition-colors">
                  <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-white rounded-3xl p-8 shadow-xl border border-teal-100">
            <div className="aspect-[4/3] bg-gradient-to-br from-teal-500/10 to-teal-300/10 rounded-2xl flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Confiance & <span className="text-teal-600">Fiabilité</span>
                </h3>
                <p className="text-gray-600 mb-6">
                  Votre santé mérite le meilleur. Nous nous engageons à fournir des résultats 
                  précis et fiables pour un diagnostic médical fiable.
                </p>
                <Button primary onClick={() => handleButtonClick('/appointment')}>
                  Prendre RDV Maintenant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Contact & Info */}
      <Section id="contact" bg="bg-gradient-to-r from-gray-900 to-teal-900" className="text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                <Microscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">LAB<span className="text-teal-300">TUN</span></div>
                <div className="text-teal-200 text-sm">Laboratoire d'Analyses Médicales</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Votre partenaire santé de confiance en Tunisie, offrant des services 
              d'analyses médicales de haute qualité depuis plus de 10 ans.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Heures d'Ouverture</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span>Lun - Ven</span>
                <span>7:00 - 19:00</span>
              </div>
              <div className="flex justify-between">
                <span>Samedi</span>
                <span>8:00 - 15:00</span>
              </div>
              <div className="flex justify-between">
                <span>Dimanche</span>
                <span>Urgences uniquement</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-teal-300" />
                <span>Avenue Habib Bourguiba, Tunis, Tunisie</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-teal-300" />
                <span>+216 70 000 000</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-teal-300" />
                <span>contact@labtun.tn</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} LABTUN - Laboratoire d'Analyses Médicales. Tous droits réservés.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => handleButtonClick('/login')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Espace Patient
              </button>
              <button 
                onClick={() => handleButtonClick('/results')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Résultats en Ligne
              </button>
              <button 
                onClick={() => handleButtonClick('/privacy')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Confidentialité
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>Laboratoire accrédité selon les normes ISO 15189 • N° d'agrément: XXX/XXXX/XXXX</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;