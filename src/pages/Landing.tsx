import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  ArrowRight,
  Key,
  Search,
  FileText,
  ChevronDown,
  ChevronUp,
  Plane,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const [showAboutSection, setShowAboutSection] = useState(false);
  const [isGemutDefinitionOpen, setIsGemutDefinitionOpen] = useState(false);
  const [hasMobileClaimRevealed, setHasMobileClaimRevealed] = useState(false);
  const [hasDesktopServicesRevealed, setHasDesktopServicesRevealed] = useState(false);
  const [revealedMobileServiceItems, setRevealedMobileServiceItems] = useState<Set<number>>(
    new Set(),
  );
  const aboutTextRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const servicesSectionRef = useRef<HTMLElement>(null);
  const serviceRevealRefs = useRef<(HTMLDivElement | null)[]>([]);
  const servicesLastScrollYRef = useRef(0);
  const servicesScrollDirectionRef = useRef<'up' | 'down'>('down');

  const handleGemutPointerEnter = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'touch') setIsGemutDefinitionOpen(true);
  };

  const handleGemutDisclosurePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') setIsGemutDefinitionOpen(false);
  };

  const handleGemutPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'touch') setIsGemutDefinitionOpen((isOpen) => !isOpen);
  };

  const handleGemutFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
    if (event.currentTarget.matches(':focus-visible')) setIsGemutDefinitionOpen(true);
  };

  const handleGemutBlur = () => setIsGemutDefinitionOpen(false);

  useEffect(() => {
    if (hasMobileClaimRevealed) return;

    lastScrollYRef.current = window.scrollY;
    const mobileQuery = window.matchMedia('(max-width: 767px)');

    const revealMobileClaim = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      if (mobileQuery.matches && isScrollingDown && currentScrollY > 24) {
        setHasMobileClaimRevealed(true);
      }
    };

    window.addEventListener('scroll', revealMobileClaim, { passive: true });
    return () => window.removeEventListener('scroll', revealMobileClaim);
  }, [hasMobileClaimRevealed]);

  useEffect(() => {
    const servicesSection = servicesSectionRef.current;
    const serviceItems = serviceRevealRefs.current.filter(
      (item): item is HTMLDivElement => item !== null,
    );

    if (!servicesSection || serviceItems.length !== 4) return;

    if (!('IntersectionObserver' in window)) {
      setHasDesktopServicesRevealed(true);
      setRevealedMobileServiceItems(new Set([0, 1, 2, 3]));
      return;
    }

    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    servicesLastScrollYRef.current = window.scrollY;

    const trackServicesScrollDirection = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY === servicesLastScrollYRef.current) return;

      servicesScrollDirectionRef.current =
        currentScrollY > servicesLastScrollYRef.current ? 'down' : 'up';
      servicesLastScrollYRef.current = currentScrollY;
    };

    const syncServicesBreakpoint = () => {
      const sectionRect = servicesSection.getBoundingClientRect();
      const sectionIsVisible = sectionRect.top < window.innerHeight && sectionRect.bottom > 0;

      if (desktopQuery.matches) {
        setHasDesktopServicesRevealed(sectionIsVisible);
        return;
      }

      const mobileBoundary = window.innerHeight * 0.9;
      const visibleItems = new Set<number>();
      serviceItems.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < mobileBoundary && itemRect.bottom > 0) {
          visibleItems.add(Number(item.dataset.serviceRevealIndex));
        }
      });

      setRevealedMobileServiceItems((currentItems) => {
        const hasChanged =
          visibleItems.size !== currentItems.size ||
          [...visibleItems].some((index) => !currentItems.has(index));
        return hasChanged ? visibleItems : currentItems;
      });
    };

    window.addEventListener('scroll', trackServicesScrollDirection, { passive: true });
    desktopQuery.addEventListener('change', syncServicesBreakpoint);
    mobileQuery.addEventListener('change', syncServicesBreakpoint);

    const desktopObserver = new IntersectionObserver(
      ([entry]) => {
        if (!desktopQuery.matches) return;

        if (entry.isIntersecting) {
          setHasDesktopServicesRevealed(servicesScrollDirectionRef.current === 'down');
          return;
        }

        if (
          !entry.isIntersecting &&
          servicesScrollDirectionRef.current === 'up' &&
          entry.boundingClientRect.top >= window.innerHeight
        ) {
          setHasDesktopServicesRevealed(false);
        }
      },
      { threshold: 0.15 },
    );

    const mobileObserver = new IntersectionObserver(
      (entries) => {
        if (!mobileQuery.matches) return;
        const direction = servicesScrollDirectionRef.current;

        setRevealedMobileServiceItems((currentItems) => {
          const nextItems = new Set(currentItems);
          entries.forEach((entry) => {
            const index = Number((entry.target as HTMLElement).dataset.serviceRevealIndex);

            if (entry.isIntersecting && direction === 'down') {
              nextItems.add(index);
            }

            if (
              !entry.isIntersecting &&
              direction === 'up' &&
              entry.boundingClientRect.top < window.innerHeight * 0.9
            ) {
              return;
            }

            if (!entry.isIntersecting && direction === 'up') {
              nextItems.delete(index);
            }
          });
          const hasChanged =
            nextItems.size !== currentItems.size ||
            [...nextItems].some((index) => !currentItems.has(index));
          return hasChanged ? nextItems : currentItems;
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );

    desktopObserver.observe(servicesSection);
    serviceItems.forEach((item) => mobileObserver.observe(item));

    return () => {
      desktopObserver.disconnect();
      mobileObserver.disconnect();
      window.removeEventListener('scroll', trackServicesScrollDirection);
      desktopQuery.removeEventListener('change', syncServicesBreakpoint);
      mobileQuery.removeEventListener('change', syncServicesBreakpoint);
    };
  }, []);

  useEffect(() => {
    if (!showAboutSection) return;

    const scrollTimer = window.setTimeout(() => {
      aboutTextRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 120);

    return () => window.clearTimeout(scrollTimer);
  }, [showAboutSection]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section 
        className="relative min-h-[500px] px-4 py-16 sm:py-20"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/prato-padova.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container relative z-10 mx-auto text-center">
          <Badge variant="secondary" className="mb-8 animate-fade-in">
            agenzia di mediazione immobiliare
          </Badge>
          <div onPointerLeave={handleGemutDisclosurePointerLeave}>
            <div
              id="gemut-definition"
              aria-hidden={!isGemutDefinitionOpen}
              className={`grid transition-[grid-template-rows,opacity,transform,margin] duration-300 ease-out ${
                isGemutDefinitionOpen
                  ? 'mb-5 grid-rows-[1fr] translate-y-0 opacity-100'
                  : 'mb-0 grid-rows-[0fr] -translate-y-2 opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="mx-auto max-w-3xl text-sm leading-relaxed text-blue-50 drop-shadow-md sm:text-base">
                  Il termine tedesco Gemüt indica l'animo, lo spirito o l'indole di una persona,
                  rappresenta la sfera emotiva, il cuore o il temperamento intesi come sede dei
                  sentimenti.
                </p>
              </div>
            </div>
            <h2 className="mx-auto mb-5 max-w-5xl animate-slide-up text-4xl font-bold text-white drop-shadow-lg sm:text-5xl">
              <button
                type="button"
                className="rounded-sm text-sky-200 underline decoration-sky-200/50 decoration-2 underline-offset-4 transition-colors hover:text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-expanded={isGemutDefinitionOpen}
                aria-controls="gemut-definition"
                onPointerEnter={handleGemutPointerEnter}
                onPointerUp={handleGemutPointerUp}
                onFocus={handleGemutFocus}
                onBlur={handleGemutBlur}
              >
                Gemüt Capital
              </button>
              , il tuo partner immobiliare{' '}
              <span className="text-sky-200">di fiducia</span>.
            </h2>
          </div>
          <p
            className={`mx-auto mb-8 max-w-3xl text-xl text-gray-100 drop-shadow-md transition-all duration-500 ease-out motion-reduce:transition-none md:translate-y-0 md:opacity-100 ${
              hasMobileClaimRevealed
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            Esperienza, professionalità e tecnologia al servizio delle tue esigenze immobiliari.
            Trova la casa dei tuoi sogni o vendi al miglior prezzo con il supporto di un esperto.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesSectionRef} className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div
            ref={(element) => {
              serviceRevealRefs.current[0] = element;
            }}
            data-service-reveal-index="0"
            className={`mb-12 text-center transition-all duration-700 ease-out motion-reduce:transition-none ${
              revealedMobileServiceItems.has(0)
                ? 'translate-x-0 opacity-100'
                : '-translate-x-8 opacity-0'
            } ${
              hasDesktopServicesRevealed
                ? 'md:translate-x-0 md:translate-y-0 md:opacity-100 md:[transition-delay:0ms]'
                : 'md:translate-x-0 md:-translate-y-8 md:opacity-0 md:[transition-delay:450ms]'
            }`}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">I Nostri Servizi</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un servizio completo e personalizzato per ogni esigenza immobiliare
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div
              ref={(element) => {
                serviceRevealRefs.current[1] = element;
              }}
              data-service-reveal-index="1"
              className={`h-full transition-all duration-700 ease-out motion-reduce:transition-none ${
                revealedMobileServiceItems.has(1)
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-8 opacity-0'
              } ${
                hasDesktopServicesRevealed
                  ? 'md:translate-x-0 md:translate-y-0 md:opacity-100 md:[transition-delay:450ms]'
                  : 'md:translate-x-0 md:-translate-y-8 md:opacity-0 md:[transition-delay:300ms]'
              }`}
            >
              <Link to="/acquisto-casa" className="block h-full">
                <Card className="bg-gray-100/[0.35] shadow-none hover:shadow-none transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100/[0.45] active:scale-100 active:bg-gray-100/[0.45] cursor-pointer h-full border-2 border-gray-200/60 hover:border-gray-200 active:border-gray-200 flex flex-col">
                  <CardHeader className="items-center text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 hover:bg-blue-200 transition-colors duration-200">
                      <Search className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-center">
                      Sto cercando un immobile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 items-start justify-center text-center">
                    <p className="text-gray-600">
                      Ti aiutiamo a trovare la casa perfetta per le tue esigenze, gestendo ogni aspetto della trattativa.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div
              ref={(element) => {
                serviceRevealRefs.current[2] = element;
              }}
              data-service-reveal-index="2"
              className={`h-full transition-all duration-700 ease-out motion-reduce:transition-none ${
                revealedMobileServiceItems.has(2)
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-8 opacity-0'
              } ${
                hasDesktopServicesRevealed
                  ? 'md:translate-x-0 md:translate-y-0 md:opacity-100 md:[transition-delay:600ms]'
                  : 'md:translate-x-0 md:-translate-y-8 md:opacity-0 md:[transition-delay:150ms]'
              }`}
            >
              <Link to="/vendita-immobili" className="block h-full">
                <Card className="bg-gray-100/[0.35] shadow-none hover:shadow-none transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100/[0.45] active:scale-100 active:bg-gray-100/[0.45] cursor-pointer h-full border-2 border-gray-200/60 hover:border-gray-200 active:border-gray-200 flex flex-col">
                  <CardHeader className="items-center text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 hover:bg-green-200 transition-colors duration-200">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-center">
                      Vorrei sapere quanto vale il mio immobile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 items-start justify-center text-center">
                    <p className="text-gray-600">
                      Massimizza il valore della tua proprietà con strategie di marketing innovative.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div
              ref={(element) => {
                serviceRevealRefs.current[3] = element;
              }}
              data-service-reveal-index="3"
              className={`h-full transition-all duration-700 ease-out motion-reduce:transition-none ${
                revealedMobileServiceItems.has(3)
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-8 opacity-0'
              } ${
                hasDesktopServicesRevealed
                  ? 'md:translate-x-0 md:translate-y-0 md:opacity-100 md:[transition-delay:750ms]'
                  : 'md:translate-x-0 md:-translate-y-8 md:opacity-0 md:[transition-delay:0ms]'
              }`}
            >
              <Link to="/locazioni" className="block h-full">
                <Card className="bg-gray-100/[0.35] shadow-none hover:shadow-none transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100/[0.45] active:scale-100 active:bg-gray-100/[0.45] cursor-pointer h-full border-2 border-gray-200/60 hover:border-gray-200 active:border-gray-200 flex flex-col">
                  <CardHeader className="items-center text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 hover:bg-purple-200 transition-colors duration-200">
                      <Key className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-center">
                      Servizi per l'affitto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 items-start justify-center text-center">
                    <p className="text-gray-600">
                      Servizi completi per affitti, sia per proprietari che per inquilini.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Chi Sono Io Toggle Button */}
      <section className="py-8 px-4 bg-white border-b border-gray-100">
        <div className="container mx-auto text-center">
          <Button
            onClick={() => setShowAboutSection(!showAboutSection)}
            variant="outline"
            size="lg"
            className="bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Users className="mr-2 h-5 w-5" />
            {showAboutSection ? 'Nascondi Chi Sono Io' : 'Scopri Chi Sono Io'}
            {showAboutSection ? (
              <ChevronUp className="ml-2 h-5 w-5" />
            ) : (
              <ChevronDown className="ml-2 h-5 w-5" />
            )}
          </Button>
        </div>
      </section>

      {/* Chi Sono Io Section - Collapsible */}
      {showAboutSection && (
        <section className="py-20 px-4 bg-white animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Image and Stats */}
                <div className="relative">
                  <div className="relative">
                    <div className="w-full h-96 flex items-center justify-center">
                      <img 
                        src="/profile.jpg" 
                        alt="Filippo Marcuzzo" 
                        className="h-full w-auto max-w-full rounded-2xl shadow-lg object-contain transition-transform duration-500 hover:scale-105" 
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - About Content */}
                <div
                  ref={aboutTextRef}
                  className="space-y-6 scroll-mt-24 transition-all duration-700 ease-out"
                >
                  <div>
                    <Badge variant="secondary" className="mb-4">
                      Chi Sono Io
                    </Badge>
                    <h3 className="text-4xl font-bold text-gray-900 mb-6">
                      La Tua Guida nel Mondo
                      <span className="text-blue-600"> Immobiliare</span>
                    </h3>
                  </div>

                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p className="text-lg">
                      Sono <strong className="text-gray-900">Filippo Marcuzzo</strong>, mediatore immobiliare abilitato, specializzato in operazioni di investimento e valorizzazione patrimoniale nel mercato di Padova e provincia.
                    </p>
                    
                    <p>
                      La mia attività nasce da una visione chiara: trasformare ogni immobile in un'opportunità strategica, capace di generare rendimento, valore e crescita nel tempo.
                    </p>
                    
                    <p>
                      Collaboro con investitori privati, professionisti e società nella ricerca, acquisizione e gestione di asset immobiliari residenziali e commerciali, seguendo ogni fase del processo — dall'analisi preliminare fino alla rivendita o alla messa a reddito.
                    </p>
                    
                    <p>
                      Il mio approccio si basa su analisi di mercato accurate, strategie personalizzate e gestione trasparente delle trattative, con l'obiettivo di ottimizzare il ritorno sull'investimento e minimizzare i rischi operativi e fiscali.
                    </p>
                    
                    <p>
                      Grazie a una rete consolidata di professionisti qualificati — notai, tecnici, avvocati e consulenti fiscali — offro un servizio completo, integrato e strutturato, capace di adattarsi a ogni esigenza, dall'investitore privato fino alle realtà corporate.
                    </p>
                    
                    <p>
                      Credo che l'investimento immobiliare debba essere gestito con metodo, visione e competenza. Per questo accompagno i miei clienti in percorsi di crescita patrimoniale consapevoli, fondati su strategia, solidità e risultati misurabili.
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6">
                    <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <Link to="/richieste?type=acquisto">
                        <Phone className="mr-2 h-5 w-5" />
                        Parliamone Insieme
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Me Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Perché Sceglierci</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La nostra esperienza e dedizione fanno la differenza nel tuo percorso immobiliare
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Esperienza Consolidata</h4>
              <p className="text-sm text-gray-600">Anni di esperienza nel settore immobiliare</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Massima Trasparenza</h4>
              <p className="text-sm text-gray-600">Comunicazione chiara e onesta in ogni fase</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Servizio Personalizzato</h4>
              <p className="text-sm text-gray-600">Ogni cliente è unico e merita attenzione dedicata</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="font-semibold mb-2">Rete Professionale Consolidata</h4>
              <p className="text-sm text-gray-600">Collaborazioni attive con studi notarili, legali e commercialisti di fiducia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Servizi su Misura Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Servizi su Misura</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Soluzioni innovative e personalizzate per valorizzare al meglio il tuo patrimonio immobiliare
            </p>
          </div>
          
          <div className="mx-auto grid max-w-[44rem] gap-5 md:grid-cols-2">
            {/* UAV Roof Inspection */}
            <Card className="flex h-full min-h-[18rem] flex-col border-2 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-indigo-200 hover:shadow-xl md:min-h-0">
              <CardHeader className="p-4 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 transition-colors duration-200 hover:bg-indigo-200">
                  <Plane className="h-[1.375rem] w-[1.375rem] text-indigo-600" />
                </div>
                <CardTitle className="text-[0.875rem] leading-tight text-gray-900">
                  Verifica Stato Tetto tramite UAV
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col p-4 pt-0 text-center">
                <p className="mb-4 flex-1 text-[0.875rem] leading-snug text-gray-600">
                  Ispezione professionale del tetto utilizzando droni di ultima generazione per una valutazione accurata e sicura.
                </p>
                <Link to="/verifica-stato-tetto/" className="mt-auto">
                  <Button className="h-7 w-full bg-indigo-600 px-3 text-[0.7rem] text-white hover:bg-indigo-700">
                    Scopri di Più
                    <ArrowRight className="ml-1.5 h-[0.6875rem] w-[0.6875rem]" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Patrimony Evaluation */}
            <Card className="flex h-full min-h-[18rem] flex-col border-2 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-green-200 hover:shadow-xl md:min-h-0">
              <CardHeader className="p-4 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-100 transition-colors duration-200 hover:bg-green-200">
                  <BarChart3 className="h-[1.375rem] w-[1.375rem] text-green-600" />
                </div>
                <CardTitle className="text-[0.875rem] leading-tight text-gray-900">
                  Valutazione per Patrimonio
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col p-4 pt-0 text-center">
                <p className="mb-4 flex-1 text-[0.875rem] leading-snug text-gray-600">
                  Analisi approfondita del valore del tuo patrimonio immobiliare per decisioni di investimento consapevoli.
                </p>
                <Link to="/valutazione-patrimonio/" className="mt-auto">
                  <Button className="h-7 w-full bg-indigo-600 px-3 text-[0.7rem] text-white hover:bg-indigo-700">
                    Scopri di Più
                    <ArrowRight className="ml-1.5 h-[0.6875rem] w-[0.6875rem]" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* CTA for Custom Services */}
          <div className="text-center mt-12">
            <Link to="/servizi-personalizzati" className="inline-flex max-w-full">
              <Button size="lg" className="h-auto max-w-full whitespace-normal bg-indigo-600 py-3 text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl">
                <FileText className="mr-2 h-5 w-5" />
                Richiedi un Servizio Personalizzato
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Pronto a Iniziare?</h3>
          <p className="text-xl mb-8 text-blue-100">
            Contattaci oggi stesso per una consulenza gratuita e personalizzata
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/richieste?type=acquisto">
              <Button 
                size="lg" 
                variant="secondary" 
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 hover:text-primary/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/20"
              >
                <FileText className="mr-2 h-5 w-5" />
                Invia la Tua Richiesta
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Contatti</h3>
            <p className="text-gray-600">Siamo sempre disponibili per rispondere alle tue domande</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <a 
              href="https://wa.me/393792606775" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center hover:scale-105 transition-all duration-300 cursor-pointer" 
              aria-label="Contattaci su WhatsApp"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 translucent-button">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">WhatsApp</h4>
              <p className="text-gray-600">379 260 6775</p>
            </a>
            
            <a 
              href="mailto:info@gemutcapital.com"
              className="block text-center hover:scale-105 transition-all duration-300 cursor-pointer" 
              aria-label="Invia email a info@gemutcapital.com"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 translucent-button">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-gray-600">info@gemutcapital.com</p>
            </a>
            
            <div className="text-center hover:scale-105 transition-all duration-300 cursor-pointer" role="button" tabIndex={0} aria-label="Informazioni ufficio">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 translucent-button">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Ufficio</h4>
              <p className="text-gray-600">Indirizzo ufficio</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
