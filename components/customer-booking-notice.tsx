import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Clock, CheckCircle2 } from "lucide-react"

interface CustomerBookingNoticeProps {
  className?: string
}

export function CustomerBookingNotice({ className }: CustomerBookingNoticeProps) {
  return (
    <Alert className={className}>
      <Info className="h-4 w-4" />
      <AlertTitle className="font-semibold">Booking Confirmation Process</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-sm">
          After you book, the rental partner will review and confirm your request. You will receive a notification once
          confirmed.
        </p>

        {/* Sinhala translation */}
        <p className="text-sm text-muted-foreground">
          ඔබ වෙන්කරවා ගත් පසු, කුලී හවුල්කරු ඔබේ ඉල්ලීම සමාලෝචනය කර තහවුරු කරනු ඇත. තහවුරු වූ පසු ඔබට දැනුම්දීමක් ලැබෙනු ඇත.
        </p>

        <div className="flex flex-col gap-2 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span>Partner confirmation required</span>
            <span className="text-muted-foreground">| හවුල්කරු තහවුරු කිරීම අවශ්‍යයි</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            <span>You'll be notified when confirmed</span>
            <span className="text-muted-foreground">| තහවුරු වූ විට ඔබට දැනුම් දෙනු ඇත</span>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
