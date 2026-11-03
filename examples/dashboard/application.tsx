import React, { useState } from "react";
import {
  GlassPanel,
  NumberInput,
  DateInput,
  TimeInput,
  FileInput,
  MultiSelect,
  ToggleGroup,
  Collapsible,
  Timeline,
  Toolbar,
  PageHeader,
  NavList,
  CodeBlock,
  Button,
  Card,
  Grid,
  Stack,
  Alert,
  Tabs,
} from "../../packages/ui/src/index";
export function ApplicationExamples() {
  const [roles, setRoles] = useState(["developer"]);
  const [files, setFiles] = useState<string[]>([]);
  const [format, setFormat] = useState<string[]>(["email"]);
  const [message, setMessage] = useState("");
  return (
    <section className="application-examples">
      <GlassPanel animate className="material-preview">
        <div>
          <small>VELESSOFT / MATERIALS</small>
          <h2>Знакомый интерфейс. Свой характер.</h2>
          <p>
            Мягкое стекло, спокойные поверхности и яркие акценты. В шапке можно
            отключить прозрачность и движение.
          </p>
        </div>
        <div className="material-symbol" aria-hidden="true">
          vs<span>+</span>
        </div>
      </GlassPanel>
      <PageHeader
        level={2}
        eyebrow="APPLICATION KIT / 0.4"
        title="Инструменты для продукта"
        description="Формы, действия и навигация в одном визуальном языке."
      />
      <Tabs
        label="Новые компоненты"
        items={[
          {
            value: "forms",
            label: "Формы и выбор",
            content: (
              <Grid min={280}>
                <Card title="Параметры проекта" flat>
                  <Grid min={150}>
                    <NumberInput
                      label="Участники"
                      min={1}
                      max={100}
                      defaultValue={5}
                    />
                    <DateInput label="Дата запуска" defaultValue="2026-11-20" />
                    <TimeInput label="Время" defaultValue="10:00" />
                  </Grid>
                  <FileInput
                    label="Прикрепить файлы"
                    multiple
                    onFilesChange={(f) => setFiles(f.map((x) => x.name))}
                    hint="Локальный пример. Файлы не отправляются на сервер."
                  />
                  {files.length > 0 && (
                    <p role="status">Выбрано: {files.join(", ")}</p>
                  )}
                  <Collapsible title="Дополнительные настройки">
                    <p>Каналы уведомлений</p>
                    <ToggleGroup
                      label="Уведомления"
                      options={[
                        { value: "email", label: "Почта" },
                        { value: "app", label: "В приложении" },
                        { value: "sms", label: "SMS", disabled: true },
                      ]}
                      value={format}
                      onValueChange={setFormat}
                    />
                  </Collapsible>
                </Card>
                <MultiSelect
                  label="Роли участников"
                  searchLabel="Найти роль"
                  emptyText="Роли не найдены"
                  hint="Можно выбрать несколько значений."
                  options={[
                    { value: "developer", label: "Разработчик" },
                    { value: "designer", label: "Дизайнер" },
                    { value: "reviewer", label: "Ревьюер" },
                    { value: "owner", label: "Владелец", disabled: true },
                  ]}
                  value={roles}
                  onValueChange={setRoles}
                />
              </Grid>
            ),
          },
          {
            value: "layout",
            label: "Страницы и история",
            content: (
              <Grid min={260}>
                <Card title="Навигация" flat>
                  <NavList
                    label="Разделы проекта"
                    current="overview"
                    items={[
                      { id: "overview", label: "Обзор", href: "#overview" },
                      {
                        id: "issues",
                        label: "Задачи",
                        href: "#issues",
                        badge: 12,
                      },
                      { id: "settings", label: "Настройки", href: "#settings" },
                    ]}
                  />
                  <Toolbar label="Действия проекта">
                    <Button
                      variant="primary"
                      onClick={() =>
                        setMessage("Демонстрационные настройки сохранены")
                      }
                    >
                      Сохранить
                    </Button>
                    <Button
                      onClick={() =>
                        setMessage("Черновик сброшен в демонстрации")
                      }
                    >
                      Сбросить
                    </Button>
                  </Toolbar>
                  {message && <Alert title={message} tone="success" />}
                </Card>
                <Card title="История изменений" flat>
                  <Timeline
                    label="История проекта"
                    items={[
                      {
                        id: "one",
                        title: "Библиотека обновлена",
                        time: "Сегодня, 10:30",
                        dateTime: "2026-11-02T10:30:00+03:00",
                        description: "Добавлены формы и новые сценарии.",
                      },
                      {
                        id: "two",
                        title: "Дизайн согласован",
                        time: "Вчера",
                        dateTime: "2026-11-01",
                        description:
                          "Зелёный и фиолетовый остались фирменными акцентами.",
                      },
                    ]}
                  />
                </Card>
              </Grid>
            ),
          },
          {
            value: "code",
            label: "Код и интеграция",
            content: (
              <CodeBlock
                label="React / пример"
                code={
                  'import { DateInput, MultiSelect } from "@villetacore/velessoft-ui";\n\n<DateInput label="Дата запуска" />'
                }
                copyLabel="Копировать"
                copiedLabel="Скопировано"
                errorLabel="Не удалось скопировать"
              />
            ),
          },
        ]}
      />
    </section>
  );
}
