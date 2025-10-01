import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./profile-form"
import { PageDescriptions } from '@/components/custom/salesMetrics/PageDescriptions';
import { SiteHeader } from "@/components/shadcnkit/site-header"

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <PageDescriptions pageTitle='Sales Products Analytics Report' />
      <SiteHeader pageTitle="Customers Purchase Activity" />
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}
