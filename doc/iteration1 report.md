**Report on the evaluation of the iteration plan**
==================================================
**Elaboration Phase**
-----------------------
- Technology Study
    - Spring
    
    >- Spring MVC
    >>- In Spring’s approach to building web sites, HTTP requests are handled by a controller. You can easily identify these requests by the @Controller annotation. 
    >>- The @RequestMapping annotation ensures that HTTP requests to /greeting are mapped to the greeting() method.
    >>- @RequestParam binds the value of the query String parameter name into the name parameter of the greeting() method. This query String parameter is not required; if it is absent in the request, the defaultValue of "World" is used. The value of the name parameter is added to a Model object, ultimately making it accessible to the view template.
    >>- The implementation of the method body relies on a view technology, in this case Thymeleaf, to perform server-side rendering of the HTML. Thymeleaf parses the greeting.html template below and evaluates the th:text expression to render the value of the ${name} parameter that was set in the controller.
    >>- A common feature of developing web apps is coding a change, restarting your app, and refreshing the browser to view the change. This entire process can eat up a lot of time. To speed up the cycle of things, Spring Boot comes with a handy module known as spring-boot-devtools.

    >- Spring boot
    >>- Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can "just run". We take an opinionated view of the Spring platform and third-party libraries so you can get started with minimum fuss. Most Spring Boot applications need very little Spring configuration    
    - AngularJS 

- Code
   - backend
   - frontend       
        -  see them in /src
    