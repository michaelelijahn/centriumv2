export default function useProjectOverview(project, displayCount) {
	let modifiedTeamMembers;

	if (project.assignTo.length <= displayCount || project.assignTo.length - displayCount === 1) {
		modifiedTeamMembers = project.assignTo;
	} else {
		modifiedTeamMembers = project.assignTo.filter((m, index) => index < displayCount);
	}

	return { modifiedTeamMembers };
}
