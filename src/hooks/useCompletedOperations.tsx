import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { Contract, ContractType } from "@/types/contract";

export interface CompletedOperation {
  id: string;
  user_id: string;
  type: string;
  seller_name: string;
  seller_phone?: string;
  seller_email?: string;
  buyer_name: string;
  buyer_phone?: string;
  buyer_email?: string;
  property_type: string;
  location: string;
  price: string;
  commission?: string;
  notes?: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export const useCompletedOperations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["completed-operations", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User must be authenticated");
      }
      
      const { data, error } = await supabase
        .from("completed_operations")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      return data as CompletedOperation[];
    },
    enabled: !!user?.id,
  });
};

export const useAddCompletedOperation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const createContractFromOperation = (operation: any): Contract => {
    // Map operation type to contract type
    const contractType: ContractType = operation.type === 'Vendita eseguita' ? 'vendita' : 'affitto';
    
    // Create description from operation data
    const description = `${contractType === 'vendita' ? 'Contratto di Vendita' : 'Contratto di Locazione'} - ${operation.property_type} in ${operation.location}`;
    
    // Create parties object
    const parties: Record<string, string> = {
      [contractType === 'vendita' ? 'Venditore' : 'Locatore']: operation.seller_name,
      [contractType === 'vendita' ? 'Acquirente' : 'Conduttore']: operation.buyer_name
    };

    // Calculate registration expiry date (30 days from now)
    const registrationExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return {
      id: `contract-${Date.now()}`,
      type: contractType,
      status: 'da_registrare',
      description,
      parties,
      amount: parseFloat(operation.price.replace(/[€.,]/g, '')) || 0,
      registrationExpiryDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };

  const saveContractToLocalStorage = (contract: Contract) => {
    try {
      const existingContracts = JSON.parse(localStorage.getItem('crm-contracts') || '[]');
      const updatedContracts = [...existingContracts, contract];
      localStorage.setItem('crm-contracts', JSON.stringify(updatedContracts));
    } catch (error) {
      console.error('Error saving contract to localStorage:', error);
    }
  };

  return useMutation({
    mutationFn: async (operation: Omit<CompletedOperation, "id" | "user_id" | "created_at" | "updated_at">) => {
      if (!user?.id) {
        throw new Error("User must be authenticated to create operations");
      }
      
      const operationWithUserId = {
        ...operation,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from("completed_operations")
        .insert([operationWithUserId])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (completedOperation) => {
      queryClient.invalidateQueries({ queryKey: ["completed-operations", user?.id] });
      
      // Automatically create contract from the completed operation
      try {
        const contract = createContractFromOperation(completedOperation);
        saveContractToLocalStorage(contract);
        
        toast({
          title: "Operazione completata aggiunta",
          description: "L'operazione è stata registrata e il contratto è stato creato automaticamente.",
        });
      } catch (error) {
        console.error('Error creating contract:', error);
        toast({
          title: "Operazione completata aggiunta",
          description: "L'operazione è stata registrata con successo. Errore nella creazione automatica del contratto.",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Impossibile aggiungere l'operazione completata.",
        variant: "destructive",
      });
      console.error("Error adding completed operation:", error);
    },
  });
};

export const useDeleteCompletedOperation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("completed_operations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["completed-operations", user?.id] });
      toast({
        title: "Operazione eliminata",
        description: "L'operazione completata è stata eliminata con successo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Impossibile eliminare l'operazione completata.",
        variant: "destructive",
      });
      console.error("Error deleting completed operation:", error);
    },
  });
};