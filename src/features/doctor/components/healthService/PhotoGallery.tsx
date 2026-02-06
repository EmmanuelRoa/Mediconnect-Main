import { useState } from "react";
import { ImageCarouselModal } from "./ImageCarouselModal";

interface PhotoGalleryProps {
  images: string[];
  alt?: string;
}

const PhotoGallery = ({
  images,
  alt = "Foto de galería",
}: PhotoGalleryProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const openModal = (index: number) => {
    setStartIndex(index);
    setModalOpen(true);
  };

  const count = images.length;

  if (count === 0) return null;

  const renderImage = (
    src: string,
    index: number,
    className: string,
    showOverlay?: number,
    customRounded?: string,
  ) => {
    return (
      <button
        key={index}
        onClick={() => openModal(index)}
        className={`relative overflow-hidden cursor-pointer group focus:outline-none focus:ring-2 focus:ring-ring ${className} ${customRounded || ""}`}
      >
        <img
          src={src}
          alt={`${alt} ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {showOverlay && showOverlay > 0 && (
          <div className="absolute inset-0 gallery-overlay flex items-center justify-center transition-opacity">
            <span className="text-white text-2xl font-semibold font-body">
              +{showOverlay} más
            </span>
          </div>
        )}
      </button>
    );
  };

  // Layout for 1 image
  if (count === 1) {
    return (
      <>
        <div className="w-full h-[400px]">
          {renderImage(images[0], 0, "w-full h-full", undefined, "rounded-3xl")}
        </div>
        <ImageCarouselModal
          images={images}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          startIndex={startIndex}
        />
      </>
    );
  }

  // Layout for 2 images
  if (count === 2) {
    return (
      <>
        <div className="grid grid-cols-2 gap-1 h-[400px]">
          {renderImage(
            images[0],
            0,
            "w-full h-full",
            undefined,
            "rounded-l-3xl",
          )}
          {renderImage(
            images[1],
            1,
            "w-full h-full",
            undefined,
            "rounded-r-3xl",
          )}
        </div>
        <ImageCarouselModal
          images={images}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          startIndex={startIndex}
        />
      </>
    );
  }

  // Layout for 3 images
  if (count === 3) {
    return (
      <>
        <div className="grid grid-cols-2 gap-1 h-[400px]">
          <div className="row-span-2">
            {renderImage(
              images[0],
              0,
              "w-full h-full",
              undefined,
              "rounded-l-3xl",
            )}
          </div>
          {renderImage(
            images[1],
            1,
            "w-full h-full",
            undefined,
            "rounded-tr-3xl",
          )}
          {renderImage(
            images[2],
            2,
            "w-full h-full",
            undefined,
            "rounded-br-3xl",
          )}
        </div>
        <ImageCarouselModal
          images={images}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          startIndex={startIndex}
        />
      </>
    );
  }

  // Layout for 4 images
  if (count === 4) {
    return (
      <>
        <div className="grid grid-cols-3 gap-1 h-[400px]">
          <div className="col-span-2 row-span-2">
            {renderImage(
              images[0],
              0,
              "w-full h-full",
              undefined,
              "rounded-l-3xl",
            )}
          </div>
          {renderImage(
            images[1],
            1,
            "w-full h-full",
            undefined,
            "rounded-tr-3xl",
          )}
          <div className="grid grid-cols-2 gap-1">
            {renderImage(images[2], 2, "w-full h-full", undefined, "")}
            {renderImage(
              images[3],
              3,
              "w-full h-full",
              undefined,
              "rounded-br-3xl",
            )}
          </div>
        </div>
        <ImageCarouselModal
          images={images}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          startIndex={startIndex}
        />
      </>
    );
  }

  // Layout for 5+ images (show first 5, overlay on last)
  const visibleImages = images.slice(0, 5);
  const remaining = count - 5;

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-1 h-[400px]">
        <div className="col-span-2 row-span-2">
          {renderImage(
            visibleImages[0],
            0,
            "w-full h-full",
            undefined,
            "rounded-l-3xl",
          )}
        </div>
        {renderImage(visibleImages[1], 1, "w-full h-full", undefined, "")}
        {renderImage(
          visibleImages[2],
          2,
          "w-full h-full",
          undefined,
          "rounded-tr-3xl",
        )}
        {renderImage(visibleImages[3], 3, "w-full h-full", undefined, "")}
        {renderImage(
          visibleImages[4],
          4,
          "w-full h-full",
          remaining > 0 ? remaining : undefined,
          "rounded-br-3xl",
        )}
      </div>
      <ImageCarouselModal
        images={images}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        startIndex={startIndex}
      />
    </>
  );
};

export default PhotoGallery;
