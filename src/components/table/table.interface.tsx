import { ReactNode } from 'react';

export type OnClickRow = (row: any, index: number) => void;

export type DisableRow = { columnId: string; compareWith: any };

export interface Column {
  id: string;
  label: string;
  width?: number;
  align?: 'right' | 'left' | 'center';
  render?: (row: any, index: number) => React.ReactNode;
}

export interface CollapseProps {
  onOpenCollapse?: (row: any, index: number) => Promise<any>;

  render: (fullRow: any, index: number) => React.ReactNode;
}
