# Mundo Maca 11.11 — prototipo funcional

## Qué incluye
- Catálogo responsive con búsqueda y filtros por categoría.
- Productos de demostración en pesos colombianos (COP).
- Carrito con cantidades y total estimado.
- Pedido consolidado que se prepara para WhatsApp.
- Formulario para solicitar productos que no estén publicados.
- Panel de administración en `/admin/` para crear, editar, eliminar y marcar productos como agotados.
- Administración básica de categorías.

## Cómo ejecutar
1. Descomprime el ZIP.
2. Abre `index.html` en un navegador. Para una experiencia más estable, usa un servidor local (por ejemplo, la extensión Live Server de VS Code).
3. Abre `admin/index.html` o navega a `/admin/`.

## Acceso de demostración al panel
- Correo: `admin@mundomaca.com`
- Contraseña: `Maca1111!`

Estas credenciales son públicas dentro del código del prototipo y NO ofrecen seguridad real. No publiques esta versión con datos reales ni uses estas credenciales en producción.

## Configurar WhatsApp
En `app.js`, reemplaza:
`const WHATSAPP_NUMBER = "";`
por el número del negocio en formato internacional, solo dígitos. Ejemplo de formato colombiano: `573001234567`.

El prototipo no abrirá WhatsApp hasta que se configure un número válido.

## Limitaciones deliberadas de esta primera versión
- Los productos y categorías se guardan en `localStorage` del navegador. No se sincronizan entre dispositivos ni entre clientes.
- La autenticación de `/admin/` es solo demostrativa; el control en JavaScript puede ser inspeccionado o evadido.
- Las imágenes se agregan mediante URL; todavía no hay carga de archivos.
- No hay pagos en línea, cálculo de domicilios, control de inventario transaccional ni registro central de pedidos.

## Antes de publicar
1. Crear proyecto Supabase y tablas de productos/categorías.
2. Configurar Supabase Auth y políticas RLS para que solo el propietario administre el catálogo.
3. Guardar imágenes en Supabase Storage.
4. Configurar el número oficial de WhatsApp.
5. Definir dominio, política de tratamiento de datos, condiciones de compra, envíos y devoluciones.
6. Probar en móviles y navegadores reales.

## Estructura
- `index.html`
- `styles.css`
- `app.js`
- `admin/index.html`
- `admin/admin.css`
- `admin/admin.js`
