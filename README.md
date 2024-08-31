# NestJS + Microservicios

## Intro

### Arquitectura monolítica

Toda la aplicación se desarrolla, construye y despliega como una sola unidad. Esto significa que todas las funcionalidades, componentes y servicios de la aplicación están interconectados y comparten una base de código común.

- **Pros**:
  - Cero latencia: comunicación instantánea entre sus partes
  - Desplegar todo en un solo servidor o contenedor
- **Cons**:
  - En caso de un bug o actualización, será necesario volver a realizar un nuevo despligue de toda la app
  - Un módulo podría generar mucho "estrés" requiriendo escalamiento vertical (hardware) para toda la app

### Microservicios

- **Pros**:
  - Todos los MS son independientes, escalables y distribuídos
  - En caso que un MS comienza a presentar mucho "estrés" se puede realizar una escalmiento horizontal (agregas copias y balanceador de carga) para atender correctamente la demanda actual
  - Pueden estar escritos en múltiples lenguajes y comunicarse mediante REST u otro canal de comunicación
- **Cons**:
  - Al tener muchos MS y no contar con una buena estructura, podría ser difícil encontrar información puntual
  - Se incrementa la latencia
  - Hay más punto de entradas que tienen que ser validados

## Tipos de transportes

- **HTTP/HTTPS**: Restful
- **gRPC**: Protocolo de buffers creado por Google
- **Queues o colas**: Mensajería tipo oficina postal,
  ejemplos como RabbitMQ, Apache Kafka y
  Amazon SQS
- **Flujo de eventos (Streams)**: Eventos pueden
  ser consumidos por multiples microservicios
  interesados. Ejemplos como Apache Kafka,
  Apache Pulsar y AWS Kinesis
- **TCP/UDP**: Eficiente comunicación entre
  equipos en el cuarta capa del modelo OSI,
  confiable y ordenada

## Gateway

Se podría entender como un típico RESTful api pero con la diferencia que no contiene conexiones a bases de datos, ya que su única responsabilidad es conectar las peticiones del cliente con el respectivo microservicio.

![Microservicios](/public/image.png)

## Buenas prácticas

- Descomposición adecuada (responsabilidad única y tamaño adecuado) para fácil mantenimiento
- Crecer de forma independiente
- Autonomía (si el MS A falla el MS B debe seguir funcionando)
- Comunicación asíncrona
- Escalamiento y despliegue independiente (si el MS A crece no debería afectar al MS B)
- Tolerancia a errores
- Recuperación automática
- Seguridad de manera independiente (autenticación, autorización, cifrado, etc.)
- Evitar el acoplamiento excesivo y dependencia entre ellos

## Patrones

- [Request-Response](https://docs.nestjs.com/microservices/basics#request-response): los mensajes estilo solicitud-respuesta son utiles cuando se necesita intercambiar mensajes entre varios servicios externos. Con este paradigma, puede estar seguro de que el servicio ha recibido realmente el mensaje. Estos pueden responder de manera sincrónica o asincrónica.

- [Event-based](https://docs.nestjs.com/microservices/basics#event-based): si bien el método de solicitud-respuesta es ideal para intercambiar mensajes entre servicios, es menos adecuado cuando el estilo del mensaje se basa en _eventos_, es decir, cuando solo desea publicar eventos sin esperar una respuesta, por ejemplo, cuando solo se desea notificar a otro servicio que se ha producido determinada acción en otra parte de la app.

## [NATS](https://nats.io/) (Broker)

Actúa como el sistema nervioso central para aplicaciones distribuidas (Microservicios), soportando transmisión de datos en tiempo real y balanceo de carga.

- Trabaja con mensajería tipo publicar y suscribir
- Hay temas (topics/subjects) a los cuales se escucha
- Puede tener múltiples escuchas (listeners) al mismo topic
- Pensado en para escalamiento horizontal
- Seguridad, balanceo de carga incluído
- Payload agnóstico
- Rápido y eficiente

![NATS](/public/image2.png)

**Levantar NATS en Docker de manera rápida:**

```shell
docker run -d --name nats-main -p 4222:4222 -p 8222:8222 nats
```

**Comandos Docker:**

- Levantar compose: `docker compose up --build` o `docker compose -f <archivo_docker> up`
- Construir imagen: `docker compose -f <archivo_docker> build`
- Remover imagen: `docker compose -f <archivo_docker> down`

## Kubernetes y Helm

**Kubernetes** permite a los desarrolladores desplegar, actualizar y administrar aplicaciones de manera eficiente, proporcionando herramientas para la gestión de recursos, el balanceo de carga, la auto curación y la escalabilidad horizontal.

![Cluster](/public/image3.png)

- **Master Node**: controla toda la infraestructura siendo el más importante y puede tener réplicas. Cuenta con 4 piezas fundamentales:

  - API Server (administración)
  - Controller Manager (sabe lo que pasa)
  - Scheduler (asegura el cambio de PODs)
  - ETCD (almacenamiento en key:value)

- **Worker Nodes**: es donde se realiza el proceso de la app, el cual esta relacionado a un proceso llamado _Kublets_.

  - Kublets: proceso corriendo que permite la comunicación entre cluster

- **PODs**: pequeña unidad efímera (que se destruye constantemente, por ejemplo, cuando se actualiza o cambia la imagen) que cuenta con su propia IP estática e id único.

- **Secrets**: son valores en base64 que se configuran para no tener expuestos sus valores en archivos (yaml) o repositorios.

![Services](/public/image4.png)

**Crear deployment**

```shell
kubectl create deployment <nombre> --image=<registro/url/imagen> --dry-run=client -o yaml > deployment.yml
```

**Crear service**

```shell
kubectl create service clusterip <nombre> --tcp=<8888> --dry-run=client -o yaml > service.yml
kubectl create service nodeport <nombre> --tcp=<3000> --dry-run=client -o yaml > service.yml
```

- **clusterip**: solo se puede acceder desde dentro del cluster
- **nodeport**: se puede acceder desde fuera del cluster

**Comandos Helm**

- Crear configuración: `helm create <nombre>`
- Aplicar configuración inicial: `helm install <nombre> .`
- Aplicar actualizaciones: `helm upgrade <nombre> .`

**Comandos Kubernetes**

- Obtener PODs, deployments y services: `kubectl get <pods | deployments | services>`
- Revisar todos los PODs: `kubectl describe pods`
- Revisar un POD: `kubectl describe pod <nombre>`
- Eliminar POD: `kubectl delete pod <nombre>`
- Revisar logs: `kubectl logs <nombre>`
- Obtener los secretos: `kubectl get secrets`
- Ver el contenido de un secreto: `kubectl get secrets <nombre> -o yaml`

**_Créditos_**

👉 [https://cursos.devtalles.com/courses/nestjs-microservicios](https://cursos.devtalles.com/courses/nestjs-microservicios)
