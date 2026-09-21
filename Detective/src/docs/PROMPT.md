DINO DETECTIVE
Documento de contexto y requerimientos para IA

Proyecto: Videojuego Frontend con React + Consumo de Datos + n8n

1. Propósito de este documento

Este documento debe utilizarse como contexto para una IA que ayudará a desarrollar Dino Detective. La IA debe respetar la arquitectura, el diseño ya definido y los requisitos técnicos del Quiz #5. No debe eliminar funcionalidades requeridas ni cambiar la temática principal sin autorización.

2. Concepto del videojuego

Dino Detective es un videojuego web de investigación y misterio protagonizado por un pequeño dinosaurio de peluche azul que trabaja como detective. El jugador selecciona expedientes, analiza evidencias digitales, responde preguntas, obtiene puntos y trata de resolver cada caso.

Estilo visual ya definido: Cyber Noir Detective, oscuro y moderno, con tonos azul marino, cyan, iluminación cálida, expedientes, computadoras, evidencias y elementos tecnológicos. El dinosaurio azul es la identidad principal del juego. El diseño visual ya fue creado en Stitch y debe conservarse al convertirlo a React.

3. Flujo principal del juego

Inicio → selección de casos → investigación del caso → análisis de evidencias → respuestas → resultado.

Las respuestas correctas aumentan el puntaje; las incorrectas generan errores o penalizaciones.

Al finalizar se calcula el resultado/rango, se guarda la puntuación y se envían datos al workflow de n8n.

El jugador puede consultar posteriormente el leaderboard.

4. Estructura de carpetas acordada

src/
├── assets/
│   ├── images/
│   └── icons/
├── Components/
│   ├── Navbar.jsx
│   ├── CaseCard.jsx
│   ├── EvidenceCard.jsx
│   ├── QuestionPanel.jsx
│   ├── DetectiveStats.jsx
│   ├── Timer.jsx
│   ├── DinoAssistant.jsx
│   └── ResultModal.jsx
├── Pages/
│   ├── Home.jsx
│   ├── Cases.jsx
│   ├── Investigation.jsx
│   ├── Leaderboard.jsx
│   ├── Instructions.jsx
│   └── GameOver.jsx
├── Routes/
│   └── AppRoutes.jsx
├── Services/
│   ├── caseService.js
│   ├── scoreService.js
│   └── n8nService.js
├── Styles/
│   ├── global.css
│   ├── navbar.css
│   ├── home.css
│   ├── cases.css
│   ├── investigation.css
│   ├── leaderboard.css
│   ├── instructions.css
│   └── gameOver.css
├── App.jsx
└── main.jsx

db.json
README.md
package.json
n8n/
├── dino-detective-workflow.json
└── workflow-capture.png

5. Rutas requeridas

Ruta

Pantalla

/

Home

/cases

Selección de casos

/case/:id

Investigación — ruta dinámica obligatoria

/leaderboard

Ranking

/instructions

Instrucciones

/game-over

Game Over / resultado

6. Requisitos técnicos obligatorios

Área

Requerimiento

Componentes

Mínimo 4 componentes reutilizables; usar props padre-hijo; renderizar listas con .map() y key única/estable.

useState

Manejar puntaje, errores/vidas, evidencia actual, respuestas, estado de partida y otros estados necesarios.

useEffect

Usarlo para carga inicial de datos, temporizador y/o detección del final de la partida.

Hook adicional

Usar al menos uno entre useRef, useMemo, useCallback o useContext y justificar su uso. Se propone useMemo para cálculos derivados del puntaje/rango.

Estado

Nunca mutar el estado directamente; utilizar siempre las funciones setter.

React Router

Mínimo 3 rutas, navegación funcional y una ruta dinámica. Se utilizará /case/:id.

Datos

Consumir una fuente de datos. Se propone db.json servido mediante json-server.

GET

Realizar como mínimo una lectura. Ejemplos: GET /cases, GET /cases/:id y GET /scores.

POST/PUT

Realizar al menos una escritura. Se propone POST /scores para guardar el resultado.

Loading/Error

Mostrar estados visibles de carga y error en las peticiones.

Jugabilidad

El juego debe poder jugarse de inicio a fin sin errores críticos.

7. Datos propuestos en db.json

La base local puede contener como mínimo las colecciones cases, scores y players. Los casos deben incluir información suficiente para mostrar título, descripción, dificultad, evidencias, preguntas/opciones y respuesta correcta.

{
  "cases": [],
  "scores": [],
  "players": []
}

8. Lógica propuesta de puntuación

La puntuación exacta puede ajustarse durante el desarrollo. Como base: respuesta correcta +200, respuesta incorrecta -50, evidencia encontrada +100 y bonus al resolver el caso. El sistema puede clasificar al jugador en rangos como Recluta, Investigador, Detective y Cyber Detective Elite.

9. Integración obligatoria con n8n

El frontend debe comunicarse realmente con un webhook de n8n mediante fetch.

El workflow debe comenzar con Webhook o Trigger.

Debe contener al menos 3 nodos encadenados que procesen o transformen datos.

Debe incluir una condición o ramificación mediante IF, Switch o código.

Debe finalizar con una acción útil: guardar datos, responder al frontend, escribir en una hoja, etc.

Se propone enviar jugador, caseId, score, errors y time al finalizar una partida.

El workflow exportado .json y una captura del flujo deben guardarse en el repositorio.

La URL del webhook debe documentarse en README.md.

10. README y repositorio

El README debe incluir descripción del juego, historia/concepto, instrucciones para ejecutar el proyecto, cómo jugar, tecnologías utilizadas, fuente de datos/db.json, rutas principales, configuración de n8n y URL del webhook. El repositorio debe mostrar commits pequeños y progresivos que evidencien el desarrollo.

11. Instrucciones para la IA

Trabajar paso a paso y no reconstruir todo el proyecto de una sola vez.

Respetar la estructura de carpetas y nombres definidos en este documento.

No cambiar el diseño visual creado en Stitch salvo que se solicite.

Usar React; no reemplazar la solución por HTML estático.

Mantener los componentes reutilizables y evitar duplicar código.

Separar las peticiones HTTP en Services cuando corresponda.

No instalar librerías innecesarias sin explicar primero por qué son necesarias.

No eliminar requisitos del Quiz para simplificar el proyecto.

Cuando genere código, indicar claramente el archivo exacto donde debe colocarse.

Si modifica un archivo existente, entregar el código completo del archivo cuando sea necesario para evitar errores de integración.

Antes de avanzar al siguiente bloque, permitir comprobar que el anterior funciona.

Priorizar código entendible para un estudiante que está aprendiendo React.

12. Prompt base reutilizable

Actúa como asistente de desarrollo Frontend para el proyecto Dino Detective. Usa este documento como fuente principal de requisitos. El diseño visual ya existe en Stitch y no debe rediseñarse. Trabaja con React y respeta la estructura de Components, Pages, Routes, Services, Styles y assets definida aquí. El proyecto debe cumplir los requisitos del Quiz #5: componentes reutilizables, props, listas con key, useState, useEffect, un hook adicional justificado, React Router con /case/:id, consumo GET y POST/PUT, estados loading/error, db.json/json-server y conexión real con un webhook de n8n. Trabaja paso a paso, indica siempre qué archivo estás creando o modificando y no agregues dependencias o funcionalidades fuera del alcance sin explicarlo. Tarea actual: [ESCRIBIR AQUÍ LA TAREA].

13. Checklist final

☐ Diseño de Stitch convertido correctamente a React

☐ 4+ componentes reutilizables

☐ Props implementadas

☐ .map() + key estable

☐ useState

☐ useEffect

☐ Hook adicional justificado

☐ 3+ rutas

☐ /case/:id

☐ GET funcional

☐ POST/PUT funcional

☐ Loading y Error

☐ Juego completo de inicio a fin

☐ Webhook n8n conectado al frontend

☐ Workflow n8n exportado + captura

☐ db.json incluido

☐ README completo

☐ Commits progresivos