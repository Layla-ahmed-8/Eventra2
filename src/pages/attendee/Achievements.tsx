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
        <div className="bg-gradient-to-br from-[#6C4CF1] to-[#00C2FF] rounded-2xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-card/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Trophy className="w-12 h-12" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">Level {currentUser.level}</h2>
              <p className="text-white/90 mb-4">
                {currentUser.xp} XP • {earnedBadges.length} badges earned
              </p>
              <div className="bg-card/20 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-card/40"
                  style={{
                    width: `${(currentUser.xp / ((currentUser.level + 1) * 200)) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm text-white/80 mt-2">
                {(currentUser.level + 1) * 200 - currentUser.xp} XP to next level
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl shadow-sm p-6 text-center">
            <Award className="w-8 h-8 text-[#6C4CF1] mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{earnedBadges.length}</p>
            <p className="text-muted-foreground">Badges Earned</p>
          </div>
          <div className="bg-card rounded-xl shadow-sm p-6 text-center">
            <Star className="w-8 h-8 text-[#FF8A00] mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{currentUser.xp}</p>
            <p className="text-muted-foreground">Total XP</p>
          </div>
          <div className="bg-card rounded-xl shadow-sm p-6 text-center">
            <Trophy className="w-8 h-8 text-[#00C2FF] mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{currentUser.level}</p>
            <p className="text-muted-foreground">Current Level</p>
          </div>
          <div className="bg-card rounded-xl shadow-sm p-6 text-center">
            <Lock className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{lockedBadges.length}</p>
            <p className="text-muted-foreground">To Unlock</p>
          </div>
        </div>

        {/* Earned Badges */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Earned Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-card border border-border rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover-lift transition-all"
              >
                <div className="text-5xl mb-3">{badge.icon}</div>
                <h3 className="font-bold text-foreground mb-1">{badge.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  <Star className="w-3 h-3" />
                  {badge.xp} XP
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Locked Badges */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Locked Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-card border border-border rounded-2xl shadow-lg p-6 text-center opacity-60"
              >
                <div className="text-5xl mb-3 filter grayscale">{badge.icon}</div>
                <h3 className="font-bold text-foreground mb-1">{badge.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-muted-foreground rounded-full text-sm font-semibold">
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
