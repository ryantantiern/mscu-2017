---
sectionclass: h2
sectionid: web-fw
parent-id: research
is-parent: yes
number: 4100
title: 1. Web Framework
---
[Web Frameworks](https://en.wikipedia.org/wiki/Web_framework) simplify the task of building a website or web API by pre-formatting the common functionalities usually found in these structures such as HTTP Requests and Responses, Routing, MVC Design Pattern, Database Connection, Middleware, Authentication, Security and much more. Because of time constraints, we considered frameworks that we already had prior knowledge to reduce time spent learning them.

<a href="https://laravel.com/"><img src="{{ site.url }}/img/laravel-logo.png" alt="laravel-logo" style="width: 300px; height: 100px;"></a>
<b>[Laravel](https://laravel.com/)</b> is a popular PHP Web Framework. 

Its advantages include its active and growing community, quick and functional core, it is well documented, easily integratable since most hosting servers support PHP, its out of the box support for unit tests and PostgreSQL, a availability of mature extended libraries using Composer and Packagist, Eloquent ORM support and Migrations for database support. 

Its disadvantages include ships with unnecessary functionality making the file structure occupy more space, supports much less databases, does not have an official IDE and is slower to develop in. 


<a href="https://www.djangoproject.com/"><img src="{{ site.url }}/img/django-logo.png" alt="django-logo" style="width: 300px; height: 100px;"></a>

<b>[Django](https://www.djangoproject.com/)</b> is a popular Python Framework. Its advantages include it comes with an admin table out of the box, it has auto generated forms for models with validation, authentication system, PIP Package Manager, great for GIS applications, serialization of Django models and growing and active community. 

Its disadvantages include slow startup time, confusing Python syntax (as compared to C++/Java similar languages) and lack of knowledge on Python.

### Result

It was difficult to make a decision since both Web Frameworks were very similar in nature. We chose Laravel because it is easier to extend it with services such as E-Mail protocols, OAuth2 Socialite, PHP Redis and Laravel Passport much more. We found out that it is also more suitable for beginner to intermediate web developers since we were all new to API Development. Though Laravel is slower to develop in, the our requirements for the web API are small so the development time will still be short. Laravel also has routing support for APIs with built in user authentication. 


Sources: [Laravel](https://laravel.com), [Django](https://www.djangoproject.com/), [Django vs Laravel vs Rails](http://www.findalltogether.com/post/django-vs-laravel-vs-rails/), [Why did I Embrace Laravel](https://www.toptal.com/laravel/why-i-decided-to-embrace-laravel), [Laravel vs. Django](http://vschart.com/compare/laravel/vs/django-framework)