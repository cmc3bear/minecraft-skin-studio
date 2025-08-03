"""
Run the agent-review-pipeline planning system for Minecraft Skin Studio
"""

import sys
import os
import json
import asyncio
from datetime import datetime

# Add the agent-review-pipeline to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'agent-review-pipeline'))

try:
    from project_planner_system import ProjectPlannerSystem
    from planner_reviewer_integration import PlannerReviewerIntegration
except ImportError as e:
    print(f"Error importing planning system: {e}")
    print("Make sure you're running from the correct directory")
    sys.exit(1)


async def run_minecraft_skin_studio_planning():
    """Run comprehensive planning for Minecraft Skin Studio project"""
    
    # Project details
    project_info = {
        "name": "minecraft-skin-studio",
        "type": "web_application",
        "description": "AI-powered Minecraft skin creator for kids",
        "target_users": "children_7_12",
        "key_features": [
            "pixel_editor",
            "ai_assistance",
            "3d_preview",
            "safe_sharing",
            "educational"
        ],
        "technologies": [
            "react",
            "claude_api",
            "threejs",
            "canvas_api",
            "pwa"
        ],
        "special_requirements": [
            "coppa_compliance",
            "child_safety",
            "offline_capable",
            "tablet_optimized"
        ]
    }
    
    # Initialize the planning system
    planner_system = ProjectPlannerSystem()
    
    # Create comprehensive project plan
    print("🎯 Starting Minecraft Skin Studio Project Planning...")
    print("=" * 60)
    
    # Generate project plan
    project_plan = await planner_system.create_project_plan(
        project_name=project_info["name"],
        project_description=project_info["description"],
        requirements=[
            "Create kid-friendly Minecraft skin editor",
            "Integrate Claude AI for creative assistance",
            "Implement 3D preview system",
            "Ensure COPPA compliance",
            "Build offline-capable PWA",
            "Create comprehensive test suite",
            "Design parent control system"
        ],
        constraints=[
            "Must be usable by 7-year-olds",
            "No personal data collection",
            "Response time < 100ms for drawing",
            "Works on tablets and Chromebooks",
            "AI responses must be age-appropriate"
        ]
    )
    
    # Generate agent assignments
    print("\n📋 Generating Agent Assignments...")
    agent_assignments = await planner_system.assign_work(
        project_plan["work_breakdown"],
        available_agents=[
            "Cipher",          # Security
            "PixelPusher",     # Game/Graphics
            "Blueprint",       # Architecture
            "Lint",            # Code Quality
            "ASCII_Art",       # UI Design
            "Tensor",          # AI/ML
            "Portability",     # Cross-platform
            "Guardian",        # Web Security
            "FunOptimizer",    # User Experience
            "Dr. Paranoid",    # Security Review
            "Conductor"        # Change Management
        ]
    )
    
    # Generate milestones
    print("\n🏁 Creating Development Milestones...")
    milestones = await planner_system.create_milestones(
        project_name=project_info["name"],
        phases=["design", "implementation", "testing", "deployment"],
        timeline_days=90  # Placeholder - will be adjusted
    )
    
    # Generate test requirements
    print("\n🧪 Defining Test Requirements...")
    test_requirements = await planner_system.define_test_requirements(
        project_name=project_info["name"],
        test_types=["unit", "integration", "usability", "security", "accessibility"],
        special_focus=["child_usability", "ai_safety", "parent_controls"]
    )
    
    # Initialize the integration system for comprehensive review
    integration = PlannerReviewerIntegration()
    
    # Run integrated planning and review
    print("\n🔄 Running Integrated Planning & Review...")
    integrated_report = await integration.plan_and_review_project(
        project_name=project_info["name"],
        project_path=os.path.dirname(os.path.dirname(__file__)),
        requirements=[
            "Kid-friendly pixel editor with intuitive controls",
            "Claude AI integration with safety filters",
            "Real-time 3D skin preview",
            "Secure local storage with optional cloud sync",
            "Parent dashboard for monitoring and controls",
            "Export to Minecraft-compatible format",
            "50+ starter templates",
            "Offline mode for core features"
        ],
        constraints=[
            "COPPA compliant - no data collection from children",
            "All AI responses filtered for age-appropriateness",
            "Maximum 3 clicks to any feature",
            "Support for colorblind users",
            "Works on 2GB RAM devices",
            "No account required for basic features"
        ]
    )
    
    # Generate final report
    final_report = {
        "project": project_info,
        "planning_date": datetime.now().isoformat(),
        "project_plan": project_plan,
        "agent_assignments": agent_assignments,
        "milestones": milestones,
        "test_requirements": test_requirements,
        "integrated_analysis": integrated_report,
        "key_recommendations": [],
        "risk_assessment": [],
        "success_metrics": []
    }
    
    # Extract key recommendations
    if integrated_report and "recommendations" in integrated_report:
        final_report["key_recommendations"] = integrated_report["recommendations"]
    
    # Add project-specific success metrics
    final_report["success_metrics"] = [
        {
            "metric": "Time to First Skin",
            "target": "< 5 minutes",
            "measurement": "From app open to exported skin"
        },
        {
            "metric": "AI Helpfulness",
            "target": "80% positive feedback",
            "measurement": "User ratings of AI suggestions"
        },
        {
            "metric": "Safety Incidents",
            "target": "0 incidents",
            "measurement": "Inappropriate content or data exposure"
        },
        {
            "metric": "Parent Satisfaction",
            "target": "90% approval",
            "measurement": "Parent survey results"
        },
        {
            "metric": "Child Engagement",
            "target": "30 min average session",
            "measurement": "Time spent creating"
        }
    ]
    
    # Save the comprehensive report
    report_path = os.path.join(
        os.path.dirname(__file__),
        f"minecraft_skin_studio_plan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    )
    
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(final_report, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Planning complete! Report saved to: {report_path}")
    
    # Generate human-readable summary
    summary_path = report_path.replace('.json', '_summary.md')
    generate_planning_summary(final_report, summary_path)
    print(f"📄 Summary saved to: {summary_path}")
    
    return final_report


def generate_planning_summary(report: dict, output_path: str):
    """Generate a human-readable summary of the planning report"""
    
    summary = f"""# Minecraft Skin Studio - Development Plan Summary

Generated: {report['planning_date']}

## Project Overview
- **Name**: {report['project']['name']}
- **Type**: {report['project']['type']}
- **Description**: {report['project']['description']}
- **Target Users**: Children ages 7-12

## Key Features
"""
    
    for feature in report['project']['key_features']:
        summary += f"- {feature.replace('_', ' ').title()}\n"
    
    summary += "\n## Development Phases\n\n"
    
    if 'project_plan' in report and 'phases' in report['project_plan']:
        for phase in report['project_plan']['phases']:
            summary += f"### {phase['name']}\n"
            summary += f"**Duration**: {phase.get('duration', 'TBD')}\n"
            summary += f"**Key Deliverables**:\n"
            if 'deliverables' in phase:
                for deliverable in phase['deliverables']:
                    summary += f"- {deliverable}\n"
            summary += "\n"
    
    summary += "## Agent Assignments\n\n"
    
    if 'agent_assignments' in report:
        for assignment in report['agent_assignments']:
            summary += f"### {assignment['assigned_to']}\n"
            summary += f"**Task**: {assignment['task_description']}\n"
            summary += f"**Priority**: {assignment['priority']}\n\n"
    
    summary += "## Key Milestones\n\n"
    
    if 'milestones' in report:
        for milestone in report['milestones']:
            summary += f"- **{milestone['name']}**: {milestone.get('description', '')}\n"
    
    summary += "\n## Success Metrics\n\n"
    
    for metric in report['success_metrics']:
        summary += f"- **{metric['metric']}**: {metric['target']}\n"
    
    summary += "\n## Key Recommendations\n\n"
    
    if report['key_recommendations']:
        for rec in report['key_recommendations']:
            summary += f"- {rec}\n"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(summary)


if __name__ == "__main__":
    # Run the planning system
    asyncio.run(run_minecraft_skin_studio_planning())