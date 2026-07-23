# CONTEXTO — Carrerarda (simulador de carrera futbolística)

> Este archivo es el traspaso de contexto para seguir el desarrollo desde Claude Code.
> Contiene la visión del proyecto, cómo funciona, qué se implementó y qué queda pendiente.
> **Leé `src/App.jsx` completo antes de tocar nada** para entender las convenciones actuales.

---

## 1. QUÉ ES

**Carrerarda** es un simulador de carrera futbolística tipo [Copero](https://copero.com.ar/juegos/simulador-carrera), pero con más opciones y profundidad. Es un **proyecto personal de Ignacio Karvouniaris** (estudiante de Lic. en IA y Ciencia de Datos) pensado para su CV/portfolio.

- **GitHub**: github.com/IKarvouniaris/carrera-fc
- **Deploy**: Vercel (equipo "Karvos", plan Hobby) — auto-deploy al pushear a `main`
- **Ruta local (Windows)**: `C:\Users\Nacho\OneDrive\Documentos\carrera-fc`

### Filosofía de diseño (IMPORTANTE)
- **Simple como Copero, NO como Football Manager.** Una decisión por pantalla. Nada de barras de fatiga/moral ni menús de entrenamiento complejos.
- **1 turno = 1 año.** Una partida completa dura ~5 minutos.
- Cada fin de temporada tiene **una decisión con peso**, y la plata tiene utilidad.
- Más y mejores opciones, pero **sin abrumar**.

---

## 2. STACK Y ARQUITECTURA

- **Vite + React 18 + Tailwind CSS.**
- **Todo el juego está en un solo archivo: `src/App.jsx`** (~2300 líneas). Es intencional.
- Otros archivos: `src/index.css` (tiene keyframes de animaciones de feedback), `src/main.jsx`, configs de Vite/Tailwind/PostCSS, `index.html`, `README.md`, `LICENSE` (MIT), `.github/workflows/deploy.yml`, `vercel.json`.
- El estado del juego vive en un objeto `state` (React useState) con campos como `ovr`, `age`, `clubId`, `wage`, `money`, `injuries`, `clubBonds`, etc.
- Persistencia: se usa `localStorage` (prefijo `carrerarda_`) solo para recordar nombre/número/pierna/posición entre carreras (helpers `loadPref`/`savePref`).

### Convenciones de código
- Comentarios en **español**.
- Helpers arriba del archivo (`clamp`, `rf`, `fmtMoney`, `club(id)`, etc.).
- Datos en constantes mayúsculas (`CLUBS`, `CLUTCH_MOMENTS`, `LEAGUE_MATCHES`, etc.).
- El componente principal es `App()`; dentro define funciones de flujo (`runSeason`, `resolveSeason`, `invest`, `chooseClub`, etc.) y renderiza según `screen` (un useState string).
- Micro-componentes al final (`ClubLogo`, `Confetti`, `Chip`, `DecisionCard`, `ClubPicker`, etc.).

### ⚠️ Nota sobre Tailwind
Las clases de color deben estar como **strings completos** en el código (ej. `"bg-red-600"`), NO interpoladas, porque Tailwind purga lo que no encuentra literal. Si agregás colores dinámicos, usá tiers con clases completas (ver `ovrTier` y el botón Negociar como ejemplo).

---

## 3. CÓMO FUNCIONA EL JUEGO (FLUJO)

```
Identidad (apellido, número, pierna)
  → Posición (cancha SVG de fondo, elegís tu puesto)
  → Cantera (3 clubes argentinos random de un pool de 21, tier 1-3)
  → LOOP DE TEMPORADAS:
      playSeason() calcula stats del año
      → [opcional] Momento decisivo (clutch) cada par de temporadas
      → Diario (tapa oscura + repaso completo de la temporada)
      → [si ganó algo grande] pantalla de festejo con confetti + vibración
      → Mercado (seguir / renovar contrato / fichar oferta / soltado)
      → Pretemporada (invertir plata en acciones)
  → Fin (retiro): tarjeta de carrera compartible + comparación con leyendas
```

### Mecánicas centrales
- **137 clubes** en 8 divisiones (LPF Argentina, Primera Nacional, La Liga, Bundesliga, Serie A, Premier, Championship, Primera A Colombia). Cada club tiene `tier`, `req` (nivel requerido) y `prestige`.
- **OVR con tiers de color estilo FIFA UT** (helper `ovrTier`): bronce ≤64, plata 65-74, oro 75-86, oro brillante 87-91, violeta/especial 92+.
- **Crecimiento de OVR**: depende del prestigio del club (más grande = crecés más rápido), la edad (curva por posición: arqueros maduran/duran más, delanteros pican jóvenes), y los minutos jugados. Techo blando hace muy difícil llegar a 99.
- **Posiciones importan**: arquero usa "vallas invictas" (clean sheets) en vez de goles/asistencias; delantero es volátil (si no hace goles, rinde mal).
- **Partidos oficiales por liga** (`LEAGUE_MATCHES`): ARG 30, ESP/ITA/ENG 38, GER 34, COL 32.
- **Copas**: nacional (`NATIONAL_CUP`, la juegan todos) e internacional (`INTL_CUP`: Libertadores para ARG/COL, Champions para europeos, solo clubes con prestige≥68). El total de PJ = liga + copa nacional + internacional.
- **Préstamos**: si sos joven en un club grande y no rendís, te mandan a préstamo (elegís entre opciones random), dura 1-2 temporadas, y al final volvés o fichás definitivo.
- **Selección nacional**: te convocan según nivel; cada 2 años hay torneo (Copa América / Mundial alternados).
- **Trofeos** con premios en plata + festejo con confetti. **Balón de Oro** para los mejores del mundo.
- **Indirectas**: le "tirás una indirecta" a cualquier club para que te fichen. La reacción depende de tu nivel vs su `req`: interesado / tibio / desmentido (te bajan público estilo Enzo/Julián). Tirarle al clásico rival enoja a tu hinchada.
- **Momentos decisivos** (clutch): situaciones donde vos elegís (patear penal, atajar, declaraciones, renovación...). Resultado = mitad OVR mitad suerte. Filtrados por posición.
- **Lesiones**: riesgo crece con edad + historial. Fisios lo bajan una temporada; cláusula médica lo baja permanente.
- **Paciencia y resentimiento**: te sueltan con 2 temporadas malas seguidas (aviso tras la 1ª) o 1 desastrosa. El club que te soltó no te oferta por 3 temporadas.
- **Vuelta a casa**: los clubes formativos te llaman a volver cuando sos figura.
- **Duelo generacional**: veterano sin rendir pelea el puesto contra un pibe o se va.

---

## 4. PREFERENCIAS DE TRABAJO DE IGNACIO

- **Hablale en español.**
- Trabajá **metódico, paso a paso**.
- **Código con comentarios en español.**
- **Siempre corré `npm run build` antes de dar por terminado** un cambio, para validar que compila.
- Cuando toques **balance/mecánicas**, verificá los números con una **simulación rápida en Node** antes de darlo por hecho (ej. `node -e "..."`).
- Al terminar, **recordale los comandos de git** para pushear.
- Prefiere que le adviertas de forma **honesta** las limitaciones (ej. si no podés verificar algo).
- Suele preferir **guía sobre solución completa** cuando debuggea por su cuenta.

### Flujo de deploy que usa Ignacio
1. Edita el/los archivo(s) que cambiaron (con Claude Code esto es directo).
2. `git status` para confirmar qué cambió.
3. `npm run dev` para probar en local (http://localhost:5173).
4. `git add . && git commit -m "..." && git push`
5. Vercel redeploya solo en ~30s.

---

## 5. HISTORIAL DE LO IMPLEMENTADO

### Base del juego
Creación de personaje, 137 clubes reales, loop de temporadas, OVR por club/edad/minutos, préstamos, selección, trofeos, Balón de Oro, retiro anticipado, tarjeta de carrera final con comparación a leyendas por posición (Messi/Iniesta/Maldini/Neuer), diario entre temporadas, curva de OVR siempre visible, indirectas, duelo generacional, sistema de paciencia/resentimiento, vuelta a casa.

### Feedback visual
Confetti + vibración para títulos/Mundial/Copa/Balón de Oro, banner rojo animado para lesiones, animaciones de entrada escalonadas (keyframes en `index.css`, respeta `prefers-reduced-motion`).

### Logos de clubes
Escudos SVG generados (iniciales + colores) como respaldo (`CrestSVG`, fallback vía `onError`). Se intentó logos reales con Google favicons (falló, devolvía favicon genérico) y después con ESPN CDN (funcionaba pero dependía de un tercero y solo tenía IDs verificados para clubes grandes).

**Resuelto (pendiente #1 del roadmap): base de datos propia de escudos.** Ignacio bajó ZIPs de escudos reales (carpeta local `Escudos/`, ignorada en git — no se versiona, pesa ~21MB crudo). Se extrajeron, se mapearon 113 de los 137 clubes a su archivo, se redimensionaron a 160×160 (estaban en ~1500×1500) y se guardaron en `public/logos/{id}.png` (~1.2MB total). `clubLogoUrl(id)` en `App.jsx` devuelve simplemente `` `${import.meta.env.BASE_URL}logos/${id}.png` `` — ya no hay diccionario de IDs que mantener; para sumar un club alcanza con poner el PNG con el nombre exacto del `id`, sin tocar código. `ClubLogo` sigue cayendo al escudo generado si el archivo no existe o falla la carga.

Quedan **24 clubes sin escudo real** (usan el generado) porque no vinieron en los ZIPs descargados:
- España (5): girona, mallorca, laspalmas, leganes, valladolid
- Alemania (5): wolfsburg, bochum, heidenheim, stpauli, holstein
- Italia (2): verona, empoli
- Inglaterra Premier (4): westham, wolves, leicester, southampton
- Inglaterra Championship (8): burnley, sheffield, westbrom, norwich, middlesbrough, watford, bristol, cardiff

Para completarlos: conseguir el PNG del escudo y guardarlo como `public/logos/{id}.png` (ver `id` exacto en el array `CLUBS`).

### Cancha de fondo
En la pantalla de elegir posición, cancha SVG (césped con franjas, áreas, círculo central, línea media) con botones translúcidos encima.

### TANDA VERDE (6 mejoras)
- Mostrar sueldo actual en el mercado (banner + flechas ↑/↓ + en botón Seguir).
- "Desarrollo" → "Nivel"; helper `leagueShort` para pantallas chicas.
- Botón Negociar ámbar + negociación múltiple con riesgo escalado.
- Arquero con vallas invictas (`cleanSheets`).
- Leyenda arquero Buffon → Neuer.
- Recordar identidad entre carreras (localStorage).

### INDIRECTAS mejoradas
`invest()` calcula `hintReaction` según gap = ovr - req: interesado (gap≥3, +0.50 chance), tibio (gap≥-5, +0.18), desmentido (gap<-5, -0.30 + bloqueo 2 temporadas). Reportado en resumen y diario ("NO ESTÁ EN NUESTROS PLANES", "SUENA FUERTE"). `ClubPicker` muestra indicador de color (verde/ámbar/rojo) + logo.

### TANDA AMARILLA (completa)
- **#9 Partidos oficiales + copas**: `LEAGUE_MATCHES`, `NATIONAL_CUP`, `INTL_CUP`, `leagueCountry()`. pj = liga+copa+intl. Titulares de diario nuevos, vitrina con iconos por tipo.
- **#3 Aleatorización + memoria de clubes**: `loanOptions` con ruido random (préstamos varían), `generateOffers` con shuffle. `clubBonds` (rating≥6.8 sube +1 tope 3, <5.6 baja -1); cada punto = +0.12 chance de que te vuelvan a llamar. Badge "💙 Te conocen y te quieren de vuelta".
- **#7 Momentos decisivos**: `CLUTCH_MOMENTS` (con campo `pos`: "field"/"gk"/"any"). Éxito = 0.5*skill + 0.5*random - risk*0.4 + 0.35. Pantallas "clutch" y "clutchResult". `clutchCooldown`.
- **#6 Diario mejorado**: tapa oscura, cabecera roja "EL DEPORTIVO", fecha "DIC {año}", repaso completo punto por punto (array `recap` con tones gold/special/info/bad), confetti si gloria.
- **#12 Prensa/ego**: acción "📣 Campaña de prensa" (`pressCost` = wage×0.6, `state.press` se resetea cada temporada). Baja vara de convocatoria + sube chance Balón de Oro (+0.20).
- **#13 Cláusulas anti-lesión**: "🏥 Cláusula médica" (`clauseCost` = wage×2, solo si injuries≥3, `state.medicalClause` PERMANENTE, baja injuryRisk ×0.55). Clubes grandes (prestige≥75) desconfían de propensos (injuries≥3): chance -0.25; la cláusula lo evita.

### Botón Negociar con color por riesgo
Helper `withdrawRiskFor(offer)`. Botón cambia de color por tier: ámbar (<0.2) → naranja (0.2-0.35) → rojo (0.35-0.5) → rojo intenso (≥0.5). Muestra el % de riesgo exacto.

### 3 arreglos de inmersión (últimos)
- **Renovar en tu club**: botón "💬 Renovar contrato" en el mercado → `openRenewal()` (oferta = max(wage×1.15, mejorOfertaExterna × valued), valued = clamp((ovr-req)/25+0.5, 0.3, 1)), `pushRenewal()` (pedir más, chance decreciente), `acceptRenewal()`. Se resetea cada mercado.
- **Momentos por posición**: arquero recibe momentos gk (atajar penal, salida) en vez de tirar libres. Campo `pos` en cada momento.
- **Indirectas sin filtro**: `hintTargets` ya no filtra por tier/nivel (podés tirarle a cualquier club). Si les sobrás (interesado + ovr-req≥6), te dan el mejor contrato (wageMult 0.14-0.18) con badge "🔥 Te quieren sí o sí: contratón".

---

## 6. COSTOS ECONÓMICOS ACTUALES (referencia de balance)
- Preparador personal: `wage × 0.4`
- Cuerpo de fisios: `wage × 0.35`
- Campaña de prensa: `wage × 0.6`
- Agente de élite: `wage × 1.5` (permanente)
- Cláusula médica: `wage × 2` (permanente, solo si injuries≥3)
- Premios: campeón liga 0.5×wage, copa nacional 0.35×wage, copa internacional 0.8×wage, selección 0.4×wage, Balón de Oro 0.6×wage.

---

## 7. PENDIENTES / IDEAS A FUTURO

### Del roadmap original de amigos (queda 1, es laburo de imágenes)
- **#1 — Base de datos propia de logos. ✅ HECHO** (ver sección 5, "Logos de clubes"). 113/137 clubes con escudo real en `public/logos/`; quedan 24 clubes chicos sin archivo (lista en sección 5) que siguen con el escudo generado.
- **#14 — Imágenes reales de las copas**, que se distingan cuáles son (Libertadores vs Champions vs copas nacionales). Hay que conseguir/crear las imágenes.

### Otras ideas mencionadas
- Conseguir los 24 escudos que faltan (lista en sección 5) para completar la base de logos.
- Renombrar "Nivel"/"Desarrollo" a algo más claro si se le ocurre algo mejor (quedó en "Nivel").
- Considerar: capturas al README (la cancha, el diario, la tarjeta de carrera se ven bien) + URL de Vercel arriba con "🎮 Jugar ahora".

### ⚠️ Sobre derechos de imagen (importante para el CV)
Los logos/escudos reales de clubes son marcas registradas. Para un proyecto público de portfolio, usar escudos generados propios (o una BD propia estilizada) es más prudente que logos oficiales, que podrían traer reclamos de takedown. Se decidió priorizar seguridad legal.

---

## 8. CÓMO RETOMAR

Cuando Ignacio pida algo:
1. Leé la parte relevante de `src/App.jsx`.
2. Si es una mecánica de balance, mirá cómo están las fórmulas actuales (buscá el helper o la función correspondiente).
3. Implementá el cambio con comentarios en español.
4. `npm run build` para validar.
5. Si tocaste balance, verificá con una simulación en Node.
6. Recordale los comandos de git.

Cualquier decisión de diseño ya tomada está documentada arriba — respetala salvo que Ignacio diga lo contrario.
