import * as React from 'react';
import { useState } from 'react';
import { FontIcon } from '@fluentui/react/lib/Icon';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, TooltipProps
} from 'recharts';
import { IProjectCardProps, ILaborQuarter } from './IProjectCardProps';
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

interface CustomTooltipProps {
  isCumulative?: boolean;
  data: ILaborQuarter[];
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, isCumulative, data }) => {
  if (active && payload && payload.length) {
    const quarterData = data.find(d => d.quarter === label);
    return (
      <div className={styles.chartTooltip}>
        <div className={styles.chartTooltipTitle}>{label}</div>
        {payload.map((entry, index) => (
          entry.value > 0 && (
            <div key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)} hrs
            </div>
          )
        ))}
        {quarterData?.key_activities && (
          <div className={styles.chartTooltipActivities}>
            <strong>Key Activities:</strong>
            <ul>
              {quarterData.key_activities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Workaround for TypeScript errors with Recharts components
const SafeXAxis = XAxis as any;
const SafeYAxis = YAxis as any;
const SafeBar = Bar as any;
const SafeArea = Area as any;

const ProjectCharts: React.FC<{ data: ILaborQuarter[] }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'distribution' | 'trend'>('distribution');

  return (
    <div className={styles.chartSection}>
      <h2 className={styles.sectionTitle}>
        <FontIcon iconName="LineChart" />
        Labor Analysis
      </h2>
      
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'distribution' ? styles.active : ''}`}
          onClick={() => setActiveTab('distribution')}
        >
          <FontIcon iconName="BarChart4" />
          Labor Distribution
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'trend' ? styles.active : ''}`}
          onClick={() => setActiveTab('trend')}
        >
          <FontIcon iconName="TrendActivity" />
          Progress Trend
        </button>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'distribution' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <SafeXAxis dataKey="quarter" />
              <SafeYAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={(props: any) => <CustomTooltip {...props} data={data} />} />
              <Legend />
              {Object.keys(LABOR_COLORS).map((key) => (
                <SafeBar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={LABOR_COLORS[key as keyof typeof LABOR_COLORS]}
                />
              ))}
            </BarChart>
          ) : (
            <AreaChart data={data} stackOffset="expand">
              <CartesianGrid strokeDasharray="3 3" />
              <SafeXAxis dataKey="quarter" />
              <SafeYAxis label={{ value: 'Proportion', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={(props: any) => <CustomTooltip {...props} isCumulative={true} data={data} />} />
              <Legend />
              {Object.keys(LABOR_COLORS).reverse().map((key) => (
                <SafeArea
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={LABOR_COLORS[key as keyof typeof LABOR_COLORS]}
                  fill={LABOR_COLORS[key as keyof typeof LABOR_COLORS]}
                />
              ))}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ProjectCard: React.FC<IProjectCardProps> = (props) => {
  const {
    projectNumber,
    title,
    businessName,
    estimatedRevenue,
    projectType,
    serviceType,
    startDate,
    endDate,
    progress: providedProgress,
    laborHours,
    laborTimeline,
    milestones,
    className
  } = props;

  // Calculate progress if not provided
  const calculateProgress = (): number => {
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

  return (
    <div className={`${styles.projectCard} ${className || ''}`}>
      <div className={styles.header}>
        <div className={styles.projectInfo}>
          <h1>{title}</h1>
          <h2>{projectNumber}</h2>
        </div>
        <div className={styles.projectStatus}>
          <div className={styles.projectDates}>
            <FontIcon iconName="Calendar" />
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress.toFixed(1)}%` }}
              />
            </div>
            <div className={styles.progressLabel}>
              Project Progress: {progress.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <h3>
            <FontIcon iconName="Building" />
            Business Name
          </h3>
          <p>{businessName}</p>
        </div>
        <div className={styles.infoCard}>
          <h3>
            <FontIcon iconName="Money" />
            Estimated Revenue
          </h3>
          <p>{estimatedRevenue}</p>
        </div>
        <div className={styles.infoCard}>
          <h3>
            <FontIcon iconName="TaskManager" />
            Project Type
          </h3>
          <p>
            {projectType && serviceType 
              ? `${projectType} | ${serviceType}`
              : projectType || serviceType || 'N/A'}
          </p>
        </div>
      </div>

      {/* Charts section */}
      <ProjectCharts data={laborTimeline} />

      <div className={styles.summarySection}>
        <h2 className={styles.sectionTitle}>
          <FontIcon iconName="PieDouble" />
          Labor Distribution
        </h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <strong>
              <FontIcon iconName="TriangleShapeUp" />
              Engineering
            </strong>
            <div className={styles.hours}>{categories.Engineering.toFixed(1)}</div>
            <div className={styles.percent}>
              {((categories.Engineering / totalHours) * 100).toFixed(1)}%
              <div className={styles.percentBar}>
                <div 
                  className={styles.percentFill} 
                  style={{ width: `${(categories.Engineering / totalHours) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className={styles.summaryItem}>
            <strong>
              <FontIcon iconName="Installation" />
              Installation
            </strong>
            <div className={styles.hours}>{categories.Installation.toFixed(1)}</div>
            <div className={styles.percent}>
              {((categories.Installation / totalHours) * 100).toFixed(1)}%
              <div className={styles.percentBar}>
                <div 
                  className={styles.percentFill} 
                  style={{ width: `${(categories.Installation / totalHours) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className={styles.summaryItem}>
            <strong>
              <FontIcon iconName="Rocket" />
              Startup
            </strong>
            <div className={styles.hours}>{categories.Startup.toFixed(1)}</div>
            <div className={styles.percent}>
              {((categories.Startup / totalHours) * 100).toFixed(1)}%
              <div className={styles.percentBar}>
                <div 
                  className={styles.percentFill} 
                  style={{ width: `${(categories.Startup / totalHours) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.milestones}>
        <h2 className={styles.sectionTitle}>
          <FontIcon iconName="Flag" />
          Key Milestones
        </h2>
        <div className={styles.milestoneGrid}>
          {milestones.map((milestone) => (
            <div 
              key={milestone.id} 
              className={`${styles.milestoneCard} ${styles[milestone.type]}`}
            >
              <div className={styles.milestoneDate}>
                <FontIcon iconName="Calendar" />
                {milestone.date.toLocaleDateString()}
              </div>
              <div className={styles.milestoneName}>{milestone.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;