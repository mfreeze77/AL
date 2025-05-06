import * as React from 'react';
import { useState } from 'react';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import styles from './ProjectCard.module.scss';
// Define colors for different labor categories
const LABOR_COLORS = {
    "Project Engineering": "#2563eb",
    "Design Engineering": "#7c3aed",
    "Software Engineering": "#db2777",
    "Startup & Checkout": "#ea580c",
    "Electrical Install": "#059669",
    "Pneumatic Install": "#0891b2"
};
const CustomTooltip = ({ active, payload, label, isCumulative, data }) => {
    if (active && payload && payload.length) {
        const quarterData = data.find(d => d.quarter === label);
        return (React.createElement("div", { className: styles.chartTooltip },
            React.createElement("div", { className: styles.chartTooltipTitle }, label),
            payload.map((entry, index) => (entry.value > 0 && (React.createElement("div", { key: index, style: { color: entry.color } },
                entry.name,
                ": ",
                entry.value.toFixed(1),
                " hrs")))),
            (quarterData === null || quarterData === void 0 ? void 0 : quarterData.key_activities) && (React.createElement("div", { className: styles.chartTooltipActivities },
                React.createElement("strong", null, "Key Activities:"),
                React.createElement("ul", null, quarterData.key_activities.map((activity, index) => (React.createElement("li", { key: index }, activity))))))));
    }
    return null;
};
// Workaround for TypeScript errors with Recharts components
const SafeXAxis = XAxis;
const SafeYAxis = YAxis;
const SafeBar = Bar;
const SafeArea = Area;
const ProjectCharts = ({ data }) => {
    const [activeTab, setActiveTab] = useState('distribution');
    return (React.createElement("div", { className: styles.chartSection },
        React.createElement("h2", { className: styles.sectionTitle },
            React.createElement(FontIcon, { iconName: "LineChart" }),
            "Labor Analysis"),
        React.createElement("div", { className: styles.tabs },
            React.createElement("button", { className: `${styles.tab} ${activeTab === 'distribution' ? styles.active : ''}`, onClick: () => setActiveTab('distribution') },
                React.createElement(FontIcon, { iconName: "BarChart4" }),
                "Labor Distribution"),
            React.createElement("button", { className: `${styles.tab} ${activeTab === 'trend' ? styles.active : ''}`, onClick: () => setActiveTab('trend') },
                React.createElement(FontIcon, { iconName: "TrendActivity" }),
                "Progress Trend")),
        React.createElement("div", { className: styles.chartContainer },
            React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, activeTab === 'distribution' ? (React.createElement(BarChart, { data: data },
                React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                React.createElement(SafeXAxis, { dataKey: "quarter" }),
                React.createElement(SafeYAxis, { label: { value: 'Hours', angle: -90, position: 'insideLeft' } }),
                React.createElement(Tooltip, { content: (props) => React.createElement(CustomTooltip, Object.assign({}, props, { data: data })) }),
                React.createElement(Legend, null),
                Object.keys(LABOR_COLORS).map((key) => (React.createElement(SafeBar, { key: key, dataKey: key, stackId: "a", fill: LABOR_COLORS[key] }))))) : (React.createElement(AreaChart, { data: data, stackOffset: "expand" },
                React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
                React.createElement(SafeXAxis, { dataKey: "quarter" }),
                React.createElement(SafeYAxis, { label: { value: 'Proportion', angle: -90, position: 'insideLeft' } }),
                React.createElement(Tooltip, { content: (props) => React.createElement(CustomTooltip, Object.assign({}, props, { isCumulative: true, data: data })) }),
                React.createElement(Legend, null),
                Object.keys(LABOR_COLORS).reverse().map((key) => (React.createElement(SafeArea, { key: key, type: "monotone", dataKey: key, stackId: "1", stroke: LABOR_COLORS[key], fill: LABOR_COLORS[key] })))))))));
};
export const ProjectCard = (props) => {
    const { projectNumber, title, businessName, estimatedRevenue, projectType, serviceType, startDate, endDate, progress: providedProgress, laborHours, laborTimeline, milestones, className } = props;
    // Calculate progress if not provided
    const calculateProgress = () => {
        if (providedProgress !== undefined) {
            return providedProgress;
        }
        const now = new Date();
        const totalTime = endDate.getTime() - startDate.getTime();
        const elapsed = now.getTime() - startDate.getTime();
        return Math.max(0, Math.min(100, (elapsed / totalTime) * 100));
    };
    const progress = calculateProgress();
    const totalHours = Object.values(laborHours).reduce((acc, h) => acc + h, 0);
    // Aggregate labor hours into categories
    const categories = {
        "Engineering": (laborHours["Project Engineering"] || 0) +
            (laborHours["Design Engineering"] || 0) +
            (laborHours["Software Engineering"] || 0),
        "Installation": (laborHours["Electrical Install"] || 0) +
            (laborHours["Pneumatic Install"] || 0),
        "Startup": laborHours["Startup & Checkout"] || 0
    };
    return (React.createElement("div", { className: `${styles.projectCard} ${className || ''}` },
        React.createElement("div", { className: styles.header },
            React.createElement("div", { className: styles.projectInfo },
                React.createElement("h1", null, title),
                React.createElement("h2", null, projectNumber)),
            React.createElement("div", { className: styles.projectStatus },
                React.createElement("div", { className: styles.projectDates },
                    React.createElement(FontIcon, { iconName: "Calendar" }),
                    startDate.toLocaleDateString(),
                    " - ",
                    endDate.toLocaleDateString()),
                React.createElement("div", { className: styles.progressContainer },
                    React.createElement("div", { className: styles.progressBar },
                        React.createElement("div", { className: styles.progressFill, style: { width: `${progress.toFixed(1)}%` } })),
                    React.createElement("div", { className: styles.progressLabel },
                        "Project Progress: ",
                        progress.toFixed(1),
                        "%")))),
        React.createElement("div", { className: styles.infoGrid },
            React.createElement("div", { className: styles.infoCard },
                React.createElement("h3", null,
                    React.createElement(FontIcon, { iconName: "Building" }),
                    "Business Name"),
                React.createElement("p", null, businessName)),
            React.createElement("div", { className: styles.infoCard },
                React.createElement("h3", null,
                    React.createElement(FontIcon, { iconName: "Money" }),
                    "Estimated Revenue"),
                React.createElement("p", null, estimatedRevenue)),
            React.createElement("div", { className: styles.infoCard },
                React.createElement("h3", null,
                    React.createElement(FontIcon, { iconName: "TaskManager" }),
                    "Project Type"),
                React.createElement("p", null, projectType && serviceType
                    ? `${projectType} | ${serviceType}`
                    : projectType || serviceType || 'N/A'))),
        React.createElement(ProjectCharts, { data: laborTimeline }),
        React.createElement("div", { className: styles.summarySection },
            React.createElement("h2", { className: styles.sectionTitle },
                React.createElement(FontIcon, { iconName: "PieDouble" }),
                "Labor Distribution"),
            React.createElement("div", { className: styles.summaryGrid },
                React.createElement("div", { className: styles.summaryItem },
                    React.createElement("strong", null,
                        React.createElement(FontIcon, { iconName: "TriangleShapeUp" }),
                        "Engineering"),
                    React.createElement("div", { className: styles.hours }, categories.Engineering.toFixed(1)),
                    React.createElement("div", { className: styles.percent },
                        ((categories.Engineering / totalHours) * 100).toFixed(1),
                        "%",
                        React.createElement("div", { className: styles.percentBar },
                            React.createElement("div", { className: styles.percentFill, style: { width: `${(categories.Engineering / totalHours) * 100}%` } })))),
                React.createElement("div", { className: styles.summaryItem },
                    React.createElement("strong", null,
                        React.createElement(FontIcon, { iconName: "Installation" }),
                        "Installation"),
                    React.createElement("div", { className: styles.hours }, categories.Installation.toFixed(1)),
                    React.createElement("div", { className: styles.percent },
                        ((categories.Installation / totalHours) * 100).toFixed(1),
                        "%",
                        React.createElement("div", { className: styles.percentBar },
                            React.createElement("div", { className: styles.percentFill, style: { width: `${(categories.Installation / totalHours) * 100}%` } })))),
                React.createElement("div", { className: styles.summaryItem },
                    React.createElement("strong", null,
                        React.createElement(FontIcon, { iconName: "Rocket" }),
                        "Startup"),
                    React.createElement("div", { className: styles.hours }, categories.Startup.toFixed(1)),
                    React.createElement("div", { className: styles.percent },
                        ((categories.Startup / totalHours) * 100).toFixed(1),
                        "%",
                        React.createElement("div", { className: styles.percentBar },
                            React.createElement("div", { className: styles.percentFill, style: { width: `${(categories.Startup / totalHours) * 100}%` } })))))),
        React.createElement("div", { className: styles.milestones },
            React.createElement("h2", { className: styles.sectionTitle },
                React.createElement(FontIcon, { iconName: "Flag" }),
                "Key Milestones"),
            React.createElement("div", { className: styles.milestoneGrid }, milestones.map((milestone) => (React.createElement("div", { key: milestone.id, className: `${styles.milestoneCard} ${styles[milestone.type]}` },
                React.createElement("div", { className: styles.milestoneDate },
                    React.createElement(FontIcon, { iconName: "Calendar" }),
                    milestone.date.toLocaleDateString()),
                React.createElement("div", { className: styles.milestoneName }, milestone.name))))))));
};
export default ProjectCard;
//# sourceMappingURL=ProjectCard.js.map