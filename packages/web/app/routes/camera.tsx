import { Button } from '@/components/ui/button';
import { useFile } from '@/context/file-provider';
import { usePageSwitch } from '@/context/page-switch-provider';
import { Outlet, useNavigate } from '@remix-run/react';
import { Camera, ImageIcon, Images } from 'lucide-react';

export default function CameraLayout() {
  const navigate = useNavigate();
  const { showCamera, showPrevious } = usePageSwitch();
  const { files, currentId } = useFile();

  return (
    <>
      <main className="min-h-screen">
        <Outlet />
      </main>
      <footer className="h-[65px]">
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
              <span className={'sm:block hidden'}>カメラを起動</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-12 flex items-center justify-center"
              disabled={!currentId || !files[currentId]}
              onClick={() => {
                navigate('/camera');
                showPrevious(true);
              }}
            >
              <ImageIcon className="mr-2 h-5 w-5" />
              <span className={'sm:block hidden'}>直近の写真</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-12 flex items-center justify-center"
              onClick={() => navigate('/camera/gallery')}
            >
              <Images className="mr-2 h-5 w-5" />
              <span className={'sm:block hidden'}>ギャラリー</span>
            </Button>
          </div>
        </nav>
      </footer>
    </>
  );
}
