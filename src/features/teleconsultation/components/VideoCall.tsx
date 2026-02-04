import {
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Share2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { RatingModal } from "@/features/teleconsultation/components/RatingModal";
import { useTranslation } from "react-i18next";
interface VideoCallProps {
  onEndCall: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const VideoCall = ({
  onEndCall,
  onToggleFullscreen,
  isFullscreen = false,
}: VideoCallProps) => {
  const { t } = useTranslation();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const isMobile = useIsMobile();

  const handleEndCall = () => {
    setShowRating(true);
  };

  const handleCloseRating = () => {
    setShowRating(false);
    onEndCall();
  };

  const handleSubmitRating = (rating: number, comment: string) => {
    setShowRating(false);
    onEndCall();
  };

  return (
    <div
      className={`relative ${
        isFullscreen
          ? "w-full h-full"
          : "w-full h-full rounded-xl overflow-hidden"
      } bg-black`}
    >
      {/* Main video feed */}
      <img
        src="https://i.pinimg.com/736x/ac/f0/e6/acf0e65f81199aa4ed1b9def35a3506e.jpg"
        alt="Video call"
        className="w-full h-full object-cover"
      />

      {/* Fullscreen button - Hidden on mobile */}
      {onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="absolute top-4 right-4 p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors backdrop-blur-sm border border-white/10 z-10"
          title={
            isFullscreen
              ? t("videoCall.exitFullscreen")
              : t("videoCall.fullscreen")
          }
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-white" />
          ) : (
            <Maximize2 className="w-5 h-5 text-white" />
          )}
        </button>
      )}

      {/* Self video preview - Responsive sizing */}
      <div
        className={`absolute ${
          isFullscreen
            ? "bottom-24 right-8 w-32 h-32 md:w-48 md:h-48"
            : isMobile
              ? "bottom-20 right-3 w-20 h-20"
              : "bottom-20 right-6 w-32 h-32"
        } rounded-lg overflow-hidden shadow-2xl border border-white/20 transition-all duration-300`}
      >
        <img
          src="https://i.pinimg.com/736x/6b/8b/0a/6b8b0aa412e8b2f5b7587c0e87a2f46e.jpg"
          alt="You"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Video controls - Responsive sizing */}
      <div
        className={`absolute ${
          isFullscreen ? "bottom-8" : isMobile ? "bottom-4" : "bottom-6"
        } left-1/2 -translate-x-1/2 flex gap-2 md:gap-3`}
      >
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`${
            isMobile ? "p-3" : "p-4"
          } rounded-full transition-all backdrop-blur-sm border ${
            isMuted
              ? "bg-red-500 hover:bg-red-600 border-red-400/30"
              : "bg-black/40 hover:bg-black/60 border-white/10"
          }`}
          title={isMuted ? t("videoCall.unmute") : t("videoCall.mute")}
        >
          <MicOff
            className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-white`}
          />
        </button>

        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`${
            isMobile ? "p-3" : "p-4"
          } rounded-full transition-all backdrop-blur-sm border ${
            isVideoOff
              ? "bg-red-500 hover:bg-red-600 border-red-400/30"
              : "bg-black/40 hover:bg-black/60 border-white/10"
          }`}
          title={
            isVideoOff ? t("videoCall.cameraOn") : t("videoCall.cameraOff")
          }
        >
          <VideoOff
            className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-white`}
          />
        </button>

        <button
          onClick={handleEndCall}
          className={`${
            isMobile ? "p-3" : "p-4"
          } rounded-full bg-red-600 hover:bg-red-700 transition-all shadow-lg border border-red-500/30`}
          title={t("videoCall.endCall")}
        >
          <PhoneOff
            className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-white`}
          />
        </button>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRating}
        onClose={handleCloseRating}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};
