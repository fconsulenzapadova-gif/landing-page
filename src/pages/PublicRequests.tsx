import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/BackButton';
import { Loader2, Home, Send, User, Phone, Mail, MapPin, Euro, Building, Calendar, CheckCircle, Shield, ArrowLeft, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link, useSearchParams } from 'react-router-dom';
import { processClientRequest } from '@/utils/clientRequestProcessor';
import { FormattedInput } from '@/components/ui/formatted-input';

interface ClientRequest {
  name: string;
  phone: string;
  email: string;
  requestType: 'acquisto' | 'vendita' | 'locazione';
  propertyType: string;
  location: string;
  budget: string;
  timeframe: string;
  features: string;
  notes: string;
}

const PublicRequests: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Determina il tipo di richiesta dal parametro URL
  const getInitialRequestType = (): 'acquisto' | 'vendita' | 'locazione' => {
    const type = searchParams.get('type');
    if (type === 'acquisto' || type === 'vendita' || type === 'locazione') {
      return type;
    }
    return 'acquisto'; // default
  };
  
  const [formData, setFormData] = useState<ClientRequest>({
    name: '',
    phone: '',
    email: '',
    requestType: getInitialRequestType(),
    propertyType: '',
    location: '',
    budget: '',
    timeframe: '',
    features: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<ClientRequest>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientRequest> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome obbligatorio';
    if (!formData.phone.trim()) newErrors.phone = 'Telefono obbligatorio';
    if (!formData.email.trim()) newErrors.email = 'Email obbligatoria';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email non valida';
    if (!formData.location.trim()) newErrors.location = 'Zona obbligatoria';
    // Budget non è più obbligatorio

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ClientRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Map form data to the correct interface for clientRequestProcessor
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        requestType: formData.requestType,
        propertyType: formData.propertyType,
        budget: formData.budget,
        zona: formData.location, // Map location to zona
        features: formData.features,
        additionalDetails: `Timeframe: ${formData.timeframe}\nNote: ${formData.notes}` // Include timeframe in additional details
      };

      const result = await processClientRequest(requestData);
      
      if (result.success) {
        setSubmitted(true);
        toast({
          title: "Richiesta salvata!",
          description: result.message,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Errore invio richiesta:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-lime-200 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-lime-600" />
              </div>
              <h2 className="text-2xl font-bold text-lime-700 mb-2">Richiesta Inviata!</h2>
              <p className="text-emerald-600 mb-6">
                Grazie per aver inviato la tua richiesta. Ti contatterò entro 24 ore per discutere le tue esigenze.
              </p>
              <div className="space-y-3">
                <Link to="/">
                  <Button className="w-full bg-lime-600 hover:bg-lime-700">
                    <Home className="mr-2 h-4 w-4" />
                    Torna alla Home
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full border-lime-300 text-lime-700 hover:bg-lime-50"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      phone: '',
                      email: '',
                      requestType: 'acquisto',
                      propertyType: '',
                      location: '',
                      budget: '',
                      timeframe: '',
                      features: '',
                      notes: ''
                    });
                  }}
                >
                  Invia Nuova Richiesta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-white relative"
      style={{
        backgroundImage: 'url(/piazza-vicina.JPG)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay scuro per migliorare la leggibilità */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      {/* Back Button */}
      <div className="relative z-10">
        <BackButton to="/" label="Home" />
      </div>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Torna alla Home</span>
            </Link>
            <Link to="/client-access" className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors">
              <LogIn className="h-4 w-4" />
              <span className="text-sm">Area Clienti</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section 
        className="py-20 px-4 relative min-h-[400px] bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700" 
        style={{ 
          backgroundImage: 'url(/padova-test.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto text-center relative z-10 bg-emerald-600/80 backdrop-blur-sm rounded-xl border border-emerald-400/30 py-12 px-8 mx-4 sm:mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4 animate-fade-in bg-white/90 text-emerald-700 border-emerald-200 font-medium">
            Richiesta Gratuita
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-6 animate-slide-up drop-shadow-lg">
            Invia la Tua Richiesta
          </h1>
          <p className="text-xl text-emerald-50 mb-8 max-w-3xl mx-auto animate-fade-in drop-shadow-md">
            Compila il form sottostante con le tue esigenze. Ti contatterò entro 24 ore per offrirti 
            una consulenza personalizzata e gratuita.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 relative z-10">

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2 text-sm text-emerald-700">
            <Shield className="h-4 w-4 text-lime-600" />
            <span>Dati Protetti</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-emerald-700">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Consulenza Gratuita</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-emerald-700">
            <Phone className="h-4 w-4 text-teal-600" />
            <span>Risposta in 24h</span>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto shadow-lg border border-emerald-100 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center bg-emerald-50 rounded-t-lg">
            <CardTitle className="flex items-center justify-center space-x-2 text-2xl text-emerald-900">
              <Send className="h-6 w-6 text-emerald-600" />
              <span>Dettagli della Richiesta</span>
            </CardTitle>
            <p className="text-emerald-600 mt-2">
              Compila tutti i campi per ricevere una consulenza personalizzata
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-emerald-200">
                  <User className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-emerald-800">Informazioni Personali</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-emerald-700 flex items-center space-x-2">
                      <User className="h-4 w-4 text-emerald-600" />
                      <span>Nome Completo *</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Il tuo nome completo"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-emerald-700 flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-emerald-600" />
                        <span>Telefono *</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+39 123 456 7890"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-emerald-700 flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-emerald-600" />
                    <span>Email *</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Request Details Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-emerald-200">
                  <Building className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-emerald-800">Dettagli della Richiesta</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestType" className="text-sm font-medium text-emerald-700">Tipo di Richiesta *</Label>
                    <Select value={formData.requestType} onValueChange={(value: 'acquisto' | 'vendita' | 'locazione') => setFormData({...formData, requestType: value})}>
                      <SelectTrigger className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue placeholder="Seleziona il tipo di richiesta" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-emerald-200">
                        <SelectItem value="acquisto" className="hover:bg-emerald-50">Acquisto Casa</SelectItem>
                        <SelectItem value="vendita" className="hover:bg-emerald-50">Vendita Casa</SelectItem>
                        <SelectItem value="locazione" className="hover:bg-emerald-50">Locazione</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Property Details Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-emerald-200">
                  <Home className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-emerald-800">Dettagli dell'Immobile</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType" className="text-sm font-medium text-emerald-700">Tipo di Immobile</Label>
                    <Input
                      id="propertyType"
                      type="text"
                      placeholder="Es: Appartamento, Villa, Ufficio..."
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                      className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-emerald-700">Zona di Interesse *</Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Es: Centro storico, Periferia..."
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                      className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-sm font-medium text-emerald-700">Budget</Label>
                    <Input
                      id="budget"
                      type="text"
                      placeholder="Es: 200.000 - 300.000 €"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeframe" className="text-sm font-medium text-emerald-700">Tempistiche</Label>
                    <Input
                      id="timeframe"
                      type="text"
                      placeholder="Es: Entro 6 mesi"
                      value={formData.timeframe}
                      onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
                      className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-emerald-200">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-emerald-800">Dettagli Aggiuntivi</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="features" className="text-sm font-medium text-emerald-700">Caratteristiche Desiderate</Label>
                    <Textarea
                      id="features"
                      placeholder="Es: 3 camere, 2 bagni, giardino, garage..."
                      value={formData.features}
                      onChange={(e) => setFormData({...formData, features: e.target.value})}
                      rows={3}
                      className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-emerald-700">Note Aggiuntive</Label>
                    <Textarea
                      id="notes"
                      placeholder="Qualsiasi informazione aggiuntiva che ritieni utile..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={4}
                      className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <Alert className="border-emerald-200 bg-emerald-50">
                <Shield className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-700">
                  I tuoi dati personali saranno trattati nel rispetto della privacy e utilizzati esclusivamente per contattarti riguardo la tua richiesta. Non verranno mai condivisi con terze parti.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl" 
                  size="lg" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Invia Richiesta Gratuita
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-emerald-600" />
              <span>Tel: 379 260 6775</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-emerald-600" />
              <span>P.IVA: 0555 8150 289</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            © 2025 Filippo Marcuzzo - Consulente Immobiliare. I tuoi dati sono protetti e utilizzati solo per contattarti riguardo la tua richiesta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicRequests;