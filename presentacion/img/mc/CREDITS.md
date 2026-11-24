# Créditos de imágenes (Minecraft)

Proyecto de clase, no comercial, con fines educativos.
Minecraft es marca y propiedad de Mojang Studios y Microsoft. Estas imágenes no se usan para fines comerciales.

Todas las imágenes vienen de Wikimedia Commons. La licencia se tomó de la ficha de cada archivo (metadatos de Commons, consultados 2026-11-23).

| Archivo local | Fuente (página del archivo) | Autor (según la ficha) | Licencia (según la ficha) | Uso en el deck |
|---|---|---|---|---|
| mob/creeper-face.jpg | https://commons.wikimedia.org/wiki/File:Minecraft-creeper-face.jpg | Mojang | Dominio público (Public domain), según la ficha | Icono del creeper (portada y cabecera) |
| mob/creeper.png | https://commons.wikimedia.org/wiki/File:Minecraft_Creeper_(Crop).png | Xbox México | CC BY 3.0 | Ya no se usa en el deck (se quitó el arte 3D del cierre) |
| mob/alex.png | https://commons.wikimedia.org/wiki/File:Alex%3F.png | Xbox México | CC BY 3.0 | Ya no se usa en el deck (se quitó el arte 3D del cierre) |

Nota: en Commons, Xbox México figura como autor de las capturas de Minecraft. Esa ficha dice CC BY 3.0. Los derechos sobre el juego y sus personajes siguen siendo de Mojang Studios y Microsoft.

## Imágenes añadidas (2026-11-23): texturas, mobs y fondos

Las siguientes imágenes no provienen de Wikimedia Commons (esa fuente devolvió HTTP 429). Se tomaron de minecraft.wiki y de un repositorio de recursos extraídos del juego. Las licencias se anotan tal como lo indica cada fuente.

### Texturas y mobs (vanilla, Minecraft 1.20.4)

Fuente común: repositorio https://github.com/InventivetalentDev/minecraft-assets (rama 1.20.4, archivos en `assets/minecraft/textures/`). El repositorio no declara licencia (GitHub: `license: None`); su README solo indica que son recursos extraídos de los .jar de Minecraft. Por eso la licencia se registra como "Copyright Mojang, uso educativo", tal como acordó el proyecto.

| Archivo local | Fuente (ruta en el repositorio) | Autor | Licencia | Tamaño |
|---|---|---|---|---|
| item/diamond.png | item/diamond.png | Mojang Studios | Copyright Mojang, uso educativo | 16x16 |
| item/emerald.png | item/emerald.png | Mojang Studios | Copyright Mojang, uso educativo | 16x16 |
| item/diamond_sword.png | item/diamond_sword.png | Mojang Studios | Copyright Mojang, uso educativo | 16x16 |
| item/diamond_pickaxe.png | item/diamond_pickaxe.png | Mojang Studios | Copyright Mojang, uso educativo | 16x16 |
| item/compass.png | item/compass_00.png (cuadro base de la brújula) | Mojang Studios | Copyright Mojang, uso educativo | 16x16 |
| item/chest.png | entity/chest/normal.png (textura del cofre) | Mojang Studios | Copyright Mojang, uso educativo | 64x64 |
| item/crafting_table.png | block/crafting_table_front.png | Mojang Studios | Copyright Mojang, uso educativo | 16x16 |
| item/grass_block.png | block/grass_block_side.png | Mojang Studios | Copyright Mojang, uso educativo | 16x16 |
| item/redstone_dust.png | item/redstone.png | Mojang Studios | Copyright Mojang, uso educativo | 16x16 |
| item/cooked_beef.png | item/cooked_beef.png | Mojang Studios | Copyright Mojang, uso educativo | 16x16 |
| item/bread.png | item/bread.png | Mojang Studios | Copyright Mojang, uso educativo | 16x16 |
| item/cake.png | item/cake.png | Mojang Studios | Copyright Mojang, uso educativo | 16x16 |
| item/gold_ingot.png | item/gold_ingot.png | Mojang Studios | Copyright Mojang, uso educativo | 16x16 |
| item/experience_orb.png | entity/experience_orb.png | Mojang Studios | Copyright Mojang, uso educativo | 64x64 |
| mob/cow.png | entity/cow/cow.png | Mojang Studios | Copyright Mojang, uso educativo | 64x32 |
| mob/steve.png | entity/player/wide/steve.png | Mojang Studios | Copyright Mojang, uso educativo | 64x64 |
| mob/pig.png | entity/pig/pig.png | Mojang Studios | Copyright Mojang, uso educativo | 64x32 |
| mob/villager.png | entity/villager/villager.png | Mojang Studios | Copyright Mojang, uso educativo | 64x64 |
| mob/enderman.png | entity/enderman/enderman.png | Mojang Studios | Copyright Mojang, uso educativo | 64x32 |

URL base de descarga: https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.4/assets/minecraft/textures/

### Fondos (capturas de Minecraft Wiki)

| Archivo local | Fuente (página del archivo) | Autor | Licencia (según la página) | Tamaño |
|---|---|---|---|---|
| bg/landscape-clear-panorama.png | https://minecraft.wiki/w/File:Clear_panorama.png (versión Java de File:Clear panorama BE.png) | No indicado en la página (subida por un editor del wiki) | `{{License Mojang}}`: copyright Mojang Studios, usable según las Minecraft Usage Guidelines (https://www.minecraft.net/usage-guidelines) | 1920x1080 |
| bg/landscape-above-mountains.png | https://minecraft.wiki/w/File:Above_the_Mountains.png ("Overhead view of the mountains.") | No indicado en la página (subida por un editor del wiki) | `{{License Mojang}}`: copyright Mojang Studios, usable según las Minecraft Usage Guidelines (https://www.minecraft.net/usage-guidelines) | 1920x1017 |

Nota: en minecraft.wiki, el texto de licencia viene de la plantilla https://minecraft.wiki/w/Template:License_Mojang. Esa plantilla indica "Copyrighted Mojang", con uso permitido bajo las Minecraft Usage Guidelines.

## Uso en el deck (versión de 2026-11-23, index.html)

Archivos usados (vía `img/mc/...`):

- `bg/landscape-above-mountains.jpg`: fondo de la portada, la llanura y el cierre. Derivado de `bg/landscape-above-mountains.png` (1920 px de ancho, JPEG calidad 84, 386 KB). Misma fuente y licencia que el PNG original.
- `item/` (vanilla, Mojang, uso educativo): `grass_block` (logo y parte 1), `compass` (parte 2), `cooked_beef` (parte 3, pedidos), `diamond_pickaxe` (parte 4), `diamond` (tablas de usuarios y estadísticas), `diamond_sword` (empleados), `emerald` (viñetas y estadística), `redstone_dust` (viñetas y detalle), `gold_ingot` (pagos y viñetas), `bread` (clientes y estación "Pedido"), `cake` (menu_platos), `crafting_table` (mesas y estación "Mesa"), `chest` (estación "Detalle"; se recorta en CSS a la cara del cofre), `experience_orb` (viñetas de conclusiones; se recorta en CSS a un solo cuadro de 16 px).
- `mob/steve.png` y `mob/villager.png` (vanilla, Mojang, uso educativo): solo la cara (8x8 en x=8,y=8; steve con capa de sombrero x=40,y=8), escalada en pixel con CSS, en el cierre. No se muestran los skins completos.
- `mob/creeper-face.jpg` (Mojang, dominio público, Wikimedia Commons): portada y botón de inicio.

Archivos descargados que no se usan en el deck: `bg/landscape-clear-panorama.png`, `mob/cow.png`, `mob/pig.png`, `mob/enderman.png`. `mob/creeper.png` y `mob/alex.png` se quitaron del deck (arte 3D mezclado con pixel art).

Nota: el recorte de la figura 2 (`img/recortes/fig02-catalogo-tabla.jpg`) es un recorte de la captura del propio equipo (`img/fig02-catalogo.png`); no es arte de Minecraft.

## Tipografía (2026-11-23)

Todo el texto del deck usa **Monocraft** 4.2.1, de Idrees Hassan. Licencia: SIL Open Font License 1.1 (copia del texto en `fonts/OFL.txt`, con la línea de copyright de la fuente). Fuente: https://github.com/IdreesInc/Monocraft (release v4.2.1, `Monocraft-ttf.zip`).

| Archivo | Uso en el deck |
|---|---|
| `fonts/Monocraft.ttf` | Texto regular, títulos y SQL |
| `fonts/Monocraft-Bold.ttf` | Peso 700 (cabeceras de tarjetas y de consulta), de `weights/` del mismo zip |

La fuente se carga desde `fonts/` con `@font-face`; el deck no usa Google Fonts ni necesita conexión. Se desactivaron las ligaduras en CSS, porque Monocraft trae ligaduras para `--`, `->` y `==` que cambiarían el SQL. La fuente no trae `≥` ni `≤`; el deck no los usa.
