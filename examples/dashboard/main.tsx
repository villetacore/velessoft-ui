import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Badge,
  Alert,
  Dialog,
} from "../../packages/ui/src/index";
import "../../packages/tokens/tokens.css";
import "../../packages/ui/src/styles.css";
import "./style.css";
function App() {
  const [dark, setDark] = useState(true),
    [open, setOpen] = useState(false),
    [name, setName] = useState(""),
    [projects, setProjects] = useState(["Design system", "Documentation"]),
    [query, setQuery] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  return (
    <div data-theme={dark ? "dark" : "light"} className="app">
      <header>
        <b>velessoft / UI</b>
        <span>DIY WORKBENCH · by villetacore</span>
        <Button onClick={() => setDark(!dark)}>
          {dark ? "Светлая" : "Тёмная"} тема
        </Button>
      </header>
      <main>
        <div className="intro">
          <div>
            <small>EXPERIMENTAL / 0.1.0</small>
            <h1>Рабочая область</h1>
            <p>
              Настоящие React-компоненты. Данные примера хранятся только в
              памяти.
            </p>
          </div>
          <a href="/public/index.html">Дизайн-каталог ↗</a>
        </div>
        <div className="toolbar">
          <Input
            label="Поиск проектов"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
        {notice && (
          <Alert title="Готово" tone="success">
            {notice}
          </Alert>
        )}
        <section>
          {projects
            .filter((p) => p.toLowerCase().includes(query.toLowerCase()))
            .map((p, i) => (
              <div className="project" key={i}>
                <b>{p}</b>
                <Badge>Черновик</Badge>
              </div>
            ))}
          {!projects.some((p) =>
            p.toLowerCase().includes(query.toLowerCase()),
          ) && (
            <Alert title="Ничего не найдено">
              Измените поисковый запрос или создайте проект.
            </Alert>
          )}
        </section>
        <h2>Образцы компонентов</h2>
        <div className="samples">
          <div>
            <Select label="Тип проекта" defaultValue="compact">
              <option value="compact">Библиотека</option>
              <option value="normal">Приложение</option>
            </Select>
            <Textarea label="Описание" placeholder="Коротко о задаче" />
            <Checkbox label="Открытый исходный код" />
          </div>
          <div>
            <Alert title="Экспериментальная версия">
              API может меняться до 1.0. Проверяйте компоненты в контексте
              вашего продукта.
            </Alert>
            <Button loading>Сохранить</Button>{" "}
            <Button disabled>Недоступно</Button>
          </div>
        </div>
        <footer>© 2026 villetacore · MIT</footer>
      </main>
      <Dialog open={open} onClose={() => setOpen(false)} title="Создать проект">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) {
              setError("Введите название");
              return;
            }
            setProjects([...projects, name.trim()]);
            setNotice("Проект «" + name.trim() + "» создан");
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
          <Button type="submit" variant="primary">
            Создать
          </Button>{" "}
          <Button onClick={() => setOpen(false)}>Отмена</Button>
        </form>
      </Dialog>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
