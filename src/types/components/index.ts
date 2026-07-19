import type { ReactNode, CSSProperties } from "react";

// Common Component Props
export interface BaseProps {
  className?: string;
  style?: CSSProperties;
  id?: string;
  children?: ReactNode;
}

export interface DisableableProps {
  disabled?: boolean;
}

export interface LoadableProps {
  loading?: boolean;
  loadingText?: string;
}

export interface ErrorableProps {
  error?: string;
}

// Button Props
export interface ButtonProps extends BaseProps, DisableableProps, LoadableProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

// Input Props
export interface InputProps extends BaseProps, DisableableProps, ErrorableProps {
  type?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  helperText?: string;
  required?: boolean;
}

// Form Props
export interface FormFieldProps extends BaseProps, ErrorableProps {
  label?: string;
  required?: boolean;
  helperText?: string;
}

export interface FormProps extends BaseProps {
  onSubmit: (data: any) => void | Promise<void>;
  defaultValues?: Record<string, any>;
  validation?: Record<string, any>;
}

// Table Props
export interface TableColumn<T = any> {
  key: string;
  header: string;
  accessor?: (row: T) => any;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => ReactNode;
}

export interface TableProps<T = any> extends BaseProps {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  sort?: {
    field: string;
    order: "asc" | "desc";
    onSort: (field: string, order: "asc" | "desc") => void;
  };
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
}

// Modal Props
export interface ModalProps extends BaseProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
}

// Card Props
export interface CardProps extends BaseProps {
  title?: string;
  description?: string;
  footer?: ReactNode;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

// Alert Props
export interface AlertProps extends BaseProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Toast Props
export interface ToastProps {
  id: string;
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

// Dropdown Props
export interface DropdownItem {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
  href?: string;
  divider?: boolean;
  children?: DropdownItem[];
}

export interface DropdownProps extends BaseProps {
  items: DropdownItem[];
  trigger: ReactNode;
  align?: "start" | "end";
  side?: "top" | "bottom" | "left" | "right";
}

// Navigation Props
export interface NavItem {
  key: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
  external?: boolean;
  badge?: string | number;
  children?: NavItem[];
}

export interface NavigationProps extends BaseProps {
  items: NavItem[];
  orientation?: "horizontal" | "vertical";
  collapsible?: boolean;
}

// Layout Props
export interface LayoutProps extends BaseProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export interface PageProps extends BaseProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
}

// Data Display Props
export interface BadgeProps extends BaseProps {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "destructive";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

export interface AvatarProps extends BaseProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
  status?: "online" | "offline" | "away" | "busy";
}

export interface ProgressProps extends BaseProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  showLabel?: boolean;
  indeterminate?: boolean;
}

export interface SkeletonProps extends BaseProps {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

// Feedback Props
export interface SpinnerProps extends BaseProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

export interface EmptyStateProps extends BaseProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Chart Props
export interface ChartProps extends BaseProps {
  data: any[];
  type: "line" | "bar" | "area" | "pie" | "scatter";
  xKey: string;
  yKey: string | string[];
  height?: number;
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
}
