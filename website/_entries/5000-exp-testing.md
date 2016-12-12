---
sectionclass: h1
sectionid: exp-testing
is-parent: yes
number: 5000
title: Experiments & Testing
---
## Testing Strategies
Sources: [Google Testing Blog](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html), [AngularJS](https://docs.angularjs.org/guide/unit-testing), [Laravel](https://laravel.com/docs/5.3/testing#environment), [Github/Ligurio](https://github.com/ligurio/free-software-testing-books/blob/master/free-software-testing-books.md), [Ashteya Biharisingh](http://gonehybrid.com/how-to-write-automated-tests-for-your-ionic-app-part-1/)

### Unit Testing
Unit testing takes a small piece of code and test it in isolation. They create an ideal feedback loop. Unit tests are beneficial because they are <b>fast</b>, <b>reliable</b> and <b>isolates the failure</b>

Ionic as an AngularJS based framework
[Angularjs.org](https://docs.angularjs.org/guide/unit-testing) suggests the use [Jasmine](https://jasmine.github.io/1.3/introduction.html) beharioural driven development framework together with [Karma](https://karma-runner.github.io/1.0/index.html) JavaScript command line tool to run unit tests.  

Laravel as a PHP Framework
[Laravel](https://laravel.com/docs/5.3/testing) comes with out of the box PHPUnit set up. Along with the Artisan Command line, it is the ideal way of testing the Web APIs. 

### Integration Testing
An Integration test takes a small group of units and tests their behaviour as a whole, verifying that they coherently work together. This can be done by grouping components that have passed unit tests into a large component. 

### Functional Testing
Functional testing checks that the behavior of the system under consideration matches expected functionality derived from our requirements. We will use XCode Emulator to emulate the iOS environment, and if it passes then we will use [Ionic View](https://itunes.apple.com/us/app/ionic-view/id849930087?mt=8) to test on a real iPhone.

### Automated Testing
We plan to use [Ashteya Biharisingh](http://gonehybrid.com/how-to-write-automated-tests-for-your-ionic-app-part-1/) guide for Ionic automated testing and [Laravel](https://laravel.com/docs/5.3/testing#environment) for Laravel automated testing.

<div class="container">
	<hr>
</div>