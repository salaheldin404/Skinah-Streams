
interface BackgroundOverlayProps {
  className?: string;
}
const BackgroundOverlay = ({ className }: BackgroundOverlayProps) => {
  return (
    <div className={`${className} absolute inset-0 rounded-lg  opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
  )
}

export default BackgroundOverlay
