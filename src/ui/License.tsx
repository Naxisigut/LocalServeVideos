import React from 'react';
import { Img } from 'remotion';
import appIcon from '../../assets/brand/app-icon.png';
import { useT } from './context';
import { FakeInput, ModalLayer, hoverAttr } from './primitives';
import type { LicenseView, TrialView } from './types';

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const TRIAL_DURATION_MS = 7 * 24 * HOUR_MS;

/** Titlebar pill: "7 days left", fill fades blue → red as the trial runs out. */
export const TrialLicenseButton: React.FC<{ trial: TrialView; hover?: boolean }> = ({
  trial,
  hover,
}) => {
  const t = useT();
  const remainingMs = Math.max(0, trial.remainingMs);
  const totalHours = Math.floor(remainingMs / HOUR_MS);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = Math.floor(remainingMs / MINUTE_MS) % 60;
  const seconds = Math.ceil(remainingMs / SECOND_MS);
  const label =
    remainingMs === 0
      ? t('试用结束')
      : days > 0
        ? t('剩余 {days} 天', { days })
        : hours > 0
          ? t('剩余 {hours} 小时', { hours })
          : minutes > 0
            ? t('剩余 {minutes} 分钟', { minutes })
            : t('剩余 {seconds} 秒', { seconds });
  const style = {
    '--trial-remaining': `${Math.min(1, remainingMs / TRIAL_DURATION_MS) * 100}%`,
  } as React.CSSProperties;
  return (
    <button
      type="button"
      tabIndex={-1}
      className="btn titlebar-trial-btn"
      style={style}
      {...hoverAttr(hover)}
    >
      {label}
    </button>
  );
};

export type PricingChipVariant = 'yellow' | 'pink' | 'blue';
export type PricingChipIcon = 'infinity' | 'badge' | 'devices';

const iconStroke = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const ChipIcon: React.FC<{ name: PricingChipIcon }> = ({ name }) => {
  switch (name) {
    case 'infinity':
      return (
        <svg {...iconStroke} aria-hidden="true">
          <path d="M12 12c-1.7-2.3-3.1-3.6-5.1-3.6a3.6 3.6 0 0 0 0 7.2c2 0 3.4-1.3 5.1-3.6zm0 0c1.7 2.3 3.1 3.6 5.1 3.6a3.6 3.6 0 0 0 0-7.2c-2 0-3.4 1.3-5.1 3.6z" />
        </svg>
      );
    case 'badge':
      return (
        <svg {...iconStroke} aria-hidden="true">
          <path d="M12 2.7L14.04 4.37 16.65 3.95 17.59 6.41 20.05 7.35 19.63 9.96 21.3 12 19.63 14.04 20.05 16.65 17.59 17.59 16.65 20.05 14.04 19.63 12 21.3 9.96 19.63 7.35 20.05 6.41 17.59 3.95 16.65 4.37 14.04 2.7 12 4.37 9.96 3.95 7.35 6.41 6.41 7.35 3.95 9.96 4.37Z" />
          <path d="M8.6 12.2l2.4 2.4 4.4-4.8" />
        </svg>
      );
    case 'devices':
      return (
        <svg {...iconStroke} aria-hidden="true">
          <rect x="2.5" y="5.5" width="13.5" height="9.5" rx="1.6" />
          <path d="M1.5 18.5h13" />
          <rect x="17.5" y="8.5" width="5" height="10" rx="1.3" />
        </svg>
      );
    default:
      return null;
  }
};

export const PricingChip: React.FC<{
  icon: PricingChipIcon;
  label: React.ReactNode;
  variant: PricingChipVariant;
}> = ({ icon, label, variant }) => (
  <span className={`chip chip--${variant}`}>
    <ChipIcon name={icon} />
    {label}
  </span>
);

/**
 * Deterministic replacement for `usePricingAmbient` (rAF + Math.random):
 * fixed origins/directions, positions are a pure function of `time`.
 */
const BLOBS = [
  { x: 0.24, y: 0.22, size: 0.42, angle: 0.7 },
  { x: 0.76, y: 0.5, size: 0.38, angle: 2.6 },
  { x: 0.34, y: 0.8, size: 0.44, angle: 4.4 },
];
const CARD_W = 376;
const CARD_H = 560;
const BLOB_SPEED = 48;

const reflect = (start: number, velocity: number, time: number, min: number, max: number) => {
  const span = max - min;
  if (span <= 0) return (min + max) / 2;
  const offset = start - min + velocity * time;
  const phase = ((offset % (span * 2)) + span * 2) % (span * 2);
  return phase < span ? min + phase : max - (phase - span);
};

const blobStyle = (index: number, time: number): React.CSSProperties => {
  const blob = BLOBS[index];
  const inset = ((blob.size * CARD_W) / 2) * 0.5;
  const x = reflect(blob.x * CARD_W, Math.cos(blob.angle) * BLOB_SPEED, time, inset, CARD_W - inset);
  const y = reflect(blob.y * CARD_H, Math.sin(blob.angle) * BLOB_SPEED, time, inset, CARD_H - inset);
  return {
    width: `${blob.size * 100}%`,
    left: `${(x / CARD_W) * 100}%`,
    top: `${(y / CARD_H) * 100}%`,
  };
};

type PurchaseCardProps = {
  license: LicenseView;
  /** Seconds; drives the drifting color blobs. */
  time?: number;
  hover?: 'buy' | 'activate';
  licenseKey?: string;
  keyFocused?: boolean;
  caret?: boolean;
};

export const LicensePurchaseCard: React.FC<PurchaseCardProps> = ({
  license,
  time = 0,
  hover,
  licenseKey = '',
  keyFocused,
  caret,
}) => {
  const t = useT();
  const price = /^([A-Z]{3})\s+(\d+(?:\.\d+)?)$/.exec(license.priceLabel);
  const tags = [
    { variant: 'yellow' as const, icon: 'infinity' as const, label: t('永久许可证') },
    { variant: 'pink' as const, icon: 'badge' as const, label: t('一次性买断') },
    {
      variant: 'blue' as const,
      icon: 'devices' as const,
      label: t('适用{count} 台设备', { count: license.activationLimit }),
    },
  ];
  return (
    <article className="license-gate-card license-pricing-card">
      <div className="license-pricing-ambient" aria-hidden="true">
        {BLOBS.map((_, index) => (
          <span key={index} className="license-pricing-blob" style={blobStyle(index, time)} />
        ))}
      </div>
      <header className="license-pricing-heading">
        <Img src={appIcon} alt="" width={104} height={104} />
      </header>
      <div className="tags">
        {tags.map((tag) => (
          <PricingChip key={tag.variant} icon={tag.icon} label={tag.label} variant={tag.variant} />
        ))}
      </div>
      <p className="license-pricing-amount">
        {price ? (
          <>
            {price[1] === 'USD' ? <span className="license-pricing-symbol">$</span> : null}
            <span className="license-pricing-value">{price[2].replace(/\.00$/, '')}</span>
          </>
        ) : (
          license.priceLabel
        )}
      </p>
      <div className="license-activation">
        <div className="license-activation-actions">
          <button
            type="button"
            tabIndex={-1}
            className="btn btn-primary"
            {...hoverAttr(hover === 'buy')}
          >
            {t('购买激活')}
          </button>
        </div>
        <p className="license-activation-divider">{t('已有许可证？')}</p>
        <div className="license-activation-form">
          <FakeInput
            value={licenseKey}
            placeholder={t('粘贴许可证密钥')}
            focused={keyFocused}
            caret={caret}
            height={36}
            style={{ flex: 1, minWidth: 0, borderRadius: 10 }}
          />
          <button
            type="button"
            tabIndex={-1}
            className="btn"
            disabled={!licenseKey.trim()}
            {...hoverAttr(hover === 'activate')}
          >
            {t('激活')}
          </button>
        </div>
      </div>
    </article>
  );
};

export const LicensePurchaseDialog: React.FC<PurchaseCardProps & { enter?: number }> = ({
  enter,
  ...card
}) => (
  <ModalLayer enter={enter} className="license-purchase-modal">
    <LicensePurchaseCard {...card} />
  </ModalLayer>
);

/** Full-window gate shown when the trial has ended. */
export const LicenseGate: React.FC<PurchaseCardProps> = (card) => (
  <div className="license-gate">
    <LicensePurchaseCard {...card} />
  </div>
);
