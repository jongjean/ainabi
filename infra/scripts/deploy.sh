#!/bin/bash

# AINABI 상용 배포 스크립트 (Clean Clone Strategy)
# 개발 경로: /home/ucon/ainabi
# 배포 경로: /var/www/ainabi

DEV_DIR="/home/ucon/ainabi"
DEPLOY_DIR="/var/www/ainabi"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="${DEPLOY_DIR}/release_${TIMESTAMP}"

echo "🚀 [AINABI] Starting Deployment to ${DEPLOY_DIR}..."

# 1. 배포 디렉토리 생성 및 백업
mkdir -p ${DEPLOY_DIR}
mkdir -p ${BACKUP_DIR}

# 2. 빌드 결과물 및 필수 설정파일 동기화 (소스 코드 제외)
# .git, node_modules 등을 제외하고 순수 빌드 본체와 런타임 설정만 복제
rsync -av --exclude-from="${DEV_DIR}/.gitignore" \
      --exclude ".git" \
      --exclude "node_modules" \
      ${DEV_DIR}/ ${BACKUP_DIR}/

# 3. 'current' 심볼릭 링크 업데이트 (롤백 가능 구조)
ln -sfn ${BACKUP_DIR} ${DEPLOY_DIR}/current

echo "✅ [AINABI] Deployment Complete at ${BACKUP_DIR}"
echo "👉 Standard port 3100(Web) / 8100(API) is ready."
