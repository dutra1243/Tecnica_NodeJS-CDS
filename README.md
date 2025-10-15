# Tecnica_NodeJS-CDS

# Requisitos
- npm
- git

# Pasos para instalar y ejecutar:
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/dutra1243/Tecnica_NodeJS-CDS
   cd cd .\Tecnica_NodeJS-CDS\
    ```

2. Instalar las dependencias:
    ```bash
    npm i
    ```

3. Crear un archivo `.env` en la raíz del proyecto y define las siguientes variables de entorno:
    ```env
    PORT= Puerto que se desea exponer el servidor (por defecto se expone el 3000)
    JWT_SECRET_KEY= Cualquier clave.
    TMDB_TOKEN= Tu token acceso de TMDB, sí se usa la KEY en vez del token la API de TMDB rechazará las requests.
    ```

## Ejecutar la API
Para iniciar el servidor, ejecuta:
```bash
npm start
```

## Ejecutar el test del endpoint /api/movies/searchMovies
Para correr los tests, ejecutar:
```bash
npm test
```

## Postman

Puedes importar la colección de Postman desde el archivo [Endpoint Testing - CDS.postman_collection.json](https://github.com/dutra1243/Tecnica_NodeJS-CDS/blob/main/Endpoint%20Testing%20-%20CDS.postman_collection.json) incluido en el proyecto.
La colección tiene modelos de todos los requests que se pueden hacer a la API. Cuando se haga el register y el login se debe inserter el token de autenticación a la colección, una vez todas las requests que lo necesitan están seteadas para heredar la autenticación de la carpeta padre.


