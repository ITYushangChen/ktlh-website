import { Link } from 'react-router-dom';
import { PRODUCT_CARD_FRAME } from '../constants/productUi';

/**
 * 与产品中心列表卡片一致的子产品卡片：主色分割线、▸ 列表、底部链接。
 * @param {object} props
 * @param {object} props.product — product-details.json 中的条目
 * @param {function} props.gl — useProductDetails 的 gl
 * @param {function} props.gla — useProductDetails 的 gla
 * @param {function} props.t — i18n t
 * @param {string} props.specLabelPrefix — 如 products.receivers.specLabels
 */
const ProductDetailCard = ({ product, gl, gla, t, specLabelPrefix }) => {
  const specs = product.specifications || {};
  const specEntries = Object.entries(specs);

  return (
    <div className={PRODUCT_CARD_FRAME}>
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={gl(product.name)}
          className="w-full h-48 object-cover object-center"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{gl(product.name)}</h3>
        <div className="h-0.5 w-full mb-4 shrink-0 bg-[#086c7b]" aria-hidden />
        <ul className="space-y-2.5 text-gray-600 text-sm leading-relaxed mb-4 flex-1">
          <li className="flex gap-2">
            <span className="text-[#086c7b] shrink-0 mt-0.5 select-none" aria-hidden>
              ▸
            </span>
            <span>{gl(product.description)}</span>
          </li>
          {gla(product.features).map((f, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="text-[#086c7b] shrink-0 mt-0.5 select-none" aria-hidden>
                ▸
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        {specEntries.length > 0 && (
          <div className="mb-4 text-sm border-t border-gray-100 pt-4 space-y-1.5">
            <p className="font-semibold text-gray-700 mb-2">{t('products.specifications')}</p>
            {specEntries.map(([key, val]) => (
              <div key={key} className="flex justify-between gap-4 text-gray-600">
                <span className="shrink-0">{t(`${specLabelPrefix}.${key}`, key)}</span>
                <span className="text-gray-900 font-medium text-right">{gl(val)}</span>
              </div>
            ))}
          </div>
        )}
        <Link
          to="/contact"
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
};

export default ProductDetailCard;
