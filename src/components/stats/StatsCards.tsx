import React from 'react';
import { TrendingUp, Calendar, Clock, Target } from 'lucide-react';
import type { Application } from '../../types/application';
import { getApplicationStats } from '../../utils/helpers';

interface StatsCardsProps {
  applications: Application[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ applications }) => {
  const stats = getApplicationStats(applications);

  const getColorClasses = (color: string) => {
    const colorClassMap: Record<string, { bg: string; text: string }> = {
      'blue': { bg: 'bg-blue-100', text: 'text-blue-600' },
      'green': { bg: 'bg-green-100', text: 'text-green-600' },
      'purple': { bg: 'bg-purple-100', text: 'text-purple-600' },
      'orange': { bg: 'bg-orange-100', text: 'text-orange-600' }
    };
    return colorClassMap[color] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  const cards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: Calendar,
      color: 'blue',
      description: 'All time applications'
    },
    {
      title: 'Response Rate',
      value: `${stats.responseRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'green',
      description: 'Companies that responded'
    },
    {
      title: 'Interview Rate',
      value: `${((stats.byStatus['1st Interview'] || 0) / Math.max(stats.total, 1) * 100).toFixed(1)}%`,
      icon: Clock,
      color: 'purple',
      description: 'Applications to interviews'
    },
    {
      title: 'Offer Rate',
      value: `${stats.offerRate.toFixed(1)}%`,
      icon: Target,
      color: 'orange',
      description: 'Applications to offers'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const colors = getColorClasses(card.color);
        return (
          <div key={index} className="card p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 ${colors.bg} rounded-lg`}>
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground truncate">
                  {card.title}
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;