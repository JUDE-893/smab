// page.tsx (updated to reflect the new purpose)
import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./profile-form"

export const dynamic = 'force-dynamic';

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Metrics Plans Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your sales and orders metrics targets for different time periods.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}