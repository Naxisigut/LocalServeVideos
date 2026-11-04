import React from 'react';
import { useT } from './context';
import {
  AlertIcon,
  FolderOpenIcon,
  HelpCircleIcon,
  MoreCircleIcon,
  PlusCircleIcon,
  QrCodeIcon,
  TrashIcon,
} from './icons';
import { FileShareRetryButton, type FileShareRetryProps } from './FileShareRetryButton';
import { cumulativeShifts, presenceStyle, slotTranslate, type Presence } from './motion';
import { Tooltip, hoverAttr } from './primitives';
import type { FileShareItemView } from './types';

/** `.share-list` gap. */
const SHARE_GAP = 8;

type Props = {
  items: FileShareItemView[];
  running?: boolean;
  /** Item id whose hover overlay (QR / Finder / remove) is visible. */
  hoverItemId?: string;
  hoverAction?: 'add' | 'help' | 'more';
  tooltip?: 'add' | 'help' | 'more';
  /** File sharing failed to start (or is recovering): the retry capsule in the header. */
  retry?: FileShareRetryProps;
  /** Item id → joining/leaving motion. Leaving items stay in `items` until it ends. */
  presence?: Record<string, Presence>;
};

export const FileSharePanel: React.FC<Props> = ({
  items,
  running = true,
  hoverItemId,
  hoverAction,
  tooltip,
  retry,
  presence = {},
}) => {
  const t = useT();
  const shifts = cumulativeShifts(items.map((item) => presence[item.id]));
  return (
    <section className="share-panel">
      <div className="section-head">
        <div className="section-head-left">
          <div className="section-head-title-line">
            <span className="section-title">{t('文件')}</span>
            <span className="section-title-count">{items.length}</span>
          </div>
        </div>
        <div className="section-head-actions">
          <div className="action-bar-menu">
            <div className="action-bar-anchor">
              {retry ? <FileShareRetryButton {...retry} /> : null}
              <Tooltip label={t('新增文件')} placement="below" visible={tooltip === 'add'}>
                <button
                  type="button"
                  tabIndex={-1}
                  className="btn-icon section-head-icon-btn"
                  {...hoverAttr(hoverAction === 'add')}
                >
                  <PlusCircleIcon />
                </button>
              </Tooltip>
              <Tooltip
                label={t('文件分享：\n同局域网设备扫码访问后自动下载文件')}
                wrap
                placement="below"
                align="end"
                visible={tooltip === 'help'}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  className="btn-icon section-head-icon-btn"
                  {...hoverAttr(hoverAction === 'help')}
                >
                  <HelpCircleIcon size={14} />
                </button>
              </Tooltip>
              <Tooltip label={t('更多操作')} placement="below" visible={tooltip === 'more'}>
                <button
                  type="button"
                  tabIndex={-1}
                  className="btn-icon section-head-icon-btn action-bar-more"
                  {...hoverAttr(hoverAction === 'more')}
                >
                  <MoreCircleIcon />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="share-empty">
          <div>{t('添加本地文件，同局域网设备访问链接即可自动下载')}</div>
          <div>{t('固定开启分享，无需手动启动')}</div>
        </div>
      ) : (
        <div className="share-list">
          {items.map((item, index) => (
            <FileShareCard
              key={item.id}
              item={item}
              running={running}
              hover={hoverItemId === item.id}
              style={{
                ...presenceStyle(presence[item.id]),
                ...slotTranslate(shifts[index], 'x', SHARE_GAP),
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const FileShareCard: React.FC<{
  item: FileShareItemView;
  running: boolean;
  hover: boolean;
  style?: React.CSSProperties;
}> = ({ item, running, hover, style }) => {
  const t = useT();
  const extension = fileExtension(item.fileName);
  return (
    <div
      className="share-card"
      data-missing={item.missing || undefined}
      style={style}
      {...hoverAttr(hover)}
    >
      {item.missing ? (
        <div className="share-file-icon share-file-icon-missing" aria-hidden="true">
          <AlertIcon size={48} />
        </div>
      ) : (
        <FileFormatIcon extension={extension} />
      )}
      <div className="share-file-name">
        {splitFileName(item.fileName).map((line, index) => (
          <span key={index}>{line}</span>
        ))}
      </div>
      <div className="share-card-overlay">
        {!item.missing ? (
          <>
            <Tooltip label={t('查看二维码')}>
              <button type="button" tabIndex={-1} className="btn-icon" disabled={!running}>
                <QrCodeIcon size={17} />
              </button>
            </Tooltip>
            <Tooltip label={t('在访达中显示')}>
              <button type="button" tabIndex={-1} className="btn-icon">
                <FolderOpenIcon size={17} />
              </button>
            </Tooltip>
          </>
        ) : null}
        <Tooltip label={t('移除分享')}>
          <button type="button" tabIndex={-1} className="btn-icon btn-action-stop">
            <TrashIcon size={17} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

/** `.share-file-name` box: 96px card − 2×4px padding, 11px body font. */
const LABEL_WIDTH = 88;
const LABEL_FONT =
  "400 11px -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif";

let measureCtx: CanvasRenderingContext2D | null | undefined;

/** Same two-line split as the app's FileNameLabel, measured synchronously. */
const splitFileName = (name: string): string[] => {
  if (measureCtx === undefined) {
    measureCtx = document.createElement('canvas').getContext('2d');
    if (measureCtx) measureCtx.font = LABEL_FONT;
  }
  const ctx = measureCtx;
  const fits = (text: string) =>
    ctx ? ctx.measureText(text).width <= LABEL_WIDTH : text.length <= 15;
  const chars = Array.from(name);
  if (fits(name)) return [name];
  let firstEnd = 0;
  while (firstEnd < chars.length && fits(chars.slice(0, firstEnd + 1).join(''))) firstEnd++;
  const first = chars.slice(0, firstEnd).join('');
  const remainder = chars.slice(firstEnd).join('');
  if (fits(remainder)) return [first, remainder];
  let tailStart = chars.length;
  while (tailStart > firstEnd && fits('…' + chars.slice(tailStart - 1).join(''))) tailStart--;
  return [first, '…' + chars.slice(tailStart).join('')];
};

const fileExtension = (fileName: string): string => {
  const dot = fileName.lastIndexOf('.');
  if (dot <= 0) return '';
  return fileName.slice(dot + 1, dot + 5).toLowerCase();
};

const FileFormatIcon: React.FC<{ extension: string }> = ({ extension }) => {
  const kind = /^(png|jpe?g|gif|webp|svg|heic|avif|bmp|tiff?|ico)$/.test(extension)
    ? 'image'
    : /^(mp4|mov|mkv|avi|webm|m4v)$/.test(extension)
      ? 'video'
      : /^(mp3|wav|aac|flac|ogg|m4a|aiff)$/.test(extension)
        ? 'audio'
        : /^(zip|rar|7z|gz|tar|bz2|xz)$/.test(extension)
          ? 'archive'
          : /^(js|jsx|ts|tsx|json|html|css|py|rs|go|sh|xml|ya?ml|c|cpp|java)$/.test(
                extension,
              )
            ? 'code'
            : /^(xls|xlsx|csv|numb)$/.test(extension)
              ? 'sheet'
              : extension === 'pdf'
                ? 'pdf'
                : 'document';
  return (
    <div className="share-file-icon" data-kind={kind} aria-hidden="true">
      <svg
        width="64"
        height="64"
        viewBox="0 0 50 52"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M34 2H8a3 3 0 0 0-3 3v42a3 3 0 0 0 3 3h33a3 3 0 0 0 3-3V14Z"
          fill="currentColor"
          fillOpacity=".08"
        />
        <path d="M34 2v12h10" />
      </svg>
      <span className="share-file-format">{extension || 'FILE'}</span>
    </div>
  );
};
