/* eslint-disable no-use-before-define */
export interface General {
  vendor: number
  type: number
  serial: string
  index: number
  life: number
  reason: string
  iccid: string[]
}

export interface Gps {
  time: number
  timestring: string
  latitude: number
  longitude: number
  speed: number
  direction: number
  altitude: number
  moving: number
}

export interface Hardware {
  inputs: Inputs
  ads: Ads
  counters: Counters
}

export interface Inputs {
  ignition: number
  panic: number
  input1: number
  input2: number
  input3: number
  input4: number
  input5: number
  input6: number
  input7: number
  input8: number
}

export interface Ads {
  ad1: number
  ad2: number
  ad3: number
  ad4: number
}

export interface Counters {
  counter3: number
}

export interface Status {
  gps_hdop: number
  gps_svn: number
  gps_signal: number
  battery_charging: number
}

export interface Peripheral {
  acelerometer_x: number
  acelerometer_y: number
  acelerometer_z: number
  odometer: number
  hourmeter: number
  rpm: number
  anti_theft: number
  v_ext: number
  v_bat: number
  percentage_bat: number
  status: Status
}

export interface Telemetry {
  odometer: number
  speed: number
}

export interface Extra {
  rpm_medio: string
  rpm_maximo: string
  rpm_minimo: string
  index: string
  modoHorimetro: string
  horimetro_acumulado3: string
  horimetro_acumulado4: string
  horimetro_acumulado5: string
  horimetro_acumulado6: string
  micro_gw_name: string
  micro_gw_type: string
  micro_gw_version: string
  protocolo_versao: string
  modelo_rastreador: string
  full_message: string
  __collect_version: string
}

export interface DdmxType {
  general: General
  gps: Gps
  hardware: Hardware
  peripheral: Peripheral
  telemetry: Telemetry
  extra: Extra
  conta: string
  data_servidor: number
  data_servidor_str: string
}

export interface Equipment {
  serial: string
  licence_plate: string
  name: string
  poi: string
  area: string
  model: string
  group: string
  subgroup: string
  subgroup_code: string
  equipment: string
  category: string
  odometer: number
  downtime: number
  maintenance: boolean
}

export interface Route {
  distance: number
  initial_date: number
  final_date: number
  final_lon: number
  final_lat: number
  initial_lat: number
  average_speed: number
  initial_lon: number
  final_dateString: string
  max_speed: number
  initial_dateString: string
  iddle_time: number
  hourmeter: number
  odometer: number
  duration: number
  driver: string
  driver_code: string
  hourmeter_traveled: number
  duration_total: number
  hourmeter_battery: number
  hourmeter_battery_traveled: number
  hourmeter_rpm: number
  hourmeter_rpm_traveled: number
  initial_address: string
  final_address: string
}

export interface TimeInsideArea {
  vel_max: number
  distance: number
  moving_time: number
  off_journey: boolean
  area_type: number
  entry_timeString: string
  area_name: string
  departure_time: number
  time_inside: number
  vehicle_licence_plate: string
  entry_time: number
  departure_timeString: string
  vel_med: number
  stopped_time: number
  driver: string
}

export interface IdleTime {
  vehicle_category: string
  vehicle_group: string
  vehicle_name: string
  vehicle_licence_plate: string
  dateString: string
  date: number
  idle_time: number
  motive: string
  address: string
  area: string
  driver: string
}

export interface SpeedLimit {
  vel_max: number
  lat: number
  lon: number
  driver: string
  time_above_limit: number
  area_name: string
  vehicle_licence_plate: string
  time_exceeded: number
  time_returned: number
  limit: number
  address: string
}

export interface Maintenance {
  status: number
  time_maintenance: number
  time_recurrence: number
  creation_date: number
  execution_date: number
  executed: boolean
  licence_plate: string
  km_maintenance: number
  km_recurrence: number
  reminder_date: number
  name: string
  cost: number
}

export interface VehicleUse {
  distance: number
  final_date: number
  initial_date: number
  driver: string
  initial_area: string
  final_area: string
  initial_engine_hourmeter: number
  final_engine_hourmeter: number
  odometer: number
  duration: number
  initial_lon: number
  initial_dateString: string
  final_lat: number
  final_lon: number
  initial_lat: number
  average_speed: number
  final_dateString: string
}

export interface Boarding {
  areas: string
  latitude: number
  longitude: number
  placa_veiculo: string
  grupo_veiculo: string
  tipo_veiculo: string
  endereco: string
  nome_veiculo: string
  nome_passageiro: string
  dataString: string
  data: number
  acao: string
  identificador_passageiro: string
  matricula_passageiro: string
}

export type Analysis = {
  serial: string
  data: string
  odometro: number
  odometro_acumulado: number
  horimetro: number
  horimetro_motor: number
  horimetro_motor_acumulado: number
  horimetro_tensao_bateria: number
  horimetro_tensao_bateria_acumulado: number
  horimetro_rpm: number
  horimetro_rpm_acumulado: number
  endereco: string
  latitude: number
  longitude: number
  velocidade: number
  area_dentro: {
    id: number
    nome: string
    cor: string
    categoria: string
    grupo: string
    coordenadas: Array<{
      lat: number
      lon: number
    }>
  }
  tempo_dentro_area: number
  ponto_dentro: {
    id: string
    nome: string
    endereco_cadastro: string
    categoria: string
    raio: number
    lat: number
    lon: number
  }
  ponto_proximo: {
    id: string
    nome: string
    endereco_cadastro: string
    categoria: string
    raio: number
    lat: number
    lon: number
  }
  tempo_dentro_ponto: number
  tempo_ligado_acumulado: number
  tempo_ligado_ultima_rota: number
  tempo_desligado_acumulado: number
  tempo_desligado_ultima_rota: number
  tempo_ligado_parado_acumulado: number
  tempo_rpm_produtivo_acumulado: number
  tempo_rpm_improdutivo_acumulado: number
  numero_rotas: number
  inputs: Array<number>
  inputs_counter: Array<number>
  outputs: Array<number>
  ads: Array<number>
  telemetria: Array<number>
  passageiros: Array<string>
  status: string
  tempo_processamento: number
  tempo_processamento_total: number
  variacao_inputs: Array<number>
  variacao_outputs: Array<number>
  rotas: Array<{
    serial: string
    data_inicio: string
    data_fim: string
    motorista: string
    velocidade_maxima: number
    velocidade_media: number
    distancia: number
    tempo_total: number
    tempo_parado: number
    tempo_movimento: number
    horimetro_motor_percorrido: number
    odometro_final: number
    horimetro_motor_final: number
  }>
  ultimaArea_interesse: {
    serial: string
    tipo: number
    datahora: string
    valor: number
    valor2: number
    lat: number
    lon: number
    vel: number
    motorista: string
    motorista_nome: string
    passageiro: string
    passageiro_nome: string
    passageiros_embarcados: Array<string>
    nome_cadastro: string
    inputs: Array<number>
    inputs_counter: Array<number>
    outputs: Array<number>
    ads: Array<number>
    descricao: string
    area: {
      id: number
      nome: string
      cor: string
      categoria: string
      grupo: string
      coordenadas: Array<{
        lat: number
        lon: number
      }>
    }
  }
  ultimoPonto_interesse: {
    serial: string
    tipo: number
    datahora: string
    valor: number
    valor2: number
    lat: number
    lon: number
    vel: number
    motorista: string
    motorista_nome: string
    passageiro: string
    passageiro_nome: string
    passageiros_embarcados: Array<string>
    nome_cadastro: string
    inputs: Array<number>
    inputs_counter: Array<number>
    outputs: Array<number>
    ads: Array<number>
    descricao: string
    area: {
      id: number
      nome: string
      cor: string
      categoria: string
      grupo: string
      coordenadas: Array<{
        lat: number
        lon: number
      }>
    }
  }
}
