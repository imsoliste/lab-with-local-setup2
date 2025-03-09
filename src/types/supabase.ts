export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          phone: string
          name: string | null
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          phone: string
          name?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string
          name?: string | null
          role?: string
          created_at?: string
        }
      }
      labs: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string
          city: string
          rating: number | null
          accredited: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address: string
          city: string
          rating?: number | null
          accredited?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string
          city?: string
          rating?: number | null
          accredited?: boolean
          created_at?: string
        }
      }
      tests: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          parameters: string[]
          preparation_instructions: string | null
          report_time_hours: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          parameters?: string[]
          preparation_instructions?: string | null
          report_time_hours?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          parameters?: string[]
          preparation_instructions?: string | null
          report_time_hours?: number
          created_at?: string
        }
      }
      lab_test_prices: {
        Row: {
          id: string
          lab_id: string
          test_id: string
          price: number
          discounted_price: number | null
          home_collection_available: boolean
          home_collection_fee: number
          created_at: string
        }
        Insert: {
          id?: string
          lab_id: string
          test_id: string
          price: number
          discounted_price?: number | null
          home_collection_available?: boolean
          home_collection_fee?: number
          created_at?: string
        }
        Update: {
          id?: string
          lab_id?: string
          test_id?: string
          price?: number
          discounted_price?: number | null
          home_collection_available?: boolean
          home_collection_fee?: number
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          test_id: string
          lab_id: string
          booking_date: string
          booking_time: string
          status: string
          amount: number
          home_collection: boolean
          address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          test_id: string
          lab_id: string
          booking_date: string
          booking_time: string
          status?: string
          amount: number
          home_collection?: boolean
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          test_id?: string
          lab_id?: string
          booking_date?: string
          booking_time?: string
          status?: string
          amount?: number
          home_collection?: boolean
          address?: string | null
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          amount: number
          status: string
          payment_method: string | null
          transaction_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          amount: number
          status?: string
          payment_method?: string | null
          transaction_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          amount?: number
          status?: string
          payment_method?: string | null
          transaction_id?: string | null
          created_at?: string
        }
      }
      test_results: {
        Row: {
          id: string
          booking_id: string
          result_data: Json
          status: string
          report_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          result_data: Json
          status?: string
          report_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          result_data?: Json
          status?: string
          report_url?: string | null
          created_at?: string
        }
      }
    }
  }
}