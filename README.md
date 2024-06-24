**Docker**

2 port (rabbitMQ & UI management)

```
   docker pull rabbitmq:3-management
   docker run -d --name rabbitMQ -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

go to rabbitMQ bash

```
    docker exec -it rabbitMQ bash
    exit
```
