---
sectionclass: h2
sectionid: initial_requirements
is-parent: No
parent-id: requirements
number: 2100
title: MoSCoW Requirements
---
<div class="container" style="overflow-x: auto">
	<table border="1">
		<thead>
			<th>ID</th>
			<th>Description</th>
			<th>Type</th>
			<th>Priority</th>
		</thead>
		<tbody>
		{% for data in site.data.moscow %}
			<tr>
				<td>{{ data.id }}</td>
				<td>{{ data.description }}</td>
				<td>{{ data.category }}</td>
				<td>{{ data.priority }}</td>
			</tr>
		{% endfor %} 
				
		</tbody>
	</table>
</div>
