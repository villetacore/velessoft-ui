# Velessoft UI

![Velessoft UI](docs/images/banner.svg)

**Компактная библиотека React-компонентов и открытая дизайн-система от [villetacore](https://github.com/villetacore).**

[Документация](docs/README.md) · [Примеры](docs/recipes.md) · [Скриншоты](docs/gallery.md) · [English](README.md)

## Что внутри

Восемь компонентов на React + TypeScript, светлая и тёмная темы, дизайн-токены, интерактивный каталог и пример приложения. Статус — **0.1.0 experimental**: API может меняться.

## Установить библиотеку

Пакеты опубликованы как устанавливаемые архивы в GitHub. Публикация в реестр npm пока не выполнена.

```sh
npm install react react-dom
npm install https://raw.githubusercontent.com/villetacore/velessoft-ui/main/releases/v0.1.0/velessoft-tokens-0.1.0.tgz https://raw.githubusercontent.com/villetacore/velessoft-ui/main/releases/v0.1.0/velessoft-ui-0.1.0.tgz
```

## Запустить примеры

Node 22.12+ в ветке 22 LTS или Node 24/26.

```sh
npm ci
npm run dev
```

В терминале появится адрес приложения; ссылка «Дизайн-каталог» открывает руководство. `npm run check` запускает проверки, `npm run pack` собирает архивы в `artifacts/`.

![Рабочая область](docs/images/dashboard-dark.jpg)

## Границы готовности

Это библиотека базовых элементов и локальные примеры. Серверной части нет. Диалог использует нативный HTML dialog; доступность и поведение в конкретном продукте нужно проверять отдельно. Данные React-примера исчезают при перезагрузке; отдельный прототип каталога использует localStorage.

MIT © 2026 villetacore. [Лицензии сторонних материалов](THIRD_PARTY_NOTICES.md).
