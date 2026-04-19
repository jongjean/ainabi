/** @type {import('next').Next.Config} */
const nextConfig = {
  basePath: '/ainabi',
  assetPrefix: '/ainabi', // CDN 또는 프록시 환경에서 리소스 로드 보장
  trailingSlash: true,    // Nginx 라우팅과의 일관성을 위해 설정
};

module.exports = nextConfig;
