import React from 'react';

import type { WorkOrder } from './work-order.interface';

// Eu sei que esta interface ficou monstruosa, mas eu tive uns problemas de tipagem e só consegui resolver assim. 😅
// Um dia aprendo uma abordagem mais elegante.
export interface FormFieldProps {
  label?: string;
  error?: string;
  children?: React.ReactNode;
  htmlFor?: string;
  type?: string;
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  className?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  pattern?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'link';
  isLoading?: boolean;
  loadingText?: string;
}

export interface WorkOrderTableProps {
  workOrders: WorkOrder[];
  onViewDetails: (order: WorkOrder) => void;
  onEdit: (order: WorkOrder) => void;
  onDelete: (order: WorkOrder) => void;
}

export interface DetailsModalProps {
  order: WorkOrder;
  onClose: () => void;
}

export interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export interface DetailItemProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export interface EditModalProps {
  order: WorkOrder;
  onClose: () => void;
}

export interface DeleteModalProps {
  order: WorkOrder;
  onClose: () => void;
}

export interface BadgeProps {
  children: React.ReactNode;
  status?: string;
}
