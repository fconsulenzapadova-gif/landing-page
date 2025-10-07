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
import { Link } from 'react-router-dom';
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
  
  const [formData, setFormData] = useState<ClientRequest>({
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

  const [errors, setErrors] = useState<Partial<ClientRequest>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientRequest> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome obbligatorio';
    if (!formData.phone.trim()) newErrors.phone = 'Telefono obbligatorio';
    if (!formData.email.trim()) newErrors.email = 'Email obbligatoria';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email non valida';
    if (!formData.location.trim()) newErrors.location = 'Zona obbligatoria';
    if (!formData.budget.trim()) newErrors.budget = 'Budget obbligatorio';

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Richiesta Inviata!</h2>
              <p className="text-gray-600 mb-6">
                Grazie per aver inviato la tua richiesta. Ti contatterò entro 24 ore per discutere le tue esigenze.
              </p>
              <div className="space-y-3">
                <Link to="/">
                  <Button className="w-full">
                    <Home className="mr-2 h-4 w-4" />
                    Torna alla Home
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Back Button */}
      <BackButton to="/" label="Home" />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                <div className="text-primary">‹</div>
                Home
              </Link>
            </nav>
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Filippo Marcuzzo</h1>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section 
        className="py-20 px-4 relative min-h-[400px] bg-gradient-to-r from-blue-500 to-purple-600" 
        style={{ 
          backgroundImage: 'url(/padova-test.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-4 animate-fade-in">
            Richiesta Gratuita
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-6 animate-slide-up drop-shadow-lg">
            Invia la Tua Richiesta
          </h1>
          <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto animate-fade-in drop-shadow-md">
            Compila il form sottostante con le tue esigenze. Ti contatterò entro 24 ore per offrirti 
            una consulenza personalizzata e gratuita.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Dati Protetti</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <span>Consulenza Gratuita</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="h-4 w-4 text-purple-600" />
            <span>Risposta in 24h</span>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto shadow-xl border-2 backdrop-blur-lg bg-white/95">
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
            <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
              <Send className="h-6 w-6 text-primary" />
              <span>Dettagli della Richiesta</span>
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Compila tutti i campi per ricevere una consulenza personalizzata
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Informazioni Personali</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Nome e Cognome *</Label>
                    <Input
                      id="name"
                      placeholder="Il tuo nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`transition-all duration-200 ${errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}`}
                    />
                    {errors.name && <p className="text-sm text-red-500 flex items-center space-x-1"><span>⚠️</span><span>{errors.name}</span></p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Telefono *</Label>
                    <Input
                      id="phone"
                      placeholder="+39 XXX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`transition-all duration-200 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}`}
                    />
                    {errors.phone && <p className="text-sm text-red-500 flex items-center space-x-1"><span>⚠️</span><span>{errors.phone}</span></p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tua@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`transition-all duration-200 ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}`}
                  />
                  {errors.email && <p className="text-sm text-red-500 flex items-center space-x-1"><span>⚠️</span><span>{errors.email}</span></p>}
                </div>
              </div>

              {/* Request Details Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <Building className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Dettagli della Richiesta</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="requestType" className="text-sm font-medium">Tipo di Richiesta *</Label>
                  <Select value={formData.requestType} onValueChange={(value: 'acquisto' | 'vendita' | 'locazione') => handleInputChange('requestType', value)}>
                    <SelectTrigger className="transition-all duration-200 focus:border-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acquisto">🏠 Acquisto</SelectItem>
                      <SelectItem value="vendita">💰 Vendita</SelectItem>
                      <SelectItem value="locazione">🔑 Locazione</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <Home className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Dettagli dell'Immobile</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType" className="text-sm font-medium">Tipo di Immobile</Label>
                    <Input
                      id="propertyType"
                      placeholder="es. Appartamento, Villa, Ufficio..."
                      value={formData.propertyType}
                      onChange={(e) => handleInputChange('propertyType', e.target.value)}
                      className="transition-all duration-200 focus:border-primary hover:border-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Zona di Interesse *</Label>
                    <Input
                      id="location"
                      placeholder="es. Centro, Periferia, Quartiere specifico..."
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`transition-all duration-200 ${errors.location ? 'border-red-500 focus:border-red-500' : 'focus:border-primary hover:border-gray-400'}`}
                    />
                    {errors.location && <p className="text-sm text-red-500 flex items-center space-x-1"><span>⚠️</span><span>{errors.location}</span></p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-sm font-medium">Budget *</Label>
                    <FormattedInput
                      id="budget"
                      placeholder="es. €200.000, €1.500/mese..."
                      value={formData.budget}
                      onChange={(formatted) => handleInputChange('budget', formatted)}
                      className={`transition-all duration-200 ${errors.budget ? 'border-red-500 focus:border-red-500' : 'focus:border-primary hover:border-gray-400'}`}
                    />
                    {errors.budget && <p className="text-sm text-red-500 flex items-center space-x-1"><span>⚠️</span><span>{errors.budget}</span></p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeframe" className="text-sm font-medium">Tempistiche</Label>
                    <Input
                      id="timeframe"
                      placeholder="es. Entro 3 mesi, Non urgente..."
                      value={formData.timeframe}
                      onChange={(e) => handleInputChange('timeframe', e.target.value)}
                      className="transition-all duration-200 focus:border-primary hover:border-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Dettagli Aggiuntivi</h3>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="features" className="text-sm font-medium">Caratteristiche Desiderate</Label>
                  <Textarea
                    id="features"
                    placeholder="es. 3 camere, 2 bagni, giardino, garage, ascensore, terrazzo..."
                    value={formData.features}
                    onChange={(e) => handleInputChange('features', e.target.value)}
                    rows={3}
                    className="transition-all duration-200 focus:border-primary hover:border-gray-400 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">Note Aggiuntive</Label>
                  <Textarea
                    id="notes"
                    placeholder="Qualsiasi altra informazione che ritieni utile..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="transition-all duration-200 focus:border-primary hover:border-gray-400 resize-none"
                  />
                </div>
              </div>

              {/* Privacy Notice */}
              <Alert className="border-blue-200 bg-blue-50/50 backdrop-blur-sm">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  I tuoi dati personali saranno utilizzati esclusivamente per contattarti riguardo la tua richiesta 
                  e non saranno condivisi con terze parti. Rispettiamo la tua privacy secondo il GDPR.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl" 
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
        <div className="text-center mt-8 space-y-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Tel: 379 260 6775</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>P.IVA: 0555 8150 289</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Filippo Marcuzzo - Consulente Immobiliare. I tuoi dati sono protetti e utilizzati solo per contattarti riguardo la tua richiesta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicRequests;