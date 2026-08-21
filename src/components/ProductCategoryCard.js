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
      className={`${PRODUCT_CARD_FRAME} group mx-auto md:mx-0 block h-full no-underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2 [zoom:0.8] md:[zoom:1]`}
    >
      <div className="relative overflow-hidden bg-white">
        <OptimizedImage
          src={category.image}
          alt={gl(category.title)}
          loading="lazy"
          className="block w-full"
          imgClassName="w-full h-52 object-contain p-4"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#086c7b] transition-colors duration-300">
          {gl(category.title)}
        </h3>
        <p className="md:hidden text-sm text-gray-600 leading-relaxed mb-4">
          {gl(category.description) || t('products.developingDesc')}
        </p>
        <div className="h-0.5 w-full mb-4 shrink-0 bg-[#086c7b]" aria-hidden />
        <div className="hidden md:block flex-1 min-h-0" aria-hidden />
        <span className="md:mt-auto flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#086c7b]/40 bg-white px-5 py-2 text-sm font-medium text-[#086c7b] transition-colors duration-300 group-hover:border-[#086c7b] group-hover:bg-[#086c7b] group-hover:text-white">
            {t('products.clickToView')}
            <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden>
              &gt;
            </span>
          </span>
        </span>
      </div>
    </Link>
  );
}
