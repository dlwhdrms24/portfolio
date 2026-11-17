# Ubuntu 배포 가이드

대상은 Ubuntu 24.04.4 LTS, 2 vCPU, RAM 4 GB, 디스크 40 GB, 기존 Docker·DNS·HTTPS 환경입니다. 서버 접근 권한은 제공되지 않았으므로 아래 내용은 적용 전 확인이 필요한 배포 절차입니다. 현재 개발 PC에는 Docker가 없어 이미지 빌드·컨테이너 실행·Nginx 런타임은 미검증입니다.

## 1. 기존 환경 확인

서버에서 먼저 읽기 전용으로 확인합니다. 출력에 민감한 정보가 포함될 수 있으므로 공개하지 마세요.

```sh
docker version
docker compose version
docker ps --format 'table {{.Names}}\t{{.Ports}}\t{{.Status}}'
docker network ls
ss -lntp
df -h
free -h
```

호스트 Nginx인지 Docker 프록시인지, `3geun.com`의 기존 server block, 인증서와 키 경로, 프록시 네트워크를 확인합니다. 호스트 Nginx이면 `sudo nginx -T`로 확인할 수 있습니다. 인증서를 재발급하거나 DNS를 바꾸지 않습니다. 다른 컨테이너의 중지·삭제, Docker 전역 prune, 기존 프록시 설정 전체 덮어쓰기를 수행하지 않습니다.

## 2. 개발 PC 또는 CI에서 이미지 빌드

운영 서버 빌드의 일시적 CPU·메모리 사용을 줄이려면 동일 소스로 개발 PC나 CI에서 이미지를 만듭니다. 서버 CPU 아키텍처에 맞춰 `linux/amd64` 또는 `linux/arm64`를 선택하세요.

Windows PowerShell에서 포트폴리오 폴더를 열고 아래 명령을 한 줄씩 실행합니다. `npm.cmd`를 호출하면 PowerShell 실행 정책을 바꾸지 않고 npm을 사용할 수 있습니다. Linux나 macOS의 셸에서는 `npm.cmd` 대신 `npm`을 사용합니다.

```powershell
npm.cmd ci
npm.cmd run check
docker buildx build --platform linux/amd64 --load -t developer-portfolio:release-001 .
docker save -o portfolio-release-001.tar developer-portfolio:release-001
```

실제 SSH 대상과 서버의 전용 배포 디렉터리를 지정해 tar와 `docker-compose.yml`, `docker-compose.proxy.yml`, `.env.example`을 전송하세요. `scp`에 사용할 주소·경로는 제공된 서버 환경에 맞게 정합니다. 비밀키·인증서·`.env`는 이미지에 포함하지 않습니다. 레지스트리가 준비되어 있으면 고유 태그로 push/pull하는 방식도 가능합니다. 운영에 승인한 베이스 이미지는 digest로 고정해 관리할 수 있습니다.

서버에서:

```sh
docker load -i portfolio-release-001.tar
cp .env.example .env
```

`.env`의 `PORTFOLIO_IMAGE=developer-portfolio:release-001`을 지정합니다. `PORTFOLIO_PORT=18080`이 비어 있는지도 확인합니다. 비어 있지 않다면 다른 포트를 선택하고 프록시 upstream도 같은 값으로 설정합니다. 기본 Compose 프로젝트명은 `developer-portfolio`이며 서버의 기존 프로젝트 이름과 겹치면 별도 프로젝트명을 정해 모든 명령에 동일하게 `-p`를 적용하세요.

소스를 서버에 복사하여 직접 빌드할 경우에만 `docker compose build portfolio`를 실행합니다. 이미지 가져오기 방식을 쓴 경우 `--no-build`로 실행합니다.

## 3A. 호스트 HTTPS 리버스 프록시

기본 구성은 `127.0.0.1:18080:8080`만 공개합니다.

```sh
docker compose config
docker compose up -d --no-deps --no-build portfolio
docker compose ps
curl -f http://127.0.0.1:18080/healthz
```

기존 `3geun.com` HTTPS server block의 해당 경로를 아래 upstream으로 연결합니다. 다음은 location 예시이며 인증서·listen·다른 서비스 설정은 기존 값을 유지합니다. 먼저 기존 설정을 백업하고 기존 경로와 충돌하는지 확인하세요.

```nginx
location / {
    proxy_pass http://127.0.0.1:18080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

검토한 수정만 반영한 뒤 `sudo nginx -t`가 성공하면 `sudo systemctl reload nginx`로 적용합니다. 기존 HTTP→HTTPS 리다이렉트와 인증서를 재사용합니다. 컨테이너 Nginx는 TLS를 종료하지 않습니다. 프록시가 HTTPS를 종료하며 HSTS는 기존 운영 정책에 맞춰 프록시에서 관리합니다.

## 3B. Docker HTTPS 리버스 프록시

Compose v2.24.4 이상의 `!reset` 지원이 필요합니다. `.env`에 `PROXY_NETWORK=확인한_기존_프록시_네트워크명`을 추가합니다. 프록시 네트워크는 이미 존재해야 하며 임의로 생성·교체하지 않습니다.

```sh
docker compose -f docker-compose.yml -f docker-compose.proxy.yml config
docker compose -f docker-compose.yml -f docker-compose.proxy.yml up -d --no-deps --no-build portfolio
```

이 override는 호스트 포트 공개를 제거합니다. 같은 외부 네트워크에 있는 프록시에서 `http://portfolio:8080`으로 전달하세요. 기존 네트워크에 `portfolio`라는 DNS 별칭을 쓰는 서비스가 없는지 확인합니다. 충돌이 있으면 고유 서비스 별칭을 지정한 뒤 프록시 upstream도 변경하세요. 이후 ps/logs/업데이트/롤백 명령에서도 같은 `-f` 조합을 사용합니다. 프록시 종류별 인증서·라우터 설정은 실제 운영 구성 확인 후 기존 방식으로 연결합니다.

## 4. 컨테이너·Nginx 검증

호스트 프록시 구성 기준 명령입니다.

```sh
docker compose ps
docker compose logs --tail=100 portfolio
docker compose exec portfolio nginx -t
curl -fsS http://127.0.0.1:18080/healthz
curl -I http://127.0.0.1:18080/
curl -I http://127.0.0.1:18080/resume
curl -I http://127.0.0.1:18080/projects
curl -I http://127.0.0.1:18080/projects/does-not-exist
curl -I http://127.0.0.1:18080/assets/does-not-exist.js
docker compose restart portfolio
docker compose ps
curl -fsS http://127.0.0.1:18080/healthz
```

홈·이력서·프로젝트 목록은 200, 존재하지 않는 프로젝트와 정적 파일은 404를 기대합니다. 일반 알 수 없는 경로는 SPA fallback으로 200과 404 UI를 반환할 수 있습니다. 존재하는 프로젝트 상세는 빌드 시 생성된 파일을 사용하므로 직접 접근·새로고침이 됩니다. 프로젝트를 등록한 뒤 그 실제 slug로도 검증하세요. 정적 파일 누락이 HTML 200으로 숨겨지지 않도록 구성했습니다.

HTML 응답에는 `Cache-Control: no-cache`, 해시가 있는 `/assets/` 번들에는 1년 immutable 캐시를 기대합니다. 보안 헤더·gzip을 실제 응답에서 확인하세요. 로그는 stdout/stderr로 출력하며 Compose 로그 회전은 10 MB × 3개입니다. 비루트 UID 101, 읽기 전용 루트 파일시스템, `/tmp` tmpfs를 사용하며 최대 메모리를 128 MB로 제한합니다. 컨테이너 healthcheck가 healthy인지 확인하세요.

## 5. 실제 도메인 검증

프록시 연결 후 실행합니다. `-k` 등 인증서 검증을 끄는 옵션은 사용하지 않습니다.

```sh
curl -I http://3geun.com
curl -I https://3geun.com
curl -I https://3geun.com/resume
curl -I https://3geun.com/projects
openssl s_client -connect 3geun.com:443 -servername 3geun.com -verify_hostname 3geun.com -verify_return_error </dev/null
```

## 월페이퍼 스튜디오 배포

홈과 프로젝트 목록에서 Bing Wallpaper Downloader 카드를 누르면 `/bing-wallpaper/`로 바로 이동합니다. 데모 컨테이너와 프록시를 먼저 연결한 뒤 포트폴리오 이미지를 배포하세요.

### 호스트에서 Nginx를 실행하는 경우

서버에 `bing-wallpaper/` 폴더를 배포하고, 그 폴더에서 아래 명령을 실행합니다. 호스트 포트 `14179`가 이미 사용 중이면 `WALLPAPER_PORT`를 다른 포트로 지정하고 Nginx upstream에도 같은 값을 사용하세요.

```sh
docker compose config
docker compose up -d --build
docker compose ps
curl -fsS -o /dev/null http://127.0.0.1:14179/bing-wallpaper/
curl -fsS http://127.0.0.1:14179/bing-wallpaper/api/wallpaper
```

기존 `3geun.com` HTTPS server block에 아래 두 `location`을 추가합니다. `proxy_pass`의 포트 뒤에 `/`를 붙이지 않아 `/bing-wallpaper/` 경로를 컨테이너까지 전달합니다.

```nginx
location = /bing-wallpaper {
    return 308 /bing-wallpaper/$is_args$args;
}

location ^~ /bing-wallpaper/ {
    proxy_pass http://127.0.0.1:14179;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

`sudo nginx -t`가 성공하면 `sudo systemctl reload nginx`로 반영합니다.

### Docker에서 Nginx를 실행하는 경우

`bing-wallpaper/` 폴더에 기존 프록시 네트워크의 이름을 `PROXY_NETWORK`로 지정하고 Compose v2.24.4 이상에서 아래 명령을 실행합니다. 같은 네트워크에 연결된 HTTPS 프록시에 위 두 `location`을 추가하되, `proxy_pass`를 `http://bing-wallpaper:4179`로 지정합니다. 프록시 컨테이너에서 `nginx -t`를 실행한 뒤 설정을 다시 읽힙니다.

```sh
docker compose -f docker-compose.yml -f docker-compose.proxy.yml config
docker compose -f docker-compose.yml -f docker-compose.proxy.yml up -d --build
```

배포 후 포트폴리오의 홈이나 프로젝트 목록에서 Bing Wallpaper Downloader 카드를 눌러 **오늘의 사진 → JPG 다운로드**까지 확인합니다. 오늘의 사진 조회와 JPG 저장을 하려면 데모 컨테이너에서 `www.bing.com`으로 HTTPS 연결이 가능해야 합니다.

HTTP는 HTTPS로 리다이렉트되어야 하고 인증서는 호스트명과 일치해야 합니다. 브라우저에서 직접 하위 주소를 열어 새로고침, 키보드 이동, 모바일 메뉴, 라이트·다크 전환, 테마 유지, 이미지와 PDF를 확인합니다. 최소 320px 모바일·태블릿·데스크톱, Reduced Motion에서도 검토하세요. DNS·인증서·프록시 변경이 필요한 경우 실제 구성과 원인을 확인한 뒤 별도 검토합니다.

## MediLens 체험 데모 배포

`/medilens-demo/`는 기존 팀 서비스·운영 DB와 분리된 별도 Compose 프로젝트(`medilens-demo`)로 실행합니다. 방문자 업로드는 받지 않고, 개인정보를 가린 예시 약봉투 사진을 개발 PC에서 미리 분석한 결과를 빌드에 포함합니다. 그래서 기본 운영은 키 없이 프런트엔드(`web`, `127.0.0.1:18090`)만 실행하며, 서버에 OpenAI 키를 두지 않습니다. 실시간 의약품 검색은 공공데이터 키를 발급하고 테스트를 통과한 뒤 `api` 프로필(`127.0.0.1:18091`)로 켭니다. 빌드·실행 명령, 키 설정, 호스트 Nginx location 예시(`nginx-host-locations.conf`)와 배포 후 확인 항목은 별도 저장소 **medilens-demo**의 README를 따르세요. 배포를 검증한 뒤에만 포트폴리오의 MediLens 상세에 체험 링크(`personalDemo`)를 추가합니다.

## 6. 업데이트와 롤백

매 배포 전 현재 `.env`의 이미지 태그를 기록합니다. 테스트한 새 이미지를 load 또는 pull하고 `.env`의 `PORTFOLIO_IMAGE`를 새 고유 태그로 변경합니다.

```sh
docker compose up -d --no-deps --no-build portfolio
docker compose ps
docker compose logs --tail=100 portfolio
curl -f http://127.0.0.1:18080/healthz
```

실패하면 `.env`의 이미지 태그를 보관한 이전 태그로 되돌리고 같은 `up -d --no-deps --no-build portfolio`를 실행합니다. 이전 이미지가 남아 있어야 합니다. 컨테이너 내부에 영구 데이터나 DB가 없어 데이터 마이그레이션은 필요하지 않습니다. 서비스 컨테이너 교체 중 짧은 접속 중단이 있을 수 있습니다. 롤백 이미지 확인 전 이미지 정리 작업은 하지 않습니다.

## 7. 장애 점검

| 증상                       | 확인                                                             |
| -------------------------- | ---------------------------------------------------------------- |
| 포트 바인딩 실패           | `ss -lntp`, `.env`, 다른 서비스의 사용 여부                      |
| 프록시 502                 | healthcheck, 호스트 포트 또는 Docker 네트워크·upstream·DNS       |
| 컨테이너 반복 재시작       | `logs`, `nginx -t`, 메모리 제한, 디스크 공간                     |
| 하위 경로 실패             | 빌드된 HTML 존재, 배포 이미지 태그, 프록시가 경로를 바꾸는지     |
| 콘텐츠가 예전 내용         | 소스 수정 후 재빌드·새 이미지 배포 여부, HTML 캐시·SNS 공유 캐시 |
| 외부 이미지 차단           | 자체 호스팅 경로 사용 여부, CSP, 브라우저 콘솔                   |
| Docker proxy override 오류 | Compose 버전, `!reset` 지원, `PROXY_NETWORK`, 네트워크 존재      |
| HTTPS 오류                 | 기존 프록시 인증서 유효기간·호스트명·체인, 서버 시각             |

문제 해결 시 이 서비스에 한정해 조치합니다. 기존 서비스의 컨테이너, 인증서, 리버스 프록시 전체를 임의로 중지·삭제·덮어쓰지 않습니다.
