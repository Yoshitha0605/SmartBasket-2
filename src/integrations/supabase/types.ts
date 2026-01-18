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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string
          id: string
          platform_id: number
          quantity: number
          updated_at: string
          user_id: string
          variant_id: number
        }
        Insert: {
          created_at?: string
          id?: string
          platform_id: number
          quantity?: number
          updated_at?: string
          user_id: string
          variant_id: number
        }
        Update: {
          created_at?: string
          id?: string
          platform_id?: number
          quantity?: number
          updated_at?: string
          user_id?: string
          variant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          platform_delivery_fee: number
          platform_name: string
          platform_price: number
          product_id: number
          product_image: string | null
          product_name: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          platform_delivery_fee?: number
          platform_name: string
          platform_price: number
          product_id: number
          product_image?: string | null
          product_name: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          platform_delivery_fee?: number
          platform_name?: string
          platform_price?: number
          product_id?: number
          product_image?: string | null
          product_name?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          delivery_address: string | null
          delivery_city: string | null
          delivery_estimate: string | null
          delivery_fee: number
          delivery_minutes: number | null
          delivery_pin_code: string | null
          grand_total: number
          id: string
          payment_method: string
          status: string
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_estimate?: string | null
          delivery_fee?: number
          delivery_minutes?: number | null
          delivery_pin_code?: string | null
          grand_total: number
          id?: string
          payment_method: string
          status?: string
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_estimate?: string | null
          delivery_fee?: number
          delivery_minutes?: number | null
          delivery_pin_code?: string | null
          grand_total?: number
          id?: string
          payment_method?: string
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_prices: {
        Row: {
          created_at: string
          delivery_minutes: number
          id: number
          in_stock: boolean
          platform_id: number
          price: number
          variant_id: number
        }
        Insert: {
          created_at?: string
          delivery_minutes?: number
          id?: number
          in_stock?: boolean
          platform_id: number
          price: number
          variant_id: number
        }
        Update: {
          created_at?: string
          delivery_minutes?: number
          id?: number
          in_stock?: boolean
          platform_id?: number
          price?: number
          variant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "platform_prices_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_prices_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      platforms: {
        Row: {
          avg_delivery_minutes: number
          base_delivery_fee: number
          created_at: string
          free_delivery_threshold: number
          id: number
          logo_url: string | null
          name: string
          website_url: string
        }
        Insert: {
          avg_delivery_minutes?: number
          base_delivery_fee?: number
          created_at?: string
          free_delivery_threshold?: number
          id?: number
          logo_url?: string | null
          name: string
          website_url: string
        }
        Update: {
          avg_delivery_minutes?: number
          base_delivery_fee?: number
          created_at?: string
          free_delivery_threshold?: number
          id?: number
          logo_url?: string | null
          name?: string
          website_url?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          base_price: number
          created_at: string
          id: number
          product_id: number
          quantity_label: string
          quantity_multiplier: number
        }
        Insert: {
          base_price: number
          created_at?: string
          id?: number
          product_id: number
          quantity_label: string
          quantity_multiplier?: number
        }
        Update: {
          base_price?: number
          created_at?: string
          id?: number
          product_id?: number
          quantity_label?: string
          quantity_multiplier?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category_type: string
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          main_category: string
          name: string
        }
        Insert: {
          brand?: string | null
          category_type: string
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          main_category: string
          name: string
        }
        Update: {
          brand?: string | null
          category_type?: string
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          main_category?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          id: string
          name: string | null
          phone: string | null
          pin_code: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          id: string
          name?: string | null
          phone?: string | null
          pin_code?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          pin_code?: string | null
          updated_at?: string
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
