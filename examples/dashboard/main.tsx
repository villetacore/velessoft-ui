import { ApplicationExamples } from "./application";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  SearchInput,
  PasswordInput,
  CopyButton,
  Stepper,
  DescriptionList,
  Accordion,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Dialog,
  Divider,
  Drawer,
  EmptyState,
  Grid,
  IconButton,
  Input,
  Kbd,
  Menu,
  Pagination,
  Progress,
  RadioGroup,
  SegmentedControl,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Stack,
  Stat,
  Switch,
  Table,
  Tabs,
  Tag,
  Textarea,
  ToastProvider,
  Tooltip,
  useToast,
} from "../../packages/ui/src/index";
import "../../packages/tokens/tokens.css";
import "../../packages/css/src/index.css";
import "./style.css";

type Project = { name: string; status: "draft" | "live"; stars: number };

const initial: Project[] = [
  { name: "Design system", status: "live", stars: 128 },
  { name: "Documentation", status: "draft", stars: 42 },
  { name: "Web components", status: "live", stars: 77 },
];

function Workspace({
  dark,
  setDark,
  glass,
  setGlass,
  reduced,
  setReduced,
}: {
  glass: boolean;
  setGlass: (v: boolean) => void;
  reduced: boolean;
  setReduced: (v: boolean) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false),
    [drawer, setDrawer] = useState(false),
    [name, setName] = useState(""),
    [projects, setProjects] = useState(initial),
    [query, setQuery] = useState(""),
    [error, setError] = useState(""),
    [view, setView] = useState("table"),
    [page, setPage] = useState(3),
    [tags, setTags] = useState(["react", "vue", "svelte", "angular", "html"]);
  const visible = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <header className="vs-glass">
        <b>velessoft / UI</b>
        <span>OPEN SOURCE / by villetacore</span>
        <Stack direction="row" gap={8} style={{ marginLeft: "auto" }}>
          <Tooltip content="Открыть фильтры">
            <IconButton label="Фильтры" onClick={() => setDrawer(true)}>
              ☰
            </IconButton>
          </Tooltip>
          <Button aria-pressed={glass} onClick={() => setGlass(!glass)}>
            Стекло
          </Button>
          <Button aria-pressed={!reduced} onClick={() => setReduced(!reduced)}>
            Анимации
          </Button>
          <Button onClick={() => setDark(!dark)}>
            {dark ? "Светлая" : "Тёмная"} тема
          </Button>
        </Stack>
      </header>
      <main>
        <Breadcrumbs
          items={[
            { label: "villetacore", href: "#" },
            { label: "velessoft-ui", href: "#" },
            { label: "Рабочая область" },
          ]}
        />
        <div className="intro">
          <div>
            <small>EXPERIMENTAL / 0.4.0</small>
            <h1>Рабочая область<span className="title-mark" aria-hidden="true"> /_</span></h1>
            <p>
              Настоящие React-компоненты. Данные примера хранятся только в
              памяти.
            </p>
          </div>
          <Stack direction="row" gap={12}>
            <a href="./examples/html/index.html">HTML + Web Components ↗</a>
            <a href="./public/index.html">Дизайн-каталог ↗</a>
          </Stack>
        </div>

        <Grid min={180} className="stats">
          <Stat
            label="Проекты"
            value={projects.length}
            delta="+1 за неделю"
            tone="success"
          />
          <Stat
            label="Звёзды"
            value={projects.reduce((s, p) => s + p.stars, 0)}
            delta="+12%"
            tone="success"
          />
          <Stat label="Открытые issues" value={7} delta="−3" tone="info" />
          <Stat label="Сборка" value="passing" delta="2 мин назад" />
        </Grid>

        <div className="toolbar">
          <Input
            label="Поиск проектов"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SegmentedControl
            label="Вид"
            value={view}
            onChange={setView}
            options={[
              { value: "table", label: "Таблица" },
              { value: "cards", label: "Карточки" },
            ]}
          />
          <Button
            variant="primary"
            onClick={() => {
              setError("");
              setName("");
              setOpen(true);
            }}
          >
            Создать проект +
          </Button>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            title="Ничего не найдено"
            description="Измените поисковый запрос или создайте проект."
            actions={
              <Button onClick={() => setQuery("")}>Сбросить поиск</Button>
            }
          />
        ) : view === "table" ? (
          <Table
            rowKey={(p) => p.name}
            rows={visible}
            columns={[
              { key: "name", header: "Название", sortValue: (p) => p.name },
              {
                key: "status",
                header: "Статус",
                render: (p) => (
                  <Badge dot tone={p.status === "live" ? "success" : "neutral"}>
                    {p.status === "live" ? "Опубликован" : "Черновик"}
                  </Badge>
                ),
              },
              {
                key: "stars",
                header: "Звёзды",
                align: "right",
                sortValue: (p) => p.stars,
              },
              {
                key: "actions",
                header: "",
                align: "right",
                render: (p) => (
                  <Menu
                    label="⋯"
                    triggerLabel={`Действия: ${p.name}`}
                    variant="ghost"
                    align="end"
                    items={[
                      { label: "Открыть", shortcut: "↵" },
                      {
                        label: "Дублировать",
                        onSelect: () =>
                          toast({ title: "Скопировано", tone: "info" }),
                      },
                      { type: "separator" },
                      {
                        label: "Удалить",
                        danger: true,
                        onSelect: () => {
                          setProjects((list) => list.filter((x) => x !== p));
                          toast({
                            title: "Проект удалён",
                            description: p.name,
                            tone: "warning",
                          });
                        },
                      },
                    ]}
                  />
                ),
              },
            ]}
          />
        ) : (
          <Grid min={240}>
            {visible.map((p) => (
              <Card
                key={p.name}
                title={p.name}
                description={`★ ${p.stars}`}
                interactive
                actions={
                  <Badge tone={p.status === "live" ? "success" : "neutral"}>
                    {p.status}
                  </Badge>
                }
              >
                <Progress
                  label="Готовность"
                  value={p.status === "live" ? 100 : 45}
                />
              </Card>
            ))}
          </Grid>
        )}
        <div style={{ marginTop: 16 }}>
          <Pagination page={page} pageCount={12} onPageChange={setPage} />
        </div>

        <h2>Образцы компонентов</h2>
        <Tabs
          label="Образцы"
          items={[
            {
              value: "forms",
              label: "Формы",
              content: (
                <div className="samples">
                  <div>
                    <Select label="Тип проекта" defaultValue="compact">
                      <option value="compact">Библиотека</option>
                      <option value="normal">Приложение</option>
                    </Select>
                    <Input
                      label="Репозиторий"
                      startAddon="github.com/"
                      placeholder="villetacore/app"
                    />
                    <Textarea
                      label="Описание"
                      placeholder="Коротко о задаче"
                      hint="До 280 символов"
                    />
                    <Checkbox label="Открытый исходный код" />
                  </div>
                  <div>
                    <RadioGroup
                      label="Лицензия"
                      defaultValue="mit"
                      options={[
                        { value: "mit", label: "MIT" },
                        { value: "apache", label: "Apache 2.0" },
                        { value: "gpl", label: "GPL 3.0", disabled: true },
                      ]}
                    />
                    <Switch label="Уведомления о релизах" defaultChecked />
                    <Slider
                      label="Плотность"
                      defaultValue={60}
                      formatValue={(v) => `${v}%`}
                    />
                  </div>
                </div>
              ),
            },
            {
              value: "feedback",
              label: "Обратная связь",
              content: (
                <div className="samples">
                  <div>
                    <Alert title="Экспериментальная версия">
                      API может меняться до 1.0.
                    </Alert>
                    <Alert tone="success" title="Опубликовано" />
                    <Alert
                      tone="warning"
                      title="Квота почти исчерпана"
                      actions={<Button size="sm">Подробнее</Button>}
                    />
                    <Alert tone="error" title="Сборка упала">
                      Проверьте журнал CI.
                    </Alert>
                  </div>
                  <Stack gap={14}>
                    <Stack direction="row" gap={8} wrap>
                      <Badge>neutral</Badge>
                      <Badge tone="info">info</Badge>
                      <Badge tone="success" dot>
                        success
                      </Badge>
                      <Badge tone="warning">warning</Badge>
                      <Badge tone="error">error</Badge>
                      <Badge variant="solid">solid</Badge>
                    </Stack>
                    <Stack direction="row" gap={6} wrap>
                      {tags.map((t) => (
                        <Tag
                          key={t}
                          onRemove={() => setTags(tags.filter((x) => x !== t))}
                        >
                          {t}
                        </Tag>
                      ))}
                    </Stack>
                    <Progress label="Загрузка" value={68} />
                    <Progress label="Индексация" tone="info" />
                    <Stack direction="row" gap={12} align="center">
                      <Spinner /> <Spinner size="lg" />
                      <Button loading>Сохранить</Button>
                      <Button
                        onClick={() =>
                          toast({
                            title: "Готово",
                            description: "Изменения сохранены",
                            tone: "success",
                          })
                        }
                      >
                        Показать toast
                      </Button>
                    </Stack>
                    <Skeleton lines={3} />
                  </Stack>
                </div>
              ),
            },
            {
              value: "display",
              label: "Отображение",
              content: (
                <Stack gap={16}>
                  <Stack direction="row" gap={16} align="center" wrap>
                    <Avatar name="Villeta Core" size="lg" />
                    <Avatar name="Ada Lovelace" round tone="success" />
                    <AvatarGroup max={3}>
                      <Avatar name="An Na" size="sm" />
                      <Avatar name="Bo Ro" size="sm" tone="info" />
                      <Avatar name="Ce Lo" size="sm" tone="warning" />
                      <Avatar name="Di Mo" size="sm" />
                      <Avatar name="Ev En" size="sm" />
                    </AvatarGroup>
                    <span>
                      Поиск: <Kbd>⌘</Kbd> <Kbd>K</Kbd>
                    </span>
                    <ButtonGroup aria-label="Выравнивание">
                      <Button size="sm">Слева</Button>
                      <Button size="sm">Центр</Button>
                      <Button size="sm">Справа</Button>
                    </ButtonGroup>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Удалить</Button>
                  </Stack>
                  <Divider label="FAQ" />
                  <Accordion
                    exclusive
                    items={[
                      {
                        title: "Какие фреймворки поддерживаются?",
                        content:
                          "React — нативно; Vue, Svelte, Angular, Solid и HTML — через CSS и Web Components.",
                        defaultOpen: true,
                      },
                      {
                        title: "Нужен ли Tailwind?",
                        content: "Нет. Но для Tailwind есть пресет с токенами.",
                      },
                      {
                        title: "Есть тёмная тема?",
                        content: 'Да: data-theme="dark" на любом предке.',
                      },
                    ]}
                  />
                </Stack>
              ),
            },
          ]}
        />
        <section style={{ marginTop: 32 }}>
          <h2>Рабочие сценарии</h2>
          <Stepper
            label="Создание проекта"
            current="details"
            items={[
              {
                id: "account",
                label: "Команда",
                description: "Выберите участников",
              },
              {
                id: "details",
                label: "Настройки",
                description: "Задайте параметры",
              },
              {
                id: "review",
                label: "Проверка",
                description: "Подтвердите создание",
              },
            ]}
          />
          <Grid min={260} style={{ marginTop: 16 }}>
            <div>
              <SearchInput
                label="Фильтр проектов"
                clearLabel="Очистить поиск"
                value={query}
                onValueChange={setQuery}
              />
              <PasswordInput
                label="Пароль (пример)"
                showLabel="Показать"
                hideLabel="Скрыть"
                autoComplete="new-password"
                hint="Демонстрационное поле; данные никуда не отправляются"
              />
            </div>
            <div>
              <DescriptionList
                items={[
                  { id: "owner", term: "Автор", description: "villetacore" },
                  { id: "version", term: "Версия", description: "0.4.0" },
                  { id: "license", term: "Лицензия", description: "MIT" },
                ]}
              />
              <CopyButton
                style={{ marginTop: 12 }}
                value="npm install @villetacore/velessoft-ui"
                label="Копировать команду"
                copiedLabel="Скопировано"
                errorLabel="Буфер недоступен — скопируйте команду вручную"
              />
            </div>
          </Grid>
        </section>
        <ApplicationExamples />
        <footer>© 2026 villetacore · MIT</footer>
      </main>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Создать проект"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Отмена</Button>
            <Button type="submit" form="create-project" variant="primary">
              Создать
            </Button>
          </>
        }
      >
        <form
          id="create-project"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) {
              setError("Введите название");
              return;
            }
            setProjects([
              ...projects,
              { name: name.trim(), status: "draft", stars: 0 },
            ]);
            toast({
              title: "Проект создан",
              description: name.trim(),
              tone: "success",
            });
            setOpen(false);
          }}
        >
          <Input
            autoFocus
            label="Название проекта"
            value={name}
            error={error}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
          />
        </form>
      </Dialog>

      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Фильтры">
        <RadioGroup
          label="Статус"
          defaultValue="all"
          options={[
            { value: "all", label: "Все" },
            { value: "live", label: "Опубликованные" },
            { value: "draft", label: "Черновики" },
          ]}
        />
        <Switch label="Только мои" />
        <Button variant="primary" block onClick={() => setDrawer(false)}>
          Применить
        </Button>
      </Drawer>
    </>
  );
}

function App() {
  const [dark, setDark] = useState(true);
  const [glass, setGlass] = useState(true);
  const [reduced, setReduced] = useState(false);
  return (
    <div
      data-theme={dark ? "dark" : "light"}
      data-material={glass ? "glass" : "solid"}
      data-motion={reduced ? "reduced" : "normal"}
      className="app vs-root"
    >
      <ToastProvider>
        <Workspace
          dark={dark}
          setDark={setDark}
          glass={glass}
          setGlass={setGlass}
          reduced={reduced}
          setReduced={setReduced}
        />
      </ToastProvider>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
