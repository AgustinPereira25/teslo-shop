# Next.js TesloShop App (Spanish)
Para correr localmente se necesita la base de datos
...

docker-compose up -d
...

* El -d, significa __detached__

* MongoDB URL Local:

```
mongodb://localhost:27017/teslodb
```


## Configurar las variables de entorno

Renombrar el archivo __.env.template__ a __.env__


## Llenar la base de datos con información de pruebas

Llamar a:
``` 
http://localhost:3000/api/seed 

```

# Next.js OpenJira App (English)
In order to run localhost we need database
...

docker-compose up -d
...

* Parameter -d means __detached__


* MongoDB Local URL:

```
mongodb://localhost:27017/teslodb
```


## Configure environment variables

Rename file __.env.template__ to  __.env__


## Fill database with testing info 

Call:
``` 
http://localhost:3000/api/seed 

```


``` Made by Agustin Pereira. ``` 