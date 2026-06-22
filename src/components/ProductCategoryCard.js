import { Link } from 'react-router-dom';
import { PRODUCT_CARD_FRAME } from '../constants/productUi';
import { getCategoryLink } from '../utils/productsCatalog';
import OptimizedImage from './OptimizedImage';

/** 产品中心品类卡片（整卡可点击跳转详情） */
export function ProductCategoryCard({ category, gl, t }) {
  const href = getCategoryLink(category);

  return (
    <Link
      to={href}
      className={`${PRODUCT_CARD_FRAME} bg-white group block no-underline cursor-pointer hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2`}
    >
      <div className="relative overflow-hidden bg-white">
        <OptimizedImage
          src={category.image}
          alt={gl(category.title)}
          loading="lazy"
          className="block w-full"
          imgClassName="w-full h-52 object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#086c7b] transition-colors">
          {gl(category.title)}
        </h3>
        <div className="h-0.5 w-full mb-4 shrink-0 bg-[#086c7b]" aria-hidden />
        <div className="flex-1 min-h-0" aria-hidden />
        <span
          className="inline-flex items-center text-sm font-medium mt-auto text-[#086c7b] group-hover:text-[#065a66] transition-colors"
        >
          {t('products.clickToView')}
          <span className="ml-0.5 transition-transform group-hover:translate-x-0.5" aria-hidden>
            &gt;
          </span>
        </span>
      </div>
    </Link>
  );
}
