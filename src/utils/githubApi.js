const GITHUB_API = 'https://api.github.com';

function encodePathForGitHub(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

export async function fetchFileFromGitHub({ token, owner, repo, path, branch = 'main' }) {
  const enc = encodePathForGitHub(path);
  const ref = encodeURIComponent(branch);
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${enc}?ref=${ref}`,
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
  const enc = encodePathForGitHub(path);
  const body = { message, content: encoded, sha, branch };

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${enc}`,
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
 * 获取仓库中某路径当前 blob SHA（文件不存在则返回 null）。
 * GitHub 在「覆盖已存在文件」时必须在 PUT 中带上 sha；仅新建时可省略。
 */
async function getExistingFileSha({ token, owner, repo, enc, branch }) {
  const ref = encodeURIComponent(branch);
  const getRes = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${enc}?ref=${ref}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!getRes.ok) {
    if (getRes.status === 404) return null;
    const err = await getRes.json().catch(() => ({}));
    throw new Error(err.message || `无法读取路径信息（${getRes.status}）`);
  }

  const meta = await getRes.json();
  if (Array.isArray(meta)) {
    throw new Error('上传路径指向目录，请使用包含文件名的路径');
  }
  if (meta.type !== 'file' || !meta.sha) {
    throw new Error('无法获取文件 SHA，请检查仓库路径与权限');
  }
  return meta.sha;
}

function isShaMissingError(status, errBody) {
  const msg = (errBody && (errBody.message || errBody.error)) || '';
  return (
    status === 422 ||
    /sha.*not.*supplied/i.test(msg) ||
    /Invalid request.*sha/i.test(msg)
  );
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

  const sha = await getExistingFileSha({ token, owner, repo, enc, branch });

  const putOnce = async (shaForPut) => {
    const body = {
      message: message || `Upload ${repoPath}`,
      content: base64,
      branch,
    };
    if (shaForPut) body.sha = shaForPut;

    return fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${enc}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };

  let res = await putOnce(sha);

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    let retried = false;
    if (isShaMissingError(res.status, errBody)) {
      const freshSha = await getExistingFileSha({ token, owner, repo, enc, branch });
      if (freshSha) {
        res = await putOnce(freshSha);
        retried = true;
      }
    }
    if (!res.ok) {
      const msg = retried
        ? (await res.json().catch(() => ({}))).message || errBody.message
        : errBody.message;
      throw new Error(msg || `上传失败 (${res.status})`);
    }
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
