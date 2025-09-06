import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Upload } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropper() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [src, setSrc] = useState<string | null>(null);
  // keep a full crop object or undefined
  const [crop, setCrop] = useState<Crop | undefined>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [pixelCrop, setPixelCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // transform state
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);

  // filters
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturate, setSaturate] = useState<number>(100);

  // aspect ratio options
  const aspectOptions: Array<{ label: string; value?: number }> = [
    { label: "Free", value: undefined },
    { label: "1:1 Avatar", value: 1 },
    { label: "4:3", value: 4 / 3 },
    { label: "16:9 Cover", value: 16 / 9 },
    { label: "3:2", value: 3 / 2 },
    { label: "2:3", value: 2 / 3 },
  ];

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // force recalc when new image loads
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // when image loads we center crop according to current aspect (or default centered free crop)
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      imgRef.current = img;
      setPixelCrop(null);

      if (aspect) {
        const newCrop = centerAspectCrop(img.width, img.height, aspect);
        setCrop(newCrop);
        setPixelCrop(convertToPixelCrop(newCrop, img.width, img.height));
      } else {
        const defaultCentered = centerCrop(
          { unit: "%", width: 90, height: 90 },
          img.width,
          img.height
        );
        setCrop(defaultCentered);
        setPixelCrop(
          convertToPixelCrop(defaultCentered, img.width, img.height)
        );
      }
    },
    [aspect]
  );

  // if user changes aspect while an image is loaded, center the crop automatically
  useEffect(() => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    if (aspect) {
      const newCrop = centerAspectCrop(img.width, img.height, aspect);
      setCrop(newCrop);
      setPixelCrop(convertToPixelCrop(newCrop, img.width, img.height));
    } else {
      const defaultCentered = centerCrop(
        { unit: "%", width: 90, height: 90 },
        img.width,
        img.height
      );
      setCrop(defaultCentered);
      setPixelCrop(convertToPixelCrop(defaultCentered, img.width, img.height));
    }
  }, [aspect]);

  const filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;

  const generateCroppedImage = useCallback(
    async (toFileName?: string) => {
      if (!imgRef.current || !pixelCrop) return null;
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      const sx = pixelCrop.x;
      const sy = pixelCrop.y;
      const sw = pixelCrop.width;
      const sh = pixelCrop.height;

      const outputW = Math.round(sw * zoom);
      const outputH = Math.round(sh * zoom);
      canvas.width = outputW;
      canvas.height = outputH;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.filter = filterString;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      ctx.drawImage(
        imgRef.current,
        sx * scaleX,
        sy * scaleY,
        sw * scaleX,
        sh * scaleY,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );

      ctx.restore();

      const dataUrl = canvas.toDataURL("image/png");
      if (toFileName) {
        const link = document.createElement("a");
        link.download = toFileName;
        link.href = dataUrl;
        link.click();
      }

      if (previewCanvasRef.current) {
        const pctx = previewCanvasRef.current.getContext("2d");
        if (pctx) {
          previewCanvasRef.current.width = canvas.width;
          previewCanvasRef.current.height = canvas.height;
          pctx.clearRect(
            0,
            0,
            previewCanvasRef.current.width,
            previewCanvasRef.current.height
          );
          const tmpImg = new Image();
          tmpImg.onload = () => {
            pctx.filter = filterString;
            pctx.drawImage(
              tmpImg,
              0,
              0,
              previewCanvasRef.current!.width,
              previewCanvasRef.current!.height
            );
          };
          tmpImg.src = dataUrl;
        }
      }

      return dataUrl;
    },
    [filterString, flipH, flipV, pixelCrop, rotation, zoom]
  );

  // useEffect(() => {
  //   if (!pixelCrop) return;
  //   generateCroppedImage();
  // }, [
  //   pixelCrop,
  //   rotation,
  //   flipH,
  //   flipV,
  //   zoom,
  //   brightness,
  //   contrast,
  //   saturate,
  //   generateCroppedImage,
  // ]);

  // const rotate90 = () => setRotation((r) => (r + 90) % 360);
  // const rotate180 = () => setRotation((r) => (r + 180) % 360);

  const reset = () => {
    if (imgRef.current) {
      const img = imgRef.current;
      if (aspect) {
        const newCrop = centerAspectCrop(img.width, img.height, aspect);
        setCrop(newCrop);
        setPixelCrop(convertToPixelCrop(newCrop, img.width, img.height));
      } else {
        const defaultCentered = centerCrop(
          { unit: "%", width: 90, height: 90 },
          img.width,
          img.height
        );
        setCrop(defaultCentered);
        setPixelCrop(
          convertToPixelCrop(defaultCentered, img.width, img.height)
        );
      }
    } else {
      // fallback full default
      setCrop({ unit: "%", x: 25, y: 25, width: 50, height: 50 });
      setPixelCrop(null);
    }

    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(1);
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
  };

  const handleComplete = (c: PixelCrop) => setPixelCrop(c);
  const onSaveFile = async () =>
    await generateCroppedImage(`image-${Date.now()}.png`);

  // Fit-to-image: full image but respect aspect if set
  const fitToImage = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    if (aspect) {
      const newCrop = centerAspectCrop(img.width, img.height, aspect);
      setCrop(newCrop);
      setPixelCrop(convertToPixelCrop(newCrop, img.width, img.height));
    } else {
      const full = { unit: "%", x: 0, y: 0, width: 100, height: 100 } as Crop;
      setCrop(full);
      setPixelCrop(convertToPixelCrop(full, img.width, img.height));
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 mx-auto max-w-6xl">
      <div className=" gap-4">
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="secondary"
        >
          <Upload className="w-12 h-12 text-gray-500" />
          Choose files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onSelectFile}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-gray-50 p-3 rounded border">
          {!src ? (
            <div className="text-sm text-gray-500">No image selected</div>
          ) : (
            <div className="overflow-hidden flex items-center justify-center">
              <ReactCrop
                crop={crop}
                onChange={(newCrop, percentCrop) =>
                  setCrop(percentCrop || newCrop)
                }
                onComplete={handleComplete}
                ruleOfThirds
                keepSelection
                aspect={aspect}
              >
                <img
                  alt="Source"
                  src={src}
                  ref={imgRef}
                  onLoad={onImageLoad}
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                    filter: filterString,
                    maxWidth: "100%",
                    maxHeight: "75vh",
                    display: "block",
                    cursor: "grab",
                  }}
                  onDragStart={(e) => {
                    e.preventDefault();
                  }}
                />
              </ReactCrop>
            </div>
          )}
        </div>

        <div className="w-80 flex-shrink-0 p-3 border rounded bg-white">
          <h4 className="font-semibold mb-2">Controls</h4>

          {/* <div className="mb-2">
            <label className="block text-sm">Zoom: {zoom.toFixed(2)}x</label>
            <input
              type="range"
              min={0.2}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </div> */}

          <div className="mb-2">
            <Label className="mb-1 text-sm">Aspect Ratio</Label>
            <div className="flex flex-wrap gap-2">
              {aspectOptions.map((opt) => (
                <Button
                  key={String(opt.value)}
                  variant="outline"
                  className={`${aspect === opt.value ? "bg-gray-200" : ""}`}
                  onClick={() => setAspect(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            <Button onClick={() => setFlipH((v) => !v)}>Flip H</Button>
            <Button onClick={() => setFlipV((v) => !v)}>Flip V</Button>
            {/* <button className="btn px-3 py-1 border rounded" onClick={rotate90}>
              Rotate 90°
            </button>
            <button
              className="btn px-3 py-1 border rounded"
              onClick={rotate180}
            >
              Rotate 180°
            </button> */}
          </div>

          <div className="mb-2">
            <Label className="mb-1 text-sm">Brightness: {brightness}%</Label>
            <Slider
              value={[brightness]}
              max={150}
              min={50}
              step={1}
              onValueChange={(e) => setBrightness(Number(e[0]))}
            />
          </div>
          <div className="mb-2">
            <Label className="mb-1 text-sm">Contrast: {contrast}%</Label>
            <Slider
              value={[contrast]}
              max={150}
              min={50}
              step={1}
              onValueChange={(e) => setContrast(Number(e[0]))}
            />
          </div>
          <div className="mb-4">
            <Label className="mb-1 text-sm">Saturation: {saturate}%</Label>
            <Slider
              value={[saturate]}
              max={200}
              min={0}
              step={1}
              onValueChange={(e) => setSaturate(Number(e[0]))}
            />
          </div>

          <div className="flex gap-2 mb-2">
            <Button variant={"outline"} onClick={reset}>
              Reset
            </Button>
            <Button variant={"link"} onClick={fitToImage}>
              Fit to image
            </Button>
          </div>

          <div className="mb-2 flex gap-2">
            <Button
              variant={"secondary"}
              onClick={() => generateCroppedImage()}
            >
              Preview
            </Button>
            {/* <ImagePreview
              previewCanvasRef={previewCanvasRef}
              generateCroppedImage={generateCroppedImage}
            /> */}
            <Button onClick={onSaveFile}>Save</Button>
            {/* <button
              className="px-3 py-1 border rounded"
              onClick={() => generateCroppedImage()}
            >
              Export base64
            </button> */}
          </div>

          <div className="mt-2">
            <h5 className="text-sm font-medium">Preview</h5>
            <div className="h-[180px] flex items-center justify-center">
              <canvas
                ref={previewCanvasRef}
                className="max-h-full max-w-full mt-2 border rounded bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
