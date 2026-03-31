const GITHUB_API = 'https://api.github.com';

export async function fetchFileFromGitHub({ token, owner, repo, path, branch = 'main' }) {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `获取文件失败 (${res.status})`);
  }
  const data = await res.json();
  const content = JSON.parse(decodeURIComponent(escape(atob(data.content.replace(/\n/g, '')))));
  return { content, sha: data.sha };
}

export async function commitFileToGitHub({ token, owner, repo, path, branch = 'main', content, sha, message }) {
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));
  const body = { message, content: encoded, sha, branch };

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `保存失败 (${res.status})`);
  }
  return await res.json();
}

function encodePathForGitHub(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsDataURL(file);
  });
}

/**
 * 上传图片（或任意二进制）到仓库。返回对外访问路径，如 /images/products/foo.jpg
 */
export async function uploadBinaryToGitHub({
  token,
  owner,
  repo,
  branch = 'main',
  repoPath,
  file,
  message,
}) {
  const base64 = await fileToBase64(file);
  const enc = encodePathForGitHub(repoPath);

  let sha;
  const getRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${enc}?ref=${branch}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  if (getRes.ok) {
    const meta = await getRes.json();
    sha = meta.sha;
  }

  const body = {
    message: message || `Upload ${repoPath}`,
    content: base64,
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${enc}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `上传失败 (${res.status})`);
  }

  const publicPath = `/${repoPath.replace(/^public\//, '')}`;
  return { publicPath, repoPath };
}

export function sanitizeUploadedImageName(originalName) {
  const m = originalName.match(/(\.[a-zA-Z0-9]{1,8})$/);
  const ext = (m ? m[1] : '.jpg').toLowerCase();
  const safe = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  return safe;
}
