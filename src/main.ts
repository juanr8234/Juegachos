import "./style.css";
import { games } from "./games";

const app = document.querySelector<HTMLDivElement>("#app")!;

const header = document.createElement("header");
header.className = "menu__header";
header.innerHTML = `
  <h1 class="menu__title">MiniGames</h1>
  <p class="menu__subtitle">elegí un juego para empezar</p>
`;

const grid = document.createElement("div");
grid.className = "menu__grid";

for (const game of games) {
  const card = document.createElement("a");
  card.className = "card";
  card.href = game.path;
  card.innerHTML = `
    <h2 class="card__title">${game.title}</h2>
    <p class="card__description">${game.description}</p>
  `;
  grid.append(card);
}

app.append(header, grid);
