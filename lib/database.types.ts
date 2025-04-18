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
      rounds: {
        Row: {
          id: number
          multiplier: number
          timestamp: string
          inserted_by: string | null
        }
        Insert: {
          id?: never
          multiplier: number
          timestamp?: string
          inserted_by?: string | null
        }
        Update: {
          id?: never
          multiplier?: number
          timestamp?: string
          inserted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rounds_inserted_by_fkey"
            columns: ["inserted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      predictions: {
        Row: {
          id: number
          round_id: number | null
          predicted_multiplier: number | null
          confidence: number | null
          prediction_time: string
          result_status: string | null
          inserted_by: string | null
        }
        Insert: {
          id?: never
          round_id?: number | null
          predicted_multiplier?: number | null
          confidence?: number | null
          prediction_time?: string
          result_status?: string | null
          inserted_by?: string | null
        }
        Update: {
          id?: never
          round_id?: number | null
          predicted_multiplier?: number | null
          confidence?: number | null
          prediction_time?: string
          result_status?: string | null
          inserted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictions_inserted_by_fkey"
            columns: ["inserted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          }
        ]
      }
      stats: {
        Row: {
          id: number
          user_id: string | null
          correct_predictions: number | null
          total_predictions: number | null
          last_updated: string
        }
        Insert: {
          id?: never
          user_id?: string | null
          correct_predictions?: number | null
          total_predictions?: number | null
          last_updated?: string
        }
        Update: {
          id?: never
          user_id?: string | null
          correct_predictions?: number | null
          total_predictions?: number | null
          last_updated?: string
        }
        Relationships: [
          {
            foreignKeyName: "stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prediction_views: {
        Row: {
          id: number
          user_id: string | null
          prediction_id: number | null
          viewed_at: string
        }
        Insert: {
          id?: never
          user_id?: string | null
          prediction_id?: number | null
          viewed_at?: string
        }
        Update: {
          id?: never
          user_id?: string | null
          prediction_id?: number | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prediction_views_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: false
            referencedRelation: "predictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prediction_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: number
          user_id: string | null
          message: string | null
          triggered_at: string
          read: boolean | null
        }
        Insert: {
          id?: never
          user_id?: string | null
          message?: string | null
          triggered_at?: string
          read?: boolean | null
        }
        Update: {
          id?: never
          user_id?: string | null
          message?: string | null
          triggered_at?: string
          read?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
