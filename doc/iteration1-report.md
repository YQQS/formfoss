**Report on the evaluation of the iteration plan**
==================================================
**Elaboration Phase**
-----------------------
- Technology Study
    - Spring
    
    >- Spring MVC
    >>- In Spring’s approach to building web sites, HTTP requests are handled by a controller. You can easily identify these requests by the @Controller annotation. 
    >>- The @RequestMapping annotation ensures that HTTP requests to /user/all are mapped to the getAll() method in userController.
    >>- @RequestParam binds the value of the query String parameter userName into the userName parameter of the search() method. This String parameter is not required in add() method; if it is absent in the request, the defaultValue is used. 
    >>- A common feature of developing web apps is coding a change, restarting your app, and refreshing the browser to view the change. This entire process can eat up a lot of time. To speed up the cycle of things, Spring Boot comes with a handy module known as spring-boot-devtools.

    >- Spring boot
    >>- Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can "just run". We take an opinionated view of the Spring platform and third-party libraries so you can get started with minimum fuss. Most Spring Boot applications need very little Spring configuration    

    - AngularJS 
        >- data binding
        >- dependency injection
        >- routing
        >- HTTP request

- Code
   - backend
   		-  implement model and controller
   - frontend       
        -  implement view
   look up them in /src
    
