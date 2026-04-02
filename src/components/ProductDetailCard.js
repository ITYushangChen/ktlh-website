import { Link } from 'react-router-dom';
import { PRODUCT_CARD_FRAME } from '../constants/productUi';

/** 与产品中心列表卡片一致：图、名称、主色分割线、「点击查看」→ 子产品详情 */
const ProductDetailCard = ({ product, gl, t, listPath }) => (
  <div className={`${PRODUCT_CARD_FRAME} bg-white`}>
    <div className="relative overflow-hidden bg-white">
      <img
        src={product.image}
        alt={gl(product.name)}
        className="w-full h-52 object-contain p-4"
      />
    </div>
    <div className="p-6 flex flex-col flex-1">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{gl(product.name)}</h3>
      <div className="h-0.5 w-full mb-4 shrink-0 bg-[#086c7b]" aria-hidden />
      <div className="flex-1 min-h-0" aria-hidden />
      <Link
        to={`${listPath}/${product.id}`}
        className="inline-flex items-center text-sm font-medium mt-auto text-[#086c7b] hover:text-[#065a66] transition-colors"
      >
        {t('products.clickToView')}
        <span className="ml-0.5" aria-hidden>
          &gt;
        </span>
      </Link>
    </div>
  </div>
);

export default ProductDetailCard;
