"use client"

import { useUser, UserButton } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  const { user } = useUser()

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-muted-foreground">
          You are not signed in.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card className="shadow-md">
        {/* Profile Header */}
        <CardHeader className="flex flex-col items-center space-y-3">
          {/* Big profile image via UserButton */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-24 w-24", // bigger avatar
              },
            }}
          />

          <CardTitle className="text-2xl font-semibold">
            {user.fullName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </CardHeader>

        <Separator />

        {/* Account Info */}
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground font-medium">Full Name</span>
            <span>{user.fullName}</span>

            <span className="text-muted-foreground font-medium">Email</span>
            <span>{user.primaryEmailAddress?.emailAddress}</span>

            <span className="text-muted-foreground font-medium">User ID</span>
            <span className="break-all">{user.id}</span>

            <span className="text-muted-foreground font-medium">Created At</span>
            <span>{user.createdAt?.toLocaleDateString()}</span>

            <span className="text-muted-foreground font-medium">Last Sign-in</span>
            <span>{user.lastSignInAt?.toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
