import React, { useRef } from 'react'
import { Upload, Link2, X } from 'lucide-react'

interface ImageUploadFieldProps {
  /** Current image URL or base64 data URL */
  value: string
  /** Called whenever the image changes (URL typed OR file uploaded) */
  onChange: (url: string) => void
  /** Label shown above the field */
  label?: string
  /** Placeholder for the URL input */
  placeholder?: string
  /** Optional: accept string for file input, default "image/*" */
  accept?: string
}

/**
 * Dual-mode image input:
 *  – Paste / type a URL directly
 *  – OR click the Upload button to pick a local file (converted to base64)
 * Shows a live thumbnail preview whenever a valid image is set.
 */
export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = 'Image',
  placeholder = 'https://example.com/image.png',
  accept = 'image/*',
}) => {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const result = ev.target?.result as string
      if (result) onChange(result)
    }
    reader.readAsDataURL(file)
    // reset so the same file can be re-selected
    e.target.value = ''
  }

  const clear = () => onChange('')

  return (
    <div className="form-group" style={{ gap: 8 }}>
      {label && <label>{label}</label>}

      {/* Input row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* URL text input */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 6,
          border: '1px solid #e2e8f0', borderRadius: 8,
          padding: '0 10px', background: 'white', height: 40,
        }}>
          <Link2 size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: '0.85rem', color: '#0f172a', background: 'transparent',
              minWidth: 0,
            }}
          />
          {value && (
            <button
              type="button"
              onClick={clear}
              title="Clear image"
              style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#94a3b8' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Upload file button */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          title="Upload from device"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0 14px', height: 40,
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem',
            fontWeight: 600, color: '#475569', whiteSpace: 'nowrap',
            transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = '#e2e8f0'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#cbd5e1'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'
          }}
        >
          <Upload size={14} />
          Upload
        </button>

        {/* Hidden real file input */}
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={handleFile}
        />
      </div>

      {/* Thumbnail preview */}
      {value && (
        <div style={{
          marginTop: 8,
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#f8fafc', border: '1px solid #e2e8f0',
          borderRadius: 10, padding: '8px 12px',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 8,
            background: 'white', border: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', flexShrink: 0,
          }}>
            <img
              src={value}
              alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={e => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Preview</div>
            <div style={{
              fontSize: '0.7rem', color: '#94a3b8', marginTop: 2,
              maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {value.startsWith('data:') ? '📁 Local file uploaded' : value}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
