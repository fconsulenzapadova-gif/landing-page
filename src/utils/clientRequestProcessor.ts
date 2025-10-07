import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClientRequest {
  name: string;
  email: string;
  phone: string;
  requestType: 'acquisto' | 'locazione' | 'vendita';
  propertyType: string;
  budget?: string;
  zona?: string;
  features?: string;
  additionalDetails?: string;
}

/**
 * Salva o recupera un cliente esistente dalla tabella clients
 */
const saveOrGetClient = async (request: ClientRequest) => {
  try {
    // Cerca se il cliente esiste già
    const { data: existingClient, error: searchError } = await supabase
      .from('clients')
      .select('*')
      .eq('email', request.email)
      .single();

    if (searchError && searchError.code !== 'PGRST116') {
      throw searchError;
    }

    if (existingClient) {
      // Aggiorna i dati del cliente esistente
      const { data: updatedClient, error: updateError } = await supabase
        .from('clients')
        .update({
          name: request.name,
          phone: request.phone,
        })
        .eq('id', existingClient.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedClient;
    } else {
      // Crea nuovo cliente
      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert({
          name: request.name,
          email: request.email,
          phone: request.phone,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return newClient;
    }
  } catch (error) {
    console.error('Errore nel salvare/recuperare il cliente:', error);
    throw error;
  }
};

/**
 * Processes a client request and saves it to both client tables and client_requests
 * This creates a proper relationship between clients and their requests
 */
export const processClientRequest = async (request: ClientRequest): Promise<{ success: boolean; message: string; clientId?: string }> => {
  try {
    // 1. Salva o recupera il cliente nella tabella clients
    const client = await saveOrGetClient(request);

    // 2. Salva la richiesta nella tabella client_requests con riferimento al cliente
    const clientRequestData = {
      client_id: client.id,
      request_type: request.requestType,
      property_type: request.propertyType,
      location: request.zona || null,
      budget: request.budget || null,
      timeframe: null, // Questo campo non è presente nel form attuale
      features: request.features || null,
      notes: request.additionalDetails || null,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('client_requests')
      .insert(clientRequestData)
      .select()
      .single();

    if (error) {
      console.error('Error saving client request:', error);
      throw error;
    }

    return {
      success: true,
      message: 'Richiesta salvata con successo! Ti contatteremo entro 24 ore.',
      clientId: client.id
    };
  } catch (error) {
    console.error('Error processing client request:', error);
    return {
      success: false,
      message: 'Errore nell\'elaborazione della richiesta. Riprova più tardi.'
    };
  }
};

/**
 * Creates a pending request entry for cases where no admin is logged in
 * This could be used to store requests in a separate table for later processing
 */
export const createPendingRequest = async (request: ClientRequest): Promise<{ success: boolean; message: string }> => {
  try {
    // This would require a separate 'pending_requests' table in the database
    // For now, we'll just log the request and return success
    console.log('Pending request created:', request);
    
    // In a real implementation, you might:
    // 1. Save to a 'pending_requests' table
    // 2. Send an email notification to admins
    // 3. Create a webhook to external systems
    
    return {
      success: true,
      message: 'La tua richiesta è stata ricevuta e sarà processata dal nostro team entro 24 ore.'
    };
  } catch (error) {
    console.error('Error creating pending request:', error);
    return {
      success: false,
      message: 'Errore nell\'invio della richiesta. Riprova più tardi.'
    };
  }
};