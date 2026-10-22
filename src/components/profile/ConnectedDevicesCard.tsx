import { Device } from '@/types/profile';
import SurfaceCard from '../ui/SurfaceCard';

const ConnectedDevicesCard = ({ devices }: { devices: Device[] }) => {
  return (
    <SurfaceCard>
      <h2 className='text-lg font-bold text-slate-900'>Connected devices</h2>
      <ul className='mt-4 space-y-3'>
        {devices.map((device) => (
          <li
            key={device.name}
            className='flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3'
          >
            <span className='text-slate-900'>{device.name}</span>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                device.status === 'Connected'
                  ? 'bg-emerald-100 text-emerald-800'
                  : device.status === 'Sync needed'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
              }`}
            >
              {device.status}
            </span>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
};

export default ConnectedDevicesCard;

