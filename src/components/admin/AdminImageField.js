import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { uploadBinaryToGitHub, sanitizeUploadedImageName } from '../../utils/githubApi';

/**
 * 图片路径：文本输入 + 浏览上传（直传 GitHub public/images/app/...）
 * subdir: 相对 public/images/app，如 "products" 或 "products/receivers"
 */
export default function AdminImageField({
  label,
  value,
  onChange,
  placeholder = '/images/app/products/xxx.jpg',
  subdir = 'products',
  repoBaseDir = 'public/images/app',
  publicBaseDir = '/images/app',
  accept = 'image/*',
  fileTypeLabel,
  uploadButtonLabel,
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

    const loweredName = (file.name || '').toLowerCase();
    const normalizedAccept = accept.toLowerCase();
    const fileType = (file.type || '').toLowerCase();
    const acceptByExt = normalizedAccept
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.startsWith('.'))
      .some((ext) => loweredName.endsWith(ext));
    const acceptByMime = normalizedAccept
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith('.'))
      .some((mime) => {
        if (mime.endsWith('/*')) {
          const prefix = mime.slice(0, -1);
          return fileType.startsWith(prefix);
        }
        return fileType === mime;
      });

    if (!(acceptByExt || acceptByMime || normalizedAccept === '*/*')) {
      const fallbackTypeLabel = fileTypeLabel || t('admin.imageUploadButton', { defaultValue: '图片' });
      setUploadError(`请选择${fallbackTypeLabel}文件`);
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
      const cleanSubdir = subdir.replace(/^\//, '').replace(/\/$/, '');
      const cleanRepoBaseDir = repoBaseDir.replace(/\/$/, '');
      const repoPath = `${cleanRepoBaseDir}/${cleanSubdir}/${name}`;
      const { publicPath } = await uploadBinaryToGitHub({
        token: auth.githubToken,
        owner: auth.owner,
        repo: auth.repo,
        branch: auth.branch || 'main',
        repoPath,
        file,
        message: `Upload file ${name}`,
      });
      const cleanPublicBaseDir = publicBaseDir.replace(/\/$/, '');
      const normalizedPublicPath = `/${publicPath.replace(/^\//, '')}`;
      const expectedPrefix = `/${cleanRepoBaseDir.replace(/^public\//, '')}/`;
      const nextPublicPath = normalizedPublicPath.startsWith(expectedPrefix)
        ? normalizedPublicPath.replace(expectedPrefix, `${cleanPublicBaseDir}/`)
        : normalizedPublicPath;
      onChange(nextPublicPath);
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
          accept={accept}
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
            : uploadButtonLabel || t('admin.imageUploadButton', { defaultValue: '上传图片' })}
        </button>
      </div>
      {uploadError && <p className="text-sm text-red-600 mt-1">{uploadError}</p>}
    </div>
  );
}
