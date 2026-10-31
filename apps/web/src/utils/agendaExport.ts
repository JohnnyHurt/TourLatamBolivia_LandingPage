import { AgendaItemDTO, SpeakerDTO } from '@tourlatam/types';

export interface GroupedTimeSlot {
  key: string;
  startTime: string;
  endTime: string;
  isParallel: boolean;
  isBreakOrPlenary: boolean;
  isBreak: boolean;
  canalA?: AgendaItemDTO;
  canalB?: AgendaItemDTO;
  ambos?: AgendaItemDTO;
  singleItem?: AgendaItemDTO;
  otherSessions: AgendaItemDTO[];
}

export interface DayScheduleGroup {
  dateStr: string;
  jornadaNumber: number;
  formattedDateLong: string;
  formattedDateShort: string;
  slots: GroupedTimeSlot[];
}

const TYPE_LABELS: Record<string, string> = {
  KEYNOTE: 'KEYNOTE MAGISTRAL',
  PANEL: 'PANEL / DEBATE',
  WORKSHOP: 'WORKSHOP / CHARLA',
  NETWORKING: 'NETWORKING / APERTURA',
  BREAK: 'BREAK / RECESO',
  OTHER: 'SESIÓN',
};

export function resolveItemSpeakers(item: AgendaItemDTO, allSpeakers: SpeakerDTO[] = []): SpeakerDTO[] {
  if (item.speakers && item.speakers.length > 0) {
    return item.speakers;
  }
  const list: SpeakerDTO[] = [];
  if (item.speaker) list.push(item.speaker);
  if (item.coSpeaker) list.push(item.coSpeaker);

  if (
    item.description &&
    (item.description.includes('Emilse Kasem') || item.description.includes('Emilse')) &&
    !list.some((s) => s.slug === 'emilse-kasem')
  ) {
    const emilse = allSpeakers.find((s) => s.slug === 'emilse-kasem');
    if (emilse) {
      list.push(emilse);
    }
  }
  return list;
}

export function isBreakSession(item: AgendaItemDTO): boolean {
  const titleLower = (item.title || '').toLowerCase();
  return (
    item.type === 'BREAK' ||
    titleLower.includes('break') ||
    titleLower.includes('receso') ||
    titleLower.includes('almuerzo') ||
    titleLower.includes('descanso') ||
    titleLower.includes('pausa')
  );
}

export function groupAgendaByDayAndSlot(items: AgendaItemDTO[]): DayScheduleGroup[] {
  const activeItems = items.filter((it) => it.isActive !== false);
  const extractedDates = Array.from(new Set(activeItems.map((it) => it.date.split('T')[0]))).sort();

  return extractedDates.map((dateStr, idx) => {
    const d = new Date(dateStr + 'T12:00:00Z');
    const formattedDateLong = d.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const formattedDateShort = d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      timeZone: 'UTC',
    });

    const dayItems = activeItems
      .filter((it) => it.date.split('T')[0] === dateStr)
      .sort((a, b) => {
        const timeDiff = a.startTime.localeCompare(b.startTime);
        if (timeDiff !== 0) return timeDiff;
        const chA = (a.channel || 'Canal A').trim();
        const chB = (b.channel || 'Canal B').trim();
        if (chA === 'Canal A' && chB !== 'Canal A') return -1;
        if (chB === 'Canal A' && chA !== 'Canal A') return 1;
        return (a.displayOrder || 0) - (b.displayOrder || 0);
      });

    const map = new Map<
      string,
      {
        key: string;
        startTime: string;
        endTime: string;
        canalA?: AgendaItemDTO;
        canalB?: AgendaItemDTO;
        ambos?: AgendaItemDTO;
        singleItem?: AgendaItemDTO;
        otherSessions: AgendaItemDTO[];
      }
    >();

    dayItems.forEach((it) => {
      const timeKey = `${it.startTime} - ${it.endTime}`;
      if (!map.has(timeKey)) {
        map.set(timeKey, {
          key: timeKey,
          startTime: it.startTime,
          endTime: it.endTime,
          otherSessions: [],
        });
      }
      const slot = map.get(timeKey)!;
      const ch = (it.channel || 'Canal A').trim();

      if (ch === 'Ambos Canales' && !slot.ambos) {
        slot.ambos = it;
      } else if (ch === 'Canal A' && !slot.canalA) {
        slot.canalA = it;
      } else if (ch === 'Canal B' && !slot.canalB) {
        slot.canalB = it;
      } else {
        slot.otherSessions.push(it);
      }
    });

    const slots: GroupedTimeSlot[] = Array.from(map.values()).map((slot) => {
      const isParallel = Boolean(slot.canalA && slot.canalB);
      if (!isParallel && !slot.ambos) {
        slot.singleItem = slot.canalA || slot.canalB || slot.otherSessions[0];
      }
      const primarySingle = slot.ambos || slot.singleItem;
      const isBreak = primarySingle ? isBreakSession(primarySingle) : false;
      const isBreakOrPlenary =
        !isParallel &&
        Boolean(
          slot.ambos ||
            isBreak ||
            (primarySingle &&
              (primarySingle.type === 'NETWORKING' ||
                primarySingle.type === 'BREAK' ||
                (primarySingle.channel || '').trim() === 'Ambos Canales'))
        );

      return {
        ...slot,
        isParallel,
        isBreakOrPlenary,
        isBreak,
      };
    });

    return {
      dateStr,
      jornadaNumber: idx + 1,
      formattedDateLong,
      formattedDateShort,
      slots,
    };
  });
}

// ============================================================================
// Minimal Pure-TS OpenXML (.xlsx) Builder (Uncompressed ZIP + Styled Sheets)
// ============================================================================

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createZipArchive(files: { name: string; content: string }[]): Blob {
  const encoder = new TextEncoder();
  const entries = files.map((f) => {
    const nameBytes = encoder.encode(f.name);
    const dataBytes = encoder.encode(f.content);
    const crc = crc32(dataBytes);
    return { nameBytes, dataBytes, crc };
  });

  let localTotalSize = 0;
  let centralTotalSize = 0;
  for (const e of entries) {
    localTotalSize += 30 + e.nameBytes.length + e.dataBytes.length;
    centralTotalSize += 46 + e.nameBytes.length;
  }

  const totalSize = localTotalSize + centralTotalSize + 22;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const uint8 = new Uint8Array(buffer);

  let offset = 0;
  const localOffsets: number[] = [];

  for (const e of entries) {
    localOffsets.push(offset);
    view.setUint32(offset, 0x04034b50, true); // Local file header signature
    view.setUint16(offset + 4, 20, true); // Version needed to extract (2.0)
    view.setUint16(offset + 6, 0x0800, true); // UTF-8 filename flag
    view.setUint16(offset + 8, 0, true); // Compression method: 0 (Store)
    view.setUint16(offset + 10, 0, true); // Mod time
    view.setUint16(offset + 12, 0, true); // Mod date
    view.setUint32(offset + 14, e.crc, true); // CRC-32
    view.setUint32(offset + 18, e.dataBytes.length, true); // Compressed size
    view.setUint32(offset + 22, e.dataBytes.length, true); // Uncompressed size
    view.setUint16(offset + 26, e.nameBytes.length, true); // File name length
    view.setUint16(offset + 28, 0, true); // Extra field length
    uint8.set(e.nameBytes, offset + 30);
    uint8.set(e.dataBytes, offset + 30 + e.nameBytes.length);
    offset += 30 + e.nameBytes.length + e.dataBytes.length;
  }

  const centralDirOffset = offset;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    view.setUint32(offset, 0x02014b50, true); // Central directory signature
    view.setUint16(offset + 4, 20, true); // Version made by
    view.setUint16(offset + 6, 20, true); // Version needed
    view.setUint16(offset + 8, 0x0800, true); // UTF-8 flag
    view.setUint16(offset + 10, 0, true); // Compression method: Store
    view.setUint16(offset + 12, 0, true); // Mod time
    view.setUint16(offset + 14, 0, true); // Mod date
    view.setUint32(offset + 16, e.crc, true); // CRC-32
    view.setUint32(offset + 20, e.dataBytes.length, true); // Compressed size
    view.setUint32(offset + 24, e.dataBytes.length, true); // Uncompressed size
    view.setUint16(offset + 28, e.nameBytes.length, true); // File name length
    view.setUint16(offset + 30, 0, true); // Extra field length
    view.setUint16(offset + 32, 0, true); // Comment length
    view.setUint16(offset + 34, 0, true); // Disk number
    view.setUint16(offset + 36, 0, true); // Internal attrs
    view.setUint32(offset + 38, 0, true); // External attrs
    view.setUint32(offset + 42, localOffsets[i], true); // Offset of local header
    uint8.set(e.nameBytes, offset + 46);
    offset += 46 + e.nameBytes.length;
  }

  // End of Central Directory Record (EOCD)
  view.setUint32(offset, 0x06054b50, true);
  view.setUint16(offset + 4, 0, true);
  view.setUint16(offset + 6, 0, true);
  view.setUint16(offset + 8, entries.length, true);
  view.setUint16(offset + 10, entries.length, true);
  view.setUint32(offset + 12, centralTotalSize, true);
  view.setUint32(offset + 16, centralDirOffset, true);
  view.setUint16(offset + 20, 0, true);

  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

function formatSessionCellText(item?: AgendaItemDTO, allSpeakers: SpeakerDTO[] = []): string {
  if (!item) return '—';
  const typeLabel = TYPE_LABELS[item.type] || item.type;
  const roomPart = item.room ? ` | ${item.room}` : '';
  const speakers = resolveItemSpeakers(item, allSpeakers);
  const speakerLines =
    speakers.length > 0
      ? speakers
          .map((sp) => {
            const roleInfo = [sp.position, sp.company].filter(Boolean).join(' • ');
            return roleInfo ? `Ponente: ${sp.name} (${roleInfo})` : `Ponente: ${sp.name}`;
          })
          .join('\n')
      : '';

  const lines = [`[${typeLabel}${roomPart}]`, item.title];
  if (speakerLines) {
    lines.push(speakerLines);
  }
  return lines.join('\n');
}

function estimateRowHeight(texts: string[], minHeight = 42): number {
  let maxLines = 1;
  for (const t of texts) {
    if (!t) continue;
    const explicitLines = t.split('\n');
    let count = 0;
    for (const line of explicitLines) {
      count += Math.max(1, Math.ceil(line.length / 52));
    }
    if (count > maxLines) maxLines = count;
  }
  return Math.max(minHeight, Math.min(135, maxLines * 17 + 12));
}

/**
 * Style indices in styles.xml:
 * 0: Default
 * 1: Title Banner (Dark Navy #0B1120 fill, White bold 14pt, centered)
 * 2: Subtitle Banner (Slate #1E293B fill, Cyan #38BDF8 bold 10pt, centered)
 * 3: Header Horario (Dark #0F172A fill, White bold 10pt, centered)
 * 4: Header Canal A (Cyan-tinted dark #083344 fill, White bold 10pt, centered)
 * 5: Header Canal B (Purple-tinted dark #3B0764 fill, White bold 10pt, centered)
 * 6: Time Cell (Light Slate #F1F5F9 fill, Dark #0F172A bold 10pt, centered vertically & horizontally)
 * 7: Session Cell Canal A (White #FFFFFF fill, Dark #0F172A 10pt, wrapped, top-left aligned)
 * 8: Session Cell Canal B (Soft Lavender #FAF5FF fill, Dark #0F172A 10pt, wrapped, top-left aligned)
 * 9: Break Merged Cell (Soft Emerald #ECFDF5 fill, Dark Green #065F46 bold 10pt, centered & wrapped)
 * 10: Plenary / Ambos Canales Merged Cell (Soft Amber #FFFBEB fill, Dark Amber #78350F bold 10pt, centered & wrapped)
 */
function buildStylesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="8">
    <font><sz val="10"/><color rgb="FF0F172A"/><name val="Calibri"/></font>
    <font><b/><sz val="14"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FF38BDF8"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FF0F172A"/><name val="Calibri"/></font>
    <font><sz val="10"/><color rgb="FF0F172A"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FF065F46"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FF78350F"/><name val="Calibri"/></font>
  </fonts>
  <fills count="12">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF0B1120"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1E293B"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF0F172A"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF083344"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF3B0764"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF1F5F9"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFFFFF"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFAF5FF"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFECFDF5"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFFBEB"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFCBD5E1"/></left>
      <right style="thin"><color rgb="FFCBD5E1"/></right>
      <top style="thin"><color rgb="FFCBD5E1"/></top>
      <bottom style="thin"><color rgb="FFCBD5E1"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="11">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="3" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="3" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="3" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="4" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="5" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="left" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="5" fillId="9" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="left" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="6" fillId="10" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="7" fillId="11" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
  </cellXfs>
</styleSheet>`;
}

function buildComparativeSheetXml(day: DayScheduleGroup, allSpeakers: SpeakerDTO[]): string {
  const rowsXml: string[] = [];
  const mergeRefs: string[] = ['A1:C1', 'A2:C2'];

  // Row 1: Main Title
  rowsXml.push(`
    <row r="1" ht="34" customHeight="1">
      <c r="A1" s="1" t="inlineStr"><is><t xml:space="preserve">TOUR LATAM BOLIVIA 2026 — PROGRAMA OFICIAL DEL CONGRESO</t></is></c>
      <c r="B1" s="1" t="inlineStr"><is><t></t></is></c>
      <c r="C1" s="1" t="inlineStr"><is><t></t></is></c>
    </row>`);

  // Row 2: Jornada Subtitle
  const subtitle = `JORNADA 0${day.jornadaNumber}: ${day.formattedDateLong.toUpperCase()} • HORARIO BOLIVIA (GMT-4)`;
  rowsXml.push(`
    <row r="2" ht="24" customHeight="1">
      <c r="A2" s="2" t="inlineStr"><is><t xml:space="preserve">${escapeXml(subtitle)}</t></is></c>
      <c r="B2" s="2" t="inlineStr"><is><t></t></is></c>
      <c r="C2" s="2" t="inlineStr"><is><t></t></is></c>
    </row>`);

  // Row 3: Table Column Headers
  rowsXml.push(`
    <row r="3" ht="28" customHeight="1">
      <c r="A3" s="3" t="inlineStr"><is><t>HORARIO (BOT)</t></is></c>
      <c r="B3" s="4" t="inlineStr"><is><t>CANAL A • TRACK PRINCIPAL</t></is></c>
      <c r="C3" s="5" t="inlineStr"><is><t>CANAL B • TRACK PARALELO</t></is></c>
    </row>`);

  let currentRow = 4;
  for (const slot of day.slots) {
    const timeLabel = `${slot.startTime} - ${slot.endTime}`;

    if (slot.isParallel) {
      const textA = formatSessionCellText(slot.canalA, allSpeakers);
      const textB = formatSessionCellText(slot.canalB, allSpeakers);
      const rowHeight = estimateRowHeight([textA, textB], 54);

      rowsXml.push(`
    <row r="${currentRow}" ht="${rowHeight}" customHeight="1">
      <c r="A${currentRow}" s="6" t="inlineStr"><is><t xml:space="preserve">${escapeXml(timeLabel)}</t></is></c>
      <c r="B${currentRow}" s="7" t="inlineStr"><is><t xml:space="preserve">${escapeXml(textA)}</t></is></c>
      <c r="C${currentRow}" s="8" t="inlineStr"><is><t xml:space="preserve">${escapeXml(textB)}</t></is></c>
    </row>`);
      currentRow++;
    } else {
      const single = slot.ambos || slot.canalA || slot.canalB || slot.singleItem || slot.otherSessions[0];
      if (!single) continue;

      const isBreak = isBreakSession(single);
      const ch = (single.channel || 'Canal A').trim();
      const shouldSpanBoth =
        isBreak || ch === 'Ambos Canales' || single.type === 'NETWORKING' || single.type === 'BREAK';

      if (shouldSpanBoth) {
        const prefix = isBreak ? '☕ BREAK / RECESO' : '★ SESIÓN PLENARIA (AMBOS CANALES)';
        const speakers = resolveItemSpeakers(single, allSpeakers);
        const speakerStr =
          speakers.length > 0
            ? '\n' +
              speakers
                .map((sp) => {
                  const role = [sp.position, sp.company].filter(Boolean).join(' • ');
                  return role ? `Ponente: ${sp.name} (${role})` : `Ponente: ${sp.name}`;
                })
                .join(' | ')
            : '';
        const roomStr = single.room ? ` — ${single.room}` : '';
        const combinedText = `${prefix}${roomStr}\n${single.title}${speakerStr}`;
        const styleIdx = isBreak ? 9 : 10;
        const rowHeight = estimateRowHeight([combinedText], isBreak ? 36 : 48);

        mergeRefs.push(`B${currentRow}:C${currentRow}`);
        rowsXml.push(`
    <row r="${currentRow}" ht="${rowHeight}" customHeight="1">
      <c r="A${currentRow}" s="6" t="inlineStr"><is><t xml:space="preserve">${escapeXml(timeLabel)}</t></is></c>
      <c r="B${currentRow}" s="${styleIdx}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(combinedText)}</t></is></c>
      <c r="C${currentRow}" s="${styleIdx}" t="inlineStr"><is><t></t></is></c>
    </row>`);
        currentRow++;
      } else {
        // Single channel session
        const isCanalB = ch === 'Canal B';
        const textA = isCanalB ? '—' : formatSessionCellText(single, allSpeakers);
        const textB = isCanalB ? formatSessionCellText(single, allSpeakers) : '—';
        const rowHeight = estimateRowHeight([textA, textB], 48);

        rowsXml.push(`
    <row r="${currentRow}" ht="${rowHeight}" customHeight="1">
      <c r="A${currentRow}" s="6" t="inlineStr"><is><t xml:space="preserve">${escapeXml(timeLabel)}</t></is></c>
      <c r="B${currentRow}" s="7" t="inlineStr"><is><t xml:space="preserve">${escapeXml(textA)}</t></is></c>
      <c r="C${currentRow}" s="8" t="inlineStr"><is><t xml:space="preserve">${escapeXml(textB)}</t></is></c>
    </row>`);
        currentRow++;
      }
    }
  }

  const mergeXml =
    mergeRefs.length > 0
      ? `<mergeCells count="${mergeRefs.length}">${mergeRefs
          .map((ref) => `<mergeCell ref="${ref}"/>`)
          .join('')}</mergeCells>`
      : '';

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>
    <col min="1" max="1" width="18" customWidth="1"/>
    <col min="2" max="2" width="58" customWidth="1"/>
    <col min="3" max="3" width="58" customWidth="1"/>
  </cols>
  <sheetData>${rowsXml.join('')}
  </sheetData>
  ${mergeXml}
</worksheet>`;
}

export function generateAgendaExcelBlob(items: AgendaItemDTO[], speakers: SpeakerDTO[] = []): Blob {
  const days = groupAgendaByDayAndSlot(items);
  const effectiveDays: DayScheduleGroup[] =
    days.length > 0
      ? days
      : [
          {
            dateStr: '2026-11-20',
            jornadaNumber: 1,
            formattedDateLong: 'viernes, 20 de noviembre de 2026',
            formattedDateShort: '20 nov',
            slots: [],
          },
        ];

  const sheetFiles: { name: string; content: string; tabName: string }[] = effectiveDays.map(
    (day, idx) => ({
      name: `xl/worksheets/sheet${idx + 1}.xml`,
      tabName: `Jornada 0${day.jornadaNumber} (${day.formattedDateShort})`,
      content: buildComparativeSheetXml(day, speakers),
    })
  );

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  ${sheetFiles
    .map(
      (_, idx) =>
        `<Override PartName="/xl/worksheets/sheet${idx + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
    )
    .join('\n  ')}
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    ${sheetFiles
      .map(
        (sf, idx) =>
          `<sheet name="${escapeXml(sf.tabName)}" sheetId="${idx + 1}" r:id="rId${idx + 1}"/>`
      )
      .join('\n    ')}
  </sheets>
</workbook>`;

  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${sheetFiles
    .map(
      (_, idx) =>
        `<Relationship Id="rId${idx + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${idx + 1}.xml"/>`
    )
    .join('\n  ')}
  <Relationship Id="rId${sheetFiles.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const archiveFiles = [
    { name: '[Content_Types].xml', content: contentTypesXml },
    { name: '_rels/.rels', content: rootRelsXml },
    { name: 'xl/workbook.xml', content: workbookXml },
    { name: 'xl/_rels/workbook.xml.rels', content: workbookRelsXml },
    { name: 'xl/styles.xml', content: buildStylesXml() },
    ...sheetFiles.map((sf) => ({ name: sf.name, content: sf.content })),
  ];

  return createZipArchive(archiveFiles);
}

export function downloadAgendaExcel(items: AgendaItemDTO[], speakers: SpeakerDTO[] = []): void {
  const blob = generateAgendaExcelBlob(items, speakers);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Programa-Oficial-TourLatam-2026.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ============================================================================
// Printable / PDF Visual Schedule Generator
// ============================================================================

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPdfSessionCell(item?: AgendaItemDTO, allSpeakers: SpeakerDTO[] = [], track: 'A' | 'B' = 'A'): string {
  if (!item) {
    return `<div class="empty-slot">— Sin sesión programada en este canal —</div>`;
  }

  const typeLabel = TYPE_LABELS[item.type] || item.type;
  const speakers = resolveItemSpeakers(item, allSpeakers);
  const badgeClass =
    item.type === 'KEYNOTE'
      ? 'badge-keynote'
      : item.type === 'PANEL'
      ? 'badge-panel'
      : item.type === 'WORKSHOP'
      ? 'badge-workshop'
      : 'badge-default';

  const speakersHtml =
    speakers.length > 0
      ? `<div class="speakers-list">
          ${speakers
            .map((sp) => {
              const role = [sp.position, sp.company].filter(Boolean).join(' • ');
              return `<div class="speaker-item">
                <span class="speaker-dot ${track === 'A' ? 'dot-a' : 'dot-b'}"></span>
                <div>
                  <div class="speaker-name">${escapeHtml(sp.name)}</div>
                  ${role ? `<div class="speaker-role">${escapeHtml(role)}</div>` : ''}
                </div>
              </div>`;
            })
            .join('')}
        </div>`
      : '';

  return `
    <div class="session-card ${track === 'A' ? 'card-a' : 'card-b'}">
      <div class="session-meta">
        <span class="badge ${badgeClass}">${escapeHtml(typeLabel)}</span>
        ${item.room ? `<span class="room-tag">${escapeHtml(item.room)}</span>` : ''}
      </div>
      <div class="session-title">${escapeHtml(item.title)}</div>
      ${speakersHtml}
    </div>
  `;
}

export function buildPrintableAgendaHtml(items: AgendaItemDTO[], speakers: SpeakerDTO[] = []): string {
  const days = groupAgendaByDayAndSlot(items);
  const logoUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/logos-bolivia-white.png`;

  const daysHtml = days
    .map((day, idx) => {
      const rowsHtml = day.slots
        .map((slot) => {
          const timeHtml = `<div class="time-pill">${escapeHtml(slot.startTime)}<span class="time-sep">a</span>${escapeHtml(slot.endTime)}</div>`;

          if (slot.isParallel) {
            return `
              <tr>
                <td class="col-time">${timeHtml}</td>
                <td class="col-track">${renderPdfSessionCell(slot.canalA, speakers, 'A')}</td>
                <td class="col-track">${renderPdfSessionCell(slot.canalB, speakers, 'B')}</td>
              </tr>
            `;
          }

          const single = slot.ambos || slot.canalA || slot.canalB || slot.singleItem || slot.otherSessions[0];
          if (!single) return '';

          const isBreak = isBreakSession(single);
          const ch = (single.channel || 'Canal A').trim();
          const shouldSpanBoth =
            isBreak || ch === 'Ambos Canales' || single.type === 'NETWORKING' || single.type === 'BREAK';

          if (shouldSpanBoth) {
            if (isBreak) {
              return `
                <tr class="row-break">
                  <td class="col-time">${timeHtml}</td>
                  <td colspan="2" class="col-spanned break-cell">
                    <div class="break-banner">
                      <span class="break-badge">☕ BREAK / RECESO</span>
                      <span class="break-title">${escapeHtml(single.title)}</span>
                      ${single.room ? `<span class="break-room">• ${escapeHtml(single.room)}</span>` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }

            const slotSpeakers = resolveItemSpeakers(single, speakers);
            const speakersInline =
              slotSpeakers.length > 0
                ? `<div class="plenary-speakers">
                    ${slotSpeakers
                      .map((sp) => {
                        const role = [sp.position, sp.company].filter(Boolean).join(' • ');
                        return `<span class="plenary-speaker"><strong>${escapeHtml(sp.name)}</strong>${
                          role ? ` <em>(${escapeHtml(role)})</em>` : ''
                        }</span>`;
                      })
                      .join(' &nbsp;|&nbsp; ')}
                  </div>`
                : '';

            return `
              <tr class="row-plenary">
                <td class="col-time">${timeHtml}</td>
                <td colspan="2" class="col-spanned plenary-cell">
                  <div class="plenary-banner">
                    <div class="session-meta">
                      <span class="badge badge-plenary">★ ${escapeHtml(TYPE_LABELS[single.type] || single.type)} • AMBOS CANALES</span>
                      ${single.room ? `<span class="room-tag">${escapeHtml(single.room)}</span>` : ''}
                    </div>
                    <div class="session-title plenary-title">${escapeHtml(single.title)}</div>
                    ${speakersInline}
                  </div>
                </td>
              </tr>
            `;
          }

          const isCanalB = ch === 'Canal B';
          return `
            <tr>
              <td class="col-time">${timeHtml}</td>
              <td class="col-track">${isCanalB ? renderPdfSessionCell(undefined, speakers, 'A') : renderPdfSessionCell(single, speakers, 'A')}</td>
              <td class="col-track">${isCanalB ? renderPdfSessionCell(single, speakers, 'B') : renderPdfSessionCell(undefined, speakers, 'B')}</td>
            </tr>
          `;
        })
        .join('');

      return `
        <section class="day-section ${idx > 0 ? 'page-break-before' : ''}">
          <div class="day-header">
            <div class="day-badge">JORNADA 0${day.jornadaNumber}</div>
            <h2 class="day-title">${escapeHtml(day.formattedDateLong)}</h2>
            <div class="day-tz">Horario Oficial Bolivia (GMT-4)</div>
          </div>

          <table class="schedule-table">
            <thead>
              <tr>
                <th class="th-time">HORARIO</th>
                <th class="th-canal-a">CANAL A • TRACK PRINCIPAL</th>
                <th class="th-canal-b">CANAL B • TRACK PARALELO</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </section>
      `;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Programa Oficial — Tour LATAM Bolivia 2026</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.4;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #0b1120;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #00f2fe;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }
    .toolbar-info {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      font-weight: 700;
    }
    .toolbar-actions {
      display: flex;
      gap: 10px;
    }
    .btn-print {
      background: #00f2fe;
      color: #0b1120;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 12px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .btn-close {
      background: #1e293b;
      color: #cbd5e1;
      border: 1px solid #334155;
      padding: 8px 14px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
    }
    .container {
      max-width: 1000px;
      margin: 20px auto;
      background: #ffffff;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
    }
    .doc-header {
      background: linear-gradient(135deg, #0b1120 0%, #1e1b4b 100%);
      color: #ffffff;
      padding: 20px 24px;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-left: 6px solid #00f2fe;
    }
    .doc-header-left h1 {
      margin: 0 0 4px 0;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: -0.3px;
      color: #ffffff;
    }
    .doc-header-left p {
      margin: 0;
      color: #94a3b8;
      font-size: 11px;
    }
    .doc-header-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      text-align: right;
      font-size: 11px;
      color: #e2e8f0;
    }
    .doc-header-right .pmi-logo {
      height: 38px;
      width: auto;
      object-fit: contain;
      display: block;
    }
    .day-section {
      margin-bottom: 26px;
    }
    .day-header {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 16px;
      border-radius: 8px 8px 0 0;
      border-bottom: 2px solid #00f2fe;
    }
    .day-badge {
      background: #00f2fe;
      color: #0b1120;
      font-weight: 900;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }
    .day-title {
      margin: 0;
      font-size: 14px;
      font-weight: 800;
      text-transform: capitalize;
      flex: 1;
    }
    .day-tz {
      font-size: 10px;
      color: #94a3b8;
      font-weight: 600;
    }
    .schedule-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }
    .schedule-table th,
    .schedule-table td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      vertical-align: top;
    }
    .schedule-table thead th {
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      padding: 9px 10px;
      text-align: left;
    }
    .th-time {
      width: 14%;
      background: #1e293b;
      color: #ffffff;
      text-align: center !important;
    }
    .th-canal-a {
      width: 43%;
      background: #083344;
      color: #22d3ee;
    }
    .th-canal-b {
      width: 43%;
      background: #3b0764;
      color: #e9d5ff;
    }
    .schedule-table tr {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .col-time {
      background: #f8fafc;
      text-align: center;
      vertical-align: middle !important;
      font-weight: 800;
      color: #0f172a;
    }
    .time-pill {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
    }
    .time-sep {
      font-size: 9px;
      font-weight: 600;
      color: #64748b;
      margin: 1px 0;
    }
    .session-card {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .session-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
    }
    .badge {
      display: inline-block;
      padding: 1.5px 6px;
      border-radius: 4px;
      font-size: 8.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .badge-keynote {
      background: #fce7f3;
      color: #9d174d;
      border: 1px solid #f9a8d4;
    }
    .badge-panel {
      background: #cffafe;
      color: #155e75;
      border: 1px solid #67e8f9;
    }
    .badge-workshop {
      background: #f3e8ff;
      color: #6b21a8;
      border: 1px solid #d8b4fe;
    }
    .badge-plenary {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fcd34d;
    }
    .badge-default {
      background: #e2e8f0;
      color: #334155;
    }
    .room-tag {
      font-size: 9.5px;
      font-weight: 700;
      color: #be185d;
    }
    .session-title {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.35;
    }
    .speakers-list {
      margin-top: 3px;
      padding-top: 4px;
      border-top: 1px dashed #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .speaker-item {
      display: flex;
      align-items: flex-start;
      gap: 5px;
    }
    .speaker-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-top: 4px;
      flex-shrink: 0;
    }
    .dot-a {
      background: #0891b2;
    }
    .dot-b {
      background: #9333ea;
    }
    .speaker-name {
      font-size: 10px;
      font-weight: 700;
      color: #1e293b;
    }
    .speaker-role {
      font-size: 9px;
      color: #64748b;
    }
    .empty-slot {
      color: #94a3b8;
      font-style: italic;
      font-size: 10px;
      text-align: center;
      padding: 10px 0;
    }
    .break-cell {
      background: #ecfdf5 !important;
      vertical-align: middle !important;
    }
    .break-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      text-align: center;
      padding: 2px 0;
    }
    .break-badge {
      background: #10b981;
      color: #ffffff;
      font-weight: 900;
      font-size: 9px;
      padding: 2px 8px;
      border-radius: 999px;
      letter-spacing: 0.5px;
    }
    .break-title {
      font-weight: 800;
      font-size: 11px;
      color: #065f46;
    }
    .break-room {
      font-size: 10px;
      color: #047857;
      font-weight: 600;
    }
    .plenary-cell {
      background: #fffbeb !important;
    }
    .plenary-banner {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 3px;
    }
    .plenary-title {
      font-size: 11.5px;
      color: #78350f;
    }
    .plenary-speakers {
      font-size: 10px;
      color: #92400e;
      margin-top: 2px;
    }
    .doc-footer {
      margin-top: 16px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 9.5px;
      color: #64748b;
    }
    @media print {
      body {
        background: #ffffff;
      }
      .toolbar {
        display: none !important;
      }
      .container {
        margin: 0;
        padding: 0;
        box-shadow: none;
        max-width: 100%;
      }
      .page-break-before {
        page-break-before: always;
        break-before: page;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="toolbar-info">
      <span>📄 Vista Previa del Programa Oficial — Tour LATAM Bolivia 2026</span>
    </div>
    <div class="toolbar-actions">
      <button class="btn-print" onclick="window.print()">Guardar como PDF / Imprimir</button>
      <button class="btn-close" onclick="window.close()">Cerrar</button>
    </div>
  </div>

  <div class="container">
    <header class="doc-header">
      <div class="doc-header-left">
        <h1>TOUR LATAM BOLIVIA 2026</h1>
        <p>Congreso Internacional de Dirección de Proyectos • PMO • Agilidad • Inteligencia Artificial</p>
      </div>
      <div class="doc-header-right">
        <img src="${logoUrl}" alt="PMI Bolivia Chapter" class="pmi-logo" />
        <div><strong>20 &amp; 21 de Noviembre, 2026</strong> • 100% Virtual</div>
      </div>
    </header>

    ${daysHtml}

    <footer class="doc-footer">
      <span>Tour LATAM Bolivia 2026 — Organizado por PMI Bolivia Chapter</span>
      <span>Programa sujeto a actualizaciones • Acreditación oficial de PDUs</span>
    </footer>
  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`;
}

export function downloadAgendaPdf(items: AgendaItemDTO[], speakers: SpeakerDTO[] = []): void {
  const html = buildPrintableAgendaHtml(items, speakers);
  const printWindow = window.open('', '_blank', 'width=1050,height=850,scrollbars=yes,resizable=yes');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    // Fallback if popup blocker intercepts window.open: use hidden iframe print
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 3000);
      }, 400);
    }
  }
}
