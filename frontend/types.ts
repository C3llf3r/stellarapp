export interface Experiment {
  id: string;
  mission: string;
  facility: string;
  material: string;
  material_type: string;
  gravity_g: number;
  environment: string;
  oxygen_concentration_pct: number;
  pressure_kpa: number;
  air_flow_velocity_cms: number;
  flame_spread_rate_mms: number;
  flame_shape: string;
  flame_temperature_k: number;
  soot_production: string;
  cool_flame_observed: boolean;
  limiting_oxygen_index_pct: number;
  extinction_limit_flow_cms: number;
  quenching_distance_mm: number;
  safety_risk_level: "Low" | "Moderate" | "Critical" | "Extreme";
  spacecraft_implication: string;
  recommended_suppression: string;
  nasa_reference: string;
}

export interface MetricsData {
  total_experiments: number;
  unique_materials_count: number;
  materials: string[];
  cool_flame_detections: number;
  max_flame_spread_rate_mms: number;
  critical_risk_count: number;
  missions_covered: string[];
}

export interface SimulationResult {
  input_parameters: {
    material: string;
    gravity_g: number;
    oxygen_concentration_pct: number;
    pressure_kpa: number;
    air_flow_velocity_cms: number;
  };
  predicted_risk_level: "Low" | "Moderate" | "Critical" | "Extreme";
  risk_score: number;
  estimated_flame_spread_mms: number;
  cool_flame_risk: boolean;
  extinction_strategy: string;
  compliance_note: string;
}
