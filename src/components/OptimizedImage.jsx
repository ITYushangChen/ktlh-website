import { getWebpSrc } from '../utils/imageSrc';

/**
 * 优先加载 WebP（若存在），支持 lazy / eager 与 fetchPriority。
 * className 作用于外层 picture，img 使用 imgClassName。
 */
const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  loading = 'lazy',
  fetchPriority,
  decoding = 'async',
  ...imgProps
}) => {
  if (!src) return null;

  const webpSrc = getWebpSrc(src);

  return (
    <picture className={className}>
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        {...(fetchPriority ? { fetchPriority } : {})}
        className={imgClassName || className}
        {...imgProps}
      />
    </picture>
  );
};

export default OptimizedImage;
