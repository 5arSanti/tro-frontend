export interface TrainModel {
  id: string;
  name: string;
  wagon_count: number;
  capacity_per_wagon: number;
  total_capacity: number;
}

export interface Station {
  id: string;
  name: string;
  line: string;
  camera_id: string;
  travel_time_seconds: number;
  supported_trains: TrainModel[];
}

export interface DispatchPlan {
  station_id: string;
  station_name: string;
  camera_id: string;
  passenger_count: number;
  train_model: TrainModel;
  trains_required: number;
  total_capacity: number;
  surplus_capacity: number;
  status: string;
  estimated_cycle_time_seconds: number;
  generated_at: string;
}

export interface StationStatus {
  station: Station;
  last_passenger_count: number | null;
  last_updated: string | null;
  last_dispatch: DispatchPlan | null;
}

export interface TrainModelsResponse {
  trains: TrainModel[];
}

export interface StationsResponse {
  stations: Station[];
}

export interface StationStatusesResponse {
  stations: StationStatus[];
}

export interface DispatchRequest {
  station_id?: string;
  camera_id?: string;
  passenger_count: number;
  persist?: boolean;
}

