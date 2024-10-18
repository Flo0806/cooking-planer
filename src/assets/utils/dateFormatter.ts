export function formatDate(date: Date, withWeekday: boolean = false): string {
  // Optionen für das Format
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }

  // Wenn der Wochentag angezeigt werden soll
  if (withWeekday) {
    options.weekday = 'long' // Vollständiger Wochentag (z.B. Montag)
  }

  // Date formatieren
  return new Intl.DateTimeFormat('de-DE', options).format(date)
}
