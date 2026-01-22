
export interface Profile {
  id: string;
  company_name: string;
  is_admin: boolean;
  status: 'active' | 'pending' | 'suspended';
  created_at: string;
}

export interface Audit {
  id: string;
  user_id: string;
  file_url: string;
  extracted_data: any;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface CarbonStats {
  totalEmissions: number;
  monthlyTrend: number;
  complianceScore: number;
  auditsCount: number;
}
