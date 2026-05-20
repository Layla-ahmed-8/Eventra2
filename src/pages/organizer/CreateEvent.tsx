import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent } from 'react';
import { useBlocker, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Image, DollarSign, CheckCircle, AlertTriangle, Move, X } from 'lucide-react';
import { toast } from 'sonner';
import { categories } from '../../data/mockData';
import { demoToast } from '../../lib/demoFeedback';
import ConfirmationModal from '../../components/business/ConfirmationModal';

const VIBE_OPTIONS = ['Chill', 'Energetic', 'Networking', 'Exclusive', 'Family-Friendly', 'Outdoor', 'Late Night', 'Creative', 'Educational'];
const CRITICAL_FIELDS = ['date', 'time', 'venue', 'city', 'ticketPrice', 'capacity'] as const;
const DRAFT_KEY = 'create-event-draft';
const DEFAULT_IMAGE_CROP = { zoom: 100, x: 50, y: 50 };
const MIN_IMAGE_ZOOM = 100;
const MAX_IMAGE_ZOOM = 220;

export default function CreateEvent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    venue: '',
    address: '',
    city: '',
    description: '',
    image: '',
    imageCrop: { ...DEFAULT_IMAGE_CROP },
    capacity: '100',
    ticketPrice: '',
    vibeTags: [] as string[],
  });

  const [originalFormData] = useState(() => (editId ? { ...formData } : null));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showPublishReviewModal, setShowPublishReviewModal] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const dragStateRef = useRef<{ clientX: number; clientY: number; startX: number; startY: number } | null>(null);
  const pointerMapRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStateRef = useRef<{
    startDistance: number;
    startZoom: number;
    startX: number;
    startY: number;
    centerX: number;
    centerY: number;
  } | null>(null);
  const blocker = useBlocker(isDirty && !isSubmitting);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
      return undefined;
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty, isSubmitting]);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setShowLeaveModal(true);
    }
  }, [blocker.state]);

  useEffect(() => {
    if (!editId) {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setFormData((prev) => ({ ...prev, ...parsed }));
          setIsDirty(true);
          setDraftSavedAt(new Date().toISOString());
        }
      } catch {
        // ignore broken drafts
      }
    }
  }, [editId]);

  const update = (patch: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    setIsDirty(true);

    const keys = Object.keys(patch);
    if (keys.length) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        keys.forEach((k) => {
          next[k] = '';
        });
        return next;
      });
    }
  };

  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      setIsDirty(false);
      const now = new Date().toISOString();
      setDraftSavedAt(now);
      toast.success('Draft saved');
    } catch {
      toast.error('Failed to save draft');
    }
  };

  useEffect(() => {
    if (!isDirty) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
        const now = new Date().toISOString();
        setDraftSavedAt(now);
      } catch {
        // noop
      }
    }, 1000);

    return () => clearTimeout(t);
  }, [formData, isDirty]);

  const validateAll = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) errors.title = 'Event title is required.';
    if (!formData.category) errors.category = 'Please select a category.';
    if (!formData.date) errors.date = 'Date is required.';
    if (!formData.time) errors.time = 'Time is required.';
    if (!formData.venue.trim()) errors.venue = 'Venue name is required.';
    if (!formData.address.trim()) errors.address = 'Street address is required.';
    if (!formData.city.trim()) errors.city = 'City is required.';
    if (!formData.description.trim()) errors.description = 'Event description is required.';

    const today = new Date().toISOString().slice(0, 10);
    if (formData.date && formData.date < today) {
      errors.date = 'Date cannot be in the past.';
    }

    const cap = Number(formData.capacity);
    if (!formData.capacity || Number.isNaN(cap) || cap < 1) {
      errors.capacity = 'Capacity must be at least 1.';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return false;
    }

    return true;
  };

  const isFormComplete = () => {
    const required = ['title', 'category', 'date', 'time', 'venue', 'address', 'city', 'description', 'capacity'] as const;
    return required.every((f) => {
      const v = formData[f as keyof typeof formData];
      if (f === 'capacity') {
        const n = Number(v as string);
        return !Number.isNaN(n) && n > 0;
      }
      return String(v).trim().length > 0;
    });
  };

  const criticalChanged =
    editId !== null
    && originalFormData !== null
    && (CRITICAL_FIELDS as readonly string[]).some(
      (field) => String(formData[field as keyof typeof formData]) !== String(originalFormData[field as keyof typeof originalFormData]),
    );

  const toggleVibeTag = (tag: string) => {
    setFormData((prev) => {
      const has = prev.vibeTags.includes(tag);
      if (has) return { ...prev, vibeTags: prev.vibeTags.filter((t) => t !== tag) };
      if (prev.vibeTags.length >= 3) {
        toast.error('You can select up to 3 vibe tags.');
        return prev;
      }
      return { ...prev, vibeTags: [...prev.vibeTags, tag] };
    });
    setIsDirty(true);
  };

  const updateImageCrop = (patch: Partial<typeof DEFAULT_IMAGE_CROP>) => {
    setFormData((prev) => ({
      ...prev,
      imageCrop: {
        ...DEFAULT_IMAGE_CROP,
        ...(prev.imageCrop || DEFAULT_IMAGE_CROP),
        ...patch,
      },
    }));
    setIsDirty(true);
  };

  const clampPercentage = (value: number) => Math.max(0, Math.min(100, value));
  const clampZoom = (value: number) => Math.max(MIN_IMAGE_ZOOM, Math.min(MAX_IMAGE_ZOOM, value));

  const getDistance = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.hypot(dx, dy);
  };

  const getCenter = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const handleImagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerMapRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const pointers = [...pointerMapRef.current.values()];

    if (pointers.length === 1) {
      dragStateRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
        startX: formData.imageCrop?.x ?? 50,
        startY: formData.imageCrop?.y ?? 50,
      };
      pinchStateRef.current = null;
      setIsDraggingImage(true);
      return;
    }

    if (pointers.length >= 2) {
      const pointA = pointers[0];
      const pointB = pointers[1];
      const center = getCenter(pointA, pointB);
      pinchStateRef.current = {
        startDistance: Math.max(getDistance(pointA, pointB), 1),
        startZoom: formData.imageCrop?.zoom ?? DEFAULT_IMAGE_CROP.zoom,
        startX: formData.imageCrop?.x ?? DEFAULT_IMAGE_CROP.x,
        startY: formData.imageCrop?.y ?? DEFAULT_IMAGE_CROP.y,
        centerX: center.x,
        centerY: center.y,
      };
      dragStateRef.current = null;
      setIsDraggingImage(false);
    }
  };

  const handleImagePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointerMapRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const pointers = [...pointerMapRef.current.values()];

    if (pointers.length >= 2 && pinchStateRef.current) {
      const pointA = pointers[0];
      const pointB = pointers[1];
      const center = getCenter(pointA, pointB);
      const distance = Math.max(getDistance(pointA, pointB), 1);
      const scale = distance / pinchStateRef.current.startDistance;
      const nextZoom = clampZoom(pinchStateRef.current.startZoom * scale);
      const deltaCenterX = ((center.x - pinchStateRef.current.centerX) / rect.width) * 100;
      const deltaCenterY = ((center.y - pinchStateRef.current.centerY) / rect.height) * 100;

      updateImageCrop({
        zoom: nextZoom,
        x: clampPercentage(pinchStateRef.current.startX + deltaCenterX),
        y: clampPercentage(pinchStateRef.current.startY + deltaCenterY),
      });
      return;
    }

    if (!dragStateRef.current) return;

    const deltaX = ((event.clientX - dragStateRef.current.clientX) / rect.width) * 100;
    const deltaY = ((event.clientY - dragStateRef.current.clientY) / rect.height) * 100;

    updateImageCrop({
      x: clampPercentage(dragStateRef.current.startX + deltaX),
      y: clampPercentage(dragStateRef.current.startY + deltaY),
    });
  };

  const handleImagePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    pointerMapRef.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const pointers = [...pointerMapRef.current.values()];
    if (pointers.length === 1) {
      const remaining = pointers[0];
      dragStateRef.current = {
        clientX: remaining.x,
        clientY: remaining.y,
        startX: formData.imageCrop?.x ?? DEFAULT_IMAGE_CROP.x,
        startY: formData.imageCrop?.y ?? DEFAULT_IMAGE_CROP.y,
      };
      pinchStateRef.current = null;
      setIsDraggingImage(true);
      return;
    }

    dragStateRef.current = null;
    pinchStateRef.current = null;
    setIsDraggingImage(false);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      event.target.value = '';
      return;
    }

    const maxSizeMb = 5;
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`Image must be ${maxSizeMb}MB or smaller.`);
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      update({
        image: String(reader.result || ''),
        imageCrop: { ...DEFAULT_IMAGE_CROP },
      });
    };
    reader.onerror = () => {
      toast.error('Failed to read image file. Please try another one.');
    };
    reader.readAsDataURL(file);
  };

  const openPublishReview = () => {
    if (!validateAll()) return;
    setShowPublishReviewModal(true);
  };

  const confirmPublish = () => {
    setIsSubmitting(true);
    setIsDirty(false);
    setTimeout(() => {
      demoToast('Event published', 'In this demo, new events are not persisted to the catalog. Review flows on My Events.');
      setIsSubmitting(false);
      localStorage.removeItem(DRAFT_KEY);
      setDraftSavedAt(null);
      navigate('/organizer/events');
    }, 800);
  };

  const err = (field: string) => fieldErrors[field] || '';

  const ticketPricePreview =
    formData.ticketPrice === '' || String(formData.ticketPrice) === '0'
      ? 'FREE'
      : `EGP ${formData.ticketPrice}`;

  return (
    <div className="space-y-3">
      <ConfirmationModal
        open={showLeaveModal}
        onOpenChange={setShowLeaveModal}
        title="Discard changes?"
        message="You have unsaved changes. Leaving now will discard them."
        confirmLabel="Leave anyway"
        cancelLabel="Stay"
        onConfirm={() => {
          setShowLeaveModal(false);
          blocker.proceed?.();
        }}
        onCancel={() => {
          setShowLeaveModal(false);
          blocker.reset?.();
        }}
      />

      <ConfirmationModal
        open={showPublishReviewModal}
        onOpenChange={setShowPublishReviewModal}
        title="Review event before publishing"
        message="Confirm the final details below or go back to edit."
        maxWidthClassName="max-w-4xl"
        confirmLabel={isSubmitting ? 'Publishing...' : 'Confirm event creation'}
        cancelLabel="Edit again"
        onConfirm={confirmPublish}
        onCancel={() => setShowPublishReviewModal(false)}
      >
        <div className="space-y-4">
          {formData.image && (
            <div
              aria-label="Event background preview"
              className="h-44 w-full rounded-xl border border-border"
              style={{
                backgroundImage: `url(${formData.image})`,
                backgroundPosition: `${formData.imageCrop?.x ?? 50}% ${formData.imageCrop?.y ?? 50}%`,
                backgroundSize: `${formData.imageCrop?.zoom ?? 100}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
          <div className="grid gap-3 text-body-sm sm:grid-cols-2">
            <div className="surface-panel p-3">
              <p className="text-caption text-muted-foreground">Title</p>
              <p className="font-bold text-foreground">{formData.title}</p>
            </div>
            <div className="surface-panel p-3">
              <p className="text-caption text-muted-foreground">Category</p>
              <p className="font-bold text-foreground">{formData.category}</p>
            </div>
            <div className="surface-panel p-3">
              <p className="text-caption text-muted-foreground">Date & Time</p>
              <p className="font-bold text-foreground">{formData.date} at {formData.time}</p>
            </div>
            <div className="surface-panel p-3">
              <p className="text-caption text-muted-foreground">Venue</p>
              <p className="font-bold text-foreground">{formData.venue}</p>
              <p className="text-caption text-muted-foreground">{formData.address}, {formData.city}</p>
            </div>
            <div className="surface-panel p-3">
              <p className="text-caption text-muted-foreground">Capacity</p>
              <p className="font-bold text-foreground">{formData.capacity}</p>
            </div>
            <div className="surface-panel p-3">
              <p className="text-caption text-muted-foreground">Price</p>
              <p className="font-bold text-foreground">{ticketPricePreview}</p>
            </div>
          </div>
          <div className="surface-panel p-3">
            <p className="text-caption text-muted-foreground">Description</p>
            <p className="text-body-sm text-foreground">{formData.description}</p>
          </div>
          <div className="surface-panel p-3">
            <p className="text-caption text-muted-foreground">Vibe tags</p>
            <p className="text-body-sm text-foreground">
              {formData.vibeTags.length ? formData.vibeTags.join(', ') : 'No vibe tags selected'}
            </p>
          </div>
        </div>
      </ConfirmationModal>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/organizer/events')}
            className="btn-ghost flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Cancel</span>
          </button>
          <div>
            <h1 className="text-h1 font-bold text-foreground">Create Event</h1>
            <p className="text-caption text-muted-foreground">One structured flow: fill all sections, then review and publish</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-caption font-bold text-muted-foreground">Draft status</p>
          <p className="text-body-sm text-foreground">
            {draftSavedAt ? `Saved ${new Date(draftSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Not saved yet'}
          </p>
        </div>
      </div>

      {criticalChanged && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-body-sm text-amber-800 dark:text-amber-300">
            You changed critical event details (date, time, venue, or ticketing). Existing attendees will be notified when you publish.
          </p>
        </div>
      )}

      <div className="bento-section grid gap-3 lg:grid-cols-2 2xl:grid-cols-2 p-3 sm:p-4">
        <section className="space-y-2 rounded-2xl border border-border/60 p-3">
          <div>
            <h2 className="text-h3 font-bold text-foreground">Event Details</h2>
            <p className="text-caption text-muted-foreground">Core information that attendees see first.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">Event Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => update({ title: e.target.value })}
              className={`w-full input-base px-3 py-1.5 text-body-sm${err('title') ? ' input-error' : ''}`}
              placeholder="e.g., Summer Music Festival 2026"
            />
            {err('title') && <p className="field-error-msg">{err('title')}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => update({ category: e.target.value })}
              className={`w-full input-base bg-background px-3 py-1.5 text-body-sm${err('category') ? ' input-error' : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {err('category') && <p className="field-error-msg">{err('category')}</p>}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => update({ date: e.target.value })}
                  min={new Date().toISOString().slice(0, 10)}
                  className={`w-full input-base py-1.5 pl-10 pr-3 text-body-sm${err('date') ? ' input-error' : ''}`}
                />
              </div>
              {err('date') && <p className="field-error-msg">{err('date')}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">Time *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => update({ time: e.target.value })}
                className={`w-full input-base px-3 py-1.5 text-body-sm${err('time') ? ' input-error' : ''}`}
              />
              {err('time') && <p className="field-error-msg">{err('time')}</p>}
            </div>
          </div>
        </section>

        <section className="space-y-2 rounded-2xl border border-border/60 p-3">
          <div>
            <h2 className="text-h3 font-bold text-foreground">Location</h2>
            <p className="text-caption text-muted-foreground">Where the event takes place.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">Venue Name *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => update({ venue: e.target.value })}
                className={`w-full input-base py-1.5 pl-10 pr-3 text-body-sm${err('venue') ? ' input-error' : ''}`}
                placeholder="e.g., Cairo Opera House"
              />
            </div>
            {err('venue') && <p className="field-error-msg">{err('venue')}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">Street Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => update({ address: e.target.value })}
              className={`w-full input-base px-3 py-1.5 text-body-sm${err('address') ? ' input-error' : ''}`}
              placeholder="e.g., 1 Gezira St, Zamalek"
            />
            {err('address') && <p className="field-error-msg">{err('address')}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">City *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => update({ city: e.target.value })}
              className={`w-full input-base px-3 py-1.5 text-body-sm${err('city') ? ' input-error' : ''}`}
              placeholder="e.g., Cairo"
            />
            {err('city') && <p className="field-error-msg">{err('city')}</p>}
          </div>
        </section>

        <section className="space-y-2 rounded-2xl border border-border/60 p-3">
          <div>
            <h2 className="text-h3 font-bold text-foreground">Description & Media</h2>
            <p className="text-caption text-muted-foreground">Explain the event and add imagery.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">Event Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => update({ description: e.target.value })}
              rows={4}
              className={`min-h-[96px] w-full resize-none input-base px-3 py-1.5 text-body-sm${err('description') ? ' input-error' : ''}`}
              placeholder="Describe what makes your event special..."
            />
            {err('description') && <p className="field-error-msg">{err('description')}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">Event Image Upload</label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/35 bg-primary/5 px-3 py-2 transition-colors hover:bg-primary/10">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Image className="h-4 w-4" />
              </span>
              <div>
                <p className="text-body-sm font-semibold text-foreground">Choose image file</p>
                <p className="text-[10px] text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {formData.image && (
              <div className="mt-3 space-y-2">
                <div className="relative">
                  <div
                    aria-label="Event image crop preview"
                    className={`h-36 w-full rounded-xl border ${isDraggingImage ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onPointerDown={handleImagePointerDown}
                    onPointerMove={handleImagePointerMove}
                    onPointerUp={handleImagePointerUp}
                    onPointerCancel={handleImagePointerUp}
                    onPointerLeave={handleImagePointerUp}
                    style={{
                      touchAction: 'none',
                      backgroundImage: `url(${formData.image})`,
                      backgroundPosition: `${formData.imageCrop?.x ?? 50}% ${formData.imageCrop?.y ?? 50}%`,
                      backgroundSize: `${formData.imageCrop?.zoom ?? 100}%`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                  <div className="absolute bottom-2 left-2 right-12 rounded-lg border border-white/20 bg-black/60 px-2 py-1.5 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/85">
                      <span className="inline-flex items-center gap-1">
                        <Move className="h-3.5 w-3.5" />
                        Drag + pinch
                      </span>
                      <span>
                        {Math.round(formData.imageCrop?.x ?? 50)}% / {Math.round(formData.imageCrop?.y ?? 50)}% · {Math.round(formData.imageCrop?.zoom ?? 100)}%
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => update({ image: '', imageCrop: { ...DEFAULT_IMAGE_CROP } })}
                    className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white transition-colors hover:bg-black/80"
                    aria-label="Remove uploaded image"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">
                Vibe Tags <span className="normal-case font-normal">(up to 3)</span>
              </label>
              <span className="text-caption text-muted-foreground">{formData.vibeTags.length}/3 selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {VIBE_OPTIONS.map((tag) => {
                const selected = formData.vibeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleVibeTag(tag)}
                    className={`rounded-xl border px-2 py-0.5 text-caption font-bold transition-all ${
                      selected
                        ? 'border-primary bg-primary text-white'
                        : 'border-border/50 bg-secondary/40 text-muted-foreground hover:bg-secondary/60'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-2 rounded-2xl border border-border/60 p-3">
          <div>
            <h2 className="text-h3 font-bold text-foreground">Ticketing</h2>
            <p className="text-caption text-muted-foreground">Set capacity and pricing.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">Event Capacity *</label>
            <input
              type="number"
              value={formData.capacity}
              onFocus={() => {
                if (String(formData.capacity) === '0') update({ capacity: '' as any });
              }}
              onChange={(e) => update({ capacity: e.target.value as any })}
              className={`w-full input-base px-3 py-1.5 text-body-sm${err('capacity') ? ' input-error' : ''}`}
              placeholder="100"
            />
            {err('capacity') && <p className="field-error-msg">{err('capacity')}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">Ticket Price (EGP)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="number"
                value={formData.ticketPrice}
                onFocus={() => {
                  if (String(formData.ticketPrice) === '0') update({ ticketPrice: '' as any });
                }}
                onChange={(e) => update({ ticketPrice: e.target.value as any })}
                className="w-full input-base py-1.5 pl-10 pr-3 text-body-sm"
                placeholder="0 for free events"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-3">
            <h4 className="mb-3 text-caption font-black uppercase tracking-widest text-primary">Event Preview</h4>
            <div className="space-y-1.5">
              <p className="text-body-sm font-bold text-foreground">{formData.title || 'Your Event'}</p>
              <p className="text-caption text-muted-foreground">
                {formData.date && formData.time ? `${formData.date} at ${formData.time}` : 'Date & Time TBD'}
              </p>
              <p className="text-caption text-muted-foreground">{formData.venue || 'Venue TBD'}</p>
              <div className="mt-3 flex items-center gap-3 border-t border-primary/10 pt-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Capacity: <span className="text-foreground">{formData.capacity}</span>
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Price: <span className="text-foreground">{ticketPricePreview}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-2 flex flex-col gap-3 border-t border-border pt-4 md:flex-row md:items-center md:justify-between 2xl:col-span-2 lg:col-span-2">
          <div className="text-caption text-muted-foreground">
            {isFormComplete() ? 'Ready to review and publish' : 'Complete required fields before publishing'}
          </div>

          <div className="ml-auto flex gap-3">
            <button onClick={saveDraft} className="btn-ghost px-4">Save draft</button>
            <button
              onClick={openPublishReview}
              disabled={isSubmitting || !isFormComplete()}
              title={!isFormComplete() ? 'Complete all required fields before publishing' : undefined}
              className="btn-primary inline-flex items-center gap-2 bg-green-600 px-8 py-2 hover:bg-green-700 disabled:opacity-70"
            >
              {isSubmitting
                ? <><span className="btn-spinner" /> Publishing...</>
                : <><CheckCircle className="h-5 w-5" /> Publish Event</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
