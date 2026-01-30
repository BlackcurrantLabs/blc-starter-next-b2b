import { RowData } from '@tanstack/react-table'
import { LucideIcon } from 'lucide-react'

export interface FilterOption {
  value: any,
  label: string,
  icon?: LucideIcon
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterTitle: string,
    filterOptions: FilterOption[]
  }
}

declare global {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly NEXT_PUBLIC_SITE_NAME: string
    readonly NEXT_PUBLIC_BASE_URL: string
    readonly DATABASE_URL: string
    readonly BETTER_AUTH_SECRET: string
    readonly BETTER_AUTH_URL: string
    readonly RESEND_KEY: string
    readonly RESEND_FROM: string
  }
}