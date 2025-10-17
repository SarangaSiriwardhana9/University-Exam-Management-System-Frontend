'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  SearchIcon,
  BuildingIcon,
  UsersIcon,
  CheckCircle2Icon,
  XCircleIcon,
  WifiIcon,
  MonitorIcon,
  AirVentIcon,
  AccessibilityIcon,
  FlaskConicalIcon,
} from 'lucide-react'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { useRoomsQuery, useRoomStatsQuery } from '@/features/rooms/hooks/use-rooms-query'
import { useExamSessionsQuery } from '@/features/exam-sessions/hooks/use-exam-sessions-query'

export default function ExamCoordinatorRoomsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [buildingFilter, setBuildingFilter] = useState<string>('all')
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const { data: roomsData, isLoading } = useRoomsQuery({ limit: 100, isActive: true })
  const { data: statsData } = useRoomStatsQuery()
  const { data: sessionsData } = useExamSessionsQuery({ limit: 1000 })

  const rooms = roomsData?.data || []
  const stats = statsData?.data
  const sessions = sessionsData?.data || []

  // Get rooms with upcoming/current exams (not expired)
  const activeRoomIds = useMemo(() => {
    const now = new Date()
    return new Set(
      sessions
        .filter(session => {
          const endTime = new Date(session.endTime)
          const startTime = new Date(session.startTime)
          
          // Only include if:
          // 1. Session hasn't ended yet (endTime is in future)
          // 2. OR session is currently in progress
          // 3. OR session is scheduled for future
          return (endTime >= now && session.status !== 'cancelled') || 
                 session.status === 'in_progress' ||
                 (session.status === 'scheduled' && startTime >= now)
        })
        .map(session => session.roomId)
        .filter(Boolean)
    )
  }, [sessions])

  // Filter rooms based on history mode
  const displayRooms = useMemo(() => {
    if (showHistory) {
      return rooms // Show all rooms in history mode
    }
    // Show only rooms with upcoming/current exams
    return rooms.filter(room => activeRoomIds.has(room._id))
  }, [rooms, showHistory, activeRoomIds])

  // Get unique buildings
  const buildings = useMemo(() => {
    const buildingSet = new Set(rooms.map(r => r.building).filter(Boolean))
    return Array.from(buildingSet).sort()
  }, [rooms])

  const filteredRooms = useMemo(() => {
    return displayRooms.filter(room => {
      const matchesSearch = search === '' || (
        room.roomNumber?.toLowerCase().includes(search.toLowerCase()) ||
        room.building?.toLowerCase().includes(search.toLowerCase()) ||
        room.fullRoomNumber?.toLowerCase().includes(search.toLowerCase())
      )
      
      const matchesBuilding = buildingFilter === 'all' || room.building === buildingFilter

      return matchesSearch && matchesBuilding
    })
  }, [displayRooms, search, buildingFilter])

  const handleViewDetails = (room: any) => {
    setSelectedRoom(room)
    setShowDetailsDialog(true)
  }

  const getFacilityIcon = (facility: string) => {
    const icons: Record<string, any> = {
      wifi: WifiIcon,
      projector: MonitorIcon,
      airConditioned: AirVentIcon,
      accessible: AccessibilityIcon,
      lab: FlaskConicalIcon,
    }
    return icons[facility] || CheckCircle2Icon
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Rooms</h1>
          <p className="text-muted-foreground mt-1">
            {showHistory ? 'View all examination rooms' : 'Active examination rooms for upcoming exams'}
          </p>
        </div>
        <Button
          variant={showHistory ? 'outline' : 'default'}
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? 'Show Active Only' : 'View All Rooms'}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{showHistory ? 'All Rooms' : 'Active Rooms'}</CardDescription>
            <CardTitle className="text-3xl">{filteredRooms.length}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {showHistory ? 'Total exam rooms' : 'Currently available'}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Buildings</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{buildings.length}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Different locations</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg. Capacity</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {filteredRooms.length > 0 
                ? Math.round(filteredRooms.reduce((sum, r) => sum + r.examCapacity, 0) / filteredRooms.length)
                : '-'}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Students per room</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Accessible</CardDescription>
            <CardTitle className="text-3xl text-purple-600">
              {filteredRooms.filter(r => r.isAccessible).length}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Disability friendly</p>
          </CardHeader>
        </Card>
      </div>

      {/* History Mode Banner */}
      {showHistory && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-3">
            <p className="text-sm text-blue-800">
              📚 Viewing all rooms (including historical data). Switch to "Show Active Only" to see current exam rooms.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by room number or building..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Filter by building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                {buildings.map(building => (
                  <SelectItem key={building} value={building || ''}>
                    {building}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Exam Capacity</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <LoadingSpinner size="lg" />
                  </TableCell>
                </TableRow>
              ) : filteredRooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <BuildingIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No rooms found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRooms.map((room) => (
                  <TableRow key={room._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BuildingIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{room.fullRoomNumber}</p>
                          {room.floorNumber && (
                            <p className="text-sm text-muted-foreground">Floor {room.floorNumber}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{room.building || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{room.capacity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{room.examCapacity}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {room.facilities?.wifi && (
                          <Badge variant="outline" className="gap-1">
                            <WifiIcon className="h-3 w-3" />
                          </Badge>
                        )}
                        {room.facilities?.projector && (
                          <Badge variant="outline" className="gap-1">
                            <MonitorIcon className="h-3 w-3" />
                          </Badge>
                        )}
                        {room.facilities?.airConditioned && (
                          <Badge variant="outline" className="gap-1">
                            <AirVentIcon className="h-3 w-3" />
                          </Badge>
                        )}
                        {room.isAccessible && (
                          <Badge variant="outline" className="gap-1">
                            <AccessibilityIcon className="h-3 w-3" />
                          </Badge>
                        )}
                        {room.isLab && (
                          <Badge variant="outline" className="gap-1">
                            <FlaskConicalIcon className="h-3 w-3" />
                            Lab
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {showHistory ? (
                        activeRoomIds.has(room._id) ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2Icon className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <XCircleIcon className="h-3 w-3" />
                            Expired
                          </Badge>
                        )
                      ) : (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2Icon className="h-3 w-3" />
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(room)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Room Details</DialogTitle>
            <DialogDescription>
              Detailed information about the examination room
            </DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Room Number</p>
                  <p className="text-base font-semibold">{selectedRoom.fullRoomNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Building</p>
                  <p className="text-base">{selectedRoom.building || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Floor</p>
                  <p className="text-base">{selectedRoom.floorNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">
                    {selectedRoom.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Capacity Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                    <p className="text-base">{selectedRoom.capacity} students</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Exam Capacity</p>
                    <p className="text-base">{selectedRoom.examCapacity} students</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Capacity Ratio</p>
                    <p className="text-base">{selectedRoom.capacityRatio}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Room Type</p>
                    <p className="text-base">{selectedRoom.isLab ? 'Laboratory' : 'Classroom'}</p>
                  </div>
                </div>
              </div>

              {selectedRoom.facilities && Object.keys(selectedRoom.facilities).length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Facilities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRoom.facilities.airConditioned && (
                      <div className="flex items-center gap-2">
                        <AirVentIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Air Conditioned</span>
                      </div>
                    )}
                    {selectedRoom.facilities.projector && (
                      <div className="flex items-center gap-2">
                        <MonitorIcon className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Projector</span>
                      </div>
                    )}
                    {selectedRoom.facilities.wifi && (
                      <div className="flex items-center gap-2">
                        <WifiIcon className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">WiFi</span>
                      </div>
                    )}
                    {selectedRoom.facilities.whiteboard && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm">Whiteboard</span>
                      </div>
                    )}
                    {selectedRoom.facilities.smartBoard && (
                      <div className="flex items-center gap-2">
                        <MonitorIcon className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm">Smart Board</span>
                      </div>
                    )}
                    {selectedRoom.facilities.soundSystem && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Sound System</span>
                      </div>
                    )}
                    {selectedRoom.isAccessible && (
                      <div className="flex items-center gap-2">
                        <AccessibilityIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Accessible</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedRoom.equipment && Object.keys(selectedRoom.equipment).length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Equipment</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRoom.equipment.tables && (
                      <div className="text-sm">
                        <span className="font-medium">Tables:</span> {selectedRoom.equipment.tables}
                      </div>
                    )}
                    {selectedRoom.equipment.chairs && (
                      <div className="text-sm">
                        <span className="font-medium">Chairs:</span> {selectedRoom.equipment.chairs}
                      </div>
                    )}
                    {selectedRoom.equipment.computers && (
                      <div className="text-sm">
                        <span className="font-medium">Computers:</span> {selectedRoom.equipment.computers}
                      </div>
                    )}
                    {selectedRoom.equipment.printers && (
                      <div className="text-sm">
                        <span className="font-medium">Printers:</span> {selectedRoom.equipment.printers}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedRoom.description && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedRoom.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
