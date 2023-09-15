'use client'
import { ThumbnailPlugin } from '@/lib/thumb-slider'
import { useKeenSlider } from 'keen-slider/react'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import { ComponentProps, useState } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

interface ImagePickerProps extends ComponentProps<'input'> {
  maxImages?: number
  withPreview?: boolean
  containerClassName?: string
  name: string
}

export function ImagePicker({
  name,
  maxImages = 3,
  withPreview = true,
  containerClassName,
  ...props
}: ImagePickerProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
    defaultValue: [],
  })

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

  const allImages: Array<File> = field.value
  const images: Array<File> = allImages.slice(0, maxImages)

  return (
    <div
      className={twMerge(
        'grid w-full grid-cols-auto-sm gap-2',
        containerClassName,
      )}
    >
      {images.map((image) => {
        const url = URL.createObjectURL(image)
        return (
          <Dialog key={image.name}>
            <DialogTrigger disabled={!withPreview}>
              <Image
                height={100}
                width={100}
                alt={image.name}
                src={url}
                objectFit="cover"
                className="aspect-square rounded border object-cover"
              />
            </DialogTrigger>
            <DialogContent className="p-0">
              <Image
                height={700}
                width={700}
                alt={image.name}
                src={url}
                objectFit="cover"
                className="rounded border object-cover"
              />
            </DialogContent>
          </Dialog>
        )
      })}

      {maxImages < allImages.length && (
        <Button
          type="button"
          className="h-auto text-xl"
          variant="outline"
          onClick={() => setModalIsOpen(true)}
        >
          {allImages.length - maxImages}
          <Plus className="h-6 w-5" />
        </Button>
      )}

      <label className="flex h-[100px] w-[100px] items-center justify-center rounded border-2 border-dashed border-violet-500 bg-violet-100">
        <Plus className="h-6 w-6 text-violet-500" />
        <input
          type="file"
          className="hidden"
          onChange={(e) => field.onChange(Array.from(e.target.files || []))}
          {...props}
        />
      </label>

      <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
        <DialogContent>
          <div ref={sliderRef} className="keen-slider">
            {allImages.map((image) => {
              const url = URL.createObjectURL(image)

              return (
                <div key={image.name} className="keen-slider__slide">
                  <Image
                    height={700}
                    width={700}
                    alt={image.name}
                    src={url}
                    objectFit="cover"
                    className="rounded border object-cover"
                  />
                </div>
              )
            })}
          </div>

          <div ref={thumbnailRef} className="keen-slider thumbnail">
            {allImages.map((image) => {
              const url = URL.createObjectURL(image)

              return (
                <div key={image.name} className="keen-slider__slide">
                  <Image
                    height={100}
                    width={100}
                    alt={image.name}
                    src={url}
                    objectFit="cover"
                    className="aspect-square rounded border object-cover"
                  />
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
