import { tournaments, feedPosts } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Fish, ArrowLeft, Heart, MessageCircle, Share } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface TournamentFeedPageProps {
  params: {
    id: string
  }
}

export default function TournamentFeedPage({ params }: TournamentFeedPageProps) {
  const tournament = tournaments.find((t) => t.id === params.id)

  if (!tournament) {
    notFound()
  }

  // Get tournament-specific posts
  const tournamentPosts = feedPosts.filter((post) => post.tournamentId === tournament.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/tournaments/${tournament.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Fish className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-lg font-bold">{tournament.name}</h1>
                <p className="text-sm text-muted-foreground">Tournament Feed</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Feed Header */}
        <section className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold">Tournament Discussion</h2>
          <p className="text-muted-foreground">Share insights, catches, and updates for {tournament.name}</p>
        </section>

        {/* Posts */}
        <section className="space-y-6">
          {tournamentPosts.length > 0 ? (
            tournamentPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Post Header */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Fish className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{post.userName}</span>
                          <Badge variant="outline" className="text-xs">
                            {post.type.replace("-", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed">{post.content}</p>

                      {/* Catch Details */}
                      {post.catchDetails && (
                        <div className="bg-accent/20 rounded-lg p-4 space-y-2">
                          <div className="font-medium text-accent-foreground">{post.catchDetails.species}</div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div>Weight: {post.catchDetails.weight} lbs</div>
                            <div>Length: {post.catchDetails.length}"</div>
                            <div>Lure: {post.catchDetails.lure}</div>
                            <div>Location: {post.catchDetails.location}</div>
                          </div>
                        </div>
                      )}

                      {/* Gear Reminder */}
                      {post.gearReminder && (
                        <div className="bg-destructive/10 rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={post.gearReminder.priority === "high" ? "destructive" : "secondary"}>
                              {post.gearReminder.priority} priority
                            </Badge>
                          </div>
                          <ul className="text-sm space-y-1">
                            {post.gearReminder.items.map((item, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Post Images */}
                      {post.images && post.images.length > 0 && (
                        <div className="grid gap-2">
                          {post.images.map((image, index) => (
                            <img
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt="Post image"
                              className="rounded-lg w-full h-48 object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center gap-6 pt-2 border-t border-border">
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments.length}</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="space-y-3 pt-2 border-t border-border">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <Fish className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{comment.userName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Fish className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to share insights about this tournament!</p>
                <Button>Create Post</Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  )
}
