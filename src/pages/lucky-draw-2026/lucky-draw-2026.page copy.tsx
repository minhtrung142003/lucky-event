import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Stack, Typography, Button } from '@mui/material';
import { Employee } from '../../common/data';

export const ExcelImporter: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tsCode, setTsCode] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Đọc từ dòng 6 (bỏ qua 5 dòng header)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        range: 5, // Bắt đầu từ dòng 6 (index 5)
        header: ['stt', 'company', 'code', 'name', 'part', 'phong', 'bophan', 'department', 'thamgia', 'khongthamgia', 'lydo'],
        defval: '',
        raw: false,
      });

      console.log('📊 Tổng rows:', jsonData.length);
      console.log('📋 First 5 rows:', jsonData.slice(0, 5));

      // Map sang Employee format
      const mappedEmployees: any[] = jsonData
        .filter((row: any) => row.code && row.name)
        .map((row: any, index) => ({
          code: row.code || '', // Cột C - MSNV
          name: row.name || '', // Cột D - Họ tên
          part: row.part || '', // Cột E - Khối
          department: row.department || '', // Cột H - Chức danh
        }));

      console.log('✅ Mapped employees:', mappedEmployees.slice(0, 5));
      console.log('⚠️ Total valid employees:', mappedEmployees.length);

      setEmployees(mappedEmployees);

      const code = `export interface Employee {
  part: string;
  department: string;
  code: string;
  name: string;
}

export const employees: Employee[] = ${JSON.stringify(mappedEmployees, null, 2)};`;

      setTsCode(code);
    };
    reader.readAsBinaryString(file);
  };
  const handleCopyCode = () => {
    navigator.clipboard.writeText(tsCode).then(() => {
      alert('✅ Đã copy code vào clipboard! Paste vào employees.constant.ts nhé!');
    });
  };

  const handleDownload = () => {
    const blob = new Blob([tsCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.constant.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Stack sx={{ gap: 3, padding: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#026D60' }}>
        Import Excel để generate code TypeScript
      </Typography>

      {/* Upload Button */}
      <Button
        variant="contained"
        component="label"
        sx={{
          background: 'linear-gradient(144deg, #69F8E5 -44.06%, #026D60 59.8%)',
          padding: '12px 32px',
          fontSize: 16,
          fontWeight: 700,
          width: 'fit-content',
        }}
      >
        📁 Chọn file Excel
        <input type="file" hidden accept=".xlsx,.xls" onChange={handleFileUpload} />
      </Button>

      {/* Preview data */}
      {employees.length > 0 && (
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ color: '#026D60' }}>
            ✅ Đã đọc được {employees.length} nhân viên
          </Typography>

          {/* Action buttons */}
          <Stack direction="row" gap={2}>
            <Button
              variant="contained"
              onClick={handleCopyCode}
              sx={{
                background: '#48bb78',
                '&:hover': { background: '#38a169' },
                padding: '10px 24px',
                fontWeight: 600,
              }}
            >
              📋 Copy Code
            </Button>
            <Button
              variant="contained"
              onClick={handleDownload}
              sx={{
                background: '#667eea',
                '&:hover': { background: '#5a67d8' },
                padding: '10px 24px',
                fontWeight: 600,
              }}
            >
              💾 Download File
            </Button>
          </Stack>

          {/* Code Preview */}
          <Stack
            sx={{
              background: '#1a202c',
              borderRadius: 2,
              padding: 3,
              maxHeight: 500,
              overflow: 'auto',
            }}
          >
            <Typography
              component="pre"
              sx={{
                color: '#e2e8f0',
                fontFamily: 'monospace',
                fontSize: 13,
                lineHeight: 1.6,
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {tsCode}
            </Typography>
          </Stack>

          {/* Preview first 5 employees */}
          <Stack sx={{ gap: 2 }}>
            <Typography variant="h6" sx={{ color: '#026D60' }}>
              Preview 5 nhân viên đầu tiên:
            </Typography>
            {employees.slice(0, 5).map((emp, idx) => (
              <Stack
                key={idx}
                sx={{
                  padding: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(144deg, #69F8E5 -44.06%, #E8FDFB 59.8%)',
                  border: '1px solid #026D60',
                }}
              >
                <Typography sx={{ fontWeight: 700, color: '#026D60' }}>
                  {emp.code} - {emp.name}
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#026D60' }}>
                  {emp.department} | {emp.part}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
