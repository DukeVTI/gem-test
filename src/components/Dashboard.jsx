import React, { useState, useEffect } from 'react';
import { 
  Trophy, Target, Users, Coins, Star, 
  Clock, Crown, Shield, Calendar, Gift, 
  Medal, Sparkles, Flame, ChevronRight,
  Heart, Zap, TrendingUp
} from 'lucide-react';

const DashboardCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-black/30 rounded-lg p-3 border border-purple-500/30">
    <div className="flex items-center space-x-2">
      <Icon className={`w-5 h-5 text-${color}-400`} />
      <div>
        <div className="text-xs text-purple-200">{title}</div>
        <div className="font-bold text-white">{value.toLocaleString()}</div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData] = useState({
    stats: {
      gemPoints: 1000,
      questTokens: 250,
      communityCredits: 500
    },
    dailyProgress: {
      questsDone: 2,
      questTarget: 3
    },
    socialTasks: [
      { id: 1, title: 'Follow on Twitter', reward: 50, type: 'GEM' },
      { id: 2, title: 'Join Discord', reward: 100, type: 'CC' },
      { id: 3, title: 'Share Referral', reward: 200, type: 'QT' }
    ],
    activeQuests: [
      {
        title: "Market Master",
        type: "Weekly Challenge",
        progress: 75,
        reward: "500 GP",
        timeLeft: "2 days"
      },
      {
        title: "Community Guide",
        type: "Achievement",
        progress: 60,
        reward: "Exclusive Badge",
        timeLeft: "Ongoing"
      }
    ]
  });

  useEffect(() => {
    const initDashboard = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
      }
    };

    initDashboard();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-black/40 rounded-xl border border-red-500/30 p-6 text-center max-w-sm w-full">
          <div className="text-red-400 mb-2">⚠️</div>
          <h1 className="text-xl font-bold text-red-400 mb-2">Error</h1>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white pb-20">
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-purple-900 to-indigo-900 border-b-2 border-purple-500/30">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
          Welcome to GemQuest
        </h1>
        <p className="text-purple-200 mb-6">Complete tasks to earn rewards</p>
        
        <div className="grid grid-cols-3 gap-3">
          <DashboardCard 
            title="Gem Points" 
            value={userData.stats.gemPoints}
            icon={Coins}
            color="yellow"
          />
          <DashboardCard 
            title="Quest Tokens" 
            value={userData.stats.questTokens}
            icon={Target}
            color="blue"
          />
          <DashboardCard 
            title="Community Credits" 
            value={userData.stats.communityCredits}
            icon={Users}
            color="green"
          />
        </div>
      </div>

      {/* Daily Progress */}
      <div className="p-4">
        <div className="bg-black/40 rounded-xl border border-purple-500/30 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center">
              <Flame className="w-5 h-5 text-orange-500 mr-2" />
              Daily Progress
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm text-purple-200">
                <span>Quests Completed</span>
                <span>{userData.dailyProgress.questsDone}/{userData.dailyProgress.questTarget}</span>
              </div>
              <div className="h-3 bg-purple-900/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(userData.dailyProgress.questsDone / userData.dailyProgress.questTarget) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Tasks */}
      <div className="p-4">
        <div className="bg-black/40 rounded-xl border border-purple-500/30 p-4">
          <h2 className="text-lg font-bold flex items-center mb-4">
            <Star className="w-5 h-5 text-yellow-400 mr-2" />
            Available Tasks
          </h2>
          <div className="space-y-3">
            {userData.socialTasks.map(task => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-purple-500/30"
              >
                <div>
                  <h3 className="font-medium text-purple-200">{task.title}</h3>
                  <p className="text-sm text-purple-300">
                    Reward: {task.reward} {task.type}
                  </p>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Quests */}
      <div className="p-4">
        <div className="bg-black/40 rounded-xl border border-purple-500/30 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center">
              <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
              Active Quests
            </h2>
            <button className="text-sm text-purple-300 font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {userData.activeQuests.map((quest, index) => (
              <div key={index} className="p-3 bg-black/30 rounded-lg border border-purple-500/30">
                <div className="flex justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-purple-200">{quest.title}</h3>
                    <p className="text-xs text-purple-300">{quest.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-200">{quest.reward}</p>
                    <p className="text-xs text-purple-300">{quest.timeLeft}</p>
                  </div>
                </div>
                <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${quest.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referral Section */}
      <div className="p-4">
        <div className="bg-black/40 rounded-xl border border-purple-500/30 p-4">
          <h2 className="text-lg font-bold flex items-center mb-4">
            <Gift className="w-5 h-5 text-pink-400 mr-2" />
            Refer Friends
          </h2>
          <p className="text-purple-200 mb-4">Share your referral link to earn rewards</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value="https://t.me/gemquest_bot?start=ref123"
              readOnly
              className="flex-1 p-2 bg-black/30 border border-purple-500/30 rounded-lg text-purple-200"
            />
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;