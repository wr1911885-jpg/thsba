"use client"

import { useState } from "react"
import { defaultGearItems } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Fish, ArrowLeft, Plus, Package, CheckCircle, AlertCircle, Circle } from "lucide-react"
import Link from "next/link"
import type { GearItem } from "@/lib/types"

export default function GearPage() {
  const [gearItems, setGearItems] = useState<GearItem[]>(defaultGearItems)
  const [newItemName, setNewItemName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<GearItem["category"]>("other")
  const [showAddItem, setShowAddItem] = useState(false)

  const categories: { key: GearItem["category"]; label: string; icon: string }[] = [
    { key: "rods", label: "Rods", icon: "🎣" },
    { key: "reels", label: "Reels", icon: "⚙️" },
    { key: "lures", label: "Lures", icon: "🐟" },
    { key: "tackle", label: "Tackle", icon: "🎯" },
    { key: "electronics", label: "Electronics", icon: "📱" },
    { key: "safety", label: "Safety", icon: "🦺" },
    { key: "other", label: "Other", icon: "📦" },
  ]

  const toggleItem = (itemId: string) => {
    setGearItems(gearItems.map((item) => (item.id === itemId ? { ...item, isChecked: !item.isChecked } : item)))
  }

  const addNewItem = () => {
    if (!newItemName.trim()) return

    const newItem: GearItem = {
      id: Date.now().toString(),
      name: newItemName,
      category: selectedCategory,
      isChecked: false,
      priority: "recommended",
    }

    setGearItems([...gearItems, newItem])
    setNewItemName("")
    setShowAddItem(false)
  }

  const resetChecklist = () => {
    setGearItems(gearItems.map((item) => ({ ...item, isChecked: false })))
  }

  const getCompletionStats = () => {
    const total = gearItems.length
    const completed = gearItems.filter((item) => item.isChecked).length
    const essential = gearItems.filter((item) => item.priority === "essential")
    const essentialCompleted = essential.filter((item) => item.isChecked).length

    return {
      total,
      completed,
      percentage: Math.round((completed / total) * 100),
      essential: essential.length,
      essentialCompleted,
      essentialPercentage: Math.round((essentialCompleted / essential.length) * 100),
    }
  }

  const stats = getCompletionStats()

  const getPriorityIcon = (priority: GearItem["priority"]) => {
    switch (priority) {
      case "essential":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "recommended":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "optional":
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPriorityColor = (priority: GearItem["priority"]) => {
    switch (priority) {
      case "essential":
        return "destructive"
      case "recommended":
        return "default"
      case "optional":
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Gear Checklist</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetChecklist}>
                Reset
              </Button>
              <Button onClick={() => setShowAddItem(!showAddItem)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Progress Overview */}
        <section className="mb-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stats.percentage}%</div>
                <div className="text-sm text-muted-foreground">
                  Overall Progress ({stats.completed}/{stats.total})
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-destructive mb-2">{stats.essentialPercentage}%</div>
                <div className="text-sm text-muted-foreground">
                  Essential Items ({stats.essentialCompleted}/{stats.essential})
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">{categories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Add New Item */}
        {showAddItem && (
          <section className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Add New Gear Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Item name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as GearItem["category"])}
                  >
                    {categories.map((category) => (
                      <option key={category.key} value={category.key}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addNewItem} disabled={!newItemName.trim()}>
                    Add Item
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddItem(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Gear Categories */}
        <section className="space-y-6">
          {categories.map((category) => {
            const categoryItems = gearItems.filter((item) => item.category === category.key)
            const completedItems = categoryItems.filter((item) => item.isChecked).length

            if (categoryItems.length === 0) return null

            return (
              <Card key={category.key}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      {category.label}
                    </CardTitle>
                    <Badge variant="outline">
                      {completedItems}/{categoryItems.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <Checkbox id={item.id} checked={item.isChecked} onCheckedChange={() => toggleItem(item.id)} />
                        <div className="flex-1">
                          <label
                            htmlFor={item.id}
                            className={`text-sm font-medium cursor-pointer ${
                              item.isChecked ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {item.name}
                          </label>
                          {item.notes && <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(item.priority)}
                          <Badge variant={getPriorityColor(item.priority) as any} className="text-xs">
                            {item.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>

        {/* Priority Legend */}
        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Priority Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <Badge variant="destructive" className="text-xs">
                    Essential
                  </Badge>
                  <span className="text-sm text-muted-foreground">Must have for tournament</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <Badge variant="default" className="text-xs">
                    Recommended
                  </Badge>
                  <span className="text-sm text-muted-foreground">Highly suggested</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                  <span className="text-sm text-muted-foreground">Nice to have</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setGearItems(
                      gearItems.map((item) => (item.priority === "essential" ? { ...item, isChecked: true } : item)),
                    )
                  }
                >
                  Check All Essential
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setGearItems(
                      gearItems.map((item) => (item.priority === "recommended" ? { ...item, isChecked: true } : item)),
                    )
                  }
                >
                  Check All Recommended
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/ai-tools">
                    <Fish className="h-4 w-4 mr-2" />
                    Get AI Gear Advice
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
