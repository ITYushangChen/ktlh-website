import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { uploadBinaryToGitHub, sanitizeUploadedImageName } from '../../utils/githubApi';

/**
 * 图片路径：文本输入 + 浏览上传（直传 GitHub public/images/...）
 * subdir: 相对 public/images，如 "products" 或 "products/receivers"
 */
export default function AdminImageField({
  label,
  value,
  onChange,
  placeholder = '/images/products/xxx.jpg',
  subdir = 'products',
}) {
  const { t } = useTranslation();
  const { auth } = useAdminAuth();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handlePick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError(t('admin.imagePickImage', { defaultValue: '请选择图片文件' }));
      return;
    }
    if (!auth?.githubToken || !auth?.owner || !auth?.repo) {
      setUploadError(t('admin.imageNeedLogin', { defaultValue: '请先登录后台' }));
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const name = sanitizeUploadedImageName(file.name);
      const repoPath = `public/images/${subdir.replace(/^\//, '').replace(/\/$/, '')}/${name}`;
      const { publicPath } = await uploadBinaryToGitHub({
        token: auth.githubToken,
        owner: auth.owner,
        repo: auth.repo,
        branch: auth.branch || 'main',
        repoPath,
        file,
        message: `Upload image ${name}`,
      });
      onChange(publicPath);
    } catch (err) {
      setUploadError(err.message || String(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-2 text-sm"
          placeholder={placeholder}
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePick}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          title={t('admin.imageUploadHint', { defaultValue: '从本机选择图片并上传到仓库' })}
          className="shrink-0 px-4 py-2 text-sm font-medium rounded-lg bg-[#086c7b] text-white hover:bg-[#065a67] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading
            ? t('admin.imageUploading', { defaultValue: '上传中…' })
            : t('admin.imageUploadButton', { defaultValue: '上传图片' })}
        </button>
      </div>
      {uploadError && <p className="text-sm text-red-600 mt-1">{uploadError}</p>}
    </div>
  );
}
