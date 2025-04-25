// app/dashboard/page.tsx
"use client";

import {
  CheckCircle,
  RefreshCw,
  PlugZap,
  BatteryFull,
  ArrowUp,
  Gauge,
  Signal,
  Thermometer,
  Wind,
  Maximize,
  MapPin,
} from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";
import { formatDistanceToNow } from 'date-fns';
import dynamic from 'next/dynamic';

// Dynamically import the MapView component with no SSR
// This is necessary because Leaflet requires browser APIs
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video w-full flex items-center justify-center rounded bg-gray-700 text-gray-400">
      Loading map...
    </div>
  )
});

// Helper component for Stats Cards
interface StatCardProps {
  title: string;
  value: string;
  secondaryText: string;
  icon: React.ElementType;
  iconColorClass?: string;
}

function StatCard({ title, value, secondaryText, icon: Icon, iconColorClass = "text-blue-500" }: StatCardProps) {
  return (
    <div className="rounded-lg bg-gray-800 p-4 shadow">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <Icon className={`h-5 w-5 ${iconColorClass}`} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400">{secondaryText}</p>
    </div>
  );
}

// Helper component for Progress Bar
interface ProgressBarProps {
  value: number;
  colorClass: string;
}

function ProgressBar({ value, colorClass }: ProgressBarProps) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-600">
      <div
        className={`h-full rounded-full ${colorClass}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// Helper to format flight time
function formatFlightTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    remainingSeconds.toString().padStart(2, '0')
  ].join(':');
}

export default function DashboardPage() {
  // Use the telemetry context to get live data
  const { telemetryData, isSimulating, startSimulation, stopSimulation } = useTelemetry();
  
  // Calculate battery color based on percentage
  const batteryColorClass = telemetryData.batteryPercentage > 50 
    ? "text-green-500" 
    : telemetryData.batteryPercentage > 20 
      ? "text-yellow-500" 
      : "text-red-500";

  // Calculate signal strength text
  const getSignalStrengthText = (dbm: number) => {
    if (dbm > -70) return "Excellent";
    if (dbm > -85) return "Good";
    if (dbm > -100) return "Fair";
    return "Poor";
  };

  // Format coordinates for display
  const formatCoordinate = (coord: number, isLatitude: boolean) => {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = ((absolute - degrees - minutes/60) * 3600).toFixed(2);
    const direction = isLatitude 
      ? (coord >= 0 ? "N" : "S")
      : (coord >= 0 ? "E" : "W");
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  // Gas sensor data with calculated percentages for visualization
  const gasSensorData = {
    co: { 
      value: telemetryData.coLevel, 
      percentage: Math.min(100, (telemetryData.coLevel / 5) * 100), // Assuming 5 PPM is max
      color: "bg-blue-500" 
    },
    no2: { 
      value: telemetryData.no2Level, 
      percentage: Math.min(100, (telemetryData.no2Level / 200) * 100), // Assuming 200 PPM is max
      color: "bg-purple-500" 
    },
    so2: { 
      value: telemetryData.so2Level, 
      percentage: Math.min(100, (telemetryData.so2Level / 20) * 100), // Assuming 20 PPM is max
      color: "bg-orange-500" 
    },
  };

  // System status info
  const systemStatus = {
    lastUpdate: isSimulating 
      ? "Live" 
      : formatDistanceToNow(telemetryData.timestamp, { addSuffix: true }),
    flightTime: formatFlightTime(telemetryData.flightTime)
  };

  // Map info
  const mapInfo = {
    lat: formatCoordinate(telemetryData.latitude, true),
    long: formatCoordinate(telemetryData.longitude, false),
    heading: "275°" // This could be calculated based on movement direction
  };

  // Position for the map
  const mapPosition: [number, number] = [telemetryData.latitude, telemetryData.longitude];

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Top Bar: Status and Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Status Indicator */}
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${
          isSimulating 
            ? "border-green-600 bg-green-900/50 text-green-300" 
            : "border-yellow-600 bg-yellow-900/50 text-yellow-300"
        }`}>
          <CheckCircle className="h-4 w-4" />
          {isSimulating ? "Connected" : "Disconnected"}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm text-gray-300 transition hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={isSimulating ? stopSimulation : startSimulation}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="h-4 w-4" />
                Stop Simulation
              </>
            ) : (
              <>
                <PlugZap className="h-4 w-4" />
                Start Simulation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Battery Status"
          value={`${telemetryData.batteryPercentage.toFixed(1)}%`}
          secondaryText={`${telemetryData.voltage.toFixed(1)}V | ${telemetryData.current.toFixed(1)}A`}
          icon={BatteryFull}
          iconColorClass={batteryColorClass}
        />
        <StatCard
          title="Altitude"
          value={`${telemetryData.altitude.toFixed(1)}m`}
          secondaryText="Above Sea Level"
          icon={ArrowUp}
          iconColorClass="text-blue-400"
        />
        <StatCard
          title="Speed"
          value={`${telemetryData.speed.toFixed(1)} m/s`}
          secondaryText="Ground Speed"
          icon={Gauge}
          iconColorClass="text-purple-400"
        />
        <StatCard
          title="Signal Strength"
          value={`${telemetryData.signalStrength.toFixed(0)} dBm`}
          secondaryText={getSignalStrengthText(telemetryData.signalStrength)}
          icon={Signal}
          iconColorClass="text-yellow-400"
        />
      </div>

      {/* Main Content Grid: Map and Right Sidebar */}
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Live Location Map Card */}
        <div className="relative rounded-lg bg-gray-800 p-4 shadow lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Live Location</h2>
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-white"><Maximize className="h-5 w-5" /></button>
              <button className="text-gray-400 hover:text-white"><MapPin className="h-5 w-5" /></button>
            </div>
          </div>
          
          {/* Map Component */}
          <div className="aspect-video w-full overflow-hidden rounded">
            <MapView 
              position={mapPosition} 
              zoom={14}
              height="100%"
              width="100%"
              popupContent={
                <div>
                  <div className="font-semibold">UAV Location</div>
                  <div>Latitude: {telemetryData.latitude.toFixed(6)}</div>
                  <div>Longitude: {telemetryData.longitude.toFixed(6)}</div>
                  <div>Altitude: {telemetryData.altitude.toFixed(1)}m</div>
                  <div>Speed: {telemetryData.speed.toFixed(1)} m/s</div>
                </div>
              }
            />
          </div>
          
          {/* Info Overlay */}
          <div className="absolute bottom-6 left-6 rounded bg-black/60 p-2 text-xs text-white backdrop-blur-sm">
            <div>Lat: {mapInfo.lat}</div>
            <div>Long: {mapInfo.long}</div>
            <div>Heading: {mapInfo.heading}</div>
          </div>
        </div>

        {/* Right Column Cards */}
        <div className="flex flex-col gap-6">
          {/* Temperature Card */}
          <div className="rounded-lg bg-gray-800 p-4 shadow">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Temperature</h3>
              <Thermometer className="h-5 w-5 text-red-500" />
            </div>
            {/* Temperature Chart Placeholder */}
            <div className="mb-3 h-16 w-full rounded bg-gradient-to-r from-blue-600 via-red-500 to-red-600 opacity-75">
              {/* Actual chart would go here */}
            </div>
            <p className="text-center text-xl font-semibold text-white">{telemetryData.temperature.toFixed(1)}°C</p>
          </div>

          {/* Gas Sensors Card */}
          <div className="rounded-lg bg-gray-800 p-4 shadow">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Gas Sensors</h3>
              <Wind className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="space-y-3 text-sm">
              {/* CO */}
              <div className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-gray-400">CO <span className="text-xs">(PPM)</span></span>
                <ProgressBar value={gasSensorData.co.percentage} colorClass={gasSensorData.co.color} />
                <span className="w-12 shrink-0 text-right text-white">{gasSensorData.co.value.toFixed(1)}</span>
              </div>
              {/* NO2 */}
              <div className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-gray-400">NO₂ <span className="text-xs">(PPM)</span></span>
                <ProgressBar value={gasSensorData.no2.percentage} colorClass={gasSensorData.no2.color} />
                <span className="w-12 shrink-0 text-right text-white">{gasSensorData.no2.value.toFixed(1)}</span>
              </div>
              {/* SO2 */}
              <div className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-gray-400">SO₂ <span className="text-xs">(PPM)</span></span>
                <ProgressBar value={gasSensorData.so2.percentage} colorClass={gasSensorData.so2.color} />
                <span className="w-12 shrink-0 text-right text-white">{gasSensorData.so2.value.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* System Status Card */}
          <div className="rounded-lg bg-gray-800 p-4 shadow">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">System Status</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Last Update</span>
                <span className="text-white">{systemStatus.lastUpdate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Flight Time</span>
                <span className="text-white">{systemStatus.flightTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={isSimulating ? "text-green-400" : "text-yellow-400"}>
                  {isSimulating ? "Active" : "Standby"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
