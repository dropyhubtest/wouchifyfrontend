import React from 'react';
import './Skeletons.css';
import { PackageOpen } from 'lucide-react';

export const DealCardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="skeleton-deal-card">
        <div className="skeleton-box skeleton-img" />
        <div className="skeleton-box skeleton-title" />
        <div className="skeleton-box skeleton-meta" />
        <div className="skeleton-price-row">
          <div className="skeleton-box" style={{ width: '70px', height: '24px' }} />
          <div className="skeleton-box" style={{ width: '90px', height: '32px', borderRadius: '6px' }} />
        </div>
      </div>
    ))}
  </>
);

export const CouponCardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="skeleton-coupon-card">
        <div className="skeleton-box skeleton-badge" />
        <div className="skeleton-box skeleton-title" />
        <div className="skeleton-box skeleton-desc" />
        <div className="skeleton-box skeleton-code-box" />
      </div>
    ))}
  </>
);

export const StoreCardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="skeleton-store-card">
        <div className="skeleton-box skeleton-logo" />
        <div className="skeleton-box skeleton-name" />
        <div className="skeleton-box skeleton-offer" />
      </div>
    ))}
  </>
);

export const CreditCardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="skeleton-deal-card" style={{ height: '280px' }}>
        <div className="skeleton-box" style={{ width: '100%', height: '140px', borderRadius: '12px' }} />
        <div className="skeleton-box" style={{ width: '70%', height: '20px' }} />
        <div className="skeleton-box" style={{ width: '40%', height: '14px' }} />
        <div className="skeleton-box" style={{ width: '100%', height: '36px', borderRadius: '6px', marginTop: 'auto' }} />
      </div>
    ))}
  </>
);

export const TableRowSkeleton: React.FC<{ cols?: number; columns?: number; rows?: number }> = ({ cols, columns, rows = 1 }) => {
  const colCount = columns || cols || 5;
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="skeleton-table-tr">
          <td colSpan={colCount} style={{ padding: '14px 16px' }}>
            <div className="skeleton-table-row">
              <div className="skeleton-box skeleton-avatar" />
              <div className="skeleton-box skeleton-col-wide" />
              <div className="skeleton-box skeleton-col-mid" />
              {colCount > 3 && <div className="skeleton-box skeleton-col-mid" />}
              {colCount > 4 && <div className="skeleton-box skeleton-col-btn" />}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export const KpiCardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="skeleton-kpi-card">
        <div className="skeleton-box skeleton-icon" />
        <div className="skeleton-stat">
          <div className="skeleton-box" style={{ width: '50%', height: '14px' }} />
          <div className="skeleton-box" style={{ width: '70%', height: '26px' }} />
        </div>
      </div>
    ))}
  </>
);

export const EmptyState: React.FC<{
  title?: string;
  message?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({
  title = 'No items found',
  message,
  description = 'There are currently no items in this section.',
  icon,
  actionText,
  actionLabel,
  onAction,
}) => {
  const label = actionLabel || actionText;
  const desc = description || message || 'There are currently no items in this section.';
  return (
    <div className="wouchify-empty-state">
      <div className="empty-icon-wrap">
        {icon || <PackageOpen size={32} />}
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      {label && onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: '16px',
            padding: '8px 18px',
            background: '#2F368C',
            color: '#ffffff',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {label}
        </button>
      )}
    </div>
  );
};

