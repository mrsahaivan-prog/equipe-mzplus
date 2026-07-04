/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PreviewSection {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string; // Lucide icon name
  metrics: {
    label: string;
    value: string;
    change?: string;
  }[];
  features: string[];
  visualType: 'chart' | 'academy' | 'syndicate';
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}
