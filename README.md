## Hướng dẫn thêm event


B1: Config EVENTS trong `libs/mission/src/enum.ts`

B2: Config INFO_EVENTS trong `libs/mission/src/constants.ts`

B3: Clone 1 function để lắng nghe event kafka ở đây `apps/missions/src/missions.controller.ts`  chú ý đoạn
này `message.value` hoặc `message.value.data` vì mỗi team có định dạng bắn kafka khác nhau.
Phần `eventName = 'HIGH_LOW_LOSE'`  ứng với phần key ở B1

B4: Thêm tên event kafka vào file này `libs/kafka/src/configuration.ts`

## Installation

1. Clone project, make `.env` file from `.env.example`.
   2Use below docker commands to build and run project:

```sh
# install node_modules from docker to local
docker-compose run -rm app npm ci
# build image
docker-compose build
# up container
docker-compose up -d
```
