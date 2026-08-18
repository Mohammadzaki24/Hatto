"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { saveTiles } from "@/app/actions/homepage"

interface TileItem {
  id: string
  type: "PRODUCT" | "CATEGORY"
  itemId: string
  name: string
}

interface SortableTileProps {
  tile: TileItem
  onRemove: (id: string) => void
}

function SortableTile({ tile, onRemove }: SortableTileProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tile.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 p-3 bg-background border rounded-md shadow-sm mb-2">
      <div {...attributes} {...listeners} className="cursor-grab p-1 text-muted-foreground hover:text-foreground">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3C5.5 3.82843 4.82843 4.5 4 4.5C3.17157 4.5 2.5 3.82843 2.5 3C2.5 2.17157 3.17157 1.5 4 1.5C4.82843 1.5 5.5 2.17157 5.5 3ZM12.5 3C12.5 3.82843 11.8284 4.5 11 4.5C10.1716 4.5 9.5 3.82843 9.5 3C9.5 2.17157 10.1716 1.5 11 1.5C11.8284 1.5 12.5 2.17157 12.5 3ZM5.5 7.5C5.5 8.32843 4.82843 9 4 9C3.17157 9 2.5 8.32843 2.5 7.5C2.5 6.67157 3.17157 6 4 6C4.82843 6 5.5 6.67157 5.5 7.5ZM11 9C11.8284 9 12.5 8.32843 12.5 7.5C12.5 6.67157 11.8284 6 11 6C10.1716 6 9.5 6.67157 9.5 7.5C9.5 8.32843 10.1716 9 11 9ZM5.5 12C5.5 12.8284 4.82843 13.5 4 13.5C3.17157 13.5 2.5 12.8284 2.5 12C2.5 11.1716 3.17157 10.5 4 10.5C4.82843 10.5 5.5 11.1716 5.5 12ZM11 13.5C11.8284 13.5 12.5 12.8284 12.5 12C12.5 11.1716 11.8284 10.5 11 10.5C10.1716 10.5 9.5 11.1716 9.5 12C9.5 12.8284 10.1716 13.5 11 13.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
      </div>
      <div className="flex-1 font-medium text-sm">
        <span className="text-xs uppercase bg-muted px-2 py-0.5 rounded mr-2 text-muted-foreground">{tile.type}</span>
        {tile.name}
      </div>
      <Button variant="ghost" size="sm" onClick={() => onRemove(tile.id)} className="h-7 px-2 text-destructive">
        Remove
      </Button>
    </div>
  )
}

interface TilesManagerProps {
  section: string
  title: string
  initialTiles: TileItem[]
  availableItems: { id: string; name: string; type: "PRODUCT" | "CATEGORY" }[]
}

export function TilesManager({ section, title, initialTiles, availableItems }: TilesManagerProps) {
  const [tiles, setTiles] = useState<TileItem[]>(initialTiles)
  const [selectedItem, setSelectedItem] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setTiles((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleAdd = () => {
    if (!selectedItem) return
    const item = availableItems.find(i => i.id === selectedItem)
    if (!item) return
    
    // Check if already exists
    if (tiles.find(t => t.itemId === item.id)) return

    const newTile: TileItem = {
      id: `tile-${Date.now()}`,
      type: item.type,
      itemId: item.id,
      name: item.name,
    }
    
    setTiles([...tiles, newTile])
    setSelectedItem("")
  }

  const handleRemove = (id: string) => {
    setTiles(tiles.filter(t => t.id !== id))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveTiles(section, tiles)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="border rounded-lg p-6 bg-card space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">Manage the tiles shown in this section.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Order"}
        </Button>
      </div>

      <div className="flex gap-2">
        <select 
          value={selectedItem} 
          onChange={e => setSelectedItem(e.target.value)}
          className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        >
          <option value="">Select item to add...</option>
          {availableItems.filter(i => !tiles.find(t => t.itemId === i.id)).map(item => (
            <option key={item.id} value={item.id}>
              [{item.type}] {item.name}
            </option>
          ))}
        </select>
        <Button onClick={handleAdd} disabled={!selectedItem} variant="secondary">Add to Section</Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tiles} strategy={verticalListSortingStrategy}>
          <div className="min-h-[100px] border border-dashed rounded-md p-2">
            {tiles.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground py-8">
                No items added yet.
              </div>
            ) : (
              tiles.map((tile) => (
                <SortableTile key={tile.id} tile={tile} onRemove={handleRemove} />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
