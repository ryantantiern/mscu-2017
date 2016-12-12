---
sectionclass: h2
sectionid: exp-log
is-parent: No
parent-id: exp-testing
number: 5100
title: Experiment Log
---
<div class="container" style="overflow-x: auto">
	<table border="1">
		<thead>
			<th>Exp no.</th>
			<th>Title</th>
			<th>Details</th>
			<th>Results</th>
			<th>Success</th>
			<th>Done by</th>
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
