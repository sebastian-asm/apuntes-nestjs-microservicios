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

---

**_Créditos_**

👉 [https://cursos.devtalles.com/courses/nestjs-microservicios](https://cursos.devtalles.com/courses/nestjs-microservicios)
