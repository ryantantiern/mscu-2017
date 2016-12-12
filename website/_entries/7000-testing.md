---
sectionclass: h1
sectionid: testing 
is-parent: yes
number: 7000
title: Testing
---
Discussion of testing

Initial strategies for testing, demonstrate functionality that meets requirement, Experiement log : Experiment log

## Experiment Log
<div class="container" style="overflow-x: auto">
	<table border="1">
		<thead>
			<th>No.</th>
			<th>Title</th>
			<th>Details</th>
			<th>Result</th>
			<th>Success</th>
			<th>Done By</th>
			<th>Date</th>
		</thead>
		<tbody>

		{% for data in site.data.experiment-log %}
			<tr>
				<td>{{ data.expno }}</td>
				<td>{{ data.title }}</td>
				<td>{{ data.details }}</td>
				<td>{{ data.result }}</td>
				<td>{{ data.success }}</td>
				<td>{{ data.done_by }}</td>
				<td>{{ data.date }}</td>
			</tr>
		{% endfor %} 
		
		</tbody>
	</table>
</div>

