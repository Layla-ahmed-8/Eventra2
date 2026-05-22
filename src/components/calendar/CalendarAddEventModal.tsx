import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, AlignLeft, CheckCircle2, Tag } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface InitialEvent {
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: { venue: string; address: string; city: string; isVirtual: boolean; virtualLink?: string | null };
  category?: string;
}

interface CalendarAddEventModalProps {
  onClose: () => void;
  initialDate?: string;
  initialEvent?: InitialEvent;
}

const CATEGORIES = ['General', 'Meeting', 'Workshop', 'Social', 'Task', 'Health', 'Education'];

export default function CalendarAddEventModal({ onClose, initialDate, initialEvent }: CalendarAddEventModalProps) {
  const { addPersonalEvent } = useAppStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(initialDate || new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState('60');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'personal' | 'reminder'>('personal');
  const [category, setCategory] = useState('General');

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDescription(initialEvent.description);
      const eventDate = new Date(initialEvent.date);
      setDate(eventDate.toISOString().slice(0, 10));
      setStartTime(eventDate.toTimeString().slice(0, 5));
      if (initialEvent.endDate) {
        const endDate = new Date(initialEvent.endDate);
        const diffMs = endDate.getTime() - eventDate.getTime();
        const diffMins = Math.round(diffMs / 60000);
        setDuration(diffMins.toString());
      }
      const loc = initialEvent.location;
      setLocation(loc.isVirtual ? (loc.virtualLink || 'Virtual') : `${loc.venue}, ${loc.city}`);
      if (initialEvent.category && CATEGORIES.includes(initialEvent.category)) {
        setCategory(initialEvent.category);
      } else {
        setCategory('General');
      }
    }
  }, [initialEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + parseInt(duration) * 60000);

    addPersonalEvent({
      title,
      description,
      date: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      location,
      type,
      category
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-border w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Add to Calendar</h2>
              <p className="text-xs text-muted-foreground font-medium">Create a personal event or reminder</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl hover:bg-secondary flex items-center justify-center transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Title</label>
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What are you planning?"
              className="w-full px-5 py-3.5 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Duration (min)</label>
              <select 
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold appearance-none"
              >
                <option value="15">15 mins</option>
                <option value="30">30 mins</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Type</label>
              <div className="flex p-1 bg-secondary/50 rounded-2xl border border-border h-[54px]">
                <button
                  type="button"
                  onClick={() => setType('personal')}
                  className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'personal' ? 'bg-background text-primary shadow-sm border border-border' : 'text-muted-foreground'}`}
                >
                  Event
                </button>
                <button
                  type="button"
                  onClick={() => setType('reminder')}
                  className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'reminder' ? 'bg-background text-primary shadow-sm border border-border' : 'text-muted-foreground'}`}
                >
                  Reminder
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Where is this happening?"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold appearance-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Notes</label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add some details..."
                rows={3}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-[1.5rem] border border-border font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 rounded-[1.5rem] bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
