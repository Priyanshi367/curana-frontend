interface PageBannerProps {
  title: string;
  backgroundImage: string;
}

const PageBanner = ({ title, backgroundImage }: PageBannerProps) => {
  return (
    <div className="relative h-12 sm:h-24 md:h-32 mb-6 md:mb-8 rounded-2xl md:rounded-3xl overflow-hidden mt-2">
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 opacity-90" style={{ background: 'var(--header-gradient)' }} />
      </div>
      <div className="relative h-full flex items-center px-4 sm:px-8 md:px-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">{title}</h1>
      </div>
    </div>
  );
};

export default PageBanner;
