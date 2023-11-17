'use client'
import { ThumbnailPlugin } from '@/lib/thumb-slider'
import { useKeenSlider } from 'keen-slider/react'
import Image from 'next/image'
import { ComponentProps } from 'react'
import { Dialog, DialogContent } from './ui/dialog'

interface AttachThumbListProps extends ComponentProps<typeof Dialog> {
  images: Array<string>
}

export function AttachThumbList({ images, ...props }: AttachThumbListProps) {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
  })
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef)],
  )

  return (
    <Dialog {...props}>
      <DialogContent>
        <div ref={sliderRef} className="keen-slider">
          {images.map((image) => {
            return (
              <div key={image} className="keen-slider__slide">
                <Image
                  height={700}
                  width={700}
                  alt={image}
                  src={image}
                  objectFit="cover"
                  className="rounded border object-cover"
                />
              </div>
            )
          })}
        </div>

        <div ref={thumbnailRef} className="keen-slider thumbnail">
          {images.map((image) => {
            return (
              <div key={image} className="keen-slider__slide">
                <Image
                  height={100}
                  width={100}
                  alt={image}
                  src={image}
                  objectFit="cover"
                  className="aspect-square rounded border object-cover"
                />
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
