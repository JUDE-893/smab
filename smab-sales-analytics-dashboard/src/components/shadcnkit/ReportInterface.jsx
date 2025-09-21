import Image from 'next/image'

export default function ReportInterface({image ,message, orn='vartical', className}) {
  return (
    <div className={`flex ${orn === 'vartical' ? 'flex-col' : ''} justify-center items-center relative w-full h-full ${className}`}>
        <Image
          src={image} // Use local or external images
          alt="@Image"
          width={280}
          height={30}
          sizes="(max-width: 768px) 100vw, 1500px"
        />
        <span className='mt-6 text-sm text-muted-foreground'>{message}</span>
    </div>
  )
}
