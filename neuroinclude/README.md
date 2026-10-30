# NEUROINCLUDE: Plataforma Neuroeducativa y de Tecnología Inclusiva 🧠✨

> *Discover your brain. Understand your strengths. Develop your potential.*

Prototipo desarrollado para el **Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026**.

---

## 📌 1. Descripción del Proyecto
**NEUROINCLUDE** es una aplicación web interactiva que conecta la neurociencia, la accesibilidad universal y la inteligencia artificial abierta para explorar perfiles cognitivos (atención, memoria y funciones ejecutivas) desde una **perspectiva de fortalezas**. Su propósito es evitar la patologización o estigmatización en el ámbito educativo de Bolivia y la región, ofreciendo recomendaciones adaptativas y planes de desarrollo personales respetuosos y accesibles.

* **Público Objetivo:** Estudiantes, educadores y personas interesadas en explorar su perfil cognitivo, fortalezas de aprendizaje y preferencias sensoriales.

---

## 🎯 2. Categorías a las que Postula
El proyecto cumple con los requisitos y postula formalmente a las siguientes categorías del evento:

1. **Best Open-Source AI Project (DigitalOcean):** Implementación de una arquitectura ligera y descentralizada basada en herramientas y modelos de código abierto/pesos abiertos para procesar métricas cognitivas sin depender de infraestructura privativa.
2. **Best Use of Gemma 4 (Google):** Integración del ecosistema de modelos abiertos Gemma para la síntesis de perfiles cognitivos, explicación pedagógica en lenguaje sencillo y generación de recomendaciones orientadas a fortalezas.

---

## ❓ 3. Problema Identificado
En el ámbito educativo boliviano y regional, existe una marcada tendencia a evaluar el desempeño mediante métricas rígidas que etiquetan o estigmatizan la neurodiversidad. Muchas personas no cuentan con herramientas accesibles de autoconocimiento cognitivo que identifiquen sus **fortalezas reales de aprendizaje** y les brinden estrategias prácticas de organización y bienestar.

---

## 💡 4. Solución Propuesta
**NEUROINCLUDE** ofrece una plataforma en formato Single Page Application (SPA) que integra:
* **Baterías Cognitivas Interactivas:** Tareas objetivas (CPT / Go/No-Go, Corsi Block-Tapping, Trail Making) para medir atención sostenida, tiempo de reacción y memoria visoespacial.
* **Laboratorio EEG Demostrativo:** Un entorno para la visualización de bandas de frecuencia (Delta, Theta, Alfa, Beta) en tiempo real con capacidad de integración con hardware abierto (ej. OpenBCI, Muse) vía Web Bluetooth API.
* **Gobernanza de Datos Étiica:** Política **Zero-Trace** con identificación anónima (UUIDv4).
* **Informe y Plan Adaptativo:** Generación de un perfil visual de fortalezas y un plan de desarrollo flexible con metas editables.

---

## 🛠️ 5. Tecnologías e Integración de IA
* **Frontend & Interfaz:** HTML5, CSS3 (Diseño Accesible WCAG 2.1 AA), Tailwind CSS por CDN y Vanilla JavaScript Nativo (SPA autocontenida).
* **Visualización de Datos:** Chart.js para dashboards e HTML5 Canvas para renderizado temporal de señales.
* **Inteligencia Artificial:** Integración de la familia de modelos **Gemma 4** (vía Google AI Studio / API de Gemini) y pipelines de pesos abiertos para interpretar estructuradamente los resultados numéricos de las tareas y redactar resúmenes educativos no clínicos.

---

## ⚖️ 6. Matriz de Honestidad Técnica (Lo Real vs. Lo Demostrativo)
En cumplimiento estricto con las normas de integridad científica del hackathon:

| Módulo / Funcionalidad | Naturaleza | Descripción Técnica |
| :--- | :--- | :--- |
| **Prueba Go/No-Go (Atención)** | **100% REAL** | Registro de latencias exactas (`performance.now()`), aciertos, omisiones y falsas alarmas. |
| **Memoria Visoespacial (Corsi)** | **100% REAL** | Generación estocástica de secuencias y evaluación interactiva. |
| **Perfil Sensorial** | **100% REAL** | Cuestionario interactivo con escala Likert y controles de rango. |
| **Visualizador Temporal EEG** | **DEMOSTRATIVO / SINTÉTICO** | Modulación trigonométrica y estocástica en Canvas (Roadmap preparado para Web Bluetooth). |
| **Sugerencias e Interpretación IA** | **100% REAL** | Síntesis estructurada basada en modelos abiertos (**CERO diagnósticos clínicos**). |

> ⚠️ **Aviso Permanente:** NEUROINCLUDE es un prototipo experimental con fines educativos y de autoconocimiento. No es un dispositivo médico ni emite diagnósticos clínicos de TDAH, autismo ni ninguna otra condición.

---

## 🚀 7. Instrucciones para Ejecutar y Probar el Prototipo
No se requiere compilación, Node.js ni instalación de dependencias.

1. Clona el repositorio:
   ```bash
   git clone [https://github.com/AlejandraCordero/neuroinclude-hackaton.git](https://github.com/AlejandraCordero/neuroinclude-hackaton.git)