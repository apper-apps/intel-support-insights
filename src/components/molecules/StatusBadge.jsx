import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const getStatusVariant = (status) => {
    const positiveStates = ["smooth_progress", "learning_effectively", "feature_exploring", "goal_achieved", "highly_engaged"];
    const neutralStates = ["building_actively", "iterating", "experimenting", "asking_questions"];
    const struggleStates = ["stuck", "confused", "repeating_issues", "frustrated", "going_in_circles"];
    const criticalStates = ["abandonment_risk", "completely_lost", "angry", "giving_up"];
    const helpStates = ["needs_guidance", "requesting_examples", "seeking_alternatives", "documentation_needed"];
    const technicalStates = ["debugging", "troubleshooting_db", "performance_issues", "integration_problems"];
    const specialStates = ["off_topic", "inactive", "testing_limits", "copy_pasting"];

    if (positiveStates.includes(status)) return "success";
    if (neutralStates.includes(status)) return "info";
    if (struggleStates.includes(status)) return "warning";
    if (criticalStates.includes(status)) return "error";
    if (helpStates.includes(status)) return "purple";
    if (technicalStates.includes(status)) return "indigo";
    if (specialStates.includes(status)) return "default";
    return "default";
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Badge variant={getStatusVariant(status)}>
      {formatStatus(status)}
    </Badge>
  );
};

export default StatusBadge;