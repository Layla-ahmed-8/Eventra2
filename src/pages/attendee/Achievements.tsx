import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Trophy, Star, Lock, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const mockBadges = [
  { id: 1, name: 'First Event', icon: '🎉', description: 'Attended your first event', earned: true, xp: 50 },
  { id: 2, name: 'Social Butterfly', icon: '🦋', description: 'RSVPed to 10 events', earned: true, xp: 100 },
  { id: 3, name: 'Community Member', icon: '👥', description: 'Joined your first community', earned: true, xp: 50 },
  { id: 4, name: 'Early Bird', icon: '🐦', description: 'Booked a ticket 1 month in advance', earned: false, xp: 75 },
  { id: 5, name: 'Party Animal', icon: '🎊', description: 'Attended 25 events', earned: false, xp: 250 },
  { id: 6, name: 'VIP Member', icon: '⭐', description: 'Purchased 5 VIP tickets', earned: false, xp: 200 },
  { id: 7, name: 'Explorer', icon: '🗺️', description: 'Attended events in 5 different venues', earned: false, xp: 150 },
  { id: 8, name: 'Music Lover', icon: '🎵', description: 'Attended 10 music events', earned: false, xp: 100 },
];

export default function Achievements() {
  const { currentUser } = useAppStore();

  if (!currentUser) {
    return <div>Not logged in</div>;
  }

  const earnedBadges = mockBadges.filter((b) => b.earned);
  const lockedBadges = mockBadges.filter((b) => !b.earned);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link to="/app/profile" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
            <p className="text-sm text-muted-foreground">Your progress, badges, and reward path.</p>
          </div>
          <Link
            to="/app/rewards/store"
            className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition"
          >
            <Sparkles className="w-4 h-4" />
            Visit Reward Store
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Level & XP Card */}
        <div className="bg-gradient-to-br from-primary to-[#00C2FF] rounded-2xl shadow-lg p-6 sm:p-8 text-white mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
              <Trophy className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-h1 font-bold mb-1">Level {currentUser.level}</h2>
              <p className="text-white/90 mb-4 text-body">
                {currentUser.xp.toLocaleString()} XP · {earnedBadges.length} badges earned
              </p>
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-white/50 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((currentUser.xp / ((currentUser.level + 1) * 200)) * 100, 100)}%` }}
                />
              </div>
              <p className="text-caption text-white/80 mt-2">
                {Math.max(0, (currentUser.level + 1) * 200 - currentUser.xp).toLocaleString()} XP to next level
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="surface-panel p-4 sm:p-6 text-center">
            <Award className="w-7 h-7 text-primary mx-auto mb-2" />
            <p className="text-h2 font-bold text-foreground">{earnedBadges.length}</p>
            <p className="text-caption text-muted-foreground">Badges Earned</p>
          </div>
          <div className="surface-panel p-4 sm:p-6 text-center">
            <Star className="w-7 h-7 text-orange-500 mx-auto mb-2" />
            <p className="text-h2 font-bold text-foreground">{currentUser.xp}</p>
            <p className="text-caption text-muted-foreground">Total XP</p>
          </div>
          <div className="surface-panel p-4 sm:p-6 text-center">
            <Trophy className="w-7 h-7 text-cyan-500 mx-auto mb-2" />
            <p className="text-h2 font-bold text-foreground">{currentUser.level}</p>
            <p className="text-caption text-muted-foreground">Current Level</p>
          </div>
          <div className="surface-panel p-4 sm:p-6 text-center">
            <Lock className="w-7 h-7 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-h2 font-bold text-foreground">{lockedBadges.length}</p>
            <p className="text-caption text-muted-foreground">To Unlock</p>
          </div>
        </div>

        {/* Earned Badges */}
        <div className="mb-8">
          <h2 className="text-h2 font-bold text-foreground mb-4">Earned Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="surface-panel p-4 sm:p-6 text-center hover:-translate-y-1 transition-transform">
                <div className="text-4xl sm:text-5xl mb-3">{badge.icon}</div>
                <h3 className="text-body-sm font-bold text-foreground mb-1">{badge.name}</h3>
                <p className="text-caption text-muted-foreground mb-3">{badge.description}</p>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-caption font-semibold">
                  <Star className="w-3 h-3" />
                  {badge.xp} XP
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Locked Badges */}
        <div>
          <h2 className="text-h2 font-bold text-foreground mb-4">Locked Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {lockedBadges.map((badge) => (
              <div key={badge.id} className="surface-panel p-4 sm:p-6 text-center opacity-50">
                <div className="text-4xl sm:text-5xl mb-3 grayscale">{badge.icon}</div>
                <h3 className="text-body-sm font-bold text-foreground mb-1">{badge.name}</h3>
                <p className="text-caption text-muted-foreground mb-3">{badge.description}</p>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-full text-caption font-semibold">
                  <Lock className="w-3 h-3" />
                  {badge.xp} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
