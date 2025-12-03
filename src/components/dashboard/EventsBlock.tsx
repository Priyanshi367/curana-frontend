// Update the imports at the top of EventsBlock.tsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, ArrowRight, Plus, Loader2, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";
import { fetchEventsForRole, formatEventDate } from "@/services/events";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserRole } from "@/services/auth";
import { UserRole } from "@/types/menu";

const eventTypes = [
  { label: "Company Wide", value: "Company Wide", color: "hsl(var(--accent))" },
  { label: "Industry Event", value: "Industry Event", color: "hsl(142 76% 36%)" },
  { label: "Onboarding", value: "Onboarding", color: "hsl(221 83% 53%)" },
  { label: "Training", value: "Training", color: "hsl(30 95% 64%)" },
  { label: "Team Meeting", value: "Team Meeting", color: "hsl(262 83% 58%)" },
];

const userRoles = [
  { label: "All Users", value: "all", color: "hsl(var(--primary))" },
  { label: "Provider", value: "provider", color: "hsl(142 76% 36%)" },
  { label: "Health Plan User", value: "health_plan_user", color: "hsl(221 83% 53%)" },
  { label: "Corporate", value: "corporate", color: "hsl(262 83% 58%)" },
  { label: "Admin", value: "admin", color: "hsl(30 95% 64%)" },
];

const EventsBlock = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    type: eventTypes[0].value,
    role: "all",
  });

  // Fetch events based on user role
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const userRole = getUserRole() as UserRole;
        const response = await fetchEventsForRole(userRole);
        // Handle both direct array response and paginated response
        setEvents(Array.isArray(response) ? response : [])
      } catch (err) {
        console.error('Failed to load events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const eventType = eventTypes.find(type => type.value === newEvent.type);

      const newEventObj = {
        id: events.length + 1,
        title: newEvent.title,
        date: format(new Date(newEvent.date), 'MMM dd, yyyy'),
        time: newEvent.time,
        location: newEvent.location,
        type: newEvent.type,
        role: newEvent.role,
        color: eventType?.color || "hsl(var(--accent))"
      };

      setEvents([...events, newEventObj]);
      setNewEvent({
        title: "",
        date: "",
        time: "",
        location: "",
        type: eventTypes[0].value,
        role: "all",
      });
      setIsDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold">Upcoming Events</h2>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          {error}
        </div>
      </Card>
    );
  }

  // Show empty state
  if (events.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-muted-foreground">
          No upcoming events found for your role.
        </div>
      </Card>
    );
  }

  // Format event date helper
  const formatEventDateTime = (dateString: string) => {
    const date = parseISO(dateString);
    return {
      formattedDate: format(date, 'MMM dd, yyyy'),
      formattedTime: format(date, 'h:mm a'),
      month: format(date, 'MMM').toUpperCase(),
      day: format(date, 'dd'),
    };
  };

  return (
    <Card className="p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold">Upcoming Events</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-accent hover:text-accent hover:font-semibold hover:text-white hidden sm:inline-flex text-xs sm:text-sm"
          aria-label="View all events"
        >
          View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
        </Button>
      </div>

      <div className="mb-6 group">
        <Button
          variant="outline"
          className={`
            w-full flex items-center justify-center gap-3 py-5 px-4
            border border-neutral-300 dark:border-neutral-700
            rounded-xl bg-white dark:bg-neutral-900
            transition-all duration-300 ease-in-out
            
            group-hover:border-primary/50
            group-hover:bg-primary/5 
            group-hover:shadow-md
            group-hover:shadow-primary/10
            
            hover:scale-[1.01]
            active:scale-[0.98]
            
            dark:group-hover:bg-primary/10
            dark:group-hover:border-primary/30
          `}
          onClick={() => setIsDialogOpen(true)}
        >
          <div className="p-1.5 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
            <CalendarPlus className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="text-base font-medium text-neutral-800 dark:text-neutral-200 transition-colors duration-300 group-hover:text-primary dark:group-hover:text-primary">
            Add New Event
          </span>
        </Button>
      </div>

      {/* Add Event Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-xl">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-foreground">
              Create New Event
            </DialogTitle>
            <p className="text-center text-sm text-muted-foreground">
              Schedule an event and assign it to specific roles
            </p>
          </DialogHeader>
          <form onSubmit={handleAddEvent} className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Event Title *</label>
              <Input
                placeholder="Team meeting, Conference, etc."
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="h-11"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Date *</label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Time *</label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Location *</label>
              <Input
                placeholder="e.g., Conference Room A, Zoom, etc."
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Event Type</label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                Who can see this event? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {userRoles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setNewEvent({ ...newEvent, role: role.value })}
                    className={`flex items-center gap-2 rounded-lg border p-3 transition-all ${newEvent.role === role.value
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                    <span className="text-sm font-medium">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="h-11 px-6"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 px-6 bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : 'Create Event'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Events List */}
      <div className="space-y-4">
        {events.slice(0, 3).map((event) => {
          const eventDate = event.date || event.attributes?.date || new Date().toISOString();
          const { month, day, time } = formatEventDate(eventDate);
          const eventType = eventTypes.find(type =>
            type.label.toLowerCase() === (event.eventtype?.trim().toLowerCase() || 'company wide')
          ) || eventTypes[0];

          return (
            <div
              key={event.id}
              className="p-4 rounded-lg border border-border hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer group"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div
                    className="h-14 w-14 rounded-lg flex flex-col items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: eventType.color }}
                  >
                    <span className="text-xs opacity-90">
                      {month}
                    </span>
                    <span className="text-lg leading-none">
                      {day}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                    {event.title || event.attributes?.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{time}</span>
                    </div>
                    {(event.location || event.attributes?.location) && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location || event.attributes?.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: eventType.color }}
                    >
                      {eventType.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of your component... */}
    </Card>
  );
};

export default EventsBlock;