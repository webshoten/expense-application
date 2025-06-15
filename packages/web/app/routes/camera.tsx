import { Button } from '@/components/ui/button';
import { useCamera } from '@/context/camera-provider';
import { Outlet, useNavigate } from '@remix-run/react';
import { Camera, ImageIcon } from 'lucide-react';

export default function CameraLayout() {
  const navigate = useNavigate();
  const { showCamera } = useCamera();

  return (
    <main className="min-h-screen">
      <Outlet />
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center gap-1 justify-around h-16 px-4">
          <Button
            size="lg"
            onClick={() => {
              navigate('/camera');
              showCamera(true);
            }}
            className="flex-1 h-12 flex items-center justify-center"
          >
            <Camera className="mr-2 h-5 w-5" />
            カメラを起動
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-12 flex items-center justify-center"
            onClick={() => navigate('/camera/gallery')}
          >
            <ImageIcon className="mr-2 h-5 w-5" />
            ギャラリー
          </Button>
        </div>
      </nav>
    </main>
  );
}
