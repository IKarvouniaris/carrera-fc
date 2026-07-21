# ⚽ Carrera FC

> Simulador de carrera futbolística: construí la carrera de un jugador desde las inferiores hasta el retiro, tomando una decisión por temporada.

Inspirado en los juegos de decisiones tipo *career mode*, pero enfocado en las elecciones que importan: dónde fichar, cuándo tirar una indirecta, en qué invertir tu dinero y cómo manejar el paso del tiempo. Cada partida dura pocos minutos y cuenta una historia distinta.

## 🎮 Cómo se juega

Creás un jugador (nombre, posición, pierna hábil) y arrancás eligiendo un club de cantera. A partir de ahí, cada temporada se simula sola y vos decidís qué pasa entre una y otra:

- **Mercado de pases**: seguí en tu club o fichá por uno de los que te ofertan. Podés negociar cada oferta una vez.
- **Pretemporada**: invertí tu dinero en un preparador personal, un cuerpo de fisios, un agente de élite, o guardá la plata.
- **Indirectas**: declará públicamente dónde querés jugar para atraer ofertas (reutilizable cada varias temporadas).

## ✨ Mecánicas

- **137 clubes reales** en 8 divisiones: Liga Profesional y Primera Nacional (Argentina), La Liga, Bundesliga, Serie A, Premier League, Championship y Primera A (Colombia).
- **Identidad por posición**: un arquero madura tarde y dura más; un delantero explota joven y vive del gol. Cada rol tiene su curva de desarrollo, su rating y su valor de mercado.
- **El club te forma**: fichar por un grande te desarrolla más rápido, pero vas a pelear el puesto. Si no jugás, te mandan a préstamo.
- **Consecuencias reales**: los clubes tienen paciencia y memoria (si te sueltan, quedan resentidos). Tirarle una indirecta al clásico rival enfurece a tu hinchada.
- **Selección nacional** con Copa América y Mundial en años alternos.
- **Trofeos, Balón de Oro y la vuelta a casa**: el club que te formó puede llamarte cuando sos figura para que te retires como ídolo.
- **Duelo generacional**: de veterano, un juvenil puede venir por tu puesto — lo peleás o te vas.
- **Tapa de diario** entre temporadas con titulares generados según lo que pasó, y una **tarjeta de carrera** compartible al retirarte que te compara con las leyendas de tu posición.

## 🛠️ Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- Todo el estado del juego vive en el cliente — sin backend, sin dependencias de datos.

## 🚀 Correr localmente

```bash
npm install
npm run dev
```

Abrí la URL que muestra la terminal (por defecto `http://localhost:5173`).

Para generar la versión de producción:

```bash
npm run build     # genera /dist
npm run preview   # previsualiza el build
```

## 🌐 Deploy

El repo viene listo para dos rutas:

- **Vercel** (recomendado): importá el repo en [vercel.com](https://vercel.com), detecta Vite solo y deployea. Cero configuración.
- **GitHub Pages**: en `Settings > Pages > Source` elegí *GitHub Actions*. El workflow incluido (`.github/workflows/deploy.yml`) publica en cada push a `main`.

## 📄 Licencia

MIT — ver [LICENSE](LICENSE).
