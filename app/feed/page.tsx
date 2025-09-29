"use client"

import { useState } from "react"
import { feedPosts, tournaments } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Fish, Heart, MessageCircle, Share, Plus, ImageIcon, MapPin } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"

export default function FeedPage() {
  const [posts, setPosts] = useState(feedPosts)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({
    content: "",
    type: "note" as "note" | "catch" | "gear-reminder" | "tournament-update",
    tournamentId: "",
  })

  const handleCreatePost = () => {
    if (!newPost.content.trim()) return

    const post = {
      id: Date.now().toString(),
      userId: "current-user",
      userName: "You",
      content: newPost.content,
      type: newPost.type,
      timestamp: new Date().toISOString(),
      tournamentId: newPost.tournamentId || undefined,
      likes: 0,
      comments: [],
    }

    setPosts([post, ...posts])
    setNewPost({ content: "", type: "note", tournamentId: "" })
    setShowCreatePost(false)
  }

  const handleLike = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-6 max-w-2xl">
          {/* Page Header */}
          <section className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Fish className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Team Feed</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your fishing experiences, catches, and insights with the Allen THSBA team.
            </p>
            <Button onClick={() => setShowCreatePost(!showCreatePost)} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </section>

          {/* Create Post */}
          {showCreatePost && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Create Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select value={newPost.type} onValueChange={(value: any) => setNewPost({ ...newPost, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Post type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="note">General Note</SelectItem>
                      <SelectItem value="catch">Catch Report</SelectItem>
                      <SelectItem value="gear-reminder">Gear Reminder</SelectItem>
                      <SelectItem value="tournament-update">Tournament Update</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={newPost.tournamentId}
                    onValueChange={(value) => setNewPost({ ...newPost, tournamentId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tournament (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No tournament</SelectItem>
                      {tournaments.map((tournament) => (
                        <SelectItem key={tournament.id} value={tournament.id}>
                          {tournament.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Textarea
                  placeholder="What's happening on the water?"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="min-h-[100px]"
                />

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      Location
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost}>Post</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feed Posts */}
          <section className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
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
                            {post.tournamentId && post.tournamentId !== "none" && (
                              <Badge variant="secondary" className="text-xs">
                                {tournaments.find((t) => t.id === post.tournamentId)?.name}
                              </Badge>
                            )}
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
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
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
                  <h3 className="text-lg font-medium mb-2">No Posts Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share your fishing experiences with the team!
                  </p>
                  <Button onClick={() => setShowCreatePost(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Post
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        </main>
      </div>
    </AuthGuard>
  )
}
