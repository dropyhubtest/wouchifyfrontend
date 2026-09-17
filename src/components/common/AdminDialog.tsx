import React, { useState } from 'react'
import {
  AlertTriangle,
  Trash2,
  HelpCircle,
  CheckCircle2,
  X,
  Info
} from 'lucide-react'
import './AdminDialog.css'

export interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string | React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary' | 'warning' | 'success' | 'error'
  icon?: 'trash' | 'alert' | 'warning' | 'help' | 'check' | 'info'
  onConfirm: () => void
  onCancel: () => void
  isSubmitting?: boolean
}

export const AdminConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  icon = 'trash',
  onConfirm,
  onCancel,
  isSubmitting = false
}) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (icon) {
      case 'trash':
        return <Trash2 size={28} className="admin-dialog__icon-svg danger" />
      case 'alert':
      case 'warning':
        return <AlertTriangle size={28} className="admin-dialog__icon-svg warning" />
      case 'check':
        return <CheckCircle2 size={28} className="admin-dialog__icon-svg success" />
      case 'info':
        return <Info size={28} className="admin-dialog__icon-svg info" />
      case 'help':
      default:
        return <HelpCircle size={28} className="admin-dialog__icon-svg primary" />
    }
  }

  return (
    <div className="admin-dialog-overlay" onClick={onCancel}>
      <div className="admin-dialog-card" onClick={(e) => e.stopPropagation()}>
        <button className="admin-dialog__close" onClick={onCancel} aria-label="Close dialog">
          <X size={18} />
        </button>

        <div className="admin-dialog__header">
          <div className={`admin-dialog__icon-wrap ${variant}`}>{getIcon()}</div>
          <div className="admin-dialog__header-text">
            <h3 className="admin-dialog__title">{title}</h3>
            <div className="admin-dialog__message">{message}</div>
          </div>
        </div>

        <div className="admin-dialog__actions">
          <button
            type="button"
            className="admin-dialog__btn admin-dialog__btn--cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`admin-dialog__btn admin-dialog__btn--confirm ${variant}`}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export interface PromptDialogProps {
  isOpen: boolean
  title: string
  message: string
  label?: string
  placeholder?: string
  defaultValue?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary' | 'warning'
  onConfirm: (value: string) => void
  onCancel: () => void
  isSubmitting?: boolean
  required?: boolean
}

export const AdminPromptDialog: React.FC<PromptDialogProps> = ({
  isOpen,
  title,
  message,
  label,
  placeholder = 'Enter note or reason...',
  defaultValue = '',
  confirmLabel = 'Submit',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
  isSubmitting = false,
  required = false
}) => {
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (required && !value.trim()) {
      setError('This field is required.')
      return
    }
    setError(null)
    onConfirm(value)
  }

  return (
    <div className="admin-dialog-overlay" onClick={onCancel}>
      <div className="admin-dialog-card admin-dialog-card--prompt" onClick={(e) => e.stopPropagation()}>
        <button className="admin-dialog__close" onClick={onCancel} aria-label="Close dialog">
          <X size={18} />
        </button>

        <div className="admin-dialog__header">
          <div className={`admin-dialog__icon-wrap ${variant}`}>
            <AlertTriangle size={24} className={`admin-dialog__icon-svg ${variant}`} />
          </div>
          <div className="admin-dialog__header-text">
            <h3 className="admin-dialog__title">{title}</h3>
            <div className="admin-dialog__message">{message}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin-dialog__form">
          {label && <label className="admin-dialog__input-label">{label}</label>}
          <textarea
            className="admin-dialog__textarea"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(null)
            }}
            rows={3}
            autoFocus
          />
          {error && <span className="admin-dialog__error-msg">{error}</span>}

          <div className="admin-dialog__actions">
            <button
              type="button"
              className="admin-dialog__btn admin-dialog__btn--cancel"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              className={`admin-dialog__btn admin-dialog__btn--confirm ${variant}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export interface AlertDialogProps {
  isOpen: boolean
  title: string
  message: string | React.ReactNode
  buttonLabel?: string
  variant?: 'danger' | 'warning' | 'info' | 'success' | 'error'
  onClose: () => void
}

export const AdminAlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  title,
  message,
  buttonLabel = 'OK',
  variant = 'warning',
  onClose
}) => {
  if (!isOpen) return null

  return (
    <div className="admin-dialog-overlay" onClick={onClose}>
      <div className="admin-dialog-card admin-dialog-card--alert" onClick={(e) => e.stopPropagation()}>
        <div className="admin-dialog__header">
          <div className={`admin-dialog__icon-wrap ${variant}`}>
            {variant === 'danger' || variant === 'warning' ? (
              <AlertTriangle size={28} className={`admin-dialog__icon-svg ${variant}`} />
            ) : variant === 'success' ? (
              <CheckCircle2 size={28} className="admin-dialog__icon-svg success" />
            ) : (
              <Info size={28} className="admin-dialog__icon-svg info" />
            )}
          </div>
          <div className="admin-dialog__header-text">
            <h3 className="admin-dialog__title">{title}</h3>
            <div className="admin-dialog__message">{message}</div>
          </div>
        </div>

        <div className="admin-dialog__actions" style={{ justifyContent: 'flex-end' }}>
          <button
            type="button"
            className={`admin-dialog__btn admin-dialog__btn--confirm ${variant}`}
            onClick={onClose}
            autoFocus
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
