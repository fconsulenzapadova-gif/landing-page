import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Home, Send, User, Phone, Mail, MapPin, Euro, Building, Calendar, CheckCircle, Shield, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { processClientRequest } from '@/utils/clientRequestProcessor';
import { FormattedInput } from "@/components/ui/formatted-input";

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

const ClientAccess: React.FC = () => {
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

    if (!formData.name.trim()) newErrors.name = 'Nome è obbligatorio';
    if (!formData.phone.trim()) newErrors.phone = 'Telefono è obbligatorio';
    if (!formData.email.trim()) newErrors.email = 'Email è obbligatoria';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email non valida';
    if (!formData.propertyType) newErrors.propertyType = 'Tipo immobile è obbligatorio';
    if (!formData.location.trim()) newErrors.location = 'Zona è obbligatoria';
    if (!formData.budget.trim()) newErrors.budget = 'Budget è obbligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      // Process the client request automatically
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        requestType: formData.requestType,
        propertyType: formData.propertyType,
        budget: formData.budget,
        zona: formData.location,
        features: formData.features,
        additionalDetails: `Timeframe: ${formData.timeframe}\nNote: ${formData.notes}`
      };

      const result = await processClientRequest(requestData);
      
      if (result.success) {
        setSubmitted(true);
        toast({
          title: "Richiesta inviata!",
          description: result.message,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ClientRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-2">
          <CardContent className="p-8 text-center">
            <div className="mx-auto p-4 bg-green-100 rounded-full w-fit mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">Richiesta Inviata!</h2>
            <p className="text-muted-foreground mb-6">
              Grazie per aver inviato la tua richiesta. Il nostro team ti contatterà entro 24 ore per discutere le tue esigenze.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Nome:</strong> {formData.name}</p>
              <p><strong>Tipo richiesta:</strong> {formData.requestType.charAt(0).toUpperCase() + formData.requestType.slice(1)}</p>
              <p><strong>Immobile:</strong> {formData.propertyType}</p>
              <p><strong>Zona:</strong> {formData.location}</p>
            </div>
            <Button 
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
              className="w-full mt-6"
            >
              Invia Nuova Richiesta
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit mb-4">
            <Home className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">CRM Immobiliare</h1>
          <p className="text-xl text-muted-foreground mb-4">Portale Clienti</p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Invia la tua richiesta immobiliare e il nostro team di esperti ti contatterà per trovare la soluzione perfetta per le tue esigenze.
          </p>
        </div>



        {/* Main Form */}
        <Card className="shadow-xl border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Send className="h-6 w-6" />
              Nuova Richiesta Immobiliare
            </CardTitle>
            <p className="text-muted-foreground">
              Compila il modulo per inviarci la tua richiesta
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informazioni Personali
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome e Cognome *</Label>
                    <Input
                      id="name"
                      placeholder="Il tuo nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono *</Label>
                    <Input
                      id="phone"
                      placeholder="+39 123 456 7890"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@esempio.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>

              {/* Request Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Dettagli Richiesta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestType">Tipo Richiesta *</Label>
                    <Select value={formData.requestType} onValueChange={(value) => handleInputChange('requestType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo richiesta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acquisto">Acquisto</SelectItem>
                        <SelectItem value="vendita">Vendita</SelectItem>
                        <SelectItem value="locazione">Locazione (Affittare)</SelectItem>
                        <SelectItem value="affitto">Affitto (Prendere in affitto)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Tipo Immobile *</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                      <SelectTrigger className={errors.propertyType ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Seleziona tipo immobile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appartamento">Appartamento</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="villetta">Villetta</SelectItem>
                        <SelectItem value="attico">Attico</SelectItem>
                        <SelectItem value="loft">Loft</SelectItem>
                        <SelectItem value="ufficio">Ufficio</SelectItem>
                        <SelectItem value="negozio">Negozio</SelectItem>
                        <SelectItem value="capannone">Capannone</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                        <SelectItem value="altro">Altro</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.propertyType && <p className="text-sm text-destructive">{errors.propertyType}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Zona/Località *</Label>
                    <Input
                      id="location"
                      placeholder="es. Centro, Periferia, Nome quartiere"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={errors.location ? 'border-destructive' : ''}
                    />
                    {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget *</Label>
                    <FormattedInput
                      id="budget"
                      placeholder="es. €200.000, €1.500/mese"
                      value={formData.budget}
                      onChange={(formatted) => handleInputChange('budget', formatted)}
                      className={errors.budget ? 'border-destructive' : ''}
                    />
                    {errors.budget && <p className="text-sm text-destructive">{errors.budget}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Tempistiche</Label>
                  <Select value={formData.timeframe} onValueChange={(value) => handleInputChange('timeframe', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Quando vorresti concludere?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediato">Immediato (entro 1 mese)</SelectItem>
                      <SelectItem value="breve">Breve termine (1-3 mesi)</SelectItem>
                      <SelectItem value="medio">Medio termine (3-6 mesi)</SelectItem>
                      <SelectItem value="lungo">Lungo termine (oltre 6 mesi)</SelectItem>
                      <SelectItem value="flessibile">Flessibile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dettagli Aggiuntivi</h3>
                <div className="space-y-2">
                  <Label htmlFor="features">Caratteristiche Desiderate</Label>
                  <Textarea
                    id="features"
                    placeholder="es. 3 camere, 2 bagni, giardino, garage, ascensore, terrazzo..."
                    value={formData.features}
                    onChange={(e) => handleInputChange('features', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Note Aggiuntive</Label>
                  <Textarea
                    id="notes"
                    placeholder="Qualsiasi altra informazione che ritieni utile..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Invia Richiesta
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
            © 2025 Filippo Marcuzzo - Consulente Immobiliare. I tuoi dati sono protetti e utilizzati solo per contattarti riguardo la tua richiesta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientAccess;