<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Hướng dẫn thêm event
B1: Config EVENTS trong `libs/mission/src/enum.ts`

B2: Config INFO_EVENTS trong `libs/mission/src/constants.ts`

B3: Clone 1 function để lắng nghe event kafka ở đây `apps/missions/src/missions.controller.ts`  chú ý đoạn này `message.value` hoặc `message.value.data` vì mỗi team có định dạng bắn kafka khác nhau. Phần `eventName = 'HIGH_LOW_LOST'`  ứng với phần key ở B1

B4: Thêm tên event kafka vào file này `libs/kafka/src/configuration.ts`

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run migration:

```sh
docker exec customer_dev npm run migrate:run
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
