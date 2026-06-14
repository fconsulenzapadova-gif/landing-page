export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      approved_emails: {
        Row: {
          approved_by: string | null
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          email: string
          id?: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_requests: {
        Row: {
          id: string
          client_id: string
          request_type: string
          property_type: string | null
          location: string | null
          budget: string | null
          timeframe: string | null
          features: string | null
          notes: string | null
          status: string
          processed_by: string | null
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          request_type: string
          property_type?: string | null
          location?: string | null
          budget?: string | null
          timeframe?: string | null
          features?: string | null
          notes?: string | null
          status?: string
          processed_by?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          request_type?: string
          property_type?: string | null
          location?: string | null
          budget?: string | null
          timeframe?: string | null
          features?: string | null
          notes?: string | null
          status?: string
          processed_by?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      pending_requests: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          request_type: string
          property_type: string
          budget: string | null
          zona: string | null
          features: string | null
          additional_details: string | null
          processed: boolean
          processed_by: string | null
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          request_type: string
          property_type: string
          budget?: string | null
          zona?: string | null
          features?: string | null
          additional_details?: string | null
          processed?: boolean
          processed_by?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          request_type?: string
          property_type?: string
          budget?: string | null
          zona?: string | null
          features?: string | null
          additional_details?: string | null
          processed?: boolean
          processed_by?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pending_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      buyers: {
        Row: {
          birthday: string | null
          budget: string
          created_at: string
          email: string | null
          features: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          property_type: string
          type: string
          updated_at: string
          user_id: string
          zona: string | null
        }
        Insert: {
          birthday?: string | null
          budget: string
          created_at?: string
          email?: string | null
          features: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          property_type: string
          type: string
          updated_at?: string
          user_id: string
          zona?: string | null
        }
        Update: {
          birthday?: string | null
          budget?: string
          created_at?: string
          email?: string | null
          features?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          property_type?: string
          type?: string
          updated_at?: string
          user_id?: string
          zona?: string | null
        }
        Relationships: []
      }
      client_favorites: {
        Row: {
          client_id: string
          client_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          client_id: string
          client_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          client_id?: string
          client_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      completed_operations: {
        Row: {
          buyer_email: string | null
          buyer_name: string
          buyer_phone: string | null
          commission: string | null
          completed_at: string
          created_at: string
          id: string
          location: string
          notes: string | null
          price: string
          property_type: string
          seller_email: string | null
          seller_name: string
          seller_phone: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          buyer_email?: string | null
          buyer_name: string
          buyer_phone?: string | null
          commission?: string | null
          completed_at?: string
          created_at?: string
          id?: string
          location: string
          notes?: string | null
          price: string
          property_type: string
          seller_email?: string | null
          seller_name: string
          seller_phone?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          buyer_email?: string | null
          buyer_name?: string
          buyer_phone?: string | null
          commission?: string | null
          completed_at?: string
          created_at?: string
          id?: string
          location?: string
          notes?: string | null
          price?: string
          property_type?: string
          seller_email?: string | null
          seller_name?: string
          seller_phone?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          nickname: string | null
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          nickname?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          nickname?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          codice_identificativo: string
          created_at: string
          features: string | null
          id: string
          location: string
          notes: string | null
          operation_type: string
          price: string
          property_type: string
          seller_id: string
          updated_at: string
        }
        Insert: {
          codice_identificativo: string
          created_at?: string
          features?: string | null
          id?: string
          location: string
          notes?: string | null
          operation_type?: string
          price: string
          property_type: string
          seller_id: string
          updated_at?: string
        }
        Update: {
          codice_identificativo?: string
          created_at?: string
          features?: string | null
          id?: string
          location?: string
          notes?: string | null
          operation_type?: string
          price?: string
          property_type?: string
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      sellers: {
        Row: {
          birthday: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          birthday?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          birthday?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
