import React from 'react';
import { clamp01, easeCss } from './motion';

/** Spread onto an element to apply the scripted hover look from video.css. */
export const hoverAttr = (active: boolean | undefined) =>
  active ? { 'data-hover': '' } : {};

/**
 * Same markup as the app Toggle. `checked` may be a 0–1 progress so a
 * composition can animate the switch frame by frame.
 */
export const Toggle: React.FC<{ checked: boolean | number; disabled?: boolean }> = ({
  checked,
  disabled,
}) => {
  const p = clamp01(typeof checked === 'number' ? checked : checked ? 1 : 0);
  return (
    <label className="toggle" style={disabled ? { opacity: 0.4 } : undefined}>
      <input type="checkbox" checked={p >= 0.5} readOnly disabled={disabled} />
      <span
        className="toggle-track"
        style={{
          background: `color-mix(in oklab, var(--status-green) ${p * 100}%, var(--border))`,
        }}
      />
      <span className="toggle-thumb" style={{ transform: `translateX(${p * 12}px)` }} />
    </label>
  );
};

type TooltipProps = {
  label: string;
  visible?: boolean;
  wrap?: boolean;
  align?: 'center' | 'start' | 'end';
  placement?: 'above' | 'below';
  children: React.ReactElement;
};

/** In-place tooltip (the app portals to body; the video keeps it in the window). */
export const Tooltip: React.FC<TooltipProps> = ({
  label,
  visible = false,
  wrap = false,
  align = 'center',
  placement = 'above',
  children,
}) => {
  const bubbleClass = [
    'tooltip-bubble',
    wrap ? 'tooltip-bubble-wrap' : '',
    align === 'start' ? 'tooltip-bubble-align-start' : '',
    align === 'end' ? 'tooltip-bubble-align-end' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const below: React.CSSProperties =
    placement === 'below' ? { bottom: 'auto', top: 'calc(100% + 6px)' } : {};
  return (
    <span className="tooltip-wrap">
      {children}
      {visible && label ? (
        <span className={bubbleClass} style={below} role="tooltip">
          {label}
        </span>
      ) : null}
    </span>
  );
};

export const DropdownMenu: React.FC<{
  children: React.ReactNode;
  placement?: 'below' | 'above';
  style?: React.CSSProperties;
}> = ({ children, placement = 'below', style }) => (
  <div
    className="dropdown-menu"
    style={{
      ...(placement === 'above' ? { top: 'auto', bottom: 'calc(100% + 4px)' } : {}),
      ...style,
    }}
  >
    {children}
  </div>
);

export const MenuItem: React.FC<{
  icon?: React.ReactNode;
  label: string;
  danger?: boolean;
  hover?: boolean;
}> = ({ icon, label, danger, hover }) => (
  <button
    type="button"
    tabIndex={-1}
    className={`site-menu-item${danger ? ' site-menu-item-danger' : ''}`}
    {...hoverAttr(hover)}
  >
    <span className="site-menu-item-icon">{icon}</span>
    {label}
  </button>
);

export const MenuDivider: React.FC = () => <div className="site-menu-divider" />;

/**
 * Looks like the app's text inputs but can show a blinking caret while a
 * composition "types" into it. Pass `caret` as a boolean from the frame.
 */
export const FakeInput: React.FC<{
  value: string;
  placeholder?: string;
  /** Focus ring like `input:focus` in global.css. */
  focused?: boolean;
  /** Show the caret (pass a frame-derived blink boolean). */
  caret?: boolean;
  mono?: boolean;
  align?: 'left' | 'right';
  height?: number;
  style?: React.CSSProperties;
}> = ({ value, placeholder, focused, caret, mono, align = 'left', height = 32, style }) => (
  <div
    className="ls-input"
    style={{
      height,
      padding: '0 10px',
      border: `1px solid ${focused ? 'var(--status-blue)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface)',
      color: 'var(--fg)',
      fontFamily: mono ? 'var(--font-mono)' : undefined,
      fontSize: mono ? 'var(--fs-sm)' : 'var(--fs-body)',
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      boxShadow: focused
        ? '0 0 0 3px color-mix(in oklab, var(--status-blue) 15%, transparent)'
        : undefined,
      ...style,
    }}
  >
    {value ? (
      <span>{value}</span>
    ) : placeholder && !focused ? (
      <span className="ls-input-placeholder">{placeholder}</span>
    ) : null}
    {focused && caret ? <span className="ls-caret" /> : null}
  </div>
);

/**
 * `.modal-center` + overlay + modal shell. `enter` replaces the app's
 * modalIn/fadeIn keyframes: 0 = hidden, 1 = fully shown.
 */
export const ModalLayer: React.FC<{
  enter?: number;
  className?: string;
  centerClassName?: string;
  children: React.ReactNode;
}> = ({ enter = 1, className, centerClassName, children }) => {
  const p = clamp01(enter);
  if (p <= 0) return null;
  return (
    <div className={`modal-center ${centerClassName ?? ''}`}>
      <div className="overlay" style={{ opacity: p }} />
      <div
        className={`modal ${className ?? ''}`}
        role="dialog"
        style={{
          opacity: p,
          transform: `translateY(${(1 - p) * 10}px) scale(${0.94 + 0.06 * p})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Centered toast; `enter` replaces `toastIn` (0–1 over `TOAST_MS`). */
export const Toast: React.FC<{ text: string; index?: number; enter?: number }> = ({
  text,
  index = 0,
  enter = 1,
}) => {
  const p = easeCss(clamp01(enter));
  if (p <= 0) return null;
  return (
    <div
      className="toast"
      style={{
        marginTop: index * 40,
        opacity: p,
        transform: `translate(-50%, -50%) scale(${0.96 + 0.04 * p})`,
      }}
    >
      {text}
    </div>
  );
};
