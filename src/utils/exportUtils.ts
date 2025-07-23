/**
 * Export utilities for IBAN data in various formats
 */

export type ExportFormat = 'csv' | 'json' | 'xml' | 'txt';

interface ExportData {
  ibans: string[];
  metadata?: {
    country?: string;
    bank?: string;
    quantity?: number;
    timestamp?: number;
  };
}

/**
 * Export IBANs to CSV format
 */
export function exportToCSV(data: ExportData): string {
  const { ibans, metadata } = data;
  const headers = ['IBAN', 'Country', 'Bank', 'Generated_At'];
  const rows = [headers.join(',')];

  ibans.forEach(iban => {
    const countryCode = iban.substring(0, 2);
    const bankName = metadata?.bank || 'Random';
    const timestamp = metadata?.timestamp ? new Date(metadata.timestamp).toISOString() : new Date().toISOString();
    
    rows.push(`"${iban}","${countryCode}","${bankName}","${timestamp}"`);
  });

  return rows.join('\n');
}

/**
 * Export IBANs to JSON format
 */
export function exportToJSON(data: ExportData): string {
  const { ibans, metadata } = data;
  
  const exportData = {
    export_info: {
      generated_at: new Date().toISOString(),
      total_ibans: ibans.length,
      format: 'json',
      version: '1.0'
    },
    metadata: {
      country: metadata?.country || 'Unknown',
      bank: metadata?.bank || 'Random',
      generation_timestamp: metadata?.timestamp ? new Date(metadata.timestamp).toISOString() : null
    },
    ibans: ibans.map(iban => ({
      iban: iban,
      formatted: formatIBAN(iban),
      country: iban.substring(0, 2),
      bank_code: extractBankCode(iban),
      account_number: extractAccountNumber(iban),
      check_digits: iban.substring(2, 4)
    }))
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export IBANs to XML format
 */
export function exportToXML(data: ExportData): string {
  const { ibans, metadata } = data;
  const timestamp = new Date().toISOString();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<iban_export>\n';
  xml += `  <export_info>\n`;
  xml += `    <generated_at>${timestamp}</generated_at>\n`;
  xml += `    <total_ibans>${ibans.length}</total_ibans>\n`;
  xml += `    <format>xml</format>\n`;
  xml += `    <version>1.0</version>\n`;
  xml += `  </export_info>\n`;
  xml += `  <metadata>\n`;
  xml += `    <country>${escapeXml(metadata?.country || 'Unknown')}</country>\n`;
  xml += `    <bank>${escapeXml(metadata?.bank || 'Random')}</bank>\n`;
  if (metadata?.timestamp) {
    xml += `    <generation_timestamp>${new Date(metadata.timestamp).toISOString()}</generation_timestamp>\n`;
  }
  xml += `  </metadata>\n`;
  xml += `  <ibans>\n`;
  
  ibans.forEach(iban => {
    xml += `    <iban>\n`;
    xml += `      <value>${escapeXml(iban)}</value>\n`;
    xml += `      <formatted>${escapeXml(formatIBAN(iban))}</formatted>\n`;
    xml += `      <country>${escapeXml(iban.substring(0, 2))}</country>\n`;
    xml += `      <bank_code>${escapeXml(extractBankCode(iban))}</bank_code>\n`;
    xml += `      <account_number>${escapeXml(extractAccountNumber(iban))}</account_number>\n`;
    xml += `      <check_digits>${escapeXml(iban.substring(2, 4))}</check_digits>\n`;
    xml += `    </iban>\n`;
  });
  
  xml += `  </ibans>\n`;
  xml += '</iban_export>';
  
  return xml;
}

/**
 * Export IBANs to plain text format
 */
export function exportToTXT(data: ExportData): string {
  const { ibans, metadata } = data;
  const timestamp = new Date().toISOString();
  
  let text = `IBAN Export - Generated at ${timestamp}\n`;
  text += `=================================================\n\n`;
  
  if (metadata) {
    text += `Metadata:\n`;
    text += `- Country: ${metadata.country || 'Unknown'}\n`;
    text += `- Bank: ${metadata.bank || 'Random'}\n`;
    text += `- Quantity: ${metadata.quantity || ibans.length}\n`;
    if (metadata.timestamp) {
      text += `- Generated: ${new Date(metadata.timestamp).toISOString()}\n`;
    }
    text += `\n`;
  }
  
  text += `Generated IBANs (${ibans.length}):\n`;
  text += `-`.repeat(30) + '\n';
  
  ibans.forEach((iban, index) => {
    text += `${index + 1}. ${formatIBAN(iban)}\n`;
  });
  
  return text;
}

/**
 * Main export function that handles all formats
 */
export function exportIBANs(data: ExportData, format: ExportFormat): Blob {
  let content: string;
  let mimeType: string;
  
  switch (format) {
    case 'csv':
      content = exportToCSV(data);
      mimeType = 'text/csv';
      break;
    case 'json':
      content = exportToJSON(data);
      mimeType = 'application/json';
      break;
    case 'xml':
      content = exportToXML(data);
      mimeType = 'application/xml';
      break;
    case 'txt':
    default:
      content = exportToTXT(data);
      mimeType = 'text/plain';
      break;
  }
  
  return new Blob([content], { type: `${mimeType};charset=utf-8` });
}

/**
 * Generate filename for export
 */
export function generateExportFilename(format: ExportFormat, metadata?: ExportData['metadata']): string {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const country = metadata?.country || 'mixed';
  const bank = metadata?.bank ? `-${metadata.bank.toLowerCase().replace(/\s+/g, '-')}` : '';
  
  return `iban-export-${country}${bank}-${timestamp}.${format}`;
}

// Helper functions
function formatIBAN(iban: string): string {
  return iban.replace(/(.{4})/g, '$1 ').trim();
}

function extractBankCode(iban: string): string {
  // Extract bank code based on country - simplified version
  const country = iban.substring(0, 2);
  const bban = iban.substring(4);
  
  // This is a simplified extraction - in a real application,
  // you'd use the IBAN_SPECS to determine the correct length
  switch (country) {
    case 'NL':
      return bban.substring(0, 4);
    case 'DE':
      return bban.substring(0, 8);
    case 'GB':
      return bban.substring(0, 6);
    case 'FR':
      return bban.substring(0, 10);
    default:
      return bban.substring(0, 4);
  }
}

function extractAccountNumber(iban: string): string {
  // Extract account number - simplified version
  const country = iban.substring(0, 2);
  const bban = iban.substring(4);
  
  switch (country) {
    case 'NL':
      return bban.substring(4);
    case 'DE':
      return bban.substring(8);
    case 'GB':
      return bban.substring(6);
    case 'FR':
      return bban.substring(10);
    default:
      return bban.substring(4);
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}