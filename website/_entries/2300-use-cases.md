---
sectionclass: h2
sectionid: use-cases
parent-id: requirements
is-parent: yes
number: 2300
title: Use Cases
---

<div class="container">
	<hr>
	{% for data in site.data.use-cases %}
		<p><b>Use Case:</b> {{ data.uc }}</p>
		<p><b>Relevant ID:</b> {{ data.id }}</p>
		<p><b>Description:</b> {{ data.description }}</p>
		<p><b>Actors:</b> {{ data.actors }} </p>
		<p><b>Preconditions:</b> {{ data.precond }} </p>
		<p><b>Flow:</b> {{ data.flow }}</p>
		<br>
		<hr>
	{% endfor %} 
</div>
 